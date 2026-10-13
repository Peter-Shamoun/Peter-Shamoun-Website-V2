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
  useHeldKeys,
  useBest,
  report,
} from './kit';

// Invaders: a fixed shooter. Rows of aliens march sideways, drop a row at the edges and creep
// down toward the cannon. Everything is kept in plain numbers in a ref and drawn on a canvas.

const CW = 396;
const CH = 328;
const MARGIN = 8;
const COLS = 9;
const ROWS = 5;
const COL_W = 28;
const ROW_H = 22;
const SPR_W = 16;
const SPR_H = 12;
const SPR_DX = 6; // (28 - 16) / 2, the sprite is centred in its cell
const SPR_DY = 5; // (22 - 12) / 2
const STEP_PX = 6;
const DROP_PX = 12;
const START_Y = 24;
const MAX_WAVE_DROP = 4;
const CANNON_W = 22;
const CANNON_H = 12;
const CANNON_Y = 304;
const CANNON_SPEED = 220;
const SHOT_W = 2;
const SHOT_H = 8;
const SHOT_SPEED = 420;
const ALIEN_SHOT_SPEED = 170;
const MAX_ALIEN_SHOTS = 3;
const SHIELD_Y = 262;
const SHIELD_X = [56, 142, 228, 314];
const CELL = 4;
const SHIELD_COLS = 6;
const SHIELD_ROWS = 4;
const LIVES = 3;
const HIT_FREEZE = 900;
const POINTS = { A: 30, B: 20, C: 10 };
const MOVE_KEYS = ['ArrowLeft', 'ArrowRight', 'a', 'd', ' '];
const HELD_KEYS = ['ArrowLeft', 'ArrowRight', 'a', 'd', ' '];

// Three alien designs of my own, 8 x 6 pixels, each with two frames. Drawn at 2 px per pixel.
const SPRITES = {
  // A: a box robot with antennae and a row of legs
  A: {
    color: COLORS.cyan,
    frames: [
      ['..#..#..', '.######.', '##.##.##', '########', '#.####.#', '..#..#..'],
      ['..#..#..', '.######.', '##.##.##', '########', '.#.##.#.', '#.#..#.#'],
    ],
  },
  // B: a saucer with a dome and lights
  B: {
    color: COLORS.lime,
    frames: [
      ['..####..', '.######.', '########', '.##..##.', '#.#..#.#', '..#..#..'],
      ['..####..', '.######.', '########', '.##..##.', '#.#..#.#', '#......#'],
    ],
  },
  // C: a small bug with splayed legs
  C: {
    color: COLORS.yellow,
    frames: [
      ['#......#', '.#.##.#.', '..####..', '.######.', '..#..#..', '.#.##.#.'],
      ['.#....#.', '#.#..#.#', '..####..', '.######.', '..#..#..', '#......#'],
    ],
  },
};

const kindOfRow = row => {
  if (row === 0) {
    return 'A';
  }
  return row <= 2 ? 'B' : 'C';
};

const clampX = x => Math.max(MARGIN, Math.min(CW - MARGIN - CANNON_W, x));
const cannonPx = g => Math.round(g.cannonX);
const alienX = (g, col) => g.blockX + col * COL_W + SPR_DX;
const alienY = (g, row) => g.blockY + row * ROW_H + SPR_DY;
const alienBox = (g, i) => ({
  x: alienX(g, i % COLS),
  y: alienY(g, Math.floor(i / COLS)),
  w: SPR_W,
  h: SPR_H,
});
const cellBox = (shield, idx) => ({
  x: shield.x + (idx % SHIELD_COLS) * CELL,
  y: SHIELD_Y + Math.floor(idx / SHIELD_COLS) * CELL,
  w: CELL,
  h: CELL,
});
const shotBox = s => ({ x: s.x, y: s.y, w: SHOT_W, h: SHOT_H });
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

// The time between march steps: 600 ms with all 45 aliens, 60 ms with one, and a little faster
// in each later wave.
const stepMsFor = (alive, wave) => {
  const base = 60 + (540 * (Math.max(1, alive) - 1)) / 44;
  const speedUp = 1 - 0.06 * Math.min(wave - 1, MAX_WAVE_DROP);
  return Math.round(base * speedUp);
};

const makeAliens = () => new Array(ROWS * COLS).fill(true);
const makeShields = () =>
  SHIELD_X.map(x => ({ x, cells: new Array(SHIELD_COLS * SHIELD_ROWS).fill(true) }));

