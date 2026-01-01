"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    client: {
        relative_build_directory: "./client",
        routes: ["/join", "/new-game", "/funds", "/bank", "/history", "/settings"]
    },
    server: {
        allowed_origins: (_a = process.env.SERVER_ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(","),
        port: process.env.PORT || 3000
    }
};
//# sourceMappingURL=config.js.map