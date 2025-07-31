import { crdtSerialiser } from "./crdt-serializer";
import { persistantState } from "@lib/business-logic"; // Assuming persistantState is re-exported from here

import { Delta } from "../business-logic/CRDT/iterfaces";
const DB_NAME = "SmartCollabDB";
const DB_VERSION = 1;
const STORE_NAME = "documentStates";

export interface ISerializableDocumentData {
  docId: string;
  crdtState: {
    storedOperations: Delta[];
    rightBufferedOps: [string, Delta[]][];
    originBufferedOps: [string, Delta[]][];
    deletionBufferedOps: [string, Delta[]][];
    gcBufferedOps?: [string, Delta[]][];
    missingOps: string[];

    clientID: string;
    clock: number;
  };
  metadata: [string, string][]; // Store as array of key-value pairs
}

class IndexedDBService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDb();
  }

  private initDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        return resolve(this.db);
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "docId" });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error(
          "IndexedDB error:",
          (event.target as IDBOpenDBRequest).error
        );
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  private async getObjectStore(
    mode: IDBTransactionMode
  ): Promise<IDBObjectStore> {
    const db = await this.initDb();
    const transaction = db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
  }

  async saveDocumentState(
    docId: string,
    crdtState: persistantState,
    metadata: Map<string, any>
  ): Promise<void> {
    try {
      const serializedCrdtState = crdtSerialiser.serialise(crdtState);
      const serializableMetadata = Array.from(metadata.entries());

      const dataToStore: ISerializableDocumentData = {
        docId,
        crdtState: serializedCrdtState,
        metadata: serializableMetadata,
      };

      const store = await this.getObjectStore("readwrite");
      // console.log(
      //   "all ster: ",
      //   (await this.getObjectStore("readwrite")).getAll()
      // );
      // console.log(
      //   "1 ster: ",
      //   (await this.getObjectStore("readwrite")).get("1")
      // );
      await new Promise<void>((resolve, reject) => {
        console.log("saving", dataToStore);

        const request = store.put(dataToStore);

        request.onsuccess = () => resolve();
        request.onerror = (event) => {
          console.error(
            "Error saving document state:",
            (event.target as IDBRequest).error
          );
          reject((event.target as IDBRequest).error);
        };
      });
      console.log(`Document state for ${docId} saved to IndexedDB.`);
    } catch (error) {
      console.error("Failed to save document state:", error);
      throw error;
    }
  }

  async loadDocumentState(docId: string): Promise<{
    crdtState: persistantState;
    metadata: Map<string, any>;
  } | null> {
    try {
      const store = await this.getObjectStore("readonly");
      return new Promise((resolve, reject) => {
        const request = store.get(docId);
        request.onsuccess = () => {
          const result: ISerializableDocumentData = request.result;
          if (result && result.crdtState) {
            console.log("loaded: ", result);
            const deserializedCrdtState = crdtSerialiser.deserialise(
              result.crdtState
            );
            const deserializedMetadata = new Map(result.metadata || []);

            console.log(`Document state for ${docId} loaded from IndexedDB.`);
            resolve({
              crdtState: deserializedCrdtState,
              metadata: deserializedMetadata,
            });
          } else {
            console.log(`No document state found for ${docId} in IndexedDB.`);
            resolve(null);
          }
        };
        request.onerror = (event) => {
          console.error(
            "Error loading document state:",
            (event.target as IDBRequest).error
          );
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error("Failed to load document state:", error);
      throw error;
    }
  }
}

export const indexedDBService = new IndexedDBService();
