import { RouterProvider } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { createAppRouter } from "@/router/router";
import LayoutContextProvider from "@/contexts/LayoutContext";
import { Suspense } from "react";
import { Alert, Spin } from "antd";

export default function App() {
  const { data: menus, isLoading, error } = useMenus();

  if (isLoading || !menus) return <Spin tip="로딩중..." />;
  if (error) return  <Alert message="에러" description={(error as Error).message} type="error" />;

  const router = createAppRouter(menus);

  return (
    <LayoutContextProvider>
      <Suspense fallback={<div>페이지 로딩중...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </LayoutContextProvider>
  );
}
