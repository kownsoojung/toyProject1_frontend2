// router.ts
import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import LoginPage from "@/pages/Login";

import MainLayout from "@/layout/MainLayout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import RegisterPage from "@/pages/register";


export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,  // 로그인 페이지는 항상 접근 가능
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },
  {
    path: "/",
    element: <MainLayout />,  // 인증은 MainLayout 내부에서 처리
    children: [
      { index: true, element: <DashboardPage /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
