import {
  DocStructure,
  BufferStore,
  Store,
  StateVectorManager,
  ConflictResolver,
  Helper,
  Client,
} from "./classes";
import {
  YjsID,
  IDocumentItem,
  InsertDelta,
  IDocStructure,
  IHelper,
  IClient,
  IStateVectorManager,
  IBufferStore,
  IOperationStore,
  IConflictResolver,
  Delta,
  DeleteDelta,
  Content,
} from "./iterfaces";
import { describe, test, expect, beforeEach } from "@jest/globals";
describe("DocStructure Tests", () => {
  let ydoc: IDocStructure;
  let helper: IHelper;

  beforeEach(() => {
    ydoc = new DocStructure();
    helper = new Helper();
  });

  describe("Constructor", () => {
    test("should initilize with head nad tail properly linked", () => {
      expect(ydoc.head.rightOrigin).toBe(ydoc.tail);
      expect(ydoc.tail.origin).toBe(ydoc.head);
    });
  });

  describe("areYjsIDsEqual", () => {
    test("should correctly compare equal IDs", () => {
      const id1: YjsID = { clientID: 1, clock: 1 };
      const id2: YjsID = { clientID: 1, clock: 1 };
      expect(helper.areIdsEqual(id1, id2)).toBe(true);
    });

    test("should correctly compare unequal IDs", () => {
      const id1: YjsID = { clientID: 1, clock: 1 };
      const id2: YjsID = { clientID: 1, clock: 2 };
      expect(helper.areIdsEqual(id1, id2)).toBe(false);
    });
  });

  describe("isIdLess", () => {
    test("should correctly compare IDs", () => {
      const id1: YjsID = { clientID: 1, clock: 1 };
      const id2: YjsID = { clientID: 1, clock: 2 };
      expect(helper.isIdLess(id1, id2)).toBe(true);
    });
  });
});

describe("Client Tests", () => {
  let client: IClient;
  let ydoc: IDocStructure;
  let stateVector: IStateVectorManager;
  let store: IOperationStore;
  let oBuffer: IBufferStore;
  let rBuffer: IBufferStore;
  let tBuffer: IBufferStore;
  let helper: IHelper;
  let conflictResolver: IConflictResolver;

  beforeEach(() => {
    ydoc = new DocStructure();
    stateVector = new StateVectorManager();
    store = new Store();
    oBuffer = new BufferStore();
    rBuffer = new BufferStore();
    tBuffer = new BufferStore();
    helper = new Helper();
    conflictResolver = new ConflictResolver(ydoc, helper);
    client = new Client(
      1,
      0,
      ydoc,
      stateVector,
      store,
      oBuffer,
      rBuffer,
      tBuffer,
      conflictResolver
    );
  });
  describe("State Vector Operations", () => {
    test("should update state vector with new operations", () => {
      const op: InsertDelta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "a" },
        origin: {
          clientID: Number.MIN_SAFE_INTEGER,
          clock: Number.MIN_SAFE_INTEGER,
        },
        rightOrigin: {
          clientID: Number.MAX_SAFE_INTEGER,
          clock: Number.MAX_SAFE_INTEGER,
        },
      };

      client.applyOps([op]);
      expect(stateVector.get(1)).toBe(1);
    });

    test("should detect new operations correctly", () => {
      const op: InsertDelta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "a" },
        origin: { clientID: 0, clock: 0 },
        rightOrigin: { clientID: 2, clock: 0 },
      };

      stateVector.update(1, 0);
      expect(stateVector.isNewOperation(op)).toBe(true);

      stateVector.update(1, 2);
      expect(stateVector.isNewOperation(op)).toBe(false);
    });

    test("should merge state vectors correctly", () => {
      const otherStateVector = new Map([
        [1, 5],
        [2, 3],
      ]);

      stateVector.update(1, 3);
      stateVector.update(2, 4);

      stateVector.merge(otherStateVector);

      expect(stateVector.get(1)).toBe(5);
      expect(stateVector.get(2)).toBe(4);
    });

    test("should get missing ops correctly", () => {
      const op1: InsertDelta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "a" },
        origin: { clientID: 0, clock: 0 },
        rightOrigin: { clientID: 2, clock: 0 },
      };
      // const clientOps = new Store();
      store.set(op1.id.clientID, op1.id.clock, op1);

      const otherStateVector = new Map([[1, 0]]);
      const missingOps = store.getMissingOps(otherStateVector);

      expect(missingOps).toHaveLength(1);
      expect(missingOps[0]).toBe(op1);
    });
  });

  describe("Buffer Operations", () => {
    test("should add operations to origin buffer", () => {
      const op: InsertDelta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "a" },
        origin: { clientID: 0, clock: 0 },
        rightOrigin: { clientID: 2, clock: 0 },
      };

      oBuffer.add(JSON.stringify(op.origin), op);
      expect(oBuffer.get(JSON.stringify(op.origin))?.[0]).toBe(op);
    });

    test("should add operations to right buffer", () => {
      const op: InsertDelta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "a" },
        origin: { clientID: 0, clock: 0 },
        rightOrigin: { clientID: 2, clock: 0 },
      };

      rBuffer.add(JSON.stringify(op.rightOrigin), op);

      expect(rBuffer.get(JSON.stringify(op.rightOrigin))?.[0]).toBe(op);
    });

    test("should add delete operations to target buffer", () => {
      const op: DeleteDelta = {
        type: "delete",
        id: { clientID: 1, clock: 1 },
        itemID: { clientID: 0, clock: 0 },
      };

      tBuffer.add(JSON.stringify(op.itemID), op);
      expect(tBuffer.get(JSON.stringify(op.itemID))?.[0]).toBe(op);
    });
  });
});

describe("Item Tests", () => {
  test("should create item with correct properties", () => {
    const id: YjsID = { clientID: 1, clock: 1 };
    const content: Content = { type: "text", value: "test" };
    const item: IDocumentItem = {
      id: id,
      content: content,
      origin: null,
      rightOrigin: null,
      deleted: false,
    };

    expect(item.id).toBe(id);
    expect(item.origin).toBeNull();
    expect(item.rightOrigin).toBeNull();
    expect(item.content).toBe(content);
    expect(item.deleted).toBe(false);
  });
});
