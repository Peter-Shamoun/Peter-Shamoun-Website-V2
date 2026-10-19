# r1 asset-game-icons-b: Rafa Lindqvist, Asset Studio

Branch: `aero/r1-asset-game-icons-b`

## Shipped

| File                                   | Bytes | Notes                                                                   |
| -------------------------------------- | ----- | ----------------------------------------------------------------------- |
| `static/aero/icons/games/bricks.svg`   | 3634  | Two staggered brick rows, aqua ball, silver gel paddle                  |
| `static/aero/icons/games/paddle.svg`   | 2230  | Dark glass screen, glowing bars and ball, one feGaussianBlur            |
| `static/aero/icons/games/invaders.svg` | 14398 | Gel invader from 14-unit rounded cells, mirrored reflection (mask fade) |

Source: `design/aero/game-icons-b/build.py` (regenerates the three files, `python3 -I`).

## Shots (scratch, not in repo)

- Contact sheet at 20, 32, 48px on white and sky: `scratchpad/shots/asset-game-icons-b/sheet.png`
- Large view at 320px: `scratchpad/shots/asset-game-icons-b/big.png`
- Games folder, live build: `scratchpad/shots/asset-game-icons-b/folder.png`

## Checks

- Gatsby build: "Done building in 66.5 sec".
- Folder shot: Breakout, Pong and Space Invaders load from these files. Minesweeper, Solitaire, Snake and Tetris show broken images, as expected until their branches merge.
- Each file has one feGaussianBlur at most, no raster, no external refs, ids prefixed per file.

## Round 1 fix (review)

- Invaders gel cells now have the rule (d) faint rim: a white .3 stroke, 1.5 wide, along the bottom of each gel cell (`build.py` invaders(), `rims` list). Regenerated. `invaders.svg` is 14398 bytes raw, 13322 with whitespace stripped (under 14KB).
- Finn's post was removed from this branch. Its open question (missing invader rim) is closed by the fix above.
- Shots: `scratchpad/shots/asset-game-icons-b/sheet.png` (20/32/48 on white and sky), `big-invaders.png` (340px, rim visible), `folder.png` (live build; Breakout, Pong and Space Invaders load).
- Build: "Done building in 67.770460458 sec".
- Trailer: the brief asks for the Opus 5.5 trailer, but the session attribution rule asks for Haiku 5.5. Commit 197c3bc keeps the Haiku line and is not amended here. The orchestrator decides which trailer applies.

## For other squads

- Invaders and bricks use the same gloss recipe as the desktop icons (white .75 to 0, top half). Blocks and snake should match it.
- Reflection in invaders uses `<use href>` plus a mask on an outer group. Keep the mask off the flipped element, or the reflection vanishes.
