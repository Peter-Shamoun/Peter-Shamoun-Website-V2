# r1 content-pages: Rhea Duval (Content Squad)

Branch `aero/r1-content-pages`, fixed on `aero/r1-content-pages-fix`. Styling and comments only. No copy, data, links, aria or data-\* attributes changed.

## What changed per file

- `src/components/windows/ContactWindow.js`: rows are gloss command links. Row keeps the `&&` trick,
  flex layout, 40px min height, 6px 12px padding (44px on phones). New `Label` span: 600 14px/1.3
  `--heading`. Address (`Shown`): 400 14px/1.3 `--text-muted`, wraps anywhere. Row gap 8px. The
  two comments that mentioned the 16 px grid and bevels are rewritten.
- `src/components/windows/GameWindow.js`: `Note` gets 400 13px/1.4 `--main-font`, `--text-muted`.
  Margin and padding unchanged. No logic change.
- `src/pages/404.js`: `Code` is 300 64px/1 `--main-large-font`, `--heading`, margin 0 0 12px. The static
  window markup and classes are untouched. Top comment says the page shows the Aero wallpaper with
  one static glass window. That is the intended result once the wallpaper lands. On this branch
  the page still has no wallpaper (see below).
- `AboutWindow.js`, `ExperienceWindow.js`, `ProjectsWindow.js`, `ResearchWindow.js`, `index.js`:
  audited. No raw colours, no letter-spacing, no pixel-font assumptions. Left untouched.

## Shots (scratchpad)

Re-shot on the fix branch (same build, 50s build.sh, Done building). Copies also sit at the old paths.

- `.../scratchpad/shots/content-pages-fix/contact.png` (1440x900, desktop)
- `.../scratchpad/shots/content-pages-fix/contact-phone.png` (390x844)
- `.../scratchpad/shots/content-pages-fix/404.png` (1440x900)
- `.../scratchpad/shots/content-pages-fix/research.png` (1440x900)

Provenance: all four are PRE-SHELL. They show the old XP desktop (XP wallpaper, XP-blue title
bars, grey bevelled buttons, broken icon images), because the Aero wallpaper, shell chrome and
GlossLink restyle are not on this branch or on the `aero-redesign` tip (695189c). They show the
content and type changes only. The visual check of the Aero result is PENDING until the shell
and wallpaper branches are merged, then this branch is rebased and the four shots are re-taken.

## 404 method

`render.sh public/404.html` works: the styles load and the 404 window renders. The 404.png shot came
from this method, run against the build output. It does not show the Aero look. It shows a flat
blue field with no wallpaper, and an XP-style "Back to desktop" button, because the wallpaper
and `BevelLink` restyle are not yet on the branch. My earlier note that it showed the Aero colours
was wrong, and is corrected here.

What the shot does show: the 404 numeral is `--heading` (deep blue, #1a4f9c in the current token set),
as the brief and DESIGN.md specify. It is not a light sky blue. Keeping `--heading`. The acceptance
text that asks for a "large light-blue 404 numeral" should be reworded to "large light-weight
numeral in --heading", or Theo should sign off on a lighter sky token. No change made here.

## Checks

- `NODE_ENV=test npx eslint` on the three JS files: clean (exit 0). Plain `npx eslint` fails with
  a babel-preset-gatsby config error before the build has run. Use `NODE_ENV=test` until then.
- `build.sh`: Done building in 50.85 sec.
- `contact-phone.png`: `shot.sh` `--click` does not open Contact on phone width, because the
  full-screen About window covers the desktop icons. I used a copy of `shot.js` that clicks with
  `element.click()`. The copy is in the scratchpad at `.../scratchpad/tools/shot-jsclick.sh`, not
  in the repo. Worth fixing in `shot.sh`.

## Open questions

- The 404 "Back to desktop" link still uses the current `BevelLink`. shell-ui will restyle it.
- Acceptance wording for the 404 numeral colour (see 404 method above).
