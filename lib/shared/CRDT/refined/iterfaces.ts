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

type Content =
  | StringContent
  | NoContent
  | ObjectContent
  | BinaryContent
  | MarkerContent;

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

type Delta = InsertDelta | DeleteDelta;

// storage interfaces

interface IOperationStore {
  get(clientID: YjsID["clientID"], clock: YjsID["clock"]): Delta | undefined;
  set(clientID: YjsID["clientID"], clock: YjsID["clock"], op: Delta): void;
  delete(clientID: YjsID["clientID"], clock: YjsID["clock"]): boolean;
  getAllOps(): IterableIterator<Delta>;
  getMissingOps(other: StateVector): Delta[];
}

interface IBufferStore {
  add(key: string, op: Delta): void;
  get(key: string): Delta[] | undefined;
  getSize(): number;
  remove(key: string): void;
}
// Document interfaces
// block that will hold IDocumentItems.
interface IDocBlock {
  id: number;
  head: IDocumentItem;
  tail: IDocumentItem;
  size: number;
}
interface IDocumentItem {
  id: YjsID;
  origin: IDocumentItem | null;
  rightOrigin: IDocumentItem | null;
  content: Content;
  deleted: boolean;
  block?: IDocBlock["id"];
}
interface IDocStructure {
  head: IDocumentItem;
  tail: IDocumentItem;
  items?: Map<string, IDocumentItem>;
  traverse(start: IDocumentItem, target: YjsID): IDocumentItem | null;
  traverseAll(callback: (item: IDocumentItem) => void);
  createItem(
    origin: IDocumentItem,
    op: InsertDelta,
    rightOrigin: IDocumentItem
  ): IDocumentItem;
  deleteItem(item: IDocumentItem): void;
}

// opration handleres interface
interface IOperationHandler {
  apply(op: Delta): Delta | undefined;
  revert(op: Delta): Delta;
  // collectGarbage(): GCDelta[];
}
interface IConflictResolver {
  resolve(origin: IDocumentItem, op: InsertDelta): IDocumentItem | null;
}
interface IClient extends IOperationHandler {
  clientID: YjsID["clientID"];
  clock: YjsID["clock"];
  applyOps(ops: Delta[]): Delta[];
}

interface IHandlerConfig {
  type: Delta["type"];
  factory: () => IOperationHandler;
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
  // deprecated methods
  // areIdsEqual(id1: YjsID, id2: YjsID): boolean;
  // isIdLess(id1: YjsID, id2: YjsID): boolean;
  stringifyYjsID(id: YjsID): string;
}

interface IGarbageCollector {
  getSafeVector(
    peerVectors: Map<YjsID["clientID"], StateVector>
  ): StateVector | undefined;
  collectGarbage(peerVectors: Map<YjsID["clientID"], StateVector>): void;
}

interface IVectorCalculator {
  getSafeVector(
    allVectors: Map<YjsID["clientID"], StateVector>
  ): StateVector | undefined;
}
interface IReferenceAnalyzer {
  isReferenced(id: YjsID): boolean;
  registerReference(source: YjsID, target: YjsID): void;
  removeReferencer(source: YjsID, targets: YjsID[]): void;
  clear(): void;
}
interface IGarbageEngine {
  collect(safeVector: StateVector, store: IOperationStore): void;
}
interface IReferencerItemManager {
  isReferencer(item: IDocumentItem): boolean;
  getReferencedItems(sourceItem: IDocumentItem): YjsID[];
}

export {
  YjsID,
  StateVector,
  Content,
  Delta,
  InsertDelta,
  DeleteDelta,
  IOperationStore,
  IBufferStore,
  IDocStructure,
  IOperationHandler,
  IConflictResolver,
  IStateVectorManager,
  IDocumentItem,
  IHelper,
  IClient,
  ContentBase,
  StringContent,
  IHandlerConfig,
  IGarbageCollector,
  IVectorCalculator,
  IReferenceAnalyzer,
  IGarbageEngine,
  IReferencerItemManager,
};
