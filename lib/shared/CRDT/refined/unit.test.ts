import {
  DocStructure,
  BufferStore,
  Store,
  StateVectorManager,
  ConflictResolver,
  Helper,
  Client,
  InsertOperationHandler,
  DeleteOperationHandler,
  MinVectorCalculator,
  GraphReferenceAnalyzer,
  GarbageCollector,
  IncrementalGC,
  ObjectReferencerManager,
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
  StateVector,
  DeleteDelta,
  Content,
  IHandlerConfig,
  IVectorCalculator,
  IReferenceAnalyzer,
  IGarbageCollector,
  IGarbageEngine,
  IReferencerItemManager,
} from "./iterfaces";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";

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

  describe("traverse", () => {
    test("should find existing item by ID", () => {
      const testItem = ydoc.createItem(
        ydoc.head,
        {
          type: "insert",
          id: { clientID: 1, clock: 1 },
          content: { type: "text", value: "A" },
          origin: ydoc.head.id,
          rightOrigin: ydoc.tail.id,
        },
        ydoc.tail
      );
      ydoc.head.rightOrigin = testItem;

      const found = ydoc.traverse(ydoc.head, testItem.id);
      expect(found).toBe(testItem);
    });

    test("should return null for non-existent ID", () => {
      const found = ydoc.traverse(ydoc.head, { clientID: 999, clock: 999 });
      expect(found).toBeNull();
    });
  });

  describe("traverseAll", () => {
    test("should execute callback for all items", () => {
      const mockCallback = jest.fn();
      ydoc.traverseAll(mockCallback);

      // Should at least traverse head and tail
      expect(mockCallback).toHaveBeenCalledWith(ydoc.head);
      expect(mockCallback).toHaveBeenCalledWith(ydoc.tail);
    });

    test("should traverse entire document chain", () => {
      const items: IDocumentItem[] = [];
      ydoc.traverseAll((item) => items.push(item));

      // Verify traversal order: head -> tail
      expect(items).toEqual([ydoc.head, ydoc.tail]);
    });
  });

  describe("createItem", () => {
    test("should create item with correct structure", () => {
      const op: InsertDelta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "Test" },
        origin: ydoc.head.id,
        rightOrigin: ydoc.tail.id,
      };

      const newItem = ydoc.createItem(ydoc.head, op, ydoc.tail);

      expect(newItem.id).toEqual(op.id);
      expect(newItem.content).toEqual(op.content);
      expect(newItem.origin).toBe(ydoc.head);
      expect(newItem.rightOrigin).toBe(ydoc.tail);
      expect(newItem.deleted).toBe(false);
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
  let handlerConfigs: IHandlerConfig[];

  beforeEach(() => {
    ydoc = new DocStructure();
    stateVector = new StateVectorManager();
    store = new Store();
    oBuffer = new BufferStore();
    rBuffer = new BufferStore();
    tBuffer = new BufferStore();
    helper = new Helper();
    conflictResolver = new ConflictResolver(ydoc);
    handlerConfigs = [
      {
        type: "insert",
        factory: () =>
          new InsertOperationHandler(
            ydoc,
            conflictResolver,
            store,
            stateVector,
            oBuffer,
            rBuffer,
            helper
          ),
      },
      {
        type: "delete",
        factory: () =>
          new DeleteOperationHandler(ydoc, store, helper, stateVector, tBuffer),
      },
    ];

    client = new Client(
      1,
      0,
      stateVector,
      oBuffer,
      rBuffer,
      tBuffer,
      helper,
      handlerConfigs
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

      oBuffer.add(helper.stringifyYjsID(op.origin), op);
      expect(oBuffer.get(helper.stringifyYjsID(op.origin))?.[0]).toBe(op);
    });

    test("should add operations to right buffer", () => {
      const op: InsertDelta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "a" },
        origin: { clientID: 0, clock: 0 },
        rightOrigin: { clientID: 2, clock: 0 },
      };

      rBuffer.add(helper.stringifyYjsID(op.rightOrigin), op);

      expect(rBuffer.get(helper.stringifyYjsID(op.rightOrigin))?.[0]).toBe(op);
    });

    test("should add delete operations to target buffer", () => {
      const op: DeleteDelta = {
        type: "delete",
        id: { clientID: 1, clock: 1 },
        itemID: { clientID: 0, clock: 0 },
      };

      tBuffer.add(helper.stringifyYjsID(op.itemID), op);
      expect(tBuffer.get(helper.stringifyYjsID(op.itemID))?.[0]).toBe(op);
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

//

describe("Garbage collection Tests", () => {
  let client: IClient;
  let ydoc: IDocStructure;
  let stateVector: IStateVectorManager;
  let store: IOperationStore;
  let oBuffer: IBufferStore;
  let rBuffer: IBufferStore;
  let tBuffer: IBufferStore;
  let helper: IHelper;
  let conflictResolver: IConflictResolver;
  let handlerConfigs: IHandlerConfig[];
  let referenceAnalyser: IReferenceAnalyzer;
  let safeVectorCalculator: IVectorCalculator;
  let garbageCollector: IGarbageCollector;
  let referenceItemManager: IReferencerItemManager;
  let garbageEngine: IGarbageEngine;
  let mockAllVectors: Map<YjsID['clientID'], StateVector>;

  beforeEach(() => {
    ydoc = new DocStructure();
    stateVector = new StateVectorManager();
    store = new Store();
    oBuffer = new BufferStore();
    rBuffer = new BufferStore();
    tBuffer = new BufferStore();
    helper = new Helper();
    referenceAnalyser = new GraphReferenceAnalyzer(helper);
    safeVectorCalculator = new MinVectorCalculator();
    referenceItemManager = new ObjectReferencerManager();
    garbageEngine = new IncrementalGC(
      ydoc,
      referenceAnalyser,
      referenceItemManager,
      100
    );
    garbageCollector = new GarbageCollector(
      safeVectorCalculator,
      garbageEngine,
      store
    );
    conflictResolver = new ConflictResolver(ydoc);
    handlerConfigs = [
      {
        type: "insert",
        factory: () =>
          new InsertOperationHandler(
            ydoc,
            conflictResolver,
            store,
            stateVector,
            oBuffer,
            rBuffer,
            helper
          ),
      },
      {
        type: "delete",
        factory: () =>
          new DeleteOperationHandler(ydoc, store, helper, stateVector, tBuffer),
      },
    ];

    client = new Client(
      1,
      0,
      stateVector,
      oBuffer,
      rBuffer,
      tBuffer,
      helper,
      handlerConfigs
    );
     mockAllVectors = new Map<YjsID["clientID"], StateVector>([
      [
        1,
        new Map([
          [1, 3],
          [2, 4],
          [3, 2],
        ]),
      ],
      [
        2,
        new Map([
          [1, 2],
          [2, 1],
          [3, 3],
        ]),
      ],
      [
        3,
        new Map([
          [1, 1],
          [2, 2],
          [3, 5],
        ]),
      ],
    ]);
  });

  describe("MinVectorCalculator class tests", () => {
    // const mockAllVectors = new Map<YjsID["clientID"], StateVector>([
    //   [
    //     1,
    //     new Map([
    //       [1, 3],
    //       [2, 4],
    //       [3, 2],
    //     ]),
    //   ],
    //   [
    //     2,
    //     new Map([
    //       [1, 2],
    //       [2, 1],
    //       [3, 3],
    //     ]),
    //   ],
    //   [
    //     3,
    //     new Map([
    //       [1, 1],
    //       [2, 2],
    //       [3, 5],
    //     ]),
    //   ],
    // ]);
    /* 
    client1: min(3,2,1) = 1
    client2: min(4,1,2) = 1
    client3: min(1,3,5) = 2

     */
    test("Should calculate safeVector (min value for each client)", () => {
      const safeVector = safeVectorCalculator.getSafeVector(mockAllVectors);
      expect(safeVector?.get(1)).toBe(1);
      expect(safeVector?.get(2)).toBe(1);
      expect(safeVector?.get(3)).toBe(2);
    });
  });
  describe("ReferenceAnalyser Tests", () => {
    const id1: YjsID = {
      clientID: 1,
      clock: 1,
    };
    const id2: YjsID = {
      clientID: 2,
      clock: 1,
    };
    test("Should register, check reference and remove referencer", () => {
      // register. map => 'id2' -> 'id1'
      referenceAnalyser.registerReference(id1, id2);
      expect(referenceAnalyser.isReferenced(id2)).toBeTruthy();

      // remove referencer.i.e remove id1 from the set of id2's sources.
      referenceAnalyser.removeReferencer(id1, [id2]);
      // because only 1 source, id2 will be removed fromt reference map all together.
      expect(referenceAnalyser.isReferenced(id2)).toBeFalsy();
    });

    test("Should clear all reference relations", () => {
      referenceAnalyser.registerReference(id2, id1);
      const cleared = referenceAnalyser.clear();
      // size of empty map is 0;
      expect(cleared).toBeTruthy();
    });
  });




  describe("IncreamentalGC (GarbageEngine) Tests", () => {
    const id1: YjsID = {
      clientID: 1,
      clock: 1,
    };
    const id2: YjsID = {
      clientID: 2,
      clock: 1,
    };
    test("Should process ", () => {
      // register. map => 'id2' -> 'id1'
      referenceAnalyser.registerReference(id1, id2);
      expect(referenceAnalyser.isReferenced(id2)).toBeTruthy();

      // remove referencer.i.e remove id1 from the set of id2's sources.
      referenceAnalyser.removeReferencer(id1, [id2]);
      // because only 1 source, id2 will be removed fromt reference map all together.
      expect(referenceAnalyser.isReferenced(id2)).toBeFalsy();
    });

    test("Should clear all reference relations", () => {
      referenceAnalyser.registerReference(id2, id1);
      const cleared = referenceAnalyser.clear();
      // size of empty map is 0;
      expect(cleared).toBeTruthy();
    });
  });
});

