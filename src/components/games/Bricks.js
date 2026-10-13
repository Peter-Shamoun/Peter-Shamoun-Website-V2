import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  useHeldKeys,
  useBest,
  report,
} from './kit';

// Bricks: a ball-and-paddle brick breaker. The playing field is 396 x 300 natural pixels.

const FIELD_W = 396;
const FIELD_H = 300;
const BALL = 6;
const PADDLE_W = 64;
const PADDLE_H = 8;
const PADDLE_Y = FIELD_H - 16 - PADDLE_H; // 276: 16 px above the bottom
const PADDLE_SPEED = 420; // px per second, from the arrow keys or A and D
const COLS = 11;
const ROWS = 6;
const BRICK_W = 34;
const BRICK_H = 12;
const BRICK_GAP = 2;
const BRICK_TOP = 34;
const BRICK_LEFT = Math.floor((FIELD_W - (COLS * BRICK_W + (COLS - 1) * BRICK_GAP)) / 2);
const ROW_COLORS = [
  COLORS.red,
  COLORS.orange,
  COLORS.yellow,
  COLORS.lime,
  COLORS.cyan,
  COLORS.blue,
];
const ROW_POINTS = [60, 50, 40, 30, 20, 10];
const LIVES = 3;
const START_SPEED = 220; // px per second on level 1
const LEVEL_SPEED_STEP = 30; // added to the start speed for each new level
const SPEED_PER_BRICK = 4; // px per second, for each brick broken during one serve
const MAX_SPEED = 460;
const SUB_STEP = 3; // the ball moves at most this many px at a time
const MAX_ANGLE = Math.PI / 3; // 60 degrees either side of straight up, at the paddle edges
const LAUNCH_SPREAD = 0.35; // radians, about 20 degrees either side of straight up
const FLASH_MS = 2000; // how long "Level n" shows after a level is cleared
const FONT = '16px "Web437 ANK16", "Courier New", monospace';

// Every brick as a rectangle, indexed row * COLS + col.
const BRICK_RECTS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  return {
    x: BRICK_LEFT + c * (BRICK_W + BRICK_GAP),
    y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
    r,
  };
});

const startSpeedFor = level => Math.min(MAX_SPEED, START_SPEED + (level - 1) * LEVEL_SPEED_STEP);

const clampPaddle = x => Math.min(FIELD_W - PADDLE_W / 2, Math.max(PADDLE_W / 2, x));

// The ball sits on the paddle, centred on it, until launched.
const placeBall = g => {
  g.ball.x = g.paddleX - BALL / 2;
  g.ball.y = PADDLE_Y - BALL;
  g.ball.ux = 0;
  g.ball.uy = -1;
  g.ball.stuck = true;
};

const freshGame = () => {
  const g = {
    state: 'ready', // 'ready' | 'playing' | 'paused' | 'over'
    auto: false, // paused because the window lost focus; resumes by itself
    started: false,
    score: 0,
    lives: LIVES,
    level: 1,
    alive: Array(COLS * ROWS).fill(true),
    bricksLeft: COLS * ROWS,
    paddleX: FIELD_W / 2,
    ball: { x: 0, y: 0, ux: 0, uy: -1, stuck: true }, // ux, uy: unit direction
    speed: START_SPEED,
    flashMs: 0,
  };
  placeBall(g);
  return g;
};

const launch = g => {
  const angle = (Math.random() * 2 - 1) * LAUNCH_SPREAD;
  g.speed = startSpeedFor(g.level);
  g.ball.ux = Math.sin(angle);
  g.ball.uy = -Math.cos(angle);
  g.ball.stuck = false;
  g.state = 'playing';
  g.auto = false;
};

// Starts the next level: bricks refill, the ball goes back on the paddle, score and lives stay.
const clearLevel = g => {
  g.level += 1;
  g.alive = Array(COLS * ROWS).fill(true);
  g.bricksLeft = COLS * ROWS;
  g.state = 'ready';
  g.flashMs = FLASH_MS;
  placeBall(g);
};

