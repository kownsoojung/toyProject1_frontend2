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
    
    const fetchMenus = async () => {
      try {
        const res = await apiInstance.get<MenuAgentDTO[]>("/api/common/menu/getList"); // OpenAPI 경로

        const menusData = res.data.map(mapMenu);       // DTO → 내부 모델 변환
        dispatch(setMenus(menusData));                 // Redux store에 저장
      } catch (err) {
        console.error("Menu API error:", err);
      }
    };

    fetchMenus();
  }, [dispatch]);


  return { data: menus, isLoading: false, error: null };
}
