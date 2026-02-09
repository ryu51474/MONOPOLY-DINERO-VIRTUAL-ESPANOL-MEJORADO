import { IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useModal } from "react-modal-hook";
import ConnectedStateDot from "../../components/ConnectedStateDot";
import {
  formatCurrency,
  sortPlayersByName,
  trackFreeParkingDisabled,
  trackFreeParkingEnabled,
  trackNewPlayersAllowed,
  trackNewPlayersNotAllowed
} from "../../utils";
import DeletePlayerModal from "./DeletePlayerModal";
import EndGameConfirmDialog from "./EndGameConfirmDialog";
import RenamePlayerModal from "./RenamePlayerModal";
import "./Settings.scss";

interface ISettingsProps {
  isGameOpen: boolean;
  useFreeParking: boolean;
  useAuctions: boolean;
  players: IGameStatePlayer[];
  playerId: string;
  proposePlayerNameChange: (playerId: string, name: string) => void;
  proposePlayerDelete: (playerId: string) => void;
  proposeGameOpenStateChange: (open: boolean) => void;
  proposeUseFreeParkingChange: (useFreeParking: boolean) => void;
  proposeUseAuctionsChange: (useAuctions: boolean) => void;
  proposeGameEnd: () => void;
}

const Settings: React.FC<ISettingsProps> = ({
  isGameOpen,
  useFreeParking,
  useAuctions,
  players,
  // playerId is used for authorization in parent component
  proposePlayerNameChange,
  proposePlayerDelete,
  proposeGameOpenStateChange,
  proposeUseFreeParkingChange,
  proposeUseAuctionsChange,
  proposeGameEnd
}) => {
  const [actioningPlayer, setActioningPlayer] = useState<IGameStatePlayer | null>(null);
  const [showNameChangeModal, hideNameChangeModal] = useModal(
    () => (
      <>
        {actioningPlayer !== null && (
          <RenamePlayerModal
            player={actioningPlayer}
            proposePlayerNameChange={proposePlayerNameChange}
            onClose={hideNameChangeModal}
          />
        )}
      </>
    ),
    [actioningPlayer]
  );
  const [showDeletePlayerModal, hideDeletePlayerModal] = useModal(
    () => (
      <>
        {actioningPlayer !== null && (
          <DeletePlayerModal
            player={actioningPlayer}
            proposePlayerDelete={proposePlayerDelete}
            onClose={hideDeletePlayerModal}
          />
        )}
      </>
    ),
    [actioningPlayer]
  );
  const [showEndGameConfirmModal, hideEndGameConfirmModal] = useModal(
    () => (
      <>
        <EndGameConfirmDialog proposeGameEnd={proposeGameEnd} onClose={hideEndGameConfirmModal} />
      </>
    ),
    [actioningPlayer]
  );

  const toggleFreeParking = () => {
    if (useFreeParking) {
      trackFreeParkingDisabled();
    } else {
      trackFreeParkingEnabled();
    }
    proposeUseFreeParkingChange(!useFreeParking);
  };

  const toggleAuctions = () => {
    proposeUseAuctionsChange(!useAuctions);
  };

  const toggleNewPlayersAllowed = () => {
    if (isGameOpen) {
      trackNewPlayersNotAllowed();
    } else {
      trackNewPlayersAllowed();
    }
    proposeGameOpenStateChange(!isGameOpen);
  };

  return (
    <div className="settings">
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Saldo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortPlayersByName(players).map((player) => (
            <tr key={player.playerId} className="player-row">
              <td>
                <ConnectedStateDot connected={player.connected} />
              </td>
              <td>{player.name}</td>
<td>{formatCurrency(player.balance)}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  title="Renombrar"
                  onClick={() => {
                    setActioningPlayer(player);
                    showNameChangeModal();
                  }}
                >
                  <span role="img" aria-label="Renombrar">
                    ✏️
                  </span>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  title="Eliminar"
                  className="ml-1"
                  onClick={() => {
                    setActioningPlayer(player);
                    showDeletePlayerModal();
                  }}
                >
                  <span role="img" aria-label="Eliminar">
                    🗑️
                  </span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button block variant="info" onClick={toggleFreeParking}>
        {useFreeParking ? "Desactivar" : "Activar"} la Regla de Casa de 🚗 Parada Libre
      </Button>

      <Button block variant="warning" onClick={toggleAuctions} className="mb-2">
        {useAuctions ? "Desactivar" : "Activar"} la Regla de Casa de 🔨 Subastas
      </Button>

      <Button block variant="primary" onClick={toggleNewPlayersAllowed}>
        {isGameOpen ? "Cerrar" : "Abrir"} Juego a Nuevos Jugadores
      </Button>

      <Button block variant="danger" onClick={() => showEndGameConfirmModal()}>
        Terminar Juego
      </Button>

      <div className="mt-5 text-center px-3">
        <div>
          <small className="text-muted d-block mb-2">
            Esta versión en español es un proyecto altruista mantenido por <strong>Daniel</strong>.
            No se requieren pagos ni donaciones por su uso.
          </small>
          <small className="d-block mb-3">
            Si deseas agradecer al <strong>creador original</strong> del código base (en inglés):
          </small>
        </div>
        <a href="https://www.buymeacoffee.com/brentvollebregt" target="_blank" rel="noopener noreferrer">
          <Button block variant="warning" size="sm">
            🍺 Comprar una cerveza al creador original (Brent) 🍺
          </Button>
        </a>
        <div className="mt-4 border-top pt-3">
          <small className="text-muted">
            &copy; {new Date().getFullYear()} - <a href="http://www.profedaniel.cl" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>www.profedaniel.cl</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Settings;

