// The seven games. size is the box each game draws in, in px (see games/kit.js); how is the
// one-line control hint on its tile.
const GAMES = [
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    how: 'Right-click or hold to flag',
    size: { w: 288, h: 384 },
  },
  { id: 'solitaire', title: 'Solitaire', how: 'Klondike, draw one', size: { w: 476, h: 460 } },
  { id: 'snake', title: 'Snake', how: 'Arrows or swipe to steer', size: { w: 384, h: 372 } },
  { id: 'blocks', title: 'Tetris', how: 'Arrows to move, Up to turn', size: { w: 320, h: 396 } },
  { id: 'bricks', title: 'Breakout', how: 'Mouse, finger or arrows', size: { w: 400, h: 372 } },
  { id: 'paddle', title: 'Pong', how: 'First to 7 points', size: { w: 400, h: 372 } },
  {
    id: 'invaders',
    title: 'Space Invaders',
    how: 'Arrows to move, Space to fire',
    size: { w: 400, h: 400 },
  },
];

export const getGame = id => GAMES.find(g => g.id === id);

export default GAMES;
