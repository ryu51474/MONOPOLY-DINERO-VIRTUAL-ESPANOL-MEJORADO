// Sonidos para Monopoly Money - VERSION ULTRA VIVA
// Usa Web Audio API para generar sonidos sin necesidad de archivos externos

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Inicializar el contexto de audio solo cuando se necesita
    if (typeof window !== 'undefined') {
      this.audioContext = null;
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getAudioContext();
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
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  // Sonido de monedas cayendo (ka-ching!)
  playMoneySound(): void {
    if (!this.enabled) return;
    
    // Secuencia de monedas cayendo
    this.playTone(1200, 0.08, 'square', 0.12);
    setTimeout(() => this.playTone(1400, 0.08, 'square', 0.12), 60);
    setTimeout(() => this.playTone(1600, 0.1, 'square', 0.1), 120);
    setTimeout(() => this.playTone(1800, 0.12, 'square', 0.08), 180);
  }

  // Sonido de transacción exitosa (notas alegres)
  playTransactionSound(): void {
    if (!this.enabled) return;
    
    // Melodía de confirmación - estilo casino
    this.playTone(523.25, 0.12, 'sine', 0.35); // C5
    setTimeout(() => this.playTone(659.25, 0.12, 'sine', 0.3), 80); // E5
    setTimeout(() => this.playTone(783.99, 0.18, 'sine', 0.25), 160); // G5
    setTimeout(() => this.playTone(1046.50, 0.25, 'sine', 0.2), 240); // C6
  }

  // Sonido de error (buzz suave)
  playErrorSound(): void {
    if (!this.enabled) return;
    
    this.playTone(150, 0.25, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(100, 0.3, 'sawtooth', 0.15), 150);
  }

  // Sonido de notificación (ding!)
  playNotificationSound(): void {
    if (!this.enabled) return;
    
    this.playTone(880, 0.1, 'sine', 0.25);
    setTimeout(() => this.playTone(1320, 0.15, 'sine', 0.2), 80);
  }

  // Sonido de klik para botones (suave)
  playClickSound(): void {
    if (!this.enabled) return;
    
    this.playTone(600, 0.03, 'sine', 0.08);
  }

  // Sonido de shuffle/barajar (dinero moviéndose)
  playShuffleSound(): void {
    if (!this.enabled) return;
    
    // Sonido de papel/dinero moviéndose rápidamente
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        this.playTone(250 + Math.random() * 150, 0.025, 'triangle', 0.08);
      }, i * 35);
    }
  }

  // Sonido especial para transacciones grandes (ka-CHING!)
  playBigTransactionSound(): void {
    if (!this.enabled) return;
    
    // Ka-ching más dramático
    this.playTone(1000, 0.05, 'square', 0.15);
    setTimeout(() => this.playTone(1200, 0.05, 'square', 0.15), 40);
    setTimeout(() => this.playTone(1500, 0.08, 'square', 0.12), 80);
    setTimeout(() => this.playTone(2000, 0.1, 'square', 0.1), 120);
    setTimeout(() => this.playTone(1800, 0.15, 'sine', 0.15), 160);
    setTimeout(() => this.playTone(2200, 0.2, 'sine', 0.1), 200);
  }

  // Sonido de hover en tarjeta
  playHoverSound(): void {
    if (!this.enabled) return;
    
    this.playTone(800, 0.02, 'sine', 0.05);
  }

  // Sonido de celebración (win!)
  playWinSound(): void {
    if (!this.enabled) return;
    
    // Fanfare corta
    this.playTone(523.25, 0.15, 'triangle', 0.3);
    setTimeout(() => this.playTone(659.25, 0.15, 'triangle', 0.3), 100);
    setTimeout(() => this.playTone(783.99, 0.15, 'triangle', 0.3), 200);
    setTimeout(() => this.playTone(1046.50, 0.3, 'triangle', 0.35), 300);
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }
}

// Exportar instancia única
export const soundManager = new SoundManager();

// Hook para usar sonidos en componentes React
export const useSounds = () => {
  return {
    playMoneySound: () => soundManager.playMoneySound(),
    playTransactionSound: () => soundManager.playTransactionSound(),
    playErrorSound: () => soundManager.playErrorSound(),
    playNotificationSound: () => soundManager.playNotificationSound(),
    playClickSound: () => soundManager.playClickSound(),
    playShuffleSound: () => soundManager.playShuffleSound(),
    playBigTransactionSound: () => soundManager.playBigTransactionSound(),
    playHoverSound: () => soundManager.playHoverSound(),
    playWinSound: () => soundManager.playWinSound(),
    enableSounds: () => soundManager.enable(),
    disableSounds: () => soundManager.disable(),
  };
};

