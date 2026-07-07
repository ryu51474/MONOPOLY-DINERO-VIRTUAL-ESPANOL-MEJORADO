import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { trackEndGame } from "../../utils";

interface IEndGameConfirmDialogProps {
  onStartSolo: () => void;
  onStartEachPlayer: () => void;
  onClose: () => void;
}

const EndGameConfirmDialog: React.FC<IEndGameConfirmDialogProps> = ({
  onStartSolo,
  onStartEachPlayer,
  onClose
}) => {
  const [showSelector, setShowSelector] = useState(false);

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
        {!showSelector ? (
          <>
            <p>¿Estás seguro de que quieres terminar el juego?</p>
            <p>Esto expulsará a todos y no podrás volver a unirte al juego.</p>
          </>
        ) : (
          <>
            <p className="text-center font-weight-bold mb-3">Selecciona cómo hacer el inventario de propiedades:</p>

            <div
              className="mode-option-card"
              onClick={() => { onStartSolo(); onClose(); trackEndGame(); }}
              style={{
                cursor: 'pointer',
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '12px',
                border: '2px solid var(--gold-dark)',
                background: 'var(--gold-cream)',
                transition: 'all 0.2s ease'
              }}
            >
              <h5 className="font-weight-bold mb-1">👑 HACERLO YO (SOLO)</h5>
              <p className="mb-0 small text-muted">
                Tú como banquero seleccionas las propiedades de cada jugador uno por uno en tu pantalla.
              </p>
            </div>

            <div
              className="mode-option-card"
              onClick={() => { onStartEachPlayer(); onClose(); trackEndGame(); }}
              style={{
                cursor: 'pointer',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid var(--monopoly-blue)',
                background: '#eff6ff',
                transition: 'all 0.2s ease'
              }}
            >
              <h5 className="font-weight-bold mb-1">👥 CADA JUGADOR (EN LÍNEA)</h5>
              <p className="mb-0 small text-muted">
                Cada jugador selecciona sus propias propiedades desde su dispositivo en tiempo real, viendo lo que eligen los demás.
              </p>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Cancelar
        </Button>
        {!showSelector && (
          <Button variant="success" className="ml-1" onClick={() => setShowSelector(true)}>
            Continuar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EndGameConfirmDialog;
