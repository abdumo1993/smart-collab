import {
  YjsID,
  StateVector,
  Delta,
  InsertDelta,
  DeleteDelta,
  IClient,
  IYDoc,
  IItem,
  IHelper,
  Content,
  GCDelta,
} from "./types";
class Client implements IClient {
  /**
   * Creates a new Client instance for handling collaborative operations
   * @param clientID - Unique identifier for this client
   * @param clock - Logical clock for operation ordering
   * @param stateVector - Vector clock tracking known operations from all clients
   * @param YDoc - Document instance managing the CRDT structure
   * @param oBuffer - Buffer for operations waiting for their origin dependency
   * @param rBuffer - Buffer for operations waiting for their right origin dependency
   * @param tBuffer - Buffer for delete operations waiting for their target item
   * @param store - Persistent storage of all operations indexed by client ID and clock
   * @param gcBuffer - Buffer for GC operations
   */
  constructor(
    public clientID: number,
    public clock: number,
    public stateVector: StateVector,
    public YDoc: IYDoc, // to be changed
    public oBuffer: Map<string, Delta[]>,
    public rBuffer: Map<string, Delta[]>, // to store operations that are missing a dependency like origin
    public tBuffer: Map<string, Delta>, // to store operations that are missing a dependency like origin
    public store: Map<IItem["id"]["clientID"], Map<YjsID["clock"], Delta>>,
    public gcBuffer: Map<string, Delta> = new Map()
  ) {}

  /**
   * Applies one or more operations to the document, handling dependencies and conflicts
   * @param delta - Array of operations to be applied
   *
   * This method:
   * 1. Processes each operation sequentially
   * 2. Handles insert and delete operations
   * 3. Manages dependent operations in buffers
   * 4. Handles various error cases (missing dependencies, duplicates)
   */
  applyOperation(delta: Delta[]): void {
    // idnetify if it is a single operation or multiple
    while (delta.length > 0) {
      const op = delta.shift()!;
      // Skip if we've already seen this operation
      if (op.type !== "gc" && !this.isNewOperation(op)) {
        continue;
      }

      // check for other dependent oprations
      // origin dependent, right dependent, target dependent
      const oDependent = this.oBuffer.get(JSON.stringify(op.id));
      const rDependent = this.rBuffer.get(JSON.stringify(op.id));
      const tDependent = this.tBuffer.get(JSON.stringify(op.id));
      try {
        if (op.type === "insert") {
          const operation = this.YDoc.insertion(op);
          this.saveToStore(operation);
          this.updateStateVector(operation);
        } else if (op.type === "delete") {
          const operation = this.YDoc.deletion(op);
          this.saveToStore(operation);
          this.updateStateVector(operation);
        } else if (op.type === "gc") {
          const operation = this.YDoc.garbageCollect(op);

          // Remove GC'd items from store first
          for (const itemID of op.itemIDs) {
            const clientMap = this.store.get(itemID.clientID);
            if (clientMap) {
              clientMap.delete(itemID.clock);
              if (clientMap.size === 0) {
                this.store.delete(itemID.clientID);
              }
            }
          }

          // Then save the GC operation
          this.saveToStore(operation);
          this.updateStateVector(operation);
        }
      } catch (e) {
        if (e instanceof OperationAlreadyApplied) {
          continue;
        } else if (e instanceof RightNotFoundError) {
          this.addToRBuffer(op as InsertDelta);
        } else if (e instanceof OriginNotFoundError) {
          this.addToOBuffer(op as InsertDelta);
        } else if (e instanceof ItemDoesntExist) {
          if (op.type === "gc") {
            this.addToGCBuffer(op);
          } else {
            this.addToTBuffer(op);
          }
        } else {
          console.log(e);
        }
      }
      // if there are dependents then add them to delta to be processed
      oDependent &&
        (delta.push(...oDependent!),
        this.oBuffer.delete(JSON.stringify(op.id)));
      rDependent &&
        (delta.push(...rDependent!),
        this.rBuffer.delete(JSON.stringify(op.id)));
      tDependent &&
        (delta.push(tDependent), this.tBuffer.delete(JSON.stringify(op.id)));
    }
  }
  /**
   * Saves an operation to the client's persistent store
   * @param op - Operation to be stored
   * @returns The stored operation
   */
  saveToStore(op: Delta): Delta {
    const clientID = op.id.clientID;
    const clock = op.id.clock;

    // Get or create the map for this clientID
    if (!this.store.has(clientID)) {
      this.store.set(clientID, new Map());
    }

    // Get the clock map and set the operation
    const clockMap = this.store.get(clientID)!;
    clockMap.set(clock, op);
    this.store.set(clientID, clockMap);

    // Update state vector
    this.updateStateVector(op);

    return op;
  }

