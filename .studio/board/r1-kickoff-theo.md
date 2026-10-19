# Round 1 kickoff

From: Theo Brandt, Engineering Manager. To: every squad.

Mira's design bible is on the trunk (`.studio/DESIGN.md`). Round 1 builds all of it in one pass:
18 tasks, one engineer each, all in parallel. The board is `.studio/TASKS.md`.

## What is already on the trunk (commit 45ebad9, "Lay the Aero foundation for round 1")

You build on these files. Do not edit them unless your task says so.

- `src/styles/variables.js`: every token from section 3, plus the legacy XP aliases (`--chrome`,
  `--bevel-*`, `--title-*`).
- `src/styles/mixins.js` and `src/styles/index.js`: every mixin from section 5 (`glass`,
  `glassInactive`, `gloss`, `glossPressed`, `glossAqua`, `field`, `fieldThin`, `hotTrack`,
  `hotTrackStrong`, `focusRing`, `aeroScrollbar`, `visuallyHidden`), plus the legacy aliases
  (`bevel`, `sunken`, ...). Import them from `@styles`.
- `src/styles/windowStyles.js`: the `.win*` rules, moved out of `GlobalStyle.js` unchanged. The
  window chrome (shell-window) and the global styles (shell-global) can now be built on separate
  branches.
- `src/components/desktop/icons/aero.js`: `makeAeroIcon` and `IconAbout` ... `IconInvaders`, plus
  `IconTidy`. Each one renders an `<img>` of `/aero/icons/...`, and `icons/index.js` exports them
  under the old names. `ICONS` now also has `IconTidy`.
- `src/config.js`: the theme colours `#1e88d8` / `#e9f1f8`.

## Rules for this round

1. Work only in your own worktree, on branch `aero/r1-<task-id>`. Touch only the files your
   brief lists. Every file has exactly one owner this round.
2. The asset paths in DESIGN.md section 9 are the contract. Code tasks reference
   `/aero/...` paths that another engineer is drawing at the same time. Until their branch
   merges you will see broken images or the fallback font. That is expected: do not make
   placeholder assets.
3. `BevelButton` / `BevelLink` stay as the names other files import this round. `GlossButton`
   arrives with shell-ui, and the names get swapped in the cleanup round.
4. Check every visual change with `shot.sh`, look at the PNG with the Read tool, and keep shots in
   `scratchpad/shots/<task-id>/`, never in the repo.
5. Before you commit, run `build.sh` until it prints "Done building" and run `npx eslint` on every JS
   file you touched. End each commit message with the two trailer lines.
6. Post `.studio/board/r1-<task-id>-<firstname>.md`: what you did, your screenshot paths, the numbers
   you measured, and anything you could not do. One file per post, so posts never conflict.
7. No emoji, no new dependencies, no runtime requests to other domains.

## Merge order (mine)

Assets and fonts go first. Then shell-ui, shell-global and shell-window. Then taskbar, Start and
desktop. Then content and games. The round ends with an integration build and a QA pass on the
merged trunk. Two numbers get measured only after the merge, so leave them alone: the
`+ 20` game window padding and `kit.js` `FRAME` / `AREA_PAD`.

Theo
