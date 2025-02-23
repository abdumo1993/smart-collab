import {
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
    private store: Map<
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
  getAllOps(): Delta[] {
    return Array.from(this.store.values()).flatMap((m) =>
      Array.from(m.values())
    );
  }
}

// implement operatonsHandlers
class InsertOperationHandler implements IOperationHandler {
  constructor(
    private document: IDocStructure,
    private conflictResolver: IConflictResolver,
    private store: IOperationStore,
    private stateVectore: IStateVectorManager,
    private oBuffer: IBufferStore,
    private rBuffer: IBufferStore
  ) {}
  apply(op: InsertDelta): void {
    if (!this.stateVectore.isNewOperation(op)) return;
    const origin = this.document.traverse(this.document.head, op.origin);
    if (!origin) {
      this.oBuffer.add(JSON.stringify(op.origin), op);
      return;
    }
    const item: IDocumentItem | null = this.conflictResolver.resolve(
      origin,
      op
    );
    if (!item) {
      this.rBuffer.add(JSON.stringify(op.rightOrigin), op);
      return;
    }
    this.store.set(item.id.clientID, item.id.clock, op);
    this.stateVectore.update(op.id.clientID, op.id.clock);
  }
  revert(op: Delta): Delta {
    throw new Error("Method not implemented.");
  }
}

class DeleteOperationHandler implements IOperationHandler {
  constructor(
    private document: IDocStructure,
    private store: IOperationStore,

    private stateVectore: IStateVectorManager,
    private buffer: IBufferStore
  ) {}
  apply(op: DeleteDelta): void {
    if (!this.stateVectore.isNewOperation(op)) return;
    const item = this.document.traverse(this.document.head, op.itemID);
    if (!item) {
      this.buffer.add(JSON.stringify(op.itemID), op);
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
    return a.clientID < b.clientID || (a.clientID === b.clientID && a.clock < b.clock);
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
    private document: IDocStructure,
    private stateVector: IStateVectorManager,
    private store: IOperationStore,
    private oBuffer: IBufferStore,
    private rBuffer: IBufferStore,
    private tBuffer: IBufferStore,
    private conflictResolver: IConflictResolver
  ) {
    this.registerOperationHandlers();
  }

  applyOps(ops: Delta[]): void {
    while (ops.length > 0) {
      const op = ops.shift()!;
      if (op.type !== "gc" && !this.stateVector.isNewOperation(op)) {
        continue;
      }
      const oDependent = this.oBuffer.get(JSON.stringify(op.id));
      const rDependent = this.rBuffer.get(JSON.stringify(op.id));
      const tDependent = this.tBuffer.get(JSON.stringify(op.id));

      try {
        this.apply(op);
      } catch (e) {
        console.log(e);
      }
      oDependent &&
        (ops.push(...oDependent!), this.oBuffer.remove(JSON.stringify(op.id)));
      rDependent &&
        (ops.push(...rDependent!), this.rBuffer.remove(JSON.stringify(op.id)));
      tDependent &&
        (ops.push(...tDependent), this.tBuffer.remove(JSON.stringify(op.id)));
    }
  }
  apply(op: Delta): void {
    const handler = this.operationHandlers.get(op.type);
    if (!handler) throw new Error(`No handler for ${op.type} operations`);
    handler.apply(op);
  }
  revert(op: Delta): Delta {
    throw new Error("Method not implemented.");
  }
  private registerOperationHandlers(): void {
    this.operationHandlers.set(
      "insert",
      new InsertOperationHandler(
        this.document,
        this.conflictResolver,
        this.store,
        this.stateVector,
        this.oBuffer,
        this.rBuffer
      )
    );
    // other handlers here

    this.operationHandlers.set(
      "delete",
      new DeleteOperationHandler(
        this.document,
        this.store,
        this.stateVector,
        this.tBuffer
      )
    );
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
  areIdsEqual(id1: YjsID, id2: YjsID): boolean {
    return id1.clientID === id2.clientID && id1.clock === id2.clock;
  }
  isIdLess(id1: YjsID, id2: YjsID): boolean {
    return (
      id1.clientID < id2.clientID ||
      (id1.clientID === id2.clientID && id1.clock < id2.clock)
    );
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

export {
  DocStructure,
  BufferStore,
  Store,
  StateVectorManager,
  ConflictResolver,
  Helper,
  Client,
};
