
"use client";

type SoundType = 'thud';

const sounds: Record<SoundType, {
  type: OscillatorType;
  frequency: number;
  duration: number;
  gain: number;
}> = {
  thud: { type: 'square', frequency: 100, duration: 0.1, gain: 0.1 },
};

export const playSound = (sound: SoundType) => {
  try {
    const audioContext = new (window.AudioContext)();
    if (!audioContext) return;

    const { type, frequency, duration, gain } = sounds[sound];

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn("Could not play sound:", error);
  }
};
