import React, { useEffect, useRef, useState } from "react";
import Editor from "./editor";
import { activeTypes } from "@lib/business-logic";
import { NetworkManager } from "@lib/utils/network";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useDocStore from "@lib/stores/doc-store";

// Get Delta from Quill
interface mainProps {
  // received: QDelta;
  // setReveived: React.Dispatch<React.SetStateAction<any>>;s
  className: string;
  docId: string;
}
const EditorComponent: React.FC<mainProps> = ({
  // received,
  // setReveived,
  className,
  docId,
}) => {
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [activeType, setActiveType] = useState(activeTypes.FREE);

  // const facadeRef = useRef<CRDTEditorFacade | null>(null);
  const networkRef = useRef<NetworkManager | null>(null);
  // const quillRef = useRef<Quill | null>(null);
  const prevReadOnlyRef = useRef<boolean>(readOnly);
  const loadDocument = useDocStore((state) => state.loadDocument);
  const editorFacade = useDocStore((state) => state.editorFacade);
  const counter = useDocStore((state) => state.counter);
  const saveCurrentDocumentState = useDocStore(
    (state) => state.saveCurrentDocumentState
  );
  const disposeCurrentDocument = useDocStore(
    (state) => state.disposeCurrentDocument
  );
  const setQuillInstance = useDocStore((state) => state.setQuillInstance);
  const quillInstance = useDocStore((state) => state.quillInstance);

  // Stable callback for setActiveType
  const handleActiveType = React.useCallback((type: activeTypes) => {
    setActiveType(type);
  }, []);

  useEffect(() => {
    // const facade = new CRDTEditorFacade(docId);
    // facade.setActiveTypeCallback(handleActiveType);
    // facadeRef.current = facade;
    console.log("useEffect:?", docId);
    loadDocument(docId);

    return () => {
      disposeCurrentDocument();
    };
  }, [docId, loadDocument, disposeCurrentDocument]);

  useEffect(() => {
    if (!editorFacade) return;

    editorFacade.setActiveTypeCallback(handleActiveType);
    const token = localStorage.getItem("wstoken") || "";
    networkRef.current = NetworkManager.getInstance(token);
    networkRef.current.registerCallback(docId, (ops) => {
      try {
        // const result = facadeRef.current?.handleRemoteOperations(ops);
        const result = editorFacade?.handleRemoteOperations(ops);
        if (result) {
          // setReveived(result);
          quillInstance?.setContents(result.ops.flat()); //error
        }
      } catch (e: any) {
        toast.error(e.message || "Remote operation error");
      }
    });
    networkRef.current.joinDocument(docId);
    return () => {
      networkRef.current?.close();
    };
  }, [docId, editorFacade, handleActiveType, quillInstance]);

  // readOnly is derived directly from activeType

  useEffect(() => {
    setReadOnly(activeType !== activeTypes.FREE);
    // console.log("states: ", readOnly, editorFacade?.activeType);
  }, [activeType, readOnly, editorFacade]);

  useEffect(() => {
    if (prevReadOnlyRef.current && !readOnly) {
      // readOnly changed from true to false
      quillInstance?.focus();
    }
    prevReadOnlyRef.current = readOnly;
  }, [readOnly, quillInstance]);

  const handleTextChange = (delta: any, _oldDelta: any, source: string) => {
    if (source !== "user") return;
    try {
      const result = editorFacade?.handleLocalOperations(delta);
      if (result) {
        networkRef.current?.sendOperations(docId, result);
        saveCurrentDocumentState(); // Trigger save after local changes
      }
    } catch (e: any) {
      toast.error(e.message || "Local operation error");
    }
  };
  return (
    <div className={className}>
      <ToastContainer />
      <div>
        <Editor
          ref={setQuillInstance}
          readOnly={readOnly}
          onSelectionChange={() => {}}
          onTextChange={handleTextChange}
          className="ql-toolbar-hidden"
        />
      </div>
    </div>
  );
};
export default EditorComponent;
