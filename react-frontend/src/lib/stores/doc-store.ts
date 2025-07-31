import { create } from "zustand";
import { Doc, Collaborator, DocPrivilege } from "@lib/types/doc.types";
import { ApiResponse } from "@lib/types";
import { toast } from "react-toastify";

import {
  fetchExistingDocs,
  fetchCollaborators,
  createDocument,
  inviteUserToDoc,
} from "@lib/repositories/repository";
import {
  activeTypes,
  CRDTEditorFacade,
  persistantState,
} from "@lib/business-logic";
import { indexedDBService } from "@lib/utils/indexeddb-service";
import Quill from "quill";

interface DocState {
  docs: Doc[];
  currentDoc: Doc | null;
  collaborators: Collaborator[];
  isLoading: boolean;
  isDocSaving: boolean;
  counter: number;
  error: string | null;
  editorFacade: CRDTEditorFacade | null;
  quillInstance: Quill | null; // Add quillInstance
  createDoc: () => Promise<{ success: boolean; error?: string }>;
  inviteUser: (
    docId: string,
    email: string,
    privilege: DocPrivilege
  ) => Promise<{ success: boolean; error?: string }>;
  fetchDocs: () => Promise<void>;
  fetchCollaborators: (docId: string) => Promise<void>;
  loadDocument: (docId: string, isSelfCreated?: boolean) => Promise<void>;
  saveCurrentDocumentState: () => Promise<void>;
  disposeCurrentDocument: () => void;
  setCurrentDoc: (doc: Doc | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setQuillInstance: (quill: Quill | null) => void; // Add setQuillInstance
}

const useDocStore = create<DocState>()((set, get) => ({
  docs: [],
  currentDoc: null,
  collaborators: [],
  isLoading: false,
  isDocSaving: false,
  error: null,
  counter: 0,
  editorFacade: null,
  quillInstance: null, // Initialize quillInstance
  createDoc: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: ApiResponse<Doc> = await createDocument();

      if (response.success) {
        set((state) => ({
          docs: [...state.docs, response.data!],
          // currentDoc: response.data!,
          // editorFacade: new CRDTEditorFacade(response.data!.docId, true),
          isLoading: false,
        }));

        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },
  inviteUser: async (docId: string, email: string, privilege: DocPrivilege) => {
    set({ isLoading: true, error: null });
    try {
      const response: ApiResponse<any> = await inviteUserToDoc(
        docId,
        email,
        privilege
      );
      if (response.success) {
        set({ isLoading: false });
        return { success: true };
      } else {
        set({ error: response.message, isLoading: false });
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },
  fetchDocs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: ApiResponse<Doc[]> = await fetchExistingDocs();
      if (response.success) {
        set({ docs: response.data || [], isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  fetchCollaborators: async (docId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: ApiResponse<Collaborator[]> = await fetchCollaborators(
        docId
      );
      if (response.success) {
        set({ collaborators: response.data || [], isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  loadDocument: async (docId: string, isSelfCreated: boolean = false) => {
    set({ isLoading: true, error: null });
    try {
      let facade: CRDTEditorFacade;
      const loadedData = await indexedDBService.loadDocumentState(docId);
      if (loadedData) {
        facade = new CRDTEditorFacade(docId, isSelfCreated);
        facade.loadState(loadedData.crdtState);
        const qdelta = facade.handleRemoteOperations(
          loadedData.crdtState.storedOperations
        );
        console.error("not reaching here");

        const quill = get().quillInstance;
        const quillDelta = qdelta.ops.slice(1);
        if (quill && qdelta) {
          // quill starts with \n always, so remove it from loaded file (elem with clientid y)
          console.log("statebefore: ", quill.getText());
          console.log("quillDelta JSON: ", JSON.stringify(quillDelta));
          // quill.setContents(quillDelta);
          // quill.setContents([]);

          quillDelta.forEach((elem, idx) => {
            // console.log("ids, elem: ", idx, elem);
            console.log("conte: ", quill.getText());
            quill.updateContents(elem);
          });
        }
        console.log("content: ", JSON.stringify(quill?.getContents()));
        // You can use loadedData.metadata here if needed

        console.log("doc state was saved for ", docId, loadedData.crdtState);
      } else {
        facade = new CRDTEditorFacade(docId, true);
      }
      const doc = get().docs.filter((doc) => doc.docId === docId);
      set({ editorFacade: facade, currentDoc: doc[0], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error(err.message || "Failed to load document.");
    }
  },
  saveCurrentDocumentState: async () => {
    const { currentDoc, editorFacade } = get();
    if (!currentDoc || !editorFacade) {
      console.warn("No current document or editor facade to save.");
      return;
    }
    set({ isDocSaving: true });
    try {
      const crdtState = editorFacade.getPersistantStates();
      // For now, an empty map for metadata. You can populate this later.
      await indexedDBService.saveDocumentState(
        currentDoc.docId,
        crdtState,
        new Map()
      );
      set({ isDocSaving: false });
    } catch (err: any) {
      set({ error: err.message, isDocSaving: false });
    }
  },
  disposeCurrentDocument: () => {
    set({ editorFacade: null, currentDoc: null });
  },
  setCurrentDoc: (doc: Doc | null) => set({ currentDoc: doc }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error: error }),
  setQuillInstance: (quill: Quill | null) => set({ quillInstance: quill }), // Implement setQuillInstance
}));

export default useDocStore;
// Set activeType to LOADING_FROM_STORAGE if currently FREE, else skip
// if (facade.activeType === activeTypes.FREE) {
//   facade.activeType = activeTypes.LOADING_FROM_STORAGE;
//   // Double-check it was set (if not, something else changed it)
//   if (facade.activeType === activeTypes.LOADING_FROM_STORAGE) {
//     // Get all ops from the store
//     const allOps = Array.from(
//       facade.getPersistantStates().storedOperations
//     );
//     // Convert to Quill Delta using facade's convertor
//     const qdelta = facade.convertor.CrdttoQ(allOps);

//     // Update the content of Quill using this delta
//     const quill = get().quillInstance;

//     if (quill && qdelta) {
//       quill.setContents(qdelta.ops.splice(1));
//     }

//     // console.log("loaded content: ", quill?.getContents());
//   }
//   facade.activeType = activeTypes.FREE;
// }
