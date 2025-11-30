import React, { useState } from 'react';
import { Play, Loader2, Wand2, Volume2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { playAudioBuffer } from '../utils/audioUtils';

interface ScriptEditorProps {
  script: string;
  setScript: (s: string) => void;
  onAudioGenerated: (buffer: AudioBuffer) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ script, setScript, onAudioGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffer, setLocalAudioBuffer] = useState<AudioBuffer | null>(null);

  const handleGeneratePreview = async () => {
    if (!script.trim()) return;
    
    setIsGenerating(true);
    try {
      const buffer = await generateSpeech(script);
      setLocalAudioBuffer(buffer);
      onAudioGenerated(buffer); // Pass up to parent for campaign use
    } catch (e) {
      alert("Failed to generate audio. Check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlay = async () => {
    if (!audioBuffer) return;
    setIsPlaying(true);
    await playAudioBuffer(audioBuffer);
    setIsPlaying(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-brand-600" />
          Campaign Script
        </h2>
        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">Hindi / English Supported</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Promotional Message
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none text-slate-700 text-base"
            placeholder="Namaste! Humari company aapke liye laye hai ek behtareen offer..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGeneratePreview}
            disabled={isGenerating || !script}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
              isGenerating || !script
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
            {isGenerating ? 'Generating Voice...' : 'Generate AI Voice'}
          </button>

          {audioBuffer && (
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium border transition-all ${
                isPlaying
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isPlaying ? <Volume2 className="h-5 w-5 animate-pulse" /> : <Play className="h-5 w-5" />}
              {isPlaying ? 'Playing...' : 'Preview Audio'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};