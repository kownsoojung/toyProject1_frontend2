import { createBrowserRouter, RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@/layout/MainLayout/MainLayout";
import { useMenus } from "@/hooks/useMenus";

// 메뉴 fetch + 캐시 (한 번만 호출)
export function router() {
  const { data: menus, isLoading, error } = useMenus();

  if (isLoading || !menus) return []; // 로딩 중엔 빈 배열 반환
  if (error) throw error;

  const children: RouteObject[] = menus.map(menu => {
    const Component = lazy(() => import(`@/pages/${menu.path}`));
    return {
      path: menu.path === "/" ? undefined : menu.path.substring(1), // index route 처리
      index: menu.index,
      element: <Component />,
    };
  });

  return [
    {
      path: "/",
      element: <MainLayout />,
      children,
    },
  ];
}

// 최종 router 생성
export function createAppRouter() {
  const routes = router();
  return createBrowserRouter(routes);
}