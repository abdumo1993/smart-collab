import {
  YjsID,
  StateVector,
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
  IHandlerConfig,
  IGarbageCollector,
  IVectorCalculator,
  IReferenceAnalyzer,
  IGarbageEngine,
  IReferencerItemManager,
} from "./iterfaces";

// implement buffers
class BufferStore implements IBufferStore {
  constructor(private buffer: Map<string, Delta[]> = new Map()) {}
  getSize(): number {
    return this.buffer.size;
  }
  add(key: string, op: Delta): void {
    const existing = this.buffer.get(key) || [];
    existing.push(op);
    this.buffer.set(key, existing);
  }
  get(key: string): Delta[] | undefined {
    return this.buffer.get(key);
  }
  remove(key: string): void {
    this.buffer.delete(key);
  }
}

// implement storemanager
class Store implements IOperationStore {
  constructor(
    protected store: Map<
      YjsID["clientID"],
      Map<YjsID["clock"], Delta>
    > = new Map()
  ) {}
  getMissingOps(other: StateVector): Delta[] {
    const missingOps: Delta[] = [];

    this.store.forEach((clockMap, clientID) => {
      const theirClock = other.get(clientID) ?? 0;

      clockMap.forEach((op, clock) => {
        if (clock > theirClock) {
          missingOps.push(op);
        }
      });
    });

    return missingOps;
  }
  get(clientID: YjsID["clientID"], clock: YjsID["clock"]): Delta | undefined {
    return this.store.get(clientID)?.get(clock);
  }
  set(clientID: YjsID["clientID"], clock: YjsID["clock"], op: Delta): void {
    if (!this.store.has(clientID)) {
      this.store.set(clientID, new Map());
    }
    this.store.get(clientID)!.set(clock, op);
  }
  delete(clientID: YjsID["clientID"], clock: YjsID["clock"]): boolean {
    return this.store.get(clientID)?.delete(clock) ?? false;
  }
  *getAllOps(): IterableIterator<Delta> {
    for (const [clientID, clockMap] of this.store) {
      for (const [clock, op] of clockMap) {
        yield op;
      }
    }
  }
}

// async getAllOps()
class asyncStore extends Store {
  private ops: Delta[] = [];
  private finished: boolean = false;
  constructor(private batchSize: number = 100) {
    super();
  }

  public *getAllOpsIterator(): IterableIterator<Delta> {}
}

// implement operatonsHandlers
class InsertOperationHandler implements IOperationHandler {
  constructor(
    private document: IDocStructure,
    private conflictResolver: IConflictResolver,
    private store: IOperationStore,
    private stateVectore: IStateVectorManager,
    private oBuffer: IBufferStore,
    private rBuffer: IBufferStore,
    private helper: IHelper
  ) {}
  apply(op: InsertDelta): InsertDelta | undefined {
    if (!this.stateVectore.isNewOperation(op)) return;
    const origin = this.document.traverse(this.document.head, op.origin);
    if (!origin) {
      this.oBuffer.add(this.helper.stringifyYjsID(op.origin), op);
      return;
    }
    const item: IDocumentItem | null = this.conflictResolver.resolve(
      origin,
      op
    );
    if (!item) {
      this.rBuffer.add(this.helper.stringifyYjsID(op.rightOrigin), op);
      return;
    }
    this.store.set(item.id.clientID, item.id.clock, op);
    this.stateVectore.update(op.id.clientID, op.id.clock);
    const newOP = { ...op };
    newOP.origin = item.origin!.id;
    newOP.rightOrigin = item.rightOrigin!.id;
    return newOP;
  }
  revert(op: Delta): Delta {
    throw new Error("Method not implemented.");
  }
}

class DeleteOperationHandler implements IOperationHandler {
  constructor(
    private document: IDocStructure,
    private store: IOperationStore,
    private helper: IHelper,
    private stateVectore: IStateVectorManager,
    private buffer: IBufferStore
  ) {}
  apply(op: DeleteDelta): Delta | undefined {
    if (!this.stateVectore.isNewOperation(op)) return;
    const item = this.document.traverse(this.document.head, op.itemID);
    if (!item) {
      this.buffer.add(this.helper.stringifyYjsID(op.itemID), op);
      return;
    }
    item.deleted = true;
    this.store.set(op.id.clientID, op.id.clock, op);
    this.stateVectore.update(op.id.clientID, op.id.clock);
  }
  revert(op: Delta): Delta {
    throw new Error("Method not implemented.");
  }
}

