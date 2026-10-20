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
