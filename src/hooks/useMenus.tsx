import { useEffect } from "react";


import { Menu } from "../store/slices/menuSlice";
import { setMenus } from "../store/slices/menuSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { MenuAgentDTO } from "@/api/generated";
import { apiInstance } from "@/api/baseApi";
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
  const dispatch = useAppDispatch();
  const menus = useAppSelector((state) => state.menu.menus);
  
  useEffect(() => {
    // ⭐ 메뉴가 이미 로드되어 있으면 다시 조회하지 않음
    if (menus.length > 0) {
      console.log("📋 메뉴가 이미 로드됨, 재조회 생략");
      return;
    }
    
    const fetchMenus = async () => {
      try {
        console.log("🔄 메뉴 조회 시작...");
        const res = await apiInstance.get<MenuAgentDTO[]>("/api/common/menu/getList");

        const menusData = res.data.map(mapMenu);
        console.log("✅ 조회된 메뉴 데이터:", menusData);
        dispatch(setMenus(menusData));
      } catch (err) {
        console.error("❌ Menu API error:", err);
      }
    };

    fetchMenus();
  }, [dispatch, menus.length]); // menus.length를 dependency에 추가


  return { data: menus, isLoading: false, error: null };
}
