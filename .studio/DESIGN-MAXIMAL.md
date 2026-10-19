# Design: Frutiger Aero, maximal

Replaces `.studio/DESIGN.md` (round 1, the Vista reskin). Moodboard: `refs/moodboard/1-5`.

## The one idea

**Peter's world lives inside a glass globe on a meadow, and you play it like a media player.**

A giant glass globe sits half-sunk in bright grass under a deep blue sky. Inside it the
waterline cuts the world in two: a sunny island above, an aquarium below with goldfish and
clownfish swimming laps and bubbles rising. The six sections float around the globe as soap
bubbles with glossy icons inside. Tap one and it pops; its glass pane slides up. At the bottom a
chrome-and-candy media player called the Aero Deck runs the place: its LCD shows the section you
are on and the time in seven-segment digits, the transport buttons step through sections, and its
playlist (the orb) lists everything. The seven games stand on two lime acrylic shelves under
hanging ivy, like cartridges in a 2007 bedroom.

Every reference in the moodboard maps to an object on screen: the bubble-globe world (1), the
aquarium room with ivy and lime acrylic (2), the glossy media player with an LCD and water
everywhere (3, 4, 5), the goldfish and clownfish (3, 4), the glass butterfly (5).

Category default it refuses: a centred hero card or a desktop with a column of icons over a
gradient.

## Palette (tokens in `src/styles/variables.js`)

| Role         | Value                      | Where                                     |
| ------------ | -------------------------- | ----------------------------------------- |
| Abyss        | `#04225e`                  | top of the sky, deck shadow, LCD glass    |
| Sky          | `#1b74dc`                  | sky body, links                           |
| Horizon      | `#c7ecff`                  | haze at the horizon, glass highlights     |
| Aqua         | `#18c3e8`                  | water, deck body, focus ring              |
| Lagoon       | `#0089b8`                  | headings on glass, deep water             |
| Lime acrylic | `#b8ff2e` (glow `#7dff00`) | shelves, the active track, primary accent |
| Leaf         | `#2f9e1a`                  | grass shadow, ivy                         |
| Goldfish     | `#ff7a12`                  | fish, the one warm note, LCD alarm        |
| Chrome       | `#f4f8fb` to `#7f95aa`     | bezels, rings, buttons                    |
| LCD          | `#b8f4ff` on `#06324f`     | readouts                                  |
| Candy red    | `#ec2f3b`                  | close buttons only                        |

Strategy: full palette. Blue and green own the whole surface; lime is the accent that says "you
can press this"; orange appears only on fish.

## Materials

1. **Glass**: globe and panes. Thick: a bright rim (fresnel), a curved white specular streak top
   left, a faint cyan inner edge, caustic light inside. Panes carry a water caustic texture in
   their header.
2. **Soap film**: section bubbles. Clear centre, iridescent cyan to magenta to gold rim, one hard
   highlight and one soft one.
3. **Chrome**: the deck bezel and the globe's ring. Strong horizontal banding (light, dark, light),
   a hard horizon line.
4. **Candy plastic**: deck body and buttons. Saturated aqua with a big white gloss cap on the top
   half and a glow in the bottom half.
5. **Lime acrylic**: shelves. Translucent lime with a glowing edge and a reflected glow on the
   wall behind.
6. **LCD**: dark blue-green glass with ghost segments and bright cyan lit segments.

## Type

- Display and gadget labels: **Nunito** (OFL, self-hosted), weights 800/900. Rounded terminals
  read as toy plastic, like the gadget skins of the time.
- Body and UI: **Open Sans** (already self-hosted). Humanist, drawn by Segoe's designer.
- Readouts: seven-segment digits drawn as SVG (`SevenSeg`), not a font.

## Motion

- Fish swim laps inside the globe (CSS transforms on SVG sprites), bubbles rise in the globe,
  caustics drift, section bubbles bob, sparkles twinkle, the butterfly flaps.
- Pop: the bubble scales up, thins out and bursts into droplets (opacity and transform only);
  the pane rises from the bubble's position.
- Pointer parallax on desktop: sky, globe and foreground move at different rates.
- `prefers-reduced-motion: reduce`: everything holds a composed still frame; no bob, no swim,
  no parallax, panes appear without travel.

## Layout

- 1440 and wider: name top left, bubbles in a loose cluster down the left, globe centre right on
  the horizon, shelves and ivy at the right edge, deck centred at the bottom, grass blades in
  front of the deck.
- 390: name, globe (smaller, top), the six bubbles as a 3 by 2 grid of 96px targets, the deck
  docked at the bottom. The shelves fold into the Games pane. Panes open as full-width sheets.

## Assets (all in `static/aero/`)

| Asset                               | How                                                                                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `scene/plate-*.webp/jpg`            | Sky photo (CC0) graded deep blue, perspective-mapped grass photo (CC0) for the meadow, rendered sun and flare. Python/Pillow/numpy, `design/aero/maximal/plate.py` |
| `scene/globe-*.webp/png`            | Glass globe shell, island and underwater world, chrome base ring. Rendered from SVG via headless Chrome, `design/aero/maximal/globe.html`                          |
| `scene/ivy.svg`, `scene/blades.svg` | Procedural SVG from Python                                                                                                                                         |
| fish, bubbles, butterfly, sparkles  | Inline SVG components, `src/components/aero/art.js`                                                                                                                |
| Section icons                       | Round-1 glossy icons, kept (they hold up)                                                                                                                          |
| Game icons                          | Round-1 glossy icons, kept                                                                                                                                         |

Downloaded sources and licences: `static/aero/CREDITS.md`.
