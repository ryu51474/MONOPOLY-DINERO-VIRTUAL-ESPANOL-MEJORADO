import Game from "./Game";
declare class GameStore {
    private games;
    createGame(initialBankersName: string): {
        gameId: string;
        userToken: string;
        playerId: string;
    };
    doesGameExist(gameId: string): boolean;
    getGame(gameId: string): Game;
    deleteGame(gameId: string): void;
}
declare const _default: GameStore;
export default _default;
