import {
  DeleteDelta,
  Delta,
  IClient,
  IDocStructure,
  IDocumentItem,
  InsertDelta,
  IBlockItem,
  IBlockStructure,
  IBlockHandler,
  StringContent,
  IHelper,
} from "../CRDT/iterfaces";
import { ConversionError } from "./errors";
import {
  IOperationConverter,
  QDelta,
  IConvertorConfig,
  midDelta,
  midDeltaRecord,
  QdeltaType,
  IMidOpConvertor,
} from "./interfaces";

class OperationConvertor implements IOperationConverter {
  private convertors = new Map<string, IMidOpConvertor>();
  constructor(
    private doc: IDocStructure,
    private client: IClient,
    private convertorConfig: IConvertorConfig[]
  ) {
    convertorConfig.forEach(({ type, factory: conv }) => {
      this.convertors.set(type, conv());
    });
  }

  QtoCrdt(qDelta: QDelta): Delta[] {
    const raw = this.qToMidDelta(qDelta.ops);
    const deltas: Delta[] = [];
    raw.ops.forEach((elem: midDelta) => {
      const convertor = this.convertors.get(elem.type!);
      if (!convertor)
        throw new ConversionError(`No convertor for ${elem.type} operations`);

      deltas.push(...convertor.toCrdt(elem));
    });
    return deltas;
  }
  CrdttoQ(deltas: Delta[]): QDelta {
    const ops: QdeltaType[] = [];
    const qDelta: QDelta = { ops: ops };

    deltas.forEach((elem, ind) => {
      const convertor = this.convertors.get(elem.type!);
      if (!convertor)
        throw new ConversionError(`No convertor for ${elem.type} operations`);
      ops.push(...convertor.toQ(elem));
    });
    return qDelta;
  }

  private qToMidDelta(ops: QdeltaType[]): midDeltaRecord {
    try {
      if (ops.length === 1) {
        const op: midDelta = {
          type: "",
          start: 0,
          content: ops[0]["insert"],
          dlength: ops[0]["delete"],
          rlength: ops[0]["retain"],
          attributes: ops[0]["attributes"],
        };
        if (op.content) op.type = "insert";
        if (op.dlength) op.type = "delete";
        if (op.rlength) op.type = "retain";
        const midOps: midDeltaRecord = {
          ops: [op],
          currPos: 0,
        };
        return midOps;
      } else {
        // handle in pairs. one retain for location one for operation

        return Array.from(ops).reduce(
          (acc: { ops: midDelta[]; currPos: number }, _, i, arr) => {
            if (i % 2 === 0 && i + 1 < arr.length) {
              let a = arr[i]; // gives start loc
              let b = arr[i + 1]; // gives length of op or content of op
              let op: midDelta = {
                start: a["retain"]! + acc.currPos,
                dlength: b["delete"],
                rlength: b["retain"],
                content: b["insert"],
                attributes: b["attributes"],
              };
              if (op.content) op.type = "insert";
              if (op.dlength) op.type = "delete";
              if (op.rlength) op.type = "retain";
              acc.ops.push(op);
              let pChange = op.start! + (op.rlength ?? op.content?.length ?? 0);
              let nChange = op.dlength ?? 0;

              acc.currPos = pChange - nChange;

              return acc;
            }
            return acc;
          },
          { ops: [], currPos: 0 }
        );
      }
    } catch (e) {
      throw new ConversionError("OperationConvertor.qToMidDelta failed", e);
    }
  }
}

