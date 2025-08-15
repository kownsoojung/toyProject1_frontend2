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
        target: "http://localhost:8080", // 백엔드 서버
        changeOrigin: true,
        secure: false,
      },
    },
  },
});