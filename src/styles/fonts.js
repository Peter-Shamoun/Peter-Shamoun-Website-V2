import { css } from 'styled-components';

// Open Sans by Steve Matteson, Google Fonts (SIL OFL 1.1), shipped unmodified.
// See src/fonts/open-sans/OFL.txt.
import OpenSans300 from '@fonts/open-sans/open-sans-latin-300-normal.woff2';
import OpenSans400 from '@fonts/open-sans/open-sans-latin-400-normal.woff2';
import OpenSans600 from '@fonts/open-sans/open-sans-latin-600-normal.woff2';
import OpenSans700 from '@fonts/open-sans/open-sans-latin-700-normal.woff2';
// Nunito by Vernon Adams and the Nunito Project, Google Fonts (SIL OFL 1.1), shipped unmodified.
// The rounded display face for names, pane titles and the deck. See src/fonts/nunito/OFL.txt.
import Nunito800 from '@fonts/nunito/nunito-latin-800-normal.woff2';
import Nunito900 from '@fonts/nunito/nunito-latin-900-normal.woff2';

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

  @font-face {
    font-family: 'Open Sans';
    src: url(${OpenSans700}) format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Nunito';
    src: url(${Nunito800}) format('woff2');
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Nunito';
    src: url(${Nunito900}) format('woff2');
    font-weight: 900;
    font-style: normal;
    font-display: swap;
  }
`;

export default Fonts;