class InsertOperationConvertor implements IMidOpConvertor {
  constructor(
    private blockStruct: IBlockStructure,
    private doc: IDocStructure,
    private client: IClient,
    private helper: IHelper
  ) {}
  toCrdt(mOp: midDelta): Delta[] {
    try {
      let origin: IDocumentItem;
      let rightOrigin: IDocumentItem | null;
      const content = mOp.content!;
      const originDest = this.blockStruct.traverse(
        this.blockStruct.head,
        mOp.start!
      );
      let remaining = originDest.remaining;
      let curr = originDest.rep;
      let prev = curr;
      while (remaining > 0) {
        if (curr === originDest.rep) {
          curr.rightOrigin && (curr = curr.rightOrigin);
          continue;
        }
        // curr.content.type === "text"
        //   ? (remaining -= curr.content.value.length)
        //   : (remaining -= 1);
        curr.content.type === "text" &&
          (remaining -= curr.content.value.length);
        curr.rightOrigin && ((prev = curr), (curr = curr.rightOrigin));
        if (!curr.rightOrigin) {
          remaining = 0;
        }
      }
      // if (remaining < 0) {
      //   curr.content.type === "text" &&
      //     ((remaining += curr.content.value.length),
      //     (curr = curr.origin!),
      //     prev && (prev = prev.origin!));
      // }
      if (remaining < 0) {
        prev?.content.type === "text" &&
          ((remaining += prev?.content.value!.length),
          (curr = curr.origin!),
          prev && (prev = prev.origin!));
      }

      if (remaining === 0) {
        // origin = curr.origin!;
        origin = prev;
        rightOrigin = prev.rightOrigin;
        const op: InsertDelta = {
          id: { clientID: this.client.clientID, clock: ++this.client.clock },
          type: "insert",
          content: { type: "text", value: content },
          origin: origin.id,
          rightOrigin: rightOrigin?.id ?? this.doc.tail.id,
        };
        mOp.attributes && (op.content.attributes = mOp.attributes);
        return [op];
      } else {
        // need to devide the curr to add new item inside.
        return this.divideInsert(remaining, content, mOp.attributes, curr);
      }
    } catch (e) {
      throw new ConversionError("InsertOperationconvertor.toCrdt failed", e);
    }
    // throw new Error("Method not implemented.");
  }
  private divideInsert(
    remaining: number,
    content: string,
    attribute: StringContent["attributes"],
    curr: IDocumentItem
  ): Delta[] {
    /* TODO
        1. keep the content of curr and generate a delete op for curr.
        2. devide the content of curr at a given length.
        3. generate an insert operation for left and right of the curr's content.
        4. generate an insert operation for mid which is the new content or var content
      */
    let left: string | undefined;
    let right: string | undefined;
    let oldAttr: StringContent["attributes"] | undefined;
    const deltas: Delta[] = [];
    // 1
    const oldContent = curr.content;
    // 2
    if (oldContent.type === "text") {
      left = oldContent.value.slice(0, remaining);
      right = oldContent.value.slice(remaining);
      oldAttr = oldContent.attributes;
      //  3
    }
    const dOp: DeleteDelta = {
      type: "delete",
      id: { clientID: this.client.clientID, clock: ++this.client.clock },
      itemID: curr.id,
    };
    deltas.push(dOp);
    if (left) {
      const lOp: InsertDelta = {
        type: "insert",
        content: {
          value: left,
          type: "text",
          ...(oldAttr && {
            attributes: oldAttr,
          }),
        },
        id: { clientID: this.client.clientID, clock: ++this.client.clock },
        origin: curr.origin?.id ?? this.doc.head.id,
        rightOrigin: curr.rightOrigin?.id ?? this.doc.tail.id,
      };

      deltas.push(lOp);
    }
    const mOp: InsertDelta = {
      type: "insert",
      content: {
        value: content,
        type: "text",
        ...((oldAttr || attribute) && {
          attributes: {
            ...(oldAttr && oldAttr),
            ...(attribute && attribute),
          },
        }),
      },
      id: { clientID: this.client.clientID, clock: ++this.client.clock },
      origin: curr.origin?.id ?? this.doc.head.id,
      rightOrigin: curr.rightOrigin?.id ?? this.doc.tail.id,
    };

    deltas.push(mOp);
    if (right) {
      const rOp: InsertDelta = {
        type: "insert",
        content: {
          value: right,
          type: "text",
          ...(oldAttr && {
            attributes: oldAttr,
          }),
        },
        id: { clientID: this.client.clientID, clock: ++this.client.clock },
        origin: curr.origin?.id ?? this.doc.head.id,
        rightOrigin: curr.rightOrigin?.id ?? this.doc.tail.id,
      };

      // oldAttr && (rOp.content.attributes = oldAttr);
      deltas.push(rOp);
    }

    return deltas;
  }
  toQ(cOp: InsertDelta): QdeltaType[] {
    try {
      const ops: QdeltaType[] = [];
      const block = this.blockStruct.blocks?.get(
        this.doc.items!.get(this.helper.stringifyYjsID(cOp.id))?.block!
      );
      let start = 0;
      const left = block?.left;
      if (left) {
        let cumSum = left.size;
        let curr: IDocumentItem | null = left.rep ?? this.doc.head;
        while (
          curr &&
          this.helper.stringifyYjsID(curr.id) !==
            this.helper.stringifyYjsID(cOp.id)
        ) {
          cumSum +=
            curr?.content.type === "text" ? curr.content.value.length : 0;
          curr && (curr = curr.rightOrigin);
        }
        if (!curr)
          throw new Error("Item not found or Block logic not implemented.");
        start = cumSum;
      }

      start && ops.push({ retain: start });
      const op: QdeltaType = {
        insert: cOp.content.type === "text" ? cOp.content.value : "",
        ...(cOp.content.attributes && { attributes: cOp.content.attributes }),
      };
      ops.push(op);
      return ops;
    } catch (e) {
      throw new ConversionError("InsertOperationCovnertor.toQ failed", e);
    }
  }
}

