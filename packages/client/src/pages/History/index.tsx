import {
  calculateGameState,
  defaultGameState,
  GameEvent,
  IGameState
} from "@monopoly-money/game-state";
import { DateTime } from "luxon";
import React from "react";
import { bankName, freeParkingName } from "../../constants";
import { formatCurrency, getPlayerEmoji } from "../../utils";
import "./History.scss";

interface IHistoryProps {
  events: GameEvent[];
}

const History: React.FC<IHistoryProps> = ({ events }) => {
  let currentGameState = defaultGameState;
  const details = events.map((event) => {
    const nextState = calculateGameState([event], currentGameState);
    const currentEventDetails = getEventDetails(event, currentGameState, nextState);
    currentGameState = nextState;
    return currentEventDetails;
  });

  return (
    <div className="history">
      {details.reverse().map((eventDetail) =>
        eventDetail === null ? null : (
          <div key={eventDetail.id} className="event mb-2">
            <div className="bar" style={{ background: `var(--${eventDetail.colour})` }} />
            <div className="event-details">
              <div className="top">
                <small>{eventDetail.title}</small>
                <small>
                  {eventDetail.actionedBy !== null && (
                    <span
                      className="mr-2"
                      dangerouslySetInnerHTML={{ __html: `(✍️ ${eventDetail.actionedBy})` }}
                    />
                  )}
                  {eventDetail.time}
                </small>
              </div>
              <div className="detail" dangerouslySetInnerHTML={{ __html: eventDetail.detail }} />
            </div>
          </div>
        )
      )}
    </div>
  );
};

interface IEventDetail {
  id: string;
  title: string;
  actionedBy: string | null;
  time: string;
  detail: string;
  colour: "blue" | "red" | "orange" | "yellow" | "green" | "cyan"; // https://getbootstrap.com/docs/4.0/getting-started/theming/#all-colors
}

