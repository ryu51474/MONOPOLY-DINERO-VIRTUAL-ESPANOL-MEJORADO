import { IGameStatePlayer } from "@monopoly-money/game-state";
import useLocalStorage from "@rehooks/local-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownButton,
  InputGroup,
  Modal
} from "react-bootstrap";
import { useModal } from "react-modal-hook";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { useSounds } from "../../components/SoundProvider";
import { formatCurrency } from "../../utils";

const passingGoRewardValueLocalStorageKey = "passingGoRewardValue";

interface IPlayerPassedGoProps {
  players: IGameStatePlayer[];
  onSubmit: (value: number, playerId: string) => void;
}

const PlayerPassedGo: React.FC<IPlayerPassedGoProps> = ({ players, onSubmit }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IGameStatePlayer | null>(null);
  const [storedPassingGoReward, setStoredPassingGoReward] = useLocalStorage<number>(
    passingGoRewardValueLocalStorageKey,
    200
  );
  const [baseReward, setBaseReward] = useState<number>(storedPassingGoReward ?? 200);
  const [isLandedOnGo, setIsLandedOnGo] = useState<boolean>(false);
  const { playSound } = useSounds();

  const valid = selectedPlayer !== null;

  const [updatePassingGoRewardModalValue, setUpdatePassingGoRewardModalValue] =
    useState<number>(baseReward);
  const [showUpdatePassingGoRewardModal, hideUpdatePassingGoRewardModal] = useModal(
    () => (
      <Modal show={true} onHide={hideUpdatePassingGoRewardModal} size="lg" centered>
        <Modal.Header
          closeButton
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          placeholder={undefined}
        >
          <Modal.Title>Actualizar Recompensa de Paso por GO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Cantidad</InputGroup.Text>
            </InputGroup.Prepend>
            <NumberFormat
              allowNegative={false}
              thousandSeparator={true}
              prefix="$"
              value={updatePassingGoRewardModalValue}
              onValueChange={({ value }: NumberFormatValues) => {
                setUpdatePassingGoRewardModalValue(parseInt(value, 10));
              }}
              className="form-control"
              autoComplete="off"
              decimalScale={0}
              inputMode="decimal"
            />
            <Button
              variant="success"
              onClick={() => {
                setBaseReward(updatePassingGoRewardModalValue);
                hideUpdatePassingGoRewardModal();
              }}
              className="remove-left-border-radius"
            >
              Establecer
            </Button>
          </InputGroup>
        </Modal.Body>
      </Modal>
    ),
    [updatePassingGoRewardModalValue, setUpdatePassingGoRewardModalValue]
  );

  // Update stored value when baseReward is changed
  useEffect(() => {
    setStoredPassingGoReward(baseReward);
  }, [baseReward]);

  const currentReward = isLandedOnGo ? baseReward * 2 : baseReward;

  const submit = () => {
    if (selectedPlayer !== null) {
      playSound('money');
      onSubmit(currentReward, selectedPlayer.playerId);
      setSelectedPlayer(null);
      setIsLandedOnGo(false); // Reset to "Passed Go" after giving money
    }
  };

  return (
    <>
      <label htmlFor="player-passed-go" className="mb-0">
        Jugador {isLandedOnGo ? "Cayó en" : "Pasó por"} GO ({formatCurrency(currentReward)})
      </label>
      <div className="small text-muted mb-1" style={{ fontSize: '0.72rem' }}>
        (Toca {isLandedOnGo ? "🎯" : "🏃"} para cobrar doble si caíste en GO)
      </div>

      <div className="mt-1 d-flex flex-nowrap align-items-stretch" style={{ gap: '0.5rem' }}>
        <Button 
          variant={isLandedOnGo ? "warning" : "outline-secondary"} 
          onClick={() => setIsLandedOnGo(!isLandedOnGo)}
          title={isLandedOnGo ? "Cambiar a Pasó por GO ($200)" : "Cambiar a Cayó en GO ($400)"}
          style={{ 
            width: '42px', 
            minWidth: '42px', 
            flex: '0 0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '0'
          }}
        >
          {isLandedOnGo ? "🎯" : "🏃"}
        </Button>

        <Button 
          variant="outline-secondary" 
          onClick={showUpdatePassingGoRewardModal}
          style={{ 
            width: '42px', 
            minWidth: '42px', 
            flex: '0 0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '0'
          }}
        >
          ⚙️
        </Button>

        <DropdownButton
          as={"div" as any}
          variant="outline-secondary"
          id="player-passed-go"
          title={selectedPlayer?.name ?? "Elige Jugador"}
          style={{ flex: '1 1 auto', minWidth: 0 }}
          className="d-flex"
        >
          {players.map((player) => (
            <Dropdown.Item key={player.playerId} onClick={() => setSelectedPlayer(player)}>
              {player.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <Button 
          variant="outline-secondary" 
          onClick={submit} 
          disabled={!valid}
          style={{ flex: '0 0 auto', minWidth: '42px' }}
        >
          Dar
        </Button>
      </div>
    </>
  );
};

export default PlayerPassedGo;
