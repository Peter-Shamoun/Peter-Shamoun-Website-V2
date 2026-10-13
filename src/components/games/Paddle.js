import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
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

// Paddle: two-paddle table tennis against the computer. Everything is drawn on a canvas in
// natural pixels; the game state lives in a plain object held in a ref.

const CW = 396;
const CH = 300;
const PAD_W = 8;
const PAD_H = 48;
const PAD_HALF = PAD_H / 2;
const PAD_INSET = 16;
const PLAYER_X = PAD_INSET;
const CPU_X = CW - PAD_INSET - PAD_W;
const BALL = 8;
const MIDDLE = CH / 2;

const SERVE_SPEED = 240;
const MAX_SPEED = 560;
const SPEED_UP = 1.05;
const SERVE_ANGLE = (30 * Math.PI) / 180;
const MAX_ANGLE = (50 * Math.PI) / 180;
const SUB_STEP = 4;
const SERVE_PAUSE = 700;
const WIN_POINTS = 7;

const KEY_SPEED = 360;
const CPU_SPEED = 210;
const CPU_DRIFT = 90;
const CPU_ERROR = 22;

const FONT = '16px "Web437 ANK16", "Courier New", monospace';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const randomError = () => (Math.random() * 2 - 1) * CPU_ERROR;

const centreBall = () => ({ x: CW / 2 - BALL / 2, y: CH / 2 - BALL / 2, vx: 0, vy: 0 });

const createMatch = () => ({
  state: 'ready',
  you: 0,
  cpu: 0,
  playerY: MIDDLE,
  cpuY: MIDDLE,
  ball: centreBall(),
  serveTo: 'you', // the side the next serve travels toward
  wait: 0, // ms left before the ball is launched
  cpuError: 0, // the computer aims this many px off the ball's centre
});

const snapshotOf = g => ({
  state: g.state,
  you: g.you,
  cpu: g.cpu,
  ball: { x: g.ball.x, y: g.ball.y, vx: g.ball.vx, vy: g.ball.vy },
  playerY: g.playerY,
  cpuY: g.cpuY,
  serving: g.serveTo,
});

const launch = g => {
  const dir = g.serveTo === 'you' ? -1 : 1;
  const angle = (Math.random() * 2 - 1) * SERVE_ANGLE;
  g.ball.vx = dir * SERVE_SPEED * Math.cos(angle);
  g.ball.vy = SERVE_SPEED * Math.sin(angle);
  g.cpuError = randomError();
};

// Sends the ball back off a paddle. The offset of the hit from the paddle centre sets the angle;
// dir is +1 when the ball goes right, -1 when it goes left.
const deflect = (ball, paddleY, dir) => {
  const offset = clamp((ball.y + BALL / 2 - paddleY) / PAD_HALF, -1, 1);
  const speed = Math.min(MAX_SPEED, Math.hypot(ball.vx, ball.vy) * SPEED_UP);
  const angle = offset * MAX_ANGLE;
  ball.vx = dir * speed * Math.cos(angle);
  ball.vy = speed * Math.sin(angle);
};

const overlaps = (ball, paddleX, paddleY) =>
  ball.x < paddleX + PAD_W &&
  ball.x + BALL > paddleX &&
  ball.y < paddleY + PAD_HALF &&
  ball.y + BALL > paddleY - PAD_HALF;

// Returns 'won' or 'over' when the point ends the match, otherwise null.
const scorePoint = (g, who) => {
  if (who === 'you') {
    g.you += 1;
  } else {
    g.cpu += 1;
  }
  g.serveTo = who === 'you' ? 'cpu' : 'you';
  g.ball = centreBall();
  g.wait = SERVE_PAUSE;
  if (g.you >= WIN_POINTS) {
    g.state = 'won';
    return 'won';
  }
  if (g.cpu >= WIN_POINTS) {
    g.state = 'over';
    return 'over';
  }
  return null;
};

