import { deepFreeze } from '../scripts/security.mjs';

export interface CosmicMeme {
  id: string;
  channel: string;
  codeName: string;
  title: string;
  tagline: string;
  lore: string;
  stats: {
    power: string;
    vibe: string;
    threatLevel: string;
    originSector: string;
  };
  videoSrc: string;
  posterSrc: string;
  pinUrl: string;
  pinId: string;
  themeColor: string;
  accentColor: string;
}

export const cosmicMemes: CosmicMeme[] = [
  {
    id: 'meme-1',
    channel: 'CH 01',
    codeName: 'CAPTAIN GATO XD',
    title: 'Zero-G Hip Lean & Infinite Swag',
    tagline: 'Defies planetary gravity through pure casual swagger.',
    lore: 'Intercepted from the outer rims of sector Gato. This feline specimen refuses to stand on all four legs when two legs and a 35-degree hip angle convey superior cosmic dominance.',
    stats: {
      power: '9,999 Swag',
      vibe: 'Ultra Chill',
      threatLevel: 'Immaculate Posture',
      originSector: 'Pin #905786543831788246'
    },
    videoSrc: '/memes/meme-1.mp4',
    posterSrc: '/memes/meme-1.jpg',
    pinUrl: 'https://www.pinterest.com/pin/905786543831788246/',
    pinId: '905786543831788246',
    themeColor: '#f8e5a7',
    accentColor: '#e88973'
  },
  {
    id: 'meme-2',
    channel: 'CH 02',
    codeName: 'MASTER ORANGE-FU',
    title: 'Superlanding & Galactic Martial Arts',
    tagline: 'One single orange braincell, channeled into lethal kung-fu perfection.',
    lore: 'Master of the ancient pavement style. Captured mid-superhero landing at 0300 hours in the dark streets of the Meow-tiverse. Capable of deflecting asteroid strikes with a single paw.',
    stats: {
      power: 'Over 9,000 HP',
      vibe: 'Combat Ready',
      threatLevel: 'Black Belt Orange',
      originSector: 'Pin #1139692249622590582'
    },
    videoSrc: '/memes/meme-2.mp4',
    posterSrc: '/memes/meme-2.jpg',
    pinUrl: 'https://www.pinterest.com/pin/1139692249622590582/',
    pinId: '1139692249622590582',
    themeColor: '#ff9a52',
    accentColor: '#ffe066'
  },
  {
    id: 'meme-3',
    channel: 'CH 03',
    codeName: 'LIL\' BOW VOCALIST',
    title: 'Interstellar Solo on the Sacred Plastic Chair',
    tagline: 'Tiny stature. Massive vocal frequency. Standing tall on the plastic throne.',
    lore: 'A miniature starlet perched upon the Monobloc of Eternity. Wearing the ceremonial Pink Bow Mk. I, she delivers a transmission that resonated through seven planetary star systems.',
    stats: {
      power: '120 dB Meow',
      vibe: 'Tiny Diva',
      threatLevel: 'Lethal Cuteness',
      originSector: 'Pin #533746993362819802'
    },
    videoSrc: '/memes/meme-3.mp4',
    posterSrc: '/memes/meme-3.jpg',
    pinUrl: 'https://www.pinterest.com/pin/533746993362819802/',
    pinId: '533746993362819802',
    themeColor: '#f2b6cb',
    accentColor: '#f8e5a7'
  },
  {
    id: 'meme-4',
    channel: 'CH 04',
    codeName: 'THE VOID EXPLORERS',
    title: 'Three Tiny Astronauts in Deep Space',
    tagline: 'Scouting uncharted darkness on two hind legs with zero fear.',
    lore: 'Deep space expedition squad #04. While exploring the infinite shadows beneath the sofa of spacetime, all three crew members stood in unison to make first contact with extraterrestrial snacks.',
    stats: {
      power: '3x Smol Synergy',
      vibe: 'Brave & Curious',
      threatLevel: 'Void Navigators',
      originSector: 'Pin #1139621880761999116'
    },
    videoSrc: '/memes/meme-4.mp4',
    posterSrc: '/memes/meme-4.jpg',
    pinUrl: 'https://www.pinterest.com/pin/1139621880761999116/',
    pinId: '1139621880761999116',
    themeColor: '#6e969f',
    accentColor: '#37ed89'
  },
  {
    id: 'meme-5',
    channel: 'CH 05',
    codeName: 'CHAOS RAVE LORD',
    title: 'Interdimensional Groover with the Pearly Whites',
    tagline: 'Straight out of the chroma-key dimension, smiling with terrifying joy.',
    lore: 'An immortal void entity that conquered the green-screen realm. Flashing a brilliant dental showcase while executing hypnotic zero-gravity rhythm moves that defy all laws of physics.',
    stats: {
      power: 'Infinite BPM',
      vibe: 'Pure Unhinged Joy',
      threatLevel: 'Dental Radiance',
      originSector: 'Pin #1084171310329102458'
    },
    videoSrc: '/memes/meme-5.mp4',
    posterSrc: '/memes/meme-5.jpg',
    pinUrl: 'https://www.pinterest.com/pin/1084171310329102458/',
    pinId: '1084171310329102458',
    themeColor: '#37ed89',
    accentColor: '#252820'
  },
  {
    id: 'meme-6',
    channel: 'CH 06',
    codeName: 'THE WORK COMMUTE SHUFFLE',
    title: 'Office-Bound Feline Synchronized Step',
    tagline: 'Grooving to the daily hustle with synchronized paw rhythm.',
    lore: 'A synchronized fleet of career-oriented felines marching toward corporate domination. Equipped with unmatched boogie dynamics and pristine tempo control.',
    stats: {
      power: '8,888 Rhythm',
      vibe: 'Corporate Funk',
      threatLevel: 'Synchronized Groover',
      originSector: 'Pin #917678861601877272'
    },
    videoSrc: '/memes/meme-6.mp4',
    posterSrc: '/memes/meme-6.jpg',
    pinUrl: 'https://www.pinterest.com/pin/917678861601877272/',
    pinId: '917678861601877272',
    themeColor: '#38bdf8',
    accentColor: '#fb7185'
  },
  {
    id: 'meme-7',
    channel: 'CH 07',
    codeName: 'NEIGHBORHOOD DRAMA QUEEN',
    title: 'Full Dramatic Hand Gestures & Gossip Tea',
    tagline: 'Explaining all the sector drama with Oscar-worthy paw dramatics.',
    lore: 'Intercepted from the high-drama sector. Delivering urgent neighborhood intelligence with expressive theatrical paws, wide eyes, and unmatched storytelling cadence.',
    stats: {
      power: '100% Spill The Tea',
      vibe: 'Gossip Master',
      threatLevel: 'Theatrical Expressive',
      originSector: 'Pin #717761259410318687'
    },
    videoSrc: '/memes/meme-7.mp4',
    posterSrc: '/memes/meme-7.jpg',
    pinUrl: 'https://www.pinterest.com/pin/717761259410318687/',
    pinId: '717761259410318687',
    themeColor: '#f472b6',
    accentColor: '#facc15'
  },
  {
    id: 'meme-8',
    channel: 'CH 08',
    codeName: 'HYPER-CHONK DANCE SENSATION',
    title: 'Unstoppable Low-Frequency Boogie',
    tagline: 'Bouncing through spacetime with unstoppable rhythmic inertia.',
    lore: 'A legendary high-density feline groover vibrating across acoustic frequencies. Every bounce generates miniature gravitational waves felt across five star clusters.',
    stats: {
      power: '9,500 Bass Pulse',
      vibe: 'Heavy Bounce',
      threatLevel: 'Rhythm Overload',
      originSector: 'Pin #1076360379679663816'
    },
    videoSrc: '/memes/meme-8.mp4',
    posterSrc: '/memes/meme-8.jpg',
    pinUrl: 'https://www.pinterest.com/pin/1076360379679663816/',
    pinId: '1076360379679663816',
    themeColor: '#a78bfa',
    accentColor: '#4ade80'
  },
  {
    id: 'meme-9',
    channel: 'CH 09',
    codeName: 'THE ROARING LAUGHTER',
    title: 'Sub-Orbital Cackle & Open-Mouth Joy',
    tagline: 'When the joke is simply too funny to maintain composure.',
    lore: 'A feline whose humor sensors reached critical overload. Captured mid-cackle in the mess hall galley, radiating uncontainable joy across all communicative channels.',
    stats: {
      power: 'Infinite Giggle',
      vibe: 'Hysterical Joy',
      threatLevel: 'Unfiltered Cackle',
      originSector: 'Pin #890586895052784157'
    },
    videoSrc: '/memes/meme-9.mp4',
    posterSrc: '/memes/meme-9.jpg',
    pinUrl: 'https://www.pinterest.com/pin/890586895052784157/',
    pinId: '890586895052784157',
    themeColor: '#fb923c',
    accentColor: '#38bdf8'
  },
  {
    id: 'meme-10',
    channel: 'CH 10',
    codeName: 'COSMIC REALIZATION',
    title: 'The Shocked Melting Epiphany',
    tagline: 'Staring straight into the universe after discovering reality.',
    lore: 'Captured at the exact millisecond of universal enlightenment. With eyes dilating to planetary diameters, this void explorer realized they were on camera all along.',
    stats: {
      power: '4D Shockwave',
      vibe: 'Existential Wonder',
      threatLevel: 'Cosmic Realization',
      originSector: 'Pin #1098315427879074886'
    },
    videoSrc: '/memes/meme-10.mp4',
    posterSrc: '/memes/meme-10.jpg',
    pinUrl: 'https://www.pinterest.com/pin/1098315427879074886/',
    pinId: '1098315427879074886',
    themeColor: '#2dd4bf',
    accentColor: '#f43f5e'
  }
];

deepFreeze(cosmicMemes);
