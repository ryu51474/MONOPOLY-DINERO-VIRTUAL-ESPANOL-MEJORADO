import { GameEvent, IGameState, PlayerId } from "@monopoly-money/game-state";
import * as websocket from "ws";
export default class Game {
    private events;
    private subscribedWebSockets;
    private userTokenToPlayers;
    private gameState;
    private deleteInstance;
    constructor(deleteInstance: () => void);
    isGameOpen: () => boolean;
    isUserInGame: (userToken: string) => boolean;
    isUserABanker: (userToken: string) => boolean;
    getPlayerId: (userToken: string) => string;
    addPlayer: (name: string) => {
        userToken: string;
        playerId: string;
    };
    setPlayerBankerStatus: (playerId: string, isBanker: boolean, actionedByPlayerId: string) => void;
    playerConnectionStatusChange: (playerId: string, connected: boolean) => void;
    subscribeWebSocketToEvents: (ws: websocket, playerId: string) => void;
    getGameState: () => IGameState;
    addEvent: (event: GameEvent, actionedBy: PlayerId) => void;
    removePlayerWebSocket: (playerId: string) => void;
    endGame: () => void;
    private pushEvent;
    private sendMessageToAllInGame;
}
