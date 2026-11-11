import React, { useState } from 'react';
import { Story, StoryGenre } from '../types/story';
import { GENRES } from '../data/genres';
import { 
  Bookmark, 
  Search, 
  Download, 
  Trash2, 
  BookOpen, 
  Clock, 
  Compass, 
  Filter, 
  FileText, 
  ArrowUpDown,
  Plus
} from 'lucide-react';

interface SavedStoriesViewProps {
  stories: Story[];
  onOpenStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  onDownloadTxt: (story: Story) => void;
  onContinueStory: (story: Story) => void;
  onNewStory: () => void;
}

export const SavedStoriesView: React.FC<SavedStoriesViewProps> = ({
  stories,
  onOpenStory,
  onDeleteStory,
  onDownloadTxt,
  onContinueStory,
  onNewStory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'longest' | 'shortest'>('newest');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter and sort
  const filtered = stories.filter((story) => {
    const matchesGenre = selectedGenre === 'all' || story.genre === selectedGenre;
    const matchesSearch = 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (story.characters && story.characters.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesGenre && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'longest') return (b.wordCount || 0) - (a.wordCount || 0);
    if (sortBy === 'shortest') return (a.wordCount || 0) - (b.wordCount || 0);
    return 0;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDeleteId === id) {
      onDeleteStory(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 4000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-purple-400 tracking-wider">
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span>Personal Story Archives</span>
          </div>
          <h1 className="text-3xl font-cinzel font-bold text-white mt-1">
            Saved Stories Library ({stories.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your collection of generated and customized tales stored securely in browser memory.
          </p>
        </div>

        <button
          onClick={onNewStory}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-700 hover:bg-purple-600 text-white self-start sm:self-auto transition-colors shadow-md border border-purple-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Story</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl border border-purple-900/40 bg-[#0f0c29]/70">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, synopsis, character names..."
            className="w-full rounded-xl border border-purple-900/40 bg-[#09071b] pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none"
          />
        </div>

        {/* Genre Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="rounded-xl border border-purple-900/40 bg-[#09071b] px-3 py-2 text-xs text-slate-100 focus:border-purple-400 focus:outline-none"
          >
            <option value="all">All Genres</option>
            {GENRES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-purple-900/40 bg-[#09071b] px-3 py-2 text-xs text-slate-100 focus:border-purple-400 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="longest">Longest First</option>
            <option value="shortest">Shortest First</option>
          </select>
        </div>
      </div>

      {/* Stories Grid */}
      {sorted.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-purple-900/40 bg-[#0c0a22]/50 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-cinzel font-semibold text-white">
            No Stories Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedGenre !== 'all'
              ? 'No tales matched your filter criteria. Try resetting your search.'
              : 'You have not saved any stories yet. Generate your first tale now!'}
          </p>
          <button
            onClick={onNewStory}
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold transition-colors"
          >
            Craft a Story Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((story) => (
            <div
              key={story.id}
              onClick={() => onOpenStory(story)}
              className="group cursor-pointer rounded-2xl border border-purple-900/40 bg-[#100d2b]/80 hover:border-purple-500/50 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-purple-950/50 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-purple-300 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/40">
                    {story.genre}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {story.readingTime}
                    </span>
                    <span className="font-mono tabular-nums">{story.wordCount} words</span>
                  </div>
                </div>

                <h3 className="text-xl font-cinzel font-bold text-white group-hover:text-purple-200 transition-colors">
                  {story.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-light">
                  {story.synopsis}
                </p>

                {story.characters && story.characters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {story.characters.slice(0, 3).map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#161238] text-purple-300 border border-purple-900/40">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-purple-900/30 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  {new Date(story.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadTxt(story);
                    }}
                    title="Download as TXT"
                    className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4 text-purple-300" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onContinueStory(story);
                    }}
                    title="Continue this story"
                    className="p-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 hover:text-white transition-colors"
                  >
                    <Compass className="w-4 h-4 text-cyan-300" />
                  </button>

                  <button
                    onClick={(e) => handleDelete(story.id, e)}
                    title={confirmDeleteId === story.id ? 'Click again to confirm delete' : 'Delete story'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      confirmDeleteId === story.id
                        ? 'bg-rose-950 text-rose-300 border border-rose-600'
                        : 'bg-purple-950/60 hover:bg-rose-950/70 text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
