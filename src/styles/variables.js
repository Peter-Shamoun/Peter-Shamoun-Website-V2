import { css } from 'styled-components';

// The dive's tokens (.studio/DESIGN-PERFECT.md). Names marked KEEP are read by the games
// (src/components/games) and must not be renamed.
const variables = css`
  :root {
    /* ---- palette ---- */
    --abyss: #03235a;
    --deep: #06336f;
    --lagoon: #0a5fa8;
    --sea: #1188d0;
    --aqua: #18c3e8;
    --aqua-soft: #8fe6f7;
    --foam: #eafaff;
    --lime: #9be22d;
    --lime-hi: #d9ff8a;
    --leaf: #3c9a12;
    --sun: #fffbe8;

    /* ---- text ---- */
    --text: #0c2b4b; /* KEEP. Body text on light glass. */
    --text-muted: #355e82; /* KEEP */
    --heading: #0a4f8f;
    --text-on-glass: #062646; /* KEEP */
    --text-on-water: #ffffff;
    --text-on-water-soft: #e2f6ff;
    --water-shadow: 0 1px 2px rgba(0, 30, 80, 0.55), 0 0 18px rgba(0, 40, 110, 0.35);
    --title-glow: 0 0 1px #ffffff, 0 0 6px rgba(255, 255, 255, 0.95),
      0 0 12px rgba(255, 255, 255, 0.8); /* KEEP */
    --link: #0062c4;

    /* ---- surfaces ---- */
    --field: #ffffff; /* KEEP */
    --field-edge: rgba(10, 80, 150, 0.28); /* KEEP */
    --game-bg: linear-gradient(180deg, #f6fdff 0%, #dcf3ff 100%); /* KEEP */
    --glass-tint-solid: rgba(226, 246, 255, 0.98); /* KEEP. Glass without backdrop-filter. */

    /* glass plates: frosted white over the water */
    --plate-fill: rgba(240, 251, 255, 0.72);
    --plate-fill-solid: rgba(240, 251, 255, 0.97);
    --plate-edge: rgba(255, 255, 255, 0.85);
    --plate-rim: rgba(10, 95, 168, 0.28);
    --plate-sheen: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.78) 0%,
      rgba(255, 255, 255, 0.34) 41.5%,
      rgba(255, 255, 255, 0.06) 42%,
      rgba(255, 255, 255, 0) 70%
    );
    --plate-glow: radial-gradient(
      120% 60% at 50% 115%,
      rgba(120, 236, 255, 0.55) 0%,
      rgba(120, 236, 255, 0) 60%
    );
    --plate-shadow: 0 30px 60px -20px rgba(0, 35, 90, 0.55), 0 10px 24px -8px rgba(0, 40, 100, 0.3);

    /* ---- selection and focus ---- */
    --select: #18c3e8;
    --select-text: #03235a;
    --focus: #0a7fd8; /* on light glass */
    --focus-on-water: #d9ff8a; /* on photographs */

    /* ---- gel buttons (also the games' buttons) ---- */
    --btn-edge: #4f86b4;
    --btn-face: linear-gradient(180deg, #ffffff 0%, #eaf6fd 49%, #d2ecfb 50%, #bfe3f8 100%);
    --btn-edge-hover: #1d8bd6;
    --btn-face-hover: linear-gradient(180deg, #f2fcff 0%, #d7f2ff 49%, #aee2fb 50%, #8fd6f7 100%);
    --btn-edge-down: #0c5f9c;
    --btn-face-down: linear-gradient(180deg, #d5eefb 0%, #a9dcf5 49%, #78c4ec 50%, #5ab4e4 100%);

    /* ---- type ---- */
    --main-font: 'Segoe UI', 'Open Sans', Frutiger, 'Frutiger Linotype', 'Myriad Pro',
      'Helvetica Neue', Arial, sans-serif; /* KEEP */
    --font-base-size: 1.7rem;

    /* ---- shape ---- */
    --radius-plate: 26px;
    --radius-tile: 22px;
    --radius-menu: 18px; /* KEEP */
    --radius-ctl: 999px;
    --gutter: clamp(16px, 4vw, 56px);
    --measure: 1180px;
    --nav-h: 64px;

    /* ---- motion ---- */
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-spring: cubic-bezier(0.22, 1.25, 0.36, 1);
    --dur-hover: 180ms;

    /* ---- layers ---- */
    --z-sea: 0;
    --z-nav: 100;
    --z-dialog: 1000;
    --z-skip: 10000;
  }
`;

export default variables;
