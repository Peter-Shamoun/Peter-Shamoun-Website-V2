import { css } from 'styled-components';

// Segoe UI comes first in --main-font. Where it is not installed, Open Sans stands in: a
// humanist sans by Steve Matteson, who also drew Segoe. Google Fonts (SIL OFL 1.1), shipped
// unmodified; see src/fonts/open-sans/OFL.txt.
import OpenSans300 from '@fonts/open-sans/open-sans-latin-300-normal.woff2';
import OpenSans400 from '@fonts/open-sans/open-sans-latin-400-normal.woff2';
import OpenSans600 from '@fonts/open-sans/open-sans-latin-600-normal.woff2';

const Fonts = css`
  @font-face {
    font-family: 'Open Sans';
    src: url(${OpenSans300}) format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url(${OpenSans400}) format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url(${OpenSans600}) format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
`;

export default Fonts;
