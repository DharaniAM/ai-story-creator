import React, { useEffect, useState } from 'react';
import { Sparkles, Wand2, BookOpen, Feather } from 'lucide-react';

interface LoadingStoryModalProps {
  topic?: string;
  genre?: string;
}

const GENERATION_PHASES = [
  'Whispering to the cosmic muse...',
  'Architecting the three-act dramatic narrative...',
  'Breathing life and distinct voices into characters...',
  'Escalating tension and unforeseen plot twists...',
  'Polishing dialogue and sensory worldbuilding...',
  'Painting the atmospheric story illustration concept...',
  'Binding the parchment and preparing your tale...',
];

export const LoadingStoryModal: React.FC<LoadingStoryModalProps> = ({ topic, genre }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % GENERATION_PHASES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05040f]/85 backdrop-blur-md">
      <div className="max-w-md w-full rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#17123b] to-[#0a081f] p-8 text-center space-y-6 shadow-2xl shadow-purple-950/80 relative overflow-hidden">
        
        {/* Ambient background glow orb */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Central Magical Icon Animation */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-500 to-amber-400 p-[1px] shadow-xl shadow-purple-900/50">
          <div className="w-full h-full bg-[#0c0924] rounded-[23px] flex items-center justify-center relative overflow-hidden">
            <Wand2 className="w-8 h-8 text-purple-300 animate-bounce" />
            <Sparkles className="w-4 h-4 text-amber-300 absolute top-2 right-2 animate-spin" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2 relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 font-mono">
            Gemini 3.8 Flash Engine
          </span>
          <h3 className="text-xl font-cinzel font-bold text-white">
            Weaving Your {genre || 'Story'}
          </h3>
          {topic && (
            <p className="text-xs text-slate-400 line-clamp-1 italic px-4">
              "{topic}"
            </p>
          )}
        </div>

        {/* Animated Phase Tracker */}
        <div className="space-y-3 relative z-10">
          <div className="h-1.5 w-full bg-[#1b1740] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-amber-300 rounded-full animate-pulse w-3/4" />
          </div>

          <p className="text-xs text-purple-200 font-medium transition-all duration-300 min-h-[20px]">
            {GENERATION_PHASES[phaseIndex]}
          </p>
        </div>

        <p className="text-[11px] text-slate-500 font-light">
          Crafting unique beginning, middle, ending, and illustration art concept...
        </p>
      </div>
    </div>
  );
};
