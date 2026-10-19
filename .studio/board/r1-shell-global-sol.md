# r1 shell-global: Sol Marchetti (Shell Squad)

Branch `aero/r1-shell-global`. Owned files: `src/styles/GlobalStyle.js` and this post only.

## What changed in GlobalStyle.js

- Imports: `bevel` replaced by `gloss`; `media` added from `./media`.
- `body`: weight 400, line-height 1.5, `letter-spacing: 0` (the 0.5px is gone). 15px via `--font-base-size`.
- `button`: `letter-spacing: 0`. `font` and `color` still inherit.
- Default focus: `:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }`. The dotted rule is gone. The comment points to `focusRing` in mixins for components that need another ring.
- Skip link: `gloss` replaces the chrome background and bevel. Padding 6px 14px, font-size 14px. Clip-path hide/show unchanged. Focus outline is now a 2px solid focus ring.
- Wallpaper: `body::before` points at `/aero/wallpaper/aero-desktop.{webp,jpg}` with `image-set` and `background-position: center bottom`. Inside `${media.phone}` the same wiring points at `aero-phone.*`. Position, inset, z-index and size rules are kept.
- `prefers-reduced-motion` block and the final `[hidden]` rule are unchanged. `${fonts}`, `${variables}` and `${windowStyles}` are untouched.
- No raw hex. No backdrop-filter.

## Checks

- `NODE_ENV=test npx eslint src/styles/GlobalStyle.js` is clean. Plain `npx eslint` fails on this machine with the babel-preset-gatsby error, which also needs a Gatsby build first. This is an environment issue, not a lint finding.
- `build.sh` prints "Done building in 42.1 sec".
- Built `public/index.html` contains both wallpaper names:

```
      2 aero-desktop.webp
      2 aero-phone.webp
```

## Screenshots

- Desktop 1440x900 with About open: `scratchpad/shots/shell-global/desktop.png`
- Phone 390x844 with About open: `scratchpad/shots/shell-global/phone.png`

What the shots show: body text is 15px sans with no extra tracking. The page background is the sky blue (`--desktop`), since the wallpaper files are not on this branch yet. The About window and the taskbar render. The desktop icons show broken-image frames because the `/aero/icons/*` files come from another branch. The window chrome is still the old XP look, which belongs to shell-window.

## For other squads

- The wallpaper files `static/aero/wallpaper/aero-{desktop,phone}.{webp,jpg}` must exist at merge time. Until then the body background falls back to `--desktop`.
- Anything that wants a different focus ring (for example, inside glass) should use `focusRing` from `mixins.js` and not a second `:focus-visible` rule.
- The `.skip-link` now uses `gloss`. If shell-ui renames `bevel` to `GlossButton` styling, this import will need to follow.

## Open questions

- Mira: is a 2px ring with no soft glow enough for the global default, or should the default also carry the `0 0 0 4px` halo from `focusRing`? I kept the brief's version.
