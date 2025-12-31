import React, { useRef } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import QRCode from "react-qr-code";
import { useClipboard } from "use-clipboard-copy";
import useMessageModal from "../../hooks/useMessageModal";
import { getShareGameLink, trackGameCodeClick } from "../../utils";

interface IGameCodeProps {
  gameId: string;
  isBanker: boolean;
}

const GameCode: React.FC<IGameCodeProps> = ({ gameId, isBanker }) => {
  const showMessage = useMessageModal();

  const gameIdClicked = () => {
    showMessage({
      title: "Compartir juego",
      body: <ShareGameModalContent gameId={gameId} />,
      closeButtonText: null
    });
    trackGameCodeClick();
  };

  return (
    <div className="text-center">
      <h1 onClick={gameIdClicked}>{gameId}</h1>
      <div>
        <small className="text-muted">
          Toca el código de arriba para obtener un código QR o copiar un enlace para ayudar a otros
          jugadores a unirse
        </small>
      </div>
      {isBanker && (
        <small className="text-muted">
          Puedes ocultar esto cerrando el juego en la configuración
        </small>
      )}
      <hr />
    </div>
  );
};

interface ShareGameModalContentProps {
  gameId: string;
}

const ShareGameModalContent = ({ gameId }: ShareGameModalContentProps) => {
  const shareLink = getShareGameLink(gameId);

  const clipboard = useClipboard({
    copiedTimeout: 1000
  });
  const copyTooltipTarget = useRef<HTMLButtonElement>(null);

  const copyLink = () => {
    clipboard.copy(shareLink);
  };

  return (
    <>
      <p className="text-center">
        Haz que otros escaneen el código de abajo para unirse a tu juego
      </p>
      <div className="mt-4 text-center">
        <QRCode value={shareLink} />
      </div>

      <div className="mt-4">
        <Button block onClick={copyLink} ref={copyTooltipTarget}>
          Copiar enlace para enviar a otros
        </Button>
      </div>

      <Overlay target={copyTooltipTarget.current} show={clipboard.copied} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            Copiado al portapapeles
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

export default GameCode;

