"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subRoute = void 0;
const express_1 = __importDefault(require("express"));
exports.subRoute = "/api/restore";
const router = express_1.default.Router();
// Restore a game
router.post("/", (req, res) => {
    console.log("POST /api/restore");
    // TODO
    res.end();
});
exports.default = router;
//# sourceMappingURL=restore.js.map