export type StoryGenre = 
  | 'Fantasy'
  | 'Science Fiction'
  | 'Mystery'
  | 'Horror'
  | 'Adventure'
  | 'Comedy'
  | 'Romance-free friendship'
  | 'Inspirational';

export type StoryLength = 'short' | 'medium' | 'long';

export type StoryPerspective = 
  | 'Third-person Limited' 
  | 'First-person ("I")' 
  | 'Omniscient Narrator';

export type WritingStyle = 
  | 'Cinematic & Atmospheric'
  | 'Whimsical & Fairy Tale'
  | 'Dark & Suspenseful'
  | 'Humorous & Witty'
  | 'Poetic & Lyrical'
  | 'Fast-Paced Action'
  | 'Classic Folklore'
  | 'Noir Detective';

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  archetype?: string;
  traits: string[];
  backstory: string;
  quirk?: string;
  motivation?: string;
  sampleQuote?: string;
  avatarVisual?: string;
}

export interface StorySection {
  act: 'Beginning' | 'Middle' | 'Ending' | string;
  heading: string;
  content: string;
}

export interface StoryIllustration {
  concept: string;
  artStyle: string;
  colorPalette: string[];
  focalElement: string;
  visualPrompt: string;
  generatedImageUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  synopsis: string;
  genre: StoryGenre;
  length: StoryLength;
  language: string;
  writingStyle: string;
  perspective?: string;
  characters: string[];
  characterProfiles?: CharacterProfile[];
  sections: StorySection[];
  fullText: string;
  wordCount: number;
  readingTime: string;
  createdAt: string;
  illustration?: StoryIllustration;
  continuationCount?: number;
  isSaved?: boolean;
}

export interface GenreMetadata {
  id: StoryGenre;
  label: string;
  iconName: string;
  tagline: string;
  colorGradient: string;
  borderColor: string;
  accentColor: string;
  exampleTopic: string;
  bgImage?: string;
}
