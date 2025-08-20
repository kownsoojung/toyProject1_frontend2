import { create } from "zustand";

export interface Menu {
  [x: string]: any;
  id: number;
  centerId: number;
  upperId: number;
  seq: number;
  name: string;
  path: string;
  depth: number;
  useFlag: number;
  isLeaf: number;
}

interface MenuState {
  menus: Menu[];
  setMenus: (menus: Menu[]) => void;
  clearMenus: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  setMenus: (menus) => set({ menus }),
  clearMenus: () => set({ menus: [] }),
}));
