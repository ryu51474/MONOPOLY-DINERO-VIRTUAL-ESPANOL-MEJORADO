import dotenv from "dotenv";
dotenv.config(); // Setup .env

import express from "express";
import * as http from "http";
import path from "path";
import { GameRoutes, gameSubRoute, RestoreRoutes, restoreSubRoute, setupWebsocketAPI } from "./api";
import config from "./config";

// Colores para la terminal
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m"
};

const app = express();
const server = http.createServer(app);

app.set("trust proxy", 1); // Trust first proxy

app.use(express.json());

// Warn if config.server.allowed_origins has not been set
if (config.server.allowed_origins === undefined) {
  console.warn(
    colors.fgYellow + "⚠️  ADVERTENCIA:" + colors.reset +
    " config.server.allowed_origins no está configurado. Esto equivale a CORS = *"
  );
}

// Setup CORS as per server.allowed_origins
app.use((req, res, next) => {
  const origin = (req.get("origin") || req.get("referrer")) ?? "";
  if (
    config.server.allowed_origins === undefined ||
    config.server.allowed_origins.indexOf(origin) !== -1
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Setup the serving of the frontend React app
const clientBuildDirectory = path.join(__dirname, config.client.relative_build_directory);
app.use(express.static(clientBuildDirectory)); // Non-index.html files
config.client.routes.forEach((route) =>
  app.use(route, express.static(path.join(clientBuildDirectory, "index.html")))
);

// REST API Endpoints
app.use(gameSubRoute, GameRoutes);
app.use(restoreSubRoute, RestoreRoutes);

// Websocket handler
setupWebsocketAPI(server);

// Helper function to get local IP address
function getLocalIP(): string {
  const { networkInterfaces } = require("os");
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      // Skip internal (loopback) addresses
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const port = Number(config.server.port) || 3000;

// Imprimir banner de inicio
function printBanner(localIP: string) {
  console.clear();
  console.log("");
  console.log(colors.fgCyan + colors.bright + "╔════════════════════════════════════════════════════════════════╗" + colors.reset);
  console.log(colors.fgCyan + colors.bright + "║" + colors.reset + "                    🎲 MONOPOLY MONEY 🎲                   " + colors.fgCyan + colors.bright + "║" + colors.reset);
  console.log(colors.fgCyan + colors.bright + "╚════════════════════════════════════════════════════════════════╝" + colors.reset);
  console.log("");
  console.log(colors.fgGreen + "✅ Servidor iniciado correctamente" + colors.reset);
  console.log("");
  console.log(colors.bright + "📍 ACCESOS DISPONIBLES:" + colors.reset);
  console.log(colors.dim + "   ────────────────────────────────────────────────" + colors.reset);
  console.log("   " + colors.fgGreen + "🌐" + colors.reset + " Local:    " + colors.fgYellow + colors.bright + "http://localhost:" + port + colors.reset + " " + colors.dim + "(Ctrl+Click para abrir)" + colors.reset);
  console.log("   " + colors.fgBlue + "📱" + colors.reset + " Red:      " + colors.fgYellow + colors.bright + "http://" + localIP + ":" + port + colors.reset);
  console.log(colors.dim + "   ────────────────────────────────────────────────" + colors.reset);
  console.log("");
  console.log(colors.fgMagenta + "💡" + colors.reset + " Para acceder desde otro dispositivo, usa la IP de red");
  console.log("   y asegúrate de estar en la misma red WiFi");
  console.log("");
  console.log(colors.fgRed + "🛑" + colors.reset + " Presiona " + colors.bright + "Ctrl+C" + colors.reset + " para detener el servidor");
  console.log("");
  console.log(colors.dim + "   Puerto del servidor: " + port + " | WebSocket: ws://" + localIP + ":" + port + "/api/events" + colors.reset);
  console.log("");
}

server.listen(port, "0.0.0.0", () => {
  const localIP = getLocalIP();
  printBanner(localIP);
});
