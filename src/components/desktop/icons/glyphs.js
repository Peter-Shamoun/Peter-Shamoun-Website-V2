import React from 'react';
import PropTypes from 'prop-types';
import { expandRows, fromGrid, makeIcon } from './pixel';

// Small glyphs for the title bar, the Start button and the Start menu. Run-length rows, see
// expandRows.

const draw = rows => fromGrid(expandRows(rows));

const APP = [
  '.16',
  '.16',
  '.16',
  '.2 W12 .2',
  '.2 W12 .2',
  '.2 W1 .10 W1 .2',
  '.2 W1 .10 W1 .2',
  '.2 W1 .10 W1 .2',
  '.2 W1 .10 W1 .2',
  '.2 W1 .10 W1 .2',
  '.2 W1 .10 W1 .2',
  '.2 W1 .10 W1 .2',
  '.2 W12 .2',
  '.16',
  '.16',
  '.16',
];

const MENU = [
  '.16',
  '.16',
  '.16',
  '.16',
  '.3 K10 .3',
  '.3 K10 .3',
  '.16',
  '.3 K10 .3',
  '.3 K10 .3',
  '.16',
  '.3 K10 .3',
  '.3 K10 .3',
  '.16',
  '.16',
  '.16',
  '.16',
];

// The close X is vector, not pixels: a dark offset stroke under a white one, on a 12 x 12 box.
export const GlyphClose = ({ size = 12, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    width={size}
    height={size}
    aria-hidden="true"
    focusable="false"
    {...rest}>
    <g fill="none" strokeWidth="2" strokeLinecap="round">
      <path d="M2.5 3L9.5 10M9.5 3L2.5 10" stroke="rgba(80,10,0,.55)" />
      <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="#fff" />
    </g>
  </svg>
);

GlyphClose.displayName = 'GlyphClose';

GlyphClose.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export const GlyphApp = makeIcon('GlyphApp', [16, 16], 16, draw(APP));
export const GlyphMenu = makeIcon('GlyphMenu', [16, 16], 16, draw(MENU));