const createGame = () => ({
  status: 'ready', // 'ready' | 'playing' | 'paused' | 'over'
  score: 0,
  lives: LIVES,
  wave: 1,
  cannonX: (CW - CANNON_W) / 2,
  dragging: false,
  shots: [],
  alienShots: [],
  shields: makeShields(),
  aliens: makeAliens(),
  aliensLeft: ROWS * COLS,
  blockX: MARGIN - SPR_DX,
  blockY: START_Y,
  dir: 1,
  frame: 0,
  stepAcc: 0,
  stepMs: stepMsFor(ROWS * COLS, 1),
  fireAcc: 0,
  freeze: 0,
});

// Bounds of the living aliens by column and row, or null when none are left.
const extent = g => {
  let minCol = COLS;
  let maxCol = -1;
  let maxRow = -1;
  g.aliens.forEach((alive, i) => {
    if (!alive) {
      return;
    }
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    maxRow = Math.max(maxRow, row);
  });
  return maxCol < 0 ? null : { minCol, maxCol, maxRow };
};

const march = g => {
  const ext = extent(g);
  if (!ext) {
    return;
  }
  const dx = g.dir * STEP_PX;
  const left = g.blockX + dx + ext.minCol * COL_W + SPR_DX;
  const right = g.blockX + dx + ext.maxCol * COL_W + SPR_DX + SPR_W;
  if (left < MARGIN || right > CW - MARGIN) {
    g.blockY += DROP_PX;
    g.dir = -g.dir;
  } else {
    g.blockX += dx;
  }
  g.frame = 1 - g.frame;
};

const reached = g => {
  const ext = extent(g);
  return !!ext && alienY(g, ext.maxRow) + SPR_H >= CANNON_Y;
};

// Shield cells that living aliens touch are destroyed.
const eatShields = g => {
  g.aliens.forEach((alive, i) => {
    if (!alive) {
      return;
    }
    const box = alienBox(g, i);
    g.shields.forEach(s =>
      s.cells.forEach((ok, idx) => {
        if (ok && overlap(box, cellBox(s, idx))) {
          s.cells[idx] = false;
        }
      }),
    );
  });
};

// A shot that hits a shield cell destroys that cell and the shot. Returns true when it did.
const takeShield = (g, box) =>
  g.shields.some(s =>
    s.cells.some((ok, idx) => {
      if (ok && overlap(box, cellBox(s, idx))) {
        s.cells[idx] = false;
        return true;
      }
      return false;
    }),
  );

// Kills the first living alien the box touches. Returns true when one was hit.
const hitAlien = (g, box) => {
  const idx = g.aliens.findIndex((alive, i) => alive && overlap(box, alienBox(g, i)));
  if (idx < 0) {
    return false;
  }
  g.aliens[idx] = false;
  g.aliensLeft -= 1;
  g.score += POINTS[kindOfRow(Math.floor(idx / COLS))];
  return true;
};

const dropAlienShot = g => {
  const options = [];
  for (let col = 0; col < COLS; col += 1) {
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      if (g.aliens[row * COLS + col]) {
        options.push({ row, col });
        break;
      }
    }
  }
  if (!options.length) {
    return;
  }
  const pick = options[Math.floor(Math.random() * options.length)];
  g.alienShots.push({
    x: alienX(g, pick.col) + 7,
    y: alienY(g, pick.row) + SPR_H,
  });
};

const updatePlayerShots = (g, dt) => {
  const dy = (SHOT_SPEED * dt) / 1000;
  g.shots = g.shots.filter(s => {
    s.y -= dy;
    if (s.y + SHOT_H < 0) {
      return false;
    }
    const box = shotBox(s);
    if (takeShield(g, box)) {
      return false;
    }
    return !hitAlien(g, box);
  });
};

const updateAlienShots = (g, dt) => {
  const dy = (ALIEN_SHOT_SPEED * dt) / 1000;
  const cannon = { x: cannonPx(g), y: CANNON_Y, w: CANNON_W, h: CANNON_H };
  let hit = false;
  g.alienShots = g.alienShots.filter(s => {
    if (hit) {
      return false;
    }
    s.y += dy;
    if (s.y > CH) {
      return false;
    }
    const box = shotBox(s);
    if (takeShield(g, box)) {
      return false;
    }
    if (overlap(box, cannon)) {
      hit = true;
      return false;
    }
    return true;
  });
  if (hit) {
    g.lives -= 1;
    g.shots = [];
    g.alienShots = [];
    if (g.lives <= 0) {
      g.status = 'over';
    } else {
      g.freeze = HIT_FREEZE;
    }
  }
};

