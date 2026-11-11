import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import {
  generateCreativeFallbackStory,
  generateCreativeFallbackContinuation,
  generateCreativeFallbackCharacter,
} from './fallbackStory.js';

dotenv.config();

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment. Please configure it in Settings > Secrets.');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface GenerateStoryParams {
  topic: string;
  genre: string;
  length: 'short' | 'medium' | 'long';
  characters?: string[];
  language?: string;
  writingStyle?: string;
  perspective?: string;
}

export async function generateStoryWithGemini(params: GenerateStoryParams) {
  try {
    const ai = getAiClient();

  const lengthGuide = {
    short: 'approx 300-450 words total, fast-paced and punchy',
    medium: 'approx 650-850 words total, rich narrative arc and character development',
    long: 'approx 1100-1500 words total, expansive worldbuilding, multiple scenes, dialogue and deep climax',
  }[params.length] || 'approx 600 words';

  const charPrompt = params.characters && params.characters.length > 0
    ? `Featured Characters: ${params.characters.join(', ')}.`
    : 'Introduce 1-3 memorable, original characters fitting the tale.';

  const languagePrompt = params.language ? `Write the story entirely in ${params.language}.` : 'Write in English.';
  const stylePrompt = params.writingStyle ? `Writing Style: ${params.writingStyle}.` : 'Writing Style: Cinematic & Atmospheric.';
  const perspectivePrompt = params.perspective ? `Narrative Perspective: ${params.perspective}.` : 'Third-person Limited.';

  const prompt = `
You are a master fiction author and world-renowned storyteller. Craft an exceptional, fully original, captivating story based on the following specifications:

- Premise / Idea: "${params.topic}"
- Genre: ${params.genre}
- Length Target: ${lengthGuide}
- ${charPrompt}
- ${languagePrompt}
- ${stylePrompt}
- ${perspectivePrompt}

Story Structure Requirements:
1. An attractive, evocative, literary title (not cliché).
2. A compelling 2-sentence synopsis.
3. Three structured acts:
   - "Beginning" (The Hook, setting the scene, introducing the protagonist and inciting incident)
   - "Middle" (Rising action, confrontation, obstacles, twists, mounting tension)
   - "Ending" (Climax, emotional payoff, satisfying resolution)
4. Vivid imagery, authentic dialogue, and strong sensory details matching the ${params.genre} genre.
5. An illustration concept breakdown for an atmospheric cover art.

Return ONLY a valid JSON object matching the requested schema.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are an award-winning creative author and storytelling AI that produces immersive fiction formatted strictly as structured JSON.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Attractive, evocative story title' },
          synopsis: { type: Type.STRING, description: '2-sentence gripping synopsis' },
          genre: { type: Type.STRING, description: 'The genre of the story' },
          readingTime: { type: Type.STRING, description: 'Estimated reading time, e.g. "3 min read"' },
          sections: {
            type: Type.ARRAY,
            description: 'The three acts of the story: Beginning, Middle, Ending',
            items: {
              type: Type.OBJECT,
              properties: {
                act: { type: Type.STRING, description: '"Beginning", "Middle", or "Ending"' },
                heading: { type: Type.STRING, description: 'Evocative chapter heading' },
                content: { type: Type.STRING, description: 'Paragraphs of the narrative for this act' },
              },
              required: ['act', 'heading', 'content'],
            },
          },
          fullText: { type: Type.STRING, description: 'Complete unified story text with section headers' },
          wordCount: { type: Type.INTEGER, description: 'Estimated word count' },
          characters: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Names of main characters featured in the story',
          },
          illustration: {
            type: Type.OBJECT,
            properties: {
              concept: { type: Type.STRING, description: 'Description of the key visual scene' },
              artStyle: { type: Type.STRING, description: 'Recommended visual art style' },
              colorPalette: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3-4 dominant hex or descriptive colors, e.g. ["#1a0933", "#f59e0b", "#38bdf8"]',
              },
              focalElement: { type: Type.STRING, description: 'Central focus of the artwork' },
              visualPrompt: { type: Type.STRING, description: 'Detailed prompt suitable for image generation' },
            },
            required: ['concept', 'artStyle', 'colorPalette', 'focalElement', 'visualPrompt'],
          },
        },
        required: ['title', 'synopsis', 'genre', 'readingTime', 'sections', 'fullText', 'wordCount', 'characters', 'illustration'],
      },
    },
  });

  const rawText = response.text || '{}';
  return JSON.parse(rawText);
} catch (err: any) {
  console.warn('Gemini generateContent call encountered an issue, activating creative storytelling fallback:', err?.message || err);
  return generateCreativeFallbackStory(params);
}
}

export interface ContinueStoryParams {
  existingStory: string;
  genre?: string;
  continuationNotes?: string;
  length?: 'short' | 'medium' | 'long';
  language?: string;
  writingStyle?: string;
}

export async function continueStoryWithGemini(params: ContinueStoryParams) {
  try {
    const ai = getAiClient();

  const lengthGuide = {
    short: 'approx 250-350 words, immediate momentum and sudden cliffhanger/resolution',
    medium: 'approx 500-700 words, rich continuation with dialogue and unfolding plot',
    long: 'approx 900-1200 words, deep multi-scene continuation introducing new stakes',
  }[params.length || 'medium'] || 'approx 500 words';

  const notesPrompt = params.continuationNotes?.trim()
    ? `User continuation direction/ideas: "${params.continuationNotes}".`
    : 'Devise an ingenious, organic twist or natural next chapter that escalates the stakes.';

  const prompt = `
You are continuing an ongoing narrative. Read the following story carefully:

--- BEGIN EXISTING STORY ---
${params.existingStory}
--- END EXISTING STORY ---

Genre: ${params.genre || 'Match existing genre'}
Style: ${params.writingStyle || 'Consistent with the existing narrative tone'}
Continuation Length Target: ${lengthGuide}
${notesPrompt}

Instructions:
1. Maintain total character consistency, tone, pacing, and voice.
2. Pick up directly where the existing text leaves off.
3. Provide a chapter title for this new section.
4. Craft an organic continuation with narrative depth.
5. Highlight what plot twist or turning point was introduced.

Return ONLY a valid JSON object matching the requested schema.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are an expert ghostwriter and continuity specialist continuing a story seamlessly.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          continuationTitle: { type: Type.STRING, description: 'Title or chapter header for the continuation' },
          continuedText: { type: Type.STRING, description: 'The newly written continuation text' },
          plotTwistNote: { type: Type.STRING, description: 'Brief note on how the plot advanced or shifted' },
          newCharactersIntroduced: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Any newly introduced characters',
          },
          wordCount: { type: Type.INTEGER, description: 'Word count of the continuation' },
        },
        required: ['continuationTitle', 'continuedText', 'plotTwistNote', 'newCharactersIntroduced', 'wordCount'],
      },
    },
  });

  const rawText = response.text || '{}';
  return JSON.parse(rawText);
} catch (err: any) {
  console.warn('Gemini continuation call encountered an issue, activating creative continuation fallback:', err?.message || err);
  return generateCreativeFallbackContinuation(params);
}
}