class DeleteOperationConvertor implements IMidOpConvertor {
  constructor(
    private blockStruct: IBlockStructure,
    private doc: IDocStructure,
    private client: IClient,
    private helper: IHelper
  ) {}
  toCrdt(mOp: midDelta): Delta[] {
    // let origin: IDocumentItem;
    // let rightOrigin: IDocumentItem | null;
    try {
      const dLen = mOp.dlength!;
      const originDest = this.blockStruct.traverse(
        this.blockStruct.head,
        mOp.start!
      );
      let remaining = originDest.remaining;
      let curr = originDest.rep;
      let prev;
      while (remaining > 0) {
        if (curr === originDest.rep) {
          curr.rightOrigin && (curr = curr.rightOrigin);
          continue;
        }
        curr.content.type === "text" &&
          (remaining -= curr.content.value.length);
        curr.rightOrigin && ((prev = curr), (curr = curr.rightOrigin));
        if (!curr.rightOrigin) {
          remaining = 0;
        }
      }

      if (remaining < 0) {
        prev?.content.type === "text" &&
          ((remaining += prev?.content.value!.length),
          (curr = curr.origin!),
          prev && (prev = prev.origin!));
      }
      // if tail, no origin no deletion, no link error?
      if (!curr.rightOrigin?.rightOrigin) return [];

      return this.divideDelete(remaining, dLen, prev ?? curr);
    } catch (e) {
      throw new ConversionError("DeleteOperationConvertor.toCrdt failed", e);
    }
  }
  private divideDelete(
    remaining: number,
    len: number,
    curr: IDocumentItem
  ): Delta[] {
    const deltas: Delta[] = [];
    /* CASES
      I. remaining == 0 => rightOrigin is the item and deletion starts at the start. 
          - worry about len only.
          - rightOrigin  as rContent
          - generate delete for rightOrigin item
          - generate insert operation for content rContent [len: end]
      II. remaining > 0 => rightOrigin is the item but deletion starts at the middle
          - worry about len and remaining.
          - generate delete for rightOrigin item
          - generate insert ops for rContent[0:remaining] and rContent[remaining + len: end]
        
 */
    while (len > 0) {
      if (!remaining) {
        const right = curr.rightOrigin!;
        const oldCont = right.content;
        const dOp: DeleteDelta = {
          type: "delete",
          id: { clientID: this.client.clientID, clock: ++this.client.clock },
          itemID: right.id,
        };
        deltas.push(dOp);

        const newCont =
          right.content.type === "text" ? right.content.value.slice(len) : null;
        len -=
          oldCont.type === "text"
            ? oldCont.value.length - (newCont?.length ?? 0)
            : 0;
        if (newCont?.length || 0 > 0) {
          const iOp: InsertDelta = {
            type: "insert",
            content: {
              type: "text",
              value: newCont ?? "",
              ...(oldCont.attributes && {
                attributes: oldCont.attributes,
              }),
            },
            id: { clientID: this.client.clientID, clock: ++this.client.clock },
            origin: right.origin!.id,
            rightOrigin: right.rightOrigin!.id,
          };

          deltas.push(iOp);
        }
      } else if (remaining > 0) {
        const right = curr.rightOrigin!;
        const oldCont = right.content;

        const dOp: DeleteDelta = {
          type: "delete",
          id: { clientID: this.client.clientID, clock: ++this.client.clock },
          itemID: right.id,
        };
        deltas.push(dOp);
        const newCont1 =
          right.content.type === "text"
            ? right.content.value
                .slice(0, remaining)
                .concat(right.content.value.slice(remaining + len))
            : null;
        len -=
          oldCont.type === "text"
            ? oldCont.value.length - (newCont1?.length ?? 0)
            : 0;

        const iOp1: InsertDelta = {
          type: "insert",
          content: {
            type: "text",
            value: newCont1 ?? "",
            ...(oldCont.attributes && {
              attributes: oldCont.attributes,
            }),
          },
          id: { clientID: this.client.clientID, clock: ++this.client.clock },
          origin: right.origin!.id,
          rightOrigin: right.rightOrigin!.id,
        };

        deltas.push(iOp1);

        // const newCont2 =
        //   right.content.type === "text"
        //     ? right.content.value.slice(remaining + len)
        //     : null;
        // const iOp2: InsertDelta = {
        //   type: "insert",
        //   content: {
        //     type: "text",

        //     value: newCont2 ?? "",
        //   },
        //   id: { clientID: this.client.clientID, clock: ++this.client.clock },
        //   origin: iOp1.id,
        //   rightOrigin: right.rightOrigin!.id,
        // };

        // oldCont.attributes && (iOp2.content.attributes = oldCont.attributes);
        // deltas.push(iOp2);
      }
      remaining = 0;
      curr.rightOrigin && (curr = curr.rightOrigin);
    }
    return deltas;
  }
  toQ(cOp: DeleteDelta): QdeltaType[] {
    //

    try {
      const ops: QdeltaType[] = [];
      const block = this.blockStruct.blocks?.get(
        this.doc.items!.get(this.helper.stringifyYjsID(cOp.itemID))?.block!
      );
      let start = 0;
      let dLen = 0;
      const left = block?.left;
      if (left) {
        let cumSum = left.size;
        let curr: IDocumentItem | null = left.rep ?? this.doc.head;
        while (
          curr &&
          this.helper.stringifyYjsID(curr.id) !==
            this.helper.stringifyYjsID(cOp.itemID)
        ) {
          cumSum +=
            curr?.content.type === "text" ? curr.content.value.length : 0;
          curr && (curr = curr.rightOrigin);
        }
        if (!curr)
          throw new Error("Item not found or Block logic not implemented.");
        start = cumSum;
        dLen = curr.content.type === "text" ? curr.content.value.length : 0;
      }

      start && ops.push({ retain: start });
      const op: QdeltaType = {
        delete: dLen,
      };
      ops.push(op);
      return ops;
    } catch (e) {
      throw new ConversionError("DeleteOperationConvertor.toQ", e);
    }
  }
}

