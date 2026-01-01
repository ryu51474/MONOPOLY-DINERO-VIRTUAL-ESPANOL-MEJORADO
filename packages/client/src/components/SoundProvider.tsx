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

// Web Audio API implementation for generating sounds without external files
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = null;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (!this.enabled) return null;
    
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      
      // Resume audio context if suspended (browser policy)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {
          // Ignore errors from resuming
        });
      }
      
      return this.audioContext;
    } catch {
      return null;
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Silently fail on audio errors
    }
  }

  public play(sound: SoundType): void {
    if (!this.enabled || !this.initialized) return;
    
    switch (sound) {
      case 'money':
        this.playMoneySound();
        break;
      case 'transaction':
        this.playTransactionSound();
        break;
      case 'error':
        this.playErrorSound();
        break;
      case 'notification':
        this.playNotificationSound();
        break;
      case 'click':
        this.playClickSound();
        break;
      case 'shuffle':
        this.playShuffleSound();
        break;
      case 'bigTransaction':
        this.playBigTransactionSound();
        break;
      case 'hover':
        this.playHoverSound();
        break;
      case 'win':
        this.playWinSound();
        break;
    }
  }

  private playMoneySound(): void {
    // Secuencia de monedas cayendo
    this.playTone(1200, 0.08, 'square', 0.12);
    setTimeout(() => this.playTone(1400, 0.08, 'square', 0.12), 60);
    setTimeout(() => this.playTone(1600, 0.1, 'square', 0.1), 120);
    setTimeout(() => this.playTone(1800, 0.12, 'square', 0.08), 180);
  }

  private playTransactionSound(): void {
    // Melodía de confirmación - estilo casino
    this.playTone(523.25, 0.12, 'sine', 0.35);
    setTimeout(() => this.playTone(659.25, 0.12, 'sine', 0.3), 80);
    setTimeout(() => this.playTone(783.99, 0.18, 'sine', 0.25), 160);
    setTimeout(() => this.playTone(1046.50, 0.25, 'sine', 0.2), 240);
  }

  private playErrorSound(): void {
    this.playTone(150, 0.25, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(100, 0.3, 'sawtooth', 0.15), 150);
  }

  private playNotificationSound(): void {
    this.playTone(880, 0.1, 'sine', 0.25);
    setTimeout(() => this.playTone(1320, 0.15, 'sine', 0.2), 80);
  }

  private playClickSound(): void {
    this.playTone(600, 0.03, 'sine', 0.08);
  }

  private playShuffleSound(): void {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        this.playTone(250 + Math.random() * 150, 0.025, 'triangle', 0.08);
      }, i * 35);
    }
  }

  private playBigTransactionSound(): void {
    this.playTone(1000, 0.05, 'square', 0.15);
    setTimeout(() => this.playTone(1200, 0.05, 'square', 0.15), 40);
    setTimeout(() => this.playTone(1500, 0.08, 'square', 0.12), 80);
    setTimeout(() => this.playTone(2000, 0.1, 'square', 0.1), 120);
    setTimeout(() => this.playTone(1800, 0.15, 'sine', 0.15), 160);
    setTimeout(() => this.playTone(2200, 0.2, 'sine', 0.1), 200);
  }

  private playHoverSound(): void {
    this.playTone(800, 0.02, 'sine', 0.05);
  }

  private playWinSound(): void {
    this.playTone(523.25, 0.15, 'triangle', 0.3);
    setTimeout(() => this.playTone(659.25, 0.15, 'triangle', 0.3), 100);
    setTimeout(() => this.playTone(783.99, 0.15, 'triangle', 0.3), 200);
    setTimeout(() => this.playTone(1046.50, 0.3, 'triangle', 0.35), 300);
  }

  public initialize(): void {
    this.initialized = true;
    // Try to create audio context on first user interaction
    this.getAudioContext();
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
      {/* Add global click listener to initialize audio on first interaction */}
      <div 
        onClick={initializeAudio} 
        onKeyDown={initializeAudio}
        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, zIndex: -1 }}
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

