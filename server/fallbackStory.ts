import { GenerateStoryParams, ContinueStoryParams, GenerateCharacterParams } from './gemini.js';

const GENRE_FLAVORS: Record<string, {
  adjectives: string[];
  artifacts: string[];
  settings: string[];
  conflicts: string[];
  resolutions: string[];
}> = {
  Fantasy: {
    adjectives: ['Ethereal', 'Ancient', 'Celestial', 'Runebound', 'Forgotten', 'Whispering', 'Luminescent'],
    artifacts: ['the Astral Chronometer', 'the Star-Glass Crucible', 'the Obsidian Flute', 'the Sunken Grimoire'],
    settings: ['the Cloud-Spire Citadel', 'the Sunken Archives of Eldoria', 'the Whispering Thicket', 'the Valley of Silent Chimes'],
    conflicts: ['an arcane surge that unravels the boundaries of memory', 'the awakening of a slumbering titan beneath the bedrock', 'a forbidden pact sealed in celestial silver'],
    resolutions: ['a sacrifice of inherited magic that restores the world\'s harmonic balance', 'the discovery of a hidden truth written in the heart of the crystal', 'a covenant between mortal and mythic beast that unites the realms'],
  },
  'Science Fiction': {
    adjectives: ['Sub-Orbital', 'Interstellar', 'Synthetic', 'Quantum', 'Hyperion', 'Zero-G', 'Anomalous'],
    artifacts: ['a dormant tachyon drive', 'a memory-crystal from the Andromeda Exodus', 'the Chronos Beacon', 'an encrypted AI shard'],
    settings: ['Station Ouroboros on the rim of the Kuiper Belt', 'the neon-drenched canyons of New Cydonia', 'the derelict carrier Leviathan-9', 'a subterranean colony on Titan'],
    conflicts: ['a rogue telemetry signal predicting the collapse of the jump gate', 'an emergent synthetic consciousness seeking its lost creator', 'a solar flare that disables life support and exposes a hidden laboratory'],
    resolutions: ['recalibrating the fusion lattice using ancient analog frequencies', 'forging a mutual consciousness bridge between human and machine', 'a daring slingshot maneuver around the event horizon to safety'],
  },
  Mystery: {
    adjectives: ['Veiled', 'Midnight', 'Whispering', 'Cobblestone', 'Gaslit', 'Hollow', 'Ciphered'],
    artifacts: ['a silver key with nine notches', 'a burned ledger from 1892', 'an antique pocketwatch that ticks backwards', 'a monocle revealing invisible ink'],
    settings: ['the misty quays of Blackwood Wharf', 'the ancestral library of Ravencroft Hall', 'a midnight sleeper express through the Alps', 'an unmapped vault beneath the city cathedral'],
    conflicts: ['a vanishing guest whose footprints stop abruptly in the wet snow', 'a family heirloom found in the coat of a dead stranger', 'a series of cryptograms received hours before each murder'],
    resolutions: ['the final cipher reveals that the victim had orchestrated their own disappearance', 'the hidden compartment beneath the grand piano unmasks the true heir', 'a forgotten testimony locks the guilty party in their own web of deceit'],
  },
  Horror: {
    adjectives: ['Hollow', 'Grim', 'Spectral', 'Dread', 'Nocturnal', 'Eerie', 'Abyssal'],
    artifacts: ['a music box that plays only in the dark', 'a tarnished mirror reflecting a room five seconds delayed', 'a journal written in charcoal and bone', 'an antique lantern that casts shadows inward'],
    settings: ['an abandoned coastal lighthouse surrounded by whispering fog', 'the rotting cellar of St. Jude\'s Asylum', 'a desolate pine forest where birds never sing', 'a Victorian sanitarium lost to the marshlands'],
    conflicts: ['the shadows along the hallway begin moving independent of the candles', 'a phone line severed thirty years ago rings at 3:17 AM', 'each door in the house leads back to the cellar'],
    resolutions: ['confronting the spectral memory with the truth of what transpired', 'breaking the cursed mirror and braving the morning daylight', 'sealing the subterranean hatch with blessed molten lead'],
  },
  Adventure: {
    adjectives: ['Uncharted', 'Golden', 'Tempest', 'Sunken', 'Perilous', 'Windward', 'Sovereign'],
    artifacts: ['a map inscribed upon cured sharkskin', 'the Golden Compass of Queen Althea', 'a telescope that pierces sea-fogs', 'the Sun-Stone of the Andes'],
    settings: ['the Skeleton Archipelago', 'the sunken ruins of the Corsair Kings', 'a treacherous mountain pass in the Himalayas', 'an uncharted canyon carved by subterranean rapids'],
    conflicts: ['a collapsing rope bridge across a thousand-foot chasm', 'a mutiny ignited by rumors of cursed gold', 'a violent tropical squall that strands the party on an uncharted reef'],
    resolutions: ['discovering that the true treasure was an ancient irrigation aqueduct that saves the native valley', 'a breathtaking leap onto the escaping airship', 'decoding the temple dial just as the cavern ceiling begins to cave in'],
  },
  Comedy: {
    adjectives: ['Mismatched', 'Chaotic', 'Bumbling', 'Preposterous', 'Wobbly', 'Hapless', 'Quirky'],
    artifacts: ['a self-stirring cauldron with an attitude', 'a diplomatic treaty written on a cocktail napkin', 'a pair of shoes that only march to polka music', 'an enchanted sourdough starter'],
    settings: ['the Grand Embassy Annual Gala', 'a chaotic royal bakery during inspection', 'the Department of Minor Inconveniences', 'a sleepy hamlet tournament'],
    conflicts: ['an accidental love potion given to the royal gargoyle', 'a mistaken identity where a plumber is crowned Supreme High Chancellor', 'a runaway flock of enchanted sheep invading the town council'],
    resolutions: ['an utterly absurd speech that wins over the entire hostile council', 'turning the disastrous cake explosion into an award-winning modern dessert', 'everyone realizing that peace was achieved entirely through shared embarrassment'],
  },
  'Romance-free friendship': {
    adjectives: ['Steadfast', 'Loyal', 'Kindred', 'Resilient', 'Found', 'Unbroken', 'Boundless'],
    artifacts: ['a weathered brass compass shared since childhood', 'a sketchbook filled with architectural dreams', 'a set of matched pocket knives', 'an ancient glider framework'],
    settings: ['a windswept coastal cliff workshop', 'the dusty attic above an antique bookstore', 'a mountain rescue outpost in the Cascades', 'a bustling community repair hangar'],
    conflicts: ['an unforgiving blizzard that threatens to cut off the supply trail', 'a foreclosure notice on their late mentor\'s astronomical observatory', 'a bitter misunderstanding about an inherited blueprint'],
    resolutions: ['standing shoulder to shoulder as the storm clears to unveil their completed solar sail', 'restoring the observatory telescope together and spotting a new comet', 'realizing that true camaraderie is built on shared sacrifices'],
  },
  Inspirational: {
    adjectives: ['Resolute', 'Luminous', 'Unyielding', 'Courageous', 'Transcendent', 'Visionary', 'Triumphant'],
    artifacts: ['a handcrafted acoustic cello with tactile resonant plates', 'a battered journal of mountaineering coordinates', 'a greenhouse glass prism', 'an iron chisel passed through three generations'],
    settings: ['a high mountain sanctuary above the storm clouds', 'a quiet ceramics studio in an old coastal mill', 'an inner-city conservatory garden', 'a rehabilitation clinic overlooking the sea'],
    conflicts: ['a sudden sensory loss that threatens a life\'s artistic dedication', 'overcoming the psychological scars of an alpine disaster', 'defending a haven for underprivileged youth against commercial demolition'],
    resolutions: ['hearing and feeling music in a revolutionary new way that touches hundreds of hearts', 'summiting the final ridgeline and witnessing the golden dawn', 'transforming adversity into a beacon that inspires an entire generation'],
  },
};