// conflict handler
class ConflictResolver implements IConflictResolver {
  constructor(private document: IDocStructure) {}
  // happens only on insert as update is modeled as delete -> insert ops
  resolve(origin: IDocumentItem, op: InsertDelta): IDocumentItem | null {
    let curr: IDocumentItem | null = origin;
    let trueOrigin = origin;
    let actualRightOrigin: IDocumentItem | null = null;
    while (curr && !this.areIdsEqual(curr.id, op.rightOrigin)) {
      if (this.isIdLess(curr.id, op.id)) {
        trueOrigin = curr;
      }
      curr = curr.rightOrigin;
    }
    if (!curr || !this.areIdsEqual(curr.id, op.rightOrigin)) {
      return null;
    }

    actualRightOrigin = trueOrigin.rightOrigin;
    const newItem = this.document.createItem(
      trueOrigin,
      op,
      actualRightOrigin!
    );
    trueOrigin.rightOrigin = newItem;
    actualRightOrigin!.origin = newItem;
    return newItem;
  }

  private areIdsEqual(a: YjsID, b: YjsID): boolean {
    return a.clientID === b.clientID && a.clock === b.clock;
  }

  private isIdLess(a: YjsID, b: YjsID): boolean {
    return (
      a.clientID < b.clientID ||
      (a.clientID === b.clientID && a.clock < b.clock)
    );
  }
}

// implement StateVector classes
class StateVectorManager implements IStateVectorManager {
  constructor(private stateVector: StateVector = new Map()) {}
  getVector(): StateVector {
    return this.stateVector;
  }

  get(clientID: YjsID["clientID"]): YjsID["clock"] | undefined {
    return this.stateVector.get(clientID);
  }

  update(clientID: YjsID["clientID"], clock: YjsID["clock"]): void {
    const current = this.stateVector.get(clientID) || 0;
    if (clock > current) {
      this.stateVector.set(clientID, clock);
    }
  }
  merge(other: StateVector): void {
    other.forEach((clock, clientID) => {
      const current = this.stateVector.get(clientID) || 0;
      if (clock > current) {
        this.stateVector.set(clientID, clock);
      }
    });
  }
  isNewOperation(op: Delta): boolean {
    const current = this.stateVector.get(op.id.clientID) || 0;
    return op.id.clock > current;
  }
}

// implement client class

class Client implements IClient {
  private operationHandlers = new Map<string, IOperationHandler>();
  constructor(
    public clientID: number,
    public clock: number,
    // private document: IDocStructure,
    private stateVector: IStateVectorManager,
    // private store: IOperationStore,
    private oBuffer: IBufferStore,
    private rBuffer: IBufferStore,
    private tBuffer: IBufferStore,
    private helper: IHelper,
    // private conflictResolver: IConflictResolver,
    private handlerConfigs: IHandlerConfig[]
  ) {
    this.registerOperationHandlers(this.handlerConfigs);
  }

  applyOps(ops: Delta[]): Delta[] {
    const items: Delta[] = [];
    while (ops.length > 0) {
      const op = ops.shift()!;
      if (!this.stateVector.isNewOperation(op)) {
        continue;
      }
      const oDependent = this.oBuffer.get(this.helper.stringifyYjsID(op.id));
      const rDependent = this.rBuffer.get(this.helper.stringifyYjsID(op.id));
      const tDependent = this.tBuffer.get(this.helper.stringifyYjsID(op.id));

      try {
        let newOp = this.apply(op);
        newOp ? items.push(newOp) : items.push(op);
      } catch (e) {
        console.log(e);
      }
      oDependent &&
        (ops.push(...oDependent!),
        this.oBuffer.remove(this.helper.stringifyYjsID(op.id)));
      rDependent &&
        (ops.push(...rDependent!),
        this.rBuffer.remove(this.helper.stringifyYjsID(op.id)));
      tDependent &&
        (ops.push(...tDependent),
        this.tBuffer.remove(this.helper.stringifyYjsID(op.id)));
    }
    return items;
  }
  apply(op: Delta): Delta | undefined {
    const handler = this.operationHandlers.get(op.type);
    if (!handler) throw new Error(`No handler for ${op.type} operations`);
    return handler.apply(op);
  }
  revert(op: Delta): Delta {
    throw new Error("Method not implemented.");
  }
  private registerOperationHandlers(handlerConfigs: IHandlerConfig[]): void {
    // better OC principle
    handlerConfigs.forEach(({ type, factory }) => {
      this.operationHandlers.set(type, factory());
    });
    // this.operationHandlers.set(
    //   "insert",
    //   new InsertOperationHandler(
    //     this.document,
    //     this.conflictResolver,
    //     this.store,
    //     this.stateVector,
    //     this.oBuffer,
    //     this.rBuffer
    //   )
    // );
    // // other handlers here

    // this.operationHandlers.set(
    //   "delete",
    //   new DeleteOperationHandler(
    //     this.document,
    //     this.store,
    //     this.stateVector,
    //     this.tBuffer
    //   )
    // );
  }
}
// implement document classes

