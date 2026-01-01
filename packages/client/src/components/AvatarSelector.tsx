import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useSounds } from "./SoundProvider";

// Predefined avatar options with colors and emojis
export const AVATAR_OPTIONS = [
  { id: "dog", emoji: "🐕", color: "#8B4513" },
  { id: "cat", emoji: "🐱", color: "#FF6B6B" },
  { id: "mouse", emoji: "🐭", color: "#A0A0A0" },
  { id: "rabbit", emoji: "🐰", color: "#FFB6C1" },
  { id: "fox", emoji: "🦊", color: "#FF6B35" },
  { id: "wolf", emoji: "🐺", color: "#6B5B95" },
  { id: "panda", emoji: "🐼", color: "#2C3E50" },
  { id: "lion", emoji: "🦁", color: "#F39C12" },
  { id: "tiger", emoji: "🐯", color: "#E74C3C" },
  { id: "horse", emoji: "🐴", color: "#8B4513" },
  { id: "unicorn", emoji: "🦄", color: "#9B59B6" },
  { id: "zebra", emoji: "🦓", color: "#34495E" },
  { id: "cow", emoji: "🐮", color: "#D5D8DC" },
  { id: "pig", emoji: "🐷", color: "#FFB6C1" },
  { id: "koala", emoji: "🐨", color: "#7F8C8D" },
  { id: "bear", emoji: "🐻", color: "#8B4513" },
];

interface IAvatarSelectorProps {
  show: boolean;
  onHide: () => void;
  currentAvatar?: string;
  onSelect: (avatarId: string) => void;
}

const AvatarSelector: React.FC<IAvatarSelectorProps> = ({
  show,
  onHide,
  currentAvatar,
  onSelect
}) => {
  const { playSound } = useSounds();

  const handleSelect = (avatarId: string) => {
    onSelect(avatarId);
    playSound('click');
    onHide();
  };

  const selectedAvatar = AVATAR_OPTIONS.find(a => a.id === currentAvatar);

  return (
    <Modal show={show} onHide={onHide} centered className="avatar-modal">
      {/* @ts-expect-error - React Bootstrap type incompatibility with React 18 */}
      <Modal.Header>
        <Modal.Title>🎨 Elige tu Avatar</Modal.Title>
        <button type="button" className="close" onClick={onHide} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center text-muted mb-3">
          Selecciona un avatar para representar tu ficha en el juego
        </p>
        {selectedAvatar && (
          <div className="current-selection text-center mb-3">
            <span 
              className="player-avatar"
              style={{ 
                backgroundColor: selectedAvatar.color,
                width: '60px',
                height: '60px',
                fontSize: '2rem',
                margin: '0 auto'
              }}
            >
              {selectedAvatar.emoji}
            </span>
            <small className="text-muted d-block mt-1">Avatar actual</small>
          </div>
        )}
        <div className="avatar-selector">
          {AVATAR_OPTIONS.map((avatar) => (
            <div
              key={avatar.id}
              className={`avatar-option position-relative ${currentAvatar === avatar.id ? 'selected' : ''}`}
              style={{ backgroundColor: avatar.color }}
              onClick={() => handleSelect(avatar.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(avatar.id)}
            >
              {avatar.emoji}
              {currentAvatar === avatar.id && (
                <span className="avatar-check">✓</span>
              )}
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AvatarSelector;

