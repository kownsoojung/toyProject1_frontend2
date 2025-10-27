import { RouterProvider } from "react-router-dom";
import { createAppRouter } from "@/router/router";
import LayoutContextProvider from "@/contexts/LayoutContext";
import { Suspense, useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useAppDispatch } from "@/store/hooks";
import { loadUserFromStorage } from "@/store/slices/userSlice";
import "./styles/muiStyle.css"

export default function App() {
  const dispatch = useAppDispatch();
  const router = createAppRouter();

  // 앱 초기화 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

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
