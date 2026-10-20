# CappyTheDev

A playful, responsive freelance portfolio built with Astro, TypeScript, GSAP and Lenis. Original SVG cats, local fonts, real supplied pricing, WhatsApp enquiries and configurable video showcases.

The animation revision follows the supplied pet-playlist reference: articulated cat rigs, oversized illustrated petting hands, moving blue/green waves, a selectable service cast and an interactive energy slider. Desktop includes a short scroll-controlled playground scene; phone layouts use unpinned scenes. Full motion is always enabled as requested by the owner. Motion code is in `src/scripts/choreography.ts`, with its visual system in `src/styles/motion.css`.

The Motion switch has been removed. Animation, cursor effects and Lenis smooth scrolling stay on automatically, ignoring old saved off preferences. Browser/system settings themselves are unchanged. `node tests/motion-preference.mjs` verifies that full motion remains active with a reduced-motion browser, an old saved preference and reloads.

## Run

```sh
npm install
npm run dev
```

Production:

```sh
npm run build
npm run preview
```

The production preview is http://localhost:4400. Static files are generated in `dist/` and can be hosted on Netlify, Vercel, Cloudflare Pages or any static host. Build command: `npm run build`. Output directory: `dist`. No server or database is required.

## Add your showcase videos

1. Put MP4 (H.264 recommended) or WebM files in `public/videos/`.
2. Open `src/data/showcase.ts`.
3. Set the matching `src`, for example `src: '/videos/my-website-showcase.mp4'`.
4. Set `placeholder: false`, edit the title/description and optionally replace the poster with an image of your work.
5. Rebuild. The illustrated placeholder becomes a working video play button and accessible player dialog.

The “Preview your video here” button lets you try a local file. It does not upload, save or publish the video. The supplied sample2 video is only a design reference and is never presented as portfolio work.

## Edit services, pricing and contact

All packages and add-ons are in `src/data/site.mjs`. The nine prices and scope come from the supplied `png/` price sheets, supplemented by `poster/` artwork. `enquiryUrl` generates WhatsApp messages using 60178478597. Original optimised artwork lives in `public/artwork/`. The included service artwork is labelled as service artwork, not invented client projects.

## Before publishing

Set the environment variable `SITE_URL` to your real HTTPS domain (for example `https://your-domain.com`) before building. This enables absolute canonical URLs, social image URLs and the sitemap. A domain was not supplied, so none is invented. Add `Sitemap: https://your-domain.com/sitemap.xml` to `public/robots.txt` once known. Review your contact number and replace the empty showcase videos. Local fonts are Bricolage Grotesque and DM Sans from Google Fonts, distributed under the SIL Open Font License; licenses are in `public/fonts/`.

## Verify

```sh
npm test
npm run build
```

With the production preview running, `node tests/motion.mjs` checks independent tail movement, character selection, the energy slider, petting and reduced motion. `node tests/browser.mjs` checks the rest of the portfolio.

Design decisions and reference interpretation are recorded in `DESIGN.md`. Browser QA checks desktop, phone, keyboard navigation, service switching, enquiry links, video previews, reduced motion and accessibility. There is no public deployment in this folder until a hosting destination is selected.