  /**
   * Adds an insert operation to the origin buffer when its origin dependency is missing
   * @param op - Insert operation to buffer
   */
  addToOBuffer(op: InsertDelta): void {
    this.addToOriginBuffer(this.oBuffer, op, op.origin);
  }

  /**
   * Adds an insert operation to the right origin buffer when its right neighbor dependency is missing
   * @param op - Insert operation to buffer
   */
  addToRBuffer(op: InsertDelta): void {
    this.addToOriginBuffer(this.rBuffer, op, op.rightOrigin);
  }

  /**
   * Adds a delete operation to the target buffer when its target item doesn't exist
   * @param op - Delete operation to buffer
   */
  addToTBuffer(op: Delta): void {
    op.type === "delete" && this.tBuffer.set(JSON.stringify(op.itemID), op);
  }

  /**
   * Helper method to add operations to origin-based buffers (oBuffer and rBuffer)
   * @param buffer - The buffer to add to
   * @param op - The operation to buffer
   * @param keyID - The ID to use as key in the buffer
   */
  private addToOriginBuffer(
    buffer: Map<string, Delta[]>,
    op: InsertDelta,
    keyID: YjsID
  ): void {
    const existing = buffer.get(JSON.stringify(keyID)) || [];
    existing.push(op);
    buffer.set(JSON.stringify(keyID), existing);
  }

  /**
   * Updates the state vector with a new operation
   * @param op - Operation whose clock should be recorded
   */
  private updateStateVector(op: Delta): void {
    const clientClock = this.stateVector.get(op.id.clientID) ?? 0;
    if (op.id.clock > clientClock) {
      this.stateVector.set(op.id.clientID, op.id.clock);
    }
  }

  /**
   * Checks if an operation has been seen before according to the state vector
   * @param op - Operation to check
   * @returns True if operation is new, false if already seen
   */
  private isNewOperation(op: Delta): boolean {
    const clientClock = this.stateVector.get(op.id.clientID) ?? 0;
    return op.id.clock > clientClock;
  }

  /**
   * Merges another client's state vector into this one
   * @param otherStateVector - State vector to merge
   */
  public mergeStateVector(otherStateVector: StateVector): void {
    otherStateVector.forEach((clock, clientID) => {
      const currentClock = this.stateVector.get(clientID) ?? 0;
      if (clock > currentClock) {
        this.stateVector.set(clientID, clock);
      }
    });
  }

  /**
   * Gets operations that the other client hasn't seen based on their state vector
   * @param otherStateVector - State vector to compare against
   * @returns Array of operations to send
   */
  public getMissingOps(otherStateVector: StateVector): Delta[] {
    const missingOps: Delta[] = [];

    this.store.forEach((clockMap, clientID) => {
      const theirClock = otherStateVector.get(clientID) ?? 0;

      clockMap.forEach((op, clock) => {
        if (clock > theirClock) {
          missingOps.push(op);
        }
      });
    });

    return missingOps;
  }

  /**
   * Adds a GC operation to the buffer
   * @param op - GC operation to buffer
   */
  addToGCBuffer(op: GCDelta): void {
    this.gcBuffer.set(JSON.stringify(op.id), op);
  }

  /**
   * Collects garbage by identifying deleted items that can be removed
   * @returns Array of GC operations
   */
  collectGarbage(): GCDelta[] {
    const gcOps: GCDelta[] = [];
    const deletedItems = new Map<number, Set<number>>();

    // Find all deleted items
    this.store.forEach((clockMap, clientID) => {
      clockMap.forEach((op, clock) => {
        if (op.type === "delete") {
          const targetID = op.itemID;
          const targetItem = this.YDoc.traversor(this.YDoc.head, targetID);
          // Only collect if item exists and is marked as deleted
          if (targetItem && targetItem.deleted) {
            if (!deletedItems.has(targetID.clientID)) {
              deletedItems.set(targetID.clientID, new Set());
            }
            deletedItems.get(targetID.clientID)!.add(targetID.clock);
          }
        }
      });
    });

    // Create GC operations for each client's deleted items
    deletedItems.forEach((clocks, clientID) => {
      if (clocks.size > 0) {
        const itemIDs: YjsID[] = Array.from(clocks).map((clock) => ({
          clientID,
          clock,
        }));

        const gcOp: GCDelta = {
          type: "gc",
          id: {
            clientID: this.clientID,
            clock: ++this.clock,
          },
          itemIDs,
        };

        gcOps.push(gcOp);
      }
    });

    return gcOps;
  }

