// The one list of windows and desktop icons. Ids are used everywhere.

// The games in the Games folder. size is the box the game is drawn in, in px (see games/kit.js).
export const GAME_LIST = [
  { id: 'minesweeper', title: 'Minesweeper', icon: 'IconMines', step: 1, size: { w: 288, h: 384 } },
  { id: 'solitaire', title: 'Solitaire', icon: 'IconCards', step: 0, size: { w: 476, h: 460 } },
  { id: 'snake', title: 'Snake', icon: 'IconSnake', step: 1, size: { w: 384, h: 372 } },
  { id: 'blocks', title: 'Blocks', icon: 'IconBlocks', step: 2, size: { w: 320, h: 396 } },
  { id: 'bricks', title: 'Bricks', icon: 'IconBricks', step: 1, size: { w: 400, h: 372 } },
  { id: 'paddle', title: 'Paddle', icon: 'IconPaddle', step: 2, size: { w: 400, h: 372 } },
  { id: 'invaders', title: 'Invaders', icon: 'IconInvaders', step: 1, size: { w: 400, h: 400 } },
];

// w: width in px. maxH: CSS max-height. step: place in the opening cascade (0 is centred, each
// step is one title bar further down and to the right).
export const WINDOWS = [
  { id: 'about', title: 'About', w: 604, maxH: '64vh', step: 0 },
  { id: 'experience', title: 'Experience', w: 540, maxH: '60vh', step: 1 },
  { id: 'projects', title: 'Projects', w: 540, maxH: '60vh', step: 2 },
  { id: 'research', title: 'Research', w: 540, maxH: '60vh', step: 3 },
  { id: 'contact', title: 'Contact', w: 540, maxH: '60vh', step: 4 },
  { id: 'games', title: 'Games', w: 440, maxH: '60vh', step: 5 },
  ...GAME_LIST.map(({ id, title, step, size }) => ({
    id,
    title,
    w: size.w + 20, // the window frame and the padding round the game
    maxH: '100vh',
    step,
    game: size,
  })),
];

// In the order they are shown: down the desktop column, and down the Start menu.
export const DESKTOP_ICONS = [
  { key: 'about', label: 'About', kind: 'window', target: 'about', icon: 'IconAbout' },
  {
    key: 'experience',
    label: 'Experience',
    kind: 'window',
    target: 'experience',
    icon: 'IconExperience',
  },
  { key: 'projects', label: 'Projects', kind: 'window', target: 'projects', icon: 'IconProjects' },
  { key: 'research', label: 'Research', kind: 'window', target: 'research', icon: 'IconResearch' },
  { key: 'contact', label: 'Contact', kind: 'window', target: 'contact', icon: 'IconContact' },
  { key: 'games', label: 'Games', kind: 'window', target: 'games', icon: 'IconGames' },
];

export const getWindow = id => WINDOWS.find(w => w.id === id);