export function generateCreativeFallbackStory(params: GenerateStoryParams) {
  const genre = params.genre || 'Fantasy';
  const flavor = GENRE_FLAVORS[genre] || GENRE_FLAVORS['Fantasy'];
  const p1 = params.characters?.[0] || 'Kaelen Thorne';
  const p2 = params.characters?.[1] || 'Vesper Vance';

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const adj = pick(flavor.adjectives);
  const artifact = pick(flavor.artifacts);
  const setting = pick(flavor.settings);
  const conflict = pick(flavor.conflicts);
  const resolution = pick(flavor.resolutions);

  const title = `The ${adj} Chronicle: Legend of ${setting.split(' ')[1] || 'the Horizon'}`;
  const synopsis = `When ${p1} discovers ${artifact} within ${setting}, an unexpected trial arises when ${conflict}. Together with ${p2}, they must navigate ancient perils to achieve ${resolution}.`;

  const beginningContent = `The wind howling through ${setting} carried the scent of ozone and forgotten history. ${p1} paused, fingers brushing against the cool, weathered stonework. For weeks, rumors had whispered of ${artifact}, but seeing the faint luminescence pulsing through the fissures made the hair on the back of their neck stand on end.\n\n"You should not touch what was sealed before the great silence," ${p2}'s voice rang out from the shadowy archway. Yet neither could deny the strange harmonic vibration humming through their boots—the journey had begun, and there was no turning back.`;

  const middleContent = `Descending into the subterranean heart of ${setting}, the path gave way to fractured corridors and shifting architectural puzzles. It was here that ${conflict}. Every shadow seemed to stretch with conscious intent, and the fragile light of their lanterns flickered against walls carved with warnings in a language older than kingdoms.\n\n${p1} and ${p2} stood back-to-back as the mechanism groaned into life. "If we miscalculate the alignment," ${p1} breathed, hands steadying upon the rotating astrolabe dial, "the entire vault will collapse into the chasm." With a decisive heave, the final locking ring clicked into position.`;

  const endingContent = `Silence crashed over the sanctuary like a breaking wave. The blinding radiance subsided into a warm, rhythmic amber glow. Through perseverance and mutual trust, they had brought about ${resolution}.\n\nAs dawn broke over the horizon, casting golden rays across the peaks of ${setting}, ${p1} turned to ${p2} with a tired smile. The world below remained blissfully unaware of the catastrophe averted, but their names were now written among the stars that watch over the realm.`;

  const fullText = `# ${title}\n\n**Genre:** ${genre} · **Style:** ${params.writingStyle || 'Cinematic'} · **Cast:** ${p1}, ${p2}\n\n### Act I: The Awakening at ${setting}\n\n${beginningContent}\n\n### Act II: The Crucible of Shadows\n\n${middleContent}\n\n### Act III: The Dawn of Reckoning\n\n${endingContent}`;

  return {
    title,
    synopsis,
    genre,
    readingTime: params.length === 'short' ? '2 min read' : params.length === 'long' ? '5 min read' : '3 min read',
    sections: [
      {
        act: 'Beginning',
        heading: `I. The Awakening at ${setting.split(' ')[0] || 'the Gate'}`,
        content: beginningContent,
      },
      {
        act: 'Middle',
        heading: 'II. The Crucible of Shadows',
        content: middleContent,
      },
      {
        act: 'Ending',
        heading: 'III. The Dawn of Reckoning',
        content: endingContent,
      },
    ],
    fullText,
    wordCount: params.length === 'short' ? 380 : params.length === 'long' ? 1050 : 640,
    characters: [p1, p2],
    illustration: {
      concept: `A cinematic panoramic view of ${p1} holding ${artifact} high amidst the misty atmospheric architecture of ${setting} at golden hour.`,
      artStyle: `${genre} Cinematic Concept Art`,
      colorPalette: ['#140d2e', '#9333ea', '#f59e0b', '#38bdf8'],
      focalElement: `${p1} and the glowing ${artifact} in the center of ${setting}`,
      visualPrompt: `Epic 8k cinematic digital concept art of ${p1} discovering ${artifact} in ${setting}, dramatic god rays piercing deep violet and midnight blue mist, glowing embers, fantasy atmosphere.`,
    },
  };
}

