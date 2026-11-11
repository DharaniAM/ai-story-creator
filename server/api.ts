import express, { Request, Response } from 'express';
import {
  generateStoryWithGemini,
  continueStoryWithGemini,
  generateCharacterWithGemini,
} from './gemini.js';

export const apiApp = express();
export const apiRouter = express.Router();

apiApp.use(express.json({ limit: '10mb' }));
apiApp.use('/api', apiRouter);

apiRouter.get('/health', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    geminiConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.post('/story/generate', async (req: Request, res: Response) => {
  try {
    const { topic, genre, length, characters, language, writingStyle, perspective } = req.body;

    if (!topic || !topic.trim()) {
      res.status(400).json({ error: 'Please provide a story topic or idea.' });
      return;
    }

    const storyData = await generateStoryWithGemini({
      topic: topic.trim(),
      genre: genre || 'Fantasy',
      length: length || 'medium',
      characters: Array.isArray(characters) ? characters : [],
      language: language || 'English',
      writingStyle: writingStyle || 'Cinematic & Atmospheric',
      perspective: perspective || 'Third-person Limited',
    });

    res.json({
      success: true,
      story: storyData,
    });
  } catch (err: any) {
    console.error('Error generating story:', err);
    const errorMessage = err?.message || 'Failed to generate story with Gemini AI.';
    const isApiKeyError = errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('API key');
    res.status(500).json({
      error: errorMessage,
      isApiKeyError,
    });
  }
});

apiRouter.post('/story/continue', async (req: Request, res: Response) => {
  try {
    const { existingStory, genre, continuationNotes, length, language, writingStyle } = req.body;

    if (!existingStory || !existingStory.trim()) {
      res.status(400).json({ error: 'Please provide the existing story to continue.' });
      return;
    }

    const continuation = await continueStoryWithGemini({
      existingStory: existingStory.trim(),
      genre,
      continuationNotes,
      length: length || 'medium',
      language,
      writingStyle,
    });

    res.json({
      success: true,
      continuation,
    });
  } catch (err: any) {
    console.error('Error continuing story:', err);
    const errorMessage = err?.message || 'Failed to continue story with Gemini AI.';
    const isApiKeyError = errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('API key');
    res.status(500).json({
      error: errorMessage,
      isApiKeyError,
    });
  }
});

apiRouter.post('/character/generate', async (req: Request, res: Response) => {
  try {
    const { genre, archetype, rolePrompt } = req.body;

    const character = await generateCharacterWithGemini({
      genre: genre || 'Fantasy',
      archetype,
      rolePrompt,
    });

    res.json({
      success: true,
      character,
    });
  } catch (err: any) {
    console.error('Error generating character:', err);
    const errorMessage = err?.message || 'Failed to generate character with Gemini AI.';
    const isApiKeyError = errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('API key');
    res.status(500).json({
      error: errorMessage,
      isApiKeyError,
    });
  }
});
