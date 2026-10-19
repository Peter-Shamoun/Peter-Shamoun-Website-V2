import { css } from 'styled-components';
import { media } from './media';
import { glass, glassInactive, field, fieldThin, aeroScrollbar } from './mixins';

// The window frame: every .win* rule, desktop, phone and short landscape. GlobalStyle includes
// it. Window.js writes the markup (titlebar, title, close, body, area, footer).
const windowStyles = css`
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
   * short for all six in one (under 632px). A window opens to the right of it and gives up
   * some width for that, down to 440px.
   */

  .win {
    position: fixed;
    z-index: var(--z-window-base);
    display: flex;
    flex-direction: column;
    padding: 0 var(--frame) var(--frame);
    border-radius: var(--radius-win);
    color: var(--text);
    ${glass};
    transition: background-color var(--dur-fast) var(--ease-out),
      box-shadow var(--dur-fast) var(--ease-out);
    animation: win-open var(--dur-open) var(--ease-spring);
  }

  .win:not(.is-active) {
    ${glassInactive};
  }

  /* Opening: the sheet grows from 94% and rises 8px. The individual scale and translate
     properties leave the drag transform alone. It replays whenever [hidden] is removed. */
  @keyframes win-open {
    from {
      opacity: 0;
      scale: 0.94;
      translate: 0 8px;
    }
  }

  .win {
    --win-clear: 128px;
    --win-wr: min(var(--win-w, 540px), 100vw - 16px, max(440px, 100vw - var(--win-clear) - 8px));
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

  @media (max-height: 631px) {
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

  /* The title strip sits on the glass; no colour change between the front and back window. */
  .win__titlebar {
    flex: none;
    display: flex;
    align-items: center;
    height: var(--titlebar-h);
    padding: 0 0 0 10px;
    gap: 8px;
    background: none;
    color: inherit;
    cursor: default;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .win__title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font: 400 15px/1 var(--window-title-font);
    letter-spacing: 0;
    color: var(--text-on-glass);
    text-shadow: var(--title-glow);
    pointer-events: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .win:not(.is-active) .win__title {
    color: var(--text-muted);
    opacity: 0.8;
  }

  /* The Windows 7 close button: a red glass tab hanging from the top edge of the frame. */
  .win__close {
    position: relative;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
    width: var(--close-w);
    height: var(--chrome-btn);
    margin-top: -1px;
    margin-right: 0;
    padding: 0;
    border: 1px solid var(--close-edge);
    border-top: 0;
    border-radius: 0 0 5px 5px;
    background: var(--close-face);
    color: #fff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45);
    cursor: default;
    transition: background var(--dur-hover) var(--ease-out),
      box-shadow var(--dur-hover) var(--ease-out), filter var(--dur-hover) var(--ease-out);

    &:hover {
      background: var(--close-face-hover);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45), 0 0 10px rgba(255, 120, 80, 0.8);
    }

    &:active {
      background: var(--close-face-down);
    }

    &:focus-visible {
      outline: 2px solid var(--focus);
      outline-offset: 1px;
    }
  }

  /* Inactive: the close button fades and loses its colour until the pointer finds it. */
  .win:not(.is-active) .win__close:not(:hover) {
    opacity: 0.7;
    filter: saturate(0.25);
  }

  /* ---------- window body ---------- */

  .win__body {
    ${field};
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .win__area {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 16px 20px;
    line-height: 1.5;
    text-align: left;
    overflow-wrap: break-word;
    ${aeroScrollbar};
  }

  /* :where() keeps these at the specificity of a bare element selector, so any class wins */
  :where(.win__area, .win__footer) a,
  :where(.win__area, .win__footer) a:visited {
    color: var(--link);
    text-decoration: none;
  }

  :where(.win__area, .win__footer) a:hover {
    color: var(--link-hover);
    text-decoration: underline;
  }

  .win--flush .win__area {
    padding: 0;
  }

  /* A game window: the game's own colour all the way through, and the game does its own fitting.
     Width check: the window is the game's width + 20px. Glass border 1px x2, frame 6px x2 and
     body edge 1px x2 are 16px, so the area padding is 2px x2 = 4px. The game is exactly its
     natural width. */
  .win--game .win__body {
    background: var(--game-bg);
    padding: 0;
  }

  .win--game .win__area {
    padding: 2px;
    overflow: hidden;
    line-height: 1;
  }

  /* The status bar under the content: a thin well on the glass frame. */
  .win__footer {
    flex: none;
    margin-top: 4px;
    padding: 4px 10px;
    font-size: 13px;
    line-height: 1.25;
    color: var(--text-on-glass);
    ${fieldThin};
    background: rgba(255, 255, 255, 0.35);
    border-radius: var(--radius-ctl);
  }

  /* ---------- phone ---------- */

  ${media.phone} {
    /* Full screen: from the top of the screen down to the taskbar. Square, frameless. */
    .win,
    .win:not(.is-active) {
      left: 0;
      top: 0;
      bottom: var(--taskbar-total);
      width: 100%;
      height: auto;
      max-height: none;
      transform: none;
      border-radius: 0;
      box-shadow: inset 0 0 0 1px var(--glass-hi);
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

    .win__close svg {
      width: 16px;
      height: 16px;
    }

    .win--flush .win__area {
      padding: 0;
    }

    /* The game sits in the middle of the full-screen window. */
    .win--game .win__area {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 6px;
    }

    /* a footer link stands alone, so the link fills a 44px row */
    .win__footer {
      padding: 0 8px;
    }

    .win__footer a {
      display: inline-block;
      padding: 10px 0;
    }
  }

  /* ---------- short landscape phones ---------- */

  ${media.landscape} {
    .win,
    .win:not(.is-active) {
      left: 0;
      top: 0;
      bottom: var(--taskbar-total);
      width: 100%;
      height: auto;
      max-height: none;
      transform: none;
      border-radius: 0;
      box-shadow: inset 0 0 0 1px var(--glass-hi);
    }

    .win--static {
      top: auto;
      bottom: auto;
    }

    .win--game .win__area {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* The icons are behind a full-screen window: out of the tab order and the reading order. */
    #content:has(> .win:not([hidden])) > [data-desktop-icons] {
      visibility: hidden;
    }
  }
`;

export default windowStyles;