const getEventDetails = (
  event: GameEvent,
  previousState: IGameState,
  nextState: IGameState
): IEventDetail | null => {
  const defaults = {
    id: `${event.type + event.time}`,
    time: DateTime.fromISO(event.time).toFormat("h:mm a")
  };
  switch (event.type) {
    case "playerJoin": {
      const player = nextState.players.find((p) => p.playerId === event.playerId)!;
      const emoji = getPlayerEmoji(player.playerId);
      return {
        ...defaults,
        title: "Unión de Jugador",
        actionedBy: null,
        detail: `<span class="event-player-emoji" role="img" aria-label="animal">${emoji}</span> ${player.name} se unió`,
        colour: "cyan"
      };
    }

    case "playerBankerStatusChange": {
      const player = nextState.players.find((p) => p.playerId === event.playerId)!;
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const playerEmoji = getPlayerEmoji(player.playerId);
      const actionedByEmoji = getPlayerEmoji(actionedBy.playerId);
      return {
        ...defaults,
        title: "Cambio de Estado de Banquero",
        actionedBy: `<span class="event-player-emoji" role="img" aria-label="animal">${actionedByEmoji}</span> ${actionedBy.name}`,
        detail: `<span class="event-player-emoji" role="img" aria-label="animal">${playerEmoji}</span> ${player.name} se convirtió en banquero`,
        colour: "yellow"
      };
    }

    case "transaction": {
      const playerReceivingInfo =
        event.to === "bank"
          ? { name: bankName, emoji: "🏦", id: undefined }
          : event.to === "freeParking"
          ? { name: freeParkingName, emoji: "🚗", id: undefined }
          : (() => {
              const p = nextState.players.find((p) => p.playerId === event.to)!;
              return { name: p.name, emoji: getPlayerEmoji(p.playerId), id: p.playerId };
            })();
      const playerGivingInfo =
        event.from === "bank"
          ? { name: bankName, emoji: "🏦", id: undefined }
          : event.from === "freeParking"
          ? { name: freeParkingName, emoji: "🚗", id: undefined }
          : (() => {
              const p = nextState.players.find((p) => p.playerId === event.from)!;
              return { name: p.name, emoji: getPlayerEmoji(p.playerId), id: p.playerId };
            })();
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const actionedByDisplay = actionedBy.playerId === event.from 
        ? null 
        : `<span class="event-player-emoji" role="img" aria-label="animal">${getPlayerEmoji(actionedBy.playerId)}</span> ${actionedBy.name}`;
      return {
        ...defaults,
        title: `Transacción`,
        actionedBy: actionedByDisplay,
        detail: `${playerGivingInfo.emoji} ${playerGivingInfo.name} → ${playerReceivingInfo.emoji} ${playerReceivingInfo.name} (${formatCurrency(event.amount)})`,
        colour: "green"
      };
    }

    case "playerNameChange": {
      const player = previousState.players.find((p) => p.playerId === event.playerId)!;
      const playerEmoji = getPlayerEmoji(player.playerId);
      const playerNameBeforeRename = player.name;
      const playerNameAfterRename = nextState.players.find(
        (p) => p.playerId === event.playerId
      )!.name;
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const actionedByDisplay = actionedBy.playerId === event.playerId 
        ? null 
        : `<span class="event-player-emoji" role="img" aria-label="animal">${getPlayerEmoji(actionedBy.playerId)}</span> ${actionedBy.name}`;
      return {
        ...defaults,
        title: "Cambio de Nombre",
        actionedBy: actionedByDisplay,
        detail: `${playerEmoji} ${playerNameBeforeRename} fue renombrado a ${playerEmoji} ${playerNameAfterRename}`,
        colour: "orange"
      };
    }

    case "playerDelete": {
      const player = previousState.players.find((p) => p.playerId === event.playerId)!;
      const playerEmoji = getPlayerEmoji(player.playerId);
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const actionedByDisplay = actionedBy.playerId === event.playerId 
        ? null 
        : `<span class="event-player-emoji" role="img" aria-label="animal">${getPlayerEmoji(actionedBy.playerId)}</span> ${actionedBy.name}`;
      return {
        ...defaults,
        title: "Eliminación de Jugador",
        actionedBy: actionedByDisplay,
        detail: `${playerEmoji} ${player.name} fue eliminado del juego`,
        colour: "red"
      };
    }

    case "gameOpenStateChange": {
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const actionedByEmoji = getPlayerEmoji(actionedBy.playerId);
      return {
        ...defaults,
        title: "Cambio de Estado del Juego",
        actionedBy: `<span class="event-player-emoji" role="img" aria-label="animal">${actionedByEmoji}</span> ${actionedBy.name}`,
        detail: `El juego ahora está ${event.open ? "abierto" : "cerrado"} a nuevos jugadores`,
        colour: "blue"
      };
    }

    case "useFreeParkingChange": {
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const actionedByEmoji = getPlayerEmoji(actionedBy.playerId);
      return {
        ...defaults,
        title: "Cambio de Estado de 🚗 Parada Libre",
        actionedBy: `<span class="event-player-emoji" role="img" aria-label="animal">${actionedByEmoji}</span> ${actionedBy.name}`,
        detail: `La regla de casa de 🚗 Parada Libre ahora está ${
          event.useFreeParking ? "activada" : "desactivada"
        }`,
        colour: "blue"
      };
    }

    case "playerConnectionChange": {
      // Don't show these as they will pollute the history
      // const playerName = previousState.players.find((p) => p.playerId === event.playerId)!.name;
      // return {
      //   id: `${event.type + event.time}`,
      //   title: "Player's Connection",
      //   detail: `${playerName} ${event.connected ? "connected to" : "disconnected from"} the game`,
      //   colour: "teal"
      // };
      return null;
    }

    case "playerAvatarChange": {
      const player = nextState.players.find((p) => p.playerId === event.playerId)!;
      const playerEmoji = getPlayerEmoji(player.playerId);
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const actionedByDisplay = actionedBy.playerId === event.playerId 
        ? null 
        : `<span class="event-player-emoji" role="img" aria-label="animal">${getPlayerEmoji(actionedBy.playerId)}</span> ${actionedBy.name}`;
      return {
        ...defaults,
        title: "Cambio de Avatar",
        actionedBy: actionedByDisplay,
        detail: `${playerEmoji} ${player.name} cambió su avatar`,
        colour: "orange"
      };
    }

    case "useAuctionsChange": {
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const actionedByEmoji = getPlayerEmoji(actionedBy.playerId);
      return {
        ...defaults,
        title: "Cambio de Estado de 🔨 Subastas",
        actionedBy: `<span class="event-player-emoji" role="img" aria-label="animal">${actionedByEmoji}</span> ${actionedBy.name}`,
        detail: `La regla de casa de 🔨 Subastas ahora está ${
          event.useAuctions ? "activada" : "desactivada"
        }`,
        colour: "blue"
      };
    }

    case "auctionStart": {
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const actionedByEmoji = getPlayerEmoji(actionedBy.playerId);
      return {
        ...defaults,
        title: "Subasta Iniciada 🔨",
        actionedBy: `<span class="event-player-emoji" role="img" aria-label="animal">${actionedByEmoji}</span> ${actionedBy.name}`,
        detail: `Subasta iniciada para propiedad ${event.propertyColor} con precio base de ${formatCurrency(
          event.propertyPrice
        )}`,
        colour: "yellow"
      };
    }

    case "auctionBid": {
      const bidder = nextState.players.find((p) => p.playerId === event.bidderId)!;
      const bidderEmoji = getPlayerEmoji(bidder.playerId);
      return {
        ...defaults,
        title: "Puja en Subasta 💰",
        actionedBy: null,
        detail: `<span class="event-player-emoji" role="img" aria-label="animal">${bidderEmoji}</span> ${
          bidder.name
        } pujó ${formatCurrency(event.amount)}`,
        colour: "green"
      };
    }

    case "auctionEnd": {
      if (event.cancelled) {
        return {
          ...defaults,
          title: "Subasta Cancelada 🚫",
          actionedBy: null,
          detail: `La subasta fue cancelada`,
          colour: "red"
        };
      }
      const auction = previousState.activeAuction;
      if (!auction || !auction.highestBidderId) return null;
      const winner = nextState.players.find((p) => p.playerId === auction.highestBidderId)!;
      const winnerEmoji = getPlayerEmoji(winner.playerId);
      return {
        ...defaults,
        title: "Subasta Finalizada 🏆",
        actionedBy: null,
        detail: `<span class="event-player-emoji" role="img" aria-label="animal">${winnerEmoji}</span> ${
          winner.name
        } ganó la subasta por ${formatCurrency(auction.highestBid)}`,
        colour: "cyan"
      };
    }
  }
};

export default History;