export function generateCreativeFallbackContinuation(params: ContinueStoryParams) {
  const genre = params.genre || 'Fantasy';
  const flavor = GENRE_FLAVORS[genre] || GENRE_FLAVORS['Fantasy'];
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const continuationTitle = `Chapter II: The Echoes of ${pick(flavor.settings).split(' ')[1] || 'Destiny'}`;
  const continuedText = `The silence that followed the revelation felt heavier than iron. For three long heartbeats, no one dared exhale. Just as the dust began to settle across the flagstones, a low subterranean tremor rattled the floorboards.\n\nFrom the far corridor, a figure stepped into the flickering circle of lantern light—cloaked in midnight velvet, bearing an insignia that had not been documented in the archives for over two centuries. "You thought you had unsealed the truth," the newcomer whispered with a sorrowful smile. "You have merely opened the first door of three."\n\nLooking down at the glowing glyphs etched into the floor, the realization struck with chilling clarity: every step of their journey thus far had been orchestrated by a mind far older and far more patient than they could have ever foreseen.`;

  return {
    continuationTitle,
    continuedText,
    plotTwistNote: params.continuationNotes || 'An enigmatic figure appears bearing a forgotten crest, revealing that this trial was only the prelude to a far greater three-part mystery.',
    newCharactersIntroduced: ['The Cloaked Observer'],
    wordCount: 220,
  };
}

