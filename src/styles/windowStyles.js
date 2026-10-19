import { css } from 'styled-components';
import { media } from './media';
import { glass, glassInactive, field, aeroScrollbar } from './mixins';

// The panes: every .win* rule, desktop, phone and short landscape. GlobalStyle includes it.
// Window.js writes the markup (titlebar, icon, title, close, body, area, footer).
const windowStyles = css`
  /* ---------- pane frame ---------- */
  /*
   * Window.js sets these custom properties inline:
   *   --win-w (px)  --win-maxh  --win-step (place in the cascade, 0 = About)
   *   --win-h (measured px)  --win-dx / --win-dy (drag offset, whole px)
   * and writes --win-fx / --win-fy (sub-pixel correction) straight onto the element.
   *
   * A pane opens over the globe: centred on --globe-x (set on #content), never further left
   * than --win-clear, the right edge of the bubble column. Step 0 is centred in the space above
   * the deck; every other pane opens one step further down and to the right.
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
    /* water light on the glass: pool caustics under the sheen */
    background-image: var(--glass-streaks), var(--glass-sheen), url('/aero/fx/caustic.webp');
    background-size: auto, auto, 280px;
    box-shadow: inset 0 0 0 1px var(--glass-hi), inset 0 2px 0 rgba(255, 255, 255, 0.6),
      0 0 0 4px rgba(255, 255, 255, 0.16), var(--shadow-win);
    transition: background-color var(--dur-fast) var(--ease-out),
      box-shadow var(--dur-fast) var(--ease-out);
    animation: win-open var(--dur-open) var(--ease-spring);
  }

  .win:not(.is-active) {
    ${glassInactive};
  }

  /* No see-through glass for people who ask for less transparency. */
  @media (prefers-reduced-transparency: reduce) {
    .win,
    .win:not(.is-active) {
      background-color: var(--glass-tint-solid);
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
  }

  /* Opening: the pane swells up out of the bubble that was popped, the way a bubble rises.
     The individual scale and translate properties leave the drag transform alone. It replays
     whenever [hidden] is removed. */
  @keyframes win-open {
    from {
      opacity: 0;
      scale: 0.72;
      translate: 0 48px;
    }

    55% {
      opacity: 1;
    }
  }

  .win {
    --win-clear: max(12px, calc(var(--globe-x, 50vw) - var(--globe-h, 600px) * 0.36));
    --win-wr: min(var(--win-w, 560px), 100vw - 24px);
    --win-room: calc(100vh - var(--taskbar-total));
    /* a little above the middle of the room over the deck, from the measured height */
    --win-top0: calc((var(--win-room) - var(--win-h, 60vh)) / 2.3);
    --win-shift: calc(var(--win-step, 0) * var(--cascade-step));
    left: clamp(
      12px,
      max(var(--win-clear), calc(var(--globe-x, 50vw) - var(--win-wr) / 2)) + var(--win-shift),
      calc(100% - var(--win-wr) - 12px)
    );
    top: clamp(
      12px,
      calc(var(--win-top0) + var(--win-shift)),
      calc(var(--win-room) - var(--win-h, 0px) - 12px)
    );
    width: var(--win-wr);
    max-height: min(var(--win-maxh, 70vh), var(--win-room) - 24px);
    transform: translate(
      calc(var(--win-dx, 0px) + var(--win-fx, 0px)),
      calc(var(--win-dy, 0px) + var(--win-fy, 0px))
    );
  }

  /* A pane drawn in normal flow (the 404 page). */
  .win--static {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    max-width: 100%;
    max-height: none;
  }

  /* The title strip: the section's glossy icon, then its name in rounded heavy type. */
  .win__titlebar {
    flex: none;
    display: flex;
    align-items: center;
    height: var(--titlebar-h);
    padding: 0 6px 0 8px;
    gap: 10px;
    background: none;
    color: inherit;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .win__titlebar:active {
    cursor: grabbing;
  }

  .win__icon {
    flex: none;
    width: 28px;
    height: 28px;
    filter: drop-shadow(0 2px 2px rgba(0, 40, 90, 0.35));
  }

  .win__title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font: 900 19px/1 var(--window-title-font);
    letter-spacing: 0.01em;
    color: var(--text-on-glass);
    text-shadow: var(--title-glow);
    pointer-events: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .win:not(.is-active) .win__title {
    color: var(--text-muted);
  }

  /* Close: a red candy bead with a white gloss cap. */
  .win__close {
    position: relative;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--close-w);
    height: var(--chrome-btn);
    padding: 0;
    border: 1px solid var(--close-edge);
    border-radius: 50%;
    background: var(--close-face);
    color: #fff;
    box-shadow: inset 0 -3px 6px rgba(120, 0, 10, 0.35), 0 2px 5px rgba(90, 0, 10, 0.35);
    cursor: pointer;
    transition: transform var(--dur-hover) var(--ease-spring),
      box-shadow var(--dur-hover) var(--ease-out), filter var(--dur-hover) var(--ease-out);

    &::before {
      content: '';
      position: absolute;
      left: 18%;
      right: 18%;
      top: 6%;
      height: 42%;
      border-radius: 50%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.1));
      pointer-events: none;
    }

    svg {
      position: relative;
      width: 12px;
      height: 12px;
      filter: drop-shadow(0 1px 1px rgba(100, 0, 0, 0.6));
    }

    &:hover {
      transform: scale(1.08);
      box-shadow: inset 0 -3px 6px rgba(120, 0, 10, 0.35), 0 0 14px rgba(255, 90, 90, 0.85);
    }

    &:active {
      transform: scale(0.94);
      filter: brightness(0.9);
    }

    &:focus-visible {
      outline: 3px solid var(--focus);
      outline-offset: 2px;
    }
  }

  .win:not(.is-active) .win__close:not(:hover) {
    filter: saturate(0.45) brightness(1.08);
  }

  /* ---------- pane body ---------- */

  /* The white page inside the glass, lit from above like water: a pale aqua wash at the top,
     and a few drawn bubbles in the top-right corner. */
  .win__body {
    ${field};
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-radius: var(--radius-field);
    background: linear-gradient(180deg, #dcf6ff 0, #f4fcff 64px, #ffffff 140px);
  }

  .win__body::before {
    content: '';
    position: absolute;
    top: -14px;
    right: -10px;
    width: 120px;
    height: 120px;
    background: url('/aero/fx/bubble.svg') 70% 30% / 54px no-repeat,
      url('/aero/fx/bubble.svg') 18% 62% / 30px no-repeat,
      url('/aero/fx/bubble.svg') 76% 84% / 20px no-repeat;
    opacity: 0.75;
    pointer-events: none;
  }

  .win__area {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 20px 24px 22px;
    line-height: 1.55;
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
    text-underline-offset: 3px;
  }

  .win--flush .win__area {
    padding: 0;
  }

  /* A game pane: the game's own colour all the way through, and the game does its own fitting.
     Width check: the pane is the game's width + 20px. Glass border 1px x2, frame 8px x2 and body
     edge 1px x2 are 20px, so the area has no padding. The game is exactly its natural width. */
  .win--game .win__body {
    background: var(--game-bg);
    padding: 0;
  }

  .win--game .win__body::before {
    display: none;
  }

  .win--game .win__area {
    padding: 0;
    overflow: hidden;
    line-height: 1;
  }

  .win__footer {
    flex: none;
    margin-top: 6px;
    padding: 4px 10px;
    font-size: 13px;
    line-height: 1.25;
    color: var(--text-on-glass);
    background: rgba(255, 255, 255, 0.45);
    border-radius: var(--radius-field);
  }

  /* ---------- phone ---------- */

  ${media.phone} {
    /* A drawer that rises from the deck, as tall as its content, never taller than the room. */
    .win,
    .win:not(.is-active) {
      left: 6px;
      right: 6px;
      top: auto;
      bottom: calc(var(--taskbar-total) + 4px);
      width: auto;
      height: auto;
      max-height: calc(100% - var(--taskbar-total) - 16px);
      transform: none;
      border-radius: 22px;
      padding: 0 8px 8px;
      box-shadow: inset 0 0 0 1px var(--glass-hi), var(--shadow-win);
    }

    .win--static {
      top: auto;
      bottom: auto;
    }

    /* The bubbles and the masthead are behind a sheet: out of the tab order and the reading order. */
    #content:has(> .win:not([hidden])) > [data-front] {
      visibility: hidden;
    }

    .win__area {
      padding: 18px 18px 20px;
    }

    /* the close button keeps a 44px touch target */
    .win__close::after {
      content: '';
      position: absolute;
      inset: -5px;
    }

    .win--flush .win__area {
      padding: 0;
    }

    /* The game sits in the middle of the drawer. */
    .win--game .win__area {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 4px;
    }

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

    #content:has(> .win:not([hidden])) > [data-front] {
      visibility: hidden;
    }
  }
`;

export default windowStyles;
