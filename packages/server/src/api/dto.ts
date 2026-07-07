import { GameEvent } from "@monopoly-money/game-state";

// REST HTTP Types

export interface ICreateGameRequest {
  name: string;
}

export interface IJoinGameRequest {
  name: string;
}

export interface IJoinGameResponse {
  gameId: string;
  userToken: string; // An auth token is used to identify a user
  playerId: string; // Tell the player who they are (not required when making calls)
}

// Websocket Incoming Message Types (server <= client)

export type IncomingMessage =
  | IAuthMessage
  | IProposeEventMessage
  | IProposeEndGameMessage
  | IHeartBeatMessage
  | IProposeGameSettlementMessage
  | IPropertyClaimMessage
  | IPlayerFinalizeMessage
  | ISubmitSettlementResultsMessage
  | IForceEndSettlementMessage;

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

// Settlement messages

export interface IProposeGameSettlementMessage {
  type: "proposeGameSettlement";
  mode: "solo" | "cadaQuien";
}

export interface IPropertyClaimMessage {
  type: "propertyClaim";
  propertyName: string;
  selected: boolean;
}

export interface IPlayerFinalizeMessage {
  type: "playerFinalize";
}

export interface ISubmitSettlementResultsMessage {
  type: "submitSettlementResults";
  playerCash: Record<string, number>;
  playerProperties: Record<string, string[]>;
}

export interface IForceEndSettlementMessage {
  type: "forceEndSettlement";
}

// Websocket Outgoing Message Types (server => client)

export type OutgoingMessage =
  | IInitialEventArrayMessage
  | INewEventMessage
  | IGameEndMessage
  | IGameSettlementStartMessage
  | IPropertyClaimUpdateMessage
  | IPlayerFinalizedMessage
  | IGameEndResultsMessage;

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

export interface IGameSettlementStartMessage {
  type: "gameSettlementStart";
  mode: "solo" | "cadaQuien";
}

export interface IPropertyClaimUpdateMessage {
  type: "propertyClaimUpdate";
  playerId: string;
  propertyName: string;
  selected: boolean;
}

export interface IPlayerFinalizedMessage {
  type: "playerFinalized";
  playerId: string;
}

export interface IGameEndResultsMessage {
  type: "gameEndResults";
  playerCash: Record<string, number>;
  playerProperties: Record<string, string[]>;
}