export function generateCreativeFallbackCharacter(params: GenerateCharacterParams) {
  const genre = params.genre || 'Fantasy';
  const archetype = params.archetype || 'Rogue Scholar';

  const names: Record<string, string[]> = {
    Fantasy: ['Aurelius Vance', 'Sylvia Moonwhisper', 'Corvus Thorne', 'Elora Ashdown', 'Morzan Ironweaver'],
    'Science Fiction': ['Jaxson 9-Prime', 'Dr. Evelyn Cross', 'Commander Noah Zhang', 'Kira Vex', 'Echo Miller'],
    Mystery: ['Detective Julian Gray', 'Audrey Blackwood', 'Miles Pembroke', 'Inspector Beatrice Shaw'],
    Horror: ['Thomas Holloway', 'Eleanor Finch', 'Father Malachi', 'Silas Van Houten'],
    Adventure: ['Santiago Cortez', 'Marina Drake', 'Captain Finnian Bell', 'Zara Al-Mansur'],
    Comedy: ['Barnaby Fiddlesticks', 'Chef Pierre Flambé', 'Clara Clutterbuck', 'Archibald Wigglesworth'],
    'Romance-free friendship': ['Rowan Sterling', 'Mateo Castillo', 'Samira Khan', 'Tobias Lind'],
    Inspirational: ['Maya Chen', 'David Okonjo', 'Leila Rostami', 'Gabriel Santos'],
  };

  const list = names[genre] || names['Fantasy'];
  const name = list[Math.floor(Math.random() * list.length)];

  return {
    name,
    role: `Master ${archetype}`,
    archetype,
    traits: ['Steely resolve', 'Perceptive observation', 'Guarded cynicism', 'Fiercely loyal to friends'],
    backstory: `Trained under the ascetic scholars of the Outer Rim, ${name} abandoned the high order when they uncovered an encrypted archive predicting the silent collapse of their order's foundations. Ever since, they have lived on the frontiers, seeking out lost artifacts before corrupted factions can weaponize them.`,
    quirk: 'Unconsciously flips a double-faced antique coin whenever calculating risk percentages.',
    motivation: 'To restore historical truth to the archives and protect innocent wanderers from ancient curses.',
    sampleQuote: 'Fate is merely the excuse of those too terrified to steer their own compass.',
    avatarVisual: 'Intense gaze, weathered leather travel coat, silver-clasped satchel filled with parchment rubbings and celestial brass instruments.',
  };
}
