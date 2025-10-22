// router.ts
import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import LoginPage from "@/pages/Login";

import MainLayout from "@/layout/MainLayout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import RegisterPage from "@/pages/register";


export const routes: RouteObject[] = [
  {
    path: "/login",
    element: localStorage.getItem("isLoggedIn") === "false" ? <Navigate to="/" /> : <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },
  {
    path: "/",
    element: localStorage.getItem("isLoggedIn") === "true" ? <MainLayout /> : <Navigate to="/login" />,
    children: [
      { index: true, element: <DashboardPage /> }, // 기본 탭
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
