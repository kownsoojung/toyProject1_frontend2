import { RouterProvider } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { createAppRouter } from "@/router/router";
import LayoutContextProvider from "@/contexts/LayoutContext";
import { Suspense } from "react";
import { Alert, CircularProgress, Box, Typography } from "@mui/material";
import "./styles/muiStyle.css"
export default function App() {
  
  const router = createAppRouter();

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
