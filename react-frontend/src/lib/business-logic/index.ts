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
} from "@lib/business-logic/CRDT/classes";
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
  IBlockStructure,
  IBlockHandler,
} from "@lib/business-logic/CRDT/iterfaces";
import { v4 as uuidv4 } from "uuid";
import {
  OperationConvertor,
  InsertOperationConvertor,
  DeleteOperationConvertor,
  RetainOperationConvertor,
} from "@lib/business-logic/Q-CRDT/classes";

import {
  QDelta,
  QdeltaType,
  IOperationConverter,
  IConvertorConfig,
  midDelta,
  midDeltaRecord,
  IMidOpConvertor,
} from "@lib/business-logic/Q-CRDT/interfaces";
import { ConversionError } from "@lib/business-logic/Q-CRDT/errors";
import { CRDTError } from "@lib/business-logic/CRDT/errors";

//////////////////////////////////////////////////
//////////          Interfaces          //////////
//////////////////////////////////////////////////
interface IFacadeCore {
  handleLocalOperations(op: QDelta): Delta[];
  handleRemoteOperations(ops: Delta[]): QDelta;
}
interface ISyncEngine {
  sendOperations(op: Delta[]): Promise<Delta[]>;
  // send a request to get operations from the server or from other clients using state vectors.
  // to sync after staying offline or just any time.
  receiveOperations(): Promise<Delta[]>;
}

interface IPersistantStateHandler {
  getPersistantStates(): persistantState;
  loadState(state: persistantState): void;
}

export type persistantState = {
  // store
  storedOperations: Delta[];
  // buffers
  rightBufferedOps: Map<string, Delta[]>;
  originBufferedOps: Map<string, Delta[]>;
  deletionBufferedOps: Map<string, Delta[]>;
  gcBufferedOps?: Map<string, Delta[]>;
  // stateVector
  missingOps: string[];

  // client
  clientID: YjsID["clientID"];
  clock: YjsID["clock"];
};

export enum activeTypes {
  USER_EDITING = "USER_EDITING", // The user is actively editing the document
  REMOTE_DELTA = "REMOTE_DELTA", // A delta is being received from other users via WebSocket
  AI_WRITING = "AI_WRITING", // The AI is writing in the document
  LOADING_FROM_STORAGE = "LOADING_FROM_STORAGE",
  FREE = "FREE",
}

export class EditorOccupiedError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "EditorOccupiedError";
  }
}