export interface GenerateCharacterParams {
  genre?: string;
  archetype?: string;
  rolePrompt?: string;
}

export async function generateCharacterWithGemini(params: GenerateCharacterParams) {
  try {
    const ai = getAiClient();

  const genre = params.genre || 'Fantasy';
  const rolePrompt = params.rolePrompt ? `Custom role request: "${params.rolePrompt}".` : '';
  const archetype = params.archetype ? `Archetype inspiration: "${params.archetype}".` : '';

  const prompt = `
Create a compelling, multifaceted original character for a ${genre} story.
${rolePrompt}
${archetype}

Requirements:
- Evocative full name
- Memorable title or role (e.g. "The Whispering Cartographer")
- 3 distinct personality traits (both strengths and flaws)
- Rich backstory (origins, turning point, secrets)
- Unique physical quirk or distinctive habit
- Core internal & external motivation
- Iconic sample dialogue line showing their personality and voice
- Visual descriptor suitable for character illustration concept

Return ONLY a valid JSON object matching the requested schema.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are an acclaimed novelist and character designer specializing in deep, memorable fictional personalities.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Full character name' },
          role: { type: Type.STRING, description: 'Title, profession, or role' },
          archetype: { type: Type.STRING, description: 'Character archetype' },
          traits: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '3-4 distinct personality traits',
          },
          backstory: { type: Type.STRING, description: '2-3 paragraph captivating background' },
          quirk: { type: Type.STRING, description: 'Memorable distinctive habit, quirk, or mannerism' },
          motivation: { type: Type.STRING, description: 'Core driving goal or desire' },
          sampleQuote: { type: Type.STRING, description: 'Memorable sample dialogue quote' },
          avatarVisual: { type: Type.STRING, description: 'Visual appearance description' },
        },
        required: ['name', 'role', 'archetype', 'traits', 'backstory', 'quirk', 'motivation', 'sampleQuote', 'avatarVisual'],
      },
    },
  });

  const rawText = response.text || '{}';
  return JSON.parse(rawText);
} catch (err: any) {
  console.warn('Gemini character call encountered an issue, activating creative character fallback:', err?.message || err);
  return generateCreativeFallbackCharacter(params);
}
}
