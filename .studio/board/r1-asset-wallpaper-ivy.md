# r1 asset-wallpaper: Aero wallpaper drawn

From: Ivy Castell, Asset Studio. Branch `aero/r1-asset-wallpaper`, cut from `aero-redesign`.

## What I drew

- Procedural, no photo and no text. Source is `design/aero/wallpaper/gen.py`, which writes
  `desktop.html` (2560x1600) and `phone.html` (1200x2600). Both are inline SVG with gradients,
  blurred ellipses, and light ribbons built as filled bands between two offset curves.
- Desktop: sky gradient per section 9, two cumulus banks right of centre, three aurora ribbons
  (the middle one has the crisp core line), a white-gold flare at (80%, 16%) with a starburst and
  six ghosts toward (35%, 70%), back and front hills with blurred crest rim light, 34 bubbles on the
  right third and over the right hill, 64 bokeh discs mostly upper right.
- Phone: same elements recomposed. Hill fills the bottom ~22%, flare top right, ribbons diagonal,
  bubbles down the right edge and behind the name.
- `finish.py` adds gaussian grain (sigma 1.4, fixed seed), then writes WebP q80 method 6 and
  progressive JPEG q82. Budgets are checked with quality stepping down.

## Shipped files and sizes

| File                                      | Size      | Bytes  | Budget |
| ----------------------------------------- | --------- | ------ | ------ |
| `static/aero/wallpaper/aero-desktop.webp` | 2560x1600 | 60078  | 400000 |
| `static/aero/wallpaper/aero-desktop.jpg`  | 2560x1600 | 166494 | 400000 |
| `static/aero/wallpaper/aero-phone.webp`   | 1200x2600 | 49054  | 250000 |
| `static/aero/wallpaper/aero-phone.jpg`    | 1200x2600 | 130148 | 250000 |

`static/wallpaper.webp` and `static/wallpaper.jpg` are removed with git rm. GlobalStyle still points
at them until shell-global lands, so the live site shows plain blue on this branch. That is expected.

## Calm-zone numbers

Measured on the finished images. "Detail" is luminance minus a heavy blur, so the sky gradient
does not count. It is the number that tells you about local texture.

- Desktop left column x 0-240, full height: luminance std 39.7 (mostly the sky gradient), detail std 2.2.
- Desktop bottom-right 440x150 name block: luminance std 20.7, detail std 1.4, mean luminance 126.
  The block sits on the mid-green front hill, with no bubbles in it.
- Phone top row y 0-360: luminance std 14.3, detail std 1.6.
- Phone bottom-right 440x150: detail std 6.6. Bubbles sit behind the name, as the brief asks.

## Previews

- Desktop 1440x900: `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad/shots/asset-wallpaper/preview-desktop-1440.png`
- Phone 390x844: `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad/shots/asset-wallpaper/preview-phone-390.png`
- Built-site screenshot: `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad/shots/ava-r1-asset-wallpaper.png` (shows plain blue, see above)

## Open questions for Mira and Theo

1. The ribbons are readable but still lean toward light-blue rather than full aqua-green. If Mira
   wants more colour, the next pass should raise the green in the haze, not the opacity.
2. The starburst is kept small and soft. If it reads too much like a sun, drop the spike layer.
3. The phone name block has bubbles behind it (per section 9). If the name is hard to read on
   device, move the two largest bubbles out of the 440x150 block in `bubble_ok`.

## Round 1 fix pass (branch aero/r1-asset-wallpaper-fix)

From: Ivy Castell, Asset Studio. Fixes for the review on `aero/r1-asset-wallpaper`. Sources
(`gen.py`, `desktop.html`, `phone.html`) and `finish.py` are regenerated, and the four shipped
files are re-encoded. The byte sizes above are the new ones.

- Flare: the starburst is now soft. Spikes are shorter (60 to 120 px, one in three longer), wider,
  blurred more (sigma 8) and at opacity 0.14. The core is a smaller, softer bright point (blur 9
  and 3). The 140 px glow is kept.
- Ribbons: each of the three ribbons now has a `#b4f58a` stage mid-to-lower along its length,
  at opacity 0.5 to 0.78. Honest note: under screen blending over the blue sky the green reads as
  aqua-teal, not strong green. Raising it further would start to muddy the blue.
- Desktop bokeh: two thirds of the discs now sit at x 55 to 98 percent, upper right. The rest
  drift across x 30 to 55 percent, upper centre. The x 0 to 240 column stays clear.
- Phone top band: the flare centre moved from 20 to 28 percent of the height. Its glow and
  spikes now stay below y 360. Top row detail std is 1.56, down from 1.6 and unchanged in effect.
- Bliss distance: the back hill has a steeper crest on the left (desktop and phone). The desktop
  back hill has a faint glossy streak. The front hill has a soft specular band just below its crest.
- Desktop ribbon start points lowered: the first ribbon starts at 80 percent of the height,
  the third at 68 percent.
- Phone bubbles all sit on the right 30 percent of the width (x 70 to 97 percent), down the
  right edge and behind the name. None over the centre of the hill.
- Static wallpaper: `static/wallpaper.webp` and `static/wallpaper.jpg` are not tracked on this
  branch, so there was nothing to `git rm`. The site build passes with the new files.

### Calm-zone numbers after the fix

- Desktop left column x 0-240: detail std 2.28 (was 2.2). Luminance std 37.2 is the sky gradient
  and the left hill edge, not texture.
- Desktop name block 440x150: detail std 1.45, mean 126.4 (was 1.4, mean 126).
- Phone top row y 0-360: detail std 1.56, luminance std 9.4.
- Phone name block 440x150: detail std 8.08 (was 6.6). Bubbles are behind the name by design.

### Open questions

1. Should the ribbon green be pushed harder for a more obviously aqua-green aurora? It would cost
   some of the blue depth, so I have not done it without Mira's call.
2. Phone bubbles now all sit on the right edge. If Theo wants a few in the middle over the hill,
   that is a one-line change in `bubble_ok`.
