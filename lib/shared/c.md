# Yjs Algorithm Implementation Summary

This summary explains a simplified version of the Yjs algorithm—including its network layer—by demonstrating how multiple clients update their local state and resolve concurrent insertions.

## Setup

- **Clients:** Three clients (c1, c2, c3)
- **Data Structures per Client:**
  - **Linked List (LL):** Each client maintains its own linked list (LL1 for c1, LL2 for c2, LL3 for c3).
  - **Buffer (B):** Each client has a buffer (B1 for c1, B2 for c2, B3 for c3).
- **Notation:**
  - `I`: Insert operation
  - `D`: Delete operation
  - `-+`: Broadcast to all clients
  - `<-`: Receive an update
  - `O`: Origin pointer (points to the left neighbor)
  - `rO`: Right-origin pointer (points to the right neighbor)
  - A node is written as `<n[i]>[O, <content>, rO]` where `n[i]` (e.g., n1, n2, n3, etc.) identifies the node.

---

## Scenario 1: Sequential Insertions

### Step 1: Client c1 Inserts "hellow"

- **Operation:**  
  c1 performs an insert:  
  `I <n1>[head, "hellow", tail]`
- **Updates:**
  - Set `head.rO` to `n1`.
  - Set `tail.O` to `n1`.
- **Broadcast:**  
  `n1` is broadcast to all clients (`-+`).
- **Reception:**  
  Clients c2 and c3 receive the update: `[head, "hellow", tail]`.
- **State:**  
  All linked lists become:  
  `head -> n1 -> tail`

---

### Step 2: Client c2 Inserts "!"

- **Operation:**  
  c2 performs an insert:  
  `I <n2>[n1, "!", tail]`
- **Updates:**
  - Set `n1.rO` to `n2`.
  - Set `tail.O` to `n2`.
- **Broadcast:**  
  `n2` is broadcast to all clients.
- **Reception:**  
  Clients c1 and c3 receive the update: `[n1, "!", tail]`.
- **State:**  
  All linked lists update to:  
  `head -> n1 -> n2 -> tail`

---

### Step 3: Client c3 Inserts "world"

- **Operation:**  
  c3 performs an insert:  
  `I <n3>[n1, "world", n2]`
- **Updates:**
  - Set `n1.rO` to `n3`.
  - Set `n2.O` to `n3`.
- **Broadcast:**  
  `n3` is broadcast to all clients.
- **Reception:**  
  Clients c1 and c2 receive the update: `[n1, "world", n2]`.
- **State:**  
  The linked lists now become:  
  `head -> n1 -> n3 -> n2 -> tail`

- **Client Clocks:**  
  Each client records its state as `(clientID, clock)`, now at `(1,1)`, `(2,1)`, and `(3,1)` respectively.

---

## Handling Conflicts: Concurrent Insertions

### Conflict Scenario: Concurrent Inserts Between n1 and n3

Two clients concurrently insert different content between the same nodes:

- **Insertions:**
  - **Client c1:** Inserts node `n4` with content `,` resulting in:  
    `<n4>[n1, ',', n3]`
  - **Client c2:** Inserts node `n5` with content `;` resulting in:  
    `<n5>[n1, ';', n3]`

### Resolution Steps:

1. **Insert n4 First:**

   - **State Update:**  
     After inserting `n4`, the linked list becomes:  
     `head -> n1 -> n4 -> n3 -> n2 -> tail`
   - **Broadcast & Reception:**  
     All clients eventually update their state to this configuration.

2. **Insert n5 with Conflict Resolution:**
   - **Identify Destination:**
     - Determine `destOrigin` as `n1`.
   - **Find the Correct Insertion Point (rightdest):**
     - **Step 1:**  
       Compare `n1.rO` (currently `n4`) with `n5.rO`.
       - Since `n4` does not match `n5.rO`, perform a lexicographical comparison between `n5` and `n4`:
         - For example, if the version tuples are `(1,2)` for `n5` and `(2,2)` for `n4`, since `(1,2) < (2,2)`, the insertion does not occur immediately after `n1`.
     - **Step 2:**  
       Next, compare `n4.rO` (which is `n3`) with `n5.rO`.
       - If `n4.rO` equals `n3` and matches `n5.rO`, this indicates the correct insertion position.
   - **State Update:**  
     After inserting `n5`, the linked list updates to:  
     `head -> n1 -> n4 -> n5 -> n3 -> n2 -> tail`

---

## Conclusion

This procedural summary shows how the Yjs algorithm manages concurrent inserts across multiple clients:

- **Basic Insertions:** Each client updates its linked list and broadcasts changes.
- **Conflict Resolution:** Concurrent insertions are resolved by comparing metadata (such as lexicographical order of version tuples) to determine the correct insertion point.

This approach ensures that all clients eventually converge to the same linked list structure, achieving consistency across the distributed system.
