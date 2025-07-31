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
  BlockStructure,
  BlockHandler,
} from "../CRDT/classes";
import {
  IClient,
  IDocStructure,
  YjsID,
  IDocumentItem,
  InsertDelta,
  IHelper,
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
  IBlockStructure,
  IBlockHandler,
} from "../CRDT/iterfaces";
import {
  OperationConvertor,
  InsertOperationConvertor,
  DeleteOperationConvertor,
  RetainOperationConvertor,
} from "./classes";

import {
  QDelta,
  QdeltaType,
  IOperationConverter,
  IConvertorConfig,
  midDelta,
  midDeltaRecord,
  IMidOpConvertor,
} from "./interfaces";

import { describe, test, expect, beforeEach } from "@jest/globals";
import { v4 as uuidv4 } from "uuid";

const MIN_UUIDv4 = "";
const MAX_UUIDv4 = "z";
describe("Quill-CRDT Operation Conversion", () => {
  let clients: IClient[];
  let ydocs: IDocStructure[];
  let stores: IOperationStore[];
  let buffers: Array<Array<IBufferStore<Map<string, Delta[]>>>>;
  let svs: IStateVectorManager[];
  let handlerConfigs: IHandlerConfig[];
  let convertors: IOperationConverter[];
  let qOperations: QDelta[];
  let blockHandlers: IBlockHandler[];
  let blockStructs: IBlockStructure[];
  const clientCount = 3;

  const equalInsertDeltas = (op1: InsertDelta, op2: InsertDelta) => {
    const helper = new Helper();
    return (
      helper.stringifyYjsID(op1.id) === helper.stringifyYjsID(op2.id) &&
      helper.stringifyYjsID(op1.origin) === helper.stringifyYjsID(op2.origin) &&
      helper.stringifyYjsID(op1.rightOrigin) ===
        helper.stringifyYjsID(op2.rightOrigin) &&
      op1.content.type === op2.content.type &&
      op1.content.type === "text" &&
      op2.content.type === "text" &&
      op1.content.value === op2.content.value &&
      attributeEqual(op1.content.attributes ?? {}, op2.content.attributes ?? {})
    );
  };
  const equalDeleteDeltas = (op1: DeleteDelta, op2: DeleteDelta): boolean => {
    const helper = new Helper();
    return (
      op1.type === op2.type &&
      helper.stringifyYjsID(op1.id) === helper.stringifyYjsID(op2.id) &&
      helper.stringifyYjsID(op1.itemID) === helper.stringifyYjsID(op2.itemID)
    );
  };
  const attributeEqual = (
    attr1: Record<string, any>,
    attr2: Record<string, any>
  ): boolean => {
    let val = true;
    for (let prop in attr1) {
      val = val && attr1[prop] === attr2[prop];
    }
    for (let prop in attr2) {
      if (attr1[prop] === undefined) val = val && false;
    }
    return val;
  };

  // const objectEqual = (
  //   obj1: Record<any, any>,
  //   obj2: Record<any, any>,
  //   value: boolean = true
  // ): boolean => {
  //   for (let props in obj1) {
  //     const prop1 = obj1[props];
  //     const prop2 = obj2[props];
  //     // objects exist for both
  //     if (typeof prop1 === "object" && typeof prop2 === "object") {
  //       value = value && objectEqual(prop1, prop2, value);
  //     }
  //     // if one is not object or the types dont match then false
  //     else {
  //       value = value && prop1 === prop2;
  //     }

  //   }
  //  value = value && Object.keys(obj1).length === Object.keys(obj2).length;
  //   return value;
  // };

  function objectEqual(
    obj1: Record<any, any>,
    obj2: Record<any, any>
  ): boolean {
    // Quick length check
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      // Make sure obj2 has this key
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        return false;
      }

      const val1 = obj1[key];
      const val2 = obj2[key];

      // Handle nested objects (and guard against null)
      const bothObjects =
        val1 !== null &&
        val2 !== null &&
        typeof val1 === "object" &&
        typeof val2 === "object";

      if (bothObjects) {
        // Recursively compare
        if (!objectEqual(val1 as any, val2 as any)) {
          return false;
        }
      } else {
        // Primitives (string or number)
        if (val1 !== val2) {
          return false;
        }
      }
    }

    // All checks passed
    return true;
  }

  // one object one not object
  // else if (typeof prop1 !== "object" && typeof prop2 !== "object") {
  //   value = value && prop1 === prop2;
  // }
  // all props are not object
  // else {
  //   value = value && false;
  // }
  beforeEach(() => {
    ydocs = [new DocStructure(), new DocStructure(), new DocStructure()];
    blockStructs = [
      new BlockStructure(ydocs[0]),
      new BlockStructure(ydocs[1]),
      new BlockStructure(ydocs[2]),
    ];
    blockHandlers = [
      new BlockHandler(ydocs[0], blockStructs[0]),
      new BlockHandler(ydocs[1], blockStructs[1]),
      new BlockHandler(ydocs[2], blockStructs[2]),
    ];
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
              helper,
              blockHandlers[i]
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
              buffers[i][2],
              blockHandlers[i],
              blockStructs[i]
            ),
        },
      ];

      let client: IClient = new Client(
        uuidv4(),
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

    // convertor logic
    convertors = clients.map((client, ind) => {
      const convertorConfigs: IConvertorConfig[] = [
        {
          type: "insert",
          factory: () =>
            new InsertOperationConvertor(
              blockStructs[ind],
              ydocs[ind],
              client,
              new Helper()
            ),
        },
        {
          type: "delete",
          factory: () =>
            new DeleteOperationConvertor(
              blockStructs[ind],
              ydocs[ind],
              client,
              new Helper()
            ),
        },
        {
          type: "retain",
          factory: () =>
            new RetainOperationConvertor(blockStructs[ind], ydocs[ind], client),
        },
      ];
      const convertor = new OperationConvertor(
        ydocs[ind],
        client,
        convertorConfigs
      );
      return convertor;
    });

    // at first a /n char will be created and transmitted to all users from the first user that initiated the doc creation.
    const insertNewLine: InsertDelta = {
      id: { clientID: clients[0].clientID, clock: ++clients[0].clock },
      type: "insert",
      content: { type: "text", value: "\n" },
      origin: {
        clientID: MIN_UUIDv4,
        clock: Number.MIN_SAFE_INTEGER,
      },
      rightOrigin: {
        clientID: MAX_UUIDv4,
        clock: Number.MAX_SAFE_INTEGER,
      },
    };

    clients.forEach((client) => {
      client.applyOps([insertNewLine]);
    });

    // create a few items to allow for easier testing
    const values = ["a", "bc", "def", "gh", "i", "jklmno", "pq"];
    const originalText = values.join("") + "\n";
    values.forEach((val, ind) => {
      const op: InsertDelta = {
        id: { clientID: clients[0].clientID, clock: ++clients[0].clock },
        type: "insert",
        content: { type: "text", value: val },
        origin: {
          clientID: MIN_UUIDv4,
          clock: Number.MIN_SAFE_INTEGER,
        },
        rightOrigin: insertNewLine.id,
      };
      const attr = {
        italic: true,
      };
      ind === 5 && (op.content.attributes = attr);
      clients.forEach((client) => client.applyOps([op]));
    });
  });

  describe("Insert Conversion", () => {
    describe("Document Start", () => {
      test("Converts insert at start with MIN origin", () => {
        // q insert op
        const op1: QdeltaType = {
          insert: "abdu",
          attributes: { bold: true },
        };

        const highOp: QDelta = { ops: [op1] };
        const deltas = convertors[0].QtoCrdt(highOp);
        const delta: InsertDelta = deltas[0] as InsertDelta;
        const compOp: InsertDelta = {
          id: { clientID: clients[0].clientID, clock: clients[0].clock },
          type: "insert",
          content: {
            type: "text",
            value: op1.insert!,
            attributes: { bold: true },
          },

          origin: {
            clientID: MIN_UUIDv4,
            clock: Number.MIN_SAFE_INTEGER,
          },
          rightOrigin: {
            clientID: clients[0].clientID,
            clock: 2,
          },
        };

        // test something
        expect(equalInsertDeltas(delta, compOp)).toBeTruthy();
      });
    });

    describe("Mid-Document", () => {
      // after complete item traversal
      test("Inserts between complete items", () => {
        // a-bc-def-gh-i-jklmno-pq-\n
        const op1: QdeltaType = {
          retain: 3,
        };
        const op2: QdeltaType = {
          insert: "op2",
        };

        const highOp: QDelta = { ops: [op1, op2] };
        const deltas = convertors[0].QtoCrdt(highOp);
        const delta: InsertDelta = deltas[0] as InsertDelta;
        // a-bc-op2-def-gh-i-jklmno-pq-\n
        const compOp: InsertDelta = {
          id: { clientID: clients[0].clientID, clock: clients[0].clock },
          type: "insert",
          content: {
            type: "text",
            value: op2.insert!,
          },

          origin: {
            clientID: clients[0].clientID,
            clock: 3,
          },
          rightOrigin: {
            clientID: clients[0].clientID,
            clock: 4,
          },
        };
        // console.log(delta);
        // console.log(compOp);
        expect(equalInsertDeltas(delta, compOp)).toBeTruthy();
      });

      // in the middle of an item
      test("Splits item for mid-item insert", () => {
        const op1: QdeltaType = {
          retain: 4,
        };
        const op2: QdeltaType = {
          insert: "op2",
        };

        const highOp: QDelta = { ops: [op1, op2] };
        const deltas = convertors[0].QtoCrdt(highOp);
        // const delta: InsertDelta = deltas[0] as InsertDelta;
        // a-b-op2-c-def-gh-i-jklmno-pq-\n
        // d-l-m-r
        const cID = clients[0].clientID;

        const dComp: DeleteDelta = {
          id: { clientID: cID, clock: clients[0].clock - 3 },
          itemID: { clientID: cID, clock: 4 },
          type: "delete",
        };

        const lComp: InsertDelta = {
          id: { clientID: cID, clock: clients[0].clock - 2 },
          type: "insert",
          content: {
            type: "text",
            value: "d",
          },

          origin: {
            clientID: cID,
            clock: 3,
          },
          rightOrigin: {
            clientID: cID,
            clock: 5,
          },
        };
        const mComp: InsertDelta = {
          id: { clientID: cID, clock: clients[0].clock - 1 },
          type: "insert",
          content: {
            type: "text",
            value: "op2",
          },

          origin: {
            clientID: cID,
            clock: 3,
          },
          rightOrigin: {
            clientID: cID,
            clock: 5,
          },
        };
        const rComp: InsertDelta = {
          id: { clientID: cID, clock: clients[0].clock - 0 },
          type: "insert",
          content: {
            type: "text",
            value: "ef",
          },

          origin: {
            clientID: cID,
            clock: 3,
          },
          rightOrigin: {
            clientID: cID,
            clock: 5,
          },
        };
        // console.log(...deltas);
        // console.log(deltas[0], dComp);

        expect(equalDeleteDeltas(deltas[0] as DeleteDelta, dComp)).toBeTruthy();
        expect(equalInsertDeltas(deltas[1] as InsertDelta, lComp)).toBeTruthy();
        expect(equalInsertDeltas(deltas[2] as InsertDelta, mComp)).toBeTruthy();
        expect(equalInsertDeltas(deltas[3] as InsertDelta, rComp)).toBeTruthy();
      });

      // after non existent item (surpass len of the doc in crdt)
      test("Appends at document end", () => {
        // a-bc-def-gh-i-jklmno-pq-\n : len = 18
        // a-bc-def-gh-i-jklmno-pq-\n-op2
        const op1: QdeltaType = {
          retain: 18,
        };
        const op2: QdeltaType = {
          insert: "op2",
        };
        const highOp: QDelta = { ops: [op1, op2] };
        const deltas = convertors[0].QtoCrdt(highOp);

        const compOp: InsertDelta = {
          id: { clientID: clients[0].clientID, clock: 9 },
          type: "insert",
          content: { type: "text", value: "op2" },
          origin: { clientID: clients[0].clientID, clock: 1 },
          rightOrigin: {
            clientID: MAX_UUIDv4,
            clock: Number.MAX_SAFE_INTEGER,
          },
        };

        expect(
          equalInsertDeltas(deltas[0] as InsertDelta, compOp)
        ).toBeTruthy();
      });
    });

    describe("CRDT to Q Operations", () => {
      test("Mid-Document", () => {
        // abcdefghijklmnopq\n
        // a-bc-def-gh-i-jklmno-pq-\n

        const op1: InsertDelta = {
          id: { clientID: clients[0].clientID, clock: clients[0].clock + 1 },
          type: "insert",
          content: {
            type: "text",
            value: "op1",
            attributes: { bold: true },
          },

          origin: {
            clientID: clients[0].clientID,
            clock: 3,
          },
          rightOrigin: {
            clientID: clients[0].clientID,
            clock: 4,
          },
        };

        clients[0].applyOps([op1]);

        const qs = convertors[0].CrdttoQ([op1]);

        const iComp: QDelta = {
          ops: [{ retain: 3 }, { insert: "op1", attributes: { bold: true } }],
        };
        const pass: boolean = objectEqual(qs, iComp);
        expect(pass).toBeTruthy();
      });

      test("Document start", () => {
        // abcdefghijklmnopq\n
        // a-bc-def-gh-i-jklmno-pq-\n

        const op1: InsertDelta = {
          id: { clientID: clients[0].clientID, clock: ++clients[0].clock },
          type: "insert",
          content: {
            type: "text",
            value: "op1",
            attributes: { bold: true },
          },

          origin: ydocs[0].head.id,
          rightOrigin: {
            clientID: clients[0].clientID,
            clock: 2,
          },
        };

        const qs = convertors[0].CrdttoQ([op1]);

        const iComp: QDelta = {
          ops: [{ insert: "op1", attributes: { bold: true } }],
        };
        const pass: boolean = objectEqual(qs, iComp);
        expect(pass).toBeTruthy();
      });
    });
  });

  describe("Delete Conversion", () => {
    // const values = ["a", "bc", "def", "gh", "i", "jklmno", "pq"];
    // a-bc-def-gh-i-jklmno-pq-\n

    describe("Document Start", () => {
      test("Deletes first item", () => {
        // delete a => bc-def-gh-i-jklmno-pq-\n
        // const op1: QdeltaType = {
        //   retain: 2,
        // };
        const op2: QdeltaType = {
          delete: 1,
        };

        const highOp: QDelta = {
          ops: [op2],
        };

        const deltas = convertors[0].QtoCrdt(highOp);

        const compOp: DeleteDelta = {
          type: "delete",
          id: { clientID: clients[0].clientID, clock: clients[0].clock },
          itemID: { clientID: clients[0].clientID, clock: 2 },
        };
        // console.log(compOp, deltas);
        expect(
          equalDeleteDeltas(compOp, deltas[0] as DeleteDelta)
        ).toBeTruthy();
      });
    });
    describe("Mid-Document", () => {
      test("Deletes complete item", () => {
        const op1: QdeltaType = {
          retain: 1,
        };
        const op2: QdeltaType = {
          delete: 2,
        };

        const highOp: QDelta = {
          ops: [op1, op2],
        };

        const deltas = convertors[0].QtoCrdt(highOp);

        const compOp: DeleteDelta = {
          type: "delete",
          id: { clientID: clients[0].clientID, clock: clients[0].clock },
          itemID: { clientID: clients[0].clientID, clock: 3 },
        };
        // console.log(compOp, deltas);
        expect(
          equalDeleteDeltas(compOp, deltas[0] as DeleteDelta)
        ).toBeTruthy();
      });

      test("Splits item for partial delete", () => {
        const op1: QdeltaType = {
          retain: 4,
        };
        const op2: QdeltaType = {
          delete: 1,
        };

        const highOp: QDelta = {
          ops: [op1, op2],
        };

        const cID = clients[0].clientID;
        const deltas = convertors[0].QtoCrdt(highOp);

        const dComp: DeleteDelta = {
          type: "delete",
          id: { clientID: cID, clock: clients[0].clock - 1 },
          itemID: { clientID: cID, clock: 4 },
        };

        const insertComp: InsertDelta = {
          id: { clientID: cID, clock: clients[0].clock - 0 },
          type: "insert",
          content: {
            type: "text",
            value: "df",
          },

          origin: {
            clientID: cID,
            clock: 3,
          },
          rightOrigin: {
            clientID: cID,
            clock: 5,
          },
        };

        // console.log(...deltas);
        expect(equalDeleteDeltas(dComp, deltas[0] as DeleteDelta)).toBeTruthy();
        expect(
          equalInsertDeltas(insertComp, deltas[1] as InsertDelta)
        ).toBeTruthy();
      });
    });
    describe("Multiple Items", () => {
      test("Deletes Multiple items", () => {
        // const values = ["a", "bc", "def", "gh", "i", "jklmno", "pq"];
        const op1: QdeltaType = {
          retain: 2,
        };
        const op2: QdeltaType = {
          delete: 5,
        };
        const highOp: QDelta = {
          ops: [op1, op2],
        };

        const cID = clients[0].clientID;
        const deltas = convertors[0].QtoCrdt(highOp);

        // a-bc-def-gh-i-jklmno-pq-\n
        const comps: Delta[] = [
          {
            id: { clientID: cID, clock: clients[0].clock - 4 },
            itemID: { clientID: cID, clock: 3 },
            type: "delete",
          } as DeleteDelta,
          {
            id: { clientID: cID, clock: clients[0].clock - 3 },
            type: "insert",
            content: { type: "text", value: "b" },
            origin: { clientID: cID, clock: 2 },
            rightOrigin: { clientID: cID, clock: 4 },
          } as InsertDelta,
          {
            id: { clientID: cID, clock: clients[0].clock - 2 },
            type: "delete",
            itemID: { clientID: cID, clock: 4 },
          } as DeleteDelta,
          {
            id: { clientID: cID, clock: clients[0].clock - 1 },
            type: "delete",
            itemID: { clientID: cID, clock: 5 },
          } as DeleteDelta,
          {
            id: { clientID: cID, clock: clients[0].clock - 0 },
            type: "insert",
            content: { type: "text", value: "h" },
            origin: { clientID: cID, clock: 4 },
            rightOrigin: { clientID: cID, clock: 6 },
          } as InsertDelta,
        ];
        let pass: boolean = true;
        comps.forEach((elem, ind) => {
          try {
            if (elem.type == "delete") {
              pass =
                pass &&
                equalDeleteDeltas(
                  elem as DeleteDelta,
                  deltas[ind] as DeleteDelta
                );
            } else {
              pass =
                pass &&
                equalInsertDeltas(
                  elem as InsertDelta,
                  deltas[ind] as InsertDelta
                );
            }
          } catch (e) {
            console.log(e);
          }
        });

        expect(pass).toBeTruthy();
      });
    });

    describe("CRDT to Q Operations", () => {
      test("Mid-Document", () => {
        // abcdefghijklmnopq\n
        // a-bc-def-gh-i-jklmno-pq-\n

        const op1: DeleteDelta = {
          id: { clientID: clients[0].clientID, clock: clients[0].clock + 1 },
          type: "delete",
          itemID: { clientID: clients[0].clientID, clock: 3 },
        };

        clients[0].applyOps([op1]);

        const qs = convertors[0].CrdttoQ([op1]);

        const iComp: QDelta = {
          ops: [{ retain: 1 }, { delete: 2 }],
        };
        const pass: boolean = objectEqual(qs, iComp);
        console.log(...qs.ops);
        expect(pass).toBeTruthy();
      });

      test("Document start", () => {
        // abcdefghijklmnopq\n
        // a-bc-def-gh-i-jklmno-pq-\n

        const op1: DeleteDelta = {
          id: { clientID: clients[0].clientID, clock: clients[0].clock + 1 },
          type: "delete",
          itemID: { clientID: clients[0].clientID, clock: 2 },
        };

        const qs = convertors[0].CrdttoQ([op1]);

        const iComp: QDelta = {
          ops: [{ delete: 1 }],
        };
        const pass: boolean = objectEqual(qs, iComp);
        expect(pass).toBeTruthy();
      });
    });
  });
  describe("Retain Conversion", () => {
    describe("Full Item", () => {
      // const values = ["a", "bc", "def", "gh", "i", "jklmno", "pq"];
      // a-bc-def-gh-i-jklmno-pq-\n

      test("Applies attributes to whole item", () => {
        const op1: QdeltaType = {
          retain: 1,
        };
        const op2: QdeltaType = {
          retain: 2,
          attributes: {
            bold: true,
          },
        };

        const highOp: QDelta = {
          ops: [op1, op2],
        };
        const deltas = convertors[0].QtoCrdt(highOp);
        const cID = clients[0].clientID;
        const dComp: DeleteDelta = {
          type: "delete",
          id: { clientID: cID, clock: clients[0].clock - 1 },
          itemID: { clientID: cID, clock: 3 },
        };
        const iComp: InsertDelta = {
          type: "insert",
          content: { type: "text", value: "bc", attributes: { bold: true } },
          id: { clientID: cID, clock: clients[0].clock },
          origin: { clientID: cID, clock: 2 },
          rightOrigin: { clientID: cID, clock: 4 },
        };

        let pass: boolean =
          equalDeleteDeltas(dComp, deltas[0] as DeleteDelta) &&
          equalInsertDeltas(iComp, deltas[1] as InsertDelta);

        expect(pass).toBeTruthy();
        // console.log(...deltas);
      });
      test("Removes attributes from item", () => {
        // a-bc-def-gh-i-jklmno-pq-\n

        const op1: QdeltaType = {
          retain: 9,
        };
        const op2: QdeltaType = {
          retain: 6,
          attributes: {
            italic: null,
          },
        };

        const highOp: QDelta = {
          ops: [op1, op2],
        };

        const deltas = convertors[0].QtoCrdt(highOp);
        const cID = clients[0].clientID;
        const dComp: DeleteDelta = {
          type: "delete",
          id: { clientID: cID, clock: clients[0].clock - 1 },
          itemID: { clientID: cID, clock: 7 },
        };
        const iComp: InsertDelta = {
          type: "insert",
          content: {
            type: "text",
            value: "jklmno",
            attributes: { italic: null },
          },
          id: { clientID: cID, clock: clients[0].clock },
          origin: { clientID: cID, clock: 6 },
          rightOrigin: { clientID: cID, clock: 8 },
        };
        // console.log(...deltas, dComp, iComp);

        let pass: boolean =
          equalDeleteDeltas(dComp, deltas[0] as DeleteDelta) &&
          equalInsertDeltas(iComp, deltas[1] as InsertDelta);

        expect(pass).toBeTruthy();
      });
    });

    describe("Partial Item", () => {
      test("Splits and formats item segment", () => {
        // a-bc-def-gh-i-jklmno-pq-\n

        const op1: QdeltaType = {
          retain: 9,
        };
        const op2: QdeltaType = {
          retain: 5,
          attributes: {
            italic: null,
          },
        };

        const highOp: QDelta = {
          ops: [op1, op2],
        };

        const deltas = convertors[0].QtoCrdt(highOp);
        const cID = clients[0].clientID;
        const dComp: DeleteDelta = {
          type: "delete",
          id: { clientID: cID, clock: clients[0].clock - 2 },
          itemID: { clientID: cID, clock: 7 },
        };
        const iComp1: InsertDelta = {
          type: "insert",
          content: {
            type: "text",
            value: "jklmn",
            attributes: { italic: null },
          },
          id: { clientID: cID, clock: clients[0].clock - 1 },
          origin: { clientID: cID, clock: 6 },
          rightOrigin: { clientID: cID, clock: 8 },
        };
        const iComp2: InsertDelta = {
          type: "insert",
          content: {
            type: "text",
            value: "o",
            attributes: { italic: true },
          },
          id: { clientID: cID, clock: clients[0].clock },
          origin: { clientID: cID, clock: 6 },
          rightOrigin: { clientID: cID, clock: 8 },
        };

        // console.log(...deltas, dComp, iComp1, iComp2);

        let pass: boolean =
          equalDeleteDeltas(dComp, deltas[0] as DeleteDelta) &&
          equalInsertDeltas(iComp1, deltas[1] as InsertDelta) &&
          equalInsertDeltas(iComp2, deltas[2] as InsertDelta);

        expect(pass).toBeTruthy();
      });
    });
    describe("Multiple Item", () => {
      test("Handles attribute for multiple items", () => {
        const op1: QdeltaType = {
          retain: 1,
        };
        const op2: QdeltaType = {
          retain: 3,
          attributes: { italic: true },
        };

        const highOp: QDelta = {
          ops: [op1, op2],
        };

        const deltas = convertors[0].QtoCrdt(highOp);
        // console.log(...deltas);
        const cID = clients[0].clientID;
        const dComp1: DeleteDelta = {
          type: "delete",
          id: { clientID: cID, clock: clients[0].clock - 4 },
          itemID: { clientID: cID, clock: 3 },
        };
        const iComp1: InsertDelta = {
          type: "insert",
          content: { type: "text", value: "bc", attributes: { italic: true } },
          id: { clientID: cID, clock: clients[0].clock - 3 },
          origin: { clientID: cID, clock: 2 },
          rightOrigin: { clientID: cID, clock: 4 },
        };
        const dComp2: DeleteDelta = {
          type: "delete",
          id: { clientID: cID, clock: clients[0].clock - 2 },
          itemID: { clientID: cID, clock: 4 },
        };
        const iComp2: InsertDelta = {
          type: "insert",
          content: { type: "text", value: "d", attributes: { italic: true } },
          id: { clientID: cID, clock: clients[0].clock - 1 },
          origin: { clientID: cID, clock: 3 },
          rightOrigin: { clientID: cID, clock: 5 },
        };
        const iComp3: InsertDelta = {
          type: "insert",
          content: { type: "text", value: "ef" },
          id: { clientID: cID, clock: clients[0].clock - 0 },
          origin: { clientID: cID, clock: 3 },
          rightOrigin: { clientID: cID, clock: 5 },
        };
        let pass: boolean =
          equalDeleteDeltas(dComp1, deltas[0] as DeleteDelta) &&
          equalInsertDeltas(iComp1, deltas[1] as InsertDelta) &&
          equalDeleteDeltas(dComp2, deltas[2] as DeleteDelta) &&
          equalInsertDeltas(iComp2, deltas[3] as InsertDelta) &&
          equalInsertDeltas(iComp3, deltas[4] as InsertDelta);

        expect(pass).toBeTruthy();
      });
    });
  });

  // describe("Should be able to convert crdt insertDelta to Q insert operations", () => {});
  // describe("Should be able to convert crdt deleteDelta to Q delete operations", () => {});
});
