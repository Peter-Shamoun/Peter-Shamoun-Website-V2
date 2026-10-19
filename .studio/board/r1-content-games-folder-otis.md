# r1 content-games-folder: Games folder entries with Explorer hot-track

From: Otis Brennan, Content Squad. Branch `aero/r1-content-games-folder`.

## What I did

- `src/components/windows/GamesWindow.js` only.
- Grid: `repeat(auto-fill, minmax(96px, 1fr))`, gap 8px, list reset as before.
- Label: 13px/1.3 `--main-font`, `--text`, centred, no background.
- Entry: column flex, padding 6px 4px, transparent 1px border, radius 3px, `hotTrack` on hover,
  `hotTrackStrong` on focus-visible and active. Navy label selection and dotted outline are gone.
- Picture: `<Art size={48} />` kept; `& img` sets 48px and the drop-shadow.
- Phone keeps `min-height: 76px`.
- `data-game`, `aria-label`, `onClick`, list markup and order are unchanged.

## Checks

- `NODE_ENV=test npx eslint src/components/windows/GamesWindow.js`: clean. Without `NODE_ENV=test`
  the babel preset refuses to load outside a Gatsby build, so use that flag in worktrees.
- `build.sh`: Done building.

## Screenshots

Folder: `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad/shots/content-games-folder/`

- `folder.png`: desktop with the Games window (icons broken, as expected).
- `hover.png`: Snake under the pointer shows the pale blue hot-track box.
- `phone.png`: at 390x844 the About window covers the Games window, so this shot does not show
  the phone grid. Not a code issue, but the shot flow needs a fix (see open questions).
- `open.png`: clicking Snake still opens the game window.

The shell is still XP in this worktree (shell branches are not merged yet), so the surrounding
chrome is not final.

## For other squads

- The test icons I copied into `public/aero/icons/games/` are coloured placeholders for a visual
  check only. They are gitignored and not committed.

## Round 1 fix: phone check

Branch `aero/r1-content-games-folder-fix`, from `aero/r1-content-games-folder`. No code change was
needed: the grid, entries, label and min-height already matched the brief. The gap was the shot.

- `phone.png` (390x844) is re-shot with the About window closed first and Games opened:
  `shot.sh phone.png --w 390 --h 844 --click "[aria-label='Close About'];[data-icon-for=games]"`.
  The Games grid fills the view: three columns, full-width entries, labels wrap cleanly
  ("Space Invaders" on two lines).
- Horizontal scroll: `document.documentElement.scrollWidth` is 390 at a 390 viewport. None.
- Entry boxes at 390 wide: 110px wide, 83px high (above the 76px phone min-height).
- `hover.png`, `open.png` and `folder.png` re-shot. Snake shows the hot-track box on hover, and
  clicking Snake still opens the game window.
- eslint on `GamesWindow.js` is clean (`NODE_ENV=test`). `build.sh`: Done building.
- Commit trailer: Co-Authored-By Claude Haiku 5.5, as the session attribution reminder asks.
  Not amended.

Shots: `/private/tmp/claude-501/-Users-peter-parker-Desktop-Peter-Shamoun-Website-V2/f1c09e4c-1805-43b8-b6d1-cc9c0d83ddbf/scratchpad/shots/content-games-folder/`
(`folder.png`, `hover.png`, `phone.png`, `open.png`).

The 404s in the console are the game icon SVGs, which are not in this worktree yet. They are expected.

## Open questions

- Mira / Theo: the phone shot opens About on top, so the Games grid is never visible at 390 wide.
  Should `shot.sh` close the default window first, or should the phone check open Games from the
  Start menu?
