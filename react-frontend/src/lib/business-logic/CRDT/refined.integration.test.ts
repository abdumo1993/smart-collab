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
  StringContent,
  IHandlerConfig,
} from "./iterfaces";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { v4 as uuidv4 } from "uuid";
const MIN_UUIDv4 = "";
const MAX_UUIDv4 = "z";
const getUUID = (curr: string) => {
  let uuid = uuidv4();
  while (curr > uuid) {
    uuid = uuidv4();
  }
  return [uuid, curr];
};
function sortByStringIndexOrder<T>(
  a: string[],
  b: T[],
  options: {
    caseSensitive?: boolean;
    reverse?: boolean;
    customComparator?: (a: string, b: string) => number;
  } = {}
): T[] {
  if (a.length !== b.length) throw new Error("Array length mismatch");

  return a
    .map((value, index) => ({ value, index }))
    .sort((x, y) => {
      if (options.customComparator) {
        return options.customComparator(x.value, y.value);
      }

      const compareResult = options.caseSensitive
        ? x.value.localeCompare(y.value)
        : x.value.toLowerCase().localeCompare(y.value.toLowerCase());

      return options.reverse ? -compareResult : compareResult;
    })
    .map((pair) => b[pair.index]);
}

describe("Integration Tests", () => {
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
  let cID: string;

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
      uuidv4(),
      0,
      stateVector,
      oBuffer,
      rBuffer,
      tBuffer,
      helper,
      handlerConfigs
    );

    cID = client.clientID;
  });

  test("should handle a sequence of insert operations", () => {
    const op1: InsertDelta = {
      type: "insert",
      id: { clientID: cID, clock: 1 },
      content: { type: "text", value: "a" },
      origin: {
        clientID: MIN_UUIDv4,
        clock: Number.MIN_SAFE_INTEGER,
      },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    const op2: InsertDelta = {
      type: "insert",
      id: { clientID: cID, clock: 2 },
      content: { type: "text", value: "b" },
      origin: { clientID: cID, clock: 1 },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    client.applyOps([op1, op2]);

    // Verify state vector updated
    expect(stateVector.get(cID)).toBe(2);

    // Verify operations stored
    expect(store.get(cID, 1)).toBeDefined();
    expect(store.get(cID, 2)).toBeDefined();
  });

  test("should handle delete operations", () => {
    // First insert an item
    const insertOp: InsertDelta = {
      type: "insert",
      id: { clientID: cID, clock: 1 },
      content: { type: "text", value: "a" },
      origin: {
        clientID: MIN_UUIDv4,
        clock: Number.MIN_SAFE_INTEGER,
      },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    // Then delete it
    const deleteOp: DeleteDelta = {
      type: "delete",
      id: { clientID: cID, clock: 2 },
      itemID: { clientID: cID, clock: 1 },
    };

    client.applyOps([insertOp, deleteOp]);

    // Verify state vector updated
    expect(stateVector.get(cID)).toBe(2);

    // Verify operations stored
    expect(store.get(cID, 1)).toBeDefined();
    expect(store.get(cID, 2)).toBeDefined();
  });

  test("should handle and resolve operation dependencies", () => {
    // Create three operations where middle one arrives first
    const op1: InsertDelta = {
      type: "insert",
      id: { clientID: cID, clock: 1 },
      content: { type: "text", value: "a" },
      origin: {
        clientID: MIN_UUIDv4,
        clock: Number.MIN_SAFE_INTEGER,
      },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    const op2: InsertDelta = {
      type: "insert",
      id: { clientID: cID, clock: 2 },
      content: { type: "text", value: "b" },
      origin: { clientID: cID, clock: 1 }, // Depends on op1
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      }, // Depends on op3
    };

    const op3: InsertDelta = {
      type: "insert",
      id: { clientID: cID, clock: 3 },
      content: { type: "text", value: "c" },
      origin: { clientID: cID, clock: 2 },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    // Apply middle operation first - should be buffered due to missing origin
    client.applyOps([op2]);

    // Verify operation is not in store yet
    expect(store.get(cID, 2)).toBeUndefined();

    // Verify operation is only in origin buffer
    expect(oBuffer.get(helper.stringifyYjsID(op2.origin))?.[0]).toBe(op2);

    expect(
      rBuffer.get(helper.stringifyYjsID(op2.rightOrigin))?.[0]
    ).toBeUndefined();

    // expect(client.rBuffer.size).toBe(0); // Should not be in right buffer yet

    // Apply op1 - should resolve origin dependency but then buffer for right dependency
    client.applyOps([op1]);

    // Verify op1 is in store
    expect(store.get(cID, 1)).toBeTruthy();

    // Now op2 should move from oBuffer to rBuffer
    expect(oBuffer.get(helper.stringifyYjsID(op2.origin))?.[0]).toBeUndefined();

    // don't need to be in right buffer
    // expect(client.rBuffer.get(helper.stringifyYjsID(op2.rightOrigin))?.[0]).toBe(op2);

    // Apply op3 - should resolve right dependency and finally apply op2
    client.applyOps([op3]);

    // Verify all operations are now in store
    expect(store.get(cID, 1)).toBeTruthy();
    expect(store.get(cID, 2)).toBeTruthy();
    expect(store.get(cID, 3)).toBeTruthy();

    // Verify buffers are empty
    expect(oBuffer.get(helper.stringifyYjsID(op2.origin))?.[0]).toBeUndefined();
    expect(
      rBuffer.get(helper.stringifyYjsID(op2.rightOrigin))?.[0]
    ).toBeUndefined();

    // Verify correct document structure
    const item1 = ydoc.traverse(ydoc.head, op1.id);
    const item2 = ydoc.traverse(ydoc.head, op2.id);
    const item3 = ydoc.traverse(ydoc.head, op3.id);

    expect(item1).toBeDefined();
    expect(item2).toBeDefined();
    expect(item3).toBeDefined();

    // Verify correct linking
    expect(item2?.origin?.id).toEqual(op1.id);
    expect(item2?.rightOrigin?.id).toEqual(op3.id);
  });
});

describe("Multi-Client Conflict Resolution Tests", () => {
  let clients: IClient[];
  let ydocs: IDocStructure[];
  let stores: IOperationStore[];
  let buffers: Array<Array<IBufferStore>>;
  let svs: IStateVectorManager[];
  let handlerConfigs: IHandlerConfig[];

  const clientCount = 3;

  beforeEach(() => {
    ydocs = [new DocStructure(), new DocStructure(), new DocStructure()];

    stores = [new Store(), new Store(), new Store()];

    buffers = [
      [new BufferStore(), new BufferStore(), new BufferStore()],
      [new BufferStore(), new BufferStore(), new BufferStore()],
      [new BufferStore(), new BufferStore(), new BufferStore()],
    ];
    svs = [
      new StateVectorManager(),
      new StateVectorManager(),
      new StateVectorManager(),
    ];

    clients = Array.from({ length: clientCount }, (_, i) => {
      let helper: IHelper = new Helper();
      let conflictResolver: IConflictResolver = new ConflictResolver(ydocs[i]);
      handlerConfigs = [
        {
          type: "insert",
          factory: () =>
            new InsertOperationHandler(
              ydocs[i],
              conflictResolver,
              stores[i],
              svs[i],
              buffers[i][0],
              buffers[i][1],
              helper
            ),
        },
        {
          type: "delete",
          factory: () =>
            new DeleteOperationHandler(
              ydocs[i],
              stores[i],
              helper,
              svs[i],
              buffers[i][2]
            ),
        },
      ];
      let client: IClient = new Client(
        `${i}`,
        0,
        svs[i],
        buffers[i][0],
        buffers[i][1],
        buffers[i][2],
        helper,
        handlerConfigs
      );
      return client;
    });
  });

  test("concurrent inserts at same position should order by clientID", () => {
    const content = ["A", "B", "C"];
    const ops: Delta[] = clients.map(
      (client, ind): InsertDelta =>
        ({
          id: { clientID: client.clientID, clock: 1 },
          type: "insert",
          content: { type: "text", value: `${content[ind]}` },
          origin: {
            clientID: MIN_UUIDv4,
            clock: Number.MIN_SAFE_INTEGER,
          },
          rightOrigin: {
            clientID: MAX_UUIDv4,
            clock: Number.MAX_SAFE_INTEGER,
          },
        } as InsertDelta)
    );

    // Simulate concurrent insertion
    clients.forEach((client, idx) => client.applyOps([ops[idx]]));

    // Sync all operations across clients
    clients.forEach((client, idx) => {
      clients
        .filter((c) => c !== client)
        .forEach((peer) => {
          const ops = stores[idx].getAllOps();
          peer.applyOps([...ops]);
        });
    });

    // Verify all clients have same state
    ydocs.forEach((ydoc) => {
      let current = ydoc.head.rightOrigin!;
      const values: string[] = [];
      while (current.rightOrigin) {
        values.push((current.content as StringContent).value);
        current = current.rightOrigin;
      }
      // Should be ordered by clientID (B, C, D)
      const sortedContent = sortByStringIndexOrder(
        clients.map((client) => client.clientID),
        content
      );
      expect(values).toEqual(sortedContent);
    });
  });

  test("interleaved delete and insert operations", () => {
    // Client 1 creates initial structure: A-B-C
    const opA = createInsertOp(
      clients[0],
      "A",
      ydocs[0].head.id,
      ydocs[0].tail.id
    );
    const opB = createInsertOp(clients[0], "B", opA.id, ydocs[0].tail.id);
    const opC = createInsertOp(clients[0], "C", opB.id, ydocs[0].tail.id);
    clients[0].applyOps([opA, opB, opC]);

    // Sync initial state
    clients.slice(1).forEach((c) => c.applyOps([opA, opB, opC]));

    // Client 2 deletes B while Client 3 inserts X after B
    const deleteOp = createDeleteOp(clients[1], opB.id);
    const insertOp = createInsertOp(clients[2], "X", opB.id, opC.id);

    // Apply concurrently
    clients[1].applyOps([deleteOp]);
    clients[2].applyOps([insertOp]);

    // Cross-sync operations
    clients[0].applyOps([deleteOp, insertOp]);
    clients[1].applyOps([insertOp]);
    clients[2].applyOps([deleteOp]);

    // Verify final structure
    ydocs.forEach((ydoc) => {
      const items = traverseDocument(ydoc);
      expect(items.map((i) => (i.content as StringContent).value)).toEqual([
        "A",
        "X",
        "C",
      ]);
    });
  });

  test("offline client catching up with buffer", () => {
    // Client 1 goes offline
    const offlineClient = clients[0];
    const onlineClients = clients.slice(1);

    // Online clients make changes
    const op1 = createInsertOp(
      onlineClients[0],
      "X",
      ydocs[1].head.id,
      ydocs[1].tail.id
    );
    const op2 = createInsertOp(onlineClients[1], "Y", op1.id, ydocs[1].tail.id);
    onlineClients.forEach((c) => c.applyOps([op1, op2]));

    // Offline client makes changes
    const offlineOp = createInsertOp(
      offlineClient,
      "Z",
      ydocs[0].head.id,
      ydocs[0].tail.id
    );
    offlineClient.applyOps([offlineOp]);

    // Simulate reconnect
    onlineClients.forEach((c) => c.applyOps([offlineOp]));
    offlineClient.applyOps([op1, op2]);
    // ydoc1 = []
    // Verify convergence
    clients.forEach((client, idx) => {
      const items = traverseDocument(ydocs[idx]);
      expect(items.map((i) => (i.content as StringContent).value)).toEqual(
        sortByStringIndexOrder(
          clients.map((c) => c.clientID),
          ["Z", "X", "Y"]
        )
      );
    });

    // Verify all buffers are empty
    clients.forEach((c, idx) => {
      expect(buffers[idx][0].getSize()).toBe(0);
      expect(buffers[idx][1].getSize()).toBe(0);
      expect(buffers[idx][2].getSize()).toBe(0);
    });
  });
});

function createInsertOp(
  client: IClient,
  value: string,
  origin: YjsID,
  rightOrigin: YjsID
): InsertDelta {
  return {
    type: "insert",
    id: { clientID: client.clientID, clock: ++client.clock },
    content: { type: "text", value },
    origin,
    rightOrigin,
  } as InsertDelta;
}

function createDeleteOp(client: IClient, itemID: YjsID): DeleteDelta {
  return {
    type: "delete",
    id: { clientID: client.clientID, clock: ++client.clock },
    itemID,
  };
}

function traverseDocument(ydoc: IDocStructure): IDocumentItem[] {
  const items: IDocumentItem[] = [];
  let current: IDocumentItem | null = ydoc.head;
  while (current) {
    if (current !== ydoc.head && current !== ydoc.tail) {
      !current.deleted && items.push(current);
    }
    current = current.rightOrigin;
  }
  return items;
}

describe("Full System Integration Test", () => {
  let clients: IClient[];
  let ydocs: IDocStructure[];
  let stores: IOperationStore[];
  let buffers: Array<Array<IBufferStore>>;
  let svs: IStateVectorManager[];
  let handlerConfigs: IHandlerConfig[];

  const clientCount = 3;

  beforeEach(() => {
    ydocs = [new DocStructure(), new DocStructure(), new DocStructure()];

    stores = [new Store(), new Store(), new Store()];

    buffers = [
      [new BufferStore(), new BufferStore(), new BufferStore()],
      [new BufferStore(), new BufferStore(), new BufferStore()],
      [new BufferStore(), new BufferStore(), new BufferStore()],
    ];
    svs = [
      new StateVectorManager(),
      new StateVectorManager(),
      new StateVectorManager(),
    ];

    clients = Array.from({ length: clientCount }, (_, i) => {
      let helper: IHelper = new Helper();
      handlerConfigs = [
        {
          type: "insert",
          factory: () =>
            new InsertOperationHandler(
              ydocs[i],
              conflictResolver,
              stores[i],
              svs[i],
              buffers[i][0],
              buffers[i][1],
              helper
            ),
        },
        {
          type: "delete",
          factory: () =>
            new DeleteOperationHandler(
              ydocs[i],
              stores[i],
              helper,
              svs[i],
              buffers[i][2]
            ),
        },
      ];
      let conflictResolver: IConflictResolver = new ConflictResolver(ydocs[i]);

      let client: IClient = new Client(
        `${i}`,
        0,
        svs[i],
        buffers[i][0],
        buffers[i][1],
        buffers[i][2],
        helper,
        handlerConfigs
      );
      return client;
    });
  });
  // Move syncClients here, before the tests
  const syncClients = (
    source: IOperationStore,
    targetSV: IStateVectorManager,
    sourceSV: IStateVectorManager,
    targetClient: IClient
  ) => {
    const missingOps = source.getMissingOps(targetSV.getVector());
    targetClient.applyOps(missingOps);
    targetSV.merge(sourceSV.getVector());
  };

  const getContent = (ydoc: IDocStructure): string => {
    const content: string[] = [];
    let current = ydoc.head.rightOrigin;
    while (current && current !== ydoc.tail) {
      if (!current.deleted && current.content.type === "text") {
        content.push((current.content as StringContent).value);
      }
      current = current.rightOrigin;
    }
    return content.join("");
  };

  test("complete collaborative editing scenario", () => {
    // Phase 1: Initial concurrent edits
    // Client 1 types "Hello"
    const helloOps = "Hello".split("").map((char, idx) => ({
      type: "insert" as const,
      id: { clientID: clients[0].clientID, clock: idx + 1 },
      content: { type: "text" as const, value: char },
      origin:
        idx === 0
          ? {
              clientID: MIN_UUIDv4,
              clock: Number.MIN_SAFE_INTEGER,
            }
          : { clientID: clients[0].clientID, clock: idx },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    }));

    // Client 2 types "World" concurrently
    const worldOps = "World".split("").map((char, idx) => ({
      type: "insert" as const,
      id: { clientID: clients[1].clientID, clock: idx + 1 },
      content: { type: "text" as const, value: char },
      origin:
        idx === 0
          ? {
              clientID: MIN_UUIDv4,
              clock: Number.MIN_SAFE_INTEGER,
            }
          : { clientID: clients[1].clientID, clock: idx },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    }));

    // Apply operations locally
    clients[0].applyOps(helloOps);
    clients[1].applyOps(worldOps);

    // Phase 2: State Vector Exchange and Sync
    // Each client gets missing ops from others based on state vectors
    syncClients(stores[0], svs[1], svs[0], clients[1]);
    syncClients(stores[1], svs[0], svs[1], clients[0]);
    // syncClients(clients[0], clients[1]);
    // syncClients(clients[1], clients[0]);

    // Phase 3: Client 3 comes online late
    // Client 3 should receive all previous operations
    syncClients(stores[0], svs[2], svs[0], clients[2]);
    syncClients(stores[1], svs[2], svs[1], clients[2]);
    // syncClients(clients[0], clients[2]);
    // syncClients(clients[1], clients[2]);

    // Phase 4: Concurrent deletions and insertions
    // Client 1 deletes 'H'
    const deleteH: DeleteDelta = {
      type: "delete",
      id: { clientID: clients[0].clientID, clock: 6 },
      itemID: { clientID: clients[0].clientID, clock: 1 },
    };

    // Client 2 inserts '!' at the end
    const insertExclamation: InsertDelta = {
      type: "insert",
      id: { clientID: clients[1].clientID, clock: 6 },
      content: { type: "text", value: "!" },
      origin: { clientID: clients[1].clientID, clock: 5 }, // After 'd' from "World"
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    // Client 3 inserts space between words
    const insertSpace: InsertDelta = {
      type: "insert",
      id: { clientID: clients[2].clientID, clock: 1 },
      content: { type: "text", value: " " },
      origin: { clientID: clients[0].clientID, clock: 5 }, // After "Hello"
      rightOrigin: { clientID: clients[1].clientID, clock: 1 }, // Before "World"
    };

    // Apply concurrent operations
    clients[0].applyOps([deleteH]);
    clients[1].applyOps([insertExclamation]);
    clients[2].applyOps([insertSpace]);

    // Phase 5: Final Sync
    // Sync all clients with each other
    for (let i = 0; i < clientCount; i++) {
      for (let j = 0; j < clientCount; j++) {
        if (i !== j) {
          syncClients(stores[i], svs[j], svs[i], clients[j]);
          // syncClients(clients[i], clients[j]);
        }
      }
    }

    // Phase 6: Verification
    // Helper function to get document content
    const getContent = (ydoc: IDocStructure): string => {
      const content: string[] = [];
      let current = ydoc.head.rightOrigin;
      while (current && current !== ydoc.tail) {
        if (!current.deleted && current.content.type === "text") {
          content.push((current.content as StringContent).value);
        }
        current = current.rightOrigin;
      }
      return content.join("");
    };

    // All documents should have same content

    const expectedContent = "ello World!";
    clients.forEach((_, idx) => {
      expect(getContent(ydocs[idx])).toBe(expectedContent);
    });

    // Verify state vectors are synchronized
    const expectedStateVector = new Map([
      [clients[0].clientID, 6], // Client 1: 5 inserts + 1 delete
      [clients[1].clientID, 6], // Client 2: 5 inserts + 1 insert
      [clients[2].clientID, 1], // Client 3: 1 insert
    ]);

    clients.forEach((client, idx) => {
      expectedStateVector.forEach((clock, clientID) => {
        expect(svs[idx].get(clientID)).toBe(clock);
      });
    });

    // Verify all buffers are empty
    clients.forEach((client, idx) => {
      expect(buffers[idx][0].getSize()).toBe(0);
      expect(buffers[idx][1].getSize()).toBe(0);
      expect(buffers[idx][2].getSize()).toBe(0);
    });
  });

  test("complex dependency and network partition scenarios", () => {
    // Phase 1: Create complex dependency chain
    const op1: InsertDelta = {
      type: "insert",
      id: { clientID: clients[0].clientID, clock: 1 },
      content: { type: "text", value: "A" },
      origin: {
        clientID: MIN_UUIDv4,
        clock: Number.MIN_SAFE_INTEGER,
      },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    const op2: InsertDelta = {
      type: "insert",
      id: { clientID: clients[1].clientID, clock: 1 },
      content: { type: "text", value: "B" },
      origin: op1.id,
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    const op3: InsertDelta = {
      type: "insert",
      id: { clientID: clients[2].clientID, clock: 1 },
      content: { type: "text", value: "C" },
      origin: op2.id,
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    // Simulate out-of-order arrival
    clients[0].applyOps([op2]); // Should buffer (missing op1)
    clients[0].applyOps([op3]); // Should buffer (missing op2)
    clients[0].applyOps([op1]); // Should resolve chain

    // Phase 2: Concurrent deletions of same item
    const delete1: DeleteDelta = {
      type: "delete",
      id: { clientID: clients[0].clientID, clock: 2 },
      itemID: op1.id,
    };

    const delete2: DeleteDelta = {
      type: "delete",
      id: { clientID: clients[1].clientID, clock: 2 },
      itemID: op1.id,
    };

    // Apply concurrent deletes
    clients[1].applyOps([op1, op2, op3, delete1]);
    clients[2].applyOps([op1, op2, op3, delete2]);

    // Phase 3: Insert between deleted items
    const insertBetween: InsertDelta = {
      type: "insert",
      id: { clientID: clients[0].clientID, clock: 3 },
      content: { type: "text", value: "X" },
      origin: op1.id,
      rightOrigin: op2.id,
    };

    clients[0].applyOps([insertBetween]);

    // Phase 4: Simulate network partition
    // Sync only between clients 1-2 and 2-3, creating partial connectivity
    syncClients(stores[0], svs[1], svs[0], clients[1]);
    syncClients(stores[1], svs[2], svs[1], clients[2]);

    // syncClients(clients[0], clients[1]);
    // syncClients(clients[1], clients[2]);

    // Phase 5: More concurrent operations during partition
    const partitionOps1: InsertDelta = {
      type: "insert",
      id: { clientID: clients[0].clientID, clock: 4 },
      content: { type: "text", value: "Y" },
      origin: op3.id,
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    const partitionOps2: InsertDelta = {
      type: "insert",
      id: { clientID: clients[2].clientID, clock: 2 },
      content: { type: "text", value: "Z" },
      origin: op3.id,
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    clients[0].applyOps([partitionOps1]);
    clients[2].applyOps([partitionOps2]);

    // Phase 6: Network heals - full sync
    for (let i = 0; i < clientCount; i++) {
      for (let j = 0; j < clientCount; j++) {
        if (i !== j) {
          syncClients(stores[i], svs[j], svs[i], clients[j]);

          // syncClients(clients[i], clients[j]);
        }
      }
    }

    // Verify final state

    // All documents should converge to same content
    const expectedContent = "XBCYZ";
    clients.forEach((_, idx) => {
      expect(getContent(ydocs[idx])).toBe(expectedContent);
    });
  });

  test("edge cases and stress testing", () => {
    // 1. Rapid concurrent edits at same position
    const concurrentOps = clients.map((client, i) => ({
      type: "insert" as const,
      id: { clientID: client.clientID, clock: 1 },
      content: { type: "text" as const, value: String(i) },
      origin: {
        clientID: MIN_UUIDv4,
        clock: Number.MIN_SAFE_INTEGER,
      },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    }));

    // Apply all concurrently
    clients.forEach((client, i) => client.applyOps([concurrentOps[i]]));

    // 2. Create long dependency chain
    const chainOps = Array.from({ length: 50 }, (_, i) => ({
      type: "insert" as const,
      id: { clientID: clients[0].clientID, clock: i + 2 },
      content: { type: "text" as const, value: "x" },
      origin: { clientID: clients[0].clientID, clock: i + 1 },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    }));

    // 3. Apply operations in reverse order to test out-of-order handling
    for (let i = chainOps.length - 1; i >= 0; i--) {
      clients[0].applyOps([chainOps[i]]);
    }

    // Sync all and verify
    for (let i = 0; i < clientCount; i++) {
      for (let j = 0; j < clientCount; j++) {
        if (i !== j) syncClients(stores[i], svs[j], svs[i], clients[j]);
        // if (i !== j) syncClients(clients[i], clients[j]);
      }
    }

    // All documents should be identical
    const content = getContent(ydocs[0]);
    clients.forEach((_, idx) => {
      expect(getContent(ydocs[idx])).toBe(content);
    });
  });
});
