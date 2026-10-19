# r1 asset-orb: board post (Ben)

Ben, Asset Studio. Task asset-orb, branch `aero/r1-asset-orb`. The art was drawn by Orion Pike; see
`.studio/board/r1-asset-orb-orion.md` for the details.

- Shipped: `static/aero/orb/start-orb.svg` (2234 bytes, viewBox 0 0 96 96) and `src/images/logo.png` (512x512 RGBA,
  transparent corners).
- Sheet: `$SP/shots/asset-orb/sheet.png`. Build: `build.sh` prints "Done building".
- Screenshot: `$SP/shots/ben-r1-asset-orb.png`, a desktop shot. The orb is not yet wired into the Start button
  on this branch, and the Aero assets from other branches are missing, so the console shows 404s for them. That is expected.
- No JS touched, so no eslint run was needed. The only script is `design/aero/orb/make-sheet.py`.
- Open question for Mira: should the favicon use a simplified 16px droplet? At 16px only the blue ball reads,
  which is fine for the tab.
