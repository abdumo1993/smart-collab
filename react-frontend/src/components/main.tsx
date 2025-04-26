import React, { useEffect, useRef, useState } from "react";
import Editor from "./editor";
import Quill from "quill";

// Get Delta from Quill
const Delta = Quill.import("delta");

const Main: React.FC = () => {
  const [range, setRange] = useState<any>(undefined);
  const [lastChange, setLastChange] = useState<any>(undefined);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill | null>(null);

  return (
    <div className="flex flex-row items-center">
      <div>
        <Editor
          ref={quillRef}
          readOnly={readOnly}
          defaultValue={new Delta()
            .insert("Hello")
            .insert("\n", { header: 1 })
            .insert("Some ")
            .insert("initial", { bold: true })
            .insert(" ")
            .insert("content", { underline: true })
            .insert("\n")}
          onSelectionChange={setRange}
          onTextChange={setLastChange}
        />
        <div className="controls">
          <label>
            Read Only:{" "}
            <input
              type="checkbox"
              checked={readOnly}
              onChange={(e) => setReadOnly(e.target.checked)}
            />
          </label>
          <button
            className="controls-right"
            type="button"
            onClick={() => {
              alert(quillRef.current?.getLength());
            }}
          >
            Get Content Length
          </button>
        </div>
        <div className="state">
          <div className="state-title">Current Range:</div>
          {range ? JSON.stringify(range) : "Empty"}
        </div>
        <div className="state">
          <div className="state-title">Last Change:</div>
          {lastChange ? JSON.stringify(lastChange.ops) : "Empty"}
        </div>
      </div>
    </div>
  );
};
export default Main;
