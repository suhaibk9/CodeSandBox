import { create } from "zustand";
const useEditorSocketStore = create((set, get) => ({
  editorSocket: null,
  setEditorSocket: (incomingSocket) => {
    set({ editorSocket: incomingSocket });
  },
}));
export { useEditorSocketStore };