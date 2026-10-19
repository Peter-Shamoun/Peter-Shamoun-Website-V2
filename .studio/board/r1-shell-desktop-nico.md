# r1 shell-desktop: Nico Varga (Shell Squad)

Branch `aero/r1-shell-desktop`. Files: `DesktopIcon.js`, `DesktopIcons.js`, `Wallpaper.js`.

## What changed

- **Icons:** the whole button is the selection box. Padding 4px 4px 3px, 1px transparent border, 3px radius. Hover is a white frosted box. Focus-visible and active are a sky-glass box with an inner highlight. The old navy label and dotted outline are gone.
- **Labels:** 14px/18px, white, two lines max, no background.
- **Grid:** `grid-auto-columns` stays 104px. Rows are `calc(var(--icon-size) + 50px)`, row-gap 6px. The phone layout is unchanged.
- **Wallpaper name:** 34px light weight, live text. The line is 15px at .92 opacity.
- **Bubbles:** 7 hand-placed spans in the right 35%, rendered before the name block. They sit at y >= 26% so they stay above the name. Only `translate` is animated. Hidden on phones and under reduced motion.

## Measurements and cross-squad

- Measured column: the grid has no column-gap (only row-gap 6px), so the first column ends at 16 + 104 = 120px and the second column starts at 120px. That is clear of `--win-clear: 128px` in `windowStyles.js` for one column, so I did not touch it.
- Two-column case (short desktop, 40px icons): 16 + 104 + 104 = 224px, inside the 232px two-column clearance.
- Assets: this branch has no icons or bubble SVG. For the shots I copied `static/aero/fx/bubble.svg` from `aero/r1-asset-bubble` and three icons (about, experience, projects) from `aero/r1-asset-icons-a` into `public/` (gitignored). Research, Contact and Games show as broken images until the icon set lands.

## Review fixes (round 1 fix branch `aero/r1-shell-desktop-fix`)

- Column math corrected to 16 + 104 = 120px (no column-gap), two-column case 224px inside 232px. `windowStyles.js` not changed.
- Hover strengthened to a gradient of rgba(255,255,255,.36) to rgba(255,255,255,.16) with a border of rgba(255,255,255,.7). The Projects box now reads clearly on bright sky in `hover.png`.
- eslint on the three files and `build.sh` were re-run on this branch. eslint needs `NODE_ENV=test` to bypass the Gatsby babel preset, and the build reports Done building.

## Shots (`$SP/shots/shell-desktop/`)

- `desktop.png`, `hover.png`, `short.png` (1280x480), `phone.png`. Research, Contact and Games are broken images in these shots because their icon files are not on this branch.
- The selection box is visible on the old wallpaper, and the hover box is clearly visible on the Projects icon.

## Open questions

- Theo: the bubble sprite in my shots is the placeholder from `aero/r1-asset-bubble`. Please confirm the final `bubble.svg` reads well at 24 to 90px.
