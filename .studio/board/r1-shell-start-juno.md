# r1 shell-start (Juno Ferraz, Shell Squad)

Branch `aero/r1-shell-start`. Owned: `src/components/desktop/StartMenu.js` only.

## What changed

- Start orb: the text button is now a 44px orb image (`/aero/orb/start-orb.svg`, `alt=""`) with
  the accessible name "Peter Shamoun" kept in a `visuallyHidden` span. Overhangs the bar by 8px
  on desktop, 0 on phone. Hover glow, pressed and expanded states, focus ring with 3px offset.
- Gutter `Root` is `calc(var(--orb) + 12px)` wide, stretched to the bar, `position: relative`.
- Menu: `glass`, 6px above the taskbar, 10px padding, white inner panel as `::before`,
  `start-open` rise on open (keyframes `rise`, opacity and `translate` only).
- Items: 32px icons, 14px text, hot-track on hover and focus (no outline), 40px (44px phone).
- Separator: 1px gradient rule. Tidy desktop uses `IconTidy`.
- Removed `Tile`, `GlyphApp`, `GlyphMenu`, `bevel*`, `focusRect` usage.
- DOM order, ids, roles, aria and data attributes, and all handlers are unchanged.

## Checks

- `npx eslint` is clean when run with `NODE_ENV=test`. Without it, the Gatsby babel preset refuses
  to parse the file outside a build (environment quirk, not a code issue).
- `build.sh`: Done building.

## Shots (`scratchpad/shots/shell-start/`)

- `menu.png`: Start menu open, 1440x900. Glass menu, white inner panel, rows, separator.
- `orb-hover.png`: orb hover glow.
- `menu-hover.png`: menu with the Projects row hot-tracked.
- `phone.png`: 390x844 with the menu open.
- `crop-menu-hover.png`, `crop-orb-hover.png`, `crop-phone.png`: 2x crops.

The test orb in those shots is a placeholder I drew at `shots/shell-start/test-orb.svg`, copied to
`public/` only. Item icons show as broken images because the icon SVGs are not on this branch yet.
The rest of the desktop still shows the XP chrome, so the shots show this task in isolation.

## Notes for other squads

- Taskbar (shell-taskbar) owns the `Bar` gutter. `Root` now fills the full bar height with
  `align-self: stretch` and `position: relative`, and `Menu` positions from it.
- `Menu` keeps the `[hidden]` rule from GlobalStyle. Do not add a `display` rule that overrides it.

## Open questions

- Mira: is the 8px orb overhang right, or should the orb sit fully inside the bar at 44px?
- Theo: the hot-track is the keyboard focus indicator (no outline). Is that acceptable for the
  a11y pass?
