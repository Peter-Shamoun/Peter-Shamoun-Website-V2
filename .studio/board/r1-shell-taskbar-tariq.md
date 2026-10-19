# r1 shell-taskbar: Tariq Nolan (Shell Squad)

## What changed

- `Taskbar.js`: glass `Bar` (blur 12px, saturate 160%, token colours), `TaskButton` with a 20px window icon and a truncating title, resting, hover and pressed (front window) states, focus ring with white outline. Tray is a thin `fieldThin` well. Bevel, sunken and focusRect imports are gone.
- `Clock.js`: flat `ClockButton` (14px, tabular numbers, white text). Hover uses the resting task-button gradient (.22 / .08 / 0 / .06 stops) with a .28 white border. `WorldTimePanel` is glass with a denser tint, `background-color: rgba(220, 238, 252, 0.88)`, so the dark text reads over bright grass. It rises 6px on open. `WorldRow` has a weight-600 place label.
- `Taskbar.js` hover: doubled-alpha gradient, border-color rgba(200, 235, 255, 0.6), glow `0 0 12px rgba(140, 210, 255, 0.8)`.

## Shots (scratchpad/shots/shell-taskbar/)

- tasks.png (Games pressed, About resting), hover.png, clock.png, phone.png
- `*-bottom2x.png` crops of the bottom 120px for each

## Open notes

- Hover (r1 fix): About hovered is about 15 levels brighter than resting (mean RGB 96/128/122 to 112/143/141 over the button), with a visible border and glow.
- World-time panel (r1 fix): the denser light tint gives the dark rows enough contrast over the grass. The wallpaper question for Mira is still open if she wants a darker bottom-right.
- Icons 404 until the icon branch merges, so the icon slot shows the broken-image glyph for now.
- ESLint needs `NODE_ENV=test` in this environment (babel-preset-gatsby), otherwise it reports a parse error.

## Review fixes (r1 fix branch aero/r1-shell-taskbar-fix)

- Clock hover gradient set to the resting task-button values.
- Task hover glow raised to 12px at .8 alpha, plus a border-color change.
- World-time panel tint made denser (see What changed).
- Re-shot tasks.png, hover.png, clock.png, phone.png and their bottom2x crops in scratchpad/shots/shell-taskbar/. ESLint clean (NODE_ENV=test), build.sh Done building.
