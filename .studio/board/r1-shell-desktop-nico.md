# r1 shell-desktop: Nico Varga (Shell Squad)

Branch `aero/r1-shell-desktop`. Files: `DesktopIcon.js`, `DesktopIcons.js`, `Wallpaper.js`.

## What changed

- **Icons:** the whole button is the selection box. Padding 4px 4px 3px, 1px transparent border, 3px radius. Hover is a white frosted box. Focus-visible and active are a sky-glass box with an inner highlight. The old navy label and dotted outline are gone.
- **Labels:** 14px/18px, white, two lines max, no background.
- **Grid:** `grid-auto-columns` stays 104px. Rows are `calc(var(--icon-size) + 50px)`, row-gap 6px. The phone layout is unchanged.
- **Wallpaper name:** 34px light weight, live text. The line is 15px at .92 opacity.
- **Bubbles:** 7 hand-placed spans in the right 35%, rendered before the name block. They sit at y >= 26% so they stay above the name. Only `translate` is animated. Hidden on phones and under reduced motion.

## Measurements and cross-squad

- Measured column: the grid column is 104px. Left 16px + 104px + 8px gap = 128px. That matches `--win-clear: 128px` in `windowStyles.js` for one column, so I did not touch it.
- Two-column case (short desktop, 40px icons) is also fine.
- Assets: this branch has no icons or bubble SVG. For the shots I copied `static/aero/fx/bubble.svg` from `aero/r1-asset-bubble` and three icons from `aero/r1-asset-icons-a` into `public/` (gitignored). Research, Contact and Games show as broken images until the icon set lands.

## Shots (`$SP/shots/shell-desktop/`)

- `desktop.png`, `hover.png`, `short.png` (1280x480), `phone.png`, `click-projects.png` (click still opens the window).
- The selection box is visible on the old wallpaper, though the frosted tint is subtle on bright sky. Worth a look once the final bubble art lands.

## Open questions

- Mira: is the hover tint strong enough on the bright sky, or should the border go up to .7?
- Theo: the bubble sprite is a placeholder ring in my shots. Please confirm the real `bubble.svg` reads well at 24 to 90px.
