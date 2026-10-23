# CappyTheDev: the little studio with big purr-sonality

## Brief
Freelance portfolio for Miri, Sarawak. Convert small-business owners and job seekers into WhatsApp enquiries. Use supplied pricing and service artwork; preserve all nine packages, all add-ons and relevant scope notes. Include owner-configurable videos. No fabricated clients, project results, awards or testimonials.

## Concepts considered
1. Cat-powered playground (identity): a small cast of illustrated cats represents the three services. Signature: choosing a cat switches the service and its pricing. Joyful, approachable. Screenshot: huge headline framed by a laptop cat and an orange cat. Scores originality/fit/feasibility/portability: 4/5/5/2.
2. Miri creative noticeboard (place): local services arranged as little printed notices. Signature: pinned service sheets open to details. Scores 4/4/5/3.
3. Freelancer's desktop (profession): a portfolio of draggable windows. Signature: windows assemble into a workbench. Scores 3/4/4/4.

Selected: cat-powered playground, tied to the supplied cat-themed products and the illustrated pet video. The video establishes flat shapes, large type, character choreography and curved colour fields; the JPG references supply paws, soft olive/cream and cat silhouettes.

## Concept card
Idea: useful creative work, delivered by a friendly cat-powered studio.
Metaphor: a playful little cat club where each service has its own character.
Signature: service cats lean toward the pointer; selection changes the service colour and pricing.
Emotion: warm, cheeky and easy to approach.
Motion verb: perk up, then settle.
Screenshot: enormous purr-sonality type with two expressive cats and a floating made-in-Miri stamp.

## System
Butter #f8e5a7; ink #252820; paper #fbf8ed; olive #5f6943; coral #e88973; sky #bfd8db. Secondary type #55594b. Olive was darkened after measured contrast testing: butter labels 4.67:1 and paper text 5.50:1. Bricolage Grotesque for expressive headings; DM Sans for UI/body; fonts stored locally. Oversized tightly tracked display (0.92 line-height), body 16–18px/1.6. Twelve-column desktop grid, 28–64px outer gutters, mobile single column with deliberate illustrations. Rounded 24px media and pill buttons. Motion uses GSAP's ticker, power3 family and short anticipation; no loading barrier or WebGL needed for flat illustrated references. Reduced motion disables smooth scroll and animation.

## Sections
Hero: full field, centered display with cats in lower corners, supporting copy and clear CTA.
Service picker: three different characters, curved green field; three clickable categories.
Showcase: asymmetric large video stage with selectable tracks and original artwork gallery.
Pricing: tabbed catalogue, three packages per category, add-on receipt strip and complete scope notes.
About: illustrated postcard opposite direct personal introduction and process.
FAQ: clean disclosure rows.
Contact: oversized final invitation, cat and WhatsApp action.
About inner page and a designed missing-page state carry the cat motif.

## Assumptions and owner setup
Brand is CappyTheDev; personal name is not supplied. Phone 0178478597 and Miri, Sarawak are from supplied artwork. No video is supplied as portfolio work: sample2 is design reference only. Showcase remains explicitly labelled preview until owner adds files in src/data/showcase.ts. Production domain is unknown: configure SITE_URL before deployment. Source pricing in png/ takes precedence for exact scope over marketing poster shorthand. No public deployment without confirmation, per the explicitly requested awwwards skill.

## Implementation and verification plan
1. Build Astro static pages and a single content source containing exact packages, WhatsApp message helper and showcase configuration.
2. Compose original SVG cat characters and semantic responsive sections. Optimise supplied artwork as WebP.
3. Add progressive enhancement: keyboard-operable service tabs, pricing updates, video dialog, local preview, mobile navigation, GSAP motion on one clock.
4. Build production output, run interaction tests and axe checks at desktop/mobile, reduced-motion and no-JS paths. Run two visual passes with fresh outside critics, fix observed defects.
5. Deliver local preview, source, content editing instructions, and explicit deployment/video setup notes.

## Animation revision: 20 October 2026
The owner asked for full animation much closer to sample2.mp4. Re-inspected the clip at one-second intervals: key behaviors are oversized perimeter characters, expressive independently moving body parts, pink illustrated hands petting/selecting characters, broad sky/green colour fields with moving curved boundaries, and an interactive energy slider. The revision uses those actual mechanisms rather than only adding entrance fades.

