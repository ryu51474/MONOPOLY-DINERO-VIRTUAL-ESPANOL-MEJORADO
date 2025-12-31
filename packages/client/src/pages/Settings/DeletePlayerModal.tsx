import { IGameStatePlayer } from "@monopoly-money/game-state";
import React from "react";
import { Button, Modal } from "react-bootstrap";

interface IDeletePlayerModalProps {
  player: IGameStatePlayer;
  proposePlayerDelete: (playerId: string) => void;
  onClose: () => void;
}

const DeletePlayerModal: React.FC<IDeletePlayerModalProps> = ({
  player,
  proposePlayerDelete,
  onClose
}) => {
  return (
    <Modal show={true} onHide={onClose} size="lg" centered>
      <Modal.Header
        closeButton
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        placeholder={undefined}
      >
        <Modal.Title>Eliminar Jugador</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que quieres eliminar a {player.name}?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="success"
          className=" ml-1"
          onClick={() => {
            proposePlayerDelete(player.playerId);
            onClose();
          }}
        >
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePlayerModal;

