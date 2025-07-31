import { persistantState } from "@lib/business-logic";
import {
  IDocStructure,
  IBlockStructure,
  YjsID,
  IDocumentItem,
  IBlockItem,
  IHelper,
  Content,
  Delta,
  StateVector,
} from "@lib/business-logic/CRDT/iterfaces";
import {
  Helper,
  DocStructure,
  BlockStructure,
} from "@lib/business-logic/CRDT/classes";
import { ISerializableDocumentData } from "./indexeddb-service";

interface ISerializableYjsID {
  clientID: string;
  clock: number;
}

interface ISerializableContent {
  type: string;
  value: any; // Can be string, null, Record<string, YjsID>, Uint8Array
  attributes?: Record<string, any>;
  length?: number; // For MarkerContent
  encoding?: "base64" | "raw"; // For BinaryContent
}

interface ISerializableDocumentItem {
  id: ISerializableYjsID;
  originId: ISerializableYjsID | null;
  rightOriginId: ISerializableYjsID | null;
  content: ISerializableContent;
  deleted: boolean;
  blockId?: number;
}

interface ISerializableBlockItem {
  id: number;
  leftId: number | null;
  rightId: number | null;
  repId?: ISerializableYjsID;
  size: number;
  deleted: boolean;
}

interface ISerializableDocStructure {
  headId: ISerializableYjsID;
  tailId: ISerializableYjsID;
  items: ISerializableDocumentItem[];
}

interface ISerializableBlockStructure {
  headId: number;
  tailId: number;
  blocks: ISerializableBlockItem[];
}

interface ICRDTSerialiser {
  /**
   * Serializes the given persistantState (from getPersistantStates()) into a format
   * that can be saved to IndexedDB (i.e., plain objects, arrays, and primitives).
   * Only provide the property names and their serialized forms.
   *
   * @param state - The persistantState object to serialize.
   * @returns An object suitable for IndexedDB storage.
   */
  serialise(state: persistantState): ISerializableDocumentData["crdtState"];

  /**
   * Deserializes the given object (from IndexedDB) back into the persistantState format.
   * Converts arrays of entries back into Maps where appropriate.
   *
   * @param data - The object loaded from IndexedDB.
   * @returns The deserialized persistantState object.
   */
  deserialise(data: ISerializableDocumentData["crdtState"]): persistantState;
}

export class CRDTSerialiser implements ICRDTSerialiser {
  private helper: IHelper = new Helper();

  serialise(state: persistantState): ISerializableDocumentData["crdtState"] {
    // const serializableDocStructure = this._serializeDocStructure(
    //   state.docStructure
    // );
    // const serializableBlockStructure = this._serializeBlockStructure(
    //   state.blockStructure
    // );

    return {
      storedOperations: state.storedOperations,
      rightBufferedOps: Array.from(state.rightBufferedOps.entries()),
      originBufferedOps: Array.from(state.originBufferedOps.entries()),
      deletionBufferedOps: Array.from(state.deletionBufferedOps.entries()),
      gcBufferedOps: state.gcBufferedOps
        ? Array.from(state.gcBufferedOps.entries())
        : undefined,
      missingOps: state.missingOps,
      clientID: state.clientID,
      clock: state.clock,
    };
  }