  garbageCollect(op: GCDelta): Delta {
    for (const itemID of op.itemIDs) {
      const item = this.YDoc.traversor(this.YDoc.head, itemID);
      if (!item) throw new ItemDoesntExist();

      // Unlink the item from the list
      const origin = item.origin;
      const rightOrigin = item.rightOrigin;

      if (origin) {
        origin.rightOrigin = rightOrigin;
      }
      if (rightOrigin) {
        rightOrigin.origin = origin;
      }

      // Break item's references
      item.origin = null;
      item.rightOrigin = null;
    }
    return op;
  }
}

/**
 * Represents an item in the CRDT structure with bidirectional links
 */
class Item implements IItem {
  constructor(
    public id: YjsID,
    public origin: IItem | null,
    public rightOrigin: IItem | null,
    public content: Content,
    public deleted: boolean = false
  ) {}
}

/**
 * Implements the core CRDT document structure and operations
 */
class YDoc implements IYDoc {
  /**
   * Creates a new YDoc with sentinel head and tail nodes
   * @param head - The sentinel node at the start of the document
   * @param tail - The sentinel node at the end of the document
   */
  constructor(
    public head: IItem = new Item(
      { clientID: Number.MIN_SAFE_INTEGER, clock: Number.MIN_SAFE_INTEGER },
      null,
      null,
      { type: "noContent", value: null }
    ),
    public tail: IItem = new Item(
      { clientID: Number.MAX_SAFE_INTEGER, clock: Number.MAX_SAFE_INTEGER },
      null,
      null,
      { type: "noContent", value: null }
    )
  ) {
    this.head.rightOrigin = this.tail;
    this.tail.origin = this.head;
  }
  /**
   * Marks an item as deleted in the document
   * @param op - The delete operation to apply
   * @returns The applied delete operation
   * @throws {ItemDoesntExist} If the target item cannot be found
   * @throws {OperationAlreadyApplied} If the item is already deleted
   */
  deletion(op: DeleteDelta): Delta {
    const item = this.traversor(this.head, op.itemID);
    if (!item) throw new ItemDoesntExist();
    if (item.deleted) throw new OperationAlreadyApplied();
    item.deleted = true;

    return op;
  }
  /**
   * Converts an insert operation into an Item instance
   * @param op - The insert operation to convert
   * @param origin - The left neighbor item
   * @param rightOrigin - The right neighbor item
   * @returns A new Item instance
   */
  deltaToItem(op: InsertDelta, origin: IItem, rightOrigin: IItem): IItem {
    return new Item(op.id, origin, rightOrigin, op.content);
    // throw new Error("Method not implemented.");
  }

  /**
   * Inserts a new operation into the document structure while maintaining consistency
   * @param op - The insert operation to be added to the document
   * @returns The inserted operation delta
   * @throws {OriginNotFoundError} If left neighbor (origin) cannot be found
   * @throws {RightNotFoundError} If right neighbor cannot be found
   *
   * This implementation:
   * 1. Locates the origin item through traversal
   * 2. Uses conflict resolution to find correct insertion position
   * 3. Establishes proper bidirectional links between new item and its neighbors
   * 4. Maintains document integrity through exception handling
   */
  insertion(op: InsertDelta): Delta {
    const origin = this.traversor(this.head, op.origin);
    // if origin is not found, let client handle it
    if (!origin) {
      throw new OriginNotFoundError();
    }
    // conflictResolution return the true origin and rightOrigin of item even if there is a conflict
    const [or, item, right] = this.conflictResolution(
      origin,
      op,
      op.rightOrigin
    );

    if (!right) {
      throw new RightNotFoundError();
    }
    or.rightOrigin = item;
    right.origin = item;
    item.origin = or;
    item.rightOrigin = right;
    return op;
  }

  // we expect client to change delta to item before transfering to yjs

