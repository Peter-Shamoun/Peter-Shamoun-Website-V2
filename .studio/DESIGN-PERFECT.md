# Design: Frutiger Aero, the dive

Replaces `DESIGN-MAXIMAL.md`. Moodboard: `refs/moodboard/1-5`. The maximal build
(`refs/maximal-*.png`) is the anti-reference: cartoon vector art, an OS metaphor, parts side by
side with no depth.

## Product truth (kept from the live site)

Peter Shamoun, AI engineer in San Diego. Sections: About (with his photo), Experience (the jobs
in `content/jobs`, newest first, hidden ones stay hidden), Projects (`content/featured`),
Research (one paper in progress), Games (seven playable games), Contact (email, GitHub,
LinkedIn). There is no résumé file in the repo, so the site links none.

## The one idea

**The page is one dive into a tropical sea.** You start in the air above an atoll, next to a
large glass orb that hangs over the water and shows the island upside down inside it. Scrolling
takes you through the surface and down: the light changes from white sky, to the bright
underside of the waves, to turquoise sand, to sun shafts, to the deep blue where the games glow,
and then you come back up through a school of fish to the surface to say hello.

Each section is a stop on the dive. Content sits on glass plates that float in the water, lit
from above: a bright top specular band, a soft cyan glow along the bottom edge.

Category default it refuses: a desktop/OS imitation, and the centred-card portfolio over a
gradient.

## Page structure

| Stop            | Section    | Photo plate (graded)               | Light                         |
| --------------- | ---------- | ---------------------------------- | ----------------------------- |
| Above the atoll | Hero       | aerial palm coast, reef, cumulus   | noon sun, lens flare, the orb |
| Under the waves | About      | surface seen from below, sparkles  | bright, broken glints         |
| Turquoise sand  | Experience | green turtle over rippled sand     | caustics on the sand          |
| Sun shafts      | Projects   | sunburst through the surface       | god rays                      |
| Open water      | Research   | three dolphins under the surface   | blue, calm                    |
| The deep        | Games      | a fish in shafts of light          | deepest blue, lime glow       |
| Back up         | Contact    | school of fish under the waterline | sky again at the top          |

Plates blend into each other through long gradient seams so the scroll reads as one descent.
A fixed layer of rising bubbles and a caustic shimmer runs under the content below the surface.

## Palette

| Role   | Value     | Where                                     |
| ------ | --------- | ----------------------------------------- |
| Abyss  | `#03235a` | deep sections, text on light glass        |
| Lagoon | `#0a5fa8` | headings on glass, links                  |
| Aqua   | `#18c3e8` | focus ring, glows, rules                  |
| Foam   | `#eafaff` | glass fill, text on dark water            |
| Lime   | `#9be22d` | primary gel button (games), active states |
| Leaf   | `#3c9a12` | lime button edge and text shadow          |
| Sun    | `#fffbe8` | highlights, the flare                     |

Strategy: drenched. The photographs own the colour; UI adds white glass, aqua light and one
lime accent for "play".

## Materials

1. **The orb** (WebGL, `src/components/sea/bubbleGL.js`): a solid glass ball. Each pixel is traced
   through it with Snell's law per colour channel (IOR 1.43 / 1.45 / 1.475), so the atoll shows
   inverted and magnified with a little chromatic fringe; Schlick fresnel reflects the sky; a big
   soft window highlight on top, a hard glint, light pooling in the bottom rim, a halo.
2. **Soap bubbles**: thin-film interference colours on the rim, a lensing touch, a glint.
3. **Glass plates**: white frosted glass (`backdrop-filter: blur saturate`), 1px inner white
   edge, a top specular band (gradient to a hard stop at 42%), a cyan glow inside the bottom
   edge, a soft tinted drop shadow.
4. **Gel buttons**: aqua and lime pills with a white gloss cap on the top half and a bright inner
   glow on the bottom half.

## Type

Segoe UI first (Windows has it), then **Open Sans**, self-hosted (OFL): a humanist sans by Steve
Matteson, who also drew Segoe. Selawik, Microsoft's open Segoe stand-in, was the first pick and
was dropped because it ships without kerning. Display sizes in Light (300), like the Vista and
Windows 7 launch pages; UI and body in Regular and Semibold. Section titles sit straight on the
water in white with a soft pool of deeper blue behind them so they hold up on the brightest light.

## Motion

- Hero: the orb breathes and bobs, its glass ripples, bubbles drift, the photo parallaxes with
  the pointer (WebGL, paused off screen and in hidden tabs).
- Scroll: each plate moves a little slower than the page (CSS scroll-driven animation where
  supported), sections' glass rises in on first view.
- Bubbles rise in the underwater layer; caustics shimmer.
- `prefers-reduced-motion`: the static hero render, no parallax, no loops.
- A pause button in the nav stops every loop on the page and the orb, and is remembered.

## Assets and sources

All photographs are CC0 (Unsplash photos re-hosted on Wikimedia Commons). Full list in
`static/sea/CREDITS.md`. Plates: `design/sea/plates.py`. Hero stills: `design/sea/render-hero.js`
(renders the live shader in Chrome).

## Direction contract

THESIS: the page is one continuous dive; each section is a place in the water, not a window.
Refuses the OS metaphor and the centred card over a gradient.

OWN-WORLD: graded CC0 sea photography; one WebGL glass orb; frosted white plates with a hard top
sheen and a cyan bottom glow; aqua and lime gel pills; Segoe/Open Sans Light at display sizes.

STORY: the visitor meets Peter in the air, follows the light down through his work, plays a game
in the deep, and surfaces at the contact links.

FIRST VIEWPORT: name, one line and two gel buttons top left over the sky; the orb fills the right
half over the reef; the waterline crosses the bottom of the screen; the nav capsule on top.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Finish review (2026-10-19)

Checked at 1440x900, 1920x1080, 768x1024 and 390x844, with WebGL and with reduced motion. All
seven games open, play and close with focus returning to their tile. Lighthouse (mobile):
accessibility 100, SEO 100, best practices 96 (the only failure is the Vercel analytics script,
which 404s when the build is served locally). Lab LCP on Fast 4G with 4x CPU: 1.7 s, CLS 0.
Initial JS 108 kB gzip; the orb's code and its 2400 px texture load after the page is idle.

Verdict: ships. Known limits are in the hand-off report: the orb is a still on devices with
fewer than four cores and on save-data connections, the plates are lazy so a very fast scroll
shows each plate's average colour for a moment, and the Firefox build gets no scroll parallax.
Every raster in `static/sea/` is listed with its source in `static/sea/CREDITS.md`.
