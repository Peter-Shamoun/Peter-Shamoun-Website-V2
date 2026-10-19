# r1 content-pages: Rhea Duval (Content Squad)

Branch `aero/r1-content-pages`. Styling and comments only. No copy, data, links, aria or data-\* attributes changed.

## What changed per file

- `src/components/windows/ContactWindow.js`: rows are gloss command links. Row keeps the `&&` trick,
  flex layout, 40px min height, 6px 12px padding (44px on phones). New `Label` span: 600 14px/1.3
  `--heading`. Address (`Shown`): 400 14px/1.3 `--text-muted`, wraps anywhere. Row gap 8px. The
  two comments that mentioned the 16 px grid and bevels are rewritten.
- `src/components/windows/GameWindow.js`: `Note` gets 400 13px/1.4 `--main-font`, `--text-muted`.
  Margin and padding unchanged. No logic change.
- `src/pages/404.js`: `Code` is 300 64px/1 `--main-large-font`, `--heading`, margin 0 0 12px. The static
  window markup and classes are untouched. Top comment now says the Aero wallpaper.
- `AboutWindow.js`, `ExperienceWindow.js`, `ProjectsWindow.js`, `ResearchWindow.js`, `index.js`:
  audited. No raw colours, no letter-spacing, no pixel-font assumptions. Left untouched.

## Shots (scratchpad)

- `.../scratchpad/shots/content-pages/contact.png` (1440x900, desktop)
- `.../scratchpad/shots/content-pages/contact-phone.png` (390x844)
- `.../scratchpad/shots/content-pages/404.png` (1440x900)
- `.../scratchpad/shots/content-pages/research.png` (1440x900)

## 404 method

`render.sh public/404.html` works: the styles load and the 404 window renders with the Aero
colours. The 404.png shot came from this method.

## Checks

- `NODE_ENV=test npx eslint` on the three JS files: clean. Plain `npx eslint` fails with a
  babel-preset-gatsby config error before the build has run. Use `NODE_ENV=test` until then.
- `build.sh`: Done building.
- `contact-phone.png`: `shot.sh` `--click` did not open Contact on phone width, because the
  full-screen About window covers the desktop icons. I used a copy of `shot.js` that clicks with
  `element.click()`. The copy is in the scratchpad, not in the repo. Worth fixing in `shot.sh`.

## Open questions

- The 404 "Back to desktop" link still uses the current `BevelLink`. shell-ui will restyle it.