// Moves the ball in sub-steps of at most SUB_STEP px so it cannot pass through a paddle.
const moveBall = (g, s) => {
  const b = g.ball;
  const fastest = Math.max(Math.abs(b.vx), Math.abs(b.vy));
  const steps = Math.max(1, Math.ceil((fastest * s) / SUB_STEP));
  const sub = s / steps;
  for (let i = 0; i < steps; i += 1) {
    b.x += b.vx * sub;
    b.y += b.vy * sub;
    if (b.y < 0) {
      b.y = -b.y;
      b.vy = -b.vy;
    } else if (b.y > CH - BALL) {
      b.y = 2 * (CH - BALL) - b.y;
      b.vy = -b.vy;
    }
    if (b.vx < 0 && overlaps(b, PLAYER_X, g.playerY)) {
      b.x = PLAYER_X + PAD_W;
      deflect(b, g.playerY, 1);
      g.cpuError = randomError();
    } else if (b.vx > 0 && overlaps(b, CPU_X, g.cpuY)) {
      b.x = CPU_X - BALL;
      deflect(b, g.cpuY, -1);
    }
    if (b.x + BALL <= 0) {
      return scorePoint(g, 'cpu');
    }
    if (b.x >= CW) {
      return scorePoint(g, 'you');
    }
  }
  return null;
};

// The computer follows the ball's height only while the ball comes toward it; otherwise it
// drifts back to the middle.
const stepCpu = (g, s) => {
  const coming = g.ball.vx > 0;
  const target = coming ? g.ball.y + BALL / 2 + g.cpuError : MIDDLE;
  const max = (coming ? CPU_SPEED : CPU_DRIFT) * s;
  const move = clamp(target - g.cpuY, -max, max);
  g.cpuY = clamp(g.cpuY + move, PAD_HALF, CH - PAD_HALF);
};

// One frame of game time. Returns 'won', 'over' or null.
const advance = (g, ms, held) => {
  const s = ms / 1000;
  if (g.state === 'ready' || g.state === 'playing') {
    const up = held.has('ArrowUp') || held.has('w');
    const down = held.has('ArrowDown') || held.has('s');
    const dir = (down ? 1 : 0) - (up ? 1 : 0);
    if (dir !== 0) {
      g.playerY = clamp(g.playerY + dir * KEY_SPEED * s, PAD_HALF, CH - PAD_HALF);
    }
  }
  if (g.state !== 'playing') {
    return null;
  }
  stepCpu(g, s);
  if (g.wait > 0) {
    g.wait -= ms;
    if (g.wait <= 0) {
      g.wait = 0;
      launch(g);
    }
    return null;
  }
  return moveBall(g, s);
};

const draw = (ctx, g) => {
  if (!ctx) {
    return;
  }
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, CW, CH);
  ctx.fillStyle = COLORS.shadow;
  for (let y = 0; y < CH; y += 20) {
    ctx.fillRect(CW / 2 - 2, y, 4, 12);
  }
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(PLAYER_X, Math.round(g.playerY - PAD_HALF), PAD_W, PAD_H);
  ctx.fillRect(CPU_X, Math.round(g.cpuY - PAD_HALF), PAD_W, PAD_H);
  ctx.fillRect(Math.round(g.ball.x), Math.round(g.ball.y), BALL, BALL);
  if (g.state === 'ready') {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 176, CW, 24);
    ctx.fillStyle = COLORS.white;
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Press Space or tap to serve', CW / 2, 188);
  }
};

const BOARD_STYLE = { display: 'block' };

