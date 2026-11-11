import React, { useState } from 'react';
import { Story, StoryGenre, StoryLength } from '../types/story';
import { GENRES, WRITING_STYLES } from '../data/genres';
import { 
  Compass, 
  Sparkles, 
  Dices, 
  BookOpen, 
  ArrowRight, 
  Download, 
  Bookmark, 
  Check, 
  Copy,
  AlertCircle 
} from 'lucide-react';

interface ContinueStoryViewProps {
  initialStoryText?: string;
  initialGenre?: StoryGenre;
  savedStories: Story[];
  onSaveContinuedStory: (story: Story) => void;
  onDownloadTxt: (story: Story) => void;
}

const TWIST_IDEAS = [
  'A trusted ally is revealed to have a secret hidden agenda tied to the inciting incident.',
  'An ancient artifact suddenly activates and reveals a countdown that cannot be stopped.',
  'The protagonist discovers they were chasing the wrong person or false clue all along.',
  'A sudden supernatural or cosmic eclipse changes the physical laws of the surrounding realm.',
  'An old enemy offers a truce because a far greater existential threat has awakened.',
];

export const ContinueStoryView: React.FC<ContinueStoryViewProps> = ({
  initialStoryText = '',
  initialGenre = 'Fantasy',
  savedStories,
  onSaveContinuedStory,
  onDownloadTxt,
}) => {
  const [existingStory, setExistingStory] = useState(initialStoryText);
  const [genre, setGenre] = useState<StoryGenre>(initialGenre);
  const [continuationNotes, setContinuationNotes] = useState('');
  const [length, setLength] = useState<StoryLength>('medium');
  const [writingStyle, setWritingStyle] = useState('Cinematic & Atmospheric');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [continuationResult, setContinuationResult] = useState<{
    continuationTitle: string;
    continuedText: string;
    plotTwistNote: string;
    wordCount: number;
    combinedStory: Story;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handlePickSavedStory = (id: string) => {
    const found = savedStories.find((s) => s.id === id);
    if (found) {
      setExistingStory(found.fullText);
      setGenre(found.genre);
      if (found.writingStyle) setWritingStyle(found.writingStyle);
    }
  };

  const handleRandomTwist = () => {
    const randomTwist = TWIST_IDEAS[Math.floor(Math.random() * TWIST_IDEAS.length)];
    setContinuationNotes(randomTwist);
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingStory.trim()) {
      setError('Please paste your existing story text or select one from your library.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setContinuationResult(null);
    setIsSaved(false);

    try {
      const res = await fetch('/api/story/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          existingStory: existingStory.trim(),
          genre,
          continuationNotes: continuationNotes.trim() || undefined,
          length,
          writingStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to continue story');
      }

      const continuation = data.continuation;
      const combinedFullText = `${existingStory.trim()}\n\n---\n\n### ${continuation.continuationTitle}\n\n${continuation.continuedText}`;
      const totalWords = (existingStory.split(/\s+/).length || 0) + (continuation.wordCount || 0);

      const combinedStory: Story = {
        id: `continued-${Date.now()}`,
        title: `Continuation: ${continuation.continuationTitle}`,
        synopsis: continuation.plotTwistNote || 'Continued saga maintaining character and narrative depth.',
        genre,
        length,
        language: 'English',
        writingStyle,
        characters: continuation.newCharactersIntroduced || [],
        sections: [
          {
            act: 'Part I (Original)',
            heading: 'Original Manuscript',
            content: existingStory.trim(),
          },
          {
            act: 'Part II (Continuation)',
            heading: continuation.continuationTitle,
            content: continuation.continuedText,
          },
        ],
        fullText: combinedFullText,
        wordCount: totalWords,
        readingTime: `${Math.ceil(totalWords / 200)} min read`,
        createdAt: new Date().toISOString(),
        isSaved: false,
      };

      setContinuationResult({
        continuationTitle: continuation.continuationTitle,
        continuedText: continuation.continuedText,
        plotTwistNote: continuation.plotTwistNote,
        wordCount: continuation.wordCount,
        combinedStory,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Could not continue the story at this time.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!continuationResult) return;
    onSaveContinuedStory(continuationResult.combinedStory);
    setIsSaved(true);
  };

  const handleCopyCombined = async () => {
    if (!continuationResult) return;
    try {
      await navigator.clipboard.writeText(continuationResult.combinedStory.fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/40 text-xs font-medium text-cyan-300">
          <Compass className="w-3.5 h-3.5 text-cyan-300" />
          <span>Infinite Narrative Continuity</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
          Continue My Story
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto font-light">
          Have an existing chapter or unfinished manuscript? Paste it here, pick a twist or direction, and let Gemini weave a seamless next installment.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleContinue} className="space-y-6">
        {/* Story import or manual paste */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#0f0c29]/70 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor="existing-story-input" className="block text-sm font-semibold text-slate-200">
              1. Paste Existing Story or Chapter <span className="text-purple-400">*</span>
            </label>

            {savedStories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Load from library:</span>
                <select
                  onChange={(e) => handlePickSavedStory(e.target.value)}
                  defaultValue=""
                  className="rounded-lg border border-purple-900/40 bg-[#09071b] px-2.5 py-1 text-xs text-slate-200 focus:border-purple-400 focus:outline-none"
                >
                  <option value="" disabled>
                    Select a saved tale...
                  </option>
                  {savedStories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <textarea
            id="existing-story-input"
            rows={8}
            value={existingStory}
            onChange={(e) => {
              setExistingStory(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste your story here... The AI will analyze the tone, setting, and characters to write the next chapter or act."
            className="w-full rounded-xl border border-purple-900/40 bg-[#0a081d] px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all font-story resize-y leading-relaxed"
          />
        </div>

        {/* Continuation Direction & Twists */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#0f0c29]/70 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <label htmlFor="twist-notes-input" className="block text-sm font-semibold text-slate-200">
              2. Continuation Direction / Desired Twist (Optional)
            </label>
            <button
              type="button"
              onClick={handleRandomTwist}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Surprise Me With a Twist</span>
            </button>
          </div>

          <input
            id="twist-notes-input"
            type="text"
            value={continuationNotes}
            onChange={(e) => setContinuationNotes(e.target.value)}
            placeholder="e.g. Introduce a mysterious stranger who knows the protagonist's real name, or a sudden magical anomaly"
            className="w-full rounded-lg border border-purple-900/40 bg-[#0a081d] px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Genre override */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as StoryGenre)}
                className="w-full rounded-lg border border-purple-900/40 bg-[#0a081d] px-3 py-2 text-xs text-slate-100"
              >
                {GENRES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Continuation Length */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Continuation Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as StoryLength)}
                className="w-full rounded-lg border border-purple-900/40 bg-[#0a081d] px-3 py-2 text-xs text-slate-100"
              >
                <option value="short">Short (~300 words)</option>
                <option value="medium">Medium (~600 words)</option>
                <option value="long">Long (~1000 words)</option>
              </select>
            </div>

            {/* Writing Style */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Writing Style</label>
              <select
                value={writingStyle}
                onChange={(e) => setWritingStyle(e.target.value)}
                className="w-full rounded-lg border border-purple-900/40 bg-[#0a081d] px-3 py-2 text-xs text-slate-100"
              >
                {WRITING_STYLES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto min-w-[260px] px-8 py-3.5 rounded-xl text-sm font-cinzel font-bold text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-xl shadow-cyan-950/60 transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto border border-cyan-400/30"
          >
            <Compass className="w-4 h-4 text-cyan-200" />
            <span>{isGenerating ? 'Weaving Continuation...' : 'Generate Story Continuation'}</span>
          </button>
        </div>
      </form>

      {/* Generated Continuation Result */}
      {continuationResult && (
        <div className="space-y-6 pt-4">
          <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-[#0e1633] via-[#0b0e26] to-[#070614] p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cyan-900/40 pb-4">
              <div>
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Next Chapter Unfolded
                </span>
                <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
                  {continuationResult.continuationTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono tabular-nums">
                  +{continuationResult.wordCount} words added · Continuity Preserved
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    isSaved
                      ? 'bg-cyan-900/60 border-cyan-500 text-cyan-200'
                      : 'bg-[#0a1024] border-cyan-900/40 text-slate-300 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                  <span>{isSaved ? 'Saved in Library' : 'Save Full Tale'}</span>
                </button>

                <button
                  onClick={() => onDownloadTxt(continuationResult.combinedStory)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#0a1024] border border-cyan-900/40 text-slate-300 hover:text-white"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download TXT</span>
                </button>

                <button
                  onClick={handleCopyCombined}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#0a1024] border border-cyan-900/40 text-slate-300 hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy Full Saga</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Plot twist banner */}
            {continuationResult.plotTwistNote && (
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-cyan-300">Narrative Shift: </span>
                  <span>{continuationResult.plotTwistNote}</span>
                </div>
              </div>
            )}

            {/* Continuation Text */}
            <div className="space-y-4 font-story text-base sm:text-lg text-slate-100 leading-relaxed bg-[#07091a]/60 p-6 rounded-2xl border border-cyan-900/30">
              {continuationResult.continuedText.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