The live Astro website remains the deliverable. GSAP now drives articulated SVG cat rigs (head, eyes, tail, paws, breathing), coordinated hero entrances, four perimeter characters, petting hands and hearts, moving SVG colour fields, a selectable three-character service playground, a real energy range input, scroll-linked scene movement, gallery/pricing entrances, and a springing contact character. Desktop playground has a short scroll-controlled hold; mobile uses a direct unpinned scene. The existing packages, prices, enquiry links and video slots remain functional. New colours: dusty sky #6e969f and bright green #37ed89, derived from the video’s visual vocabulary; sky is darkened sufficiently for both large white headings and small dark labels to meet contrast requirements. Cream/olive/coral details remain in the surrounding portfolio. Text entrances animate position/rotation only, so contrast never drops mid-animation.

All motion uses GSAP's ticker. Character loops pause off screen. Reduced-motion users get still characters and working selectors, range input, pet feedback, and all service content. Navigation cleans up observers, timelines, scroll effects and listeners.

## Replacement hero choreography

The owner requested a different signature animation after viewing the enlarged cats. Replace that zoom with a scroll-driven sticker carousel: the headline tilts away, cats make a small hop and move to the edges, three service stickers spring from the center, then orbit counter-rotating around “Good ideas. Let’s play.” Footprints reveal sequentially and a pink typographic ribbon enters and runs continuously. The existing blue/green field morph carries the scene into services. Mobile uses compact stickers and a smaller orbit. Character scaling stays at or below its resting size. Lenis, the motion opt-in, reduced-motion fallback and existing page interactions remain in place.

## Playful navigation dock

The header is a paper capsule with an ink offset shadow, a paw badge, four pastel service/navigation stickers, an animated star switch for Motion, and a pink arrow inset in the contact button. Hover lifts and tilts the stickers. At 1000 px and below, the navigation becomes a keyboard-accessible pop-out with staggered sticker entrances. The no-JS menu remains visible and wraps naturally. Labels, destinations and the aligned cursor remain unchanged.

## Expressive motion layer

Full motion stays on with no switch, following the owner's updated direction. Scroll velocity adds a brief, bounded sway to gallery cards, the about postcard and contact heading, then settles. Service illustrations bounce independently on an off-screen-paused clock. Interactive clicks emit short star/heart bursts in an aria-hidden, non-interactive overlay; particles are removed on completion and the entire layer is cleaned up on navigation. Pricing amounts hop on hover, decorative package icons spin, the sticker orbit turns through 160 degrees, and the highlighted orbit phrase gently rocks. Footer/FAQ character pupils follow the pointer. All transformations use separate visual layers so the real cursor remains aligned and functional controls retain their layout.

## Premium atelier refinement — October 2026

Brief: increase the sense of craft and confidence while retaining the owner's cat characters, all motion, real showcase videos, three services and supplied prices. No invented awards, clients, results or public demo links.

Concepts considered: a neon arcade (too far from the hand-drawn assets), an editorial gallery (too quiet for the owner's brief), and a playful atelier (chosen: existing cat illustrations become the studio's living cast, while the work gets a dedicated screening room).

Idea: serious creative craft from an unexpectedly playful little studio.
Metaphor: a paper atelier with a softly lit stage and a screening room.
Signature: the existing cat dialogue and scroll-to-sticker carousel, supported by slow orbital linework. Keep the original fast entrance and direct work/pricing links.
Emotion: warm, confident, memorable.
Motion verb: float, spring and settle. Reuse GSAP's shared clock and viewport-paused scene loops.
Screenshot: cream display typography, two speaking cats, a subtly illuminated blue stage; dark cinema gallery below.

System: existing Bricolage display and DM Sans text; paper #fbf8ed, ink #252820, dusty sky #6e969f, butter #f8e5a7, pink #f2b6cb, bright green #37ed89. Cards have ink outlines, small offset shadows and restrained paper surfaces. Maintain light, readable headings rather than low-contrast yellow display text. Type sizes remain fluid.

Composition: hero = poster with peripheral illustration and fine orbit paths; services = numbered tactile triptych (one-column cards on phones); work = dark asymmetric cinema paired with copy, followed by real artwork gallery; pricing = printed package cards; about = personal postcard; FAQ = direct reading layout. Keep private-example enquiries on WhatsApp.

Implementation: studio.css is the final style layer. Orbit animations use sceneLoop and clean up with the existing GSAP context. No new dependencies, external fonts, image downloads, canvas or continuous layout measurements. Phone overrides retain large controls and stacked service cards. Removed the proposed yellow heading treatment during source review to preserve contrast.

Validation limitation: local browser access was previously denied by tool URL policy, so this pass cannot claim screenshot-based QA, measured FPS or visual award scores. Run Astro diagnostics, a production build, the existing unit suite, and static markup/style review; production browser/mobile QA is still outstanding.

