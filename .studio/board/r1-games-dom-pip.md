# r1 games-dom: Pip Asante, Games Squad

Task: games kit chrome, new COLORS, Minesweeper and Solitaire skins. Branch `aero/r1-games-dom`.

## What changed

- `kit.js`: COLORS holds the 16 Aero values with the same keys (purple is now magenta-pink).
  StageInner uses `--game-bg` and 14px type. Bar is a white gloss strip. Readout is a dark glass
  LCD. Caption and Hint are 13px `--text-muted`. Btn uses `gloss`, `glossPressed` and `focusRing`.
  Well uses `field` with a radius of 4px. The veil is `rgba(6, 40, 80, .35)`. Message uses
  `glass` with the backdrop-filter forced to none and the solid tint, and its title gets
  `--title-glow`. FRAME, AREA_PAD, MARGIN, MAX_SCALE, hooks and Stage logic are untouched.
- `Minesweeper.js`: unopened cells are glossy sky-blue tiles with a hover brightness. Opened
  cells are flat `#eef4fa` with a `#c5d4e2` grid line. Mine and flag re-coloured to the
  palette, and their `crispEdges` removed. A hit cell stays red.
- `Solitaire.js`: felt is the radial green gradient. Cards are white with a 6px radius and the
  shadow token as the edge. Card backs are blue with a white gloss top half, a diagonal
  pattern and a 3px white frame. Empty slots are translucent.

No gameplay, rules, timing, input, scoring, sizes, data-\* or aria attributes changed. eslint is
clean on the three files. The build passes.

## Shots (`scratchpad/shots/games-dom/`)

- `mines.png`: Minesweeper, desktop 1440x900
- `mines-open.png`: Minesweeper with cells opened
- `solitaire.png`: Solitaire, desktop
- `mines-phone.png`: Minesweeper, phone 390x844

The window chrome is still XP on this branch, and the wallpaper and icons 404 until the assets
merge. That is expected.

## Could not restyle cheaply, or open questions

- Solitaire suit pips are still the pixel-square paths from the XP version. They read as
  pixel art on the new cards. A proper drawn suit set would be an asset task (Mira to decide).
- DIGIT_COLORS[8] is `COLORS.shadow` (#9fb3c6), which is low contrast on the pale opened cells.
  The brief said to keep the number colours, so I left it. Mira or Theo may want `navy` for 8.
- Minesweeper tile gloss is subtle at 1x. It reads at phone size. Stronger gloss would need a
  larger tile, which is a size change, so I did not make one.
