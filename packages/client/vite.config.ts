import react from "@vitejs/plugin-react";
import os from "os";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// Función para obtener la IP local dinámicamente
function getLocalIP(): string {
  try {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]!) {
        // Skip internal (loopback) addresses
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
  } catch {
    // Si no puede obtener IP, usa localhost
  }
  return "localhost";
}

// Obtener IP local para configurar Vite
const localIP = getLocalIP();

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    outDir: "build",
    // Since we are using workspaces, we also need to include files outside of this projects root
    commonjsOptions: { include: [/packages\/game-state/, /node_modules/] }
  },
  server: {
    port: 3000,
    host: true, // Escucha en todas las interfaces para permitir conexiones desde otros dispositivos
    proxy: {
      "/api": {
        target: `http://${localIP}:3000`,
        changeOrigin: true,
        ws: true // Habilitar WebSocket proxy
      }
    }
  },
  preview: {
    port: 3000,
    host: true
  },
  optimizeDeps: {
    include: ["@monopoly-money/game-state"]
  },
  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "../../node_modules/bootstrap")
    }
  }
});
