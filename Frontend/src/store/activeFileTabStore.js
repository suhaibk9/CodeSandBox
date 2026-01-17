import { create } from "zustand";

const useActiveFileTabStore = create((set) => ({
  activeFileTab: null,
  setActiveFileTab: (path, fileName, extension) => {
    set({
      activeFileTab: {
        path: path,
        fileName: fileName,
        extension: extension,
      },
    });
  },
}));

export { useActiveFileTabStore };
