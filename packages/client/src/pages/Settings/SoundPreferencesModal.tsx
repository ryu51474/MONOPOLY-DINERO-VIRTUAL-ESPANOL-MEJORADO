import React from "react";
import { Button, Modal } from "react-bootstrap";
import { SoundType, useSounds } from "../../components/SoundProvider";

// Sound configuration with descriptions
const SOUND_CONFIG: { type: SoundType; label: string; description: string; defaultEnabled: boolean }[] = [
  { type: 'money', label: 'Monedas', description: 'Sonido de monedas cayendo', defaultEnabled: true },
  { type: 'transaction', label: 'Transacción', description: 'Confirmación de transacción exitosa', defaultEnabled: true },
  { type: 'bigTransaction', label: 'Gran Transacción', description: 'Sonido para transacciones grandes', defaultEnabled: true },
  { type: 'error', label: 'Error', description: 'Sonido cuando ocurre un error', defaultEnabled: true },
  { type: 'notification', label: 'Notificación', description: 'Nuevas notificaciones', defaultEnabled: true },
  { type: 'click', label: 'Clic', description: 'Sonido al hacer clic en botones', defaultEnabled: true },
  { type: 'hover', label: 'Hover', description: 'Sonido al pasar sobre elementos', defaultEnabled: false },
  { type: 'win', label: 'Victoria', description: 'Sonido de celebración', defaultEnabled: true },
  { type: 'shuffle', label: 'Barajar', description: 'Sonido al mover dinero', defaultEnabled: true },
];

interface ISoundPreferencesModalProps {
  show: boolean;
  onHide: () => void;
}

// Local storage key for sound preferences
const SOUND_PREFERENCES_KEY = 'monopoly_sound_preferences';

// Get stored preferences or defaults
const getDefaultPreferences = (): Record<SoundType, boolean> => {
  const stored = localStorage.getItem(SOUND_PREFERENCES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Return defaults if parsing fails
    }
  }
  return SOUND_CONFIG.reduce((acc, sound) => {
    acc[sound.type] = sound.defaultEnabled;
    return acc;
  }, {} as Record<SoundType, boolean>);
};

const SoundPreferencesModal: React.FC<ISoundPreferencesModalProps> = ({ show, onHide }) => {
  const { playSound } = useSounds();
  const [preferences, setPreferences] = React.useState<Record<SoundType, boolean>>(getDefaultPreferences);
  const [testingSound, setTestingSound] = React.useState<SoundType | null>(null);

  const toggleSound = (type: SoundType) => {
    const newPreferences = { ...preferences, [type]: !preferences[type] };
    setPreferences(newPreferences);
    localStorage.setItem(SOUND_PREFERENCES_KEY, JSON.stringify(newPreferences));
    
    // Play test sound
    if (preferences[type]) {
      playSound(type);
    }
  };

  const saveAndClose = () => {
    onHide();
  };

  const testAllSounds = () => {
    let delay = 0;
    Object.entries(preferences).forEach(([type]) => {
      if (preferences[type as SoundType]) {
        setTimeout(() => {
          setTestingSound(type as SoundType);
          playSound(type as SoundType);
          setTimeout(() => setTestingSound(null), 300);
        }, delay);
        delay += 400;
      }
    });
  };

  return (
    <Modal show={show} onHide={saveAndClose} centered size="lg">
      {/* @ts-expect-error - React Bootstrap type incompatibility with React 18 */}
      <Modal.Header>
        <Modal.Title>🔊 Preferencias de Sonido</Modal.Title>
        <button type="button" className="close" onClick={saveAndClose} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          Activa o desactiva los efectos de sonido según tus preferencias.
          Haz clic en cualquier interruptor para probar el sonido.
        </p>
        
        <div className="sound-list">
          {SOUND_CONFIG.map((sound) => (
            <div 
              key={sound.type} 
              className={`sound-toggle ${testingSound === sound.type ? 'testing' : ''}`}
              style={{ 
                background: testingSound === sound.type ? 'rgba(34, 197, 94, 0.2)' : undefined,
                border: testingSound === sound.type ? '2px solid var(--monopoly-green)' : undefined
              }}
            >
              <div className="sound-toggle-label">
                <span className="sound-icon">
                  {sound.type === 'money' && '💰'}
                  {sound.type === 'transaction' && '✅'}
                  {sound.type === 'bigTransaction' && '💎'}
                  {sound.type === 'error' && '❌'}
                  {sound.type === 'notification' && '🔔'}
                  {sound.type === 'click' && '👆'}
                  {sound.type === 'hover' && '🖱️'}
                  {sound.type === 'win' && '🏆'}
                  {sound.type === 'shuffle' && '🃏'}
                </span>
                <div>
                  <div className="fw-bold">{sound.label}</div>
                  <small className="text-muted">{sound.description}</small>
                </div>
              </div>
              <div 
                className={`toggle-switch ${preferences[sound.type] ? 'active' : ''}`}
                onClick={() => toggleSound(sound.type)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleSound(sound.type)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button variant="outline-monopoly" onClick={testAllSounds}>
            🔊 Probar Todos los Sonidos
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={saveAndClose}>
          Guardar y Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SoundPreferencesModal;

