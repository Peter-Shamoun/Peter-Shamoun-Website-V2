// One loader per game id in GAME_LIST. A game's code is fetched the first time its window opens.
export const LOADERS = {
  minesweeper: () => import('./Minesweeper'),
  solitaire: () => import('./Solitaire'),
  snake: () => import('./Snake'),
  blocks: () => import('./Blocks'),
  bricks: () => import('./Bricks'),
  paddle: () => import('./Paddle'),
  invaders: () => import('./Invaders'),
};
