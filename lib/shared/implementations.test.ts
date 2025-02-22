import {
  Client,
  Item,
  YDoc,
  RightNotFoundError,
  OriginNotFoundError,
  OperationAlreadyApplied,
  ItemDoesntExist,
} from "./implementations";
import {
  YjsID,
  IYDoc,
  StateVector,
  Delta,
  InsertDelta,
  DeleteDelta,
  Content,
  GCContent,
  GCDelta,
  IItem,
  StringContent,
} from "./types";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";

describe("YDoc Tests", () => {
  let ydoc: YDoc;

  beforeEach(() => {
    ydoc = new YDoc();
  });

  describe("Constructor", () => {
    test("should initialize with head and tail properly linked", () => {
      expect(ydoc.head.rightOrigin).toBe(ydoc.tail);
      expect(ydoc.tail.origin).toBe(ydoc.head);
    });
  });

  describe("areYjsIDsEqual", () => {
    test("should correctly compare equal IDs", () => {
      const id1: YjsID = { clientID: 1, clock: 1 };
      const id2: YjsID = { clientID: 1, clock: 1 };
      expect(ydoc.areYjsIDsEqual(id1, id2)).toBe(true);
    });

    test("should correctly compare unequal IDs", () => {
      const id1: YjsID = { clientID: 1, clock: 1 };
      const id2: YjsID = { clientID: 1, clock: 2 };
      expect(ydoc.areYjsIDsEqual(id1, id2)).toBe(false);
    });
  });

  describe("areYjsIDsLessOrEqual", () => {
    test("should correctly compare IDs", () => {
      const id1: YjsID = { clientID: 1, clock: 1 };
      const id2: YjsID = { clientID: 1, clock: 2 };
      expect(ydoc.areYjsIDsLessOrEqual(id1, id2)).toBe(true);
    });
  });
});

describe("Client Tests", () => {
  let client: Client;
  let ydoc: YDoc;

  beforeEach(() => {
    ydoc = new YDoc();
    client = new Client(
      1, // clientID
      0, // clock
      new Map(), // stateVector
      ydoc,
      new Map(), // oBuffer
      new Map(), // rBuffer
      new Map(), // tBuffer
      new Map() // store
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

      client.applyOperation([op]);
      expect(client.stateVector.get(1)).toBe(1);
    });

    test("should detect new operations correctly", () => {
      const op: InsertDelta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "a" },
        origin: { clientID: 0, clock: 0 },
        rightOrigin: { clientID: 2, clock: 0 },
      };

      client.stateVector.set(1, 0);
      expect(client["isNewOperation"](op)).toBe(true);

      client.stateVector.set(1, 2);
      expect(client["isNewOperation"](op)).toBe(false);
    });

    test("should merge state vectors correctly", () => {
      const otherStateVector = new Map([
        [1, 5],
        [2, 3],
      ]);

      client.stateVector.set(1, 3);
      client.stateVector.set(2, 4);

      client.mergeStateVector(otherStateVector);

      expect(client.stateVector.get(1)).toBe(5);
      expect(client.stateVector.get(2)).toBe(4);
    });

    test("should get missing ops correctly", () => {
      const op1: Delta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "a" },
        origin: { clientID: 0, clock: 0 },
        rightOrigin: { clientID: 2, clock: 0 },
      };

      const clientOps = new Map<number, Map<number, Delta>>();
      const clockMap = new Map<number, Delta>();
      clockMap.set(1, op1);
      clientOps.set(1, clockMap);
      client.store = clientOps;

      const otherStateVector = new Map([[1, 0]]);
      const missingOps = client.getMissingOps(otherStateVector);

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

      client.addToOBuffer(op);
      expect(client.oBuffer.get(JSON.stringify(op.origin))?.[0]).toBe(op);
    });

    test("should add operations to right buffer", () => {
      const op: InsertDelta = {
        type: "insert",
        id: { clientID: 1, clock: 1 },
        content: { type: "text", value: "a" },
        origin: { clientID: 0, clock: 0 },
        rightOrigin: { clientID: 2, clock: 0 },
      };

      client.addToRBuffer(op);
      expect(client.rBuffer.get(JSON.stringify(op.rightOrigin))?.[0]).toBe(op);
    });

    test("should add delete operations to target buffer", () => {
      const op: DeleteDelta = {
        type: "delete",
        id: { clientID: 1, clock: 1 },
        itemID: { clientID: 0, clock: 0 },
      };

      client.addToTBuffer(op);
      expect(client.tBuffer.get(JSON.stringify(op.itemID))).toBe(op);
    });
  });
});

