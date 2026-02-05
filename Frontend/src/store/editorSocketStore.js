import { create } from "zustand";
import { useActiveFileTabStore } from "./activeFileTabStore";
import { toast } from "react-toastify";
import useTreeStructureStore from "./treeStructureStore";

const useEditorSocketStore = create((set, get) => ({
  editorSocket: null,

  setEditorSocket: (incomingSocket, projectIdFromURL) => {
    const setActiveFileTab = useActiveFileTabStore.getState().setActiveFileTab;
    const setTreeStructure = useTreeStructureStore.getState().setTreeStructure;
    if (incomingSocket) {
      // Listen for when another user joins the project
      incomingSocket.on("userJoined", (data) => {
        console.log("User joined:", data);
        toast.success(data, {
          position: "top-right",
          autoClose: 3000,
        });
      });

      // Listen for file data (when clicking a file)
      incomingSocket.on("fileData", (data) => {
        console.log("Received file data:", data);
        const extension = data.filePath.split(".").pop();
        setActiveFileTab(data.filePath, data.data, extension);
      });

      // Listen for file updates from OTHER clients in the same project
      incomingSocket.on("fileWritten", (data) => {
        console.log("File written by another client:", data);
        const activeFileTab = useActiveFileTabStore.getState().activeFileTab;
        // Only update if this file is currently open
        if (activeFileTab?.path === data.filePath) {
          const extension = data.filePath.split(".").pop();
          setActiveFileTab(data.filePath, data.content, extension);
        }
      });
      incomingSocket.on("fileDeleted", (data) => {
        setTreeStructure();
      });
      incomingSocket.on("fileCreated", (data) => {
        setTreeStructure();
      });
      incomingSocket.on("folderCreated", (data) => {
        setTreeStructure();
      });
      incomingSocket.on("folderDeleted", (data) => {
        setTreeStructure();
      });
      set({ editorSocket: incomingSocket });
    }
  },

  // Action to write file content - just emit, that's it!
  writeFile: (content, filePath) => {
    const socket = get().editorSocket;
    if (socket && filePath) {
      socket.emit("writeFile", content, filePath);
    }
  },
}));

export { useEditorSocketStore };
