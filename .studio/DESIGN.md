# Design bible: Frutiger Aero

Owner: Mira Vale, Creative Director. This file is the contract. If your task and this file disagree,
this file wins; if this file is silent, ask on the board (`board/r<round>-<task>-<you>.md`) and pick
the option that looks most like Windows 7 on a sunny day.

Read sections 1, 2 and 13 whatever your task is. Then read the section your task names.

---

## 1. Concept

Peter's desktop moves from 2001 to 2008. Windows are sheets of tinted, blurred glass with a white
sheen across the top, sitting on a bright sky over a glossy green hill, with aurora light ribbons,
a lens flare and soap bubbles drifting up the right side. Everything is lit from the top left,
everything is a little wet and a little shiny, and the palette is sky blue, aqua, leaf green and
white. The type is a clean humanist sans (Segoe UI where it exists, Open Sans everywhere else, which
was drawn by Segoe UI's own designer, Steve Matteson). It should feel optimistic, clean and
hand-made: Vista and Windows 7 glass, Zune and Wii era gloss, and the "eco-tech" nature photography
of the time. It should not feel like a parody. Restraint matters: the glass is the hero, so
content areas stay white and calm.

Reference points (look them up if unsure): Windows 7 window frame, Windows 7 taskbar and Start orb,
Windows Vista "Aurora" wallpaper, Windows 7 Minesweeper and Solitaire, Vista Sidebar gadgets,
Frutiger Aero entries on aesthetics.fandom.com and frutigeraeroarchive.org.

---

## 2. Ground rules for every task

1. Keep behaviour. Windows open, drag, focus, close; taskbar buttons; Start menu with full keyboard
   support; clock and world-time panel; seven games; phone layout; skip link. Do not change any
   `data-*` attribute, `aria-*` attribute, `id`, role or DOM order unless your task says so. The QA
   tools select on `[data-icon-for]`, `[data-start-button]`, `[data-task]`, `[data-window]`,
   `[data-game]`, `[data-clock]`, `[data-taskbar]`.
2. Use tokens (`var(--...)`) and mixins (`@styles`). No raw hex in components except inside art
   (SVG files) and the game palettes in section 11.
3. Self-host everything. No runtime requests to any other domain (no Google Fonts link, no CDN).
4. `backdrop-filter` is only allowed on: `.win`, the taskbar `Bar`, the Start `Menu`, the
   `WorldTimePanel`. Nowhere else (performance). Always write `-webkit-backdrop-filter` too.
5. Every visual change is checked with `shot.sh` and looked at with the Read tool before you
   commit. Desktop 1440x900 and phone 390x844 at least.
6. Run `npx eslint <files>` on JS you touch.

---

## 3. Tokens: `src/styles/variables.js`

Replace the whole `:root` block with this. Names marked KEEP are read by code (Window.js, kit.js,
GlobalStyle) and must not be renamed.

```css
:root {
  /* ---- palette ---- */
  --sky-900: #06325f;
  --sky-700: #0b5ca8;
  --sky-500: #1e88d8;
  --sky-300: #74c6f2;
  --sky-100: #dff3ff;
  --aqua-500: #16b8d4;
  --aqua-300: #7fe3f0;
  --leaf-700: #2e8a1c;
  --leaf-500: #58b92a;
  --leaf-300: #a8e36a;
  --sun: #fff6d8;

  /* ---- surfaces ---- */
  --desktop: #1e88d8; /* KEEP. Shows while the wallpaper loads. */
  --field: #ffffff; /* KEEP. Content areas. */
  --field-edge: rgba(30, 64, 100, 0.38);
  --field-alt: #f4f8fc; /* zebra rows, status bar base */
  --game-bg: linear-gradient(180deg, #f8fcff 0%, #e4f0fa 100%);

  /* glass */
  --glass-tint: rgba(168, 210, 240, 0.42); /* active window, menus */
  --glass-tint-inactive: rgba(205, 222, 238, 0.3); /* windows behind */
  --glass-tint-solid: rgba(190, 220, 242, 0.96); /* no backdrop-filter support */
  --glass-blur: 14px;
  --glass-sat: 170%;
  --glass-edge: rgba(8, 34, 64, 0.62); /* the 1px outer line */
  --glass-hi: rgba(255, 255, 255, 0.7); /* the 1px inner line */
  --glass-sheen: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.62) 0,
    rgba(255, 255, 255, 0.24) 26px,
    rgba(255, 255, 255, 0.06) 27px,
    rgba(255, 255, 255, 0) 70%
  );
  --glass-streaks: linear-gradient(
    112deg,
    rgba(255, 255, 255, 0) 0 16%,
    rgba(255, 255, 255, 0.16) 21%,
    rgba(255, 255, 255, 0) 29%,
    rgba(255, 255, 255, 0) 58%,
    rgba(255, 255, 255, 0.1) 63%,
    rgba(255, 255, 255, 0) 70%
  );

  /* taskbar glass (darker, so the orb and white text pop) */
  --bar-glass: linear-gradient(
    180deg,
    rgba(160, 205, 238, 0.5) 0%,
    rgba(70, 120, 170, 0.55) 49%,
    rgba(22, 62, 104, 0.7) 50%,
    rgba(10, 40, 76, 0.78) 100%
  );
  --bar-edge: rgba(255, 255, 255, 0.45);

  /* ---- text ---- */
  --text: #1b2a3a; /* KEEP */
  --text-muted: #546a80;
  --text-on-glass: #0c1d2e;
  --text-on-bar: #ffffff;
  --heading: #1a4f9c; /* Windows 7 "main instruction" blue */
  --text-on-desktop: #ffffff; /* KEEP */
  --shadow-on-desktop: 0 1px 2px rgba(0, 32, 72, 0.9), 0 0 8px rgba(0, 48, 110, 0.55); /* KEEP */
  --title-glow: 0 0 1px #ffffff, 0 0 6px rgba(255, 255, 255, 0.95),
    0 0 12px rgba(255, 255, 255, 0.8);
  --link: #0a62c4; /* KEEP */
  --link-hover: #0b84e8;

  /* ---- selection and hot-track ---- */
  --select: #3399ff; /* KEEP. Text selection only. */
  --select-text: #ffffff; /* KEEP */
  --hot-fill: linear-gradient(180deg, rgba(234, 246, 255, 0.96) 0%, rgba(205, 232, 252, 0.96) 100%);
  --hot-edge: #8fbfe8;
  --hot-fill-strong: linear-gradient(
    180deg,
    rgba(214, 236, 255, 0.98) 0%,
    rgba(176, 216, 248, 0.98) 100%
  );
  --hot-edge-strong: #5a9ad6;
  --focus: #1f8ee8; /* focus ring */

  /* ---- gloss controls (Windows 7 push button) ---- */
  --btn-edge: #707070;
  --btn-face: linear-gradient(180deg, #f6f6f6 0%, #ebebeb 49%, #dddddd 50%, #cfcfcf 100%);
  --btn-edge-hover: #3c7fb1;
  --btn-face-hover: linear-gradient(180deg, #eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);
  --btn-edge-down: #2c628b;
  --btn-face-down: linear-gradient(180deg, #e5f4fc 0%, #c4e5f6 49%, #98d1ef 50%, #68b3db 100%);
  --close-face: linear-gradient(180deg, #e9a99c 0%, #d9796a 45%, #c4402c 50%, #d2654c 100%);
  --close-face-hover: linear-gradient(180deg, #fbc4b6 0%, #f08a73 45%, #e0412a 50%, #f07b5c 100%);
  --close-face-down: linear-gradient(180deg, #c4705f 0%, #b3402d 50%, #8f1e0f 51%, #b04a32 100%);
  --close-edge: rgba(70, 10, 0, 0.75);

  /* ---- shadows ---- */
  --shadow-win: 0 14px 44px rgba(0, 28, 64, 0.45), 0 3px 10px rgba(0, 20, 50, 0.28);
  --shadow-win-inactive: 0 8px 26px rgba(0, 28, 64, 0.26), 0 2px 6px rgba(0, 20, 50, 0.16);
  --shadow-menu: 0 10px 30px rgba(0, 28, 64, 0.4);

  /* ---- fonts ---- */
  --main-font: 'Segoe UI', 'Open Sans', Frutiger, 'Myriad Pro', 'Helvetica Neue', Arial, sans-serif; /* KEEP */
  --main-large-font: var(--main-font); /* KEEP. Used at weight 300 for big type. */
  --window-title-font: var(--main-font); /* KEEP */
  --font-base-size: 1.5rem; /* KEEP. 15px. */

  /* ---- sizes ---- */
  --taskbar-h: 40px; /* KEEP */
  --taskbar-total: calc(var(--taskbar-h) + env(safe-area-inset-bottom, 0px)); /* KEEP */
  --titlebar-h: 30px; /* KEEP */
  --chrome-btn: 20px; /* KEEP. Height of the close button. */
  --close-w: 44px; /* width of the close button */
  --frame: 6px; /* glass frame at sides and bottom */
  --icon-size: 64px; /* KEEP */
  --cascade-step: 30px; /* KEEP. One title bar. */
  --orb: 44px; /* Start orb diameter */
  --radius-win: 8px;
  --radius-ctl: 3px;
  --radius-menu: 6px;

  /* ---- motion ---- */
  --ease-out: cubic-bezier(0.16, 0.84, 0.3, 1);
  --ease-in: cubic-bezier(0.5, 0, 0.75, 0.2);
  --ease-spring: cubic-bezier(0.2, 0.9, 0.3, 1.12);
  --dur-fast: 120ms;
  --dur-open: 220ms;
  --dur-close: 150ms;
  --dur-hover: 160ms;

  /* ---- layers (KEEP all) ---- */
  --z-wallpaper: 0;
  --z-icons: 1;
  --z-window-base: 1000;
  --z-taskbar: 10000;
  --z-skip: 100000;
}

@media (max-width: 36em) {
  :root {
    --taskbar-h: 48px;
    --titlebar-h: 44px;
    --chrome-btn: 30px;
    --close-w: 52px;
    --orb: 48px;
    --frame: 0px;
  }
}

@media (max-height: 500px) {
  :root {
    --icon-size: 40px;
  }
}
```

**Legacy aliases.** Until the round-3 cleanup task, append this block inside `:root` so components
nobody has migrated yet still render sensibly. The cleanup task deletes it and greps that no
`--chrome`, `--bevel-*` or `--title-*` remains.

```css
/* legacy XP names, delete in cleanup */
--chrome: #e9f1f8;
--bevel-hi: #ffffff;
--bevel-light: #f2f6fa;
--bevel-shadow: #9fb3c6;
--bevel-dark: #5a7088;
--title-active: var(--sky-700);
--title-active-text: var(--text-on-glass);
--title-inactive: transparent;
--title-inactive-text: var(--text-muted);
```

Also set `config.colors.bg` and `config.colors.chrome` in `src/config.js` to `'#1e88d8'` and
`'#e9f1f8'` (the manifest's theme colour).

---

## 4. Typography

- Family: `var(--main-font)`. Self-host **Open Sans** (SIL OFL 1.1) as the stand-in for Segoe UI.
  Files: `src/fonts/open-sans/open-sans-latin-{300,400,600,700}-normal.woff2` from
  `https://cdn.jsdelivr.net/npm/@fontsource/open-sans@5.0.28/files/open-sans-latin-<w>-normal.woff2`
  (verified 200), plus `src/fonts/open-sans/OFL.txt` (the OFL text with Open Sans's copyright line,
  "Copyright 2020 The Open Sans Project Authors"). `@font-face` family name `'Open Sans'`,
  `font-display: swap`. Do **not** ship Selawik: its Reserved Font Name forbids a converted woff2.
- Remove Web437 and Silkscreen from `fonts.js` and delete `src/fonts/web437` and
  `src/fonts/silkscreen` in the same task (nothing else may use them).
- `body`: 15px, weight 400, line-height 1.5, `letter-spacing: 0` (delete the 0.5px).
- Scale (px / weight / colour):
  - Wallpaper name: 34 / 300 / white, `--shadow-on-desktop`.
  - Window heading (`Heading` in ui.js): 22 / 300 / `--heading`, line-height 1.2, margin 0 0 12px.
  - Subheading (`SubHeading`): 13 / 600 / `--heading`, uppercase, `letter-spacing: 0.06em`,
    underline is a 1px `border-image: linear-gradient(90deg, var(--sky-300), rgba(116,198,242,0)) 1`.
  - Body, lists, links: 15 / 400 / `--text`.
  - Window title: 15 / 400 / `--text-on-glass` with `text-shadow: var(--title-glow)`.
  - Taskbar button, Start menu items, clock: 14 / 400.
  - Desktop icon label: 14 / 400 / white, `--shadow-on-desktop`.
  - Status bar / hints / captions: 13 / 400 / `--text-muted`.
- Numbers in readouts and the clock: `font-variant-numeric: tabular-nums`.

---

## 5. Mixins: `src/styles/mixins.js`

Add these exports (exact names). Export them from `src/styles/index.js` too. Keep `visuallyHidden`.

```js
// Aero glass: the window frame, the Start menu, flyouts. Pair with a radius.
export const glass = css`
  background-color: var(--glass-tint);
  background-image: var(--glass-streaks), var(--glass-sheen);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  border: 1px solid var(--glass-edge);
  box-shadow: inset 0 0 0 1px var(--glass-hi), var(--shadow-win);

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background-color: var(--glass-tint-solid);
  }
`;

// The same sheet when it is not in front: clearer, flatter, smaller shadow.
export const glassInactive = css`
  background-color: var(--glass-tint-inactive);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5), var(--shadow-win-inactive);
