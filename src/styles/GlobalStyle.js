import { createGlobalStyle } from 'styled-components';
import fonts from './fonts';
import variables from './variables';
import windowStyles from './windowStyles';
import { bevel } from './mixins';

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

  ${windowStyles};

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