  deserialise(data: ISerializableDocumentData["crdtState"]): persistantState {
    return {
      storedOperations: data.storedOperations,
      rightBufferedOps: new Map(data.rightBufferedOps),
      originBufferedOps: new Map(data.originBufferedOps),
      deletionBufferedOps: new Map(data.deletionBufferedOps),
      gcBufferedOps: data.gcBufferedOps
        ? new Map(data.gcBufferedOps)
        : undefined,
      missingOps: data.missingOps,
      clientID: data.clientID,
      clock: data.clock,
    };
  }
  /* 
private _serializeDocStructure(
  docStructure: IDocStructure
): ISerializableDocStructure {
    const serializableDocItems: ISerializableDocumentItem[] = [];
    docStructure.items?.forEach((item) => {
      serializableDocItems.push({
        id: item.id,
        originId: item.origin ? item.origin.id : null,
        rightOriginId: item.rightOrigin ? item.rightOrigin.id : null,
        content: item.content as ISerializableContent,
        deleted: item.deleted,
        blockId: item.block,
      });
    });
    return {
      headId: docStructure.head.id,
      tailId: docStructure.tail.id,
      items: serializableDocItems,
    };
  }

  private _deserializeDocStructure(
    serializableDocStructure: ISerializableDocStructure,
    deserializedDocItems: Map<string, IDocumentItem>
  ): DocStructure {
    const deserializedDocStructure = new DocStructure(this.helper);
    deserializedDocStructure.head.id = serializableDocStructure.headId;

    deserializedDocStructure.tail.id = serializableDocStructure.tailId;

    // First pass: Create all IDocumentItem objects and store them in a map by their stringified ID.
    // This is necessary because of circular references (origin and rightOrigin refer to other IDocumentItem objects).
    // We create the objects first without linking them, then link them in a second pass.
    serializableDocStructure.items.forEach((sItem) => {
      const item: IDocumentItem = {
        id: sItem.id,
        origin: null,
        rightOrigin: null,
        content: sItem.content as Content,
        deleted: sItem.deleted,
        block: sItem.blockId,
      };
      deserializedDocItems.set(this.helper.stringifyYjsID(sItem.id), item);
    });

    // Second pass: Link IDocumentItem objects using the IDs stored in the first pass.
    // This resolves the circular references by ensuring all referenced items exist in the map.
    serializableDocStructure.items.forEach((sItem) => {
      const item = deserializedDocItems.get(
        this.helper.stringifyYjsID(sItem.id)
      )!;
      if (sItem.originId) {
        item.origin =
          deserializedDocItems.get(
            this.helper.stringifyYjsID(sItem.originId)
          ) || null;
      }
      if (
        sItem.originId &&
        this.helper.stringifyYjsID(sItem.originId) ===
          this.helper.stringifyYjsID(deserializedDocStructure.head.id)
      ) {
        item.origin = deserializedDocStructure.head;
        deserializedDocStructure.head.rightOrigin = item;
      }

      if (sItem.rightOriginId) {
        item.rightOrigin =
          deserializedDocItems.get(
            this.helper.stringifyYjsID(sItem.rightOriginId)
          ) || null;
      }

      if (
        sItem.rightOriginId &&
        this.helper.stringifyYjsID(sItem.rightOriginId) ===
          this.helper.stringifyYjsID(deserializedDocStructure.tail.id)
      ) {
        item.rightOrigin = deserializedDocStructure.tail;
        deserializedDocStructure.tail.origin = item;
      }
    });

    deserializedDocStructure.items = deserializedDocItems;
    return deserializedDocStructure;
  }

  private _serializeBlockStructure(
    blockStructure: IBlockStructure
  ): ISerializableBlockStructure {
    const serializableBlockItems: ISerializableBlockItem[] = [];
    blockStructure.blocks?.forEach((block) => {
      serializableBlockItems.push({
        id: block.id,
        leftId: block.left ? block.left.id : null,
        rightId: block.right ? block.right.id : null,
        repId: block.rep ? block.rep.id : undefined,
        size: block.size,
        deleted: block.deleted,
      });
    });

    return {
      headId: blockStructure.head.id,
      tailId: blockStructure.tail.id,
      blocks: serializableBlockItems,
    };
  }

  private _deserializeBlockStructure(
    serializableBlockStructure: ISerializableBlockStructure,
    deserializedDocItems: Map<string, IDocumentItem>,
    doc: IDocStructure
  ): BlockStructure {
    const deserializedBlockItems = new Map<number, IBlockItem>();

    const deserializedBlockStructure = new BlockStructure(doc); // Temporarily pass null, will be set correctly below
    deserializedBlockStructure.head.id = serializableBlockStructure.headId;

    deserializedBlockStructure.tail.id = serializableBlockStructure.tailId;

    // First pass: Create all IBlockItem objects and store them in a map by their ID.
    // This handles potential circular references within the block structure (left and right refer to other IBlockItem objects).
    console.log("blocks: ", serializableBlockStructure.blocks);
    serializableBlockStructure.blocks.forEach((sBlock) => {
      const block: IBlockItem = {
        id: sBlock.id,
        left: null,
        right: null,
        rep: sBlock.repId
          ? deserializedDocItems.get(this.helper.stringifyYjsID(sBlock.repId))
          : undefined,
        size: sBlock.size,
        deleted: sBlock.deleted,
      };
      deserializedBlockItems.set(sBlock.id, block);
    });

    // Second pass: Link IBlockItem objects using the IDs stored in the first pass.
    // This resolves the circular references by ensuring all referenced items exist in the map.
    serializableBlockStructure.blocks.forEach((sBlock) => {
      const block = deserializedBlockItems.get(sBlock.id)!;
      if (sBlock.leftId !== null) {
        block.left = deserializedBlockItems.get(sBlock.leftId) || null;
      }
      
      if (sBlock.rightId !== null) {
        block.right = deserializedBlockItems.get(sBlock.rightId) || null;
      }
      if (
        sBlock.leftId &&
        sBlock.leftId === serializableBlockStructure.headId
      ) {
        block.left = deserializedBlockStructure.head;
        deserializedBlockStructure.head.right = block;
      }
      
      if (
        sBlock.rightId &&
        sBlock.rightId === serializableBlockStructure.tailId
      ) {
        block.right = deserializedBlockStructure.tail;
        deserializedBlockStructure.tail.left = block;
      }
    });
    
    deserializedBlockStructure.blocks = deserializedBlockItems;
    return deserializedBlockStructure;
  }
  */
}

export const crdtSerialiser = new CRDTSerialiser();

export type {
  ISerializableBlockItem,
  ISerializableBlockStructure,
  ISerializableContent,
  ISerializableDocStructure,
  ISerializableDocumentItem,
};
