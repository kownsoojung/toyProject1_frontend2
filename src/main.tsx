import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import 'dayjs/locale/ko';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { initZodConfig } from "./validation/Validation.tsx";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root")!);

ModuleRegistry.registerModules([AllCommunityModule]);
// Zod 글로벌 설정 한 번 적용
initZodConfig();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
         
            <App />
         
        </LocalizationProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
