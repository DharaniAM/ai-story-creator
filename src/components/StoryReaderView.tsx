import React, { useState } from 'react';
import { Story } from '../types/story';
import { 
  Bookmark, 
  Download, 
  Copy, 
  Check, 
  Compass, 
  Sparkles, 
  Clock, 
  BookOpen, 
  ChevronLeft, 
  Layers, 
  Palette, 
  Wand2, 
  ZoomIn,
  Type as TypeIcon
} from 'lucide-react';

interface StoryReaderViewProps {
  story: Story;
  onSave: (story: Story) => void;
  isSaved: boolean;
  onDownloadTxt: (story: Story) => void;
  onContinueStory: (story: Story) => void;
  onBackToGenerator: () => void;
}

export const StoryReaderView: React.FC<StoryReaderViewProps> = ({
  story,
  onSave,
  isSaved,
  onDownloadTxt,
  onContinueStory,
  onBackToGenerator,
}) => {
  const [activeActFilter, setActiveActFilter] = useState<'all' | 'Beginning' | 'Middle' | 'Ending'>('all');
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [showImageModal, setShowImageModal] = useState(false);

  const handleCopy = async () => {
    const text = `${story.title}\n\nSynopsis:\n${story.synopsis}\n\n${story.fullText}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSections = activeActFilter === 'all'
    ? story.sections
    : story.sections.filter((s) => s.act.toLowerCase() === activeActFilter.toLowerCase());

  const fontClass = fontFamily === 'serif' ? 'font-story' : 'font-sans';
  const sizeClass = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-relaxed',
    xl: 'text-xl sm:text-2xl leading-relaxed',
  }[fontSize];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Top Action & Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={onBackToGenerator}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-purple-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Story Generator</span>
        </button>

        {/* Action Buttons: Save, Download, Copy, Continue */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSave(story)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isSaved
                ? 'bg-purple-900/60 border-purple-500 text-purple-200 shadow-sm'
                : 'bg-[#120f2e] border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-600/50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
            <span>{isSaved ? 'Saved in Library' : 'Save Story'}</span>
          </button>

          <button
            onClick={() => onDownloadTxt(story)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#120f2e] border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-600/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Download TXT</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#120f2e] border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-600/50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-purple-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => onContinueStory(story)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-950/40 transition-all border border-cyan-400/30"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-200" />
            <span>Continue Story</span>
          </button>
        </div>
      </div>

      {/* Story Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-900/40 bg-gradient-to-br from-[#120e2e] via-[#0d0a24] to-[#070614] p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 space-y-4">
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-purple-300 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/40">
              {story.genre}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {story.readingTime}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{story.wordCount} words</span>
            {story.language && (
              <>
                <span aria-hidden="true">·</span>
                <span>{story.language}</span>
              </>
            )}
            {story.writingStyle && (
              <>
                <span aria-hidden="true">·</span>
                <span className="italic">{story.writingStyle}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-tight leading-tight">
            {story.title}
          </h1>

          {/* Synopsis */}
          <p className="text-slate-300 text-sm sm:text-base italic leading-relaxed border-l-2 border-purple-500/40 pl-4 py-1">
            "{story.synopsis}"
          </p>

          {/* Cast */}
          {story.characters && story.characters.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Cast of Characters:</span>
              {story.characters.map((charName) => (
                <span
                  key={charName}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-[#171338] text-purple-200 border border-purple-800/40"
                >
                  {charName}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reader Controls Toolbar: Act switcher, Font size & Font family */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl border border-purple-900/30 bg-[#0e0c24]/90 sticky top-18 z-30 backdrop-blur-md">
        {/* Act Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#09071c] rounded-xl border border-purple-900/40">
          <button
            onClick={() => setActiveActFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeActFilter === 'all'
                ? 'bg-purple-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Acts
          </button>
          <button
            onClick={() => setActiveActFilter('Beginning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeActFilter === 'Beginning'
                ? 'bg-purple-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Beginning
          </button>
          <button
            onClick={() => setActiveActFilter('Middle')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeActFilter === 'Middle'
                ? 'bg-purple-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Middle
          </button>
          <button
            onClick={() => setActiveActFilter('Ending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeActFilter === 'Ending'
                ? 'bg-purple-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ending
          </button>
        </div>

        {/* Font controls */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {/* Serif / Sans Toggle */}
          <div className="flex items-center gap-1 bg-[#09071c] p-1 rounded-lg border border-purple-900/40">
            <button
              onClick={() => setFontFamily('serif')}
              className={`px-2.5 py-1 rounded text-xs font-serif ${
                fontFamily === 'serif' ? 'bg-purple-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Serif
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`px-2.5 py-1 rounded text-xs font-sans ${
                fontFamily === 'sans' ? 'bg-purple-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sans
            </button>
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1 bg-[#09071c] p-1 rounded-lg border border-purple-900/40">
            {(['sm', 'base', 'lg', 'xl'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`w-6 h-6 rounded flex items-center justify-center font-mono ${
                  fontSize === s ? 'bg-purple-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 'sm' && 'S'}
                {s === 'base' && 'M'}
                {s === 'lg' && 'L'}
                {s === 'xl' && 'XL'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Story Narrative Text Sections */}
      <article className="space-y-8 rounded-3xl border border-purple-900/30 bg-[#0e0c24]/70 p-6 sm:p-12 shadow-xl">
        {filteredSections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-purple-900/40 pb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 font-mono">
                Act {section.act}
              </span>
              <span className="text-slate-500">·</span>
              <h2 className="text-lg sm:text-xl font-cinzel font-bold text-amber-200">
                {section.heading}
              </h2>
            </div>

            <div className={`text-slate-200 space-y-4 ${fontClass} ${sizeClass}`}>
              {section.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {/* Story Illustration Concept Card */}
      {story.illustration && (
        <section className="rounded-3xl border border-purple-900/40 bg-gradient-to-br from-[#130f30] via-[#0f0c26] to-[#070614] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-amber-300" />
              <h3 className="text-xl font-cinzel font-bold text-white">
                AI Story Illustration Concept
              </h3>
            </div>
            <span className="text-xs text-purple-300 font-medium px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/40">
              {story.illustration.artStyle}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual concept & focal element */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <p className="text-xs font-semibold uppercase text-purple-400 mb-1">
                  Scene Concept
                </p>
                <p className="leading-relaxed">{story.illustration.concept}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-purple-400 mb-1">
                  Focal Element
                </p>
                <p className="text-slate-200 font-medium">{story.illustration.focalElement}</p>
              </div>

              {/* Color Palette */}
              {story.illustration.colorPalette && story.illustration.colorPalette.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase text-purple-400 mb-1.5">
                    Atmospheric Color Palette
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {story.illustration.colorPalette.map((color, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs bg-[#09071c] px-2.5 py-1 rounded-md border border-purple-900/40">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-mono text-[11px] text-slate-300">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Prompt for generation */}
              <div>
                <p className="text-xs font-semibold uppercase text-purple-400 mb-1">
                  Art Prompt Blueprint
                </p>
                <p className="text-xs text-slate-400 italic bg-[#0a081e] p-3 rounded-xl border border-purple-900/30">
                  "{story.illustration.visualPrompt}"
                </p>
              </div>
            </div>

            {/* Illustration Visual Representation */}
            <div className="relative rounded-2xl overflow-hidden border border-purple-700/40 bg-[#080718] aspect-[4/3] group shadow-lg">
              {story.illustration.generatedImageUrl ? (
                <>
                  <img
                    src={story.illustration.generatedImageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs flex items-center gap-1.5 backdrop-blur-sm border border-white/20"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Expand Artwork</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-purple-950/60 via-[#130f2e] to-slate-950">
                  <Wand2 className="w-10 h-10 text-purple-400 mb-3 animate-pulse" />
                  <p className="text-sm font-cinzel font-semibold text-white mb-1">
                    Concept Canvas
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Atmospheric digital concept rendered for "{story.title}".
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Floating Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-purple-900/40 bg-[#0e0c24] text-xs">
        <div>
          <p className="font-semibold text-white">Enjoyed this story?</p>
          <p className="text-slate-400">Continue with the next chapter or create another original tale.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onContinueStory(story)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Continue This Story</span>
          </button>
          <button
            onClick={onBackToGenerator}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-medium flex items-center gap-1.5 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            <span>Create Another Story</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showImageModal && story.illustration?.generatedImageUrl && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-purple-500/40">
            <img
              src={story.illustration.generatedImageUrl}
              alt={story.title}
              className="max-h-[85vh] w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="p-4 bg-[#0a081c] text-white flex items-center justify-between">
              <div>
                <p className="font-cinzel font-bold text-sm">{story.title}</p>
                <p className="text-xs text-slate-400">{story.illustration.concept}</p>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1 bg-purple-800 text-white text-xs rounded-lg hover:bg-purple-700"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
