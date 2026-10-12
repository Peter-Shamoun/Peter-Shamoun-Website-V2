import { css } from 'styled-components';

// Web437 DOS/V re. ANK16 and ANK24 by VileR (CC BY-SA 4.0), shipped unmodified.
// See src/fonts/web437/LICENSE.TXT.
import Web437Ank16 from '@fonts/web437/Web437_DOS-V_re_ANK16.woff';
import Web437Ank24 from '@fonts/web437/Web437_DOS-V_re_ANK24.woff';
// Silkscreen by Jason Kottke (SIL OFL 1.1). See src/fonts/silkscreen/OFL.txt.
import Silkscreen400 from '@fonts/silkscreen/silkscreen-latin-400-normal.woff2';
import Silkscreen700 from '@fonts/silkscreen/silkscreen-latin-700-normal.woff2';

const Fonts = css`
  @font-face {
    font-family: 'Web437 ANK16';
    src: url(${Web437Ank16}) format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Web437 ANK24';
    src: url(${Web437Ank24}) format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Silkscreen';
    src: url(${Silkscreen400}) format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Silkscreen';
    src: url(${Silkscreen700}) format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
`;

export default Fonts;