class RetainOperationConvertor implements IMidOpConvertor {
  /*
  using start find the origin.
  if start and cumsum till the end of the origin item are equal then this is the origin
  if start is at the middle of an item, use this item as the <item>
  if not then use the next item from the origin
  from the next of origin, since this is a retian or edit operations the item already exists so find the item
  from rlength, take item.content.value.slice(0, rlenght) and rlenght, end create 2 insert ops and one delete op for theitme
  add the new attributes to first selection and then 
   */
  constructor(
    private blockStruct: IBlockStructure,
    private doc: IDocStructure,
    private client: IClient
  ) {}
  toCrdt(mOp: midDelta): Delta[] {
    try {
      const rLen = mOp.rlength!;
      const originDest = this.blockStruct.traverse(
        this.blockStruct.head,
        mOp.start!
      );
      let remaining = originDest.remaining;
      let curr = originDest.rep;
      let prev;
      while (remaining > 0) {
        if (curr === originDest.rep) {
          curr.rightOrigin && (curr = curr.rightOrigin);
          continue;
        }
        curr.content.type === "text" &&
          (remaining -= curr.content.value.length);
        curr.rightOrigin && ((prev = curr), (curr = curr.rightOrigin));
        if (!curr.rightOrigin) {
          remaining = 0;
        }
      }
      if (remaining < 0) {
        prev?.content.type === "text" &&
          ((remaining += prev?.content.value!.length),
          (curr = curr.origin!),
          prev && (prev = prev.origin!));
      }
      // if tail, no origin no deletion, no link error?
      if (!curr.rightOrigin?.rightOrigin) return [];
      return this.divideRetain(remaining, rLen, prev ?? curr, mOp.attributes);
    } catch (e) {
      throw new ConversionError("RetainOperationConvertor.toCrdt failed", e);
    }
  }
  private divideRetain(
    remaining: number,
    len: number,
    curr: IDocumentItem,
    attributes: StringContent["attributes"]
  ): Delta[] {
    const deltas: Delta[] = [];
    /* CASES
      I. remaining == 0 => rightOrigin is the item and updation starts at the start. 
          - worry about len only.
          - rightOrigin  as rContent
          - generate delete for rightOrigin item
          - generate insert operation for content rContent [len: end]
      II. remaining > 0 => rightOrigin is the item but updation starts at the middle
          - worry about len and remaining.
          - generate delete for rightOrigin item
          - generate insert ops for rContent[0:remaining] and rContent[remaining + len: end]
        
 */

    while (len > 0) {
      if (!remaining) {
        const right = curr.rightOrigin!;
        const oldCont = right.content;
        const dOp: DeleteDelta = {
          type: "delete",
          id: { clientID: this.client.clientID, clock: ++this.client.clock },
          itemID: right.id,
        };
        deltas.push(dOp);

        const newCont1 =
          oldCont.type === "text" ? oldCont.value.slice(0, len) : null;
        const iOp1: InsertDelta = {
          type: "insert",
          content: {
            type: "text",
            value: newCont1 ?? "",
            ...((oldCont.attributes || attributes) && {
              attributes: {
                ...(oldCont.attributes && oldCont.attributes),
                ...(attributes && attributes),
              },
            }),
          },
          id: { clientID: this.client.clientID, clock: ++this.client.clock },
          origin: right.origin!.id,
          rightOrigin: right.rightOrigin!.id,
        };

        deltas.push(iOp1);
        const newCont2 =
          oldCont.type === "text" ? oldCont.value.slice(len) : null;
        if (newCont2?.length || 0 > 0) {
          const iOp2: InsertDelta = {
            type: "insert",
            content: {
              type: "text",
              // attributes: { ...oldCont.attributes, ...attributes },
              value: newCont2 ?? "",

              ...(oldCont.attributes && {
                attributes: oldCont.attributes,
              }),
            },
            id: { clientID: this.client.clientID, clock: ++this.client.clock },
            origin: right.origin!.id,
            rightOrigin: right.rightOrigin!.id,
          };

          deltas.push(iOp2);
        }

        len -= newCont1?.length ?? 0;
      } else if (remaining > 0) {
        const right = curr.rightOrigin!;
        const oldCont = right.content;

        const dOp: DeleteDelta = {
          type: "delete",
          id: { clientID: this.client.clientID, clock: ++this.client.clock },
          itemID: right.id,
        };
        deltas.push(dOp);
        const newCont1 =
          right.content.type === "text"
            ? right.content.value.slice(0, remaining)
            : null;
        const iOp1: InsertDelta = {
          type: "insert",
          content: {
            type: "text",
            // attributes: oldCont.attributes,
            value: newCont1 ?? "",
            ...(oldCont.attributes && {
              attributes: oldCont.attributes,
            }),
          },
          id: { clientID: this.client.clientID, clock: ++this.client.clock },
          origin: right.origin!.id,
          rightOrigin: right.rightOrigin!.id,
        };

        deltas.push(iOp1);

        const newCont2 =
          right.content.type === "text"
            ? right.content.value.slice(remaining, len + remaining)
            : null;
        if (newCont2?.length || 0 > 0) {
          const iOp2: InsertDelta = {
            type: "insert",
            content: {
              type: "text",
              ...((oldCont.attributes || attributes) && {
                attributes: {
                  ...(oldCont.attributes && oldCont.attributes),
                  ...(attributes && attributes),
                },
              }),

              value: newCont2 ?? "",
            },
            id: { clientID: this.client.clientID, clock: ++this.client.clock },
            origin: iOp1.id,
            rightOrigin: right.rightOrigin!.id,
          };
          deltas.push(iOp2);
          const newCont3 =
            right.content.type === "text"
              ? right.content.value.slice(len + remaining)
              : null;
          if (newCont3?.length || 0 > 0) {
            const iOp3: InsertDelta = {
              type: "insert",
              content: {
                type: "text",
                // attributes: oldCont.attributes,
                value: newCont3 ?? "",
                ...(oldCont.attributes && {
                  attributes: oldCont.attributes,
                }),
              },
              id: {
                clientID: this.client.clientID,
                clock: ++this.client.clock,
              },
              origin: iOp1.id,
              rightOrigin: right.rightOrigin!.id,
            };

            oldCont.attributes &&
              (iOp1.content.attributes = { ...oldCont.attributes });

            deltas.push(iOp3);
          }

          len -= newCont2?.length || 0;
        }
      }
      remaining = 0;
      curr.rightOrigin && (curr = curr.rightOrigin);
    }

    return deltas;
  }
  toQ(cOp: Delta): QdeltaType[] {
    throw new ConversionError("No Retain Operation in CRDT");
  }
}

export {
  OperationConvertor,
  InsertOperationConvertor,
  DeleteOperationConvertor,
  RetainOperationConvertor,
};

/**
 *  refactor(CRDT): modularize operation conversion and traversal logic
    
        - BlockStructure: Introduced for efficient traversal across document structures, enabling localized and optimized block-level operations.
        - OperationConvertor: Implements IOperationConverter to bridge Quill deltas and internal CRDT operations.
        - InsertOperationConvertor | DeleteOperationConvertor | RetainOperationConvertor:
            Specific converters implementing IMidOpConvertor, responsible for transforming mid-level deltas into CRDT-compatible operations.
        - IOperationConverter: Defines interfaces for bidirectional conversion between Quill and CRDT deltas.
        - IMidOpConvertor: Abstracts conversion of intermediate operations into low-level CRDT representations and vice versa.
        - Central Registry (operationConvertor): Dynamically registers operation converters based on operation type, enabling scalable extension.
 */

/*
feature(Error handling): streamline Exception handling in Conversion and CRDT logic
    - ConversionError: Introduced to streamline all predictable Errors that occur in conversion logic
    - CRDTError: Introduced to streamline all predictable Errors that occur in CRDT logic
*/