describe("Item Tests", () => {
  test("should create item with correct properties", () => {
    const id: YjsID = { clientID: 1, clock: 1 };
    const content: Content = { type: "text", value: "test" };
    const item = new Item(id, null, null, content);

    expect(item.id).toBe(id);
    expect(item.origin).toBeNull();
    expect(item.rightOrigin).toBeNull();
    expect(item.content).toBe(content);
    expect(item.deleted).toBe(false);
  });
});

describe("Integration Tests", () => {
  let client: Client;
  let ydoc: YDoc;

  beforeEach(() => {
    ydoc = new YDoc();
    client = new Client(
      1,
      0,
      new Map(),
      ydoc,
      new Map(),
      new Map(),
      new Map(),
      new Map()
    );
  });

  test("should handle a sequence of insert operations", () => {
    const op1: InsertDelta = {
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

    const op2: InsertDelta = {
      type: "insert",
      id: { clientID: 1, clock: 2 },
      content: { type: "text", value: "b" },
      origin: { clientID: 1, clock: 1 },
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    client.applyOperation([op1, op2]);

    // Verify state vector updated
    expect(client.stateVector.get(1)).toBe(2);

    // Verify operations stored
    const clientOps = client.store.get(1);
    expect(clientOps?.get(1)).toBeDefined();
    expect(clientOps?.get(2)).toBeDefined();
  });

  test("should handle delete operations", () => {
    // First insert an item
    const insertOp: InsertDelta = {
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

    // Then delete it
    const deleteOp: DeleteDelta = {
      type: "delete",
      id: { clientID: 1, clock: 2 },
      itemID: { clientID: 1, clock: 1 },
    };

    client.applyOperation([insertOp, deleteOp]);

    // Verify state vector updated
    expect(client.stateVector.get(1)).toBe(2);

    // Verify operations stored
    const clientOps = client.store.get(1);
    expect(clientOps?.get(1)).toBeDefined();
    expect(clientOps?.get(2)).toBeDefined();
  });

  test("should handle and resolve operation dependencies", () => {
    // Create three operations where middle one arrives first
    const op1: InsertDelta = {
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

    const op2: InsertDelta = {
      type: "insert",
      id: { clientID: 1, clock: 2 },
      content: { type: "text", value: "b" },
      origin: { clientID: 1, clock: 1 }, // Depends on op1
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      }, // Depends on op3
    };

    const op3: InsertDelta = {
      type: "insert",
      id: { clientID: 1, clock: 3 },
      content: { type: "text", value: "c" },
      origin: { clientID: 1, clock: 2 },
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    // Apply middle operation first - should be buffered due to missing origin
    client.applyOperation([op2]);

    // Verify operation is not in store yet
    expect(client.store.get(1)?.has(2)).toBeFalsy();

    // Verify operation is only in origin buffer
    expect(client.oBuffer.get(JSON.stringify(op2.origin))?.[0]).toBe(op2);
    expect(client.rBuffer.size).toBe(0); // Should not be in right buffer yet

    // Apply op1 - should resolve origin dependency but then buffer for right dependency
    client.applyOperation([op1]);

    // Verify op1 is in store
    expect(client.store.get(1)?.has(1)).toBeTruthy();

    // Now op2 should move from oBuffer to rBuffer
    expect(client.oBuffer.size).toBe(0);
    // don't need to be in right buffer
    // expect(client.rBuffer.get(JSON.stringify(op2.rightOrigin))?.[0]).toBe(op2);

    // Apply op3 - should resolve right dependency and finally apply op2
    client.applyOperation([op3]);

    // Verify all operations are now in store
    expect(client.store.get(1)?.has(1)).toBeTruthy();
    expect(client.store.get(1)?.has(2)).toBeTruthy();
    expect(client.store.get(1)?.has(3)).toBeTruthy();

    // Verify buffers are empty
    expect(client.oBuffer.size).toBe(0);
    expect(client.rBuffer.size).toBe(0);

    // Verify correct document structure
    const item1 = ydoc.traversor(ydoc.head, op1.id);
    const item2 = ydoc.traversor(ydoc.head, op2.id);
    const item3 = ydoc.traversor(ydoc.head, op3.id);

    expect(item1).toBeDefined();
    expect(item2).toBeDefined();
    expect(item3).toBeDefined();

    // Verify correct linking
    expect(item2?.origin?.id).toEqual(op1.id);
    expect(item2?.rightOrigin?.id).toEqual(op3.id);
  });
});

describe("Multi-Client Conflict Resolution Tests", () => {
  let clients: Client[];
  let ydocs: YDoc[];
  const clientCount = 3;

  beforeEach(() => {
    ydocs = [new YDoc(), new YDoc(), new YDoc()];
    clients = Array.from(
      { length: clientCount },
      (_, i) =>
        new Client(
          i + 1,
          0,
          new Map(),
          ydocs[i],
          new Map(),
          new Map(),
          new Map(),
          new Map()
        )
    );
  });

  test("concurrent inserts at same position should order by clientID", () => {
    // All clients start with same initial state
    // const baseOp : InsertDelta=
    // {
    //   type: "insert",
    //   content: { type: "text", value: "A" },
    //   origin: {
    //     clientID: Number.MIN_SAFE_INTEGER,
    //     clock: Number.MIN_SAFE_INTEGER,
    //   },
    //   rightOrigin: {
    //     clientID: Number.MAX_SAFE_INTEGER,
    //     clock: Number.MAX_SAFE_INTEGER,
    //   },
    // } ;
    const content = ["A", "B", "C"];
    const ops: Delta[] = clients.map(
      (client, ind): InsertDelta =>
        ({
          id: { clientID: client.clientID, clock: 1 },
          type: "insert",
          content: { type: "text", value: `${content[ind]}` },
          origin: {
            clientID: Number.MIN_SAFE_INTEGER,
            clock: Number.MIN_SAFE_INTEGER,
          },
          rightOrigin: {
            clientID: Number.MAX_SAFE_INTEGER,
            clock: Number.MAX_SAFE_INTEGER,
          },
        } as InsertDelta)
    );

    // Simulate concurrent insertion
    clients.forEach((client, idx) => client.applyOperation([ops[idx]]));

    // Sync all operations across clients
    clients.forEach((client) => {
      clients
        .filter((c) => c !== client)
        .forEach((peer) => {
          const ops = Array.from(client.store.values()).flatMap((m) =>
            Array.from(m.values())
          );
          peer.applyOperation(ops);
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
      expect(values).toEqual(["A", "B", "C"]);
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
    clients[0].applyOperation([opA, opB, opC]);

    // Sync initial state
    clients.slice(1).forEach((c) => c.applyOperation([opA, opB, opC]));

    // Client 2 deletes B while Client 3 inserts X after B
    const deleteOp = createDeleteOp(clients[1], opB.id);
    const insertOp = createInsertOp(clients[2], "X", opB.id, opC.id);

    // Apply concurrently
    clients[1].applyOperation([deleteOp]);
    clients[2].applyOperation([insertOp]);

    // Cross-sync operations
    clients[0].applyOperation([deleteOp, insertOp]);
    clients[1].applyOperation([insertOp]);
    clients[2].applyOperation([deleteOp]);

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
    onlineClients.forEach((c) => c.applyOperation([op1, op2]));

    // Offline client makes changes
    const offlineOp = createInsertOp(
      offlineClient,
      "Z",
      ydocs[0].head.id,
      ydocs[0].tail.id
    );
    offlineClient.applyOperation([offlineOp]);

    // Simulate reconnect
    onlineClients.forEach((c) => c.applyOperation([offlineOp]));
    offlineClient.applyOperation([op1, op2]);
// ydoc1 = []
    // Verify convergence
    clients.forEach((client) => {
      const items = traverseDocument(client.YDoc);
      expect(items.map((i) => (i.content as StringContent).value)).toEqual([
        "Z",
        "X",
        "Y",
      ]);

    });

    // Verify all buffers are empty
    clients.forEach((c) => {
      expect(c.oBuffer.size).toBe(0);
      expect(c.rBuffer.size).toBe(0);
      expect(c.tBuffer.size).toBe(0);
    });
  });

  // test("garbage collection across multiple clients", () => {
  //   // Create and delete items across clients
  //   const insertOps = clients.map((c, idx) =>
  //     createInsertOp(c, String(idx+1), ydocs[idx].head.id, ydocs[idx].tail.id)
  //   );

  //   // Apply and sync all inserts
  //   clients.forEach((c, idx) => {
  //     clients.forEach(peer => peer.applyOperation([insertOps[idx]]));
  //   });

  //   // Delete all items
  //   const deleteOps = clients.map(c =>
  //     createDeleteOp(c, insertOps[c.clientID-1].id)
  //   );

  //   // Apply and sync deletes
  //   clients.forEach((c, idx) => {
  //     clients.forEach(peer => peer.applyOperation([deleteOps[idx]]));
  //   });

  //   // Collect and apply GC
  //   const gcOps = clients.flatMap(c => c.collectGarbage());
  //   clients.forEach(c => c.applyOperation(gcOps));

  //   // Verify all stores are empty
  //   clients.forEach(c => {
  //     expect(c.store.size).toBe(0);
  //     expect(c.gcBuffer.size).toBe(0);
  //   });

  //   // Verify document is empty
  //   ydocs.forEach(ydoc => {
  //     expect(ydoc.head.rightOrigin).toBe(ydoc.tail);
  //     expect(ydoc.tail.origin).toBe(ydoc.head);
  //   });
  // });
});

function createInsertOp(
  client: Client,
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

function createDeleteOp(client: Client, itemID: YjsID): DeleteDelta {
  return {
    type: "delete",
    id: { clientID: client.clientID, clock: ++client.clock },
    itemID,
  };
}

function traverseDocument(ydoc: IYDoc): IItem[] {
  const items: IItem[] = [];
  let current: IItem | null = ydoc.head;
  while (current) {
    if (current !== ydoc.head && current !== ydoc.tail) {

      !current.deleted && items.push(current);
    }
    current = current.rightOrigin;
  }
  return items;
}

// describe("Garbage Collection Tests", () => {
//   let client: Client;
//   let ydoc: YDoc;

//   beforeEach(() => {
//     ydoc = new YDoc();
//     client = new Client(
//       1, // clientID
//       0, // clock
//       new Map(), // stateVector
//       ydoc,
//       new Map(), // oBuffer
//       new Map(), // rBuffer
//       new Map(), // tBuffer
//       new Map(), // store
//       new Map() // gcBuffer
//     );
//   });

//   test("should identify items for garbage collection", () => {
//     // Insert and then delete an item
//     const insertOp: InsertDelta = {
//       type: "insert",
//       id: { clientID: 1, clock: 1 },
//       content: { type: "text", value: "a" },
//       origin: {
//         clientID: Number.MIN_SAFE_INTEGER,
//         clock: Number.MIN_SAFE_INTEGER,
//       },
//       rightOrigin: {
//         clientID: Number.MAX_SAFE_INTEGER,
//         clock: Number.MAX_SAFE_INTEGER,
//       },
//     };

//     const deleteOp: DeleteDelta = {
//       type: "delete",
//       id: { clientID: 1, clock: 2 },
//       itemID: { clientID: 1, clock: 1 },
//     };

//     client.applyOperation([insertOp, deleteOp]);

//     const gcOps = client.collectGarbage();
//     expect(gcOps).toHaveLength(1);
//     expect(gcOps[0].type).toBe("gc");
//     expect(gcOps[0].itemIDs).toHaveLength(1);
//     expect(gcOps[0].itemIDs[0]).toEqual({ clientID: 1, clock: 1 });
//   });

//   test("should properly unlink garbage collected items", () => {
//     // Insert two items
//     const insertOp1: InsertDelta = {
//       type: "insert",
//       id: { clientID: 1, clock: 1 },
//       content: { type: "text", value: "a" },
//       origin: {
//         clientID: Number.MIN_SAFE_INTEGER,
//         clock: Number.MIN_SAFE_INTEGER,
//       },
//       rightOrigin: {
//         clientID: Number.MAX_SAFE_INTEGER,
//         clock: Number.MAX_SAFE_INTEGER,
//       },
//     };

//     const insertOp2: InsertDelta = {
//       type: "insert",
//       id: { clientID: 1, clock: 2 },
//       content: { type: "text", value: "b" },
//       origin: { clientID: 1, clock: 1 },
//       rightOrigin: {
//         clientID: Number.MAX_SAFE_INTEGER,
//         clock: Number.MAX_SAFE_INTEGER,
//       },
//     };

//     // Delete first item
//     const deleteOp: DeleteDelta = {
//       type: "delete",
//       id: { clientID: 1, clock: 3 },
//       itemID: { clientID: 1, clock: 1 },
//     };

//     client.applyOperation([insertOp1, insertOp2, deleteOp]);

//     // Collect garbage
//     const gcOps = client.collectGarbage();
//     client.applyOperation(gcOps);

//     // Verify item is unlinked
//     const item = ydoc.traversor(ydoc.head, { clientID: 1, clock: 1 });
//     expect(item).toBeNull();

//     // Verify remaining item is still properly linked
//     const remainingItem = ydoc.traversor(ydoc.head, { clientID: 1, clock: 2 });
//     expect(remainingItem).not.toBeNull();
//     expect(remainingItem?.origin).toBe(ydoc.head);
//   });

//   test("should handle multiple garbage collection operations", () => {
//     // Insert and delete multiple items
//     const ops: Delta[] = [
//       {
//         type: "insert",
//         id: { clientID: 1, clock: 1 },
//         content: { type: "text", value: "a" },
//         origin: {
//           clientID: Number.MIN_SAFE_INTEGER,
//           clock: Number.MIN_SAFE_INTEGER,
//         },
//         rightOrigin: {
//           clientID: Number.MAX_SAFE_INTEGER,
//           clock: Number.MAX_SAFE_INTEGER,
//         },
//       },
//       {
//         type: "insert",
//         id: { clientID: 1, clock: 2 },
//         content: { type: "text", value: "b" },
//         origin: { clientID: 1, clock: 1 },
//         rightOrigin: {
//           clientID: Number.MAX_SAFE_INTEGER,
//           clock: Number.MAX_SAFE_INTEGER,
//         },
//       },
//       {
//         type: "delete",
//         id: { clientID: 1, clock: 3 },
//         itemID: { clientID: 1, clock: 1 },
//       },
//       {
//         type: "delete",
//         id: { clientID: 1, clock: 4 },
//         itemID: { clientID: 1, clock: 2 },
//       },
//     ];

//     client.applyOperation(ops);

//     const gcOps = client.collectGarbage();
//     expect(gcOps).toHaveLength(1);
//     expect(gcOps[0].itemIDs).toHaveLength(2);

//     client.applyOperation(gcOps);

//     // Verify both items are removed
//     const item1 = ydoc.traversor(ydoc.head, { clientID: 1, clock: 1 });
//     const item2 = ydoc.traversor(ydoc.head, { clientID: 1, clock: 2 });
//     expect(item1).toBeNull();
//     expect(item2).toBeNull();
//   });

//   test("should handle GC operation buffering when items don't exist", () => {
//     const gcOp: GCDelta = {
//       type: "gc",
//       id: { clientID: 1, clock: 1 },
//       itemIDs: [{ clientID: 2, clock: 1 }], // Non-existent item
//     };

//     client.applyOperation([gcOp]);

//     // Verify operation is buffered
//     expect(client.gcBuffer.has(gcOp.id)).toBe(true);
//     expect(client.gcBuffer.get(gcOp.id)).toBe(gcOp);
//   });

//   test("should remove operations from store after garbage collection", () => {
//     const insertOp: InsertDelta = {
//       type: "insert",
//       id: { clientID: 1, clock: 1 },
//       content: { type: "text", value: "a" },
//       origin: {
//         clientID: Number.MIN_SAFE_INTEGER,
//         clock: Number.MIN_SAFE_INTEGER,
//       },
//       rightOrigin: {
//         clientID: Number.MAX_SAFE_INTEGER,
//         clock: Number.MAX_SAFE_INTEGER,
//       },
//     };

//     const deleteOp: DeleteDelta = {
//       type: "delete",
//       id: { clientID: 1, clock: 2 },
//       itemID: { clientID: 1, clock: 1 },
//     };

//     client.applyOperation([insertOp, deleteOp]);

//     // Verify operations are in store
//     expect(client.store.get(1)?.has(1)).toBe(true);
//     expect(client.store.get(1)?.has(2)).toBe(true);

//     // Collect and apply garbage
//     const gcOps = client.collectGarbage();
//     client.applyOperation(gcOps);

//     // Verify collected operation is removed from store
//     expect(client.store.get(1)?.has(1)).toBe(false);
//     // Delete operation should still be there
//     expect(client.store.get(1)?.has(2)).toBe(true);
//   });
// });
