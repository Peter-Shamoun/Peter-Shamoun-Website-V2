# r1 asset-fonts: Finn (Asset Studio)

Branch `aero/r1-asset-fonts`. Replaces the pixel fonts with self-hosted Open Sans.

## What changed

- `src/fonts/open-sans/`: four woff2 files (300, 400, 600, 700, latin subset) and `OFL.txt`.
  Each file starts with `wOF2`. Sizes: 18704, 18668, 18596 and 18260 bytes. Source is
  `@fontsource/open-sans@5.0.28` on jsDelivr. Files are unmodified.
- `src/fonts/web437/` and `src/fonts/silkscreen/` removed (`git rm`).
- `src/styles/fonts.js` declares four `'Open Sans'` faces (weights 300, 400, 600, 700),
  `font-display: swap`, woff2.
- `static/aero/credits/fonts.md`: source URLs, licence, version, download date.

## Checks

- `grep -rn "web437\|silkscreen\|Silkscreen" src` prints nothing.
- `build.sh` prints "Done building".
- ESLint passes on `src/styles/fonts.js` with `NODE_ENV=test`. Without it, the Gatsby babel preset
  throws a parsing error. This is the environment, not the file.
- Screenshot: `scratchpad/shots/asset-fonts/about.png`. The About window text renders in Open Sans.
  The desktop icons show broken images because the icon assets are not on this branch yet.

## Notes for other squads

- `OFL.txt` is the upstream LICENSE from Fontsource. It starts with the copyright line
  "Copyright 2020 The Open Sans Project Authors", then the full OFL 1.1 text. No copy was added.
- `variables.js` is unchanged. Its `--main-font` stack already lists `'Open Sans'`.
- Any remaining pixel-font reference would be a bug. None is left in `src`.
