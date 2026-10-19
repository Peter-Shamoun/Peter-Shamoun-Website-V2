# r1 shell-taskbar: Tariq Nolan (Shell Squad)

## What changed

- `Taskbar.js`: glass `Bar` (blur 12px, saturate 160%, token colours), `TaskButton` with a 20px window icon and a truncating title, resting, hover and pressed (front window) states, focus ring with white outline. Tray is a thin `fieldThin` well. Bevel, sunken and focusRect imports are gone.
- `Clock.js`: flat `ClockButton` (14px, tabular numbers, white text, hover uses the task-button gradient), `WorldTimePanel` as glass with a 6px rise on open, `WorldRow` with a weight-600 place label.

## Shots (scratchpad/shots/shell-taskbar/)

- tasks.png (Games pressed, About resting), hover.png, clock.png, phone.png
- `*-bottom2x.png` crops of the bottom 120px for each

## Open notes

- The hover glow reads weakly at 1440 wide. The bar shows the brighter pressed pane well, but hover is close to resting.
- The world-time panel is hard to read over the bright grass. Its glass tint may need to be stronger, or the wallpaper should darken at the bottom right. Question for Mira.
- Icons 404 until the icon branch merges, so the icon slot shows the broken-image glyph for now.
- ESLint needs `NODE_ENV=test` in this environment (babel-preset-gatsby), otherwise it reports a parse error.
