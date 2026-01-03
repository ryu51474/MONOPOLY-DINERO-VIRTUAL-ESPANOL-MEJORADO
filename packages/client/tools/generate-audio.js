const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "../public/sounds");

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy the cha-ching sound file from the public/sounds folder
const sourceChaChingFile = path.join(__dirname, "../public/sounds/cash_register_kaching___sound_effect_hd.wav");

// WAV file header generator (for generated sounds)
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
function generateTone(frequency, duration, sampleRate, type, volume, harmonic = 0) {
  const numSamples = Math.floor(sampleRate * duration);
  const samples = Buffer.alloc(numSamples * 2);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    
    if (type === 'sine') {
      sample = Math.sin(2 * Math.PI * frequency * t);
      if (harmonic > 0) {
        sample += harmonic * Math.sin(2 * Math.PI * frequency * 2 * t) * 0.3;
        sample += harmonic * 0.5 * Math.sin(2 * Math.PI * frequency * 3 * t) * 0.15;
      }
    } else if (type === 'square') {
      sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
    } else if (type === 'sawtooth') {
      sample = 2 * ((frequency * t) % 1) - 1;
    } else if (type === 'triangle') {
      sample = 2 * Math.abs(2 * ((frequency * t) % 1) - 1) - 1;
    }
    
    const envelope = Math.exp(-3 * (i / numSamples));
    const intSample = Math.floor(sample * volume * 32767 * envelope);
    const clampedSample = Math.max(-32768, Math.min(32767, intSample));
    samples.writeInt16LE(clampedSample, i * 2);
  }
  
  return samples;
}

// Copy cha-ching sound for both money and transaction
function generateChaChingSound() {
  if (fs.existsSync(sourceChaChingFile)) {
    // Copy to money.wav (using the cash register sound directly)
    fs.copyFileSync(sourceChaChingFile, path.join(outputDir, "money.wav"));
    console.log("Copied: money.wav (cash register cha-ching)");
    
    // Copy to transaction.wav (same sound for both sender and receiver)
    fs.copyFileSync(sourceChaChingFile, path.join(outputDir, "transaction.wav"));
    console.log("Copied: transaction.wav (cash register cha-ching)");
  } else {
    console.log("Warning: Source cha-ching file not found, using fallback generated sound");
    // Fallback to generated sound if file doesn't exist
    generateFallbackChaChingSound();
  }
}

// Fallback generated cha-ching sound
function generateFallbackChaChingSound() {
  const sampleRate = 44100;
  const samples = [];
  
  const tones = [
    { freq: 987, dur: 0.06, type: 'sine', vol: 0.35, harmonic: 1 },
    { freq: 1247, dur: 0.04, type: 'sine', vol: 0.30, harmonic: 1 },
    { freq: 1318, dur: 0.04, type: 'sine', vol: 0.25 },
    { freq: 1568, dur: 0.04, type: 'sine', vol: 0.20 },
    { freq: 0, dur: 0.03, type: 'sine', vol: 0 },
    { freq: 2093, dur: 0.10, type: 'sine', vol: 0.50, harmonic: 1 },
    { freq: 2637, dur: 0.08, type: 'sine', vol: 0.40, harmonic: 1 },
    { freq: 3136, dur: 0.06, type: 'sine', vol: 0.35, harmonic: 1 },
    { freq: 4186, dur: 0.15, type: 'sine', vol: 0.30, harmonic: 1 },
    { freq: 2093, dur: 0.20, type: 'sine', vol: 0.25, harmonic: 1 },
  ];
  
  tones.forEach((tone, idx) => {
    if (tone.freq === 0) {
      const gapSamples = Math.floor(tone.dur * sampleRate);
      for (let i = 0; i < gapSamples * 2; i++) {
        samples.push(0, 0);
      }
      return;
    }
    
    const gap = idx === tones.length - 1 ? 0 : 0.01;
    const gapSamples = Math.floor(gap * sampleRate);
    
    for (let i = 0; i < gapSamples * 2; i++) {
      samples.push(0, 0);
    }
    
    const toneSamples = generateTone(tone.freq, tone.dur, sampleRate, tone.type, tone.vol, tone.harmonic);
    for (let i = 0; i < toneSamples.length; i++) {
      samples.push(toneSamples[i]);
    }
  });
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "money.wav"), Buffer.concat([wavHeader, audioData]));
  fs.writeFileSync(path.join(outputDir, "transaction.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated fallback: money.wav and transaction.wav");
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
    
    for (let i = 0; i < gapSamples * 2; i++) {
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
    { freq: 523.25, dur: 0.08, type: 'triangle', vol: 0.4 },
    { freq: 659.25, dur: 0.08, type: 'triangle', vol: 0.4 },
    { freq: 783.99, dur: 0.08, type: 'triangle', vol: 0.35 },
    { freq: 1046.50, dur: 0.12, type: 'triangle', vol: 0.35 },
    { freq: 783.99, dur: 0.08, type: 'triangle', vol: 0.3 },
    { freq: 1046.50, dur: 0.20, type: 'triangle', vol: 0.5 },
    { freq: 2093, dur: 0.15, type: 'sine', vol: 0.45, harmonic: 1 },
    { freq: 2637, dur: 0.12, type: 'sine', vol: 0.35, harmonic: 1 },
    { freq: 3136, dur: 0.25, type: 'sine', vol: 0.30, harmonic: 1 },
  ];
  
  tones.forEach((tone, idx) => {
    const gap = idx === tones.length - 1 ? 0 : 0.05;
    const gapSamples = Math.floor(gap * sampleRate);
    
    for (let i = 0; i < gapSamples * 2; i++) {
      samples.push(0, 0);
    }
    
    const toneSamples = generateTone(tone.freq, tone.dur, sampleRate, tone.type, tone.vol, tone.harmonic);
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
    
    for (let i = 0; i < gapSamples * 2; i++) {
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
    
    for (let i = 0; i < gapSamples * 2; i++) {
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

// Generate shuffle sound - deterministic using seeded random
function generateShuffleSound() {
  const sampleRate = 44100;
  const samples = [];
  
  // Simple seeded random number generator for deterministic output
  // Using a FIXED seed to ensure the same audio is generated every time
  let seed = 12345;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  
  // Use a fixed sample offset counter instead of samples.length
  let currentSampleOffset = 0;
  
  for (let i = 0; i < 12; i++) {
    const gap = i * 0.035;
    const gapSamples = Math.floor(gap * sampleRate);
    
    // Add gap samples (stereo = 2 samples per channel)
    while (currentSampleOffset < gapSamples) {
      samples.push(0, 0);
      currentSampleOffset++;
    }
    
    // Use seeded random for deterministic output - same seed produces same audio
    const toneSamples = generateTone(250 + seededRandom() * 150, 0.025, sampleRate, 'triangle', 0.2);
    for (let j = 0; j < toneSamples.length; j++) {
      samples.push(toneSamples[j]);
      currentSampleOffset++;
    }
  }
  
  const audioData = Buffer.from(samples);
  const wavHeader = createWavHeader(audioData.length, sampleRate, 1, 16);
  fs.writeFileSync(path.join(outputDir, "shuffle.wav"), Buffer.concat([wavHeader, audioData]));
  console.log("Generated: shuffle.wav (deterministic)");
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
generateErrorSound();
generateBigTransactionSound();
generateNotificationSound();
generateClickSound();
generateWinSound();
generateShuffleSound();
generateHoverSound();
console.log("\nDone! Audio files generated in:", outputDir);

