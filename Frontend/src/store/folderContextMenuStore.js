import { create } from "zustand";

const useFolderContextMenuStore = create((set) => ({
  folder: null,
  setFolder: (folder) => set({ folder }),
  x: null,
  setX: (x) => set({ x }),
  y: null,
  setY: (y) => set({ y }),
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export { useFolderContextMenuStore };
