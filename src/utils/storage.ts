import { Story } from '../types/story';

const STORAGE_KEY = 'ai_story_creator_saved_stories_v1';

export const SAMPLE_STORIES: Story[] = [
  {
    id: 'sample-fantasy-1',
    title: 'The Clockwork Dragon of Oakhaven',
    synopsis: 'A lonely apprentice watchmaker discovers that the grand brass bell at the cathedral summit houses an ancient mechanical dragon waiting for starlight.',
    genre: 'Fantasy',
    length: 'medium',
    language: 'English',
    writingStyle: 'Whimsical & Fairy Tale',
    perspective: 'Third-person Limited',
    characters: ['Elia Vance', 'Archmaster Thorne', 'Zephyr the Brass Drake'],
    wordCount: 712,
    readingTime: '3 min read',
    createdAt: '2026-11-09T18:30:00.000Z',
    isSaved: true,
    sections: [
      {
        act: 'Beginning',
        heading: 'I. Gears in the Belltower',
        content: `Rain beat against the leaded stained glass of Oakhaven Cathedral, each droplet ringing in quiet counterpoint to the ticking of a thousand pocketwatches. Elia Vance sat upon a three-legged stool high up in the rafters, an oil lamp casting long amber shadows over copper cogwheels taller than carriage wagons.\n\nShe was seventeen, with brass filings caught perpetually in her chestnut curls and an ear so sensitive she could detect an irregular escapement three streets away. Below her, the town slept under a quilt of slate roofs, oblivious to the strange hum vibrating through the cathedral floorboards. Archmaster Thorne had forbidden anyone from ascending past the fifth gear-tier, muttering about unstable pendulums. But Elia had seen the steam exhaling from the belfry during the midnight chimes—steam that smelled of frankincense and ozone.`
      },
      {
        act: 'Middle',
        heading: 'II. The Slumber of Spring and Sinew',
        content: `Holding her breath, Elia slipped between the colossal teeth of the Great Hour Gear. Behind the central drum stood not a hollow bell, but a dormant colossus: scales of polished brass overlapping like roof shingles, eyes fashioned from faceted violet amethyst, and wings folded tightly against a spine of coiled tungsten springs.\n\n"You are not a chime," she whispered, her fingertips trembling as they brushed the cool, polished metal of its snout.\n\nA deep, resonant harmonic thrummed through the hollow ribcage. In the center of the dragon\'s chest sat an empty celestial aperture—shaped precisely like the twelve-pointed celestial astrolabe she carried in her pocket, left behind by her grandfather. Outside, the cathedral bells began their midnight sequence. As the hammer swung toward the dragon\'s chest, Elia made her choice: she slotted the golden astrolabe into place.`
      },
      {
        act: 'Ending',
        heading: 'III. Wings of Aurora',
        content: `With a sound like a hundred harps struck simultaneously, the brass plates shifted. The amethyst eyes flared with inner lavender luminescence. Zephyr, the last chronomantic dragon forged before the Great Silencing, unfurled wings that cast interlocking geometric shadows across the rafters.\n\nInstead of fiery wrath, the drake bent its majestic neck, permitting Elia to climb aboard the saddle of carved ironwood. With a single beat of mechanical wings, they burst through the belfry shutters into the stormy night sky. As they soared above Oakhaven, the dragon breathed a torrent of shimmering stardust into the rainclouds, turning the storm into a swirling canopy of auroras that bathed the cobblestones in emerald and violet light.`
      }
    ],
    fullText: `# The Clockwork Dragon of Oakhaven\n\n**Genre:** Fantasy · **Reading Time:** 3 min read · **Author:** AI Story Creator\n\n### I. Gears in the Belltower\n\nRain beat against the leaded stained glass of Oakhaven Cathedral, each droplet ringing in quiet counterpoint to the ticking of a thousand pocketwatches. Elia Vance sat upon a three-legged stool high up in the rafters, an oil lamp casting long amber shadows over copper cogwheels taller than carriage wagons.\n\nShe was seventeen, with brass filings caught perpetually in her chestnut curls and an ear so sensitive she could detect an irregular escapement three streets away. Below her, the town slept under a quilt of slate roofs, oblivious to the strange hum vibrating through the cathedral floorboards. Archmaster Thorne had forbidden anyone from ascending past the fifth gear-tier, muttering about unstable pendulums. But Elia had seen the steam exhaling from the belfry during the midnight chimes—steam that smelled of frankincense and ozone.\n\n### II. The Slumber of Spring and Sinew\n\nHolding her breath, Elia slipped between the colossal teeth of the Great Hour Gear. Behind the central drum stood not a hollow bell, but a dormant colossus: scales of polished brass overlapping like roof shingles, eyes fashioned from faceted violet amethyst, and wings folded tightly against a spine of coiled tungsten springs.\n\n"You are not a chime," she whispered, her fingertips trembling as they brushed the cool, polished metal of its snout.\n\nA deep, resonant harmonic thrummed through the hollow ribcage. In the center of the dragon's chest sat an empty celestial aperture—shaped precisely like the twelve-pointed celestial astrolabe she carried in her pocket, left behind by her grandfather. Outside, the cathedral bells began their midnight sequence. As the hammer swung toward the dragon's chest, Elia made her choice: she slotted the golden astrolabe into place.\n\n### III. Wings of Aurora\n\nWith a sound like a hundred harps struck simultaneously, the brass plates shifted. The amethyst eyes flared with inner lavender luminescence. Zephyr, the last chronomantic dragon forged before the Great Silencing, unfurled wings that cast interlocking geometric shadows across the rafters.\n\nInstead of fiery wrath, the drake bent its majestic neck, permitting Elia to climb aboard the saddle of carved ironwood. With a single beat of mechanical wings, they burst through the belfry shutters into the stormy night sky. As they soared above Oakhaven, the dragon breathed a torrent of shimmering stardust into the rainclouds, turning the storm into a swirling canopy of auroras that bathed the cobblestones in emerald and violet light.`,
    illustration: {
      concept: 'An intricate mechanical dragon with polished brass scales and glowing amethyst eyes unfurling wings over a stormy medieval town cathedral at midnight.',
      artStyle: 'Luminous Whimsical Fantasy Digital Art',
      colorPalette: ['#130e2e', '#9333ea', '#f59e0b', '#38bdf8'],
      focalElement: 'The brass dragon Zephyr and apprentice Elia in the cathedral rafters',
      visualPrompt: 'Detailed steampunk fantasy illustration of a clockwork mechanical brass dragon with glowing violet eyes perched atop an ornate cathedral belltower surrounded by giant copper cogs and starry stardust.',
      generatedImageUrl: '/src/assets/images/genre_fantasy_castle_1794375781580.jpg'
    }
  },
  {
    id: 'sample-mystery-2',
    title: 'The Silent Whispers of Blackwood Manor',
    synopsis: 'A cryptographer inherits her estranged uncle’s ancestral estate, only to discover that the wallpaper patterns spell out coordinates to a sunken vault.',
    genre: 'Mystery',
    length: 'short',
    language: 'English',
    writingStyle: 'Noir Detective',
    perspective: 'First-person ("I")',
    characters: ['Clara Sterling', 'Inspector Reid'],
    wordCount: 420,
    readingTime: '2 min read',
    createdAt: '2026-11-08T12:00:00.000Z',
    isSaved: true,
    sections: [
      {
        act: 'Beginning',
        heading: 'I. The Scent of Old Paper',
        content: `Blackwood Manor smelled of damp damask and secrets long left to spoil. Uncle Silas had lived forty years in solitude, surrounded by cipher wheels and books no living scholar dared translate. When the probate lawyer handed me the heavy iron key, his hand shook. "Check the parlor wallpaper first, Miss Sterling," he had whispered.`
      },
      {
        act: 'Middle',
        heading: 'II. The Damask Cipher',
        content: `I raised my magnifying glass to the faded Victorian wallpaper in the drawing room. What seemed like decorative acanthus leaves and golden floral swirls was, under magnification, a continuous repeating substitution cipher based on Baconian code. The stems were dashes; the blossoms, binary dots.\n\nBy midnight, candle wax dripping on my knuckle, the decoded message had taken shape across my notepad: *Beneath the floor of the third pantry lies what they tried to drown in 1894.*`
      },
      {
        act: 'Ending',
        heading: 'III. The Iron Ring',
        content: `Inspector Reid arrived just as my crowbar found the concealed seam in the pantry flagstones. Beneath the heavy oak timber lay a submerged iron vault, padlocked with five rotating alphabet dials. As I spun the dials to match Silas\'s birth date, the lock snapped open with a metallic click that echoed into the hollow dark.`
      }
    ],
    fullText: `# The Silent Whispers of Blackwood Manor\n\n**Genre:** Mystery · **Reading Time:** 2 min read\n\n### I. The Scent of Old Paper\nBlackwood Manor smelled of damp damask and secrets long left to spoil. Uncle Silas had lived forty years in solitude, surrounded by cipher wheels and books no living scholar dared translate. When the probate lawyer handed me the heavy iron key, his hand shook. "Check the parlor wallpaper first, Miss Sterling," he had whispered.\n\n### II. The Damask Cipher\nI raised my magnifying glass to the faded Victorian wallpaper in the drawing room. What seemed like decorative acanthus leaves and golden floral swirls was, under magnification, a continuous repeating substitution cipher based on Baconian code. The stems were dashes; the blossoms, binary dots.\n\nBy midnight, candle wax dripping on my knuckle, the decoded message had taken shape across my notepad: *Beneath the floor of the third pantry lies what they tried to drown in 1894.*\n\n### III. The Iron Ring\nInspector Reid arrived just as my crowbar found the concealed seam in the pantry flagstones. Beneath the heavy oak timber lay a submerged iron vault, padlocked with five rotating alphabet dials. As I spun the dials to match Silas's birth date, the lock snapped open with a metallic click that echoed into the hollow dark.`,
    illustration: {
      concept: 'A dimly lit Victorian drawing room with peeling ornate wallpaper, magnifying glass on handwritten cipher notes, with rain against foggy window panes.',
      artStyle: 'Atmospheric Victorian Noir Oil Painting',
      colorPalette: ['#12101e', '#eab308', '#71717a', '#7e22ce'],
      focalElement: 'The handwritten cipher notes and magnifying glass next to the antique wallpaper',
      visualPrompt: 'Moody Victorian study with magnifying glass illuminating subtle secret symbols hidden in peeling dark wallpaper, amber desk lamp glow, foggy rain outside the window.',
      generatedImageUrl: '/src/assets/images/genre_mystery_manor_1794375782757.jpg'
    }
  }
];