const nextWave = g => {
  g.wave += 1;
  g.aliens = makeAliens();
  g.aliensLeft = ROWS * COLS;
  g.shields = makeShields();
  g.shots = [];
  g.alienShots = [];
  g.blockX = MARGIN - SPR_DX;
  g.blockY = START_Y + DROP_PX * Math.min(g.wave - 1, MAX_WAVE_DROP);
  g.dir = 1;
  g.frame = 0;
  g.stepAcc = 0;
  g.fireAcc = 0;
};

// One frame of the game. Only called while the game is playing.
const updateGame = (g, dt, keys) => {
  const left = keys.has('ArrowLeft') || keys.has('a');
  const right = keys.has('ArrowRight') || keys.has('d');
  if (!g.dragging && left !== right) {
    g.cannonX = clampX(g.cannonX + ((right ? 1 : -1) * CANNON_SPEED * dt) / 1000);
  }
  if (g.freeze > 0) {
    g.freeze -= dt;
    return;
  }

  g.fireAcc += dt;
  const gap = g.wave >= 3 ? 700 : 900;
  if (g.fireAcc >= gap) {
    g.fireAcc -= gap;
    if (g.alienShots.length < MAX_ALIEN_SHOTS) {
      dropAlienShot(g);
    }
  }

  if ((keys.has(' ') || g.dragging) && g.shots.length === 0) {
    g.shots.push({ x: cannonPx(g) + 10, y: CANNON_Y - SHOT_H });
  }

  updatePlayerShots(g, dt);
  updateAlienShots(g, dt);
  if (g.status === 'over') {
    return;
  }
  if (g.aliensLeft === 0) {
    nextWave(g);
    return;
  }

  g.stepMs = stepMsFor(g.aliensLeft, g.wave);
  g.stepAcc += dt;
  if (g.stepAcc >= g.stepMs) {
    g.stepAcc -= g.stepMs;
    march(g);
    eatShields(g);
    if (reached(g)) {
      g.status = 'over';
    }
  }
};

const drawSprite = (ctx, rows, color, x, y) => {
  ctx.fillStyle = color;
  rows.forEach((line, r) => {
    for (let c = 0; c < line.length; c += 1) {
      if (line[c] === '#') {
        ctx.fillRect(x + c * 2, y + r * 2, 2, 2);
      }
    }
  });
};

const drawGame = (ctx, g) => {
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, CW, CH);

  ctx.fillStyle = COLORS.green;
  g.shields.forEach(s =>
    s.cells.forEach((ok, idx) => {
      if (ok) {
        const b = cellBox(s, idx);
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }
    }),
  );

  g.aliens.forEach((alive, i) => {
    if (!alive) {
      return;
    }
    const row = Math.floor(i / COLS);
    const sprite = SPRITES[kindOfRow(row)];
    drawSprite(ctx, sprite.frames[g.frame], sprite.color, alienX(g, i % COLS), alienY(g, row));
  });

  const cx = cannonPx(g);
  ctx.fillStyle = COLORS.lime;
  ctx.fillRect(cx + 9, CANNON_Y, 4, 6);
  ctx.fillRect(cx, CANNON_Y + 6, CANNON_W, 6);

  ctx.fillStyle = COLORS.white;
  g.shots.forEach(s => ctx.fillRect(s.x, s.y, SHOT_W, SHOT_H));
  ctx.fillStyle = COLORS.yellow;
  g.alienShots.forEach(s => ctx.fillRect(s.x, s.y, SHOT_W, SHOT_H));

  ctx.font = '16px "Web437 ANK16", "Courier New", monospace';
  ctx.fillStyle = COLORS.white;
  ctx.textBaseline = 'top';
  ctx.fillText(`Wave ${g.wave}`, 6, 4);
};

const Screen = styled.canvas`
  display: block;
  touch-action: none;
`;

// The kit's message veil covers the whole board and would take every press, so a tap could never
// start the game. Presses go through it to the canvas; only the button in a message takes them.
const Field = styled(Well)`
  > div {
    pointer-events: none;
  }

  button {
    pointer-events: auto;
  }
`;

