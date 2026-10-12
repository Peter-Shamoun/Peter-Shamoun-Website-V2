import { createGlobalStyle } from 'styled-components';
import fonts from './fonts';
import variables from './variables';
import { media } from './media';
import { bevel, bevelPressed, bevelWindow, retroScrollbar, sunken, sunkenThin } from './mixins';

const GlobalStyle = createGlobalStyle`
  ${fonts};
  ${variables};

  /* ---------- base ---------- */

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  html {
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    margin: 0;
    font-family: var(--main-font);
    font-size: var(--font-base-size);
    color: var(--text);
    background-color: var(--desktop);
    letter-spacing: 0.5px;
    overflow: hidden;
  }

  /* The wallpaper photograph, fixed behind everything. --desktop shows while it loads. */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    background-image: url('/wallpaper.jpg');
    background-image: image-set(
      url('/wallpaper.webp') type('image/webp'),
      url('/wallpaper.jpg') type('image/jpeg')
    );
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  p,
  a,
  li,
  dd,
  dt {
    font-size: var(--font-base-size);
    line-height: 1.5;
  }

  ::selection {
    background: var(--select);
    color: var(--select-text);
    text-shadow: none;
  }

  button {
    font: inherit;
    color: inherit;
    letter-spacing: inherit;
  }

  /* A tap gets the pressed bevel, not the browser's grey flash, and no double-tap zoom delay. */
  a,
  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  /*
   * The classic dotted focus rectangle. currentColor, so it shows on the white of a window as
   * well as on the desktop. Controls on grey chrome draw theirs inset (focusRect in mixins).
   */
  :focus-visible {
    outline: 1px dotted currentColor;
    outline-offset: 2px;
  }

  /* ---------- skip link ---------- */

  .skip-link {
    position: fixed;
    top: 4px;
    left: 4px;
    z-index: var(--z-skip);
    padding: 0.6rem 1.2rem;
    background: var(--chrome);
    color: var(--text);
    text-decoration: none;
    ${bevel};
    clip-path: inset(50%);
    width: 1px;
    height: 1px;
    overflow: hidden;
    white-space: nowrap;

    &:focus {
      clip-path: none;
      width: auto;
      height: auto;
      overflow: visible;
      outline: 1px dotted var(--text);
      outline-offset: -4px;
    }
  }

  /* ---------- window frame ---------- */
  /*
   * Window.js sets these custom properties inline:
   *   --win-w (px)  --win-maxh  --win-step (place in the cascade, 0 = About)
   *   --win-h (measured px)  --win-dx / --win-dy (drag offset, whole px)
   * and writes --win-fx / --win-fy (sub-pixel correction) straight onto the element.
   *
   * Step 0 is centred in the space above the taskbar (worked out from the height About has
   * when it is as tall as it may be, so it is right before any script has run). Every other
   * window opens one step further down and to the right, so no title bar starts under another.
   * --win-clear is the width the desktop icons take: one column, or two when the desktop is too
   * short for all seven in one (under 728px). A window opens to the right of it and gives up
   * some width for that, down to 440px.
   */

  .win,
  .popup {
    position: fixed;
    z-index: var(--z-window-base);
    display: flex;
    flex-direction: column;
    padding: 4px; /* 2px of bevel and 2px of chrome */
    background: var(--chrome);
    color: var(--text);
    ${bevelWindow};
  }

  .win {
    --win-clear: 128px;
    --win-wr: min(
      var(--win-w, 540px),
      100vw - 16px,
      max(440px, 100vw - var(--win-clear) - 8px)
    );
    --win-room: calc(100vh - var(--taskbar-total));
    --win-top0: calc((var(--win-room) - min(64vh, var(--win-room) - 16px)) / 2);
    --win-shift: calc(var(--win-step, 0) * var(--cascade-step));
    left: clamp(
      8px,
      calc(max(var(--win-clear), 50% - 302px) + var(--win-shift)),
      calc(100% - var(--win-wr) - 8px)
    );
    top: clamp(
      8px,
      calc(var(--win-top0) + var(--win-shift)),
      calc(var(--win-room) - var(--win-h, 0px) - 8px)
    );
    width: var(--win-wr);
    max-height: min(var(--win-maxh, 60vh), var(--win-room) - 16px);
    transform: translate(
      calc(var(--win-dx, 0px) + var(--win-fx, 0px)),
      calc(var(--win-dy, 0px) + var(--win-fy, 0px))
    );
  }

  @media (max-height: 727px) {
    .win {
      --win-clear: 232px;
    }
  }

  /* A window drawn in normal flow (the 404 page). */
  .win--static {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    max-width: 100%;
    max-height: none;
  }

  .win__titlebar {
    flex: none;
    display: flex;
    align-items: center;
    height: var(--titlebar-h);
    padding: 0 2px 0 4px;
    gap: 4px;
    background: var(--title-inactive);
    color: var(--title-inactive-text);
    cursor: default;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  /* The window in front. */
  .is-active > .win__titlebar {
    background: var(--title-active);
    color: var(--title-active-text);
  }

  .win__title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font: 700 16px/1 var(--window-title-font);
    letter-spacing: 0;
    pointer-events: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .win__close {
    position: relative;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--chrome-btn);
    height: var(--chrome-btn);
    padding: 0;
    background: var(--chrome);
    color: var(--text);
    cursor: default;
    ${bevel};

    &:active {
      ${bevelPressed};
    }

    &:focus-visible {
      outline: 1px dotted var(--text);
      outline-offset: -3px;
    }
  }

  /* ---------- window body ---------- */

  .win__body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    margin-top: 2px;
    padding: 2px;
    background: var(--field);
    ${sunken};
  }

  .win__area {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 1.6rem 2rem;
    line-height: 1.5;
    text-align: left;
    overflow-wrap: break-word;
    ${retroScrollbar};
  }

  /* :where() keeps these at the specificity of a bare element selector, so any class wins */
  :where(.win__area, .win__footer) a,
  :where(.win__area, .win__footer) a:visited {
    color: var(--link);
    text-decoration: underline;
  }

  .win--flush .win__area {
    padding: 0;
  }

  /* The status bar under the content. */
  .win__footer {
    flex: none;
    margin-top: 2px;
    padding: 3px 8px;
    font-size: 16px;
    line-height: 1.25;
    ${sunkenThin};
  }

  /* ---------- popup frame (used by Popup.js) ---------- */

  .popup {
    max-width: calc(100vw - 16px);
  }

  /* Popup titles are whole sentences, so they use the narrower body face to fit the strip. */
  .popup .win__title {
    font: 400 16px/1 var(--main-font);
    text-transform: uppercase;
  }

  .popup__body {
    padding: 12px 8px 10px;
    text-align: center;
  }

  .popup__art {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    image-rendering: pixelated;
  }

  /* ---------- phone ---------- */

  ${media.phone} {
    /* Full screen: from the top of the screen down to the taskbar. */
    .win {
      left: 0;
      top: 0;
      bottom: var(--taskbar-total);
      width: 100%;
      height: auto;
      max-height: none;
      transform: none;
    }

    .win--static {
      top: auto;
      bottom: auto;
    }

    /* The icons are behind a full-screen window: out of the tab order and the reading order. */
    #content:has(> .win:not([hidden])) > [data-desktop-icons] {
      visibility: hidden;
    }

    .win__area {
      padding: 1.4rem;
    }

    /* the close button keeps a 44px touch target inside the 40px title bar */
    .win__close::after {
      content: '';
      position: absolute;
      inset: -4px;
    }

    .win--flush .win__area {
      padding: 0;
    }

    /* a footer link stands alone, so the link fills a 44px row */
    .win__footer {
      padding: 0 8px;
    }

    .win__footer a {
      display: inline-block;
      padding: 10px 0;
    }

    .popup {
      width: 260px;
      z-index: var(--z-popup-phone);
    }

    .popup__body a,
    .popup__body button {
      max-width: 100%;
      white-space: normal;
    }
  }

  /* ---------- short landscape phones ---------- */

  ${media.landscape} {
    .win {
      left: 0;
      top: 0;
      bottom: var(--taskbar-total);
      width: 100%;
      height: auto;
      max-height: none;
      transform: none;
    }

    .win--static {
      top: auto;
      bottom: auto;
    }

    /* The icons are behind a full-screen window: out of the tab order and the reading order. */
    #content:has(> .win:not([hidden])) > [data-desktop-icons] {
      visibility: hidden;
    }
  }

  /* ---------- motion ---------- */

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }

  /* keep this the last rule */
  [hidden] {
    display: none !important;
  }
`;

export default GlobalStyle;
