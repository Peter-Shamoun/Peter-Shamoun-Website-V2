// One loader per game id in GAMES (src/components/sea/games.js). A game's code is fetched the
// first time it is opened.
export const LOADERS = {
  minesweeper: () => import('./Minesweeper'),
  solitaire: () => import('./Solitaire'),
  snake: () => import('./Snake'),
  blocks: () => import('./Blocks'),
  bricks: () => import('./Bricks'),
  paddle: () => import('./Paddle'),
  invaders: () => import('./Invaders'),
};
