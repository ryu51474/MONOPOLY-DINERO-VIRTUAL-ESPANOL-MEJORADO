import { GameEntity, GameEvent, IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useModal } from "react-modal-hook";
import { bankName, freeParkingName } from "../../constants";
import useTransactionDetection from "../../hooks/useTransactionDetection";
import {
  formatCurrency,
  getPlayerEmoji
} from "../../utils";
import "./Funds.scss";
import GameCode from "./GameCode";
import PlayerCard from "./PlayerCard";
import RecentTransactions from "./RecentTransactions";
import SendMoneyModal from "./SendMoneyModal";
import AuctionComponent from "../../components/AuctionComponent";
import { IAuctionState } from "@monopoly-money/game-state";

interface IFundsProps {
  gameId: string;
  playerId: string;
  isGameOpen: boolean;
  players: IGameStatePlayer[];
  useFreeParking: boolean;
  freeParkingBalance: number;
  useAuctions: boolean;
  activeAuction: IAuctionState | null;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
  proposeAuctionStart: (color: string, price: number) => void;
  proposeAuctionBid: (bidderId: string, amount: number) => void;
  proposeAuctionEnd: (cancelled: boolean) => void;
  events: GameEvent[];
}

const Funds: React.FC<IFundsProps> = ({
  gameId,
  playerId,
  isGameOpen,
  players,
  useFreeParking,
  freeParkingBalance,
  useAuctions,
  activeAuction,
  proposeTransaction,
  proposeAuctionStart,
  proposeAuctionBid,
  proposeAuctionEnd,
  events
}) => {
  const [recipient, setRecipient] = useState<IGameStatePlayer | "freeParking" | "bank" | null>(
    null
  );
  const [showSendMoneyModal, hideSendMoneyModal] = useModal(
    () => (
      <>
        {recipient !== null && (
          <SendMoneyModal
            balance={me?.balance ?? 0}
            playerId={playerId}
            recipient={recipient}
            proposeTransaction={proposeTransaction}
            onClose={() => setRecipient(null)}
          />
        )}
      </>
    ),
    [recipient]
  );

  // Show/hide the send money modal automatically
  useEffect(() => {
    if (recipient !== null) {
      showSendMoneyModal();
    } else {
      hideSendMoneyModal();
    }
  }, [recipient, showSendMoneyModal, hideSendMoneyModal]);

  const me = players.find((p) => p.playerId === playerId);
  const isBanker = me?.banker ?? false;

  // Note: We now use the deterministic getPlayerEmoji function directly
  // This ensures all devices see the same emoji for each playerId
  // No localStorage state needed for emojis anymore

  // Detectar transacciones y mostrar notificaciones
  useTransactionDetection({ events, players, currentPlayerId: playerId, gameId });

  return (
    <div className="funds">
      {isGameOpen && <GameCode gameId={gameId} isBanker={isBanker} />}

      {/* Dinámica: Si hay subasta activa, se muestra arriba */}
      {useAuctions && activeAuction && (
        <AuctionComponent
          players={players}
          playerId={playerId}
          isBanker={isBanker}
          activeAuction={activeAuction}
          proposeAuctionStart={proposeAuctionStart}
          proposeAuctionBid={proposeAuctionBid}
          proposeAuctionEnd={proposeAuctionEnd}
        />
      )}

      <Card className="mb-1 text-center">
        {me !== undefined && (
          <Card.Body className="p-3">
            <div className="me-indicator">
              <span className="player-emoji" role="img" aria-label="animal">
                {getPlayerEmoji(me.playerId)}
              </span>
              <span>{me.name}</span>
            </div>
            <div className="mt-2">{formatCurrency(me.balance)}</div>
          </Card.Body>
        )}
      </Card>

      <div className="mb-1 balance-grid">
        {players.filter((p) => p.playerId !== playerId).map((player) => (
          <PlayerCard
            key={player.playerId}
            name={player.name}
            playerId={player.playerId}
            emoji={getPlayerEmoji(player.playerId)}
            connected={player.connected}
            balance={player.balance}
            onClick={() => setRecipient(player)}
          />
        ))}
      </div>

      <div className="balance-grid">
        {useFreeParking && (
          <PlayerCard
            name={freeParkingName}
            connected={null}
            balance={freeParkingBalance}
            onClick={() => setRecipient("freeParking")}
          />
        )}
        <PlayerCard
          name={bankName}
          connected={null}
          balance={Number.POSITIVE_INFINITY}
          onClick={() => setRecipient("bank")}
        />
      </div>

      {/* Dinámica: Si NO hay subasta activa, se muestra penúltimo (antes de transacciones) */}
      {useAuctions && !activeAuction && (
        <AuctionComponent
          players={players}
          playerId={playerId}
          isBanker={isBanker}
          activeAuction={activeAuction}
          proposeAuctionStart={proposeAuctionStart}
          proposeAuctionBid={proposeAuctionBid}
          proposeAuctionEnd={proposeAuctionEnd}
        />
      )}

      <div className="mt-2">
        <RecentTransactions events={events} players={players} currentPlayerId={playerId} />
      </div>
    </div>
  );
};

export default Funds;
