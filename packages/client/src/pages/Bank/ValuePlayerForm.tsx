import { IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton, Form } from "react-bootstrap";
import MonopolyAmountInput from "../../components/MonopolyAmountInput";
import { useSounds } from "../../components/SoundProvider";

interface IValuePlayerFormProps {
  label: string;
  submitText: string;
  players: IGameStatePlayer[];
  onSubmit: (value: number, playerId: string) => void;
}

const ValuePlayerForm: React.FC<IValuePlayerFormProps> = ({
  label,
  submitText,
  players,
  onSubmit
}) => {
  const identifier = label.toLowerCase().replace(" ", "-");
  const [amount, setAmount] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<IGameStatePlayer | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { playSound } = useSounds();

  const submit = () => {
    if (amount === null) {
      setSubmitError("Por favor proporciona una cantidad");
      playSound('error');
    } else if (amount <= 0) {
      setSubmitError("Debes proporcionar una suma mayor a $0");
      playSound('error');
    } else if (!Number.isInteger(amount)) {
      setSubmitError("La cantidad debe ser un número entero");
      playSound('error');
    } else if (selectedPlayer === null) {
      setSubmitError("No hay jugador seleccionado");
      playSound('error');
    } else {
      playSound('money');
      onSubmit(amount, selectedPlayer.playerId);
      setAmount(null);
      setSelectedPlayer(null);
      setSubmitError(null);
    }
  };

  return (
    <>
      <label htmlFor={identifier} className="mb-1">
        {label}
      </label>

      <MonopolyAmountInput amount={amount} setAmount={setAmount} id={identifier} />

      <ButtonGroup className="mt-1 player-and-submit-group">
        <DropdownButton
          as={ButtonGroup}
          variant="outline-secondary"
          id={`${identifier}-player`}
          title={selectedPlayer?.name ?? "Seleccionar Jugador"}
        >
          {players.map((player) => (
            <Dropdown.Item key={player.playerId} onClick={() => setSelectedPlayer(player)}>
              {player.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <Button variant="outline-secondary" onClick={submit}>
          {submitText}
        </Button>
      </ButtonGroup>

      <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
    </>
  );
};

export default ValuePlayerForm;
