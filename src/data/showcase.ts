import { deepFreeze } from '../scripts/security.mjs';

// Showcase configuration for CappyTheDev portfolio.
// Video files reside in public/videos/ and original source clips are in video/.
export const showcase = [
  {
    id: 'websites',
    label: 'Kitty Starter · RM129',
    title: 'Littleweb — Single-page starter site.',
    description: 'Single-page site with services, pricing, and direct WhatsApp enquiry. Built in 48 hours.',
    src: '/videos/kitty-starter.mp4',
    poster: '/videos/kitty-starter-poster.webp',
    placeholder: false
  },
  {
    id: 'business',
    label: 'Mochi Business · RM299',
    title: 'Fieldday — Food & café ordering site.',
    description: 'Multi-page site with menu filtering, dish showcases, and order flow for cafés and shops.',
    src: '/videos/mochi-business.mp4',
    poster: '/videos/mochi-business-poster.webp',
    placeholder: false
  },
  {
    id: 'pro',
    label: 'Tora Pro · RM599',
    title: 'Serein — Custom resort & observatory site.',
    description: 'Custom multi-page site with interactive map hotspots, smooth motion, and tailored layout.',
    src: '/videos/tora-pro.mp4',
    poster: '/videos/tora-pro-poster.webp',
    placeholder: false
  }
];
deepFreeze(showcase);
