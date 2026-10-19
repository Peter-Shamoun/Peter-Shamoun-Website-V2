# r1 content-pages: Oto (Content Squad)

Branch `aero/r1-content-pages`, fixed on `aero/r1-content-pages-fix`. The per-file detail is in
`.studio/board/r1-content-pages-rhea.md`.

## What I made

- Contact rows as Windows 7 style gloss command links (blue semibold label, muted address).
- Game window note in muted 13px type.
- The 404 numeral in a large light weight, in `--heading` (deep blue, #1a4f9c). It is not a light
  sky blue. The shot shows the numeral in that blue.
- Audited the five content windows and index.js. They were already clean, so they are untouched.

## Corrections (review round)

- The 404 page is NOT yet on the Aero wallpaper on this branch. The wallpaper and shell work are not
  merged. The 404.png shot shows a flat blue field with an XP-style "Back to desktop" button. My
  earlier claim that the numeral sits on the Aero wallpaper was wrong. The page code is written for
  the wallpaper, and the look is pending the merge.
- The Contact, Research and 404 shots are pre-shell. They show the old XP desktop. The Aero visual
  check is pending the shell and wallpaper branches.

## Decisions

- Kept `BevelLink` and `Heading` imports, as the kickoff asked.
- The label is now a styled span (same tag), so it can carry the new type and colour.
- The 404 numeral stays on `--heading`. The acceptance wording "large light-blue numeral" should be
  reworded to "large light-weight numeral in --heading", or Theo signs off on a lighter sky token.

## Shots

- Re-shot on the fix branch: `.../scratchpad/shots/content-pages-fix/` (contact, contact-phone, 404,
  research). Copies are at the old `.../scratchpad/shots/content-pages/` paths.
- Summary shot from the first pass: `.../scratchpad/shots/oto-r1-content-pages.png`. It is pre-shell.

## For other squads

- `shot.sh` `--click` cannot reach Contact on phone width (About covers the icons). A JS click
  works. Worth a fix in the tools.
- `npx eslint` needs `NODE_ENV=test` before a build exists.

## Open questions for Mira and Theo

- Acceptance wording for the 404 numeral (see Decisions). Keep `--heading`, or sign off a lighter token.