class DocStructure implements IDocStructure {
  head: IDocumentItem;
  tail: IDocumentItem;
  constructor() {
    this.head = this.createSentinel(
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      null,
      null
    );
    this.tail = this.createSentinel(
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      null,
      null
    );
    this.head.rightOrigin = this.tail;
    this.tail.origin = this.head;
  }
  traverseAll(callback: (item: IDocumentItem) => void) {
    let curr: IDocumentItem | null = this.head;
    while (curr) {
      callback(curr);
      curr = curr.rightOrigin;
    }
  }
  traverse(start: IDocumentItem, target: YjsID): IDocumentItem | null {
    let current: IDocumentItem | null = start;
    while (current) {
      if (this.areIdsEqual(current.id, target)) return current;
      current = current.rightOrigin;
    }
    return null;
  }

  private areIdsEqual(a: YjsID, b: YjsID): boolean {
    return a.clientID === b.clientID && a.clock === b.clock;
  }

  createItem(
    origin: IDocumentItem,
    op: InsertDelta,
    rightOrigin: IDocumentItem
  ): IDocumentItem {
    return {
      id: op.id,
      origin,
      rightOrigin,
      content: op.content,
      deleted: false,
    };
  }

  private createSentinel(
    clientID: YjsID["clientID"],
    clock: YjsID["clientID"],
    origin: IDocumentItem | null,
    rightOrigin: IDocumentItem | null
  ): IDocumentItem {
    return {
      id: { clientID: clientID, clock: clock },
      origin: origin,
      rightOrigin: rightOrigin,
      content: { type: "noContent", value: null },
      deleted: false,
    };
  }
}

class Helper implements IHelper {
  // areIdsEqual(id1: YjsID, id2: YjsID): boolean {
  //   return id1.clientID === id2.clientID && id1.clock === id2.clock;
  // }
  // isIdLess(id1: YjsID, id2: YjsID): boolean {
  //   return (
  //     id1.clientID < id2.clientID ||
  //     (id1.clientID === id2.clientID && id1.clock < id2.clock)
  //   );
  // }
  stringifyYjsID(id: YjsID): string {
    return `clientID: ${id.clientID}, clock: ${id.clock}`;
  }
}

// const yjs1 = new DocStructure();
// const sv1 = new StateVectorManager();
// const st1 = new Store();
// const c1 = new Client(
//   1,
//   0,
//   yjs1,
//   sv1,
//   st1,
//   new BufferStore(),
//   new BufferStore(),
//   new BufferStore(),
//   new ConflictResolver(yjs1, new Helper())
// );

// Garbage Collection logic raw. real one is GGarbage...
class GarbageCollectorDeprecated implements IGarbageCollector {
  private peerVectors: Map<YjsID["clientID"], StateVector>;
  private safeVector: StateVector;
  // accounting for current client
  private noOfClients: number = 1;

  constructor(
    private store: IOperationStore,
    private document: IDocStructure,
    private clientID: YjsID["clientID"],
    private stateVector: IStateVectorManager
  ) {}
  getSafeVector(): StateVector | undefined {
    // if some clients are not accounted
    if (this.noOfClients > this.peerVectors.size) return;
    // start with the current value of the current client.
    this.peerVectors.set(this.clientID, this.stateVector.getVector());

    this.peerVectors.forEach((clientVector) =>
      clientVector.forEach((clock, id) => {
        const curr = this.safeVector.get(id) ?? Infinity;
        if (clock < curr) {
          this.safeVector.set(id, clock);
        }
      })
    );
    return this.safeVector;
  }
  collectGarbage(): void {
    // travers and identify items to be collected and collect them as well as operations.
    this.document.traverseAll((item) => {
      if (!this.shouldCollect(item) && this.isReferenced(item)) return;
      const origin: IDocumentItem = item.origin!;
      const rightOrigin: IDocumentItem = item.rightOrigin!;

      // unlink from the doc
      item.origin = null;
      item.rightOrigin = null;
      // link the rest of the doc
      origin.rightOrigin = rightOrigin;
      rightOrigin.origin = origin;
    });

    // collect operatons as well.
    // this is inefficient
    [...this.store.getAllOps()].forEach((op: Delta) => {
      const { clientID, clock } = op.id;
      const SAFETY_MARGIN = 1;
      if ((this.safeVector.get(clientID) ?? 0) + SAFETY_MARGIN >= clock) {
        // (this.safeVector.get(clientID) ?? 0) >= clock &&
        this.store.delete(clientID, clock);
      }
    });
  }

