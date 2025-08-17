// hooks/useMenus.ts

import { useAutoQuery } from "./useAutoQuery";

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
  isLeaf:number;
}

export function useMenus() {
  return useAutoQuery<Menu[]>("menus", "/api/menu/getList");

}