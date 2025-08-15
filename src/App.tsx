import { RouterProvider } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { createAppRouter } from "@/router/router";
import LayoutContextProvider from "@/contexts/LayoutContext";
import { Suspense } from "react";

export default function App() {
  const { data: menus, isLoading, error } = useMenus();

  if (isLoading || !menus) return <div>로딩중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  const router = createAppRouter(menus);

  return (
    <LayoutContextProvider>
      <Suspense fallback={<div>페이지 로딩중...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </LayoutContextProvider>
  );
}
