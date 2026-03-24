export function findSupportedAudioMimeType(): string | undefined {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  return candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
}

function float32To16BitPCM(output: DataView, offset: number, input: Float32Array): void {
  for (let i = 0; i < input.length; i += 1, offset += 2) {
    const sample = Math.max(-1, Math.min(1, input[i] || 0));
    output.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
}

function encodeMonoWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string): void => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * bytesPerSample, true);
  float32To16BitPCM(view, 44, samples);

  return buffer;
}

export async function blobToMonoWav(blob: Blob): Promise<ArrayBuffer> {
  const audioContext = new AudioContext();

  try {
    const sourceBuffer = await blob.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(sourceBuffer.slice(0));
    const channelData = decoded.getChannelData(0);
    return encodeMonoWav(channelData, decoded.sampleRate);
  } finally {
    await audioContext.close();
  }
}

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