// Moves the ball for secs seconds in sub-steps of at most SUB_STEP px. Returns 'lost' when the
// ball falls past the paddle, 'cleared' when the last brick goes, or null.
const advanceBall = (g, secs) => {
  const ball = g.ball;
  const dist = g.speed * secs;
  const n = Math.max(1, Math.ceil(dist / SUB_STEP));
  const dt = secs / n;
  for (let i = 0; i < n; i += 1) {
    const prevBottom = ball.y + BALL;
    ball.x += ball.ux * g.speed * dt;
    ball.y += ball.uy * g.speed * dt;

    // side and top walls
    if (ball.x < 0) {
      ball.x = 0;
      ball.ux = Math.abs(ball.ux);
    } else if (ball.x > FIELD_W - BALL) {
      ball.x = FIELD_W - BALL;
      ball.ux = -Math.abs(ball.ux);
    }
    if (ball.y < 0) {
      ball.y = 0;
      ball.uy = Math.abs(ball.uy);
    }

    // paddle: only from above, and only where the paddle is
    if (ball.uy > 0 && prevBottom <= PADDLE_Y && ball.y + BALL >= PADDLE_Y) {
      const left = g.paddleX - PADDLE_W / 2;
      const right = g.paddleX + PADDLE_W / 2;
      if (ball.x + BALL > left && ball.x < right) {
        const centre = ball.x + BALL / 2;
        const offset = Math.max(-1, Math.min(1, (centre - g.paddleX) / (PADDLE_W / 2)));
        const angle = offset * MAX_ANGLE;
        ball.ux = Math.sin(angle);
        ball.uy = -Math.cos(angle);
        ball.y = PADDLE_Y - BALL;
      }
    }

    if (ball.y >= FIELD_H) {
      return 'lost';
    }

    // at most one brick per sub-step, reflected on the axis of the smaller overlap
    for (let b = 0; b < BRICK_RECTS.length; b += 1) {
      if (g.alive[b]) {
        const rect = BRICK_RECTS[b];
        const ox = Math.min(ball.x + BALL, rect.x + BRICK_W) - Math.max(ball.x, rect.x);
        const oy = Math.min(ball.y + BALL, rect.y + BRICK_H) - Math.max(ball.y, rect.y);
        if (ox > 0 && oy > 0) {
          if (ox < oy) {
            if (ball.x + BALL / 2 < rect.x + BRICK_W / 2) {
              ball.x = rect.x - BALL;
              ball.ux = -Math.abs(ball.ux);
            } else {
              ball.x = rect.x + BRICK_W;
              ball.ux = Math.abs(ball.ux);
            }
          } else if (ball.y + BALL / 2 < rect.y + BRICK_H / 2) {
            ball.y = rect.y - BALL;
            ball.uy = -Math.abs(ball.uy);
          } else {
            ball.y = rect.y + BRICK_H;
            ball.uy = Math.abs(ball.uy);
          }
          g.alive[b] = false;
          g.bricksLeft -= 1;
          g.score += ROW_POINTS[rect.r];
          g.speed = Math.min(MAX_SPEED, g.speed + SPEED_PER_BRICK);
          break;
        }
      }
    }
    if (g.bricksLeft === 0) {
      return 'cleared';
    }
  }
  return null;
};

const uiOf = g => ({
  state: g.state,
  auto: g.auto,
  score: g.score,
  lives: g.lives,
  level: g.level,
  flash: g.flashMs > 0,
});

const snapshotOf = g => ({
  state: g.state,
  score: g.score,
  lives: g.lives,
  level: g.level,
  bricksLeft: g.bricksLeft,
  ball: {
    x: g.ball.x,
    y: g.ball.y,
    vx: g.ball.stuck ? 0 : g.ball.ux * g.speed,
    vy: g.ball.stuck ? 0 : g.ball.uy * g.speed,
    stuck: g.ball.stuck,
  },
  paddleX: g.paddleX,
});

const drawBoard = (ctx, g) => {
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  for (let b = 0; b < BRICK_RECTS.length; b += 1) {
    if (g.alive[b]) {
      const rect = BRICK_RECTS[b];
      ctx.fillStyle = ROW_COLORS[rect.r];
      ctx.fillRect(rect.x, rect.y, BRICK_W, BRICK_H);
    }
  }
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(Math.round(g.paddleX - PADDLE_W / 2), PADDLE_Y, PADDLE_W, PADDLE_H);
  ctx.fillRect(Math.round(g.ball.x), Math.round(g.ball.y), BALL, BALL);
  if (g.state === 'ready') {
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Press Space or tap to launch', FIELD_W / 2, 200);
  }
};

const keepFocus = e => e.preventDefault();

const Pair = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Board = styled.canvas`
  display: block;
`;

