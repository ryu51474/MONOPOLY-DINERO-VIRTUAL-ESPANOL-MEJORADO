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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebsocketAPI = exports.restoreSubRoute = exports.RestoreRoutes = exports.gameSubRoute = exports.GameRoutes = void 0;
const game_1 = __importStar(require("./http/game"));
exports.GameRoutes = game_1.default;
Object.defineProperty(exports, "gameSubRoute", { enumerable: true, get: function () { return game_1.subRoute; } });
const restore_1 = __importStar(require("./http/restore"));
exports.RestoreRoutes = restore_1.default;
Object.defineProperty(exports, "restoreSubRoute", { enumerable: true, get: function () { return restore_1.subRoute; } });
const ws_1 = __importDefault(require("./ws"));
exports.setupWebsocketAPI = ws_1.default;
//# sourceMappingURL=index.js.map