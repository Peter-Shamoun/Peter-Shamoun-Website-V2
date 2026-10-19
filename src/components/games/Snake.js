import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Frame,
  Bar,
  Readout,
  Caption,
  Btn,
  Well,
  Message,
  Hint,
  COLORS,
  pointIn,
  setupCanvas,
  useLoop,
  useKeys,
  useBest,
  report,
} from './kit';
import { FONT, bake, glossCircle, grass } from './gloss';

const COLS = 19;
const ROWS = 15;
const CELL = 20;
const CW = COLS * CELL; // 380
const CH = ROWS * CELL; // 300
const START_MS = 140;
const MIN_MS = 70;
const SPEEDUP_MS = 4;
const POINTS = 10;
const SWIPE_PX = 20;
const TAP_PX = 10; // a press that moved less than this is a tap
// The "ready" line is drawn over these rows, so the first food is never put there.
const NOTE_ROWS = [2, 3];

const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
const KEY_DIRS = {
  ArrowUp: 'up',
  w: 'up',
  ArrowDown: 'down',
  s: 'down',
  ArrowLeft: 'left',
  a: 'left',
  ArrowRight: 'right',
  d: 'right',
};
// Top-left corner of the 3 x 3 eye, inside the head square, for each way the head faces.
const EYE = { up: [8, 4], down: [8, 12], left: [4, 8], right: [12, 8] };

const Board = styled.canvas`
  display: block;
`;

// A random free cell as [x, y], or null when the board is full.
const placeFood = snake => {
  const taken = new Set(snake.map(([x, y]) => y * COLS + x));
  const free = [];
  for (let i = 0; i < COLS * ROWS; i += 1) {
    if (!taken.has(i)) {
      free.push(i);
    }
  }
  if (free.length === 0) {
    return null;
  }
  const pick = free[Math.floor(Math.random() * free.length)];
  return [pick % COLS, Math.floor(pick / COLS)];
};

const createGame = () => {
  const mx = Math.floor(COLS / 2);
  const my = Math.floor(ROWS / 2);
  const snake = [
    [mx, my],
    [mx - 1, my],
    [mx - 2, my],
  ];
  let food = placeFood(snake);
  while (NOTE_ROWS.includes(food[1])) {
    food = placeFood(snake);
  }
  return {
    state: 'ready',
    snake,
    dir: 'right',
    queue: [],
    food,
    score: 0,
    stepMs: START_MS,
    acc: 0,
  };
};

// Queues a turn. Returns true when the game started or the turn was accepted.
const steer = (g, dir) => {
  if (g.state !== 'ready' && g.state !== 'playing') {
    return false;
  }
  const ref = g.queue.length ? g.queue[g.queue.length - 1] : g.dir;
  if (dir === OPPOSITE[ref]) {
    return false;
  }
  if (dir === ref) {
    // Pressing the way the snake already faces only starts the game.
    if (g.state === 'ready') {
      g.state = 'playing';
      return true;
    }
    return false;
  }
  if (g.queue.length >= 2) {
    return false;
  }
  g.queue.push(dir);
  if (g.state === 'ready') {
    g.state = 'playing';
  }
  return true;
};

// Moves the snake one cell. Returns 'ok', 'over' (wall or own body) or 'won' (board full).
const advance = g => {
  if (g.queue.length) {
    g.dir = g.queue.shift();
  }
  const [dx, dy] = DIRS[g.dir];
  const nx = g.snake[0][0] + dx;
  const ny = g.snake[0][1] + dy;
  if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) {
    return 'over';
  }
  const eat = !!g.food && g.food[0] === nx && g.food[1] === ny;
  // The tail moves away on this step unless the snake grows, so its cell is free to enter.
  const body = eat ? g.snake : g.snake.slice(0, -1);
  if (body.some(([x, y]) => x === nx && y === ny)) {
    return 'over';
  }
  g.snake.unshift([nx, ny]);
  if (!eat) {
    g.snake.pop();
    return 'ok';
  }
  g.score += POINTS;
  g.stepMs = Math.max(MIN_MS, g.stepMs - SPEEDUP_MS);
  const food = placeFood(g.snake);
  g.food = food;
  return food ? 'ok' : 'won';
};

