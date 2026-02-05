import { create } from "zustand";

const useContextMenuStore = create((set) => ({
  file: null,
  setFile: (file) => set({ file }),
  x: null,
  setX: (x) => set({ x }),
  y: null,
  setY: (y) => set({ y }),
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export { useContextMenuStore };