## Studio extras

Added an interactive moodboard after the existing cat playground: three named palettes change its colours, accents and typography; selection updates aria-pressed and a polite status caption. All palette changes are local to this illustrative moodboard, so package readability and the rest of the site stay stable. A hand-drawn cat, rotating flower and springing sticker give it life. Timelines use the existing sceneLoop and context cleanup. Added a seamless pink ribbon and a pettable cinema cat with a small greeting response. No fake client work, testimonials, numbers, or new external assets. Verified Astro diagnostics and production output plus the existing 8 unit tests; browser visual and interaction QA remains outstanding under the earlier local-access restriction.

## Living-poster hero rebuild

Owner direction: a much stronger, more creative hero, retaining the established cats and all existing motion. The concept is now Cappy's living poster: a cream browser-framed canvas with a fine drawing grid, oversized ink typography, an italic serif counterpoint, and a lime paper-highlighted purr-sonality headline. A taped price ticket is a real package link. Pink and blue paper sets place the cats in the scene rather than leaving them against an empty field. Existing satellites, petting hand, dialogue cycling, cursor depth and scroll-to-sticker sequence remain.

Signature interaction: a rotating circular good-vibes control springs both cats upward. Its reusable paused GSAP timeline targets new hero-wiggle wrappers, so it cannot overwrite the cursor rig or entrance transforms. The control has a real button, keyboard focus and polite click status; no audio, loader, fake awards or waiting gate. Ring/star idle loops pause off screen through sceneLoop. Typography uses the already-bundled Bricolage plus the platform Georgia font. No new packages or remote assets.

Composition safeguards: viewport-height-aware desktop type; separate 801–1000px header accommodation; 820px portrait composition with compact utility/footer details, two speech bubbles and a smaller good-vibes button. All three enquiry/work shortcuts remain. Sources and production markup were reviewed for shared animation targets and duplicate IDs. Astro check/build and the existing eight tests pass. No browser visual, real FPS or award-score claim: local browser access remains restricted by the previous tool-policy refusal. Mobile/desktop screenshot QA is still required.

## Creative-universe scroll scene

Replaced the simple icon carousel with a night-time solar-system scene: ink ground, restrained atmospheric gradients, three fine elliptical orbit paths, point stars, a large cream/serif-pink centre statement, and three illustrated service planets. Each planet has its own existing cat artwork, category index and real starting price. The centre stays upright. Desktop cards follow actual ellipse coordinates through one scroll-controlled turn instead of rotating a large parent and counter-rotating all children. Separate phone choreography keeps three cards in reading order below the title, with bounded rocking motion. Corner metadata and a slimmer pink ribbon frame the composition.

Performance: the layout function is pure; geometry is read on resize/ScrollTrigger refresh, and render updates use cached GSAP quick setters. Cat articulation and star loops reuse the existing viewport-paused observer. No WebGL, new fonts, new dependencies or remote assets. Added two geometry regressions for bounded desktop paths and mobile reading order; all ten tests pass. Dev server logs return HTTP 200 after imports. Production build and markup checks pass; browser visual QA remains outstanding under the earlier browser access restriction.

## Video-inspired Cappy welcome intro

Reference inspected directly: extracted a 4 fps contact sheet of the first six seconds of sample2/sample2.mp4 (.shots/preloader-reference/opening.jpg). The footage starts with a blue stage, four perimeter characters, a central wordmark, pink hand petting, then oversized characters sweeping through a green wave into the page. This is an animated website entrance rather than a percentage loader. Recreated that choreography with the existing four Cappy SVG variants and the corrected hand; no video download, new bitmap assets, dependencies or audio.

Timing: approximately 3.7 seconds plus a maximum 300ms local-font budget. Brand and cats spring in, hand pets the orange cat, eyes blink, characters sweep in and the green field grows. Blue and pink curtains lift while the actual hero entrance starts underneath. The first unanchored home visit plays once per session; pricing/work deep links and inner pages bypass it. ?intro=1 explicitly replays it. Skip stays usable throughout; Escape also skips. Content is not gated on showcase videos or external resources.

Integration: tiny head bootstrap opts in before paint, stylesheet hides the intro by default, no-JS visitors get the real site. A separate 6.5-second head-script watchdog clears scroll/inert locks if the animation bundle fails. Focus is contained while the intro is up and restored to main on exit. Storage failures fall back to an in-memory marker. Cleanup on Astro swaps cancels the old entrance; mount generations prevent a delayed reveal from mounting a stale page. Preloader characters are excluded from the main scene's cat rig setup so timelines do not fight during the handoff.

