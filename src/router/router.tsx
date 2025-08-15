// src/router.tsx
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "@/layout/MainLayout/MainLayout";
import { Menu } from "@/hooks/useMenus";

export function buildRoutes(menus: Menu[]): RouteObject[] {
  
  const renderRoutes = (parentId: number = 0 ): RouteObject[] => {
    return menus
      .filter(menu => menu.upperId === parentId)
      .map(menu => {
        const children = renderRoutes(menu.id);
        
        const Component = lazy(() => import(`@/pages${menu.path}`)); // pages 경로에 맞게 수정
        return {
          path: menu.path === "/" ? undefined : menu.path.substring(1),
          index: menu.index,
          element: <Component />,
          children: children.length ? children : undefined,
        };
      });
  };

  return [
    {
      path: "/",
      element: <MainLayout />,
      children: renderRoutes(),
    },
  ];
}

export function createAppRouter(menus: Menu[]) {
  return createBrowserRouter(buildRoutes(menus));
}
