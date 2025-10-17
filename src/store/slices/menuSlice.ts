import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Menu {
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
}

const initialState: MenuState = {
  menus: [
    
    { id: 1, centerId: 1, upperId: 0, seq: 1, name: "Dashboard", path: "/Dashboard", depth: 1, useFlag: 1, isLeaf: 1 },
    { id: 3, centerId: 1, upperId: 0, seq: 3, name: "Settings", path: "", depth: 1, useFlag: 1, isLeaf: 1 },
    { id: 6, centerId: 1, upperId: 0, seq: 3, name: "회원가입", path: "/register", depth: 1, useFlag: 1, isLeaf: 1 },
    // Users 하위 메뉴
    { id: 4, centerId: 1, upperId: 3, seq: 1, name: "index", path: "/Settings/index", depth: 2, useFlag: 1, isLeaf: 1 },
    { id: 5, centerId: 1, upperId: 3, seq: 2, name: "System", path: "/Settings/System", depth: 2, useFlag: 1, isLeaf: 1 },
     
  ],
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenus: (state, action: PayloadAction<Menu[]>) => {
      state.menus = action.payload;
    },
    clearMenus: (state) => {
      state.menus = [];
    },
    removeMenu: (state, action: PayloadAction<number>) => {
      state.menus = state.menus.filter(menu => menu.id !== action.payload);
    },
  },
});

export const { setMenus, clearMenus, removeMenu } = menuSlice.actions;
export default menuSlice.reducer;