export function getSavedStories(): Story[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed with initial sample stories
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_STORIES));
      return SAMPLE_STORIES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading saved stories:', e);
    return SAMPLE_STORIES;
  }
}

export function saveStory(story: Story): void {
  try {
    const existing = getSavedStories();
    const updated = [
      { ...story, isSaved: true },
      ...existing.filter(s => s.id !== story.id)
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving story:', e);
  }
}

export function deleteStory(id: string): void {
  try {
    const existing = getSavedStories();
    const filtered = existing.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting story:', e);
  }
}

export function isStorySaved(id: string): boolean {
  const existing = getSavedStories();
  return existing.some(s => s.id === id);
}

export function downloadStoryTxt(story: Story): void {
  const header = `=====================================================
${story.title.toUpperCase()}
=====================================================
Genre: ${story.genre}
Estimated Reading Time: ${story.readingTime}
Word Count: ${story.wordCount} words
Language: ${story.language || 'English'}
Writing Style: ${story.writingStyle || 'Standard'}
Created Date: ${new Date(story.createdAt).toLocaleDateString()}
Featured Characters: ${story.characters?.length ? story.characters.join(', ') : 'None specified'}

Synopsis:
${story.synopsis}
=====================================================

`;

  const sectionsContent = story.sections && story.sections.length > 0
    ? story.sections.map(sec => `[${sec.act.toUpperCase()}] - ${sec.heading}\n\n${sec.content}\n\n`).join('-----------------------------------------------------\n\n')
    : story.fullText;

  const fullExport = `${header}${sectionsContent}
=====================================================
Generated with AI Story Creator (Powered by Google Gemini AI)
=====================================================`;

  const blob = new Blob([fullExport], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedTitle = story.title.toLowerCase().replace(/[^a-z0-9]/gi, '_').substring(0, 40);
  link.download = `${sanitizedTitle || 'story'}_ai_story.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyStoryToClipboard(story: Story): Promise<boolean> {
  const text = `${story.title}\n\n${story.synopsis}\n\n${story.fullText}`;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