// The lawn is painted once and copied in each frame.
let lawn = null;
const lawnArt = () => {
  if (!lawn) {
    lawn = bake(CW, CH, c => grass(c, CW, CH, CELL));
  }
  return lawn;
};

const paint = (ctx, g) => {
  ctx.drawImage(lawnArt(), 0, 0, CW, CH);
  if (g.food) {
    glossCircle(ctx, g.food[0] * CELL + CELL / 2, g.food[1] * CELL + CELL / 2, 7.5, COLORS.red);
  }
  g.snake.forEach(([x, y], i) => {
    const cx = x * CELL + CELL / 2;
    const cy = y * CELL + CELL / 2;
    if (i === 0) {
      glossCircle(ctx, cx, cy, 8.5, COLORS.green);
      const [ex, ey] = EYE[g.dir];
      ctx.fillStyle = COLORS.black;
      ctx.fillRect(x * CELL + ex, y * CELL + ey, 3, 3);
    } else {
      glossCircle(ctx, cx, cy, 8.5, COLORS.lime);
    }
  });
  if (g.state === 'ready') {
    ctx.fillStyle = 'rgba(6, 40, 80, 0.6)';
    ctx.fillRect(0, 40, CW, 24);
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = COLORS.white;
    ctx.fillText('Press an arrow or swipe to start', CW / 2, 52);
  }
};

const snapshotOf = g => ({
  state: g.state,
  score: g.score,
  dir: g.dir,
  snake: g.snake.map(([x, y]) => [x, y]),
  food: g.food ? [g.food[0], g.food[1]] : null,
  stepMs: g.stepMs,
});