`;

// Windows 7 push button. Hover and pressed are built in.
export const gloss = css`
  border: 1px solid var(--btn-edge);
  border-radius: var(--radius-ctl);
  background: var(--btn-face);
  color: var(--text);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.75);
  transition: background var(--dur-hover) var(--ease-out), border-color var(--dur-hover) var(
        --ease-out
      );

  &:hover {
    border-color: var(--btn-edge-hover);
    background: var(--btn-face-hover);
  }
`;

export const glossPressed = css`
  border-color: var(--btn-edge-down);
  background: var(--btn-face-down);
  box-shadow: inset 0 1px 3px rgba(0, 40, 80, 0.35);
  transition: none;
`;

// Primary action: an aqua gel pill. Use at most once per window.
export const glossAqua = css`
  border: 1px solid #0b5c96;
  border-radius: 999px;
  background: linear-gradient(180deg, #8fdcff 0%, #3cb2f0 48%, #1690dc 50%, #34b6f2 100%);
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 50, 100, 0.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 1px 3px rgba(0, 60, 120, 0.35);

  &:hover {
    filter: brightness(1.08) saturate(1.1);
  }
`;

// A white content field (replaces sunken / inset).
export const field = css`
  background: var(--field);
  border: 1px solid var(--field-edge);
  border-radius: 2px;
  box-shadow: inset 0 1px 2px rgba(0, 30, 60, 0.08);
`;

// A thin divider well (replaces sunkenThin): the status bar, the clock tray.
export const fieldThin = css`
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-ctl);
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.18);
`;

// Explorer-style row highlight: Start menu rows, folder entries, hovered icons on white.
export const hotTrack = css`
  border: 1px solid var(--hot-edge);
  border-radius: var(--radius-ctl);
  background: var(--hot-fill);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
