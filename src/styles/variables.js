import { css } from 'styled-components';

// The maximal Frutiger Aero tokens (.studio/DESIGN-MAXIMAL.md). Names marked KEEP are read by
// code (Window.js, the games' kit.js, GlobalStyle) and must not be renamed.
const variables = css`
  :root {
    /* ---- palette ---- */
    --abyss: #04225e;
    --sky: #1b74dc;
    --horizon: #c7ecff;
    --aqua: #18c3e8;
    --lagoon: #0a6fb8;
    --lagoon-deep: #054a8c;
    --lime: #b8ff2e;
    --lime-glow: #7dff00;
    --lime-deep: #3f9e00;
    --leaf: #2f9e1a;
    --goldfish: #ff7a12;
    --candy-red: #ec2f3b;
    --lcd-ink: #b8f4ff;
    --lcd-ghost: rgba(184, 244, 255, 0.1);
    --lcd-glass: #06324f;

    /* round-1 names still read by a few components */
    --sky-900: var(--abyss);
    --sky-700: var(--lagoon);
    --sky-500: var(--sky);
    --sky-300: #74c6f2;
    --sky-100: #dff3ff;
    --aqua-500: var(--aqua);
    --aqua-300: #7fe3f0;
    --leaf-700: #2e8a1c;
    --leaf-500: #58b92a;
    --leaf-300: #a8e36a;
    --sun: #fff6d8;

    /* ---- surfaces ---- */
    --desktop: #1b74dc; /* KEEP. Shows while the plate loads. */
    --field: #ffffff; /* KEEP. Content areas. */
    --field-edge: rgba(10, 80, 150, 0.28);
    --field-alt: #f0f9ff;
    --game-bg: linear-gradient(180deg, #f6fdff 0%, #dcf3ff 100%);

    /* glass: the panes, the playlist, the world-time panel */
    --glass-tint: rgba(150, 222, 255, 0.4);
    --glass-tint-inactive: rgba(190, 232, 252, 0.3);
    --glass-tint-solid: rgba(186, 232, 252, 0.97); /* no backdrop-filter support */
    --glass-blur: 16px;
    --glass-sat: 180%;
    --glass-edge: rgba(4, 50, 110, 0.55);
    --glass-hi: rgba(255, 255, 255, 0.75);
    --glass-sheen: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.7) 0,
      rgba(255, 255, 255, 0.28) 30px,
      rgba(255, 255, 255, 0.08) 31px,
      rgba(255, 255, 255, 0) 70%
    );
    --glass-streaks: linear-gradient(
      112deg,
      rgba(255, 255, 255, 0) 0 16%,
      rgba(255, 255, 255, 0.18) 21%,
      rgba(255, 255, 255, 0) 29%,
      rgba(255, 255, 255, 0) 58%,
      rgba(255, 255, 255, 0.12) 63%,
      rgba(255, 255, 255, 0) 70%
    );

    /* candy plastic: the deck body and the pane title strip */
    --candy: linear-gradient(180deg, #8ff0ff 0%, #2bc4f0 46%, #0b8fd6 54%, #0a6fc0 100%);
    --candy-cap: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.15));
    --chrome: linear-gradient(
      180deg,
      #ffffff 0%,
      #d9e6f1 22%,
      #8aa3ba 46%,
      #3d5a76 50%,
      #a9c1d6 56%,
      #f4f9fc 82%,
      #9fb6ca 100%
    );
    --chrome-edge: rgba(20, 48, 80, 0.55);

    /* ---- text ---- */
    --text: #12304d; /* KEEP */
    --text-muted: #3f6688;
    --text-on-glass: #062646;
    --text-on-bar: #ffffff;
    --heading: #0a5fa8;
    --text-on-desktop: #ffffff; /* KEEP */
    --shadow-on-desktop: 0 1px 2px rgba(0, 32, 90, 0.85), 0 0 14px rgba(0, 48, 130, 0.55); /* KEEP */
    --title-glow: 0 0 1px #ffffff, 0 0 6px rgba(255, 255, 255, 0.95),
      0 0 12px rgba(255, 255, 255, 0.8);
    --link: #0062c4; /* KEEP */
    --link-hover: #0089e0;

    /* ---- selection and hot-track ---- */
    --select: #18c3e8; /* KEEP. Text selection. */
    --select-text: #04225e; /* KEEP */
    --hot-fill: linear-gradient(
      180deg,
      rgba(234, 250, 255, 0.98) 0%,
      rgba(196, 238, 255, 0.98) 100%
    );
    --hot-edge: #6fd0f2;
    --hot-fill-strong: linear-gradient(
      180deg,
      rgba(226, 255, 196, 0.98) 0%,
      rgba(196, 248, 120, 0.98) 100%
    );
    --hot-edge-strong: #6cc417;
    --focus: #1a8fe0; /* focus ring on light surfaces */
    --focus-on-scene: #b8ff2e; /* focus ring on the scene and the deck */

    /* ---- gloss controls ---- */
    --btn-edge: #4f86b4;
    --btn-face: linear-gradient(180deg, #ffffff 0%, #eaf6fd 49%, #d2ecfb 50%, #bfe3f8 100%);
    --btn-edge-hover: #1d8bd6;
    --btn-face-hover: linear-gradient(180deg, #f2fcff 0%, #d7f2ff 49%, #aee2fb 50%, #8fd6f7 100%);
    --btn-edge-down: #0c5f9c;
    --btn-face-down: linear-gradient(180deg, #d5eefb 0%, #a9dcf5 49%, #78c4ec 50%, #5ab4e4 100%);
    --close-face: radial-gradient(circle at 50% 30%, #ff9a92 0%, #ec2f3b 52%, #a30d1c 100%);
    --close-edge: rgba(90, 0, 10, 0.6);

    /* ---- shadows ---- */
    --shadow-win: 0 24px 60px rgba(0, 30, 80, 0.45), 0 6px 16px rgba(0, 30, 70, 0.3);
    --shadow-win-inactive: 0 12px 30px rgba(0, 30, 80, 0.28), 0 3px 8px rgba(0, 20, 50, 0.16);
    --shadow-menu: 0 16px 40px rgba(0, 28, 70, 0.45);

    /* ---- fonts ---- */
    --main-font: 'Segoe UI', 'Open Sans', Frutiger, 'Myriad Pro', 'Helvetica Neue', Arial,
      sans-serif; /* KEEP */
    --display-font: 'Nunito', var(--main-font);
    --main-large-font: var(--display-font); /* KEEP. Big type. */
    --window-title-font: var(--display-font); /* KEEP */
    --font-base-size: 1.6rem; /* KEEP. 16px. */

    /* ---- sizes ---- */
    --taskbar-h: 96px; /* KEEP. The room the deck takes at the bottom. */
    --taskbar-total: calc(var(--taskbar-h) + env(safe-area-inset-bottom, 0px)); /* KEEP */
    --titlebar-h: 46px; /* KEEP */
    --chrome-btn: 30px; /* KEEP. The close button. */
    --close-w: 30px;
    --frame: 8px; /* glass frame at sides and bottom */
    --icon-size: 64px; /* KEEP */
    --cascade-step: 34px; /* KEEP */
    --orb: 74px; /* the deck's orb */
    --bubble: clamp(84px, 13.4vh, 124px); /* a section bubble: three rows fit above the deck */
    --radius-win: 22px;
    --radius-field: 14px;
    --radius-ctl: 999px;
    --radius-menu: 18px;

    /* ---- motion ---- */
    --ease-out: cubic-bezier(0.16, 0.84, 0.3, 1);
    --ease-in: cubic-bezier(0.5, 0, 0.75, 0.2);
    --ease-spring: cubic-bezier(0.22, 1.25, 0.36, 1);
    --dur-fast: 140ms;
    --dur-open: 420ms;
    --dur-close: 150ms;
    --dur-hover: 180ms;

    /* ---- layers (KEEP all) ---- */
    --z-wallpaper: 0;
    --z-icons: 20;
    --z-window-base: 1000;
    --z-taskbar: 10000;
    --z-skip: 100000;
  }

  @media (max-width: 1180px) {
    :root {
      --bubble: clamp(84px, 12.5vh, 108px);
    }
  }

  @media (max-width: 36em) {
    :root {
      --taskbar-h: 78px;
      --titlebar-h: 52px;
      --chrome-btn: 36px;
      --close-w: 36px;
      --orb: 60px;
      --bubble: 92px;
      --frame: 0px;
      --radius-win: 0px;
    }
  }

  @media (max-height: 500px) {
    :root {
      --icon-size: 40px;
      --taskbar-h: 66px;
      --orb: 52px;
      --bubble: 76px;
    }
  }
`;

export default variables;
