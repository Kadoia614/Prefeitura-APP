import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite que o servidor seja acessível externamente
    port: 5173, // Porta padrão do Vite
    hmr: {
      host: '192.168.16.80',
      port: 5173,
    }
  },
});
