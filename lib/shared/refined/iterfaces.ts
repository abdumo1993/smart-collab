// core types
type YjsID = {
  clientID: number;
  clock: number;
};

type StateVector = Map<number, number>;

// content types
interface ContentBase {
  attributes?: Record<string, any>;
}

interface StringContent extends ContentBase {
  type: "text";
  value: string;
}
interface NoContent extends ContentBase {
  type: "noContent";
  value: null;
}

interface ObjectContent extends ContentBase {
  type: "object";
  value: Record<string, YjsID>; // refer to other objects
}

interface BinaryContent extends ContentBase {
  type: "binary";
  value: Uint8Array; // Raw binary data
  encoding?: "base64" | "raw";
}
interface MarkerContent extends ContentBase {
  type: "marker";
  length: number;
}

interface GCContent extends ContentBase {
  type: "gc";
  length: number;
  ids: YjsID[];
}

type Content =
  | StringContent
  | NoContent
  | ObjectContent
  | BinaryContent
  | MarkerContent
  | GCContent;

// operation Types

interface OperationBase {
  id: YjsID;
}
interface InsertDelta extends OperationBase {
  type: "insert";
  content: Content;
  origin: YjsID;
  rightOrigin: YjsID;
}
interface DeleteDelta extends OperationBase {
  type: "delete";
  itemID: YjsID;
}
interface UpdateDelta extends OperationBase, ContentBase {
  type: "update";
  itemID: YjsID;
}
interface GCDelta extends OperationBase {
  type: "gc";
  itemIDS: YjsID[];
}

type Delta = InsertDelta | DeleteDelta | GCDelta;

// storage interfaces

interface IOperationStore {
  get(clientID: YjsID["clientID"], clock: YjsID["clock"]): Delta | undefined;
  set(clientID: YjsID["clientID"], clock: YjsID["clock"], op: Delta): void;
  delete(clientID: YjsID["clientID"], clock: YjsID["clock"]): boolean;
  getAllOps(): Delta[];
  getMissingOps(other: StateVector): Delta[];
}

interface IBufferStore {
  add(key: string, op: Delta): void;
  get(key: string): Delta[] | undefined;
  getSize(): number;
  remove(key: string): void;
}
// Document interfaces
interface IDocumentItem {
  id: YjsID;
  origin: IDocumentItem | null;
  rightOrigin: IDocumentItem | null;
  content: Content;
  deleted: boolean;
}
interface IDocStructure {
  head: IDocumentItem;
  tail: IDocumentItem;
  traverse(start: IDocumentItem, target: YjsID): IDocumentItem | null;
  createItem(
    origin: IDocumentItem,
    op: InsertDelta,
    rightOrigin: IDocumentItem
  ): IDocumentItem;
}

// opration handleres interface
interface IOperationHandler {
  apply(op: Delta): void;
  revert(op: Delta): Delta;
  // collectGarbage(): GCDelta[];
}
interface IConflictResolver {
  resolve(origin: IDocumentItem, op: InsertDelta): IDocumentItem | null;
}
interface IClient extends IOperationHandler {
  clientID: YjsID["clientID"];
  clock: YjsID["clock"];
  applyOps(ops: Delta[]): void;

}
// client conponents

interface IStateVectorManager {
  update(clientID: YjsID["clientID"], clock: YjsID["clock"]): void;
  merge(other: StateVector): void;
  get(clientID: YjsID["clientID"]): YjsID["clock"] | undefined;
  isNewOperation(op: Delta): boolean;
  getVector(): StateVector;
}

interface IHelper {
  areIdsEqual(id1: YjsID, id2: YjsID): boolean;
  isIdLess(id1: YjsID, id2: YjsID): boolean;
}

export {
  YjsID,
  StateVector,
  Content,
  Delta,
  InsertDelta,
  DeleteDelta,
  GCDelta,
  IOperationStore,
  IBufferStore,
  IDocStructure,
  IOperationHandler,
  IConflictResolver,
  IStateVectorManager,
  IDocumentItem,
  IHelper,
  IClient,
  StringContent,
};
