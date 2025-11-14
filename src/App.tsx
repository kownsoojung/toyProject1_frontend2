import { RouterProvider } from "react-router-dom";
import { createAppRouter } from "@/router/router";
import LayoutContextProvider from "@/contexts/LayoutContext";
import { Suspense, useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useAppDispatch } from "@/store/hooks";
import { loadUserFromStorage, clearUser } from "@/store/slices/userSlice";
import { isTokenExpired } from "@/utils/tokenUtils";
import "./styles/muiStyle.css"

export default function App() {
  const dispatch = useAppDispatch();
  const router = createAppRouter();

  // 앱 초기화 시 토큰 검증 및 사용자 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // ⭐ 만료된 토큰이면 즉시 정리
    if (token && isTokenExpired(token)) {
      console.log("🔴 앱 시작 시 만료된 토큰 감지 - 정리");
      localStorage.clear();
      dispatch(clearUser());
    } else if (token) {
      // 유효한 토큰이면 사용자 정보 복원
      dispatch(loadUserFromStorage());
    }
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
