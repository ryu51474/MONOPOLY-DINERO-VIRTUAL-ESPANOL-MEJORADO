import { IGameStatePlayer, PlayerId } from "@monopoly-money/game-state";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { navigate } from "hookrouter";
import { allProperties, getPropertyByName, getTextColorForHex, groupByColor } from "../propertyData";
import { formatCurrency, getPlayerEmoji } from "../utils";
import { useSounds } from "./SoundProvider";
import "./GameEndFlow.scss";

interface IGameEndFlowProps {
  mode: "solo" | "cadaQuien";
  players: IGameStatePlayer[];
  playerId: PlayerId;
  isBanker: boolean;
  playerClaims: Record<string, string[]>;
  finalizedPlayers: string[];
  settlementResults: { playerCash: Record<string, number>; playerProperties: Record<string, string[]> } | null;
  onClaimProperty: (propertyName: string, selected: boolean) => void;
  onFinalize: () => void;
  onSubmitResults?: (playerCash: Record<string, number>, playerProperties: Record<string, string[]>) => void;
  onForceEnd?: () => void;
}

interface IComputedResult {
  playerId: PlayerId;
  name: string;
  cash: number;
  properties: { name: string; value: number; color: string; hex: string }[];
  propertyTotal: number;
  grandTotal: number;
  rank: number;
}

const computeResults = (
  players: IGameStatePlayer[],
  playerCash: Record<string, number>,
  playerProperties: Record<string, string[]>
): IComputedResult[] => {
  return players
    .map(p => {
      const propNames = playerProperties[p.playerId] || [];
      const properties = propNames.map(n => {
        const info = getPropertyByName(n);
        return {
          name: info?.shortName || n,
          value: info?.price || 0,
          color: info?.color || "",
          hex: info?.hex || ""
        };
      });
      const propertyTotal = properties.reduce((s, pr) => s + pr.value, 0);
      const cash = playerCash[p.playerId] || 0;
      return {
        playerId: p.playerId,
        name: p.name,
        cash,
        properties,
        propertyTotal,
        grandTotal: cash + propertyTotal,
        rank: 0
      };
    })
    .sort((a, b) => b.grandTotal - a.grandTotal)
    .map((r, i) => ({ ...r, rank: i + 1 }));
};

const getRankEmoji = (rank: number): string => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

