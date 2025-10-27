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