const Game = ({ active, w, h }) => {
  const gs = useRef(null);
  if (gs.current === null) {
    gs.current = freshGame();
  }
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  const [ui, setUi] = useState(() => uiOf(gs.current));
  const [best, submit] = useBest('bricks');
  const held = useHeldKeys(active, ['ArrowLeft', 'ArrowRight', 'a', 'd']);

  const sync = useCallback(() => setUi(uiOf(gs.current)), []);

  const paint = () => {
    if (ctxRef.current) {
      drawBoard(ctxRef.current, gs.current);
    }
  };

  const newGame = () => {
    gs.current = freshGame();
    sync();
    paint();
  };

  const beginLaunch = () => {
    const g = gs.current;
    if (!g.started) {
      g.started = true;
      report('bricks', 'start');
    }
    launch(g);
    sync();
  };

  const togglePause = () => {
    const g = gs.current;
    if (g.state === 'playing') {
      g.state = 'paused';
      g.auto = false;
    } else if (g.state === 'paused' && !g.auto) {
      g.state = 'playing';
    } else {
      return;
    }
    sync();
  };

  const onBallLost = () => {
    const g = gs.current;
    g.lives -= 1;
    if (g.lives <= 0) {
      g.lives = 0;
      g.state = 'over';
      placeBall(g);
      submit(g.score);
      report('bricks', 'over');
    } else {
      g.state = 'ready';
      placeBall(g);
    }
    sync();
  };

  const step = dt => {
    const g = gs.current;
    const secs = dt / 1000;
    if (g.state === 'ready' || g.state === 'playing') {
      const keys = held.current;
      const dir =
        (keys.has('ArrowRight') || keys.has('d') ? 1 : 0) -
        (keys.has('ArrowLeft') || keys.has('a') ? 1 : 0);
      if (dir !== 0) {
        g.paddleX = clampPaddle(g.paddleX + dir * PADDLE_SPEED * secs);
      }
      if (g.flashMs > 0) {
        g.flashMs = Math.max(0, g.flashMs - dt);
        if (g.flashMs === 0) {
          sync();
        }
      }
    }
    if (g.state === 'ready') {
      placeBall(g);
    }
    if (g.state === 'playing') {
      const outcome = advanceBall(g, secs);
      if (outcome === 'lost') {
        onBallLost();
      } else if (outcome === 'cleared') {
        clearLevel(g);
        sync();
      }
    }
    if (ctxRef.current) {
      drawBoard(ctxRef.current, g);
    }
  };

  useLoop(step, active);

  useKeys(e => {
    const g = gs.current;
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.key === ' ') {
        e.preventDefault();
      }
      if (e.repeat) {
        return; // a held key must not start a new game and launch it in one go
      }
      if (g.state === 'ready') {
        beginLaunch();
      } else if (g.state === 'over') {
        newGame();
      }
      return;
    }
    if ((e.key === 'p' || e.key === 'P') && !e.repeat) {
      togglePause();
    }
  }, active);

  // Returns the game when the pointer may move the paddle, otherwise null.
  const pointerGame = e => {
    if (!activeRef.current) {
      return null;
    }
    const g = gs.current;
    if (g.state !== 'ready' && g.state !== 'playing') {
      return null;
    }
    const p = pointIn(e, e.currentTarget);
    g.paddleX = clampPaddle(p.x);
    return g;
  };

  const onPointerMove = e => {
    pointerGame(e);
  };

  const onPointerDown = e => {
    const g = pointerGame(e);
    if (g && g.state === 'ready') {
      beginLaunch();
    }
  };

  // Pausing when the window goes behind, and carrying on when it comes back.
  useEffect(() => {
    const g = gs.current;
    if (!active) {
      if (g.state === 'playing') {
        g.state = 'paused';
        g.auto = true;
        sync();
      }
    } else if (g.auto) {
      g.auto = false;
      g.state = 'playing';
      sync();
    }
  }, [active, sync]);

  useEffect(() => {
    ctxRef.current = setupCanvas(canvasRef.current, FIELD_W, FIELD_H);
    drawBoard(ctxRef.current, gs.current);
  }, []);

  useEffect(() => {
    window.__games = window.__games || {};
    const entry = {
      snapshot: () => snapshotOf(gs.current),
    };
    window.__games['bricks'] = entry;
    return () => {
      // only our own entry: a newer mount may already have registered itself
      if (window.__games && window.__games['bricks'] === entry) {
        delete window.__games['bricks'];
      }
    };
  }, []);

  let overlay = null;
  if (ui.state === 'paused') {
    overlay = <Message title="Paused">{ui.auto ? null : 'Press P to continue'}</Message>;
  } else if (ui.state === 'over') {
    overlay = (
      <Message title="Game over" action="Play again" onAction={newGame}>
        {`Score ${ui.score}`}
      </Message>
    );
  }

  return (
    <Frame data-game-root="bricks" data-state={ui.state} style={{ width: w, height: h }}>
      <Bar>
        <Pair>
          <Caption>Score</Caption>
          <Readout>{ui.score}</Readout>
        </Pair>
        <Caption>{`Lives: ${ui.lives}`}</Caption>
        <Btn onMouseDown={keepFocus} onClick={newGame}>
          New
        </Btn>
        <Pair>
          <Caption>Best</Caption>
          <Readout>{best === null ? 0 : best}</Readout>
        </Pair>
      </Bar>
      <Well $bg={COLORS.black}>
        <Board
          ref={canvasRef}
          role="img"
          aria-label="Bricks playing field"
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
        />
        {overlay}
      </Well>
      <Hint>{ui.flash ? `Level ${ui.level}` : 'Mouse, finger or arrows move. Space: launch.'}</Hint>
    </Frame>
  );
};

Game.propTypes = {
  active: PropTypes.bool.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

export default Game;
