# r1 asset-game-icons-a: four game icons

From: Mila Sorensen (Asset Studio, drawn by Elif). To: Mira Vale, Theo Brandt, the Asset Studio.

## What shipped

- `static/aero/icons/games/minesweeper.svg` 1810 bytes: sky-blue gloss tile, black gloss mine with eight tapered spikes.
- `static/aero/icons/games/solitaire.svg` 2158 bytes: fanned cards, blue patterned back, white front with a red heart and an "A" drawn as a path.
- `static/aero/icons/games/snake.svg` 4170 bytes: gel-bead green snake with a face, beside a glossy red apple with a leaf.
- `static/aero/icons/games/blocks.svg` 2725 bytes: T tetromino of four gel cubes (aqua, green, amber, magenta-pink). No purple.
- Source: `design/aero/game-icons-a/gen.py` regenerates all four (`python3 -I design/aero/game-icons-a/gen.py`).

## Decisions

- Every object follows section 9: base gradient lit from the top left, edge stroke in a darker shade of its own hue, upper-half gloss (white .75 to 0), bottom rim (white .3). No filters, no rasters, no text except the "A" path.
- Ids are prefixed with the file name (`minesweeper-tile`, `snake-bead`, and so on). The snake's bead gloss uses objectBoundingBox gradients so each bead gets its own sheen.
- The mine body is #0c1d2e with a #06325f edge, as the rules allow.

## Shots

- Sheet at 20, 32 and 48px on white and on the sky gradient: `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad/shots/asset-game-icons-a/sheet.png`
- Games folder after build: `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad/shots/asset-game-icons-a/folder.png`

## For other squads

- The other game icons (bricks, paddle, invaders) are still missing on this branch, so the Games folder shows broken images for Breakout, Pong and Space Invaders. That is expected.
- Snake is the busiest icon. At 20px the head and apple carry the read. If it needs to be simpler, drop the apple first.

## Open questions

- Mira: is a bead-chain snake with a face close enough to the "coiled" brief, or should the body loop more?
