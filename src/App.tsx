import { RouterProvider } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { createAppRouter } from "@/router/router";
import LayoutContextProvider from "@/contexts/LayoutContext";
import { Suspense } from "react";
import { Alert, Spin } from "antd";

export default function App() {
  const { data: menus, isLoading, error } = useMenus();

  // 메뉴 데이터 로딩 중
  if (isLoading || !menus) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="로딩중..." />
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="에러"
          description={(error as Error).message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const router = createAppRouter(menus);

  return (
    <LayoutContextProvider>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Spin size="large" tip="페이지 로딩중..." />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </LayoutContextProvider>
  );
}
