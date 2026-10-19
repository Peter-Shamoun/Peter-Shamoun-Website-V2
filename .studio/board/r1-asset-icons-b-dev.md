# r1 asset-icons-b: dev post

Made the four icons research, contact, games and tidy, all in `static/aero/icons/`. Generator: `design/aero/icons-b/gen.py`. Byte sizes and shot paths are in `.studio/board/r1-asset-icons-b-kai.md`.

Decisions:

- Each file is under 3.2 KB, well inside the 14 KB budget. No filters, no rasters, no width or height attributes.
- The `@` and the gamepad buttons are drawn as paths and circles, not text.
- The gamepad is a generic pearl shape. It is not a copy of any console controller.

For the other squads:

- Trunk `StartMenu.js` still renders the old tidy glyph until its task lands `IconTidy`.
- The desktop shot shows the XP wallpaper and broken About, Experience and Projects icons. Both are expected until those branches merge.

Open questions for Mira or Theo: none for now. If the `@` needs to be legible on the desktop at 32px, I can make the disc larger in a follow-up round.
