import { createGlobalStyle } from 'styled-components';
import fonts from './fonts';
import variables from './variables';
import windowStyles from './windowStyles';
import { gloss } from './mixins';

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
    font-weight: 400;
    line-height: 1.5;
    color: var(--text);
    background-color: var(--desktop);
    letter-spacing: 0;
    overflow: hidden;
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

  input,
  textarea {
    caret-color: var(--lagoon);
  }

  button {
    font: inherit;
    color: inherit;
    letter-spacing: 0;
  }

  /* A tap gets the pressed bevel, not the browser's grey flash, and no double-tap zoom delay. */
  a,
  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  /*
   * The soft blue Aero focus ring, 2px outside the edge of whatever has focus. Components that
   * need a different one (a ring inside a glass panel, a ring on a dark tile) use focusRing from
   * mixins.
   */
  :focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 2px;
  }

  /* ---------- skip link ---------- */

  .skip-link {
    position: fixed;
    top: 4px;
    left: 4px;
    z-index: var(--z-skip);
    padding: 6px 14px;
    ${gloss};
    font-size: 14px;
    text-decoration: none;
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
      outline: 2px solid var(--focus);
      outline-offset: 2px;
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
