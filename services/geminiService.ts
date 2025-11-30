import { GoogleGenAI, Modality } from "@google/genai";
import { base64ToArrayBuffer, decodeAudioData } from "../utils/audioUtils";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

/**
 * Generates speech from text using Gemini 2.5 Flash TTS
 */
export const generateSpeech = async (text: string, voiceName: string = 'Puck'): Promise<AudioBuffer> => {
  try {
    const ai = getClient();
    
    // We use a specific system instruction to ensure the tone is promotional if needed
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        { 
          parts: [{ text: text }] 
        }
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received from Gemini.");
    }

    const arrayBuffer = base64ToArrayBuffer(base64Audio);
    // Gemini 2.5 TTS typically uses 24kHz sample rate
    return await decodeAudioData(arrayBuffer, 24000);

  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};
