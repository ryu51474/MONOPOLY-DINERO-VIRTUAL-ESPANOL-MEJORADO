"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket = __importStar(require("ws"));
const messageHandlers_1 = require("./messageHandlers");
// Functions that take a message and decide whether to act on it
const messageHandlers = [messageHandlers_1.authMessage, messageHandlers_1.proposeEvent, messageHandlers_1.proposeEndGame, messageHandlers_1.heartBeat];
// Setup the websocket API
const setupWebsocketAPI = (server) => {
    const wss = new websocket.Server({ server, path: "/api/events" });
    wss.on("connection", (ws) => {
        const userData = {
            gameId: null,
            userToken: null
        };
        ws.on("message", (message) => {
            const incomingMessage = JSON.parse(message);
            messageHandlers.forEach((messageHandler) => {
                messageHandler(ws, userData, incomingMessage);
            });
        });
        ws.on("close", (code, reason) => {
            (0, messageHandlers_1.onMessageStreamClosed)(ws, userData);
        });
    });
};
exports.default = setupWebsocketAPI;
//# sourceMappingURL=index.js.map