  /**
   * Resolves conflicts during insertion by finding the correct position for a new operation
   * @param origin - The item we're starting our traversal from (left neighbor candidate)
   * @param op - The insert operation we're trying to position
   * @param rightOrigin - The target ID for the right neighbor we want to find
   * @returns Array containing [adjusted origin, new item, right neighbor]
   * @throws {OperationAlreadyApplied} If operation ID matches existing item ID
   * @throws {RightNotFoundError} If right origin can't be found in the structure
   *
   * This implementation:
   * 1. Traverses right from origin until finding rightOrigin or reaching tail
   * 2. Maintains idempotency by checking for duplicate operation IDs
   * 3. Adjusts origin pointer when encountering items with greater IDs
   * 4. Returns the final positions for clean insertion
   */
  conflictResolution(
    origin: IItem,
    op: InsertDelta,
    rightOriginID: YjsID
  ): IItem[] {
    let curr: IItem | null = origin;
    let trueOrigin = origin;
    let actualRightOrigin: IItem | null = null;

    // Traverse through existing items to find insertion point
    while (curr && !this.areYjsIDsEqual(curr.id, rightOriginID)) {
      if (this.areYjsIDsLess(curr.id, op.id)) {
        trueOrigin = curr;
      }
      curr = curr.rightOrigin;
    }

    if (!curr || !this.areYjsIDsEqual(curr.id, rightOriginID)) {
      throw new RightNotFoundError();
    }

    // Use trueOrigin's original right neighbor as the actual right origin
    actualRightOrigin = trueOrigin.rightOrigin;

    // Create new item between trueOrigin and its original right neighbor
    const newItem = this.deltaToItem(op, trueOrigin, actualRightOrigin!);

    return [trueOrigin, newItem, actualRightOrigin!];
  }

  private areYjsIDsLess(id1: YjsID, id2: YjsID): boolean {
    return (
      id1.clientID < id2.clientID ||
      (id1.clientID === id2.clientID && id1.clock < id2.clock)
    );
  }
  /**
   * Traverses the document structure to find an item by its ID
   * @param node - Starting node for traversal
   * @param target - ID of the item to find
   * @returns The found item or null if not found
   */
  traversor(node: IItem, target: IItem["id"]): IItem | null {
    let current: IItem | null = node;
    while (current !== null) {
      if (this.areYjsIDsEqual(current.id, target)) {
        return current;
      }
      current = current.rightOrigin;
    }
    return null;
  }
  /**
   * Compares two YjsIDs for equality
   * @param id1 - First ID to compare
   * @param id2 - Second ID to compare
   * @returns True if the IDs are equal
   */
  areYjsIDsEqual(id1: YjsID, id2: YjsID): boolean {
    return id1.clientID === id2.clientID && id1.clock === id2.clock;
  }
  /**
   * Compares two YjsIDs for less than or equal relationship
   * @param id1 - First ID to compare
   * @param id2 - Second ID to compare
   * @returns True if id1 is less than or equal to id2
   */
  areYjsIDsLessOrEqual(id1: YjsID, id2: YjsID): boolean {
    return (
      id1.clientID < id2.clientID ||
      (id1.clientID === id2.clientID && id1.clock <= id2.clock)
    );
  }

  /**
   * Performs garbage collection on deleted items
   * @param op - The garbage collection operation
   * @returns The applied GC operation
   * @throws {ItemDoesntExist} If any target item cannot be found
   */
  garbageCollect(op: GCDelta): Delta {
    for (const itemID of op.itemIDs) {
      const item = this.traversor(this.head, itemID);
      if (!item) throw new ItemDoesntExist();

      // Unlink the item from the list
      const origin = item.origin;
      const rightOrigin = item.rightOrigin;

      if (origin) {
        origin.rightOrigin = rightOrigin;
      }
      if (rightOrigin) {
        rightOrigin.origin = origin;
      }

      // Break item's references
      item.origin = null;
      item.rightOrigin = null;
    }
    return op;
  }
}

// errors
class RightNotFoundError extends Error {
  constructor() {
    super("Right neighbour not found.");
    this.name = "RightNotFound";
  }
}

class OriginNotFoundError extends Error {
  constructor() {
    super("left neighbour not found.");
    this.name = "OriginNotFouond";
  }
}

class OperationAlreadyApplied extends Error {
  constructor() {
    super("opertaion or item already exists and is accounted for.");
    this.name = "OperationAlreadyApplied";
  }
}

class ItemDoesntExist extends Error {
  constructor() {
    super("item doesn't exist");
    this.name = "ItemDoesntExist";
  }
}

export {
  Client,
  Item,
  YDoc,
  RightNotFoundError,
  OriginNotFoundError,
  OperationAlreadyApplied,
  ItemDoesntExist,
};
