import { PALETTE, box, disc, expandRows, fromGrid, makeIcon, mask, pline, shift } from './pixel';

// Scene pieces and the about banner. All drawn on the pixel grid.

// White 1-bit sprite: a pointer arrow towing a two-wheel cart that carries a bar chart.
const spriteOps = [
  ...mask(
    [
      '#........',
      '##.......',
      '###......',
      '####.....',
      '#####....',
      '######...',
      '#######..',
      '########.',
      '#########',
      '#####....',
      '##.##....',
      '#...##...',
      '....##...',
      '.....#...',
    ],
    4,
    4,
    'W',
  ),
  ...pline(9, 14, 26, 20, 'W'),
  ...box(26, 18, 33, 1, 'W'),
  ...box(26, 27, 33, 1, 'W'),
  ...box(26, 18, 1, 10, 'W'),
  ...box(58, 18, 1, 10, 'W'),
  ...box(31, 19, 5, 8, 'W'),
  ...box(39, 14, 5, 13, 'W'),
  ...box(47, 17, 5, 10, 'W'),
  ...mask(['.##.', '####', '####', '.##.'], 29, 28, 'W'),
  ...mask(['.##.', '####', '####', '.##.'], 51, 28, 'W'),
];

// White 1-bit tuft: four bars of heights 3, 7, 5, 9.
const TUFT = [
  '.12',
  '.9 W2 .1',
  '.9 W2 .1',
  '.3 W2 .4 W2 .1',
  '.3 W2 .4 W2 .1',
  '.3 W2 .1 W2 .1 W2 .1',
  '.3 W2 .1 W2 .1 W2 .1',
  'W2 .1 W2 .1 W2 .1 W2 .1',
  'W2 .1 W2 .1 W2 .1 W2 .1',
  'W2 .1 W2 .1 W2 .1 W2 .1',
];

// Dusk banner: navy sky over blue, a skyline of bar-chart columns, stars and a moon.
const BANNER = [];
BANNER.push(...box(0, 0, 302, 44, 'N'));
BANNER.push(...box(0, 44, 302, 36, 'B'));
for (let x = 0; x < 302; x += 2) {
  BANNER.push([x, 44, 1, 1, PALETTE.N]);
}
[
  [12, 6],
  [40, 14],
  [77, 4],
  [101, 20],
  [130, 8],
  [168, 3],
  [190, 18],
  [214, 10],
  [286, 22],
  [150, 22],
  [60, 26],
  [24, 30],
  [281, 40],
  [6, 46],
].forEach(([x, y]) => BANNER.push([x, y, 1, 1, PALETTE.W]));
BANNER.push(...disc(252, 16, 8, 'Y'));
for (let i = 0; i < 30; i += 1) {
  const x = i * 10 + 1;
  const h = 18 + ((i * 37 + 11) % 34);
  BANNER.push(...box(x, 80 - h, 8, h, i % 3 === 0 ? 'C' : 'T'));
}

export const SceneSprite = makeIcon('SceneSprite', [80, 45], 160, shift(spriteOps, 8, 6));
export const SceneTuft = makeIcon('SceneTuft', [12, 10], 24, fromGrid(expandRows(TUFT)));
export const BannerAbout = makeIcon('BannerAbout', [302, 80], '100%', BANNER, {
  preserveAspectRatio: 'xMidYMid slice',
});
