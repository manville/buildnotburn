
"use client";

type SoundType = 'thud';

const sounds: Record<SoundType, {
  type: OscillatorType;
  frequency: number;
  duration: number;
  gain: number;
}> = {
  thud: { type: 'noise', frequency: 100, duration: 0.3, gain: 0.05 },
};

export const playSound = (sound: SoundType) => {
  try {
    const audioContext = new (window.AudioContext)();
    if (!audioContext) return;

    const { type, duration, gain } = sounds[sound];
    
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1000;
    bandpass.Q.value = 0.5;

    const gainNode = audioContext.createGain();
    
    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    noise.start(audioContext.currentTime);
    noise.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn("Could not play sound:", error);
  }
};
