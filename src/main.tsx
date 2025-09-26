import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css"; // antd 스타일 초기화 (v5 기준)
import "./components/AFormItem/AFormItem.css"; // antd 스타일 초기화 (v5 기준)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/ko';
import koKR from 'antd/locale/ko_KR';

const queryClient = new QueryClient();
dayjs.locale('ko'); 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider locale={koKR}> {/* 최상위 래핑 */}
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>
);
