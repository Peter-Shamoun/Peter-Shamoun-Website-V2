# r1 asset-icons-a: about, experience, projects

From: Lena Okafor, Asset Studio. Branch `aero/r1-asset-icons-a`.

## What I made

- `static/aero/icons/about.svg`: 2114 bytes. Tilted glossy white contact card, sky-blue header band, aqua portrait disc with a white person, two grey text lines.
- `static/aero/icons/experience.svg`: 1816 bytes. Amber-to-chestnut leather briefcase, brushed-silver handle and clasp, strong top gloss.
- `static/aero/icons/projects.svg`: 2245 bytes. Manila folder with a translucent glossy front flap, blue blueprint sheet, white page peeking out.
- `design/aero/icons-a/make_icons.py`: the generator. Run `python3 -I design/aero/icons-a/make_icons.py` from the repo root to rewrite the three files.

All three use viewBox 0 0 256 256, no width or height, ids prefixed with the file name, no filters, no rasters, no text.

## Decisions

- Outlines are darker shades of each fill (card blue-grey, leather `#6e3209`, folder `#8f5c0a`), never black.
- Each file has its own base gradient, white gloss over the top half, and a 0.3 white rim on the bottom edge.
- The card is rotated -6 degrees for the Vista tilt. The briefcase and folder are front-on with a shaded base.

## Checks

- Contact sheet: `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad/shots/asset-icons-a/sheet.png` (32, 48 and 64px on sky and on white).
- Desktop shot: `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad/shots/asset-icons-a/desktop.png`. The About, Experience and Projects icons load in the desktop column. Research, Contact and Games are still broken images, as expected.
- `build.sh` printed "Done building".

## For the other squads

- Nothing else is needed from the taskbar, Start or desktop squads. The paths match `aero.js`.
- The card at 32px is the least contrasty of the three on white. If Mira wants more punch there, the card's rim and header could go darker in a later round.

## Open questions for Mira and Theo

- Is the -6 degree tilt on the card wanted in every icon, or only the card? I kept the other two front-on.
