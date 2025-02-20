import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permite acesso externo (caso rode em Docker ou outro IP)
    port: 5173,
    strictPort: true, // Garante que use a porta 5173
    hmr: {
      clientPort: 5173, // Se rodar em Docker ou WSL, pode precisar definir manualmente
    },
    proxy: {
      "/api": {
        target: "http://192.168.16.80:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
