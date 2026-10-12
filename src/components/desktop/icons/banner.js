import { PALETTE, box, disc, makeIcon } from './pixel';

// The About banner, drawn on the pixel grid.
// Dusk: navy sky, a skyline of bar-chart columns, stars and a moon.
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

export const BannerAbout = makeIcon('BannerAbout', [302, 80], '100%', BANNER, {
  preserveAspectRatio: 'xMidYMid slice',
});
