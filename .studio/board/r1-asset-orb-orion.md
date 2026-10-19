# r1 asset-orb: Start orb and logo.png

From: Orion Pike, Asset Studio. Branch `aero/r1-asset-orb`.

## What I drew

- `static/aero/orb/start-orb.svg`, viewBox `0 0 96 96`, no width/height, 2234 bytes. Every id starts `orb-`.
  One radial gradient for the body (centre 50% 75%), a 3-unit navy ring (`#06325f` family) with a thin
  white outer highlight, an aqua glow arc clipped to the lower body, a white gloss ellipse inset 6 units
  from the rim (opacity .85 to .05), and the emblem: a white droplet (point up, aqua inner shade, faint
  blue edge) with a leaf-green leaf on its right side and a light midrib. No filters, no rasters, no text.
- `src/images/logo.png`, 512x512 RGBA, corner pixels alpha 0. Rendered from the SVG (inlined in an HTML
  wrapper, see below). It is the favicon and manifest icon. Build passes.
- `design/aero/orb/make-sheet.py`: copies the SVG and logo into a folder, writes PIL downscales of the logo
  at 16 and 32px, and writes `sheet.html`.

## Contact sheet

`$SP/shots/asset-orb/sheet.png` (700x420). The sheet shows the orb at 44px and 48px on the taskbar glass,
96px on white, and the logo at 32px and 16px.

## Decisions and notes for other squads

- The droplet was enlarged in the second pass so it reads at 44px. The leaf sits off the right side, and the
  droplet is white with a blue edge so it stays visible over the white gloss cap.
- `render.sh` cannot load an SVG through `file://` from its setContent page. It produces a broken-image
  placeholder, so the logo is rendered from an HTML wrapper with the SVG inlined. Same art, same size.
- Taskbar and Start code should size the orb at `var(--orb)` (44px) and overhang the bar by 4px, as in DESIGN.md
  section 7. The 16px favicon reads as a blue glossy ball.

## Round 1 fix (review follow-up, branch aero/r1-asset-orb-fix)

- Removed `.studio/board/r1-asset-orb-ben.md` from this branch (out of scope). It stays with its owner.
- Light direction: the gloss ellipse moved from cx 48 to cx 44, and the rim highlight is now a diagonal
  gradient (top left bright, bottom right gone). The body gradient is unchanged (cx 50%, cy 75%).
- `start-orb.svg` is 2234 bytes, still one `feGaussianBlur`-free file with `orb-` ids, no rasters, no text.
- `logo.png` re-rendered from the SVG: 512x512 RGBA, corner alpha 0.
- Contact sheet fixed: the 32px and 16px favicon previews were drawn at 96px by a CSS rule. The rule now
  targets the direct child only. Sheet: `$SP/shots/asset-orb/sheet.png` (700x420). At 16px the orb reads as a
  blue glossy ball. At 44px the droplet and leaf read.
- `design/aero/orb/make-sheet.py` regenerates the sheet files. `tools/build.sh` prints "Done building".
