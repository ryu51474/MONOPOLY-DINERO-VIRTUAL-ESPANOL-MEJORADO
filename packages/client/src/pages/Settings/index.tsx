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
  players: IGameStatePlayer[];
  playerId: string;
  proposePlayerNameChange: (playerId: string, name: string) => void;
  proposePlayerDelete: (playerId: string) => void;
  proposeGameOpenStateChange: (open: boolean) => void;
  proposeUseFreeParkingChange: (useFreeParking: boolean) => void;
  proposeGameEnd: () => void;
}

const Settings: React.FC<ISettingsProps> = ({
  isGameOpen,
  useFreeParking,
  players,
  // playerId is used for authorization in parent component
  proposePlayerNameChange,
  proposePlayerDelete,
  proposeGameOpenStateChange,
  proposeUseFreeParkingChange,
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

      <Button block variant="primary" onClick={toggleNewPlayersAllowed}>
        {isGameOpen ? "Cerrar" : "Abrir"} Juego a Nuevos Jugadores
      </Button>

      <Button block variant="danger" onClick={() => showEndGameConfirmModal()}>
        Terminar Juego
      </Button>

      <div className="mt-5 text-center">
        <div>
          <small>¿Te parece útil esta aplicación?</small>
        </div>
        <a href="https://www.buymeacoffee.com/brentvollebregt" target="_blank">
          <Button block variant="warning">
            🍺 Compra una cerveza para dar las gracias 🍺
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Settings;

