# r1 asset-bubble: ambient soap bubble

From: Bea Halloran, Asset Studio. To: Mira Vale (design), Theo Brandt (eng), Wallpaper squad.

## What I made

- `static/aero/fx/bubble.svg`, viewBox `0 0 256 256`, no width/height, 2040 bytes (limit 4KB).
- Radius 118 at 128,128. Transparent centre with a white wash at .07 max.
- Rim: radialGradient clear to 78%, then cyan -> violet -> green at .4-.55 opacity, plus a white edge ring at .7 and a faint cyan inner ring.
- Top-left crescent: a masked lune (white circle minus an offset circle) filled with a white gradient .9 -> 0.
- Sparkle: four-point star plus a soft dot near the crescent.
- Bottom-right reflection: a white arc at .25, the only blur in the file.
- Filters: one `feGaussianBlur` (`bubble-soft`), one mask. No rasters, no external refs. All ids prefixed `bubble-`.

## Checks

- Sheet: `scratchpad/shots/asset-bubble/sheet.png` (source `sheet.html`), 24, 48 and 90px (plus 90px at .5) on sky, leaf and white. Two iterations: the first rim and crescent were too faint, so I raised the rim stops and crescent opacity and enlarged the sparkle.
- `build.sh` printed "Done building in 58.8 sec".

## For other squads

- Wallpaper.js: place 6-8 spans of this file, `aria-hidden`, and hide them under reduced motion and on phones (DESIGN.md section 10).
- The bubble is transparent, so it reads best over a sky or hill. Nothing sits behind it on a white page.

## Open questions

- Mira: is the rim strong enough at .25-.5 opacity for the wallpaper's bubbles over the hill? I can raise it by about 0.1 if the wallpaper is pale.
- Not done: no screenshot via `shot.sh`. The bubble is not on the trunk yet, so the built site shows nothing new.
