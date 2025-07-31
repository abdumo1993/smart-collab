Here’s a clean, structured **Markdown TODO list** version of the improved architecture plan you liked. This is meant for your personal use as a developer working on SmartCollab's AI suggestion + inline diff UI system.

---

# ✅ SmartCollab AI Suggestions – Inline Diff System TODO

## 📦 Phase 1: Diff Computation (Sentence Level)

* [x] ✅ **Choose Sentence-Level Diffing**

  * Cleaner UI
  * Easier accept/reject interaction
* [ ]  **Use `diff-match-patch` or `diff` library**

  * [ ] Configure to work at sentence level
  * [ ] Parse into `[{ type: 'equal' | 'insert' | 'delete', value: '...' }]` format
  * [ ] Store sentence-level diffs with `startIndex`, `endIndex` relative to original Quill content

---

## 🎨 Phase 2: Quill Highlighting and Contextual UI

* [ ]  **Highlight Differences in Quill**

  * [ ] Green background for `insert` sentences
  * [ ] Red strikethrough for `delete` sentences
  * [ ] Keep unchanged (`equal`) text unstyled
* [ ]  **Attach Accept/Reject Buttons**

  * [ ] Add floating buttons at **end of affected sentence**
  * [ ] Each button pair should know the sentence it applies to

---

## 🧠 Phase 3: State Management

* [ ]  **Maintain Diff Metadata Structure**

  ```ts
  type DiffItem = {
    type: 'insert' | 'delete' | 'equal',
    text: string,
    startIndex: number,
    endIndex: number,
    id: string, // UUID or hash
    accepted?: boolean
  }
  ```

  * [ ] Track sentence changes
  * [ ] Store accepted/rejected state
  * [ ] Make this structure reactive (e.g. Zustand, Redux, or simple useState)

---

## 🧮 Phase 4: Positioning of Action Buttons

* [ ]  **Determine Screen Position**

  * [ ] Use `quill.getBounds(index)` to get pixel position of diffed sentence
  * [ ] Overlay a React component (`absolute`, `z-index`) at this position
* [ ]  **Ensure Accept/Reject Button Doesn’t Block Editor Input**

  * [ ] Use `pointer-events: none` on the outer container
  * [ ] Use `pointer-events: auto` on buttons
  * [ ] Pass action through to Quill below (like transparent div in Flutter stack)

---

## 🛠️ Phase 5: Apply/Undo Accepted Suggestions

* [ ]  On **accept**:

  * [ ] Replace original sentence (at `startIndex` to `endIndex`) with the inserted one
* [ ]  On **reject**:

  * [ ] Remove inserted sentence if type was `insert`
  * [ ] Restore deleted sentence if type was `delete`
* [ ]  Update internal state and remove accept/reject UI

---

## 🧪 Phase 6: Testing & UX Polish

* [ ]  Test:

  * [ ] Multiple edits per paragraph
  * [ ] Overlapping/adjacent sentences
  * [ ] Performance with large documents
* [ ]  Smooth transitions (Fade/Slide in accept/reject buttons)
* [ ]  Mobile support / responsiveness

---

## 💡 Future Enhancements (Backlog)

* [ ]  Token-based diffing for code snippets
* [ ]  GitHub Copilot-style inline ghost text with keyboard interaction
* [ ]  Add undo history and revert per change
* [ ]  Versioned AI improvements (view past suggestions)

---

Let me know if you want this converted into **Notion**, **Trello**, or **GitHub Issues** format!
