import { useEffect } from "react";
import { useAutoQuery } from "./useAutoQuery";
import { useMenuStore, type Menu } from "@/stores/menuStore";
import type { MenuAgentDTO } from "@/generated";

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

  // useAutoQuery로 API 호출
  const query = useAutoQuery<MenuAgentDTO[]>("menus", "/api/menu/getList");

  useEffect(() => {
    if (query.data) {
      const menus: Menu[] = query.data.map(mapMenu);
      setMenus(menus); // 안전하게 Zustand store에 저장
    }
  }, [query.data, setMenus]);

  const menus = useMenuStore((state) => state.menus);
  return { data: menus, isLoading: query.isLoading, error: query.error };
}