const Game = ({ active }) => {
  const [ui, setUi] = useState({ status: 'ready', score: 0, lives: LIVES });
  const [best, submit] = useBest('invaders');
  const gRef = useRef(null);
  if (gRef.current === null) {
    gRef.current = createGame();
  }
  const ctxRef = useRef(null);
  const canvasRef = useRef(null);
  const lastKey = useRef('ready|0|3');
  const submitRef = useRef(submit);
  submitRef.current = submit;
  const activeRef = useRef(active);
  activeRef.current = active;
  const held = useHeldKeys(active, HELD_KEYS);

  const sync = () => {
    const g = gRef.current;
    const key = `${g.status}|${g.score}|${g.lives}`;
    if (key !== lastKey.current) {
      lastKey.current = key;
      setUi({ status: g.status, score: g.score, lives: g.lives });
    }
  };

  const draw = () => {
    if (ctxRef.current) {
      drawGame(ctxRef.current, gRef.current);
    }
  };

  const begin = () => {
    const g = gRef.current;
    if (g.status !== 'ready') {
      return;
    }
    g.status = 'playing';
    report('invaders', 'start');
    sync();
  };

  const togglePause = () => {
    const g = gRef.current;
    if (g.status === 'playing') {
      g.status = 'paused';
    } else if (g.status === 'paused') {
      g.status = 'playing';
    } else {
      return;
    }
    sync();
  };

  const newGame = event => {
    gRef.current = createGame();
    if (event && event.currentTarget && event.currentTarget.blur) {
      event.currentTarget.blur();
    }
    sync();
    draw();
  };

  const step = dt => {
    const g = gRef.current;
    if (g.status !== 'playing') {
      return;
    }
    updateGame(g, dt, held.current);
    if (g.status === 'over') {
      report('invaders', 'over');
      submitRef.current(g.score);
    }
    sync();
    draw();
  };

  useLoop(step, ui.status === 'playing' && active);

  useKeys(e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === 'p') {
      if (!e.repeat) {
        togglePause();
      }
      return;
    }
    if (MOVE_KEYS.includes(key)) {
      if (key === 'ArrowLeft' || key === 'ArrowRight' || key === ' ') {
        e.preventDefault();
      }
      begin();
    }
  }, active);

  useEffect(() => {
    ctxRef.current = setupCanvas(canvasRef.current, CW, CH);
    drawGame(ctxRef.current, gRef.current);
  }, []);

  useEffect(() => {
    if (!active) {
      gRef.current.dragging = false;
    }
  }, [active]);

  useEffect(() => {
    window.__games = window.__games || {};
    window.__games.invaders = {
      snapshot: () => {
        const g = gRef.current;
        return {
          state: g.status === 'playing' && !activeRef.current ? 'paused' : g.status,
          score: g.score,
          lives: g.lives,
          wave: g.wave,
          aliensLeft: g.aliensLeft,
          cannonX: g.cannonX,
          shots: g.shots.length,
          alienShots: g.alienShots.length,
          blockX: g.blockX,
          blockY: g.blockY,
          stepMs: g.stepMs,
        };
      },
    };
    return () => {
      if (window.__games) {
        delete window.__games.invaders;
      }
    };
  }, []);

  const followPointer = (g, p) => {
    g.cannonX = clampX(p.x - CANNON_W / 2);
  };

  const onPointerDown = e => {
    if (!active || (e.pointerType === 'mouse' && e.button !== 0)) {
      return;
    }
    const g = gRef.current;
    if (g.status !== 'ready' && g.status !== 'playing') {
      return;
    }
    e.preventDefault();
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    g.dragging = true;
    followPointer(g, pointIn(e, e.currentTarget));
    begin();
    draw();
  };

  const onPointerMove = e => {
    const g = gRef.current;
    if (!active || !g.dragging || g.status !== 'playing') {
      return;
    }
    followPointer(g, pointIn(e, e.currentTarget));
    draw();
  };

  const onPointerEnd = () => {
    gRef.current.dragging = false;
  };

  // The shown state: a playing game that loses focus shows as paused and carries on later.
  const shown = ui.status === 'playing' && !active ? 'paused' : ui.status;

  let message = null;
  if (shown === 'ready') {
    message = <Message title="Invaders">Press Space or tap to start</Message>;
  } else if (shown === 'paused') {
    message = (
      <Message title="Paused">{ui.status === 'paused' ? 'Press P to resume' : null}</Message>
    );
  } else if (shown === 'over') {
    message = (
      <Message title="Game over" action="New game" onAction={newGame}>
        {`Score ${ui.score}`}
      </Message>
    );
  }

  return (
    <Frame data-game-root="invaders" data-state={shown}>
      <Bar>
        <Caption>Score</Caption>
        <Readout>{ui.score}</Readout>
        <Caption>Lives: {ui.lives}</Caption>
        <Btn onClick={newGame}>New</Btn>
        <Caption>Best</Caption>
        <Readout>{best === null ? 0 : best}</Readout>
      </Bar>
      <Field>
        <Screen
          ref={canvasRef}
          role="img"
          aria-label="Invaders playing field"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onLostPointerCapture={onPointerEnd}
        />
        {message}
      </Field>
      <Hint>Arrows or drag to move. Space: fire.</Hint>
    </Frame>
  );
};

Game.propTypes = {
  active: PropTypes.bool.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

export default Game;
