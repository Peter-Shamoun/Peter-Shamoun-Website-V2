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

// 10 x 10 cross with 2 px arms, centred in 16 x 16.
const CLOSE = [
  '.16',
  '.16',
  '.16',
  '.3 K2 .6 K2 .3',
  '.4 K2 .4 K2 .4',
  '.5 K2 .2 K2 .5',
  '.6 K4 .6',
  '.7 K2 .7',
  '.7 K2 .7',
  '.6 K4 .6',
  '.5 K2 .2 K2 .5',
  '.4 K2 .4 K2 .4',
  '.3 K2 .6 K2 .3',
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

export const GlyphApp = makeIcon('GlyphApp', [16, 16], 16, draw(APP));
export const GlyphClose = makeIcon('GlyphClose', [16, 16], 16, draw(CLOSE));
export const GlyphMenu = makeIcon('GlyphMenu', [16, 16], 16, draw(MENU));
