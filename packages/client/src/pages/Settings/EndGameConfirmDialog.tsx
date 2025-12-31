import React from "react";
import { Button, Modal } from "react-bootstrap";
import { trackEndGame } from "../../utils";

interface IEndGameConfirmDialogProps {
  proposeGameEnd: () => void;
  onClose: () => void;
}

const EndGameConfirmDialog: React.FC<IEndGameConfirmDialogProps> = ({
  proposeGameEnd,
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
        <Modal.Title>Terminar Juego</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que quieres terminar el juego?</p>
        <p>Esto expulsará a todos y no podrás volver a unirte al juego.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="success"
          className=" ml-1"
          onClick={() => {
            proposeGameEnd();
            onClose();
            trackEndGame();
          }}
        >
          Terminar Juego
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EndGameConfirmDialog;

