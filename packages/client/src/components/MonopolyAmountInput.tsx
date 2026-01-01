import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, InputGroup } from "react-bootstrap";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { useSounds } from "./SoundProvider";

interface IMonopolyAmountInputProps {
  amount: number | null;
  setAmount: (amount: number | null) => void;
  id?: string;
  autoFocus?: boolean;
  showQuickButtons?: boolean;
}

// Quick amount button with color styling
interface QuickAmount {
  value: number;
  color: string;
  textColor: string;
}

// Monopoly denominations with authentic bill colors
// $1: Blanco tradicional, $5: Rosa, $10: Azul claro, $20: Verde claro
// $50: Morado claro, $100: Beige, $500: Naranja dorado
// $1000: Verde CLP (Ignacio Carrera Pinto), $1500: Lila CLP (Manuel Rodríguez)
const QUICK_AMOUNTS: QuickAmount[] = [
  { value: 1, color: '#ffffff', textColor: '#1e293b' },
  { value: 5, color: '#ec4899', textColor: '#ffffff' },
  { value: 10, color: '#60a5fa', textColor: '#ffffff' },
  { value: 20, color: '#4ade80', textColor: '#1e293b' },
  { value: 50, color: '#a78bfa', textColor: '#ffffff' },
  { value: 100, color: '#fef3c7', textColor: '#1e293b' },
  { value: 500, color: '#f59e0b', textColor: '#ffffff' },
  { value: 1000, color: '#22c55e', textColor: '#ffffff' },
  { value: 1500, color: '#8b5cf6', textColor: '#ffffff' }
];

const MonopolyAmountInput: React.FC<IMonopolyAmountInputProps> = ({
  amount,
  setAmount,
  id,
  autoFocus = false,
  showQuickButtons = true
}) => {
  const [inputValue, setInputValue] = useState("");
  const numberInputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSounds();

  useEffect(() => {
    if (autoFocus && numberInputRef.current !== null) {
      numberInputRef.current.focus();
    }
  }, [numberInputRef]);

  // When the external amount changes, update the internal
  useEffect(() => {
    setInputValue(amount === 0 || amount === null ? "" : `${amount}`);
  }, [amount]);

  // When the internal amount changes, update the external
  useEffect(() => {
    setAmount(inputValue === "" ? null : parseFloat(inputValue));
  }, [inputValue]);

  const multiply = (multiplier: number) => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      setInputValue(`${multiplier * value}`);
    }

    // Refocus the number input. Since useState is async, we need to wait for the value to be updated
    setTimeout(() => {
      if (numberInputRef.current !== null) {
        numberInputRef.current.focus();
        numberInputRef.current.setSelectionRange(-1, -1);
      }
    }, 50);
  };

  const setQuickAmount = (value: number) => {
    const currentValue = parseFloat(inputValue) || 0;
    const newValue = currentValue + value;
    setInputValue(`${newValue}`);
    playSound('click');
    
    // Refocus the number input
    setTimeout(() => {
      if (numberInputRef.current !== null) {
        numberInputRef.current.focus();
        numberInputRef.current.setSelectionRange(-1, -1);
      }
    }, 50);
  };

  return (
    <div className="monopoly-amount-input">
      <InputGroup style={{ display: "grid", gridTemplateColumns: showQuickButtons ? "2fr 7fr 2fr" : "1fr" }}>
        {showQuickButtons && (
          <InputGroup.Prepend>
            <Button block variant="warning" onClick={() => multiply(1000000)}>
              M
            </Button>
          </InputGroup.Prepend>
        )}

        <NumberFormat
          allowNegative={false}
          thousandSeparator={true}
          prefix="$"
          id={id}
          value={inputValue}
          onValueChange={({ value }: NumberFormatValues) => setInputValue(value)}
          className="form-control text-center w-100"
          autoComplete="off"
          getInputRef={numberInputRef}
          inputMode="decimal"
          placeholder="0"
        />

        {showQuickButtons && (
          <InputGroup.Append>
            <Button block variant="primary" onClick={() => multiply(1000)}>
              K
            </Button>
          </InputGroup.Append>
        )}
      </InputGroup>

      {showQuickButtons && (
        <div className="quick-amounts mt-2">
          <small className="text-muted d-block mb-1">Valores rápidos:</small>
          <ButtonGroup size="sm" className="w-100 flex-wrap">
            {QUICK_AMOUNTS.map((item) => (
              <Button
                key={item.value}
                variant="outline-monopoly"
                className="quick-amount-btn"
                style={{
                  backgroundColor: item.color,
                  color: item.textColor,
                  borderColor: '#1e293b',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  flex: '1 1 auto',
                  minWidth: '60px'
                }}
                onClick={() => setQuickAmount(item.value)}
              >
                ${item.value.toLocaleString()}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      )}
    </div>
  );
};

export default MonopolyAmountInput;
