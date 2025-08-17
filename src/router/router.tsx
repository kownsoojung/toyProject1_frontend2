import { createBrowserRouter, RouteObject } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "@/layout/MainLayout/MainLayout";
import DashboardPage from "@/pages/Dashboard"; // Dashboard 기본 페이지
import { Menu } from "@/hooks/useMenus";

export function buildRoutes(menus: Menu[]): RouteObject[] {
  const renderRoutes = (parentId: number = 0): RouteObject[] => {
    return menus
      .filter(menu => menu.upperId === parentId)
      .map(menu => {
        const children = renderRoutes(menu.id);
        const modules = import.meta.glob("/src/pages/**/*.tsx");
        let Component: React.LazyExoticComponent<React.ComponentType<any>> | undefined;

        if (menu.path) {
          const importKey = `/src/pages${menu.path}.tsx`;
          if (modules[importKey]) {
            Component = lazy(modules[importKey] as () => Promise<{ default: React.ComponentType<any> }>);
          } else {
            console.warn(`Page not found for path: ${importKey}`);
          }
        }

        return {
          path: menu.path ? menu.path.substring(1) : "",
          element: Component ? <Component /> : undefined,
          children: children.length ? children : undefined,
        };
      });
  };

  return [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true, // 기본 페이지
          element: <DashboardPage />, // / 접속 시 Dashboard 보여줌
        },
        ...renderRoutes(), // 메뉴 기반 라우트
      ],
    },
  ];
}

export function createAppRouter(menus: Menu[]) {
  return createBrowserRouter(buildRoutes(menus));
}
