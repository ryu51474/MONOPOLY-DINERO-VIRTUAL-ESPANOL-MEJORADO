import React from "react";
import { Card } from "react-bootstrap";
import ConnectedStateDot from "../../components/ConnectedStateDot";
import { bankName, freeParkingName } from "../../constants";
import { formatCurrency, getPlayerEmojiColor } from "../../utils";

interface IPlayerCardProps {
  name: string;
  playerId?: string;
  emoji?: string | null;
  connected: boolean | null;
  balance: number;
  onClick: () => void;
}

const PlayerCard: React.FC<IPlayerCardProps> = ({ name, playerId, emoji, connected, balance, onClick }) => {
  // Special icons for Parada Libre and Banco
  const isFreeParking = name === freeParkingName;
  const isBank = name === bankName;
  
  const displayEmoji = isFreeParking ? "🚗" : isBank ? "🏦" : emoji;
  
  // Get the background color based on the emoji (for emoji-based players)
  const cardStyle = (playerId && displayEmoji && !isFreeParking && !isBank)
    ? { backgroundColor: getPlayerEmojiColor(displayEmoji) }
    : {};

  return (
    <Card className="player-card text-center" style={cardStyle}>
      {connected !== null && <ConnectedStateDot connected={connected} className="m-2" />}
      <Card.Body className="p-3" onClick={onClick}>
        <div className="player-name-with-emoji">
          {playerId && displayEmoji ? (
            <>
              <span className="player-emoji" role="img" aria-label="animal">
                {displayEmoji}
              </span>
              <span>{name}</span>
              {!isFreeParking && !isBank && name.length <= 5 && (
                <span className="player-emoji-end" role="img" aria-label="animal">
                  {displayEmoji}
                </span>
              )}
            </>
          ) : (
            name
          )}
        </div>
        <div>{Number.isFinite(balance) ? formatCurrency(balance) : "∞"}</div>
      </Card.Body>
    </Card>
  );
};

export default PlayerCard;