const Game = ({ active, w, h }) => {
  const game = useRef(null);
  if (game.current === null) {
    game.current = createMatch();
  }
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const shown = useRef({ state: 'ready', you: 0, cpu: 0 });
  const streakRef = useRef(0);
  const startedRef = useRef(false);
  const [view, setView] = useState(shown.current);
  const [streak, setStreak] = useState(0);
  const [best, submitBest] = useBest('paddle');
  const submitRef = useRef(submitBest);
  submitRef.current = submitBest;
  const held = useHeldKeys(active, ['ArrowUp', 'ArrowDown', 'w', 's']);

  // Pushes the game's state to React only when something the page shows has changed.
  const sync = () => {
    const g = game.current;
    const last = shown.current;
    if (last.state === g.state && last.you === g.you && last.cpu === g.cpu) {
      return;
    }
    shown.current = { state: g.state, you: g.you, cpu: g.cpu };
    setView(shown.current);
  };

  const serve = () => {
    const g = game.current;
    if (g.state !== 'ready') {
      return;
    }
    g.state = 'playing';
    g.wait = SERVE_PAUSE;
    if (!startedRef.current) {
      startedRef.current = true;
      report('paddle', 'start');
    }
    sync();
  };

  const togglePause = () => {
    const g = game.current;
    if (g.state === 'playing') {
      g.state = 'paused';
    } else if (g.state === 'paused') {
      g.state = 'playing';
    } else {
      return;
    }
    sync();
  };

  const resetMatch = () => {
    Object.assign(game.current, createMatch());
    // The loop is stopped while the window is not in front, so draw the fresh table here.
    draw(ctxRef.current, game.current);
    sync();
  };

  const newMatch = e => {
    const { state } = game.current;
    if (state === 'playing' || state === 'paused') {
      streakRef.current = 0;
      setStreak(0);
    }
    e.currentTarget.blur();
    resetMatch();
  };

  const finish = result => {
    if (result === 'won') {
      streakRef.current += 1;
      setStreak(streakRef.current);
      submitRef.current(streakRef.current);
      report('paddle', 'win');
    } else {
      streakRef.current = 0;
      setStreak(0);
      report('paddle', 'over');
    }
  };

  const aim = e => {
    const g = game.current;
    if (!active || (g.state !== 'ready' && g.state !== 'playing')) {
      return;
    }
    g.playerY = clamp(pointIn(e, canvasRef.current).y, PAD_HALF, CH - PAD_HALF);
  };

  const onPointerDown = e => {
    // A press on a window that is not in front only brings it forward.
    if (!active) {
      return;
    }
    aim(e);
    serve();
  };

  useKeys(e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      serve();
    } else if (e.key === 'p' || e.key === 'P') {
      togglePause();
    }
  }, active);

  useEffect(() => {
    ctxRef.current = setupCanvas(canvasRef.current, CW, CH);
    draw(ctxRef.current, game.current);
    window.__games = window.__games || {};
    window.__games.paddle = { snapshot: () => snapshotOf(game.current) };
    return () => {
      if (window.__games) {
        delete window.__games.paddle;
      }
    };
  }, []);

  const step = dt => {
    const result = advance(game.current, Math.min(50, dt), held.current);
    if (result) {
      finish(result);
    }
    draw(ctxRef.current, game.current);
    sync();
  };

  useLoop(step, active);

  // A match in play is held, and reads as paused, while the window is not in front.
  const onHold = view.state === 'playing' && !active;
  let overlay = null;
  if (view.state === 'won' || view.state === 'over') {
    overlay = (
      <Message
        title={view.state === 'won' ? 'You win' : 'You lose'}
        action="Play again"
        onAction={resetMatch}>
        {`${view.you} to ${view.cpu}.`}
        <br />
        {`Wins in a row: ${streak}. Best run: ${best || 0}.`}
      </Message>
    );
  } else if (view.state === 'paused') {
    overlay = (
      <Message title="Paused" action="Resume" onAction={togglePause}>
        Press P to resume
      </Message>
    );
  } else if (onHold) {
    overlay = <Message title="Paused" />;
  }

  return (
    <Frame
      data-game-root="paddle"
      data-state={onHold ? 'paused' : view.state}
      style={{ width: w, height: h }}>
      <Bar>
        <Caption>You</Caption>
        <Readout>{view.you}</Readout>
        <Btn onClick={newMatch}>New</Btn>
        <Caption>CPU</Caption>
        <Readout>{view.cpu}</Readout>
      </Bar>
      <Well>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Pong. Your paddle is on the left, the computer's on the right."
          style={BOARD_STYLE}
          onPointerDown={onPointerDown}
          onPointerMove={aim}
        />
        {overlay}
      </Well>
      <Hint>Mouse, finger or Up/Down. First to 7.</Hint>
    </Frame>
  );
};

Game.propTypes = {
  active: PropTypes.bool.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

export default Game;
