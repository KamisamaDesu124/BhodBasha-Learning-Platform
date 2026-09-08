'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Languages, 
  Gauge, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  BookOpen,
  Headphones,
  RotateCcw
} from 'lucide-react';

export interface AIManualVoiceReaderProps {
  title: string;
  docRef?: string;
  summary?: string;
  paragraphs: string[];
  formulaTitle?: string;
  formulaCode?: string;
  formulaDescription?: string;
  onActiveParagraphChange?: (index: number | null) => void;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English (Official Manual)' },
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'mr', label: 'Marathi (मराठी)' }
];

export default function AIManualVoiceReader({
  title,
  docRef = 'MoSPI In-Service Standard Document',
  summary,
  paragraphs,
  formulaTitle,
  formulaCode,
  formulaDescription,
  onActiveParagraphChange,
  className = ''
}: AIManualVoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1: summary, 0..N-1: paragraphs, N: formula
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'te' | 'ta' | 'mr'>('en');
  const [speed, setSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const isReadingRef = useRef(false);
  const currentStepRef = useRef(-1);

  // Keep ref synchronized
  useEffect(() => {
    isReadingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentStepRef.current = currentStep;
    if (onActiveParagraphChange) {
      onActiveParagraphChange(currentStep >= 0 && currentStep < paragraphs.length ? currentStep : null);
    }
  }, [currentStep, onActiveParagraphChange, paragraphs.length]);

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setVoices(v);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Immediate mute handling
  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  };

  // Build narration queue
  const getNarrationItems = useCallback(() => {
    const items: { type: 'summary' | 'para' | 'formula'; text: string; stepIndex: number; label: string }[] = [];
    if (summary) {
      items.push({
        type: 'summary',
        text: `Executive Summary: ${summary}`,
        stepIndex: -1,
        label: 'Executive Summary'
      });
    }
    paragraphs.forEach((p, idx) => {
      items.push({
        type: 'para',
        text: `Paragraph ${idx + 1}: ${p}`,
        stepIndex: idx,
        label: `Paragraph ${idx + 1}`
      });
    });
    if (formulaCode) {
      items.push({
        type: 'formula',
        text: `Statutory Equation: ${formulaTitle || ''}. ${formulaCode}. ${formulaDescription || ''}`,
        stepIndex: paragraphs.length,
        label: 'Statutory Formula'
      });
    }
    return items;
  }, [summary, paragraphs, formulaCode, formulaTitle, formulaDescription]);

  // Speak single text chunk
  const speakText = useCallback((text: string, onEnd: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isMuted || volume === 0) {
      onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        mr: 'mr-IN'
      };

      utterance.lang = langMap[selectedLang] || 'en-IN';
      utterance.rate = speed;
      utterance.pitch = 1.0;
      utterance.volume = isMuted ? 0 : volume;

      // Find appropriate voice
      const targetPrefix = utterance.lang.split('-')[0];
      const match = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix))
        || voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('heera'))
        || voices.find(v => v.lang.toLowerCase().startsWith('en'))
        || voices[0];

      if (match) {
        utterance.voice = match;
      }

      utterance.onend = () => {
        if (isReadingRef.current) {
          onEnd();
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech error in AI Manual Voice Reader:', e);
        if (isReadingRef.current) {
          onEnd();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis invocation failure:', e);
      onEnd();
    }
  }, [selectedLang, speed, isMuted, volume, voices]);

  // Sequential queue reader
  const playFromIndex = useCallback((startIndex: number) => {
    const queue = getNarrationItems();
    if (startIndex >= queue.length) {
      setIsPlaying(false);
      setCurrentStep(-1);
      return;
    }

    const currentItem = queue[startIndex];
    setCurrentStep(currentItem.stepIndex);

    speakText(currentItem.text, () => {
      if (isReadingRef.current) {
        // Advance to next item with a brief pause
        setTimeout(() => {
          if (isReadingRef.current) {
            playFromIndex(startIndex + 1);
          }
        }, 400);
      }
    });
  }, [getNarrationItems, speakText]);

  // Controls
  const handleStartPlay = () => {
    setIsPlaying(true);
    const queue = getNarrationItems();
    // If currently at the end or unstarted, begin from start
    let targetQueueIdx = 0;
    if (currentStepRef.current >= 0) {
      const foundIdx = queue.findIndex(q => q.stepIndex === currentStepRef.current);
      if (foundIdx >= 0) targetQueueIdx = foundIdx;
    }
    playFromIndex(targetQueueIdx);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Jump directly to a specific paragraph
  const handlePlayParagraph = (paraIndex: number) => {
    setIsPlaying(true);
    const queue = getNarrationItems();
    const foundIdx = queue.findIndex(q => q.type === 'para' && q.stepIndex === paraIndex);
    if (foundIdx >= 0) {
      playFromIndex(foundIdx);
    }
  };

  // Stop narration on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-stone-900 text-white shadow-xl border border-slate-700/80 space-y-4 ${className}`}>
      {/* Top Deck: Branding & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-900/30">
            <Headphones size={20} className={isPlaying ? 'animate-bounce' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                MoSPI AI Manual Voice Narrator
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Online Active
              </span>
            </div>
            <h4 className="text-base font-serif font-bold text-white leading-tight">
              {title}
            </h4>
            <p className="text-[11px] font-mono text-slate-400">
              {docRef}
            </p>
          </div>
        </div>

        {/* Dynamic Waveform Visualizer & Speaking Status */}
        <div className="flex items-center gap-3 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 shrink-0">
          <div className="flex items-center gap-1 h-5">
            {[0.4, 0.9, 0.6, 1, 0.7, 0.5, 0.8].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-amber-400 rounded-full transition-all duration-150"
                style={{
                  height: isPlaying ? `${Math.max(4, h * 20)}px` : '4px',
                  opacity: isPlaying ? 1 : 0.4
                }}
              />
            ))}
          </div>
          <div className="text-right">
            <p className="text-xs font-mono font-bold text-amber-300">
              {isPlaying 
                ? currentStep === -1 
                  ? 'Reading Summary...'
                  : currentStep >= paragraphs.length 
                    ? 'Reading Formula...' 
                    : `Paragraph ${currentStep + 1} of ${paragraphs.length}`
                : 'Narration Idle'}
            </p>
            <p className="text-[10px] font-mono text-slate-400">
              {isPlaying ? 'Audible TTS Active' : 'Click Play to Start'}
            </p>
          </div>
        </div>
      </div>

      {/* Control Console */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Play/Pause/Stop Buttons */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={handleStartPlay}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#9F3E07] hover:bg-[#833204] text-white font-bold text-xs shadow-md transition-all active:scale-95"
              title="Start AI Narration"
            >
              <Play size={15} fill="currentColor" />
              <span>{currentStep >= 0 ? 'Resume Reading' : 'Read Out Chapter'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              title="Pause Narration"
            >
              <Pause size={15} fill="currentColor" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isPlaying && currentStep === -1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs font-medium transition-all"
            title="Stop & Reset to Start"
          >
            <Square size={13} fill="currentColor" />
            <span>Reset</span>
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <Languages size={15} className="text-amber-400 shrink-0" />
          <span className="font-mono text-[11px] text-slate-300 font-semibold hidden sm:inline">Voice:</span>
          <select
            value={selectedLang}
            onChange={(e) => {
              const newLang = e.target.value as any;
              setSelectedLang(newLang);
              if (isPlaying) {
                // Restart current item with new voice
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setTimeout(handleStartPlay, 100);
              }
            }}
            className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer pr-1"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <Gauge size={14} className="text-amber-400 shrink-0" />
          {[0.8, 1.0, 1.25, 1.5].map((s) => (
            <button
              key={s}
              onClick={() => {
                setSpeed(s);
                if (isPlaying) {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setTimeout(handleStartPlay, 100);
                }
              }}
              className={`px-2 py-0.5 rounded-md font-mono text-[11px] transition-all ${
                speed === s 
                  ? 'bg-amber-500 text-slate-950 font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={toggleMute}
            className="hover:text-amber-300 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} className="text-red-400" /> : <Volume2 size={15} className="text-emerald-400" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setVolume(val);
              if (val === 0) {
                setIsMuted(true);
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              } else if (isMuted) {
                setIsMuted(false);
              }
            }}
            className="w-16 h-1 bg-white/20 rounded-full cursor-pointer accent-amber-400"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
          <span className="font-mono text-[10px] text-slate-300 min-w-[26px]">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>

      {/* Quick Jump Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs font-mono">
        <span className="text-slate-400 text-[11px]">Jump to Paragraph:</span>
        {paragraphs.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePlayParagraph(idx)}
            className={`px-2.5 py-1 rounded-lg border transition-all text-xs font-bold ${
              currentStep === idx
                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                : 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-200'
            }`}
          >
            § {idx + 1}
          </button>
        ))}
        {formulaCode && (
          <button
            onClick={() => {
              const queue = getNarrationItems();
              const fIdx = queue.findIndex(q => q.type === 'formula');
              if (fIdx >= 0) playFromIndex(fIdx);
            }}
            className={`px-2.5 py-1 rounded-lg border transition-all text-xs font-bold ${
              currentStep === paragraphs.length
                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                : 'bg-white/5 border-white/10 hover:bg-white/15 text-slate-200'
            }`}
          >
            Formula
          </button>
        )}
      </div>
    </div>
  );
}
