# r1 shell-window: Wren Tanaka (Shell Squad)

Branch `aero/r1-shell-window`. Files: `src/styles/windowStyles.js`, `src/components/desktop/icons/glyphs.js`.
`Window.js` is unchanged (its `<GlyphClose />` call works as is).

## Shots (all in the scratchpad, shots/shell-window/)

- `two.png`: Games active (glass, red close, glowing title), About inactive (clear, greyed close, muted title).
- `hover.png`: the active close button hanging from the top edge, glow on hover.
- `zoom-hover.png`: 3x crop of the same corner, so the 8px radius and the hanging tab can be checked.
- `game.png`: Minesweeper inside its frame, no clipping, grid sits flush with the body edge.
- `phone.png` (390x844): full screen, square corners, inset 1px glass line, 16px close glyph.

Wallpaper and game icons are still the old XP assets in this worktree, so the glass reads
lighter than it will with the aurora wallpaper. Judge the tint again after the wallpaper lands.

## The +20 arithmetic (registry.js game windows are `size.w + 20`)

Horizontal chrome outside the game area: glass border 1px x 2 = 2, frame `--frame` 6px x 2 = 12,
body field border 1px x 2 = 2. Total 16. Area padding 2px x 2 = 4. 16 + 4 = 20, so the game is
exactly its natural width. The `.win` box is `border-box`, so `width` includes the borders.
`.win--game .win__body` has `padding: 0` and no extra edge.

## Differences from section 6

- Close glyph is 12px (16px on phones), as the brief says. The area padding for games is 2px,
  not the 4px section 6 gives. The section 6 figure predates the 1px body edge.
- The title is `--text-on-glass` in both states. Only the inactive window changes it to `--text-muted`
  at 0.8 opacity.
- `focusRing` is imported but not used; the close button has its own `:focus-visible` (2px focus,
  1px offset), as specified. Lint is clean with the import removed.
- Phone and short landscape both get `border-radius: 0` and an inset `--glass-hi` line. The `.win`
  selectors are `.win, .win:not(.is-active)`, so the inactive shadow cannot win on phones.
- `kit.js` `FRAME` and `AREA_PAD` are not touched (not my files). Check that the game still
  measures 8 vertically at 1440x900 and 1280x720 (`FRAME` = bottom frame 6 + body edge 2).

## For other squads

- `GlyphApp` and `GlyphMenu` still use the pixel path (their removal is cleanup).
- `windowStyles.js` no longer imports `bevel`, `sunken`, `retroScrollbar`, so nothing else in
  that file depends on the legacy names.

## Open questions for Mira

- Is the active/inactive gap strong enough? The difference is clear in `two.png`, but it mostly
  comes from the shadow and tint, which the real wallpaper will change.
- Should the phone window keep its 1px glass edge at the screen border? It is there because of
  the `glass` mixin. Removing it would need an override on phones only.
