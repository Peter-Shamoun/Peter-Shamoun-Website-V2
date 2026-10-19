import { css } from 'styled-components';

// The Frutiger Aero tokens (.studio/DESIGN.md section 3). Names marked KEEP are read by code.
const variables = css`
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
    --hot-fill: linear-gradient(
      180deg,
      rgba(234, 246, 255, 0.96) 0%,
      rgba(205, 232, 252, 0.96) 100%
    );
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
    --main-font: 'Segoe UI', 'Open Sans', Frutiger, 'Myriad Pro', 'Helvetica Neue', Arial,
      sans-serif; /* KEEP */
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
`;

export default variables;
