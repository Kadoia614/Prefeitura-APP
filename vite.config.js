import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.16.80',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.16.80:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    },
    hmr: {
      host: '192.168.16.80',
      port: 5173,
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