const Game = ({ active, w, h }) => {
  const game = useRef(null);
  if (game.current === null) {
    game.current = createGame();
  }
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const drag = useRef(null);
  const [view, setView] = useState({ state: 'ready', score: 0 });
  const [best, submitBest] = useBest('snake');
  const submitRef = useRef(submitBest);
  submitRef.current = submitBest;

  const redraw = () => {
    if (ctxRef.current) {
      paint(ctxRef.current, game.current);
    }
  };

  const sync = () => {
    const { state, score } = game.current;
    setView(prev => (prev.state === state && prev.score === score ? prev : { state, score }));
  };

  const restart = () => {
    Object.assign(game.current, createGame());
    sync();
    redraw();
  };

  const handleSteer = dir => {
    if (!activeRef.current) {
      return;
    }
    const g = game.current;
    const wasReady = g.state === 'ready';
    if (!steer(g, dir)) {
      return;
    }
    if (wasReady) {
      report('snake', 'start');
    }
    sync();
    redraw();
  };

  const togglePause = () => {
    if (!activeRef.current) {
      return;
    }
    const g = game.current;
    if (g.state === 'playing') {
      g.state = 'paused';
      g.acc = 0;
    } else if (g.state === 'paused') {
      g.state = 'playing';
    } else {
      return;
    }
    sync();
    redraw();
  };

  const resume = () => {
    if (game.current.state === 'paused') {
      togglePause();
    }
  };

  // One frame of the loop: moves the snake on its fixed tick.
  const step = dt => {
    const g = game.current;
    if (g.state !== 'playing') {
      return;
    }
    g.acc += dt;
    let outcome = 'ok';
    while (outcome === 'ok' && g.acc >= g.stepMs) {
      g.acc -= g.stepMs;
      outcome = advance(g);
    }
    if (outcome !== 'ok') {
      g.state = outcome === 'won' ? 'won' : 'over';
      g.acc = 0;
      g.queue = [];
      report('snake', outcome === 'won' ? 'win' : 'over');
      submitRef.current(g.score);
    }
    redraw();
    sync();
  };

  const onKey = e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const dir = KEY_DIRS[key];
    if (dir) {
      e.preventDefault();
      handleSteer(dir);
      return;
    }
    if (key === 'p') {
      e.preventDefault();
      // A held key repeats; only the first press toggles.
      if (!e.repeat) {
        togglePause();
      }
      return;
    }
    if (key === ' ' || key === 'Enter') {
      if (key === ' ') {
        e.preventDefault();
      }
      const { state } = game.current;
      if (!e.repeat && (state === 'over' || state === 'won')) {
        e.preventDefault();
        restart();
      }
    }
  };

  useKeys(onKey, active);
  useLoop(step, view.state === 'playing' && active);

  // Pointer input: swipes steer; a tap on the board pauses, resumes or (after the end) starts a
  // new game. Buttons handle their own clicks.
  const onPointerDown = e => {
    if (e.button > 0 || !activeRef.current) {
      return;
    }
    if (e.target.closest && e.target.closest('button')) {
      return;
    }
    const p = pointIn(e, canvasRef.current);
    drag.current = { x: p.x, y: p.y, moved: false, state: game.current.state };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // capture is optional; the swipe still works while the pointer stays over the game
    }
  };

  const onPointerMove = e => {
    const d = drag.current;
    if (!d) {
      return;
    }
    const p = pointIn(e, canvasRef.current);
    const dx = p.x - d.x;
    const dy = p.y - d.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) {
      return;
    }
    d.moved = true;
    let dir;
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? 'right' : 'left';
    } else {
      dir = dy > 0 ? 'down' : 'up';
    }
    d.x = p.x;
    d.y = p.y;
    handleSteer(dir);
  };

  const onPointerUp = e => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved) {
      return;
    }
    const { state } = game.current;
    // The tap acts on what was on screen when the finger went down, not on a game that ended
    // or changed under it.
    if (state !== d.state) {
      return;
    }
    if (state === 'over' || state === 'won') {
      restart();
    } else if (state === 'paused') {
      togglePause();
    } else if (state === 'playing') {
      // Touch has no P key: a clean tap (not a short, failed swipe) pauses.
      const p = pointIn(e, canvasRef.current);
      if (Math.max(Math.abs(p.x - d.x), Math.abs(p.y - d.y)) < TAP_PX) {
        togglePause();
      }
    }
  };

  const onPointerCancel = () => {
    drag.current = null;
  };

  useEffect(() => {
    const ctx = setupCanvas(canvasRef.current, CW, CH);
    ctxRef.current = ctx;
    paint(ctx, game.current);
  }, []);

  useEffect(() => {
    window.__games = window.__games || {};
    window.__games.snake = { snapshot: () => snapshotOf(game.current) };
    return () => {
      if (window.__games) {
        delete window.__games.snake;
      }
    };
  }, []);

  let overlay = null;
  if (view.state === 'over' || view.state === 'won') {
    overlay = (
      <Message
        title={view.state === 'won' ? 'You win' : 'Game over'}
        action="Play again"
        onAction={restart}>
        {`Score ${view.score}`}
      </Message>
    );
  } else if (view.state === 'paused') {
    overlay = (
      <Message title="Paused" action="Resume" onAction={resume}>
        Press P or tap to resume
      </Message>
    );
  } else if (view.state === 'playing' && !active) {
    overlay = <Message title="Paused" />;
  }

  return (
    <Frame data-game-root="snake" data-state={view.state} style={{ width: w, height: h }}>
      <Bar>
        <Caption>Score</Caption>
        <Readout>{view.score}</Readout>
        <Btn onClick={restart}>New</Btn>
        <Caption>Best</Caption>
        <Readout>{best === null ? 0 : best}</Readout>
      </Bar>
      <Well
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}>
        <Board ref={canvasRef} role="img" aria-label="Snake board" />
        {overlay}
      </Well>
      <Hint>Arrows or swipe to steer. P or tap: pause.</Hint>
    </Frame>
  );
};

Game.propTypes = {
  active: PropTypes.bool.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

export default Game;
