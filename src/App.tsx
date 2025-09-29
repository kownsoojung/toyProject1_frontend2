import { RouterProvider } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { createAppRouter } from "@/router/router";
import LayoutContextProvider from "@/contexts/LayoutContext";
import { Suspense } from "react";
import { Alert, CircularProgress, Box, Typography } from "@mui/material";
import "./styles/muiStyle.css"
export default function App() {
  const { data: menus, isLoading, error } = useMenus();

  // 메뉴 데이터 로딩 중
  if (isLoading || !menus) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={48} />
        <Typography sx={{ mt: 2 }}>로딩중...</Typography>
      </Box>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {(error as Error).message || "알 수 없는 에러가 발생했습니다."}
        </Alert>
      </Box>
    );
  }

  const router = createAppRouter(menus);

  return (
    <LayoutContextProvider>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              flexDirection: "column",
            }}
          >
            <CircularProgress size={48} />
            <Typography sx={{ mt: 2 }}>페이지 로딩중...</Typography>
          </Box>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </LayoutContextProvider>
  );
}
