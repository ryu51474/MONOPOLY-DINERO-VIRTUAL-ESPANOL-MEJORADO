const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "../public/sounds");

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// WAV file header generator
function createWavHeader(dataLength, sampleRate, numChannels, bitsPerSample) {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44);
  
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);
  
  return buffer;
}

// Generate audio samples for a tone
function generateTone(frequency, duration, sampleRate, type, volume) {
  const numSamples = Math.floor(sampleRate * duration);
  const samples = Buffer.alloc(numSamples * 2);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    
    if (type === 'sine') {
      sample = Math.sin(2 * Math.PI * frequency * t);
    } else if (type === 'square') {
      sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
    } else if (type === 'sawtooth') {
      sample = 2 * ((frequency * t) % 1) - 1;
    } else if (type === 'triangle') {
      sample = 2 * Math.abs(2 * ((frequency * t) % 1) - 1) - 1;
    }
    
    // Apply envelope (fade out)
    const envelope = Math.exp(-3 * (i / numSamples));
    const intSample = Math.floor(sample * volume * 32767 * envelope);
    
    // Clamp to 16-bit range
    const clampedSample = Math.max(-32768, Math.min(32767, intSample));
    samples.writeInt16LE(clampedSample, i * 2);
  }
  
  return samples;
}

// Generate cha-ching sound (cash register)
function generateChaChingSound() {
  const sampleRate = 44100;
  const samples = [];
  
  // Cha-ching classic cash register sound
  const tones = [
    // Opening "cha"
    { freq: 1200, dur: 0.08, type: 'sine', vol: 0.4 },
    { freq: 1400, dur: 0.06, type: 'sine', vol: 0.35 },
    // Transition
    { freq: 1600, dur: 0.04, type: 'sine', vol: 0.3 },
    // "ching" - bell-like tone
    { freq: 2500, dur: 0.15, type: 'sine', vol: 0.5 },
    { freq: 3000, dur: 0.10, type: 'sine', vol: 0.4 },
    { freq: 3500, dur: 0.20, type: 'sine', vol: 0.35 },
  ];
  
  let currentPos = 0;
  
  tones.forEach((tone, idx) => {
    const gap = idx === tones.length - 1 ? 0 : 0.02;
    const gapSamples = Math.floor(gap * sampleRate);
    
    // Add gap
    for (let i = 0; i < gapSamples; i++) {
      samples.push(0, 0);
    }
    
    const toneSamples = generateTone(tone.freq, tone.dur, sampleRate, tone.type, tone.vol);
    for (let i = 0; i < toneSamples.length; i++) {
      samples.push(toneSamples[i]);
    }
  });
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "money.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: money.wav (cha-ching)");
}

// Generate transaction sound (casino style)
function generateTransactionSound() {
  const sampleRate = 44100;
  const samples = [];
  
  // Casino confirmation melody
  const tones = [
    { freq: 523.25, dur: 0.12, type: 'sine', vol: 0.5 },
    { freq: 659.25, dur: 0.12, type: 'sine', vol: 0.45 },
    { freq: 783.99, dur: 0.18, type: 'sine', vol: 0.4 },
    { freq: 1046.50, dur: 0.25, type: 'sine', vol: 0.35 },
  ];
  
  tones.forEach((tone, idx) => {
    const gap = idx === tones.length - 1 ? 0 : 0.08;
    const gapSamples = Math.floor(gap * sampleRate);
    
    // Add gap
    for (let i = 0; i < gapSamples; i++) {
      samples.push(0, 0);
    }
    
    const toneSamples = generateTone(tone.freq, tone.dur, sampleRate, tone.type, tone.vol);
    for (let i = 0; i < toneSamples.length; i++) {
      samples.push(toneSamples[i]);
    }
  });
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "transaction.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: transaction.wav");
}

// Generate error sound
function generateErrorSound() {
  const sampleRate = 44100;
  const samples = [];
  
  const tones = [
    { freq: 150, dur: 0.25, type: 'sawtooth', vol: 0.4 },
    { freq: 100, dur: 0.30, type: 'sawtooth', vol: 0.3 },
  ];
  
  tones.forEach((tone, idx) => {
    const gap = idx === tones.length - 1 ? 0 : 0.15;
    const gapSamples = Math.floor(gap * sampleRate);
    
    for (let i = 0; i < gapSamples; i++) {
      samples.push(0, 0);
    }
    
    const toneSamples = generateTone(tone.freq, tone.dur, sampleRate, tone.type, tone.vol);
    for (let i = 0; i < toneSamples.length; i++) {
      samples.push(toneSamples[i]);
    }
  });
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "error.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: error.wav");
}

