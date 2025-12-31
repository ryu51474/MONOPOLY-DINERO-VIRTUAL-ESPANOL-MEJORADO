import { GameEntity, IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useModal } from "react-modal-hook";
import MonopolyAmountInput from "../../components/MonopolyAmountInput";
import { trackInitialisedPlayerBalances } from "../../utils";

interface IInitialiseGameProps {
  players: IGameStatePlayer[];
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
}

const InitialiseGame: React.FC<IInitialiseGameProps> = ({ players, proposeTransaction }) => {
  const [showModal, hideModal] = useModal(() => (
    <ValueModal
      submitAmount={(amount: number) => {
        players.forEach((p) => {
          proposeTransaction("bank", p.playerId, amount);
        });
      }}
      onClose={hideModal}
    />
  ));

  return (
    <Button variant="primary" block onClick={showModal}>
      Inicializar Saldos de Jugadores
    </Button>
  );
};

interface IValueModalProps {
  submitAmount: (amount: number) => void;
  onClose: () => void;
}

const ValueModal: React.FC<IValueModalProps> = ({ submitAmount, onClose }) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    if (amount === null) {
      setSubmitError("Por favor proporciona una cantidad");
    } else if (amount <= 0) {
      setSubmitError("Debes proporcionar una suma mayor a $0");
    } else {
      submitAmount(amount);
      close();
      trackInitialisedPlayerBalances(amount);
    }
  };

  const close = () => {
    setAmount(null);
    setSubmitError(null);
    onClose();
  };

  return (
    <Modal show={true} onHide={close} size="lg" centered className="send-money-modal">
      <Modal.Header
        closeButton
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        placeholder={undefined}
      >
        <Modal.Title>Inicializar Saldos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Una vez que des dinero a un jugador o inicialices saldos, no podrás inicializar saldos de nuevo.
        </p>

        <MonopolyAmountInput amount={amount} setAmount={setAmount} autoFocus={true} />

        <Button block variant="success" className="mt-1" onClick={submit}>
          Inicializar
        </Button>

        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default InitialiseGame;

