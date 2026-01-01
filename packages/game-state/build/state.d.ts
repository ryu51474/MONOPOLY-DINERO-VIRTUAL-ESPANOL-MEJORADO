import { GameEvent, IGameState } from "./types";
export declare const defaultGameState: IGameState;
export declare const calculateGameState: (events: GameEvent[], currentState: IGameState) => IGameState;
