import {
  calculateGameState,
  defaultGameState,
  GameEntity,
  GameEvent,
  IGameOpenStateChangeEvent,
  IGameState,
  IPlayerAvatarChangeEvent,
  IPlayerDeleteEvent,
  IPlayerNameChangeEvent,
  ITransactionEvent,
  IUseFreeParkingChangeEvent
} from "@monopoly-money/game-state";
import {
  IAuthMessage,
  IHeartBeatMessage,
  IProposeEndGameMessage,
  IProposeEventMessage,
  OutgoingMessage
} from "@monopoly-money/server/build/api/dto";
import config from "../config";
import { trackUnexpectedServerDisconnection } from "../utils";

export interface IGameHandlerState {
  events: GameEvent[];
  isBanker: boolean;
}

class GameHandler {
  public gameId: string;
  public userToken: string;
  public playerId: string;
  private onGameStateChange: (gameEnded: boolean) => void;
  private onDisplayMessage: (title: string, message: string, gameState: IGameState) => void;
  private events: GameEvent[] = [];
  private webSocket: WebSocket;
  private gameState: IGameState = defaultGameState;
  private heartBeatTimeout: NodeJS.Timeout | null = null;

  constructor(
    gameId: string,
    userToken: string,
    playerId: string,
    onGameStateChange: (gameEnded: boolean) => void,
    onDisplayMessage: (title: string, message: string, gameState: IGameState) => void
  ) {
    this.gameId = gameId;
    this.userToken = userToken;
    this.playerId = playerId;
    this.onGameStateChange = onGameStateChange;
    this.onDisplayMessage = onDisplayMessage;

    // Create websocket and assign onmessage
    // If config.api.root is empty (when VITE_API_ROOT is not set), use the current browser IP and port
    const apiRoot = config.api.root || `http://${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}`;
    const webSocketAPIRoot = apiRoot.replace(/http?/g, "ws");
    this.webSocket = new WebSocket(`${webSocketAPIRoot}/api/events`);

    // Setup on message
    this.webSocket.onmessage = this.onWebSocketMessage.bind(this);

    // Send auth message on websocket open
    this.webSocket.addEventListener("open", (_event) => {
      const message: IAuthMessage = {
        type: "auth",
        gameId: this.gameId,
        userToken: this.userToken
      };
      this.webSocket.send(JSON.stringify(message));
    });

    // Handle websocket close
    this.webSocket.addEventListener("close", (event) => {
      if (!event.wasClean) {
        this.gameEnd("unexpectedWebSocketClosure");
        this.onGameStateChange(true);
      }

      if (this.heartBeatTimeout !== null) {
        clearTimeout(this.heartBeatTimeout);
      }
    });

    // Start a heart beat back to the server (to keep WebSocket connections alive on Heroku: https://devcenter.heroku.com/articles/websockets#timeouts)
    this.heartBeatTimeout = setInterval(
      this.pingServer.bind(this),
      1000 * config.heartBeatTimeoutSeconds
    );
  }

  private pingServer() {
    const message: IHeartBeatMessage = {
      type: "heartBeat"
    };
    this.webSocket.send(JSON.stringify(message));
  }

  // Get data to be used to display the UI
  public getState(): IGameState {
    return this.gameState;
  }

  // Get all events
  public getEvents(): GameEvent[] {
    return this.events;
  }

  // Identify whether this user is a banker
  public amIABanker(): boolean {
    const me = this.gameState.players.find((p) => p.playerId === this.playerId);
    return me?.banker ?? false;
  }

  // Propose a transaction
  public proposeTransaction(from: GameEntity, to: GameEntity, amount: number) {
    const event: ITransactionEvent = {
      time: "", // Will be filled in by the server
      actionedBy: "", // Will be filled in by the server
      type: "transaction",
      from,
      to,
      amount
    };
    this.submitEvent(event);
  }

