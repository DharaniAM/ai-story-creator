import React, { useState, useEffect } from 'react';
import { 
  Story, 
  StoryGenre, 
  StoryLength, 
  CharacterProfile 
} from './types/story';
import { 
  getSavedStories, 
  saveStory, 
  deleteStory, 
  isStorySaved, 
  downloadStoryTxt, 
  SAMPLE_STORIES 
} from './utils/storage';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StoryGeneratorView } from './components/StoryGeneratorView';
import { StoryReaderView } from './components/StoryReaderView';
import { CharacterGeneratorView } from './components/CharacterGeneratorView';
import { ContinueStoryView } from './components/ContinueStoryView';
import { SavedStoriesView } from './components/SavedStoriesView';
import { LoadingStoryModal } from './components/LoadingStoryModal';
import { ErrorNotification } from './components/ErrorNotification';

const ROSTER_STORAGE_KEY = 'ai_story_creator_character_roster_v1';

const INITIAL_ROSTER: CharacterProfile[] = [
  {
    id: 'char-1',
    name: 'Elia Vance',
    role: 'Apprentice Chronomancer',
    archetype: 'Curious Prodigy',
    traits: ['Hyper-perceptive', 'Stubbornly inquisitive', 'Gentle with machines'],
    backstory: 'Born to a lineage of clocksmiths, Elia was raised by ascetic cathedral gearsmiths. She learned to read the pulse of ticking escapements like spoken poetry.',
    quirk: 'Always carries copper filings in her pocket and taps absentmindedly in 3/4 waltz rhythm.',
    motivation: 'To awaken the celestial automatons and chart forgotten temporal sky-routes.',
    sampleQuote: 'If a clock stops, time does not die—it only waits for someone who listens closely enough.',
    avatarVisual: 'Young woman with tangled chestnut curls, brass goggles perched on forehead, leather apprentice apron.'
  },
  {
    id: 'char-2',
    name: 'Captain Dorian Vane',
    role: 'Aether-Frigate Pilot',
    archetype: 'Haunted Veteran',
    traits: ['Razor-sharp instincts', 'Quietly melancholic', 'Fiercely protective'],
    backstory: 'Once a decorated flagship officer of the Sol-Alliance sky fleet, Dorian surrendered his commission after refusing an unlawful bombardment order. Now he charters uncharted asteroid belts.',
    quirk: 'Addresses his antique mechanical compass as though it were an old sparring partner.',
    motivation: 'To reach the mythical Haven of the First Pioneers before the Void Syndicate captures it.',
    sampleQuote: 'The sky does not care about our treaties. It only respects momentum and respect.',
    avatarVisual: 'Tall pilot with silver-streaked dark hair, wearing a high-collared navy flight coat with bronze astrolabe insignia.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [characterRoster, setCharacterRoster] = useState<CharacterProfile[]>([]);
  
  // Generator pre-fill state
  const [generatorGenre, setGeneratorGenre] = useState<StoryGenre>('Fantasy');
  const [generatorTopic, setGeneratorTopic] = useState<string>('');
  
  // Continue pre-fill state
  const [continueInitialText, setContinueInitialText] = useState<string>('');
  const [continueInitialGenre, setContinueInitialGenre] = useState<StoryGenre>('Fantasy');

  // Async states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingContext, setLoadingContext] = useState<{ topic?: string; genre?: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApiKeyError, setIsApiKeyError] = useState(false);

  // Initialize storage on mount
  useEffect(() => {
    const stories = getSavedStories();
    setSavedStories(stories);

    // Initialize character roster
    try {
      const rosterData = localStorage.getItem(ROSTER_STORAGE_KEY);
      if (rosterData) {
        setCharacterRoster(JSON.parse(rosterData));
      } else {
        localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(INITIAL_ROSTER));
        setCharacterRoster(INITIAL_ROSTER);
      }
    } catch (e) {
      console.error(e);
      setCharacterRoster(INITIAL_ROSTER);
    }
  }, []);

  // Story generation handler
  const handleGenerateStory = async (params: {
    topic: string;
    genre: StoryGenre;
    length: StoryLength;
    characters: string[];
    language: string;
    writingStyle: string;
    perspective: string;
  }) => {
    setIsLoading(true);
    setLoadingContext({ topic: params.topic, genre: params.genre });
    setErrorMessage(null);
    setIsApiKeyError(false);

    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        const errorText = data.error || 'Failed to generate story.';
        setIsApiKeyError(Boolean(data.isApiKeyError));
        throw new Error(errorText);
      }

      const generatedStory: Story = {
        id: `story-${Date.now()}`,
        title: data.story.title,
        synopsis: data.story.synopsis,
        genre: params.genre,
        length: params.length,
        language: params.language,
        writingStyle: params.writingStyle,
        perspective: params.perspective,
        characters: data.story.characters || params.characters,
        sections: data.story.sections || [],
        fullText: data.story.fullText,
        wordCount: data.story.wordCount || 500,
        readingTime: data.story.readingTime || '3 min read',
        createdAt: new Date().toISOString(),
        illustration: data.story.illustration ? {
          concept: data.story.illustration.concept,
          artStyle: data.story.illustration.artStyle,
          colorPalette: data.story.illustration.colorPalette || ['#1e1b4b', '#f59e0b', '#38bdf8'],
          focalElement: data.story.illustration.focalElement,
          visualPrompt: data.story.illustration.visualPrompt,
          // If genre has a pre-rendered high-res asset, link it as high-res illustration
          generatedImageUrl: getGenreArtworkUrl(params.genre),
        } : undefined,
        isSaved: false,
      };

      // Automatically add to recent and set as active reader story
      setActiveStory(generatedStory);
      setActiveTab('reader');
    } catch (err: any) {
      console.error('Error in handleGenerateStory:', err);
      setErrorMessage(err?.message || 'Failed to generate story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getGenreArtworkUrl = (genre: StoryGenre): string | undefined => {
    switch (genre) {
      case 'Fantasy':
        return '/src/assets/images/genre_fantasy_castle_1794375781580.jpg';
      case 'Science Fiction':
        return '/src/assets/images/genre_scifi_cosmic_1794375782517.jpg';
      case 'Mystery':
        return '/src/assets/images/genre_mystery_manor_1794375782757.jpg';
      default:
        return '/src/assets/images/hero_story_spellbook_1794375781706.jpg';
    }
  };

  // Save story to library
  const handleSaveStory = (storyToSave: Story) => {
    saveStory(storyToSave);
    const updated = getSavedStories();
    setSavedStories(updated);
    if (activeStory && activeStory.id === storyToSave.id) {
      setActiveStory({ ...activeStory, isSaved: true });
    }
  };

  // Delete story from library
  const handleDeleteStory = (id: string) => {
    deleteStory(id);
    const updated = getSavedStories();
    setSavedStories(updated);
    if (activeStory && activeStory.id === id) {
      setActiveStory(null);
      setActiveTab('library');
    }
  };

  // Save character to roster
  const handleSaveCharacter = (char: CharacterProfile) => {
    const updated = [char, ...characterRoster.filter((c) => c.id !== char.id)];
    setCharacterRoster(updated);
    try {
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Delete character from roster
  const handleDeleteCharacter = (id: string) => {
    const updated = characterRoster.filter((c) => c.id !== id);
    setCharacterRoster(updated);
    try {
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Use character in story generator
  const handleUseCharacterInStory = (charName: string) => {
    // Switch to story generator
    setActiveTab('generator');
  };

  // Open story in reader
  const handleOpenStoryInReader = (story: Story) => {
    setActiveStory(story);
    setActiveTab('reader');
  };

  // Jump to story generator with a genre preselected
  const handleSelectGenre = (genre: StoryGenre, exampleTopic?: string) => {
    setGeneratorGenre(genre);
    if (exampleTopic) setGeneratorTopic(exampleTopic);
    setActiveTab('generator');
  };

  // Continue a specific story
  const handleContinueStory = (story: Story) => {
    setContinueInitialText(story.fullText);
    setContinueInitialGenre(story.genre);
    setActiveTab('continue');
  };

  // Quick action: start new story
  const handleNewStory = () => {
    setGeneratorTopic('');
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070614] text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedStories.length}
        onNewStory={handleNewStory}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            stories={savedStories}
            onSelectGenre={handleSelectGenre}
            onOpenStory={handleOpenStoryInReader}
            onNavigate={(tab) => setActiveTab(tab)}
            onNewStory={handleNewStory}
          />
        )}

        {activeTab === 'generator' && (
          <StoryGeneratorView
            initialGenre={generatorGenre}
            initialTopic={generatorTopic}
            characterRoster={characterRoster}
            onGenerate={handleGenerateStory}
            isLoading={isLoading}
            onOpenCharacterForge={() => setActiveTab('characters')}
          />
        )}

        {activeTab === 'reader' && activeStory && (
          <StoryReaderView
            story={activeStory}
            onSave={handleSaveStory}
            isSaved={isStorySaved(activeStory.id)}
            onDownloadTxt={downloadStoryTxt}
            onContinueStory={handleContinueStory}
            onBackToGenerator={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'characters' && (
          <CharacterGeneratorView
            roster={characterRoster}
            onSaveCharacter={handleSaveCharacter}
            onDeleteCharacter={handleDeleteCharacter}
            onUseInStory={handleUseCharacterInStory}
          />
        )}

        {activeTab === 'continue' && (
          <ContinueStoryView
            initialStoryText={continueInitialText}
            initialGenre={continueInitialGenre}
            savedStories={savedStories}
            onSaveContinuedStory={handleSaveStory}
            onDownloadTxt={downloadStoryTxt}
          />
        )}

        {activeTab === 'library' && (
          <SavedStoriesView
            stories={savedStories}
            onOpenStory={handleOpenStoryInReader}
            onDeleteStory={handleDeleteStory}
            onDownloadTxt={downloadStoryTxt}
            onContinueStory={handleContinueStory}
            onNewStory={handleNewStory}
          />
        )}
      </main>

      {/* Loading Modal with Storytelling Progress */}
      {isLoading && (
        <LoadingStoryModal
          topic={loadingContext.topic}
          genre={loadingContext.genre}
        />
      )}

      {/* Error Notification Toast */}
      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          isApiKeyError={isApiKeyError}
          onDismiss={() => setErrorMessage(null)}
          onRetry={() => {
            setErrorMessage(null);
            if (activeTab === 'generator') {
              handleNewStory();
            }
          }}
        />
      )}

      {/* Atmospheric Footer */}
      <footer className="mt-auto border-t border-purple-900/30 bg-[#060512] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-slate-300">AI Story Creator</span>
            <span aria-hidden="true">·</span>
            <span>Crafting endless narratives with Google Gemini AI</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Structured 3-Act Narratives</span>
            <span aria-hidden="true">·</span>
            <span>8 Literary Genres</span>
            <span aria-hidden="true">·</span>
            <span>Character Forge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
