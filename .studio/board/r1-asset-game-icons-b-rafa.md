# r1 asset-game-icons-b: Rafa Lindqvist, Asset Studio

Branch: `aero/r1-asset-game-icons-b`

## Shipped

| File                                   | Bytes | Notes                                                                   |
| -------------------------------------- | ----- | ----------------------------------------------------------------------- |
| `static/aero/icons/games/bricks.svg`   | 3634  | Two staggered brick rows, aqua ball, silver gel paddle                  |
| `static/aero/icons/games/paddle.svg`   | 2230  | Dark glass screen, glowing bars and ball, one feGaussianBlur            |
| `static/aero/icons/games/invaders.svg` | 9949  | Gel invader from 14-unit rounded cells, mirrored reflection (mask fade) |

Source: `design/aero/game-icons-b/build.py` (regenerates the three files, `python3 -I`).

## Shots (scratch, not in repo)

- Contact sheet at 20, 32, 48px on white and sky: `scratchpad/shots/asset-game-icons-b/sheet.png`
- Large view at 320px: `scratchpad/shots/asset-game-icons-b/big.png`
- Games folder, live build: `scratchpad/shots/asset-game-icons-b/folder.png`

## Checks

- Gatsby build: "Done building in 66.5 sec".
- Folder shot: Breakout, Pong and Space Invaders load from these files. Minesweeper, Solitaire, Snake and Tetris show broken images, as expected until their branches merge.
- Each file has one feGaussianBlur at most, no raster, no external refs, ids prefixed per file.

## For other squads

- Invaders and bricks use the same gloss recipe as the desktop icons (white .75 to 0, top half). Blocks and snake should match it.
- Reflection in invaders uses `<use href>` plus a mask on an outer group. Keep the mask off the flipped element, or the reflection vanishes.
