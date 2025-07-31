import { CRDTEditorFacade } from ".";
import { beforeEach, describe, test, expect } from "@jest/globals";
import { QDelta } from "./Q-CRDT/interfaces";
import { Delta, InsertDelta } from "./CRDT/iterfaces";

describe("Facade Layer Integrated Testing", () => {
  let facade: CRDTEditorFacade;
  let qOps: QDelta[];
  let crdtOpss: Delta[];
  beforeEach(() => {
    facade = new CRDTEditorFacade("doc1");
    qOps = [
      { ops: [{ insert: "abdur" }] },
      { ops: [{ retain: 3 }, { retain: 1, attributes: { bold: true } }] },
    ];
    crdtOpss = [
      {
        type: "delete",
        id: { clientID: facade.client.clientID, clock: ++facade.client.clock },
        itemID: {
          clientID: facade.client.clientID,
          clock: facade.client.clock - 1,
        },
      },
    ];
  });

  test("Local Edits", () => {
    const crdts = facade.handleLocalOperations(qOps[0]);
    expect(crdts.length).toBe(1);
    const comp: InsertDelta = {
      type: "insert",
      id: { clientID: facade.client.clientID, clock: facade.client.clock },
      content: { type: "text", value: "abdur" },
      origin: facade.ydoc.head.id,
      rightOrigin: facade.ydoc.tail.origin?.id!,
    };
    // console.log(...crdts);
    // console.log(comp);

    expect(crdts[0]).toEqual(comp);
  });

  test("Remote Edits", () => {
    let qOps: QDelta[] = [
      { ops: [{ insert: "abdur" }] },
      { ops: [{ retain: 3 }, { retain: 1, attributes: { bold: true } }] },
    ];
    const crdts = facade.handleLocalOperations(qOps[0]);
    let crdtOpss: Delta[] = [
      {
        type: "delete",
        id: { clientID: facade.client.clientID, clock: ++facade.client.clock },
        itemID: {
          clientID: facade.client.clientID,
          clock: facade.client.clock - 1,
        },
      },
    ];

    const qs = facade.handleRemoteOperations(crdtOpss);

    expect(qs.ops.length === 1).toBeTruthy();
    expect(qs.ops[0]).toEqual({ delete: 5 });
    // facade.ydoc.traverseAll((item) => {
    //   item.id.clientID === "z" || item.id.clientID === ""
    //     ? null
    //     : console.log(item);
    // });
  });
});

describe("Facade Layer Advanced Scenarios", () => {
  let facade: CRDTEditorFacade;
  beforeEach(() => {
    facade = new CRDTEditorFacade("doc2");
    facade.activeType =
      (facade as any).activeType ||
      (facade.activeType = (global as any).activeTypes?.FREE || "FREE");
  });

  test("Race condition: local and remote edit overlap", () => {
    // Simulate user starts editing
    facade.activeType =
      (global as any).activeTypes?.USER_EDITING || "USER_EDITING";
    // Remote op arrives while user is editing
    const remoteOp = [
      {
        type: "delete",
        id: { clientID: "c1", clock: 1 },
        itemID: { clientID: "c1", clock: 0 },
      },
    ];
    // Should buffer remote op and throw EditorOccupiedError
    expect(() => facade.handleRemoteOperations(remoteOp as any)).toThrow(
      "Editor in use"
    );
    // Now finish local edit and release lock
    facade.activeType = (global as any).activeTypes?.FREE || "FREE";
    // Buffered remote op should be processed now
    expect(() => facade.handleRemoteOperations(remoteOp as any)).not.toThrow();
  });

  test("Buffering: multiple remote ops while editing", () => {
    facade.activeType =
      (global as any).activeTypes?.USER_EDITING || "USER_EDITING";
    const remoteOps = [
      {
        type: "delete",
        id: { clientID: "c1", clock: 1 },
        itemID: { clientID: "c1", clock: 0 },
      },
      {
        type: "delete",
        id: { clientID: "c2", clock: 2 },
        itemID: { clientID: "c2", clock: 1 },
      },
    ];
    // Buffer both ops
    expect(() => facade.handleRemoteOperations([remoteOps[0]] as any)).toThrow(
      "Editor in use"
    );
    expect(() => facade.handleRemoteOperations([remoteOps[1]] as any)).toThrow(
      "Editor in use"
    );
    // Release lock
    facade.activeType = (global as any).activeTypes?.FREE || "FREE";
    // Process buffered ops
    expect(() =>
      facade.handleRemoteOperations([remoteOps[0]] as any)
    ).not.toThrow();
    expect(() =>
      facade.handleRemoteOperations([remoteOps[1]] as any)
    ).not.toThrow();
  });

  test("Editor lock and release: local op sets and releases lock", () => {
    facade.activeType = (global as any).activeTypes?.FREE || "FREE";
    const qOp: QDelta = { ops: [{ insert: "test" }] };
    // Should acquire lock, process, and release
    expect(() => facade.handleLocalOperations(qOp)).not.toThrow();
    expect(facade.activeType).toBe((global as any).activeTypes?.FREE || "FREE");
  });

  test("Editor lock and release: remote op sets and releases lock", () => {
    facade.activeType = (global as any).activeTypes?.FREE || "FREE";
    const remoteOp = [
      {
        type: "delete",
        id: { clientID: "c1", clock: 1 },
        itemID: { clientID: "c1", clock: 0 },
      },
    ];
    // Should acquire lock, process, and release
    expect(() => facade.handleRemoteOperations(remoteOp as any)).not.toThrow();
    expect(facade.activeType).toBe((global as any).activeTypes?.FREE || "FREE");
  });

  test("Simultaneous local and remote operations (true race)", async () => {
    // Reset to FREE
    facade.activeType = (global as any).activeTypes?.FREE || "FREE";
    const qOp: QDelta = { ops: [{ insert: "simul" }] };
    const remoteOp = [
      {
        type: "delete",
        id: { clientID: "c1", clock: 1 },
        itemID: { clientID: "c1", clock: 0 },
      },
    ];
    // Run both operations "simultaneously" using Promise.all and setTimeout
    const localPromise = new Promise((resolve) => {
      setTimeout(() => {
        try {
          facade.handleLocalOperations(qOp);
          resolve("local");
        } catch (e) {
          resolve(e);
        }
      }, 0);
    });
    const remotePromise = new Promise((resolve) => {
      setTimeout(() => {
        try {
          facade.handleRemoteOperations(remoteOp as any);
          resolve("remote");
        } catch (e) {
          resolve(e);
        }
      }, 0);
    });
    const results = await Promise.all([localPromise, remotePromise]);
    // At least one should throw EditorOccupiedError
    const hasOccupiedError = results.some(
      (r) => r instanceof Error && /Editor in use/.test((r as Error).message)
    );
    console.log(results)
    console.log(hasOccupiedError);
    expect(hasOccupiedError).toBe(true);
  });
});
