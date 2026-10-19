# Round 1 integration

From: Theo Brandt, Engineering Manager. To: every squad, Mira.

All 18 round-1 tasks are merged into `aero-redesign` with `git merge --no-ff`, asset branches
first, then shell, content and games. No merge conflicts. Tasks that had a review fix pass were
merged from their `-fix` branch (the fix branch contains the original work).

| Task                 | Branch merged                    |
| -------------------- | -------------------------------- |
| asset-wallpaper      | aero/r1-asset-wallpaper-fix      |
| asset-orb            | aero/r1-asset-orb-fix            |
| asset-icons-a        | aero/r1-asset-icons-a            |
| asset-icons-b        | aero/r1-asset-icons-b-fix        |
| asset-game-icons-a   | aero/r1-asset-game-icons-a-fix   |
| asset-game-icons-b   | aero/r1-asset-game-icons-b-fix   |
| asset-bubble         | aero/r1-asset-bubble             |
| asset-fonts          | aero/r1-asset-fonts              |
| shell-global         | aero/r1-shell-global             |
| shell-window         | aero/r1-shell-window             |
| shell-taskbar        | aero/r1-shell-taskbar-fix        |
| shell-start          | aero/r1-shell-start              |
| shell-desktop        | aero/r1-shell-desktop-fix        |
| shell-ui             | aero/r1-shell-ui-fix             |
| content-pages        | aero/r1-content-pages-fix        |
| content-games-folder | aero/r1-content-games-folder-fix |
| games-dom            | aero/r1-games-dom-fix            |
| games-canvas         | aero/r1-games-canvas-fix         |

## Checks on the merged trunk

- `build.sh`: Done building (17 s).
- `NODE_ENV=test npx eslint src`: exit 0, no warnings beyond the React-version notice.
- Every asset path referenced from `src/` exists under `static/aero/` (wallpaper, orb, bubble,
  7 desktop/menu icons, 7 game icons). The old `static/wallpaper.*` files are gone.
- The only 404 in the headless console is `/_vercel/insights/script.js`, which Vercel serves in
  production only. Not a bug.
- No integration code changes were needed: tokens, mixins and asset paths line up across branches.

## Screenshots (scratchpad `shots/`)

`r1-desktop`, `r1-about`, `r1-stack`, `r1-start`, `r1-games`, `r1-phone`, `r1-phone-start`, plus
`theo/mines` and `theo/invaders` (games opened from the folder). What I saw:

- Desktop: aurora wallpaper, bubbles, glossy orb, glass taskbar and every icon now load together.
  The site reads as Aero, not XP.
- Windows: glass frame, red close tab, dimmed inactive titles. Stacking of three windows is clean.
- Start menu: glass with white panel and all seven icons, including the new tidy glyph.
- Games folder: all seven game icons load. Minesweeper and Space Invaders open and render in the
  Aero kit (dark LCD counters, gel cells, glass HUD card).
- Phone (390x844): About opens full screen with the inset glass line; Start menu fits above the
  taskbar.

## Decisions

- content-pages 404 numeral: the acceptance line is reworded to "light-weight numeral in
  `--heading`". No new sky token. Rhea's branch is accepted as is.
- Commit trailers: several engineers used a Haiku 5.5 co-author line instead of the Opus 5.5 line
  in their brief. History is not rewritten for this. Integration commits use the brief's trailer.

## Round 2 notes (not blocking)

- Desktop icon labels in the lower left (Contact, Games) sit on the brightest grass. They follow
  the bible (`--shadow-on-desktop`) but contrast there is weak. Either darken the grass under the
  icon column in the wallpaper or strengthen the shadow token; Mira to choose.
- ContactWindow `Row` min-height 32px overrides the 26px `glossControl` (flagged by Ada).
- Contact rows' gloss computes to a flat grey gradient; review the `gloss` mixin against the bible.
- Solitaire pip shapes and `DIGIT_COLORS[8]` contrast were left open by Pip.
- Re-shoot content pages (Contact, Research, 404) on the merged trunk; their branch shots were
  pre-shell.
- Stray `static/aero/fx/bubble.svg-e` existed only in Bea's worktree; it is not on the trunk.
