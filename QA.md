# CappyTheDev verification

Checked against the production static build, 20 October 2026.

## Passing checks

- Astro type checking: 0 errors, 0 warnings, 0 hints. Static build creates home, about, custom 404 and sitemap.
- Content tests: all nine advertised package prices match the supplied price sheets; enquiry URLs use the supplied Malaysian phone number and package-specific message.
- Browser regression: 13 checks pass, covering all service/pricing/showcase tabs, arrow-key navigation, WhatsApp destinations, native FAQ disclosure, local video playback and modal cleanup, mobile menu focus trapping, client navigation, reduced motion, no-JavaScript fallback and console errors.
- No horizontal overflow at 360, 390, 600, 768, 1024, 1440 or 1920 pixels.
- Axe WCAG 2 A/AA and WCAG 2.1 AA checks: 0 violations on home, about and both missing-page URL formats at the tested phone viewport.
- Missing URLs with or without trailing slashes return HTTP 404 and the branded recovery page.
- Static audit: 0 failures. Estimated heaviest page about 694 KB, including about 55 KB gzipped JavaScript.
- Earlier throttled mobile measurement: home LCP 912 ms, CLS 0. This is a lab result, not a claim about every connection or device.
- Dependency installation audit after updating to Astro 7.4.1: 0 known vulnerabilities reported.

## Visual review

Independent review rounds identified contrast, small desktop click areas, mobile illustration overlap, joined sentences at responsive line breaks and missing-page routing. Those implementation issues were corrected and the production build and browser tests rerun. The latest independent visual score was 7.46/10 (Design 7.8, Usability 7.6, Creativity 7.1, Content 6.4), before a final increase to small phone labels. The largest remaining improvement is supplying real showcase videos and project context. The final screenshots are in `.shots/final/`; browser check results are in `.shots/functional/`.

## Owner setup

- All three video showcase slots are intentionally labelled placeholders until your own clips are configured in `src/data/showcase.ts`. The supplied sample2 clip is a design reference, not a claimed project.
- The local video picker previews a file on the current device; it does not upload or publish files. Put public videos in `public/videos/`, update the configuration, then rebuild.
- The production domain was not provided. Set `SITE_URL` before publishing; this enables absolute canonical/social URLs and populated sitemap entries. The two remaining audit warnings are the missing canonical URLs while that setting is unset.
- Brand, Miri location and phone number come from the brief and supplied artwork. No client names, testimonials, awards or commercial results were invented.
- Static deployment output is in `dist/`. No public deployment has been made.

## Animation revision verification

The owner requested substantially more animation matching sample2.mp4. The revision adds articulated character rigs, large illustrated hands, animated blue/green colour fields, a service character picker, an energy slider, petting feedback, scroll choreography and animated galleries/contact. New production build: 0 type errors/warnings. The focused motion test passes and records independent tail transformations, working selection, range state, pet feedback and reduced-motion behavior in `.shots/motion/results.json`. All 13 existing browser regression checks also pass, including seven viewport widths, video preview, navigation and zero axe violations. Static audit remains at 0 failures; current page estimate is about 701 KB with 58 KB gzipped JavaScript. Current animation comparison frames are in `.shots/motion/`; the numerical visual scores above describe the earlier, quieter design.

## Live-preview root cause and fix

Inspected the user's existing in-app browser tab rather than relying only on a fresh automated browser. It reported `prefers-reduced-motion: reduce`, with no cat transforms: the old implementation intentionally disabled its GSAP engine. Two other open tabs also still displayed older site versions. Added an explicit, persistent per-site Motion control: system preferences remain the default, while a visitor can opt into the complete experience. Both JavaScript and CSS now use the same effective motion setting. Verified in the actual preview that full mode runs despite the browser's reduced-motion setting; observed changing SVG tail matrices and a scroll-driven hero scale of approximately 2.4. Refreshed the existing preview tabs with full mode enabled.

Additional work: split entrance, scroll and pointer transforms into separate layers; added pronounced cursor parallax, title tilt, reactive service/artwork tilt and a paw follower; made the hero a scroll-controlled, pinned character takeover. Initialisation also runs reliably on a first document load, rather than depending only on Astro's navigation event. `tests/motion-preference.mjs` reproduces the user's 584×811 reduced-motion browser, verifies explicit opt-in, live animation, CSS hand visibility, cursor movement, significant scroll enlargement, persistence, navigation and the ability to disable motion again. Production build and all 13 portfolio regression checks pass; tested pages have zero axe violations.

## Playground screenshot fix

Separated the scroll-animated illustration from the pet button and range controls. Low energy now slows the articulated rig with a slight lean while preserving the cat's proportions. The hand is confined to the illustration area. The range has a permanent Creative energy label, a separate live state and distinct endpoints. Short landscape screens use a two-column composition; the scene only pins when its complete content fits the viewport. Also corrected a 3 px header overflow at 320 px.

`tests/playground-layout.mjs` samples the low/high energy animations for artwork/control collisions at 320×640, 390×844, 584×811, 674×430, 843×537 and 1440×900, and verifies keyboard control, petting feedback and horizontal overflow. All six pass. Existing articulated motion and motion-preference browser checks pass. Screenshots and results: `.shots/playground-fix/`. Confirmed the updated composition in the owner's existing in-app preview with full motion enabled.

## Full-motion Lenis pass

Added the Lenis stylesheet and explicit duration-based smoothing (1.45 s, quartic ease, 0.9 wheel multiplier), synchronized to GSAP's ticker and ScrollTrigger. Touch scrolling uses synchronized inertia. Added reversible SplitText word entrances with accessible heading names, scrolling image parallax, staggered pricing-card entrances, floating cinema characters, magnetic buttons and a fixed reading-progress bar. Existing scene takeovers, cursor parallax, articulated cats and playground controls remain active. Pausing motion restores the original heading markup and stops the smooth-scroll engine.

`tests/immersive-motion.mjs` verifies actual continued scrolling after wheel input, magnetic displacement, word animation, reading progress, visibility across all pricing categories and cleanup. It passes alongside all 13 existing browser checks and the reduced-motion-browser opt-in/persistence check. Evidence: `.shots/immersive/results.json` and `.shots/functional/`.

## Replacement hero animation

Replaced the giant-cat scroll zoom with a multi-stage service-sticker orbit. Cats hop aside at restrained scale; service stickers spring outward, rotate around the central message while counter-rotating their contents, and reveal pawprints. A pink moving type ribbon enters beneath the composition. Small icon loops, the moving colour field and the ticker keep the scene active when scrolling pauses. Mobile uses compact stickers and a smaller orbit. Motion-off and no-JS paths hide the decorative scene and keep the normal hero.

`tests/hero-orbit.mjs` samples three scroll phases at 1440, 390 and 320 px: the old enlargement is absent, new text and stickers remain visible, carousel transforms change, horizontal overflow is absent and service selection works. All 13 portfolio regression checks and the browser reduced-motion opt-in test also pass. Images and results are in `.shots/orbit/`. The prior hero-scale assertion was replaced with an assertion for the new restrained scale and visible orbit.

## Orange mascot

The orange and peek mascots use the same flat SVG illustration system as the developer, resume and chef cats: matching head shape, eyes, whiskers, line weights and palette. The orange cat has a cleaner seated body, two distinct front paws, a cream chest and a smooth curled tail. Head, eyes and tail remain individually animated, including pointer-following pupils. No raster illustration is rendered. The previous generated artwork remains as an unused source asset. Production build passes with zero diagnostics; motion tests verify the native SVG structure and animation. Desktop/mobile screenshots are in `.shots/motion/`.
