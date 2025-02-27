type YjsID = {
  clientID: number;
  clock: number;
};

type StateVector = Map<number, number>;

type Content =
  | StringContent
  | ObjectContent
  | BinaryContent
  | MarkerContent
  | GCContent
  | NoContent;

interface StringContent {
  type: "text";
  value: string; // The actual characters
  attributes?: {
    // Formatting metadata
    [key: string]: any; // e.g., { bold: true, color: '#ff0000' }
  };
}

// content for head and tail. can work as an identifier for them
interface NoContent {
  type: "noContent";
  value: null;
  attributes?: {
    [key: string]: any;
  };
}

interface ObjectContent {
  type: "object";
  value: {
    [key: string]: YjsID; // References to other Items
  };
}

interface BinaryContent {
  type: "binary";
  value: Uint8Array; // Raw binary data
  encoding?: "base64" | "raw";
}

interface MarkerContent {
  type: "marker";
  length: number; // Affected character count
  attributes: {
    // Formatting changes
    [key: string]: any;
  };
}

interface GCContent {
  type: "gc";
  length: number; // Number of tombstoned items
  ids: YjsID[]; // References to deleted items
}

interface InsertDelta {
  type: "insert";
  id: YjsID;
  content: Content;
  attributes?: Record<string, any>;
  origin: YjsID;
  rightOrigin: YjsID;
}

interface DeleteDelta {
  type: "delete";
  id: YjsID;
  itemID: YjsID;
}

interface GCDelta {
  type: "gc";
  id: YjsID;
  itemIDs: YjsID[]; // IDs of items to be garbage collected
}

// this is the type of the operations that are stored in the store
type Delta = InsertDelta | DeleteDelta | GCDelta;

type update = {
  stateVector: StateVector;
  deltas: Delta[];
};

interface IItem {
  id: YjsID;
  origin: IItem | null;
  rightOrigin: IItem | null;
  content: Content;
  deleted: boolean;
}
// store is a map of clientID to an array of objects where the objects are operations and their index is the clock
interface IIYDoc {
  head: IItem;
  tail: IItem;

  insertion(op: Delta): Delta;
  deletion(op: DeleteDelta): Delta;
  conflictResolution(
    origin: IItem,
    op: InsertDelta,
    rightOrigin: YjsID
  ): IItem[];
  garbageCollect(op: GCDelta): Delta;

  //   deleteItem(item: Item): Item;
  //   updateItem(item: Item): Item;
  //   getItem(id: YjsID): Item;
  //   getItems(): Item[];
}


interface IHelper {
  traversor(node: IItem, target: IItem["id"]): IItem | null;
  // mapEqual<T, U>(map1: Map<T, U>, map2: Map<T,U>): boolean;
  // mapLessOrEqual<T, U>(map1: Map<T,U>, map2: Map<T,U>): boolean;
  deltaToItem(op: InsertDelta, origin: IItem, rightOrigin: IItem): IItem;

  areYjsIDsEqual(id1: YjsID, id2: YjsID): boolean;
  areYjsIDsLessOrEqual(id1: YjsID, id2: YjsID): boolean;
}
interface IYDoc extends IIYDoc, IHelper {};

interface IClient {
  clientID: number;
  clock: number;
  stateVector: StateVector;
  YDoc: IYDoc;
  oBuffer: Map<string, Delta[]>;
  rBuffer: Map<string, Delta[]>;
  tBuffer: Map<string, Delta>;
  store: Map<IItem["id"]["clientID"], Map<YjsID["clock"], Delta>>;
  gcBuffer: Map<string, Delta>; // Buffer for GC operations

  applyOperation(delta: Delta[]): void;
  saveToStore(op: Delta): Delta;
  // addToBuffer(buffer: Map<string, Delta[] | Delta>, op: Delta): Delta;
  addToOBuffer(op: InsertDelta): void;

  addToRBuffer(op: InsertDelta): void;

  addToTBuffer(op: DeleteDelta): void;

  addToGCBuffer(op: GCDelta): void;

  collectGarbage(): GCDelta[];

  // delete(item: Item): void;
  // update(item: Item): void;
  // getItem(id: YjsID): Item;
  // getItems(): Item[];
}

export {
  YjsID,
  StateVector,
  Delta,
  InsertDelta,
  DeleteDelta,
  Content,
  IItem,
  IClient,
  IHelper,
  IYDoc,
  GCContent,
  GCDelta,
  StringContent
};