// Generate big transaction sound
function generateBigTransactionSound() {
  const sampleRate = 44100;
  const samples = [];
  
  const tones = [
    { freq: 1000, dur: 0.05, type: 'square', vol: 0.35 },
    { freq: 1200, dur: 0.05, type: 'square', vol: 0.35 },
    { freq: 1500, dur: 0.08, type: 'square', vol: 0.3 },
    { freq: 2000, dur: 0.10, type: 'square', vol: 0.25 },
    { freq: 1800, dur: 0.15, type: 'sine', vol: 0.3 },
    { freq: 2200, dur: 0.20, type: 'sine', vol: 0.25 },
  ];
  
  tones.forEach((tone, idx) => {
    const gap = idx === tones.length - 1 ? 0 : 0.04;
    const gapSamples = Math.floor(gap * sampleRate);
    
    for (let i = 0; i < gapSamples; i++) {
      samples.push(0, 0);
    }
    
    const toneSamples = generateTone(tone.freq, tone.dur, sampleRate, tone.type, tone.vol);
    for (let i = 0; i < toneSamples.length; i++) {
      samples.push(toneSamples[i]);
    }
  });
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "bigTransaction.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: bigTransaction.wav");
}

// Generate notification sound
function generateNotificationSound() {
  const sampleRate = 44100;
  const samples = [];
  
  const tones = [
    { freq: 880, dur: 0.10, type: 'sine', vol: 0.4 },
    { freq: 1320, dur: 0.15, type: 'sine', vol: 0.35 },
  ];
  
  tones.forEach((tone, idx) => {
    const gap = idx === tones.length - 1 ? 0 : 0.08;
    const gapSamples = Math.floor(gap * sampleRate);
    
    for (let i = 0; i < gapSamples; i++) {
      samples.push(0, 0);
    }
    
    const toneSamples = generateTone(tone.freq, tone.dur, sampleRate, tone.type, tone.vol);
    for (let i = 0; i < toneSamples.length; i++) {
      samples.push(toneSamples[i]);
    }
  });
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "notification.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: notification.wav");
}

// Generate click sound
function generateClickSound() {
  const sampleRate = 44100;
  const samples = [];
  
  const toneSamples = generateTone(600, 0.03, sampleRate, 'sine', 0.2);
  for (let i = 0; i < toneSamples.length; i++) {
    samples.push(toneSamples[i]);
  }
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "click.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: click.wav");
}

// Generate win sound
function generateWinSound() {
  const sampleRate = 44100;
  const samples = [];
  
  const tones = [
    { freq: 523.25, dur: 0.15, type: 'triangle', vol: 0.5 },
    { freq: 659.25, dur: 0.15, type: 'triangle', vol: 0.5 },
    { freq: 783.99, dur: 0.15, type: 'triangle', vol: 0.5 },
    { freq: 1046.50, dur: 0.30, type: 'triangle', vol: 0.55 },
  ];
  
  tones.forEach((tone, idx) => {
    const gap = idx === tones.length - 1 ? 0 : 0.1;
    const gapSamples = Math.floor(gap * sampleRate);
    
    for (let i = 0; i < gapSamples; i++) {
      samples.push(0, 0);
    }
    
    const toneSamples = generateTone(tone.freq, tone.dur, sampleRate, tone.type, tone.vol);
    for (let i = 0; i < toneSamples.length; i++) {
      samples.push(toneSamples[i]);
    }
  });
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "win.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: win.wav");
}

// Generate shuffle sound
function generateShuffleSound() {
  const sampleRate = 44100;
  const samples = [];
  
  for (let i = 0; i < 12; i++) {
    const gap = i * 0.035;
    const gapSamples = Math.floor(gap * sampleRate);
    
    // Fill gap
    for (let j = samples.length / 2; j < gapSamples; j++) {
      samples.push(0, 0);
    }
    
    const toneSamples = generateTone(250 + Math.random() * 150, 0.025, sampleRate, 'triangle', 0.2);
    for (let j = 0; j < toneSamples.length; j++) {
      samples.push(toneSamples[j]);
    }
  }
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "shuffle.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: shuffle.wav");
}

// Generate hover sound
function generateHoverSound() {
  const sampleRate = 44100;
  const samples = [];
  
  const toneSamples = generateTone(800, 0.02, sampleRate, 'sine', 0.15);
  for (let i = 0; i < toneSamples.length; i++) {
    samples.push(toneSamples[i]);
  }
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "hover.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: hover.wav");
}

// Generate all sounds
console.log("Generating audio files...\n");
generateChaChingSound();
generateTransactionSound();
generateErrorSound();
generateBigTransactionSound();
generateNotificationSound();
generateClickSound();
generateWinSound();
generateShuffleSound();
generateHoverSound();
console.log("\nDone! Audio files generated in:", outputDir);