`;

export const hotTrackStrong = css`
  border: 1px solid var(--hot-edge-strong);
  border-radius: var(--radius-ctl);
  background: var(--hot-fill-strong);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
`;

// Keyboard focus: a soft blue ring. Never remove focus without this.
export const focusRing = css`
  &:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(31, 142, 232, 0.25);
  }
`;

// Windows 7 scrollbar for every scroller.
export const aeroScrollbar = css`
  &::-webkit-scrollbar {
    width: 14px;
    height: 14px;
  }
  &::-webkit-scrollbar-track,
  &::-webkit-scrollbar-corner {
    background: linear-gradient(90deg, #e6ecf2, #f5f8fb);
  }
  &::-webkit-scrollbar-thumb {
    border: 1px solid #9aa9b8;
    border-radius: 4px;
    background: linear-gradient(90deg, #f4f7fa 0%, #e3e9ef 50%, #d5dee7 100%);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  }
  &::-webkit-scrollbar-thumb:hover {
    border-color: var(--btn-edge-hover);
    background: linear-gradient(90deg, #eaf6fd 0%, #c8e8fb 50%, #a7d9f5 100%);
  }
  @supports not selector(::-webkit-scrollbar) {
    scrollbar-color: #b8c6d4 #eef3f7;
  }
`;
```

**Legacy aliases** (same file, removed in cleanup), so un-migrated imports keep compiling:

```js
// legacy XP names, delete in cleanup
export const bevel = gloss;
export const bevelPressed = glossPressed;
export const bevelWindow = glass;
export const sunken = field;
export const sunkenThin = fieldThin;
export const inset = css`
  padding: 2px;
  ${field};
`;
export const focusRect = focusRing;
export const retroScrollbar = aeroScrollbar;
```

In `ui.js`, rename `BevelButton` / `BevelLink` to `GlossButton` / `GlossLink` (height 26px, padding
0 14px, 14px text, `gloss` + `focusRing`, `&:active { glossPressed }`, 44px high on phones) and
keep `export const BevelButton = GlossButton; export const BevelLink = GlossLink;` until cleanup.
`Inset` uses `field` with 8px padding.

---

## 6. Windows (GlobalStyle `.win*`)

Anatomy, outside in: 1px dark edge, 1px white inner line, glass frame (`--frame` = 6px at sides
and bottom, the title bar on top), then the white content field with its own 1px edge.

```
.win                     glass; border-radius var(--radius-win); padding 0 var(--frame) var(--frame);
                         color var(--text). Keep every position/size rule exactly as it is.
.win:not(.is-active)     glassInactive
.win__titlebar           height var(--titlebar-h); padding 0 0 0 10px; background none; no colour
                         change between states.
.win__title              15px/1 var(--window-title-font), weight 400, color var(--text-on-glass),
                         text-shadow var(--title-glow); inactive: color var(--text-muted), opacity .8
.win__close              width var(--close-w); height var(--chrome-btn); align-self flex-start;
                         margin-top -1px (it hangs from the top edge, like Windows 7);
                         border 1px solid var(--close-edge); border-top 0;
                         margin-right 0 (it sits flush against the frame's right edge);
                         border-radius 0 0 5px 5px;
                         background var(--close-face); box-shadow inset 0 0 0 1px rgba(255,255,255,.45);
                         hover var(--close-face-hover) + 0 0 10px rgba(255,120,80,.8) glow;
                         active var(--close-face-down); inactive window: opacity .7 and greyed
                         (filter: saturate(.25)) until hovered. Focus: focusRing with outline-offset 1px.
                         The glyph is GlyphClose (section 9), white, centred.
.win__body               field; margin 0; padding 0; overflow hidden.
.win__area               padding 16px 20px; aeroScrollbar. Links: var(--link), underline on hover
                         only, hover colour var(--link-hover).
.win__footer             sits on the glass frame under the body:
                         margin-top 4px; padding 4px 10px; 13px text var(--text-on-glass);
                         background rgba(255,255,255,.35); border-radius var(--radius-ctl); fieldThin.
.win--game .win__body    background var(--game-bg); padding 0.
.win--game .win__area    padding 4px.  (frame 6+6 + area 4+4 = 20 = the "+ 20" in registry.js)
```

The window must clip the glass corners: add `overflow: hidden` only if it does not clip the focus
ring or the close glow; otherwise round the title bar's own corners. Check with a screenshot.

`kit.js` constants: `FRAME` must equal the window's vertical chrome outside the title bar
(bottom frame 6 + body edges 2 = 8, so it stays 8 on desktop). Leave `AREA_PAD` at 12 only if the
measured game still fits at 1440x900 and 1280x720; otherwise set it to 8. Measure, do not guess.

**Phone (max-width 36em) and short landscape:** the window is full screen; `border-radius: 0`,
no side or bottom frame (`--frame: 0`), no outer shadow, the title bar keeps the glass. The close
button is 52x30 inside the 44px bar with its existing 44px `::after` touch target.

---

## 7. Taskbar, Start orb, Start menu, clock

### Taskbar (`Taskbar.js` `Bar`)

- Height `var(--taskbar-total)`, `background: var(--bar-glass)`, `backdrop-filter: blur(12px)
saturate(160%)` (+ webkit), `border-top: 1px solid var(--bar-edge)`,
  `box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 -2px 12px rgba(0,30,70,.25)`.
- Padding `0 6px env(safe-area-inset-bottom)`; gap 6px; items vertically centred.
- Left gutter for the orb: the Start button box is `calc(var(--orb) + 12px)` wide.

### Task buttons (`TaskButton`)

- `flex: 0 1 168px`, height 32px (phone hidden as now), radius `var(--radius-ctl)`, padding
  0 10px 0 6px, 14px white text with `text-shadow: 0 1px 2px rgba(0,0,0,.6)`, gap 6px.
- Show the window's icon at 20px before the title: look it up with
  `ICONS[(DESKTOP_ICONS.find(i => i.target === w.id) || GAME_LIST.find(g => g.id === w.id) || {}).icon]`.
- Resting: `border: 1px solid rgba(255,255,255,.28)`, background
  `linear-gradient(180deg, rgba(255,255,255,.22) 0, rgba(255,255,255,.08) 50%, rgba(255,255,255,0) 51%, rgba(255,255,255,.06) 100%)`,
  `box-shadow: inset 0 0 0 1px rgba(0,20,50,.35)`.
- Hover: background alpha roughly doubled + `0 0 10px rgba(140,210,255,.55)` glow.
- `aria-pressed='true'` (window in front): border `rgba(255,255,255,.6)`, background
  `linear-gradient(180deg, rgba(200,235,255,.55) 0, rgba(120,190,240,.35) 50%, rgba(60,140,210,.35) 51%, rgba(120,200,255,.45) 100%)`,
  plus an inner bottom glow `inset 0 -6px 10px -4px rgba(150,230,255,.8)`.
- Focus: `focusRing` with white outline (`outline-color: #fff`).

### Start orb (`StartMenu.js` `StartButton`)

- The button keeps its text "Peter Shamoun" but wrapped in a `visuallyHidden` span, so the
  accessible name is unchanged. Delete the `Tile` + `GlyphApp`.
- It renders `<img src={withPrefix('/aero/orb/start-orb.svg')} width/height = orb alt="">`.
- Box: `width/height: var(--orb)`, `border: 0`, `background: none`, `border-radius: 50%`,
  centred in its gutter; it **overhangs** the taskbar top by 4px (`margin-top: -8px` on desktop,
  none on phone) because the Windows 7 orb does.
- Hover: `filter: brightness(1.12) saturate(1.15)` and `box-shadow: 0 0 14px 4px rgba(120,220,255,.75)`,
  transition `var(--dur-hover) var(--ease-out)`.
- Pressed / `aria-expanded='true'`: `filter: brightness(.92)`, glow `0 0 10px 2px rgba(90,200,255,.9)`.
- Focus: `focusRing` with `outline-offset: 3px; border-radius: 50%`.

### Start menu (`Menu`)

- `glass` + `border-radius: var(--radius-menu)` + `box-shadow: inset 0 0 0 1px var(--glass-hi), var(--shadow-menu)`,
  padding 6px, width `min(260px, 100vw - 8px)`, bottom offset 6px above the taskbar.
- Inside, the item list sits on a white panel: put the background on the menu's first area with
  `background: rgba(255,255,255,.92); border: 1px solid var(--field-edge); border-radius: 4px; padding: 4px`
  (do this with a CSS rule on the items, e.g. a wrapping `div role="none"`, without changing the
  menuitem order).
- Items: 14px `--text`, min-height 40px (44 phone), padding 4px 12px 4px 6px, gap 10px, icon 32px,
  border 1px solid transparent, radius `--radius-ctl`. Focus/hover (the pointer already moves focus):
  `hotTrack`, no outline. Keyboard focus is the hot-track box (that is the Windows 7 look); keep it.
- Separator: 1px, `linear-gradient(90deg, transparent, rgba(30,64,100,.25), transparent)`, margin 4px 8px.
- "Tidy desktop": the 32px icon is `IconTidy` (section 9) instead of the `Tile` + `GlyphMenu`.
- Opening motion: section 10.

### Clock (`Clock.js`)

- Tray (`Tray` in Taskbar): `fieldThin` on the bar glass, padding 0 4px.
- `ClockButton`: 14px white, tabular nums, `text-shadow: 0 1px 2px rgba(0,0,0,.6)`, radius 3px;
  hover gets the task-button hover background.
- `WorldTimePanel`: `glass`, radius `--radius-menu`, `--shadow-menu`, padding 10px 14px; rows 14px
  `--text-on-glass` with `--title-glow`, label in weight 600.

---

## 8. Desktop icons, the Games folder, the wallpaper name

### Desktop icon (`DesktopIcon.js`)

- Picture `var(--icon-size)` (64px; 40px on short screens). The image gets
  `filter: drop-shadow(0 2px 3px rgba(0,30,60,.45))`.
- Label: 14px/18px, white, `--shadow-on-desktop`, max two lines: `white-space: normal;
max-width: 96px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`.
- The whole button is the selection box (not the label): padding 4px 4px 3px, radius 3px,
  border 1px solid transparent.
  - hover: `background: linear-gradient(180deg, rgba(255,255,255,.28), rgba(255,255,255,.10)); border-color: rgba(255,255,255,.55)`.
  - focus-visible / active: `background: linear-gradient(180deg, rgba(190,228,255,.50), rgba(120,190,245,.35)); border-color: rgba(210,238,255,.95); box-shadow: inset 0 0 0 1px rgba(255,255,255,.35)`.
  - no outline (the box is the focus indicator; it must be visible on the wallpaper: check it).
- `DesktopIcons` grid: `grid-auto-columns: 104px`, rows `calc(var(--icon-size) + 50px)`, row-gap 6px.
  Phone: unchanged layout.

### Games folder (`GamesWindow.js`)

- Grid `minmax(96px, 1fr)`, gap 8px. Entry: icon 48px, label 13px `--text`, padding 6px 4px,
  border 1px solid transparent, radius 3px. Hover: `hotTrack`. Focus-visible / active:
  `hotTrackStrong`. No dotted outline.

### Wallpaper name (`Wallpaper.js`)

- Name: 34px/1.1, weight 300, white, `--shadow-on-desktop`. Lines: 15px weight 400, opacity .92.
- It also renders the ambient bubbles (section 10), `aria-hidden`.

---

## 9. Asset manifest

Every asset is drawn by us (SVG by hand, or SVG/HTML rendered with `render.sh`, finished in PIL).
No stock photos. Editable sources live in `design/aero/<asset>/` at the repo root (not shipped by
Gatsby); shipped files live under `static/aero/` (served at `/aero/...`). Always reference them in
code with `withPrefix('/aero/...')` from `gatsby`.

### Shared art direction for all icons and the orb

- Light comes from the top left. Every object has: a base gradient (lighter top-left, richer
  bottom-right), an edge stroke 3-4 units wide in a **darker shade of the object's own hue**
  (never pure black), a white gloss highlight on the upper half (a shape filled with
  `white` 0.75 -> 0 opacity top to bottom), and a faint light rim on the bottom edge (white 0.3).
- Slight 3/4 perspective is welcome (Vista style), but silhouettes must read at 32px.
- No baked drop shadows (CSS adds them), no text except playing-card pips, no SVG `filter`
  except at most two `feGaussianBlur` per file, no embedded rasters, no external refs.
- Prefix every `id` in `<defs>` with the file name (`about-gloss`, `about-edge`...).
- Size budget: 14KB per icon SVG (run it through a whitespace-strip pass; keep paths to 1 decimal).
- Acceptance: render at 32, 48 and 64px on the wallpaper and on white (`render.sh`), look at both,
  and post the contact sheet path on the board.

### Wallpaper

| Path                                      | Format                            | Size      | Budget   |
| ----------------------------------------- | --------------------------------- | --------- | -------- |
| `static/aero/wallpaper/aero-desktop.webp` | WebP q80                          | 2560x1600 | <= 400KB |
| `static/aero/wallpaper/aero-desktop.jpg`  | JPEG q82 progressive              | 2560x1600 | <= 400KB |
| `static/aero/wallpaper/aero-phone.webp`   | WebP q80                          | 1200x2600 | <= 250KB |
| `static/aero/wallpaper/aero-phone.jpg`    | JPEG q82 progressive              | 1200x2600 | <= 250KB |
| `design/aero/wallpaper/`                  | the source SVG/HTML + `finish.py` |           |          |

**Decision: procedural, not a CC0 photo.** Reasons: (1) the old wallpaper is a Bliss-style
sky-and-grass photo, and another photo of a green hill would read as "still XP"; (2) the signature
Aero wallpapers (Vista Aurora, the 7 light ribbons) are synthetic light, which we can draw well and
cannot license; (3) we need exact control of the composition (calm column for the icons, calm
corner for the name, flare away from where windows open) and of the palette (it must match the
tokens); (4) it is reproducible, so any later round can tweak and re-render it; (5) zero licence
risk. Build it as an SVG (or HTML with CSS gradients/blurs) at 2560x1600, render with `render.sh`,
then finish in PIL: add gaussian grain sigma ~1.4 to kill banding, then encode.

Composition (desktop, percentages of width/height):

1. Sky: vertical gradient `#0a4a92` (0%) -> `#1e88d8` (34%) -> `#6cc6f2` (60%) -> `#e2f6ff` (76%).
   Two or three very soft cumulus banks (stacked blurred white ellipses, opacity .5-.8) low in the
   sky, mostly right of centre.
2. Aurora light ribbons: three long ribbons sweeping from the lower left (0%, 70%) up to the upper
   right (100%, 15%) as S-curves; colours white -> `#9fefff` -> `#b4f58a` at .25-.55 opacity,
   blurred 8-30px, blended with `screen`/`lighten`; one ribbon has a crisp 2-3px bright core line.
   This is the "Vista swoosh" and the most important element: make it elegant, not busy.
3. Lens flare: a white-gold core (`--sun`) at (80%, 16%), 140px glow, a soft starburst, then
   4-6 faint circular/hexagonal ghosts along the line toward (35%, 70%), opacity .05-.15.
4. Hills: a back hill and a front hill across the bottom 20-32%, stylised and glossy, not photo:
   back `#3c9e28` -> `#86d148`, front `#55bd2a` -> `#b2ec66`, each with a blurred white rim light
   along the crest (opacity .5) and a subtle darker band at the base. The crest line dips lowest
   around x = 70-85% so the name in the bottom-right corner sits on mid-green.
5. Bubbles: 25-40 glossy soap bubbles (radius 8-90px) rising in the right third and over the hill
   on the right; transparent centres, iridescent rim (cyan -> violet -> green at low opacity),
   white crescent highlight top-left, small sparkle dot. **None at x < 240px** (icon column) and
   none in the centre 40% of the width above y = 65% (windows open there).
6. Bokeh: 50-80 soft discs, white/aqua, blur 6-20px, opacity .06-.2, mostly upper right.
7. Calm zones: x 0-240px full height (icons), and the bottom-right 440x150px (the name) must be
   low-contrast mid-tone so white text with the shadow token stays legible.

Phone (1200x2600): same elements re-composed for portrait; the hill fills the bottom 22%, the
flare top right, ribbons cross diagonally through the middle, bubbles along the right edge and
behind the name at the bottom right. The top 360px row (icons) stays calm.

CSS (GlobalStyle `body::before`): desktop `image-set(url('/aero/wallpaper/aero-desktop.webp') type('image/webp'), url('/aero/wallpaper/aero-desktop.jpg') type('image/jpeg'))`
with a plain `url(.jpg)` line before it; inside `${media.phone}` the same with the phone files.
Delete `static/wallpaper.{webp,jpg}` in the same task.

### Desktop icons (viewBox `0 0 256 256`, shown at 64 / 32)

| Id         | Path                               | Art direction                                                                                                                                                                                        |
| ---------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| about      | `static/aero/icons/about.svg`      | A glossy white contact card, slightly tilted, with a sky-blue header band and a round aqua portrait disc holding a simple white person silhouette (head + shoulders); two grey text lines beside it. |
| experience | `static/aero/icons/experience.svg` | A glossy amber-to-chestnut leather briefcase (`#f3a43b` -> `#a4561a`) with a brushed-silver handle and clasp, strong gloss across the top face.                                                      |
| projects   | `static/aero/icons/projects.svg`   | The Vista folder: open manila folder (`#ffe08a` -> `#e7b33c`) with a translucent glossy front flap, a blue blueprint sheet and a white page peeking out.                                             |
| research   | `static/aero/icons/research.svg`   | A clear glass Erlenmeyer flask, glass rendered with edge highlights and a faint aqua tint, half full of glowing green liquid (`#b6f35a` -> `#3fae1e`) with three rising bubbles.                     |
| contact    | `static/aero/icons/contact.svg`    | A white glossy envelope seen in 3/4, flap edged in sky blue, with a small aqua glass "@" disc sealing it (the @ is a drawn path, not text).                                                          |
| games      | `static/aero/icons/games.svg`      | A pearl-white glossy gamepad (generic, not an Xbox/PlayStation copy) with a blue d-pad and four glossy gel buttons in green, aqua, orange, red.                                                      |
| tidy       | `static/aero/icons/tidy.svg`       | Three overlapping glass window panes in sky blue, neatly stacked with a small white sparkle at the top right. Used in the Start menu at 32px only.                                                   |

### Game icons (viewBox `0 0 256 256`, shown at 48 / 20 / 32)

| Id          | Path                                      | Art direction                                                                                                                                          |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| minesweeper | `static/aero/icons/games/minesweeper.svg` | A glossy sky-blue rounded tile (Windows 7 Minesweeper) with a black glossy mine sphere on it: spikes, a white specular dot.                            |
| solitaire   | `static/aero/icons/games/solitaire.svg`   | Two fanned playing cards, white with rounded corners: front card a red heart ace, back card a blue patterned back with gloss.                          |
| snake       | `static/aero/icons/games/snake.svg`       | A coiled snake made of glossy green gel beads (`#9be85a` -> `#2f9a1c`), friendly eyes, beside a small glossy red apple.                                |
| blocks      | `static/aero/icons/games/blocks.svg`      | Four glossy gel cubes forming a T tetromino, each cube a different jewel colour (aqua, green, amber, magenta-pink, not purple), strong top-face gloss. |
| bricks      | `static/aero/icons/games/bricks.svg`      | Two staggered rows of glossy bricks (orange, green, blue), a shiny aqua ball, and a silver gel paddle below.                                           |
| paddle      | `static/aero/icons/games/paddle.svg`      | A dark-blue rounded glass screen with two glowing white-aqua paddles and a glowing ball between them.                                                  |
| invaders    | `static/aero/icons/games/invaders.svg`    | A cute classic invader silhouette made of green glossy gel (rounded cells, not hard pixels), with a reflection under it.                               |

### Start orb

| Path                            | Format                   | Size                                             |
| ------------------------------- | ------------------------ | ------------------------------------------------ |
| `static/aero/orb/start-orb.svg` | SVG, viewBox `0 0 96 96` | shown at 44px (48px phone)                       |
| `src/images/logo.png`           | PNG 512x512, transparent | the favicon/manifest icon, rendered from the orb |

Art: a perfect sphere. Outer ring 3 units, dark navy glass `#06325f` with a thin white outer
highlight. Body: radial gradient centred low (50%, 75%): `#7fe3f0` (aqua glow) -> `#1e88d8` ->
`#0b3f7a` at the rim. Upper half: a large white gloss ellipse (opacity .85 -> .05) inset 6 units
from the rim, ending just above the equator. Lower third: a soft aqua inner glow arc. Emblem in the
centre: a white water droplet with a small leaf-green leaf curling off its right side (the
"fresh/eco" Aero motif), white at .95 with a faint aqua inner shade; it must NOT resemble the
Windows flag. Render to PNG with `render.sh --transparent` for `logo.png`.

### Window glyph

- `GlyphClose` (in `src/components/desktop/icons/glyphs.js`): rewrite as a plain vector SVG
  component (not the pixel `makeIcon`): viewBox `0 0 12 12`, an X of two strokes,
  `stroke="#fff" stroke-width="2" stroke-linecap="round"` from (2.5,2.5) to (9.5,9.5), drawn
  twice: first in `rgba(80,10,0,.55)` offset 0.5 down as a shadow, then white. Rendered at 12px
  (16px on phones). `GlyphApp` and `GlyphMenu` are deleted with the pixel set in cleanup.

### Effects

| Path                        | Format                     | Size          | Use                                                                                                                                                                 |
| --------------------------- | -------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `static/aero/fx/bubble.svg` | SVG, viewBox `0 0 256 256` | shown 24-90px | Ambient bubbles in `Wallpaper.js`. Same bubble recipe as the wallpaper: transparent centre, iridescent rim, white crescent highlight top-left, sparkle dot. <= 4KB. |

No runtime lens-flare overlay (it is baked into the wallpaper). No custom cursor (Aero used the
standard arrow; `cursor: default` stays as it is).

### Fonts

`src/fonts/open-sans/` as in section 4.

### Credits

Anything not drawn by us needs `static/aero/credits/<task-id>.md` with source URL and licence. The
fonts get `static/aero/credits/fonts.md`: Open Sans, SIL OFL 1.1, the jsDelivr/Fontsource URL.

---

## 10. Motion

| What                         | How                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Window opens                 | `@keyframes win-open { from { opacity: 0; transform: <current translate> scale(.94) translateY(8px) } }`, `var(--dur-open) var(--ease-spring)`. The `.win` transform is the drag translate, so put the animation on an inner wrapper or use the individual `scale` / `translate` properties (`scale: .94` animates without touching `transform`). It replays whenever `hidden` is removed, which is exactly "on open". |
| Window closes                | Instant (the window is `hidden`). Do not add exit animation state in this project.                                                                                                                                                                                                                                                                                                                                     |
| Minimise                     | There is no minimise button. Do not add one.                                                                                                                                                                                                                                                                                                                                                                           |
| Raise / focus                | No motion; the glass tint and shadow switch with `transition: background-color, box-shadow var(--dur-fast) var(--ease-out)`.                                                                                                                                                                                                                                                                                           |
| Start menu / world-time open | `opacity 0 -> 1`, `translate: 0 8px -> 0`, `var(--dur-fast) var(--ease-out)`.                                                                                                                                                                                                                                                                                                                                          |
| Hover on buttons, orb, icons | `var(--dur-hover) var(--ease-out)` on background, border-color, filter, box-shadow only.                                                                                                                                                                                                                                                                                                                               |
| Ambient bubbles              | 6-8 `bubble.svg` spans in `Wallpaper.js`, absolutely placed in the right 35% of the screen, rising 120-240px and drifting 20px sideways over 18-40s, `ease-in-out infinite alternate`, opacity .35-.7. Hidden on phones.                                                                                                                                                                                               |
| Reduced motion               | The existing global `prefers-reduced-motion` block stays and kills all of the above. Bubbles must also be `display: none` under it.                                                                                                                                                                                                                                                                                    |

Never animate layout properties (width, height, top, left); only `opacity`, `transform`,
`scale`, `translate`, `filter`.

---

## 11. Games (`games/kit.js` and the seven games)

The board stays crisp and readable; the chrome around it turns glossy.

- `Stage` `StageInner`: `background: var(--game-bg)`, font 14px `var(--main-font)`.
- `Bar`: no bevel. `background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(226,238,248,.9)); border: 1px solid var(--field-edge); border-radius: 4px`.
- `Readout`: a dark glass LCD: `background: linear-gradient(180deg, #13324f 0%, #061a2c 100%)`,
  `border: 1px solid #041220`, radius 3px, `color: #8ff3ff`, `text-shadow: 0 0 6px rgba(120,240,255,.8)`,
  font `600 20px/1 var(--main-font)`, tabular nums.
- `Caption`, `Hint`: 13px `--text-muted`.
- `Btn`: `gloss` + `focusRing`, height 28px, radius 3px; `&:active, &[aria-pressed='true']` -> `glossPressed`.
- `Well`: `field` with radius 4px; default background `#ffffff`.
- `Message` `Box`: `glass` with radius `--radius-menu`, text `--text-on-glass`; the veil is
  `rgba(6, 40, 80, .35)`.
- `COLORS` keeps its keys (the games use them) with new values:
  `black #0c1d2e, white #ffffff, chrome #e9f1f8, light #f6fafd, shadow #9fb3c6, navy #0b3f7a,
blue #1e88d8, teal #0f9bb5, cyan #16b8d4, green #2e9a1c, lime #7ad63a, red #e0412a,
maroon #9c2a1a, yellow #f7c533, orange #f3923b, purple #c2449a` (purple becomes a magenta-pink).
- Per game, where the drawing code allows it cheaply: pieces get a top gloss (a white
  0.45 -> 0 gradient over the upper half of each block/brick/paddle/bead) and a 1px darker edge of
  their own hue. Minesweeper unopened cells look like Windows 7: glossy sky-blue tiles
  (`#9fd6f7` -> `#3b8fd6`, white gloss top half); opened cells flat `#eef4fa` with a 1px
  `#c5d4e2` grid. Solitaire felt: radial `#3fa34a` centre -> `#1d6b2a` edge. Snake board: soft
  green grass gradient. Invaders/Pong/Breakout boards: deep night-sky blue gradient
  (`#0b2b52` -> `#04142a`) with a few faint stars.

---

## 12. Code contracts (who touches what)

| File                                                   | Change                                                                                                                                                                                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/variables.js`                              | Section 3 tokens + legacy alias block.                                                                                                                                                                                             |
| `src/styles/fonts.js`, `src/fonts/open-sans/*`         | Section 4.                                                                                                                                                                                                                         |
| `src/styles/mixins.js`, `src/styles/index.js`          | Section 5 mixins + legacy aliases; export the new names.                                                                                                                                                                           |
| `src/styles/GlobalStyle.js`                            | Base type (section 4), `::selection` with `--select`, focus default = `outline: 2px solid var(--focus); outline-offset: 2px`, skip link uses `gloss`, wallpaper (section 9), `.win*` (section 6), window-open motion (section 10). |
| `src/config.js`                                        | `colors.bg '#1e88d8'`, `colors.chrome '#e9f1f8'`.                                                                                                                                                                                  |
| `src/components/desktop/icons/aero.js` (new)           | `makeAeroIcon(name, path)` returns a component with the same signature as `makeIcon` (`{ size, title, ...rest }`, default size 64): renders `<img src={withPrefix(path)} width={size} height={size} alt={title                     |     | ''} aria-hidden={title ? undefined : 'true'} draggable={false} decoding="async" />`. Exports `IconAbout ... IconInvaders`and`IconTidy` with the paths in section 9 (`IconBlocks`->`blocks.svg` etc.). |
| `src/components/desktop/icons/index.js`                | Import the icons from `./aero` instead of `./desktop` / `./games`; same export names; add `IconTidy`; `ICONS` map unchanged plus `IconTidy`.                                                                                       |
| `src/components/desktop/icons/glyphs.js`               | `GlyphClose` as vector (section 9).                                                                                                                                                                                                |
| `icons/desktop.js`, `icons/games.js`, `icons/pixel.js` | Deleted in cleanup once nothing imports them.                                                                                                                                                                                      |
| `Window.js`                                            | No logic change. Markup only if the open animation needs an inner wrapper.                                                                                                                                                         |
| `Taskbar.js`, `StartMenu.js`, `Clock.js`               | Section 7. `StartMenu.js` imports `withPrefix` from `gatsby` for the orb.                                                                                                                                                          |
| `DesktopIcon.js`, `DesktopIcons.js`, `Wallpaper.js`    | Section 8 and the bubbles from section 10 (`/aero/fx/bubble.svg`).                                                                                                                                                                 |
| `windows/GamesWindow.js`, `windows/*`                  | Section 8; content windows use `Heading`, `SubHeading`, `GlossButton` from `ui.js`, no new raw colours.                                                                                                                            |
| `src/components/desktop/ui.js`                         | Section 4 type, section 5 `GlossButton`/`GlossLink`, `Inset` = `field`. `Lines` 15px.                                                                                                                                              |
| `src/components/games/kit.js` + games                  | Section 11.                                                                                                                                                                                                                        |

Shipped paths, one list: `static/aero/wallpaper/aero-desktop.{webp,jpg}`,
`static/aero/wallpaper/aero-phone.{webp,jpg}`, `static/aero/icons/{about,experience,projects,research,contact,games,tidy}.svg`,
`static/aero/icons/games/{minesweeper,solitaire,snake,blocks,bricks,paddle,invaders}.svg`,
`static/aero/orb/start-orb.svg`, `static/aero/fx/bubble.svg`, `src/images/logo.png`,
`src/fonts/open-sans/open-sans-latin-{300,400,600,700}-normal.woff2`, `src/fonts/open-sans/OFL.txt`,
`static/aero/credits/*.md`.

---

## 13. Do not

- No pixel fonts, no monospace UI type, no `shape-rendering: crispEdges` on new art.
- No grey bevels, no 2px inset/outset box-shadow edges, no dotted focus rectangles, no navy
  title bars. If it looks like Windows 98/XP, it is wrong.
- No flat 2020s minimalism: no flat single-colour buttons, no hairline-only cards, no
  "neumorphism", no huge empty white space, no Inter/Roboto/system-ui as the visible face.
- No emoji anywhere (UI, labels, icons, commit messages, board posts).
- No AI-slop gradients: no purple-to-pink or indigo-to-violet hero gradients, no neon glows on
  black, no glassmorphism cards stacked on a purple blob. Our gradients are sky, aqua, leaf, white.
- No black outlines on icons; outlines are a darker shade of the fill.
- No real brand marks (Windows flag, Xbox, PlayStation, Apple). Inspired by, never copied.
- No stock photos, no hot-linked assets, no runtime third-party requests.
- No `backdrop-filter` outside the four allowed surfaces; no `filter: blur()` on large animated
  elements.
- No text in the wallpaper (the name is live HTML).
- Do not change behaviour, data attributes, ARIA, or keyboard handling to make something look right.
- Do not leave `--chrome`, `--bevel-*`, `--title-*`, `bevel*`, `sunken*`, `retroScrollbar` or
  `focusRect` in the code after the cleanup round.

---

## 14. Round 2 refinements (Mira, after the round 1 QA pass)

Where this section and an earlier one disagree, this section wins.

### 14.1 Asset quality bar (all icons)

Round 1 icons are clean and on-palette, but most are 2KB drawings: one gradient, one gloss
shape. Vista and Windows 7 icons are richer. Every icon in round 2 must have all of these:

- A base fill of 3 or more stops (light top-left, saturated middle, deeper bottom-right).
- An edge stroke in a darker shade of the object's own hue, plus a 1-1.5 unit inner light line
  (white at .5-.7) just inside the edge on the top and left sides.
- A crisp upper gloss (white .8 -> .05) whose lower edge is a clean curve, as on the orb.
- One small specular hotspot (white, near-opaque) at the top-left of the main form.
- Ambient occlusion where parts meet: a soft darker band of the same hue (opacity .2-.35).
- A faint bottom rim light (white .3), and for glass or gel parts a coloured inner glow at the bottom.
- A slight 3/4 view where the object allows it (front face plus a visible top or side face).
- **Family rule: every icon is a free-standing object.** No rounded-square app tiles behind any
  icon, and no floor reflections under any icon. CSS adds the drop shadow.
- Budget 4-12KB per SVG. Keep coordinates to 1 decimal and merge same-fill shapes into one path.
  The section 9 SVG rules still apply: no rasters, at most two `feGaussianBlur`, `id`s prefixed
  with the file name.
- Every icon must read at 32px on both the wallpaper and white.

### 14.2 Wallpaper and bubbles

- Bubbles are lit spheres, not hairline rings. Each one has a faint body tint (aqua, .06-.12)
  that is clearer in the middle, a 2-4 unit iridescent rim (cyan -> violet -> leaf, .35-.6), a
  white crescent highlight at the top-left (.7-.9), a small specular dot, and a soft bright arc
  inside the bottom-right edge. Use 26-34 bubbles in the wallpaper, with 4-6 large ones (60-110px)
  in the right third.
- The front hill gets a glossy specular band: a soft white streak (.25-.4) a short way below the
  crest that follows the crest curve. Below it the hill darkens towards the base.
- Remove the stray hexagon near (61%, 38%). Lens ghosts are soft discs with a slightly brighter
  rim and a faint colour (aqua, gold, leaf), opacity .05-.12.
- Legibility zones. The hill under the icon column (x 0-240px, y 55-85%) and the name corner (the
  bottom-right 460x170px) are a deeper leaf green, so white text has a dark ground. Mean relative
  luminance in each zone must be 0.20 or less (for example #3a8a26 is 0.19). Keep the change
  natural: a cloud shadow or a darker fold of the hill, not a visible box.

### 14.3 Window glass (keeps the section 6 geometry)

Do not change `--frame` (6px desktop), `--titlebar-h` or `--close-w`. The game windows' "+ 20"
and `kit.js` `FRAME` depend on them. Make the glass read as glass instead:

- `--glass-tint: rgba(140, 196, 238, 0.52)`, `--glass-sat: 180%`, `--glass-blur: 16px`.
- `--glass-tint-inactive: rgba(190, 214, 236, 0.46)` (it was so clear it looked like flat grey).
- `--glass-streaks`: raise the two streak peaks to .24 and .16.
- `.win` box-shadow adds an outer light edge: `0 0 0 1px rgba(255,255,255,.18)` after the inset line.
- Inactive title: `color: #2e4860; opacity: 1`. It must reach 4.5:1 on the lightest inactive glass.
- Inactive close button: `opacity: .85; filter: saturate(.45)` (it was muddy brown-grey).

### 14.4 Phone (max-width 36em)

The window floats on the wallpaper instead of covering it. Inset it 6px from the top, left and
right, and 6px above the taskbar. Use `border-radius: var(--radius-win)`, keep the glass, and
give it a soft `--shadow-win-inactive`. `--frame` stays 0 on phone. The visible wallpaper strip
and the glass title bar are what make it Aero. The close touch target is at least 44x44
(`.win__close::after { inset: -7px -4px }`). In short landscape the close button gets the same
`::after`, and `--taskbar-h: 48px; --orb: 48px` apply there too.

### 14.5 Desktop labels and the name

Use the Windows 7 desktop label shadow: a tight dark halo, not a soft blue glow.
`text-shadow: 0 0 1px rgba(0,0,0,.95), 0 1px 2px rgba(0,0,0,.85), 0 0 6px rgba(0,22,48,.7)`.
Apply it to icon labels and to the wallpaper name block. The name's Lines are weight 500. The
icon selection box gets `border-radius: 5px`, and the keyboard focus fill is
`linear-gradient(180deg, rgba(40,110,180,.55), rgba(10,70,130,.45))`.

### 14.6 Start menu (Windows 7 two-column)

`min(400px, 100vw - 8px)` wide. The left column is the existing item list on near-solid white
(`rgba(255,255,255,.97)`). The right column is about 136px of bare glass and is purely decorative
(`aria-hidden`). At the top sits a 64px "user picture": the About icon on a glossy white rounded
frame (radius 6px), overhanging the menu's top edge by 22px, as on Windows 7. Under it are
"Peter Shamoun" (14/600 `--text-on-glass` with `--title-glow`) and "AI Engineer" and
"San Diego, CA" (13/400). On phones the right column is hidden. The accessible names become
"Start" (button) and "Start menu" (menu).

### 14.7 Taskbar clock

Use Windows 7 style: no box. Show two centred lines in white, the time (14px) over the short date
(12px, M/D/YYYY), both with the bar text shadow. Hover uses the task-button hover fill. The
world-time flyout is an opaque glass sheet (`background-color: rgba(236,246,255,.95)` over the
glass), so the wallpaper name does not ghost through it. It may cover the name; flyouts do that.
