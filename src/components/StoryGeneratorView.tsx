import React, { useState } from 'react';
import { GENRES, WRITING_STYLES, STORY_LANGUAGES, STORY_PERSPECTIVES } from '../data/genres';
import { StoryGenre, StoryLength, CharacterProfile } from '../types/story';
import { 
  Sparkles, 
  Wand2, 
  Dices, 
  Users, 
  Languages, 
  Feather, 
  Eye, 
  Plus, 
  X, 
  AlertCircle 
} from 'lucide-react';

interface StoryGeneratorViewProps {
  initialGenre?: StoryGenre;
  initialTopic?: string;
  characterRoster: CharacterProfile[];
  onGenerate: (params: {
    topic: string;
    genre: StoryGenre;
    length: StoryLength;
    characters: string[];
    language: string;
    writingStyle: string;
    perspective: string;
  }) => void;
  isLoading: boolean;
  onOpenCharacterForge: () => void;
}

const INSPIRATION_PROMPTS: Record<StoryGenre, string[]> = {
  Fantasy: [
    'A novice alchemist discovers that every spell cast extracts an emotion from the caster.',
    'A forgotten gargoyle atop a sky-citadel awakens when an exiled prince plays an obsidian lute.',
    'A subterranean library where books are written by living constellations that swim like luminescent fish.'
  ],
  'Science Fiction': [
    'A deep-space radio astronomer receives an SOS beacon from a star system that collapsed three centuries ago.',
    'An aging cyborg repair technician discovers an encrypted childhood lullaby in a decommissioned battle droid.',
    'The first generation ship arrives at a paradisiacal exoplanet, only to find human settlements already thriving.'
  ],
  Mystery: [
    'An antiquarian clock restorer finds a coded will hidden inside a pendulum clock that only chimes backwards.',
    'A private investigator on an overnight sleeper train realizes the passenger in compartment 4 never boarded.',
    'Seven estranged heirs gather at an island mansion where each grandfather clock reveals a family transgression.'
  ],
  Horror: [
    'A remote meteorological team in the Arctic drills an ice core that whispers their childhood regrets.',
    'An antique camera that develops photos showing what will happen thirty seconds in the future.',
    'A sound engineer remastering vintage vinyl discovers a subterranean frequency that summons uninvited listeners.'
  ],
  Adventure: [
    'Two rival underwater salvage divers discover a sunken galleon that wasn’t built by any known civilization.',
    'A group of botanical explorers attempt to cross the Shifting Canopy of a jungle that rewrites its geography overnight.',
    'A mountaineer guides a stubborn archeologist to the peak of Mount Morzan to find the sun-stone before the winter soltice.'
  ],
  Comedy: [
    'A bureaucratic demon gets transferred to the Department of Minor Inconveniences and accidentally brings world peace.',
    'A pastry chef discovers that her accidental sourdough starter has developed sentience and high culinary standards.',
    'A retired master thief volunteers at an elementary school bake sale and treats the PTA like a high-security heist.'
  ],
  'Romance-free friendship': [
    'Three elderly inventors in a coastal village pool their savings to build a solar glider for their disabled friend.',
    'Two rival competitive chess prodigies bond over a shared struggle with overbearing trainers and start a secret street league.',
    'An exiled wanderer and a stubborn stray mastiff trek through a blizzard to deliver vital medicine to a mountain outpost.'
  ],
  Inspirational: [
    'A former concert cellist who lost her hearing crafts tactile acoustic instruments for deaf children.',
    'An injured mountaineer mentors a determined teenager to ascend the peak that ended her own professional career.',
    'A community garden founded by a war refugee brings healing and unity to a fractured urban neighborhood.'
  ],
};