const GameEndFlow: React.FC<IGameEndFlowProps> = ({
  mode,
  players,
  playerId,
  isBanker,
  playerClaims,
  finalizedPlayers,
  settlementResults,
  onClaimProperty,
  onFinalize,
  onSubmitResults,
  onForceEnd
}) => {
  const [phase, setPhase] = useState<"selecting" | "waiting" | "results">(
    settlementResults ? "results" : "selecting"
  );
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [localClaims, setLocalClaims] = useState<Record<string, string[]>>({});
  const [localResults, setLocalResults] = useState<{
    playerCash: Record<string, number>;
    playerProperties: Record<string, string[]>;
  } | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { playSound } = useSounds();

  const me = players.find(p => p.playerId === playerId);

  useEffect(() => {
    if (settlementResults) {
      setPhase("results");
      setLocalResults(settlementResults);
    } else if (mode === "cadaQuien" && finalizedPlayers.includes(playerId)) {
      setPhase("waiting");
    }
  }, [settlementResults, finalizedPlayers, playerId, mode]);

  const currentPlayer = mode === "solo" ? players[currentPlayerIdx] : me;
  const currentClaims = mode === "solo"
    ? (localClaims[currentPlayer?.playerId || ""] || [])
    : (playerClaims[playerId] || []);
  const isLastPlayer = mode === "solo" && currentPlayerIdx >= players.length - 1;

  const allSelectedProps = mode === "solo"
    ? Object.values(localClaims).flat()
    : Object.values(playerClaims).flat();

  const findClaimant = (propName: string): string | null => {
    for (const [pid, props] of Object.entries(mode === "solo" ? localClaims : playerClaims)) {
      if (props.includes(propName)) return pid;
    }
    return null;
  };

  const showTakenAlert = (claimantId: string) => {
    const claimant = players.find(p => p.playerId === claimantId);
    setAlertMessage(`⚠️ Propiedad de ${getPlayerEmoji(claimantId)} ${claimant?.name || "otro jugador"} — no disponible`);
    playSound('error');
    setTimeout(() => setAlertMessage(null), 3500);
  };

  const toggleProperty = (propertyName: string) => {
    if (phase !== "selecting" || !currentPlayer) return;
    const isSelected = currentClaims.includes(propertyName);
    if (mode === "solo") {
      const claimantId = findClaimant(propertyName);
      const isTaken = claimantId !== null && claimantId !== currentPlayer.playerId;
      if (isTaken && !isSelected) {
        showTakenAlert(claimantId);
        return;
      }
      setLocalClaims(prev => {
        const prevList = prev[currentPlayer.playerId] || [];
        return {
          ...prev,
          [currentPlayer.playerId]: isSelected
            ? prevList.filter(p => p !== propertyName)
            : [...prevList, propertyName]
        };
      });
      playSound('click');
    } else {
      const claimantId = findClaimant(propertyName);
      const isTaken = claimantId !== null && claimantId !== playerId;
      if (isTaken && !isSelected) {
        showTakenAlert(claimantId);
        return;
      }
      onClaimProperty(propertyName, !isSelected);
      playSound('click');
    }
  };

  const selectAllRemaining = () => {
    if (!currentPlayer || mode !== "solo") return;
    const remaining = allProperties
      .map(p => p.name)
      .filter(n => !allSelectedProps.includes(n));
    setLocalClaims(prev => ({
      ...prev,
      [currentPlayer.playerId]: remaining
    }));
  };

  const finalizePlayer = () => {
    if (!currentPlayer) return;
    if (mode === "solo") {
      if (!isLastPlayer) {
        setCurrentPlayerIdx(currentPlayerIdx + 1);
      } else {
        const playerCash: Record<string, number> = {};
        const playerProperties: Record<string, string[]> = {};
        players.forEach(p => {
          playerCash[p.playerId] = p.balance;
          playerProperties[p.playerId] = localClaims[p.playerId] || [];
        });
        setLocalResults({ playerCash, playerProperties });
        setPhase("results");
      }
      playSound('click');
    } else {
      onFinalize();
      setPhase("waiting");
      playSound('click');
    }
  };

  const submitFinalResults = () => {
    if (mode === "solo" && localResults && onSubmitResults && !submitted) {
      setSubmitted(true);
      onSubmitResults(localResults.playerCash, localResults.playerProperties);
    } else {
      navigate("/");
    }
  };

  const displayedResults = localResults
    ? computeResults(players, localResults.playerCash, localResults.playerProperties)
    : [];

  const allClaimed = Object.values(mode === "solo" ? localClaims : playerClaims).flat();
  const unclaimedProperties = allProperties.filter(p => !allClaimed.includes(p.name));

  const colorGroups = groupByColor();

  // Mode Selector (only shown when mode selection is needed - handled by EndGameConfirmDialog)
  // This component receives mode already selected

  // Waiting phase
  if (phase === "waiting") {
    return (
      <div className="game-end-overlay">
        <div className="game-end-container waiting-view">
          <div className="waiting-spinner">⏳</div>
          <h2>¡Has confirmado tus propiedades!</h2>
          <p className="waiting-subtitle">Esperando a que los demás jugadores finalicen...</p>
          <div className="waiting-players">
            {players.map(p => {
              const isDone = finalizedPlayers.includes(p.playerId);
              const isMe = p.playerId === playerId;
              return (
                <div key={p.playerId} className={`waiting-player ${isDone ? "done" : ""}`}>
                  <span className="waiting-emoji">{getPlayerEmoji(p.playerId)}</span>
                  <span className="waiting-name">{p.name}{isMe ? " (tú)" : ""}</span>
                  <span className="waiting-status">{isDone ? "✅ Listo" : "⏳ Pendiente"}</span>
                </div>
              );
            })}
          </div>
          {isBanker && (
            <div className="waiting-actions">
              <Button variant="danger" size="sm" onClick={() => onForceEnd && onForceEnd()}>
                Forzar Finalización
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Results phase
  if (phase === "results") {
    return (
      <div className="game-end-overlay">
        <div className="game-end-container results-view">
          <h2 className="results-title">🏆 RESULTADOS FINALES 🏆</h2>
          {displayedResults.map(result => (
            <div key={result.playerId} className="result-card" data-rank={result.rank}>
              <div className="result-header">
                <span className="result-rank">{getRankEmoji(result.rank)}</span>
                <span className="result-emoji">{getPlayerEmoji(result.playerId)}</span>
                <span className="result-name">{result.name}</span>
              </div>
              <div className="result-details">
                <div className="result-row">
                  <span>💰 Dinero:</span>
                  <span>{formatCurrency(result.cash)}</span>
                </div>
                <div className="result-row">
                  <span>🏠 Propiedades:</span>
                  <span>{formatCurrency(result.propertyTotal)} ({result.properties.length} props)</span>
                </div>
                {result.properties.length > 0 && (
                  <div className="result-props">
                    {result.properties.map(pr => (
                      <span key={pr.name} className="result-prop" style={{ backgroundColor: pr.hex, color: getTextColorForHex(pr.hex) }}>
                        {pr.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="result-row result-total">
                  <span>📊 TOTAL:</span>
                  <span>{formatCurrency(result.grandTotal)}</span>
                </div>
              </div>
            </div>
          ))}
          {unclaimedProperties.length > 0 && (
            <div className="unclaimed-section">
              <h4>❌ No seleccionadas:</h4>
              <div className="unclaimed-list">
                {unclaimedProperties.map(p => (
                  <span key={p.name} className="unclaimed-prop" style={{ backgroundColor: p.hex, color: getTextColorForHex(p.hex) }}>
                    {p.shortName} ({formatCurrency(p.price)})
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="results-actions">
            <Button variant="success" size="lg" className="w-100" onClick={submitFinalResults}>
              {mode === "solo" && localResults && !settlementResults && !submitted
                ? "Finalizar y Enviar Resultados"
                : "Cerrar - Volver al Inicio"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If no current player or no me, show nothing
  if (!currentPlayer || (!me && mode === "cadaQuien")) return null;

  // Selecting phase
  return (
    <div className="game-end-overlay">
      <div className="game-end-container selecting-view">
        <div className="minimap-header">
          <span className="player-emoji-large">{getPlayerEmoji(currentPlayer.playerId)}</span>
          <h1 className="player-name-title">{currentPlayer.name}</h1>
          <span className="player-emoji-large">{getPlayerEmoji(currentPlayer.playerId)}</span>
        </div>

        {mode === "solo" && (
          <div className="solo-progress">
            Jugador {currentPlayerIdx + 1} de {players.length}
          </div>
        )}

        {alertMessage && (
          <div className="claim-alert">{alertMessage}</div>
        )}

        <div className="minimap-grid">
          {colorGroups.map(group => (
            <div key={group.color} className="color-group">
              <div className="color-group-label" style={{ backgroundColor: group.hex, color: getTextColorForHex(group.hex) }}>
                {group.label}
              </div>
              <div className="color-group-props">
                {group.properties.map(prop => {
                  const isSelected = currentClaims.includes(prop.name);
                  const claimsSource = mode === "solo" ? localClaims : playerClaims;
                  const currentPid = mode === "solo" ? currentPlayer?.playerId : playerId;
                  const isTakenByOther = currentPid
                    ? Object.entries(claimsSource)
                        .filter(([pid]) => pid !== currentPid)
                        .some(([, props]) => props.includes(prop.name))
                    : false;
                  const claimantId = isTakenByOther ? findClaimant(prop.name) : null;
                  const isDisabled = isTakenByOther;

                  return (
                    <button
                      key={prop.name}
                      className={`prop-tile ${isSelected ? "selected" : ""} ${isDisabled ? "taken" : ""}`}
                      style={{
                        backgroundColor: isSelected || isDisabled ? "#cccccc" : prop.hex,
                        color: isSelected || isDisabled ? "#666" : getTextColorForHex(prop.hex)
                      }}
                      onClick={() => !isDisabled && toggleProperty(prop.name)}
                      disabled={isDisabled}
                      title={prop.name}
                    >
                      <span className="prop-tile-name">{prop.shortName}</span>
                      <span className="prop-tile-price">{formatCurrency(prop.price)}</span>
                      {claimantId && (
                        <span className="prop-taken-emoji">{getPlayerEmoji(claimantId)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="minimap-footer">
          <div className="running-total">
            💰 Total seleccionado: {formatCurrency(
              currentClaims.reduce((sum, name) => {
                const info = getPropertyByName(name);
                return sum + (info?.price || 0);
              }, 0)
            )}
          </div>
          <div className="footer-actions">
            {mode === "solo" && isLastPlayer && (
              <Button variant="info" size="sm" className="mr-2" onClick={selectAllRemaining}>
                Sel. Restantes
              </Button>
            )}
            <Button
              variant="success"
              size="lg"
              className="finalize-btn"
              onClick={finalizePlayer}
            >
              {mode === "solo"
                ? `Finalizar ${currentPlayer.name}`
                : finalizedPlayers.includes(playerId) ? "✅ Listo" : "Listo"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEndFlow;
