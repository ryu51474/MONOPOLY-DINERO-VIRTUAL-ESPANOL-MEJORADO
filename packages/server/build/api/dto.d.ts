import { GameEvent } from "@monopoly-money/game-state";
export interface ICreateGameRequest {
    name: string;
}
export interface IJoinGameRequest {
    name: string;
}
export interface IJoinGameResponse {
    gameId: string;
    userToken: string;
    playerId: string;
}
export type IncomingMessage = IAuthMessage | IProposeEventMessage | IProposeEndGameMessage | IHeartBeatMessage;
export interface IAuthMessage {
    type: "auth";
    gameId: string;
    userToken: string;
}
export interface IProposeEventMessage {
    type: "proposeEvent";
    event: GameEvent;
}
export interface IProposeEndGameMessage {
    type: "proposeEndGame";
}
export interface IHeartBeatMessage {
    type: "heartBeat";
}
export type OutgoingMessage = IInitialEventArrayMessage | INewEventMessage | IGameEndMessage;
export interface IInitialEventArrayMessage {
    type: "initialEventArray";
    events: GameEvent[];
}
export interface INewEventMessage {
    type: "newEvent";
    event: GameEvent;
}
export interface IGameEndMessage {
    type: "gameEnd";
}