  private shouldCollect(item: IDocumentItem): boolean {
    return (
      item.deleted &&
      (this.safeVector.get(item.id.clientID) ?? 0) >= item.id.clock
    );
  }

  // In GCOperationHandler
  private isReferenced(item: IDocumentItem): boolean {
    // Check if any existing items reference this one
    let hasReferences = false;
    this.document.traverseAll((current) => {
      if (
        current.origin?.id === item.id ||
        current.rightOrigin?.id === item.id ||
        (current.content.type === "object" &&
          Object.values(current.content.value).some(
            (id) =>
              id.clientID === item.id.clientID && id.clock === item.id.clock
          ))
      ) {
        hasReferences = true;
      }
    });
    return hasReferences;
  }
}

class GarbageCollector implements IGarbageCollector {
  public noOfClients: number = 0;
  constructor(
    private safeVectorCalculator: IVectorCalculator,
    private engine: IGarbageEngine,
    private store: IOperationStore
  ) {}
  getSafeVector(
    peerVectors: Map<YjsID["clientID"], StateVector>
  ): StateVector | undefined {
    // if some clients are not accounted
    if (this.noOfClients > peerVectors.size) return;
    return this.safeVectorCalculator.getSafeVector(peerVectors);
  }
  collectGarbage(peerVectors: Map<YjsID["clientID"], StateVector>): void {
    const safeVector = this.getSafeVector(peerVectors);
    if (!safeVector) return;
    this.engine.collect(this.getSafeVector(peerVectors)!, this.store);
  }
}
class MinVectorCalculator implements IVectorCalculator {
  private minVector: StateVector = new Map();
  getSafeVector(
    allVectors: Map<YjsID["clientID"], StateVector>
  ): StateVector | undefined {
    if (!allVectors.size) return;
    allVectors.forEach((vector, clientID) => {
      !this.minVector.size && (this.minVector = vector);
      vector.forEach((clock, id) => {
        const curr = this.minVector.get(id) ?? Number.MAX_SAFE_INTEGER;
        if (clock < curr) this.minVector.set(id, clock);
      });
    });
    return this.minVector;
  }
}

class GraphReferenceAnalyzer implements IReferenceAnalyzer {
  private references = new Map<string, Set<string>>();
  constructor(private helper: IHelper) {}
  // clear(): void {
  //   throw new Error("Method not implemented.");
  // }
  clear(): boolean {
    this.references.clear();
    return this.references.size == 0;
  }
  isReferenced(id: YjsID): boolean {
    return this.references.has(this.helper.stringifyYjsID(id));
  }
  // saves referenced -> to list of items that references it.
  registerReference(source: YjsID, target: YjsID): void {
    const srcKey = this.helper.stringifyYjsID(source);
    const trgtKey = this.helper.stringifyYjsID(target);
    if (!this.references.has(trgtKey)) {
      this.references.set(trgtKey, new Set());
    }
    this.references.get(trgtKey)!.add(srcKey);
  }

  removeReferencer(source: YjsID, targets: YjsID[]): void {
    const sourceKey = this.helper.stringifyYjsID(source);
    targets.forEach((target) => {
      const targetKey = this.helper.stringifyYjsID(target);
      const referenceSet = this.references.get(targetKey);
      referenceSet?.has(sourceKey) && referenceSet.delete(sourceKey);
      referenceSet?.size === 0 && this.references.delete(targetKey);
    });
  }
}

class IncrementalGC implements IGarbageEngine {
  private phase: "mark" | "sweep" | "idle" = "idle";
  private cursor: IDocumentItem | null = null;
  private markedItems = new Set<IDocumentItem>(); // Store items directly
  // private referencedIds = new Set<string>();

  constructor(
    private document: IDocStructure,
    private referenceAnalyser: IReferenceAnalyzer,
    private referencerItemManager: IReferencerItemManager,
    private batchSize: number = 100
  ) {}

  collect(safeVector: StateVector, store: IOperationStore): void {
    if (this.phase === "idle") {
      this.phase = "mark";
      this.cursor = this.document.head;
      // this.referenceAnalyser.clear();
    }
    this.processChunk();
    this.processOpChunked(safeVector, store, store.getAllOps());
  }
  // this needs a change

