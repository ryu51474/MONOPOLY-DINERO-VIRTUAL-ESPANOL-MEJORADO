import React, { createContext, useCallback, useContext, useState } from 'react';

// Sound types available in the application
export type SoundType = 
  | 'money' 
  | 'transaction' 
  | 'error' 
  | 'notification' 
  | 'click' 
  | 'shuffle' 
  | 'bigTransaction' 
  | 'hover' 
  | 'win';

interface SoundContextValue {
  playSound: (sound: SoundType) => void;
  isAudioEnabled: () => boolean;
  enableAudio: () => void;
  disableAudio: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

// Audio files map - these are generated during build
const soundFiles: Record<SoundType, string> = {
  money: '/sounds/money.wav',
  transaction: '/sounds/transaction.wav',
  error: '/sounds/error.wav',
  notification: '/sounds/notification.wav',
  click: '/sounds/click.wav',
  shuffle: '/sounds/shuffle.wav',
  bigTransaction: '/sounds/bigTransaction.wav',
  hover: '/sounds/hover.wav',
  win: '/sounds/win.wav',
};

// Preload audio files
const preloadedAudio: Record<SoundType, HTMLAudioElement | null> = {
  money: null,
  transaction: null,
  error: null,
  notification: null,
  click: null,
  shuffle: null,
  bigTransaction: null,
  hover: null,
  win: null,
};

const preloadAudio = () => {
  Object.entries(soundFiles).forEach(([key, filePath]) => {
    const audio = new Audio(filePath);
    audio.preload = 'auto';
    preloadedAudio[key as SoundType] = audio;
  });
};

// Sound manager class that uses pre-generated audio files
class SoundManager {
  private enabled: boolean = true;
  private initialized: boolean = false;

  constructor() {
    // Preload all audio files
    if (typeof window !== 'undefined') {
      preloadAudio();
    }
  }

  public play(sound: SoundType): void {
    if (!this.enabled || !this.initialized) return;
    
    try {
      const audio = preloadedAudio[sound];
      if (audio) {
        // Clone the audio to allow overlapping sounds
        const clone = audio.cloneNode() as HTMLAudioElement;
        clone.volume = 0.7;
        clone.play().catch(() => {
          // Ignore play errors (e.g., user hasn't interacted yet)
        });
      }
    } catch {
      // Silently fail on audio errors
    }
  }

  public initialize(): void {
    this.initialized = true;
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

const soundManager = new SoundManager();

// Hook to use sounds in any component
export const useSounds = () => {
  const context = useContext(SoundContext);
  if (!context) {
    return {
      playSound: (sound: SoundType) => soundManager.play(sound),
      isAudioEnabled: () => soundManager.isEnabled(),
      enableAudio: () => soundManager.enable(),
      disableAudio: () => soundManager.disable(),
    };
  }
  return context;
};

// Provider component to initialize audio on user interaction
export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  const initializeAudio = useCallback(() => {
    if (!initialized) {
      soundManager.initialize();
      setInitialized(true);
    }
  }, [initialized]);

  const playSound = useCallback((sound: SoundType) => {
    initializeAudio();
    soundManager.play(sound);
  }, [initializeAudio]);

  const enableAudio = useCallback(() => {
    soundManager.enable();
  }, []);

  const disableAudio = useCallback(() => {
    soundManager.disable();
  }, []);

  const isAudioEnabled = useCallback(() => {
    return soundManager.isEnabled();
  }, []);

  return (
    <SoundContext.Provider value={{ playSound, enableAudio, disableAudio, isAudioEnabled }}>
      {/* Global interaction listener to initialize audio context on mobile */}
      <div 
        onClick={initializeAudio} 
        onKeyDown={initializeAudio}
        onTouchStart={initializeAudio}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10000, pointerEvents: initialized ? 'none' : 'auto', opacity: 0 }}
      />
      {children}
    </SoundContext.Provider>
  );
};

// Helper function for CSS animation classes
export const getSoundAnimationClass = (sound: SoundType): string => {
  switch (sound) {
    case 'money':
    case 'transaction':
    case 'bigTransaction':
    case 'win':
      return 'sound-success';
    case 'error':
      return 'sound-error';
    default:
      return '';
  }
};

