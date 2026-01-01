"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_state_1 = require("@monopoly-money/game-state");
const utils_1 = require("./utils");
class Game {
    constructor(deleteInstance) {
        this.events = []; // Events in this game
        this.subscribedWebSockets = {}; // playerId: event websocket
        this.userTokenToPlayers = {}; // A mapping of ids only known by a user to match to a player
        this.gameState = game_state_1.defaultGameState;
        // Check if a game is open
        this.isGameOpen = () => this.gameState.open;
        // Check if a userToken is in a game
        this.isUserInGame = (userToken) => this.userTokenToPlayers.hasOwnProperty(userToken);
        // Check if a userToken is allowed to make banker actions in a game
        this.isUserABanker = (userToken) => {
            const playerId = this.userTokenToPlayers[userToken];
            const player = this.gameState.players.find((p) => p.playerId === playerId);
            return player !== undefined && player.banker;
        };
        this.getPlayerId = (userToken) => this.userTokenToPlayers[userToken];
        // Add a player to a game and get the new userToken
        this.addPlayer = (name) => {
            // Identify id
            const playerId = (0, utils_1.generateTimeBasedId)();
            const userToken = (0, utils_1.generateRandomId)();
            // Add the player
            const event = {
                type: "playerJoin",
                time: (0, utils_1.getCurrentTime)(),
                actionedBy: playerId,
                playerId,
                name
            };
            this.pushEvent(event);
            // Map the user token to the player id
            this.userTokenToPlayers[userToken] = playerId;
            return { userToken, playerId };
        };
        // Set a player as a banker
        this.setPlayerBankerStatus = (playerId, isBanker, actionedByPlayerId) => {
            const event = {
                type: "playerBankerStatusChange",
                time: (0, utils_1.getCurrentTime)(),
                actionedBy: actionedByPlayerId,
                playerId,
                isBanker
            };
            this.pushEvent(event);
        };
        // Record a players websocket connection in-game
        this.playerConnectionStatusChange = (playerId, connected) => {
            // Verify the player is still in the game (will not be if they were kicked)
            if (this.gameState.players.find((p) => p.playerId) !== undefined) {
                // If the player is still in the game, update their state
                const event = {
                    type: "playerConnectionChange",
                    time: (0, utils_1.getCurrentTime)(),
                    actionedBy: playerId,
                    playerId,
                    connected
                };
                this.pushEvent(event);
            }
        };
        // Subscribe a websocket to get any event updates
        this.subscribeWebSocketToEvents = (ws, playerId) => {
            // Add to subscription list
            this.subscribedWebSockets[playerId] = ws;
            // Send out events that have ocurred
            const outgoingMessage = {
                type: "initialEventArray",
                events: this.events
            };
            ws.send(JSON.stringify(outgoingMessage));
            // Tell listeners that this player is now connected
            this.playerConnectionStatusChange(playerId, true);
        };
        // Get the game state
        this.getGameState = () => {
            return this.gameState;
        };
        // Add an event
        this.addEvent = (event, actionedBy) => {
            this.pushEvent(Object.assign(Object.assign({}, event), { actionedBy, time: (0, utils_1.getCurrentTime)() }));
            // If a player has been deleted, close their websocket and remove their user token
            if (event.type === "playerDelete") {
                this.removePlayerWebSocket(event.playerId);
                const userToken = Object.keys(this.userTokenToPlayers).find((token) => this.userTokenToPlayers[token] === event.playerId);
                if (userToken !== undefined) {
                    delete this.userTokenToPlayers[userToken];
                }
            }
            // If all bankers have removed themselves, end the game
            const bankerPlayers = this.gameState.players.filter((p) => p.banker);
            if (bankerPlayers.length === 0) {
                this.endGame();
            }
        };
        // Remove a player
        this.removePlayerWebSocket = (playerId) => {
            if (playerId in this.subscribedWebSockets) {
                this.subscribedWebSockets[playerId].close();
                delete this.subscribedWebSockets[playerId];
            }
        };
        // End a game
        this.endGame = () => {
            // Send end game notification to all player
            const outgoingMessage = { type: "gameEnd" };
            this.sendMessageToAllInGame(outgoingMessage);
            // Close all sockets and delete them
            Object.values(this.subscribedWebSockets).forEach((ws) => {
                ws.close();
            });
            // Delete the game
            this.deleteInstance();
        };
        this.pushEvent = (event) => {
            // Add event
            this.events.push(event);
            // Calculate next state
            this.gameState = (0, game_state_1.calculateGameState)([event], this.gameState);
            // Construct message and sent to all players
            const outgoingMessage = { type: "newEvent", event };
            this.sendMessageToAllInGame(outgoingMessage);
        };
        // Send a message to all listening websockets
        this.sendMessageToAllInGame = (outgoingMessage) => {
            Object.values(this.subscribedWebSockets).forEach((ws) => {
                ws.send(JSON.stringify(outgoingMessage));
            });
        };
        this.deleteInstance = deleteInstance;
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map