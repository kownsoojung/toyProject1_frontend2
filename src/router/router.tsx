// router.ts
import { createBrowserRouter, RouteObject } from "react-router-dom";
import LoginPage from "@/pages/Login";
import MainLayout from "@/layout/MainLayout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import RegisterPage from "@/pages/register";
import { ProtectedRoute } from "./ProtectedRoute";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute requireAuth={false}>
        <RegisterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute requireAuth={true}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