  private processOpChunked(
    safeVector: StateVector,
    store: IOperationStore,
    opsIterator: IterableIterator<Delta>
  ) {
    let processed = 0;
    let op;
    while (processed < this.batchSize) {
      op = opsIterator.next();
      if (op.done) break;
      const { clientID, clock } = op!.value.id;
      const SAFETY_MARGIN = 1;
      if ((safeVector.get(clientID) ?? 0) + SAFETY_MARGIN >= clock) {
        // (this.safeVector.get(clientID) ?? 0) >= clock &&
        store.delete(clientID, clock);
      }
      processed++;
    }

    !op?.done &&
      setTimeout(
        () => this.processOpChunked(safeVector, store, opsIterator),
        0
      );
  }

  private processChunk() {
    let processed = 0;

    if (this.phase === "mark") {
      while (this.cursor && processed < this.batchSize) {
        this.processMarkPhase(this.cursor);
        this.cursor = this.cursor.rightOrigin;
        processed++;
      }
    } else if (this.phase === "sweep") {
      const iterator = this.markedItems.values();

      while (processed < this.batchSize) {
        const op = iterator.next();
        if (!op.done) break;
        this.removeItemSafely(op.value);
        this.markedItems.delete(op.value);
        processed++;
      }
    }

    this.handlePhaseTransition();

    if (this.phase !== "idle") {
      requestIdleCallback(() => this.processChunk());
    }
  }

  private processMarkPhase(item: IDocumentItem) {
    // Collect references from object content
    if (this.referencerItemManager.isReferencer(item)) {
      this.referencerItemManager.getReferencedItems(item).forEach((id) => {
        this.referenceAnalyser.registerReference(item.id, id);
      });
    }
    // need for refactoring
    // if (item.content.type === "object") {
    //   Object.values(item.content.value).forEach((id) => {
    //     this.referenceAnalyser.registerReference(item.id, id);
    //     // this.referencedIds.add(this.helper.stringifyYjsID(id));
    //   });
    // }

    // Check if item should be marked
    // const itemKey = this.helper.stringifyYjsID(item.id);
    if (item.deleted && !this.referenceAnalyser.isReferenced(item.id)) {
      this.markedItems.add(item);
    }
  }

  private removeItemSafely(item: IDocumentItem): void {
    // if the item is head or tail then ignore.
    if (!item.origin || !item.rightOrigin) return;
    // link neighbor links bypassing item.
    const origin = item.origin;
    const rightOrigin = item.rightOrigin;
    origin!.rightOrigin = rightOrigin;
    rightOrigin!.origin = origin;
    // unlink the item
    item.origin = null;
    item.rightOrigin = null;
    // remove item from values of referenced items.
    let targets: YjsID[] = [];
    if (this.referencerItemManager.isReferencer(item)) {
      targets = this.referencerItemManager.getReferencedItems(item);
    }
    // item.content.type === "object" &&
    //   Object.values(item.content.value).forEach((value) => {
    //     targets.push(value);
    //   });
    targets.length && this.referenceAnalyser.removeReferencer(item.id, targets);

    // Clean up handled by link adjustments - no explicit deletion needed
  }

  private handlePhaseTransition() {
    if (!this.cursor && this.phase === "mark") {
      this.phase = "sweep";
    } else if (this.markedItems.size === 0 && this.phase === "sweep") {
      this.phase = "idle";
      this.referenceAnalyser.clear();
    }
  }
} // const g = new GarbageCollector(
//   new Store(),
//   new DocStructure(),
//   1,
//   new StateVectorManager()
// );
class ObjectReferencerManager implements IReferencerItemManager {
  isReferencer(item: IDocumentItem): boolean {
    return item.content.type === "object";
  }
  getReferencedItems(sourceItem: IDocumentItem): YjsID[] {
    const targets: YjsID[] = [];
    if (sourceItem.content.type !== "object") return targets;
    for (const key in sourceItem.content.value) {
      sourceItem.content.value.hasOwnProperty(key) &&
        targets.push(sourceItem.content.value[key]);
    }
    Object.values(sourceItem.content.value).forEach((value) => {
      targets.push(value);
    });
    return targets;
  }
}

export {
  DocStructure,
  BufferStore,
  Store,
  StateVectorManager,
  ConflictResolver,
  Helper,
  Client,
  InsertOperationHandler,
  DeleteOperationHandler,
  ObjectReferencerManager,
  MinVectorCalculator,
  GraphReferenceAnalyzer,
  GarbageCollector,
  IncrementalGC,
};
