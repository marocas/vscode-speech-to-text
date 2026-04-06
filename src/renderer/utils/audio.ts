export function playStartBell(): void {
  const audioContext = new AudioContext();
  const now = audioContext.currentTime;

  const tone = (frequency: number, start: number, duration: number, gain = 0.05): void => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = gain;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(start);
    oscillator.stop(start + duration);
  };

  tone(660, now, 0.08);
  tone(880, now + 0.09, 0.12);

  setTimeout(() => {
    void audioContext.close();
  }, 350);
}

export function playStopBell(): void {
  const audioContext = new AudioContext();
  const now = audioContext.currentTime;

  const tone = (frequency: number, start: number, duration: number, gain = 0.05): void => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = gain;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(start);
    oscillator.stop(start + duration);
  };

  tone(880, now, 0.08);
  tone(660, now + 0.09, 0.12);

  setTimeout(() => {
    void audioContext.close();
  }, 350);
}
