# r1 asset-icons-b: Kai Moreno, Asset Studio

Task: desktop icons research, contact, games, tidy (`.studio/DESIGN.md` section 9). Branch `aero/r1-asset-icons-b`.

## Files (bytes, as shipped)

- `static/aero/icons/research.svg`: 2112
- `static/aero/icons/contact.svg`: 2146
- `static/aero/icons/games.svg`: 3107
- `static/aero/icons/tidy.svg`: 2568

All four: viewBox `0 0 256 256`, no width or height attributes, no filters, no raster, no text, no external refs. Every id is prefixed (`research-*`, `contact-*`, `games-*`, `tidy-*`).

Generator: `design/aero/icons-b/gen.py` (run `python3 -I design/aero/icons-b/gen.py`).

## What each icon is

- **research**: clear Erlenmeyer flask, aqua-tinted glass, green liquid (`#b6f35a` to `#3fae1e`) with three bubbles, edge highlight down the left neck.
- **contact**: white envelope with a sky-blue flap, sealed by an aqua glass disc with a drawn `@` (path, not text).
- **games**: generic pearl gamepad, blue d-pad, four gel buttons (green top, red right, aqua bottom, orange left). Not an Xbox or PlayStation shape.
- **tidy**: three stacked sky-blue glass panes with title bands and a white four-point sparkle top right.

## Checked

- Contact sheet on sky and on white at 32, 48 and 64px: `$SP/shots/asset-icons-b/sheet.png`
- Large preview of the four: `$SP/shots/asset-icons-b/big.png`
- Desktop (trunk, before the other icon branches merge, so About, Experience, Projects show broken and the old XP wallpaper stays): `$SP/shots/asset-icons-b/desktop.png`
- Start menu with `--start`: `$SP/shots/asset-icons-b/start.png`

`$SP` is `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad`.

## Notes for the squads

- At 32px the flask, the envelope with its disc, the gamepad and the panes all read. The `@` is only a suggestion below 48px; it does not need to resolve at 32.
- The Start menu on trunk still shows the old pixel tidy glyph, because StartMenu.js has not been switched to `IconTidy` on this branch. Nothing for me to change here; the Start menu task should pick it up.
- Build prints "Done building".