//////////////////////////////////////////////////
////////////          Classes          ///////////
//////////////////////////////////////////////////
export class CRDTEditorFacade
  implements IFacadeCore, ISyncEngine, IPersistantStateHandler
{
  /**
   * quill to crdt and apply
   * crdt to quill, i.e from remote and apply [can use state and updater with ops as states]
   * sync with other users through backend
   * extendable to other capabilities through interfaces
   */

  // 1. Declare all properties with definite assignment
  public ydoc!: IDocStructure;
  private blockStruct!: IBlockStructure;
  private blockHandler!: IBlockHandler;
  private stateVector!: IStateVectorManager;
  private store!: IOperationStore;
  private rBuffer!: IBufferStore<Map<string, Delta[]>>;
  private oBuffer!: IBufferStore<Map<string, Delta[]>>;
  private tBuffer!: IBufferStore<Map<string, Delta[]>>;
  private helper!: IHelper;
  private conflictResolver!: IConflictResolver;
  private handlerConfigs!: IHandlerConfig[];
  public client!: IClient;
  private convertorConfig!: IConvertorConfig[];
  public convertor!: IOperationConverter;
  public activeType!: activeTypes;
  private remoteBuffer: Delta[] = [];
  private _onActiveTypeChange: (type: activeTypes) => void = () => {};

  constructor(private docId: string, private isSelfCreated: boolean = true) {
    // 2. Initialize in strict dependency order
    this.initializeCoreComponents();
    this.initializeBlockSystem();
    this.initializeClient();
    this.initializeConvertorSystem();
    this.activeType = activeTypes.FREE;
    this._onActiveTypeChange = () => {};
    isSelfCreated &&
      this.client.applyOps([
        {
          type: "insert",
          id: { clientID: "y", clock: ++this.client.clock },
          content: { type: "text", value: "\n" },
          origin: this.ydoc.head.id,
          rightOrigin: this.ydoc.tail.id,
        } as InsertDelta,
      ]);
  }
  loadState(state: persistantState): void {
    // Re-initialize core components with loaded state
    // this.ydoc = state.docStructure;
    // this.blockStruct = state.blockStructure;
    this.initializeCoreComponents();
    // state.storedOperations.forEach((op) =>
    //   this.store.set(op.id.clientID, op.id.clock, op)
    // );
    // imporve ?
    this.rBuffer = new BufferStore(state.rightBufferedOps); // Pass loaded Map directly
    this.oBuffer = new BufferStore(state.originBufferedOps); // Pass loaded Map directly
    this.tBuffer = new BufferStore(state.deletionBufferedOps); // Pass loaded Map directly

    if (state.gcBufferedOps) {
      // this.gcBuffer = new BufferStore(state.gcBufferedOps);
    }

    // Pass loaded Map and helper
    if (state.missingOps && state.missingOps.length > 0) {
      this.stateVector.missingOps = new Set(state.missingOps);
    }

    // this.client.clientID = state.clientID;
    // this.client.clock = state.clock;

    // Re-initialize block handler and client as they depend on the updated structures
    this.initializeBlockSystem(); // Re-creates blockHandler with updated blockStruct and ydoc
    this.initializeClient(state.clientID); // Re-creates client with updated stateVector, buffers, etc.
    this.initializeConvertorSystem(); // Re-creates convertor
    this.client.clock = state.clock;
    console.log(
      "CRDTEditorFacade loaded partial state successfully.",
      this.ydoc
    );
  }
  getPersistantStates(): persistantState {
    // store
    let storedOperations: Delta[] = [...this.store.getAllOps()];
    console.log("stored ops", this.store);
    let rightBufferedOps: Map<string, Delta[]> = this.rBuffer.getAll();
    let originBufferedOps: Map<string, Delta[]> = this.oBuffer.getAll();
    let deletionBufferedOps: Map<string, Delta[]> = this.tBuffer.getAll();
    // let gcBufferedOps: Map<string, Delta[]> = this;
    let missingOps: string[] = [...(this.stateVector.missingOps ?? [])];
    let clientID: YjsID["clientID"] = this.client.clientID;
    let clock: YjsID["clock"] = this.client.clock;

    return {
      storedOperations,
      rightBufferedOps,
      originBufferedOps,
      deletionBufferedOps,
      missingOps,
      clientID,
      clock,
    };
  }

  private initializeCoreComponents() {
    this.ydoc = new DocStructure();
    this.helper = new Helper();
    this.stateVector = new StateVectorManager();
    this.store = new Store();
    this.oBuffer = new BufferStore();
    this.rBuffer = new BufferStore();
    this.tBuffer = new BufferStore();
    this.conflictResolver = new ConflictResolver(this.ydoc);
    console.log("Core Components initialized.");
  }

  private initializeBlockSystem() {
    this.blockStruct = new BlockStructure(this.ydoc);
    this.blockHandler = new BlockHandler(this.ydoc, this.blockStruct);
    console.log("Block System initialized.");
  }

  private initializeClient(id?: YjsID["clientID"]) {
    this.handlerConfigs = [
      {
        type: "insert",
        factory: () =>
          new InsertOperationHandler(
            this.ydoc,
            this.conflictResolver,
            this.store,
            this.stateVector,
            this.oBuffer,
            this.rBuffer,
            this.helper,
            this.blockHandler
          ),
      },
      {
        type: "delete",
        factory: () =>
          new DeleteOperationHandler(
            this.ydoc,
            this.store,
            this.helper,
            this.stateVector,
            this.tBuffer,
            this.blockHandler,
            this.blockStruct
          ),
      },
    ];

    this.client = new Client(
      id ?? uuidv4(),
      0,
      this.stateVector,
      this.oBuffer,
      this.rBuffer,
      this.tBuffer,
      this.helper,
      this.handlerConfigs
    );

    console.log("Client initialized.");
  }

  private initializeConvertorSystem() {
    this.convertorConfig = [
      {
        type: "insert",
        factory: () =>
          new InsertOperationConvertor(
            this.blockStruct,
            this.ydoc,
            this.client,
            this.helper
          ),
      },
      {
        type: "delete",
        factory: () =>
          new DeleteOperationConvertor(
            this.blockStruct,
            this.ydoc,
            this.client,
            this.helper
          ),
      },
      {
        type: "retain",
        factory: () =>
          new RetainOperationConvertor(
            this.blockStruct,
            this.ydoc,
            this.client
          ),
      },
    ];

    this.convertor = new OperationConvertor(
      this.ydoc,
      this.client,
      this.convertorConfig
    );
    console.log("Convertor system initialized.");
  }

  setActiveTypeCallback(cb: (type: activeTypes) => void) {
    this._onActiveTypeChange = cb;
  }
  private _setActiveType(type: activeTypes) {
    this.activeType = type;
    this._onActiveTypeChange?.(type);
  }
  sendOperations(op: Delta[]): Promise<Delta[]> {
    throw new Error("Method not implemented.");
  }
  receiveOperations(): Promise<Delta[]> {
    throw new Error("Method not implemented.");
  }
  handleLocalOperations(op: QDelta): Delta[] {
    console.log("local ops", op);

    if (this.activeType === activeTypes.FREE) {
      this._setActiveType(activeTypes.USER_EDITING);
    }
    if (this.activeType === activeTypes.USER_EDITING) {
      console.log("local edititg");
      try {
        const cOps = this.convertor.QtoCrdt(op);
        console.log("cops: ", cOps);
        const ops = this.client.applyOps(cOps);
        console.log("ops: ", ops);

        this._setActiveType(activeTypes.USER_EDITING);
        // testing purpose. this logic works!
        // setTimeout(() => {
        //   this._setActiveType(activeTypes.FREE);
        // }, 0);
        this._setActiveType(activeTypes.FREE); // Release lock
        // After local op, flush remote buffer if any
        if (this.remoteBuffer.length > 0) {
          this.handleRemoteOperations(this.remoteBuffer);
          this.remoteBuffer = [];
        }
        console.log(ops);
        return ops;
      } catch (e) {
        this._setActiveType(activeTypes.FREE); // Release lock on error
        if (e instanceof ConversionError || e instanceof CRDTError) {
          throw e;
        }
        const msg =
          typeof e === "object" && e && "message" in e
            ? (e as any).message
            : String(e);
        throw new Error("Unknown error in handleLocalOperations: " + msg);
      }
    }
    throw new EditorOccupiedError("Editor in use: " + this.activeType);
  }
  handleRemoteOperations(ops: Delta[]): QDelta {
    if (this.activeType === activeTypes.FREE) {
      this._setActiveType(activeTypes.REMOTE_DELTA);
    }
    if (this.activeType === activeTypes.REMOTE_DELTA) {
      try {
        const cOps = this.client.applyOps(ops);
        // problems here with abdu h1.nef h2.zem remove e of nef and add e with h2 or h1?
        const qOps = this.convertor.CrdttoQ(cOps);

        this._setActiveType(activeTypes.FREE); // Release lock
        return qOps;
      } catch (e) {
        this._setActiveType(activeTypes.FREE); // Release lock on error
        if (e instanceof ConversionError || e instanceof CRDTError) {
          throw e;
        }
        const msg =
          typeof e === "object" && e && "message" in e
            ? (e as any).message
            : String(e);
        throw new Error("Unknown error in handleRemoteOperations: " + msg);
      }
    }
    // Buffer remote ops if user is editing
    this.remoteBuffer.push(...ops);
    throw new EditorOccupiedError("Editor in use: " + this.activeType);
  }
}
