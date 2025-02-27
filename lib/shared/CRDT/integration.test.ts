import {
  Client,
  YDoc,
  RightNotFoundError,
  OriginNotFoundError,
  OperationAlreadyApplied,
} from "./implementations";
import { InsertDelta, DeleteDelta, StringContent, Delta } from "./types";
import { describe, test, expect, beforeEach } from "@jest/globals";

describe("Full System Integration Test", () => {
  let clients: Client[];
  let ydocs: YDoc[];
  const clientCount = 3;

  // Move syncClients here, before the tests
  const syncClients = (source: Client, target: Client) => {
    const missingOps = source.getMissingOps(target.stateVector);
    target.applyOperation(missingOps);
    target.mergeStateVector(source.stateVector);
  };

  const getContent = (ydoc: YDoc): string => {
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

  beforeEach(() => {
    ydocs = Array.from({ length: clientCount }, () => new YDoc());
    clients = Array.from(
      { length: clientCount },
      (_, i) =>
        new Client(
          i + 1, // clientID
          0, // clock
          new Map(), // stateVector
          ydocs[i],
          new Map(), // oBuffer
          new Map(), // rBuffer
          new Map(), // tBuffer
          new Map() // store
        )
    );
  });

  test("complete collaborative editing scenario", () => {
    // Phase 1: Initial concurrent edits
    // Client 1 types "Hello"
    const helloOps = "Hello".split("").map((char, idx) => ({
      type: "insert" as const,
      id: { clientID: 1, clock: idx + 1 },
      content: { type: "text" as const, value: char },
      origin:
        idx === 0
          ? {
              clientID: Number.MIN_SAFE_INTEGER,
              clock: Number.MIN_SAFE_INTEGER,
            }
          : { clientID: 1, clock: idx },
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    }));

    // Client 2 types "World" concurrently
    const worldOps = "World".split("").map((char, idx) => ({
      type: "insert" as const,
      id: { clientID: 2, clock: idx + 1 },
      content: { type: "text" as const, value: char },
      origin:
        idx === 0
          ? {
              clientID: Number.MIN_SAFE_INTEGER,
              clock: Number.MIN_SAFE_INTEGER,
            }
          : { clientID: 2, clock: idx },
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    }));

    // Apply operations locally
    clients[0].applyOperation(helloOps);
    clients[1].applyOperation(worldOps);

    // Phase 2: State Vector Exchange and Sync
    // Each client gets missing ops from others based on state vectors
    syncClients(clients[0], clients[1]);
    syncClients(clients[1], clients[0]);

    // Phase 3: Client 3 comes online late
    // Client 3 should receive all previous operations
    syncClients(clients[0], clients[2]);
    syncClients(clients[1], clients[2]);

    // Phase 4: Concurrent deletions and insertions
    // Client 1 deletes 'H'
    const deleteH: DeleteDelta = {
      type: "delete",
      id: { clientID: 1, clock: 6 },
      itemID: { clientID: 1, clock: 1 },
    };

    // Client 2 inserts '!' at the end
    const insertExclamation: InsertDelta = {
      type: "insert",
      id: { clientID: 2, clock: 6 },
      content: { type: "text", value: "!" },
      origin: { clientID: 2, clock: 5 }, // After 'd' from "World"
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    // Client 3 inserts space between words
    const insertSpace: InsertDelta = {
      type: "insert",
      id: { clientID: 3, clock: 1 },
      content: { type: "text", value: " " },
      origin: { clientID: 1, clock: 5 }, // After "Hello"
      rightOrigin: { clientID: 2, clock: 1 }, // Before "World"
    };

    // Apply concurrent operations
    clients[0].applyOperation([deleteH]);
    clients[1].applyOperation([insertExclamation]);
    clients[2].applyOperation([insertSpace]);

    // Phase 5: Final Sync
    // Sync all clients with each other
    for (let i = 0; i < clientCount; i++) {
      for (let j = 0; j < clientCount; j++) {
        if (i !== j) {
          syncClients(clients[i], clients[j]);
        }
      }
    }

    // Phase 6: Verification
    // Helper function to get document content
    const getContent = (ydoc: YDoc): string => {
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
      [1, 6], // Client 1: 5 inserts + 1 delete
      [2, 6], // Client 2: 5 inserts + 1 insert
      [3, 1], // Client 3: 1 insert
    ]);

    clients.forEach((client) => {
      expectedStateVector.forEach((clock, clientID) => {
        expect(client.stateVector.get(clientID)).toBe(clock);
      });
    });

    // Verify all buffers are empty
    clients.forEach((client) => {
      expect(client.oBuffer.size).toBe(0);
      expect(client.rBuffer.size).toBe(0);
      expect(client.tBuffer.size).toBe(0);
    });
  });

  test("complex dependency and network partition scenarios", () => {
    // Phase 1: Create complex dependency chain
    const op1: InsertDelta = {
      type: "insert",
      id: { clientID: 1, clock: 1 },
      content: { type: "text", value: "A" },
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
      id: { clientID: 2, clock: 1 },
      content: { type: "text", value: "B" },
      origin: op1.id,
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    const op3: InsertDelta = {
      type: "insert",
      id: { clientID: 3, clock: 1 },
      content: { type: "text", value: "C" },
      origin: op2.id,
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    // Simulate out-of-order arrival
    clients[0].applyOperation([op2]); // Should buffer (missing op1)
    clients[0].applyOperation([op3]); // Should buffer (missing op2)
    clients[0].applyOperation([op1]); // Should resolve chain

    // Phase 2: Concurrent deletions of same item
    const delete1: DeleteDelta = {
      type: "delete",
      id: { clientID: 1, clock: 2 },
      itemID: op1.id,
    };

    const delete2: DeleteDelta = {
      type: "delete",
      id: { clientID: 2, clock: 2 },
      itemID: op1.id,
    };

    // Apply concurrent deletes
    clients[1].applyOperation([op1, op2, op3, delete1]);
    clients[2].applyOperation([op1, op2, op3, delete2]);

    // Phase 3: Insert between deleted items
    const insertBetween: InsertDelta = {
      type: "insert",
      id: { clientID: 1, clock: 3 },
      content: { type: "text", value: "X" },
      origin: op1.id,
      rightOrigin: op2.id,
    };

    clients[0].applyOperation([insertBetween]);

    // Phase 4: Simulate network partition
    // Sync only between clients 1-2 and 2-3, creating partial connectivity
    syncClients(clients[0], clients[1]);
    syncClients(clients[1], clients[2]);

    // Phase 5: More concurrent operations during partition
    const partitionOps1: InsertDelta = {
      type: "insert",
      id: { clientID: 1, clock: 4 },
      content: { type: "text", value: "Y" },
      origin: op3.id,
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    const partitionOps2: InsertDelta = {
      type: "insert",
      id: { clientID: 3, clock: 2 },
      content: { type: "text", value: "Z" },
      origin: op3.id,
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    clients[0].applyOperation([partitionOps1]);
    clients[2].applyOperation([partitionOps2]);

    // Phase 6: Network heals - full sync
    for (let i = 0; i < clientCount; i++) {
      for (let j = 0; j < clientCount; j++) {
        if (i !== j) {
          syncClients(clients[i], clients[j]);
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
        clientID: Number.MIN_SAFE_INTEGER,
        clock: Number.MIN_SAFE_INTEGER,
      },
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    }));

    // Apply all concurrently
    clients.forEach((client, i) => client.applyOperation([concurrentOps[i]]));

    // 2. Create long dependency chain
    const chainOps = Array.from({ length: 50 }, (_, i) => ({
      type: "insert" as const,
      id: { clientID: 1, clock: i + 2 },
      content: { type: "text" as const, value: "x" },
      origin: { clientID: 1, clock: i + 1 },
      rightOrigin: {
        clientID: Number.MAX_SAFE_INTEGER,
        clock: Number.MAX_SAFE_INTEGER,
      },
    }));

    // 3. Apply operations in reverse order to test out-of-order handling
    for (let i = chainOps.length - 1; i >= 0; i--) {
      clients[0].applyOperation([chainOps[i]]);
    }

    // Sync all and verify
    for (let i = 0; i < clientCount; i++) {
      for (let j = 0; j < clientCount; j++) {
        if (i !== j) syncClients(clients[i], clients[j]);
      }
    }

    // All documents should be identical
    const content = getContent(ydocs[0]);
    clients.forEach((_, idx) => {
      expect(getContent(ydocs[idx])).toBe(content);
    });
  });
});
