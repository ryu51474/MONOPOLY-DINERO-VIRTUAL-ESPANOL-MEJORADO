"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __importDefault(require("./Game"));
const utils_1 = require("./utils");
class GameStore {
    constructor() {
        this.games = {};
    }
    createGame(initialBankersName) {
        // Generate a game id
        const gameId = (0, utils_1.createUniqueGameId)(Object.keys(this.games));
        // Create the game
        const deleteInstance = () => this.deleteGame(gameId);
        this.games[gameId] = new Game_1.default(deleteInstance);
        // Add the user that created this game and set them as a banker
        const game = this.games[gameId];
        const { userToken, playerId } = game.addPlayer(initialBankersName);
        game.setPlayerBankerStatus(playerId, true, playerId);
        // Return the new game id and the users userToken
        return { gameId, userToken, playerId };
    }
    doesGameExist(gameId) {
        return gameId in this.games;
    }
    getGame(gameId) {
        return this.games[gameId];
    }
    deleteGame(gameId) {
        delete this.games[gameId];
    }
}
exports.default = new GameStore();
//# sourceMappingURL=index.js.map