  // Rename a player
  public proposePlayerNameChange(playerId: string, name: string) {
    const event: IPlayerNameChangeEvent = {
      time: "", // Will be filled in by the server
      actionedBy: "", // Will be filled in by the server
      type: "playerNameChange",
      playerId,
      name
    };
    this.submitEvent(event);
  }

  // Change a player's avatar
  public proposePlayerAvatarChange(playerId: string, avatar: string) {
    const event: IPlayerAvatarChangeEvent = {
      time: "", // Will be filled in by the server
      actionedBy: "", // Will be filled in by the server
      type: "playerAvatarChange",
      playerId,
      avatar
    };
    this.submitEvent(event);
  }

  // Remove a player
  public proposePlayerDelete(playerId: string) {
    const event: IPlayerDeleteEvent = {
      time: "", // Will be filled in by the server
      actionedBy: "", // Will be filled in by the server
      type: "playerDelete",
      playerId
    };
    this.submitEvent(event);
  }

  // Open / close game
  public proposeGameOpenStateChange(open: boolean) {
    const event: IGameOpenStateChangeEvent = {
      time: "", // Will be filled in by the server
      actionedBy: "", // Will be filled in by the server
      type: "gameOpenStateChange",
      open
    };
    this.submitEvent(event);
  }

  // Enable / disable Free Parking house rule
  public proposeUseFreeParkingChange(useFreeParking: boolean) {
    const event: IUseFreeParkingChangeEvent = {
      time: "", // Will be filled in by the server
      actionedBy: "", // Will be filled in by the server
      type: "useFreeParkingChange",
      useFreeParking
    };
    this.submitEvent(event);
  }

  // Propose the game to end
  public proposeGameEnd() {
    const message: IProposeEndGameMessage = {
      type: "proposeEndGame"
    };
    this.webSocket.send(JSON.stringify(message));
  }

  // When the game ends or player was kicked
  public gameEnd = (reason: "end" | "removed" | "unexpectedWebSocketClosure" | null) => {
    this.webSocket.close();
    switch (reason) {
      case "end":
        this.onDisplayMessage(
          "Juego Terminado",
          "El juego ha sido terminado por el banquero.",
          this.gameState
        );
        break;
      case "removed":
        // Calculate the game state before the player was removed
        const previousGameState = calculateGameState(this.events.slice(0, -1), defaultGameState);
        this.onDisplayMessage(
          "Eliminado del Juego",
          "Has sido eliminado intencionalmente del juego por el banquero.",
          previousGameState
        );
        break;
      case "unexpectedWebSocketClosure":
        trackUnexpectedServerDisconnection();
        this.onDisplayMessage(
          "Desconexión del servidor",
          "Desconexión inesperada del servidor. Por favor verifica que estés conectado a internet.",
          this.gameState
        );
        break;
    }
  };

  // On messages from the server
  private onWebSocketMessage(event: MessageEvent) {
    const incomingMessage = JSON.parse(event.data) as OutgoingMessage;

    if (incomingMessage.type === "initialEventArray") {
      this.events = incomingMessage.events;
      this.gameState = calculateGameState(this.events, this.gameState);
    } else if (incomingMessage.type === "newEvent") {
      this.events.push(incomingMessage.event);
      this.gameState = calculateGameState([incomingMessage.event], this.gameState);
    } else if (incomingMessage.type === "gameEnd") {
      this.gameEnd("end");
    }

    // Check if this player has been kicked
    const inPlayers = this.gameState.players.map((p) => p.playerId).indexOf(this.playerId) !== -1;
    if (!inPlayers) {
      this.gameEnd("removed");
    }

    // Notify the user of this class that a change has been made internally.
    const gameEnded = incomingMessage.type === "gameEnd" || !inPlayers;
    this.onGameStateChange(gameEnded);
  }

  // Messages to the server
  private submitEvent(event: GameEvent) {
    const message: IProposeEventMessage = {
      type: "proposeEvent",
      event
    };
    this.webSocket.send(JSON.stringify(message));
  }
}

export default GameHandler;
