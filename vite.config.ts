import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",  // 백엔드 서버 주소로 바꿔주세요
        changeOrigin: true,
        secure: false,
      },
    },
  },
});