import { useEffect } from "react";
import { useAutoQuery } from "./useAutoQuery";
import { MenuAgentDTO, MenuControllerApi } from "../generate";
import { Menu, useMenuStore } from "../stores/menuStore";
// DTO → 내부 모델로 변환 함수
function mapMenu(dto: MenuAgentDTO): Menu {
  return {
    id: dto.id ?? 0,
    centerId: dto.centerId ?? 0,
    upperId: dto.upperId ?? 0,
    seq: dto.seq ?? 0,
    name: dto.name ?? "",
    path: dto.path ?? "",
    depth: dto.depth ?? 0,
    useFlag: dto.useFlag ?? 0,
    isLeaf: dto.isLeaf ?? 0,
  };
}

export function useMenus() {
  const setMenus = useMenuStore((state) => state.setMenus);
  const menuApi = new MenuControllerApi();
  
  useEffect(() => {
    
    const fetchMenus = async () => {
      try {
        const res = await menuApi.getList();       // MenuControllerApi에서 getList 호출
        const menus = res.data.map(mapMenu);       // DTO → 내부 모델 변환
        setMenus(menus);                           // Zustand store에 저장
      } catch (err) {
        console.error("Menu API error:", err);
      }
    };

    fetchMenus();
  }, [setMenus]);


  const menus = useMenuStore((state) => state.menus);
  return { data: menus, isLoading: false, error: null };
}
