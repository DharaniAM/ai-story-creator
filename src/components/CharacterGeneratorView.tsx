import React, { useState } from 'react';
import { GENRES } from '../data/genres';
import { CharacterProfile, StoryGenre } from '../types/story';
import { 
  Users, 
  Wand2, 
  Sparkles, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Heart, 
  Quote, 
  Check, 
  ArrowRight,
  Shield,
  Lightbulb
} from 'lucide-react';

interface CharacterGeneratorViewProps {
  roster: CharacterProfile[];
  onSaveCharacter: (char: CharacterProfile) => void;
  onDeleteCharacter: (id: string) => void;
  onUseInStory: (charName: string) => void;
}

export const CharacterGeneratorView: React.FC<CharacterGeneratorViewProps> = ({
  roster,
  onSaveCharacter,
  onDeleteCharacter,
  onUseInStory,
}) => {
  const [genre, setGenre] = useState<StoryGenre>('Fantasy');
  const [archetype, setArchetype] = useState('');
  const [rolePrompt, setRolePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChar, setGeneratedChar] = useState<CharacterProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/character/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre,
          archetype: archetype.trim() || undefined,
          rolePrompt: rolePrompt.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate character');
      }

      const newChar: CharacterProfile = {
        id: `char-${Date.now()}`,
        name: data.character.name,
        role: data.character.role,
        archetype: data.character.archetype,
        traits: data.character.traits || [],
        backstory: data.character.backstory,
        quirk: data.character.quirk,
        motivation: data.character.motivation,
        sampleQuote: data.character.sampleQuote,
        avatarVisual: data.character.avatarVisual,
      };

      setGeneratedChar(newChar);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Could not forge character at this time.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToRoster = () => {
    if (!generatedChar) return;
    onSaveCharacter(generatedChar);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/40 text-xs font-medium text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Persona & Archetype Weaver</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
          AI Character Forge
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto font-light">
          Generate multifaceted protagonists, antiheroes, mentors, and sidekicks with organic quirks, deep motives, and ready-to-cast voice quotes.
        </p>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="rounded-2xl border border-purple-900/40 bg-[#0f0c29]/70 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Genre selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200">
              Target Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as StoryGenre)}
              className="w-full rounded-lg border border-purple-900/40 bg-[#09071b] px-3.5 py-2.5 text-xs text-slate-100 focus:border-purple-400 focus:outline-none"
            >
              {GENRES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Archetype or Role Preset */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200">
              Archetype / Trope (Optional)
            </label>
            <input
              type="text"
              value={archetype}
              onChange={(e) => setArchetype(e.target.value)}
              placeholder="e.g. Reluctant Chosen One, Rogue Scholar, Cynical Detective"
              className="w-full rounded-lg border border-purple-900/40 bg-[#09071b] px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Custom role prompt */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-200">
            Specific Concept or Seed (Optional)
          </label>
          <input
            type="text"
            value={rolePrompt}
            onChange={(e) => setRolePrompt(e.target.value)}
            placeholder="e.g. An astronomer who secretly hears constellations singing, or a time-traveling tailor"
            className="w-full rounded-lg border border-purple-900/40 bg-[#09071b] px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 rounded-xl text-sm font-cinzel font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-purple-950/50 transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center gap-2 border border-purple-300/30"
          >
            <Wand2 className="w-4 h-4 text-amber-200" />
            <span>{isGenerating ? 'Weaving Character...' : 'Forge Character'}</span>
          </button>
        </div>
      </form>

      {/* Newly Generated Character Card Spotlight */}
      {generatedChar && (
        <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#151138] via-[#0e0b28] to-[#080718] p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-purple-900/40 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{generatedChar.role}</span>
                {generatedChar.archetype && (
                  <>
                    <span className="text-slate-500">·</span>
                    <span className="text-purple-300">{generatedChar.archetype}</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white">
                {generatedChar.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToRoster}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-600/50 transition-colors"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Saved to Roster!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Save to Roster</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onUseInStory(generatedChar.name)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-purple-900/40 hover:from-violet-500 hover:to-purple-500 transition-all border border-purple-400/30"
              >
                <span>Cast in Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Traits Badges */}
          {generatedChar.traits && generatedChar.traits.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Core Traits:</span>
              {generatedChar.traits.map((trait, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-700/40 text-purple-200"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          {/* Backstory */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase text-purple-400 tracking-wider">
              Background & Origins
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-light">
              {generatedChar.backstory}
            </p>
          </div>

          {/* Quirk & Motivation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-900/40">
            {generatedChar.quirk && (
              <div className="p-3.5 rounded-xl bg-[#0b0920] border border-purple-900/30 space-y-1">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Distinctive Quirk
                </span>
                <p className="text-xs text-slate-300">{generatedChar.quirk}</p>
              </div>
            )}

            {generatedChar.motivation && (
              <div className="p-3.5 rounded-xl bg-[#0b0920] border border-purple-900/30 space-y-1">
                <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Primary Motivation
                </span>
                <p className="text-xs text-slate-300">{generatedChar.motivation}</p>
              </div>
            )}
          </div>

          {/* Sample Quote */}
          {generatedChar.sampleQuote && (
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-3">
              <Quote className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">
                  Dialogue Voice
                </p>
                <p className="text-sm text-purple-200 italic font-story">
                  "{generatedChar.sampleQuote}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved Character Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-cinzel font-bold text-white">
              Character Roster ({roster.length})
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Saved characters can be injected with one click into stories.
          </p>
        </div>

        {roster.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-purple-900/40 bg-[#0d0a22]/50">
            <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium">Your Roster is currently empty</p>
            <p className="text-xs text-slate-500 mt-1">
              Use the forge above to generate and save your first fictional hero or villain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roster.map((char) => (
              <div
                key={char.id}
                className="p-5 rounded-2xl border border-purple-900/30 bg-[#0e0c26] space-y-3 flex flex-col justify-between hover:border-purple-600/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-amber-300 font-semibold">{char.role}</p>
                      <h4 className="text-lg font-cinzel font-bold text-white">{char.name}</h4>
                    </div>
                    <button
                      onClick={() => onDeleteCharacter(char.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Remove from roster"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                    {char.backstory}
                  </p>

                  {char.traits && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {char.traits.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-800/40 text-purple-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between">
                  {char.sampleQuote && (
                    <span className="text-[11px] text-slate-400 italic truncate max-w-[200px]">
                      "{char.sampleQuote}"
                    </span>
                  )}
                  <button
                    onClick={() => onUseInStory(char.name)}
                    className="ml-auto text-xs text-purple-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Use in Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
