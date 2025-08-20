import { useAutoQuery } from "./useAutoQuery";
import { useEffect } from "react";
import { Menu, useMenuStore } from "@/stores/menuStore";


export function useMenus() {
  const query = useAutoQuery<Menu[]>("menus", "/api/menu/getList");
  const setMenus = useMenuStore((state) => state.setMenus);

  useEffect(() => {
    if (query.data) {
      setMenus(query.data); // 메뉴 데이터를 Zustand store에 저장
    }
  }, [query.data, setMenus]);

  return query;
}
