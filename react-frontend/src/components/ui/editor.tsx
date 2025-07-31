import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface EditorProps {
  readOnly?: boolean;
  defaultValue?: any;
  onTextChange?: (...args: any[]) => void;
  onSelectionChange?: (...args: any[]) => void;
  className?: string; // Add className prop
}

// Editor is an uncontrolled React component
const Editor = forwardRef<Quill, EditorProps>(
  (
    { readOnly, defaultValue, onTextChange, onSelectionChange, className },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      if (typeof ref === "function") return;
      ref?.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      // Apply the className to the editorContainer
      if (className) {
        editorContainer.className = className;
      }

      const quill = new Quill(editorContainer, {
        // Quill supports several built-in themes: "snow" (default), "bubble", and "" (no theme).
        // "snow" is the default and most feature-rich; "bubble" is more minimal and chat-like.
        // You can also use "" for no theme and style everything yourself.
        theme: "snow", // Try "bubble" for a minimal, chat-style look. Use "snow" for the default.
        placeholder: "Write something here...",
        // Set the editor background color to white

        modules: {
          toolbar: [
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            // ["link"],
            // Add font size options with numeric values and keep heading option
            [{ header: [1, 2, 3, false] }], // Heading dropdown (h1, h2, h3, normal)
            ["clean"], // remove formatting button
          ],
        },
      });

      if (typeof ref === "function") {
        ref(quill);
      } else {
        ref!.current = quill;
      }

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });
      return () => {
        if (typeof ref !== "function" && ref?.current) {
          ref.current.enable(false); // Disable Quill before clearing
        }
        if (typeof ref !== "function") {
          ref!.current = null;
        } else {
          ref(null);
        }
        container.innerHTML = "";
      };
    }, [ref, className]); // Add className to dependency array

    return <div ref={containerRef}></div>;
  }
);

Editor.displayName = "Editor";

export default Editor;
