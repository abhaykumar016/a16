// Utility to convert Base64 string to ArrayBuffer
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Decodes raw PCM data from Gemini into an AudioBuffer
export const decodeAudioData = async (
  audioData: ArrayBuffer,
  sampleRate: number = 24000
): Promise<AudioBuffer> => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Gemini TTS usually returns raw PCM (16-bit signed integer)
  // We need to convert it to float32 for the Web Audio API
  const dataView = new DataView(audioData);
  const float32Data = new Float32Array(audioData.byteLength / 2);
  
  for (let i = 0; i < float32Data.length; i++) {
    // Read 16-bit integer, normalize to -1.0 to 1.0 range
    const int16 = dataView.getInt16(i * 2, true); // true for little-endian
    float32Data[i] = int16 / 32768.0;
  }

  const audioBuffer = audioContext.createBuffer(1, float32Data.length, sampleRate);
  audioBuffer.copyToChannel(float32Data, 0);
  
  return audioBuffer;
};

// Helper to play an AudioBuffer
export const playAudioBuffer = async (buffer: AudioBuffer): Promise<void> => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
  
  return new Promise((resolve) => {
    source.onended = () => {
      resolve();
      audioContext.close(); // Clean up context after playing
    };
  });
};