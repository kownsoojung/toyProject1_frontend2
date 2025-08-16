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
        
        const modules = import.meta.glob("/src/pages/**/*.tsx"); 

        const Component = lazy(modules[`/src/pages${menu.path}.tsx`] as () => Promise<{ default: React.ComponentType<any> }>);
        return {
          path: menu.path === null ? undefined : menu.path.substring(1),
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
