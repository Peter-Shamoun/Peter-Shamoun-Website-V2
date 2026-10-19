import { createGlobalStyle } from 'styled-components';
import fonts from './fonts';
import variables from './variables';

const GlobalStyle = createGlobalStyle`
  ${fonts};
  ${variables};

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%; /* 1rem = 10px */
    background: #0b4f96;
    scroll-padding-top: calc(var(--nav-h) + 16px);
    -webkit-text-size-adjust: 100%;
  }

  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }

  body {
    margin: 0;
    font-family: var(--main-font);
    font-size: var(--font-base-size);
    font-weight: 400;
    line-height: 1.55;
    color: var(--text);
    /* the water between the plates, top to bottom: sky, shallows, deep, and up again */
    background: linear-gradient(
      180deg,
      #3aa8f0 0%,
      #1f8fd6 14%,
      #0f9ac0 30%,
      #0b6fb0 50%,
      #062f72 72%,
      #0c6eb4 88%,
      #7cc8ee 100%
    );
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  img {
    max-width: 100%;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    font-weight: 300;
    line-height: 1.08;
    text-wrap: balance;
  }

  p {
    margin: 0;
    text-wrap: pretty;
  }

  a {
    color: var(--link);
    text-underline-offset: 0.18em;
    text-decoration-thickness: 1px;
  }

  ::selection {
    background: var(--select);
    color: var(--select-text);
    text-shadow: none;
  }

  button {
    font: inherit;
    color: inherit;
  }

  a,
  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  :focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 2px;
  }

  /* Scrollbars: a slim aqua glass thumb on the water. */
  html {
    scrollbar-color: rgba(190, 240, 255, 0.85) rgba(3, 35, 90, 0.35);
  }

  .skip-link {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: var(--z-skip);
    padding: 12px 20px;
    border-radius: 999px;
    background: #ffffff;
    color: var(--abyss);
    font-weight: 600;
    text-decoration: none;
    transform: translateY(-160%);
    transition: transform 0.2s var(--ease-out);

    &:focus {
      transform: none;
      outline: 3px solid var(--focus);
      outline-offset: 2px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* keep this the last rule */
  [hidden] {
    display: none !important;
  }
`;

export default GlobalStyle;