Verification: five new tests exercise first/repeat/deep-link/replay policy, bootstrap parity, unavailable storage, watchdog release, pre-font Skip, focus/inert preservation, idempotent cleanup, Escape and the fail-safe event. These controller tests use a simulated DOM and do not claim visual rendering coverage. All 15 tests pass, Astro diagnostics and production build pass, and the dev server log returns HTTP 200. Browser visual/timing QA remains outstanding under the earlier browser access restriction.

## Desktop intro correction

The owner rejected the first splash composition. Repositioned and resized the desktop cast to show faces instead of cropping most of them at the viewport edge; the chef stays upright rather than entering upside down. Mobile has a separate staggered composition, with the two side cats above and below the wordmark. The brand now reveals in typographic groups with a drawn underline and subtle orbital stage lines. Added finite head/tail reactions. Replaced the 2.5x character pile-up with bounded outward exits, a gentle developer-cat lift and a sweeping green/blue/pink handoff.

Playback preference updated: every fresh unanchored homepage load replays on desktop and phone. Document memory prevents repetition during internal Astro navigation; session storage no longer suppresses a refresh. Explicit replay and direct section-link bypass remain. A new test covers desktop/phone playback in the presence of a legacy stored marker. All 16 tests pass; visual browser review is still unavailable under the earlier local-browser policy restriction.

## Cat-mouth portal entrance

Replaced the curtain exit with the owner's requested mouth-camera transition. Only the preloader's developer cat receives an optional open-mouth SVG layer. Its normal mouth fades into a cream-outlined dark opening with a pink tongue. After the petting beat, the other cats leave, the developer cat's actual SVG mouth point is measured once, and a camera wrapper centres and enlarges it until the mouth fills every viewport corner. The tongue recedes during the dive. A matching ink SVG mask then expands a transparent opening onto the real homepage while the hero entrance runs underneath. No page screenshot or duplicate homepage is used.

The responsive camera uses the source SVG mouth coordinate (183,205) and measured mouth radius, with getScreenCTM and a bounds fallback. No per-frame layout reads. Added pure geometry regressions for phone, tablet, desktop, complete corner coverage, and a zero-radius fallback; all 18 tests and the production build pass. Skip/Escape, fail-open watchdog, focus restoration and fresh-load playback remain. Final sequence is roughly 4.1 seconds plus the existing bounded font wait. Visual browser confirmation is still outstanding under the earlier local-access restriction.

### Anchored mouth camera refinement
The developer cat stays in its settled position. The entire intro scene uses a single camera transform around the measured SVG mouth, with a continuous eased logarithmic zoom and an earlier settling pan. Cream fangs and small teeth frame a clear dark cavity; the tongue remains visible near the lower lip. A short open-mouth anticipation precedes the dive, then a matching ink mask reveals the real homepage. Skip and navigation restore the scene transform. Geometry tests cover phone and desktop travel, monotonic scale and gentle endpoint velocity. Local browser visual review remains unavailable under the existing browser restriction.

### Full-bleed intro correction
The screenshot exposed an edge of the transformed backdrop during the early pan. The curtain is now an untransformed full-viewport cream backdrop; only its transparent world child receives camera transforms. Removed the pink underlay and bounded green landscape so no moving rectangle or landscape edge can appear. Mobile isolates the developer cat as the focal character; desktop retains peripheral cats. Refined the wordmark, serif supporting line, coral accents, cat halo and organic mouth silhouette. The mouth dive and iris reveal remain skippable.

### Mouth entrance polish
Kept the developer cat anchored in its settled scene position and refined the world camera into a gentle aim followed by the deeper mouth push. Quintic camera phases join with continuous position and velocity; the initial aim keeps the cat readable at 1.65x. Added rounded paired fangs, separate little front teeth, bottom teeth and a creased pink tongue inside an organic mouth outline. Teeth appear as the mouth opens, with a short anticipation before travel. The ink-to-home iris now starts at the camera handoff without a black hold. All 19 tests and the production build pass; the added regression samples desktop and phone travel, monotonic zoom and phase continuity. Browser visual verification remains unavailable under the existing access restriction.

### Preloader removed
Owner requested removal of the complete preload experience. Removed the splash components, head bootstrap, stylesheet, controller, camera geometry and their obsolete tests. Page scripts mount immediately again, including when an old ?intro=1 URL is opened. Regular homepage animations and font resource hints remain.
