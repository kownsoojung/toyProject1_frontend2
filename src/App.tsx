import { RouterProvider, createBrowserRouter, RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@/layout/MainLayout/MainLayout";
import { useMenus } from "@/hooks/useMenus";


export default function App() {
  const { data: menus, isLoading, error } = useMenus();

  if (isLoading || !menus) return <div>로딩중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  const createRoutes = (parentId?: number): RouteObject[] => {
    return menus
      .filter(menu => menu.upperId === parentId)
      .map(menu => {
        const Component = lazy(() => import(`@/pages/${menu.component}`));
        return {
          path: menu.path === "/" ? undefined : menu.path.substring(1),
          index: menu.index || false,
          element: <Component />,
          children: createRoutes(menu.id) || undefined, // 재귀적으로 하위 메뉴 처리
        };
      });
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: createRoutes(),
    },
  ]);

  return (
    <Suspense fallback={<div>페이지 로딩중...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}