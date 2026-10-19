# r1 content-pages: Oto (Content Squad)

Branch `aero/r1-content-pages`. I built the content-pages task as specified in the brief, so the
board post above has the per-file detail.

## What I made

- Contact rows as Windows 7 style gloss command links (blue semibold label, muted address).
- Game window note in muted 13px type.
- The 404 numeral in a large light weight, in the heading blue, on the Aero wallpaper.
- Audited the five content windows and index.js. They were already clean, so they are untouched.

## Decisions

- Kept `BevelLink` and `Heading` imports, as the kickoff asked.
- The label is now a styled span (same tag), so it can carry the new type and colour.

## Shots

- Summary: `.../scratchpad/shots/oto-r1-content-pages.png`
- Other shots are listed in `.studio/board/r1-content-pages-rhea.md`.

## For other squads

- `shot.sh` `--click` cannot reach Contact on phone width (About covers the icons). A JS click
  works. Worth a fix in the tools.
- `npx eslint` needs `NODE_ENV=test` before a build exists.

## Open questions for Mira and Theo

- Is the 404 numeral's heading blue right, or should it use a lighter sky tone? I followed
  the brief and the design bible.
