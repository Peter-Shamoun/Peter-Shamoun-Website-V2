import { createGlobalStyle } from 'styled-components';
import fonts from './fonts';
import variables from './variables';
import { media } from './media';
import { bevel, bevelPressed, retroScrollbar } from './mixins';

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
    color: var(--text-light);
    background-color: var(--bg-color);
    letter-spacing: 0.5px;
    overflow: hidden;
  }

  p,
  a,
  li,
  dd,
  dt {
    font-size: var(--font-base-size);
    line-height: 1.25;
  }

  ::selection {
    background: var(--bg-color);
    color: #ffffff;
    text-shadow: none;
  }

  button {
    font: inherit;
    color: inherit;
    letter-spacing: inherit;
  }

  /*
   * currentColor, not a fixed black: the ring has to show on the blue desktop and in the
   * black windows as well as on white and grey. Controls on grey chrome set their own
   * 1px dotted #000 ring.
   */
  :focus-visible {
    outline: 2px dotted currentColor;
    outline-offset: 2px;
  }

  /* ---------- skip link ---------- */

  .skip-link {
    position: fixed;
    top: 4px;
    left: 4px;
    z-index: calc(var(--z-boot) + 1);
    padding: 0.4rem 1rem;
    background: var(--window-color);
    color: var(--main-color);
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
      outline: 1px dotted #000;
      outline-offset: -4px;
    }
  }

  /* ---------- window frame ---------- */
  /*
   * Window.js sets these custom properties inline:
   *   --win-w (px)  --win-maxh  --win-x (%)  --win-y (%)  --win-h (measured px)
   *   --win-dx / --win-dy (drag offset, whole px)  --win-fixed-h (only with .win--fixed)
   * and writes --win-fx / --win-fy (sub-pixel correction) straight onto the element.
   */

  .win {
    --win-wr: min(var(--win-w, 540px), 100vw - 16px);
    position: fixed;
    left: calc(
      clamp(
          calc(var(--win-wr) / 2 + 8px),
          var(--win-x, 50%),
          calc(100% - var(--win-wr) / 2 - 8px)
        ) - var(--win-wr) / 2
    );
    top: calc(
      clamp(
          calc(var(--topbar-h) + 8px + var(--win-h, 0px) / 2),
          var(--win-y, 50%),
          calc(100% - var(--win-h, 0px) / 2 - 8px)
        ) - var(--win-h, 0px) / 2
    );
    width: var(--win-wr);
    max-height: min(var(--win-maxh, 60vh), 100vh - var(--topbar-h) - 16px);
    max-height: min(var(--win-maxh, 60vh), 100dvh - var(--topbar-h) - 16px);
    transform: translate(
      calc(var(--win-dx, 0px) + var(--win-fx, 0px)),
      calc(var(--win-dy, 0px) + var(--win-fy, 0px))
    );
    z-index: var(--z-window-base);
    display: flex;
    flex-direction: column;
    background: var(--border-light-color);
    color: #fff;
    border-radius: 0;
  }

  .win--fixed {
    height: min(var(--win-fixed-h, 360px), 100vh - var(--topbar-h) - 16px);
    height: min(var(--win-fixed-h, 360px), 100dvh - var(--topbar-h) - 16px);
  }

  /* A window drawn in normal flow (the 404 page). */
  .win--static {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    max-width: 100%;
  }

  .win__chrome {
    position: relative;
    flex: none;
    display: flex;
    flex-direction: column;
    background: var(--window-color);
    ${bevel};
  }

  .win__titlebar {
    display: flex;
    align-items: center;
    height: var(--titlebar-h);
    padding: 0 0.4rem;
    gap: 0.5rem;
    cursor: move;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .win__glyph {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--chrome-btn);
    height: var(--chrome-btn);
    background: var(--glyph-bg);
    pointer-events: none;
  }

  .win__title {
    flex: 1;
    min-width: 0;
    margin: 0;
    height: 2.5rem;
    padding-left: 1rem;
    background: var(--window-title-bar-color);
    color: #fff;
    font: 700 16px/calc(2.5rem - 2 * var(--bevel-w)) var(--window-title-font);
    letter-spacing: 0;
    pointer-events: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    ${bevel};
  }

  .win__close,
  .win__menu {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--chrome-btn);
    height: var(--chrome-btn);
    padding: 0;
    background: var(--window-color);
    color: var(--main-color);
    cursor: pointer;
    ${bevel};

    &:active {
      ${bevelPressed};
    }

    &:focus-visible {
      outline: 1px dotted #000;
      outline-offset: -4px;
    }
  }

  .win__menu {
    display: none;
  }

  /* ---------- tab row ---------- */

  .win__tabs {
    display: flex;
    align-items: center;
    margin: 0;
    padding-top: 0.3rem;
  }

  .win__tab {
    background: transparent;
    border: none;
    padding: 0 1.5rem 1rem 1.1rem;
    font: 400 16px var(--window-title-font);
    letter-spacing: 0;
    color: #000;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;

    span {
      position: relative;
      display: inline-block;
      border-bottom: 1px solid transparent;
    }

    /* the short stub under the first letter */
    span::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -1px;
      width: 9px;
      height: 1px;
      background: #000;
    }

    &:hover span,
    &[aria-current] span {
      border-bottom-color: #000;
    }

    &:focus-visible {
      outline: 1px dotted #000;
      outline-offset: -2px;
    }
  }

  /* corner mark for a tab that leaves the site */
  .win__tab--ext span::before {
    content: '';
    position: absolute;
    top: 2px;
    right: -8px;
    width: 6px;
    height: 6px;
    border-top: 1px solid #000;
    border-right: 1px solid #000;
  }

  /* ---------- window body ---------- */

  .win__body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  .win__area {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1rem 1.5rem;
    color: var(--bg-color);
    border: var(--bevel-w) solid var(--border-color);
    text-align: left;
    overflow-wrap: break-word;
    ${retroScrollbar};
  }

  /* :where() keeps these at the specificity of a bare element selector, so any class wins */
  :where(.win__area) a {
    color: var(--bg-color);
    text-decoration: underline;
  }

  .win--flush .win__area {
    padding: 0;
  }

  .win--dark .win__area {
    background: #000;
    color: #fff;
    padding: 0;
  }

  :where(.win--dark .win__area) a {
    color: #fff;
  }

  .win__footer {
    flex: none;
    padding: 0.5rem 1rem;
    font-size: 16px;
    text-transform: uppercase;
    color: var(--bg-color);
    text-align: center;
    border-top: 1px solid var(--border-color);
  }

  :where(.win__footer) a {
    color: inherit;
    text-decoration: underline;
  }

  /* ---------- popup frame (used by Popup.js) ---------- */

  .popup {
    position: fixed;
    z-index: var(--z-window-base);
    display: flex;
    flex-direction: column;
    max-width: calc(100vw - 16px);
    background: var(--window-color);
    color: #000;
    border-radius: 0;
    ${bevel};
  }

  .popup .win__chrome {
    border: 0;
  }

  /* Popup titles are whole sentences, so they use the narrower body face to fit the strip. */
  .popup .win__title {
    font: 400 16px / calc(2.5rem - 2 * var(--bevel-w)) var(--main-font);
    text-transform: uppercase;
  }

  .popup__body {
    padding: 10px 8px;
    color: #000;
    text-align: center;
  }

  .popup__art {
    display: block;
    width: 100%;
    height: auto;
    image-rendering: pixelated;
  }

  /* ---------- phone ---------- */

  ${media.phone} {
    .win {
      left: 0;
      top: 80px;
      bottom: calc(var(--icon-bar-reserve) + env(safe-area-inset-bottom, 0px));
      width: 100%;
      height: auto;
      max-height: none;
      transform: none;
    }

    .win--static {
      top: auto;
      bottom: auto;
    }

    .win__titlebar {
      cursor: default;
    }

    .win__glyph svg {
      width: 20px;
      height: 20px;
    }

    .win__title {
      height: 4.4rem;
      font-size: 24px;
      line-height: calc(4.4rem - 2 * var(--bevel-w));
    }

    .win__menu {
      display: flex;
    }

    .win__tabs {
      display: none;
    }

    /* the tab row becomes the dropdown opened by the title-bar menu button */
    .win__tabs.is-open {
      position: absolute;
      top: 0.7rem;
      right: 5rem;
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 19rem;
      padding-top: 0.5rem;
      background: var(--window-color);
      ${bevel};
    }

    .win__tab {
      width: 100%;
      min-height: 44px;
      padding: 0.5rem 2rem;
      font-size: 24px;
      text-align: left;
    }

    /* a footer link stands alone, so the footer is one 44px row and the link fills its height */
    .win__footer {
      padding: 0 1rem;
    }

    .win__footer a {
      display: inline-block;
      padding: 12px 0;
    }

    .win__footer a:focus-visible {
      outline-offset: -10px;
    }

    .popup {
      width: 260px;
      z-index: var(--z-popup-phone);
    }

    .popup .win__glyph {
      display: none;
    }

    .popup .win__title {
      font-size: 16px;
      line-height: calc(4.4rem - 2 * var(--bevel-w));
    }

    /* the 24px phone button face is too wide for a 260px popup */
    .popup__body a,
    .popup__body button {
      max-width: 100%;
      font: 16px var(--main-font);
      white-space: normal;
    }
  }

  /* ---------- short landscape phones ---------- */

  ${media.landscape} {
    .win {
      left: 0;
      top: calc(var(--topbar-h) + 4px);
      bottom: 60px;
      width: 100%;
      height: auto;
      max-height: none;
      transform: none;
    }

    .win--static {
      top: auto;
      bottom: auto;
    }

    .win__titlebar {
      cursor: default;
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
