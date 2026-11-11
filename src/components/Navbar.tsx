import React from 'react';
import { Sparkles, BookOpen, UserPlus, Compass, Bookmark, Plus } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'generator' | 'continue' | 'characters' | 'library' | 'reader';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  onNewStory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onNewStory,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-900/30 bg-[#080718]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left text-white whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-amber-400 p-[1px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#0d0b21] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="text-lg font-cinzel font-bold tracking-wider bg-gradient-to-r from-purple-200 via-violet-100 to-amber-200 bg-clip-text text-transparent">
              AI Story Creator
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'dashboard'
                ? 'text-purple-300 font-semibold border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-purple-200'
            }`}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('generator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'generator'
                ? 'text-purple-300 font-semibold border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-purple-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Story Generator
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'characters'
                ? 'text-purple-300 font-semibold border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-purple-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Character Forge
          </button>

          <button
            onClick={() => setActiveTab('continue')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'continue'
                ? 'text-purple-300 font-semibold border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-purple-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Continue Story
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'text-purple-300 font-semibold border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-purple-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved Library
            {savedCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 bg-purple-950/80 text-purple-300 border border-purple-700/40 rounded font-mono">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewStory}
            className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-lg shadow-md shadow-purple-900/40 hover:shadow-purple-700/50 transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0 border border-purple-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Story</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar below header for small screens */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-purple-900/20 bg-[#0d0b21]/90 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'dashboard' ? 'text-purple-300 font-medium bg-purple-950/60' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'generator' ? 'text-purple-300 font-medium bg-purple-950/60' : 'text-slate-400'
          }`}
        >
          Generator
        </button>
        <button
          onClick={() => setActiveTab('characters')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'characters' ? 'text-purple-300 font-medium bg-purple-950/60' : 'text-slate-400'
          }`}
        >
          Characters
        </button>
        <button
          onClick={() => setActiveTab('continue')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'continue' ? 'text-purple-300 font-medium bg-purple-950/60' : 'text-slate-400'
          }`}
        >
          Continue
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'library' ? 'text-purple-300 font-medium bg-purple-950/60' : 'text-slate-400'
          }`}
        >
          Saved ({savedCount})
        </button>
      </div>
    </header>
  );
};
