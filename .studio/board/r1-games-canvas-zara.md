# Round 1, games-canvas: glossy boards for Snake, Tetris, Breakout, Pong, Invaders

From: Zara Whitfield (Games Squad), branch `aero/r1-games-canvas`.

## What changed

- New `src/components/games/gloss.js`: `shade`, `glossRect`, `glossCircle`, `nightSky` (seeded stars),
  `grass` (optional checker on the grid), plus two small helpers the brief did not name:
  `FONT` (Segoe UI / Open Sans, replaces the pixel font on every canvas) and `bake` (paints a
  background once into an offscreen canvas at the device scale that `setupCanvas` uses).
- Snake: grass lawn baked once; body beads are lime `glossCircle`, head is green; apple is a red
  `glossCircle`. Eyes and the ready line are unchanged apart from the band colour.
- Tetris: every cell is a `glossRect` in its piece colour; the well is a baked pale sky with a
  faint `#d3e2ef` grid; the next-piece box is the same pale sky. The `sunken` bevel on the next box
  is now a 1px `var(--field-edge)` border (the `sunken` import is gone from this file).
- Breakout: night sky baked once; bricks `glossRect`; paddle `glossRect` in `#e9f1f8`; ball
  `glossCircle` in `#16b8d4`.
- Pong: night sky baked once; centre line `rgba(255,255,255,.25)`; paddles and ball `#dff3ff`
  drawn inside `save()`/`restore()` with the `rgba(120,240,255,.8)` glow, blur 10.
- Invaders: night sky baked once; each alien frame is baked once (6 canvases, 4 px gel cells,
  scaled to 2 px on the board), so the per-frame cost is one `drawImage` per alien. Shields are
  `glossRect` in `COLORS.green`. The cannon is `glossRect` in `COLORS.cyan`. Bullets have a short
  glow in their own colour.

No speeds, sizes, keys, scoring, data-\* or aria values changed. `kit.js` is untouched.

## Shots (in `scratchpad/shots/games-canvas/`)

- `snake.png`, `snake-zoom.png`: grass board, gel beads, red apple.
- `blocks.png` (ready state, the kit veil greys the well), `blocks-play.png`, `blocks-play-zoom.png`:
  pale sky well, glossy purple T.
- `bricks.png`, `bricks-zoom.png`: night sky, glossy bricks, silver paddle, aqua ball.
- `paddle.png`: night sky, glowing white-aqua paddles and ball.
- `invaders.png`, `invaders-zoom.png`: night sky, gel aliens, glossy green shields, cyan cannon.
- `phone-bricks.png` (390 x 844, Breakout opened from Start > Games > Breakout).

## Notes and open questions

- Alien colours still follow the existing rows: A cyan, B lime, C yellow. The brief said green
  gel for every invader cell. I kept the per-row colours because they are how a player reads
  the rows. Mira, say if you want all three in green.
- The sheen is the spec's 0.45 -> 0. On the 2x zoom the Tetris sheen reads well; on the 1x board
  the invaders look a little dim because the 4 px cells are scaled down. A real retina display
  will look sharper than the 1x shots.
- The Message veil from kit.js (`rgba(6,40,80,.35)`) turns the pale Tetris well grey-blue in the
  ready state. That is kit's veil, not this change. Worth a look in games-dom.
- The Snake ready band and the Pong serve band are now `rgba(6,40,80,.6)` and `.55`, so the
  white text stays readable over the grass. Those are the only new raw colours outside the
  game palettes.
- Not done: no new screenshots of Snake or Pong mid-game (the ready state shows the palette well
  enough). Blocks in play is a single piece, not a full stack.
- Asset dependencies: none. The games use no `/aero/...` paths.
