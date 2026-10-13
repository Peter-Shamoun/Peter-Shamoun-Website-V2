import { box, disc, frame, makeIcon, mask, pline } from './pixel';

// The Games folder and one icon per game (32 x 32 grid). Built from boxes and discs.

const ICON = [32, 32];

// A black-edged box of colour with a light top-left corner, for a block that looks raised.
const block = (x, y, w, h, key) => [...frame(x, y, w, h, key), ...box(x + 1, y + 1, w - 3, 1, 'W')];

// Each '#' in the rows becomes a 2 x 2 square.
const big = (rows, x0, y0, key) =>
  rows.flatMap((row, y) =>
    row.split('').flatMap((ch, x) => (ch === '#' ? box(x0 + x * 2, y0 + y * 2, 2, 2, key) : [])),
  );

// A joystick: red ball on a stick, grey base with one button.
export const IconGames = makeIcon('IconGames', ICON, 64, [
  ...frame(14, 10, 4, 12, 'D'),
  ...disc(16, 8, 5, 'K'),
  ...disc(16, 8, 4, 'R'),
  ...box(13, 5, 2, 2, 'W'),
  ...frame(4, 21, 24, 8, 'G'),
  ...box(5, 22, 22, 1, 'W'),
  ...box(5, 27, 22, 1, 'D'),
  ...frame(21, 23, 5, 4, 'R'),
]);

export const IconMines = makeIcon('IconMines', ICON, 64, [
  ...box(15, 3, 2, 26, 'K'),
  ...box(3, 15, 26, 2, 'K'),
  ...pline(7, 7, 23, 23, 'K', 2),
  ...pline(23, 7, 7, 23, 'K', 2),
  ...disc(16, 16, 8, 'K'),
  ...box(12, 12, 3, 3, 'W'),
]);

export const IconCards = makeIcon('IconCards', ICON, 64, [
  ...frame(12, 3, 16, 22, 'G'),
  ...frame(5, 7, 16, 22, 'W'),
  ...mask(['..#..', '.###.', '#####', '.###.', '..#..'], 11, 15, 'R'),
  ...box(7, 9, 2, 2, 'R'),
  ...box(17, 25, 2, 2, 'R'),
]);

export const IconSnake = makeIcon('IconSnake', ICON, 64, [
  ...frame(4, 21, 6, 6, 'L'),
  ...frame(9, 21, 6, 6, 'L'),
  ...frame(14, 21, 6, 6, 'L'),
  ...frame(14, 16, 6, 6, 'L'),
  ...frame(14, 11, 6, 6, 'L'),
  ...frame(19, 11, 6, 6, 'L'),
  ...box(22, 13, 1, 1, 'K'),
  ...frame(24, 3, 5, 5, 'R'),
]);

export const IconBlocks = makeIcon('IconBlocks', ICON, 64, [
  ...block(12, 6, 8, 8, 'C'),
  ...block(4, 14, 8, 8, 'C'),
  ...block(12, 14, 8, 8, 'C'),
  ...block(20, 14, 8, 8, 'C'),
  ...block(4, 22, 8, 8, 'Y'),
  ...block(12, 22, 8, 8, 'R'),
]);

export const IconBricks = makeIcon('IconBricks', ICON, 64, [
  ...frame(3, 4, 9, 5, 'R'),
  ...frame(12, 4, 9, 5, 'R'),
  ...frame(21, 4, 8, 5, 'R'),
  ...frame(3, 9, 9, 5, 'Y'),
  ...frame(21, 9, 8, 5, 'Y'),
  ...frame(12, 14, 9, 5, 'L'),
  ...frame(16, 21, 4, 4, 'W'),
  ...frame(9, 27, 14, 3, 'B'),
]);

export const IconPaddle = makeIcon('IconPaddle', ICON, 64, [
  ...box(3, 5, 26, 22, 'K'),
  ...box(6, 9, 2, 8, 'W'),
  ...box(24, 15, 2, 8, 'W'),
  ...box(18, 13, 2, 2, 'W'),
  ...box(15, 7, 1, 2, 'D'),
  ...box(15, 11, 1, 2, 'D'),
  ...box(15, 15, 1, 2, 'D'),
  ...box(15, 19, 1, 2, 'D'),
  ...box(15, 23, 1, 2, 'D'),
]);

export const IconInvaders = makeIcon('IconInvaders', ICON, 64, [
  ...big(
    ['....####....', '..########..', '.##########.', '############', '.#.##..##.#.'],
    4,
    4,
    'T',
  ),
  ...box(15, 17, 2, 4, 'R'),
  ...box(14, 23, 4, 2, 'K'),
  ...box(10, 25, 12, 4, 'K'),
]);