export const StoryGeneratorView: React.FC<StoryGeneratorViewProps> = ({
  initialGenre = 'Fantasy',
  initialTopic = '',
  characterRoster,
  onGenerate,
  isLoading,
  onOpenCharacterForge,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [genre, setGenre] = useState<StoryGenre>(initialGenre);
  const [length, setLength] = useState<StoryLength>('medium');
  const [language, setLanguage] = useState('English');
  const [writingStyle, setWritingStyle] = useState('Cinematic & Atmospheric');
  const [perspective, setPerspective] = useState('Third-person Limited');
  const [characterInput, setCharacterInput] = useState('');
  const [characters, setCharacters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAddCharacter = (nameToAdd?: string) => {
    const trimmed = (nameToAdd || characterInput).trim();
    if (!trimmed) return;
    if (!characters.includes(trimmed)) {
      setCharacters([...characters, trimmed]);
    }
    setCharacterInput('');
  };

  const handleRemoveCharacter = (name: string) => {
    setCharacters(characters.filter((c) => c !== name));
  };

  const handleKeyDownCharacter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddCharacter();
    }
  };

  const handleRandomSpark = () => {
    const list = INSPIRATION_PROMPTS[genre] || INSPIRATION_PROMPTS['Fantasy'];
    const randomPrompt = list[Math.floor(Math.random() * list.length)];
    setTopic(randomPrompt);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a story idea, theme, or click "Spark Idea" to generate one.');
      return;
    }
    setError(null);
    onGenerate({
      topic: topic.trim(),
      genre,
      length,
      characters,
      language,
      writingStyle,
      perspective,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Title & Intro */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/40 text-xs font-medium text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Gemini 3.8 Flash Story Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
          AI Story Generator
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto font-light">
          Sculpt your narrative world. Define your premise, cast your characters, select your genre, and let Gemini craft a structured three-act tale.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Genre Selection Grid */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            1. Select Story Genre <span className="text-purple-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {GENRES.map((g) => {
              const isSelected = genre === g.id;
              return (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => {
                    setGenre(g.id);
                  }}
                  className={`relative p-3 rounded-xl text-left border transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-950/80 border-purple-400 shadow-md shadow-purple-900/40 text-white font-medium ring-1 ring-purple-400'
                      : 'bg-[#110e2a]/60 border-purple-900/30 text-slate-300 hover:border-purple-600/40 hover:bg-[#151233]'
                  }`}
                >
                  <p className="text-xs font-semibold">{g.label}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{g.tagline}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Story Premise / Idea Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="topic-input" className="block text-sm font-semibold text-slate-200">
              2. Story Idea or Topic <span className="text-purple-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleRandomSpark}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Spark an Idea for {genre}</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              id="topic-input"
              rows={4}
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (error) setError(null);
              }}
              placeholder={`Enter your story premise, e.g., "A deep-sea archaeologist uncovers a submerged clockwork sanctuary that holds the memories of a drowned civilization..."`}
              className="w-full rounded-xl border border-purple-900/40 bg-[#0d0b24]/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all resize-none shadow-inner"
            />
          </div>

          {/* Quick inspiration chips */}
          <div className="space-y-1.5">
            <p className="text-[11px] text-slate-400 font-medium">Or click an idea prompt:</p>
            <div className="flex flex-wrap gap-2">
              {INSPIRATION_PROMPTS[genre]?.map((promptItem, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    setTopic(promptItem);
                    setError(null);
                  }}
                  className="text-left text-xs px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 hover:text-purple-200 border border-purple-900/30 transition-colors max-w-full truncate"
                >
                  "{promptItem}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Characters Customization */}
        <div className="space-y-3 rounded-2xl border border-purple-900/30 bg-[#0f0c29]/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-slate-200">
                3. Character Names & Cast
              </label>
              <p className="text-xs text-slate-400">
                Add specific protagonist and antagonist names to feature in your story.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenCharacterForge}
              className="flex items-center gap-1 text-xs font-medium text-purple-300 hover:text-purple-100 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Forge Characters</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={characterInput}
              onChange={(e) => setCharacterInput(e.target.value)}
              onKeyDown={handleKeyDownCharacter}
              placeholder="e.g. Captain Vane, Lyra, Zephyr (Press Enter)"
              className="flex-1 rounded-lg border border-purple-900/40 bg-[#0a081d] px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={() => handleAddCharacter()}
              className="px-4 py-2 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-xs font-medium text-purple-200 transition-colors flex items-center gap-1 border border-purple-700/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Active Characters List */}
          {characters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Cast:</span>
              {characters.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-purple-950 border border-purple-600/40 text-purple-200 font-medium"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => handleRemoveCharacter(name)}
                    className="hover:text-rose-400 text-purple-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggest from Character Roster if any exist */}
          {characterRoster.length > 0 && (
            <div className="pt-2 border-t border-purple-900/30 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400">Quick add from Roster:</span>
              {characterRoster.map((char) => (
                <button
                  type="button"
                  key={char.id}
                  onClick={() => handleAddCharacter(char.name)}
                  className="text-[11px] px-2 py-0.5 rounded bg-purple-900/30 hover:bg-purple-800/40 text-purple-300 border border-purple-800/30 transition-colors"
                >
                  + {char.name} ({char.role})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Story Customization Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl border border-purple-900/30 bg-[#0f0c29]/50 p-5">
          {/* Story Length */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200">
              Story Length
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#09071b] rounded-lg border border-purple-900/40">
              <button
                type="button"
                onClick={() => setLength('short')}
                className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                  length === 'short'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Short
              </button>
              <button
                type="button"
                onClick={() => setLength('medium')}
                className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                  length === 'medium'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setLength('long')}
                className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                  length === 'long'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Long
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              {length === 'short' && '~300-450 words · Fast & punchy'}
              {length === 'medium' && '~650-850 words · Complete arc'}
              {length === 'long' && '~1100-1500 words · Deep worldbuilding'}
            </p>
          </div>

          {/* Story Language */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-purple-400" />
              <span>Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-purple-900/40 bg-[#09071b] px-3 py-2 text-xs text-slate-100 focus:border-purple-400 focus:outline-none"
            >
              {STORY_LANGUAGES.map((l) => (
                <option key={l.code} value={l.label}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Writing Style */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1">
              <Feather className="w-3.5 h-3.5 text-purple-400" />
              <span>Writing Style</span>
            </label>
            <select
              value={writingStyle}
              onChange={(e) => setWritingStyle(e.target.value)}
              className="w-full rounded-lg border border-purple-900/40 bg-[#09071b] px-3 py-2 text-xs text-slate-100 focus:border-purple-400 focus:outline-none"
            >
              {WRITING_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Perspective */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>Perspective</span>
            </label>
            <select
              value={perspective}
              onChange={(e) => setPerspective(e.target.value)}
              className="w-full rounded-lg border border-purple-900/40 bg-[#09071b] px-3 py-2 text-xs text-slate-100 focus:border-purple-400 focus:outline-none"
            >
              {STORY_PERSPECTIVES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Missing story prompt</p>
              <p className="text-rose-200/90">{error}</p>
            </div>
          </div>
        )}

        {/* Primary Generate Button */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-xl text-base font-cinzel font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-amber-600 hover:from-violet-500 hover:to-amber-500 shadow-xl shadow-purple-950/60 hover:shadow-purple-700/60 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-300/40 flex items-center justify-center gap-2 mx-auto"
          >
            <Wand2 className="w-5 h-5 text-amber-200 animate-pulse" />
            <span>Generate Complete Original Story</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2">
            Will generate an attractive title, structured beginning, middle, ending, and illustration art concept.
          </p>
        </div>
      </form>
    </div>
  );
};
