import { css } from 'styled-components';

const variables = css`
  :root {
    /* colour */
    --main-color: #000000;
    --window-color: #cccccc;
    --window-active-color: #afafaf;
    --border-color: #707070;
    --border-light-color: #ffffff;
    --border-shadow-color: #333333;
    --bg-color: #0b17b4;
    --window-title-bar-color: #011e75;
    --text-light: #ffffff;
    --bsod-color: #0000aa;
    --glyph-bg: #22527f;
    --glyph-bg-active: #174a7a;
    --siteinfo-bg: #e5e5e5;
    --scroll-thumb: #02020d;
    --scroll-track: #1b1b3f;
    --scroll-edge: #757574;

    /* fonts */
    --main-font: 'Web437 ANK16', 'Courier New', Courier, monospace;
    --main-large-font: 'Web437 ANK24', 'Courier New', Courier, monospace;
    --window-title-font: 'Silkscreen', 'Courier New', Courier, monospace;
    --link-font: 'Times New Roman', Times, serif;
    --bsod-font: 'Courier New', Courier, monospace;
    --font-base-size: 1.6rem;

    /* sizes */
    --icon-size: 6.2rem;
    --icon-size-xs: 5.2rem;
    --topbar-h: 32px;
    --bevel-w: 1px;
    --titlebar-h: 3.4rem;
    --chrome-btn: 2.5rem;
    --icon-bar-reserve: 0px;

    /* layers */
    --z-icons: 1;
    --z-scene: 500;
    --z-popup-phone: 900;
    --z-window-base: 1000; /* JS sets z-index inline from the topZ counter, which starts here */
    --z-topbar: 10000;
    --z-bsod: 99999;
    --z-boot: 100000;
  }

  @media (max-width: 36em) {
    :root {
      --topbar-h: 52px;
      --bevel-w: 2px;
      --titlebar-h: 5.2rem;
      --chrome-btn: 4.4rem;
      --icon-bar-reserve: 170px;
    }
  }
`;

export default variables;
