import React from 'react';
import { GENRES } from '../data/genres';
import { Story, StoryGenre } from '../types/story';
import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  FileText, 
  Users, 
  Wand2, 
  Compass, 
  Flame,
  Bookmark,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  stories: Story[];
  onSelectGenre: (genre: StoryGenre, exampleTopic?: string) => void;
  onOpenStory: (story: Story) => void;
  onNavigate: (tab: 'generator' | 'continue' | 'characters' | 'library') => void;
  onNewStory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stories,
  onSelectGenre,
  onOpenStory,
  onNavigate,
  onNewStory,
}) => {
  const totalWords = stories.reduce((acc, s) => acc + (s.wordCount || 0), 0);
  const recentStories = stories.slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#120f2e] via-[#0d0a24] to-[#070614] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-purple-950/40">
        {/* Ambient background glow & image */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-35 lg:opacity-60 pointer-events-none mix-blend-screen">
          <img
            src="/src/assets/images/hero_story_spellbook_1794375781706.jpg"
            alt="Magical Glowing Grimoire"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0d0a24] via-[#0d0a24]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-purple-300/90 mb-3">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Powered by Google Gemini AI</span>
            <span aria-hidden="true">·</span>
            <span>Infinite Imagination</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-tight leading-tight mb-4">
            Where Your Ideas Ignite Into{' '}
            <span className="bg-gradient-to-r from-purple-300 via-violet-200 to-amber-200 bg-clip-text text-transparent">
              Timeless Legends
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 font-light">
            Craft full three-act original stories, sculpt vivid character personas, extend existing sagas, and generate mesmerizing story cover concepts with responsive AI narration.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNewStory}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-amber-600 hover:from-violet-500 hover:to-amber-500 shadow-xl shadow-purple-900/50 hover:shadow-purple-700/60 transition-all duration-300 active:scale-95 border border-purple-300/30"
            >
              <Wand2 className="w-4 h-4 text-amber-200" />
              <span>Create New Story</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('characters')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-purple-200 bg-purple-950/50 hover:bg-purple-900/40 border border-purple-700/40 hover:border-purple-500/60 transition-all duration-200"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Character Workshop</span>
            </button>

            <button
              onClick={() => onNavigate('continue')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-900/50 hover:bg-slate-800/60 border border-slate-700/40 hover:border-slate-500/60 transition-all duration-200"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Continue Existing Saga</span>
            </button>
          </div>

          {/* Key Stats Bar */}
          <div className="mt-10 pt-6 border-t border-purple-900/40 grid grid-cols-3 gap-4 text-left">
            <div>
              <p className="text-xs text-slate-400 font-medium">Stories Crafted</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-purple-200 tabular-nums">
                {stories.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Words</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-purple-200 tabular-nums">
                {totalWords.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Available Genres</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-amber-200 tabular-nums">
                8 Sagas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Genre Exploration Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-purple-400 tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore Story Universes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
              Select a Genre to Begin
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Click any genre to jump straight into the story creator with curated tone, atmospheric styles, and spark prompts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GENRES.map((genre) => (
            <div
              key={genre.id}
              onClick={() => onSelectGenre(genre.id, genre.exampleTopic)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-purple-900/30 bg-[#120f2c]/80 p-5 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/50 flex flex-col justify-between"
            >
              {genre.bgImage && (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none">
                  <img
                    src={genre.bgImage}
                    alt={genre.label}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120f2c] via-[#120f2c]/70 to-transparent" />
                </div>
              )}

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/40 ${genre.accentColor}`}>
                    {genre.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-purple-900/30 flex items-center justify-center text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {genre.tagline}
                </p>

                <div className="pt-2 border-t border-purple-900/30">
                  <p className="text-[11px] text-slate-400 italic line-clamp-2 group-hover:text-purple-200 transition-colors">
                    "{genre.exampleTopic}"
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-4 flex items-center gap-1.5 text-xs font-medium text-purple-300 group-hover:text-amber-200 transition-colors">
                <span>Start with this genre</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Created Stories & Saved Library Teaser */}
      {recentStories.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                Recently Crafted Tales
              </h2>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs sm:text-sm font-medium text-purple-300 hover:text-purple-100 flex items-center gap-1 transition-colors"
            >
              <span>View All Saved Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentStories.map((story) => (
              <div
                key={story.id}
                onClick={() => onOpenStory(story)}
                className="group cursor-pointer rounded-2xl border border-purple-900/30 bg-[#110e2a]/70 hover:border-purple-400/40 p-5 flex flex-col justify-between hover:shadow-lg hover:shadow-purple-950/40 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-purple-300 font-semibold">{story.genre}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {story.readingTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-cinzel font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {story.synopsis}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-purple-900/30 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono tabular-nums">{story.wordCount} words</span>
                  <span className="flex items-center gap-1 text-purple-300 group-hover:text-amber-200 font-medium">
                    Read Story
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Feature Pillars: Character Forge, Continuation & Illustrations */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigate('characters')}
          className="cursor-pointer rounded-2xl border border-purple-900/30 bg-gradient-to-br from-[#120f2c] to-[#0c0922] p-6 hover:border-purple-500/40 transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-900/40 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5 text-purple-300" />
          </div>
          <h3 className="text-lg font-cinzel font-bold text-white mb-2 group-hover:text-purple-200">
            AI Character Forge
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Generate charismatic heroes, enigmatic villains, distinct traits, quirks, deep backstories, and signature quotes for your lore.
          </p>
          <span className="text-xs text-purple-300 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Open Character Forge <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('continue')}
          className="cursor-pointer rounded-2xl border border-purple-900/30 bg-gradient-to-br from-[#120f2c] to-[#0c0922] p-6 hover:border-purple-500/40 transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-cyan-300" />
          </div>
          <h3 className="text-lg font-cinzel font-bold text-white mb-2 group-hover:text-cyan-200">
            Continue My Story
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Paste your existing draft, pick a twist or let Gemini spin an unexpected turning point while preserving seamless continuity.
          </p>
          <span className="text-xs text-cyan-300 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Continue a Manuscript <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('library')}
          className="cursor-pointer rounded-2xl border border-purple-900/30 bg-gradient-to-br from-[#120f2c] to-[#0c0922] p-6 hover:border-purple-500/40 transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-950/50 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-105 transition-transform">
            <Bookmark className="w-5 h-5 text-amber-300" />
          </div>
          <h3 className="text-lg font-cinzel font-bold text-white mb-2 group-hover:text-amber-200">
            Saved Story Archives
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Manage your personal library of generated tales, filter by genre, read in distraction-free mode, and export as clean TXT files.
          </p>
          <span className="text-xs text-amber-300 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Explore Archives <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </section>
    </div>
  );
};
