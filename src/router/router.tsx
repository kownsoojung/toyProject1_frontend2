import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "@/layout/MainLayout/MainLayout";
import DashboardPage from "@/pages/Dashboard"; // Dashboard 기본 페이지
import { Menu } from "@/stores/menuStore";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/register";


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

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return [
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/" /> : <LoginPage />,
    },
     {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/login" />,
      children: [
        { index: true, element: <DashboardPage /> },
        ...renderRoutes(),
      ],
    },
  ];
}

export function createAppRouter(menus: Menu[]) {
  return createBrowserRouter(buildRoutes(menus));
}
