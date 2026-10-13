import { css } from 'styled-components';

const variables = css`
  :root {
    /* colour */
    --desktop: #3a6ea5;
    --chrome: #c0c0c0;
    --bevel-hi: #ffffff;
    --bevel-light: #dfdfdf;
    --bevel-shadow: #808080;
    --bevel-dark: #000000;
    --title-active: #000080;
    --title-active-text: #ffffff;
    --title-inactive: #808080;
    --title-inactive-text: #c0c0c0;
    --field: #ffffff;
    --text: #000000;
    --text-on-desktop: #ffffff;
    --shadow-on-desktop: 1px 1px 1px rgba(0, 0, 0, 0.95), 0 0 4px rgba(0, 0, 0, 0.55);
    --link: #000080;
    --select: #000080;
    --select-text: #ffffff;

    /* fonts */
    --main-font: 'Web437 ANK16', 'Courier New', Courier, monospace;
    --main-large-font: 'Web437 ANK24', 'Courier New', Courier, monospace;
    --window-title-font: 'Silkscreen', 'Courier New', Courier, monospace;
    --font-base-size: 1.6rem;

    /* sizes */
    --taskbar-h: 34px;
    --taskbar-total: calc(var(--taskbar-h) + env(safe-area-inset-bottom, 0px));
    --titlebar-h: 24px;
    --chrome-btn: 20px;
    --icon-size: 64px;
    --cascade-step: 28px;

    /* layers */
    --z-wallpaper: 0;
    --z-icons: 1;
    --z-window-base: 1000; /* JS sets z-index inline from the topZ counter, which starts here */
    --z-taskbar: 10000;
    --z-skip: 100000;
  }

  @media (max-width: 36em) {
    :root {
      --taskbar-h: 44px;
      --titlebar-h: 40px;
      --chrome-btn: 36px;
    }
  }

  @media (max-height: 500px) {
    :root {
      --icon-size: 32px;
    }
  }
`;

export default variables;
