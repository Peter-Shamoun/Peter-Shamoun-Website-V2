# r1 shell-ui: Ada Kowalski (Shell Squad)

Branch `aero/r1-shell-ui`. Touched only `src/components/desktop/ui.js` and this post.

## What changed

- `bevelControl` is now `glossControl`: 26px high (44px on phones), 14px / 400 text, letter-spacing 0, `gloss` + `focusRing`, `&:active { glossPressed }`. The `--chrome` background is gone; `gloss` sets it.
- New `GlossButton` and `GlossLink` (forwardRef, same external-link rule). `BevelButton` and `BevelLink` are aliases marked as legacy, to delete in cleanup.
- `Heading`: 22px / 300 / `--heading`, margin 0 0 12px, letter-spacing 0.
- `SubHeading`: 13px / 600 / `--heading`, uppercase, 0.06em, sky gradient underline via `border-image`.
- `Lines` and `Text` at 15px. `Inset` uses `field` with 8px padding.
- `Props` dt: 13px / 600, `--text-muted`, 0.04em. `TagList` separator in `--text-muted`.
- `ExtLink`: no underline at rest, underline and `--link-hover` on hover, `focusRing`.
- No `bevel`, `sunken`, `inset` or `focusRect` imports remain. No raw hex in the file.

## Checks

- `NODE_ENV=test npx eslint src/components/desktop/ui.js`: clean. Plain `npx eslint` fails in this shell with a babel-preset-gatsby error, so NODE_ENV=test is needed.
- `build.sh`: "Done building in 83 sec".
- Shots in `scratchpad/shots/shell-ui/`: about.png, experience.png, contact.png, contact-hover.png, contact-phone.png.
  - about: the Heading is light blue 22px. Body is 15px.
  - contact: the three rows are silver gloss buttons.
  - contact-hover: the Email row turns sky blue on hover.
  - contact-phone: not usable. The shot opened About, not Contact, so the phone click did not hit the contact icon. Needs a recheck.

## Notes for other squads

- The screenshots still show XP window chrome and missing icon images. That is expected until shell-window and the assets merge.
- Content uses `GlossLink` for contact rows, so pages that import `BevelLink` get the new look without edits.

## Open questions

- Mira: is 26px right for a Windows 7 push button at 14px? I used the bible's numbers as written.
- Theo: someone should check the phone contact shot after the merge.

## Review fixes (branch aero/r1-shell-ui-fix)

- **Phone contact shot replaced.** `shots/shell-ui/contact-phone.png` now shows the Contact window at 390x844. The first click on `[data-icon-for=contact]` missed because About opens on load at phone width and covers the desktop. The shot now runs `--click "[aria-label='Close About'];[data-icon-for=contact]"`.
- **Phone row height confirmed at 44px.** A DOM measure of `[data-window=contact] a` at 390px gives 44px for all three rows. The image shows the three silver gloss rows at about 44px each.
- **Desktop row height is 32px, not 26px.** A DOM measure at 1440px gives 32px for all three rows. `Row` in `src/components/windows/ContactWindow.js` sets `min-height: 32px` and overrides the 26px `glossControl`. ui.js is correct as briefed. Flagged to the ContactWindow owner, who should decide whether the 26px height should apply to these rows.
- **Gloss reads flat.** The computed gradient on the contact rows runs from rgb(246,246,246) to rgb(235,235,235). That is a flat grey, not a Windows 7 silver gloss with a top highlight. The `gloss` mixin is on trunk, so this is not a ui.js defect. It goes to the bible review.
- ESLint (`NODE_ENV=test npx eslint src/components/desktop/ui.js`) and `build.sh` pass again.
