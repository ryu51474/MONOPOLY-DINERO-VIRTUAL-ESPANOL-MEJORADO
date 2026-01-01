"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subRoute = void 0;
const express_1 = __importDefault(require("express"));
const gameStore_1 = __importDefault(require("../../gameStore"));
exports.subRoute = "/api/game";
const router = express_1.default.Router();
// Create a new game
router.post("/", (req, res) => {
    const { name } = req.body;
    const { gameId, userToken, playerId } = gameStore_1.default.createGame(name);
    const response = { gameId, userToken, playerId };
    res.json(response);
    res.end();
});
// Join a game
router.post("/:gameId", (req, res) => {
    const { gameId } = req.params;
    const { name } = req.body;
    if (!gameStore_1.default.doesGameExist(gameId)) {
        res.status(404).send("El juego no existe");
    }
    else if (!gameStore_1.default.getGame(gameId).isGameOpen()) {
        res.status(403).send("El juego no está abierto");
    }
    else {
        const game = gameStore_1.default.getGame(gameId);
        const { userToken, playerId } = game.addPlayer(name);
        const response = { gameId, userToken, playerId };
        res.json(response);
    }
    res.end();
});
// Get game status
router.get("/:gameId", (req, res) => {
    const { gameId } = req.params;
    const userToken = req.get("Authorization");
    if (userToken === undefined) {
        res.status(401).send("Autorización no proporcionada");
    }
    else if (!gameStore_1.default.doesGameExist(gameId)) {
        res.status(404).send("El juego no existe");
    }
    else if (!gameStore_1.default.getGame(gameId).isUserInGame(userToken)) {
        res.status(401).send("No tienes permiso para realizar esta operación");
    }
    else {
        const game = gameStore_1.default.getGame(gameId);
        const state = game.getGameState();
        res.json(state);
    }
    res.end();
});
exports.default = router;
//# sourceMappingURL=game.js.map