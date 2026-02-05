import { create } from "zustand";

const useActiveFileTabStore = create((set) => ({
  activeFileTab: null,
  setActiveFileTab: (path, value, extension) => {
    set({
      activeFileTab: {
        path: path,
        value: value,
        extension: extension,
      },
    });
  },
}));

export { useActiveFileTabStore };
