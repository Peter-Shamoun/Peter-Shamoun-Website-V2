import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { sunken } from '@styles';
import {
  COLORS,
  Frame,
  Btn,
  Well,
  Message,
  Hint,
  Readout,
  Caption,
  pointIn,
  setupCanvas,
  useLoop,
  useKeys,
  useBest,
  report,
} from './kit';

// Blocks: a falling-blocks puzzle. The well is drawn on a canvas, the side panel is DOM.

const COLS = 10;
const ROWS = 20;
const CELL = 18;
const WELL_W = COLS * CELL;
const WELL_H = ROWS * CELL;
const NEXT = 72;
const NEXT_CELL = 14;
const TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const TYPE_COLOR = {
  I: 'cyan',
  O: 'yellow',
  T: 'purple',
  S: 'green',
  Z: 'red',
  J: 'blue',
  L: 'orange',
};
const LINE_POINTS = [0, 100, 300, 500, 800];
// Turn kicks: shift 1 left, 1 right, 2 left, 2 right, then 1 up.
const KICKS = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [-2, 0],
  [2, 0],
  [0, -1],
];
const KEY_ACTIONS = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowDown: 'down',
  ArrowUp: 'turn',
  x: 'turn',
  X: 'turn',
  z: 'turnBack',
  Z: 'turnBack',
};

const SHAPE_ROWS = {
  I: ['....', 'XXXX', '....', '....'],
  O: ['XX', 'XX'],
  T: ['.X.', 'XXX', '...'],
  S: ['.XX', 'XX.', '...'],
  Z: ['XX.', '.XX', '...'],
  J: ['X..', 'XXX', '...'],
  L: ['..X', 'XXX', '...'],
};

// Lighter and darker versions of each piece colour for the 1px bevel.
const shade = (hex, target, amount) => {
  const rgb = [1, 3, 5].map(i => {
    const v = parseInt(hex.slice(i, i + 2), 16);
    return Math.round(v + (target - v) * amount);
  });
  return `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`;
};

const PALETTE = {};
TYPES.forEach(t => {
  const base = COLORS[TYPE_COLOR[t]];
  PALETTE[t] = { base, light: shade(base, 255, 0.5), dark: shade(base, 0, 0.4) };
});

// Rotated shapes: SHAPES[type][rot] is a list of [dx, dy] cells from the piece's top-left corner.
const matrixCells = m => {
  const out = [];
  m.forEach((row, r) =>
    row.forEach((on, c) => {
      if (on) {
        out.push([c, r]);
      }
    }),
  );
  return out;
};

const rotateCw = m => {
  const n = m.length;
  return m.map((row, r) => row.map((_, c) => m[n - 1 - c][r]));
};

const SHAPES = {};
TYPES.forEach(t => {
  let m = SHAPE_ROWS[t].map(row => Array.from(row, ch => ch === 'X'));
  const turns = [];
  for (let r = 0; r < 4; r += 1) {
    turns.push(matrixCells(m));
    m = rotateCw(m);
  }
  SHAPES[t] = turns;
});

const gravityMs = level => Math.max(80, 800 * Math.pow(0.85, level - 1));

const emptyGrid = () => Array.from({ length: ROWS }, () => new Array(COLS).fill(null));

const shuffle = list => {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const take = g => {
  if (g.bag.length === 0) {
    g.bag = shuffle(TYPES.slice());
  }
  return g.bag.pop();
};

const fits = (grid, type, rot, x, y) =>
  SHAPES[type][rot].every(([dx, dy]) => {
    const cx = x + dx;
    const cy = y + dy;
    return cx >= 0 && cx < COLS && cy >= 0 && cy < ROWS && !grid[cy][cx];
  });

const newGame = () => {
  const g = {
    state: 'ready',
    grid: emptyGrid(),
    piece: null,
    next: null,
    bag: [],
    score: 0,
    lines: 0,
    level: 1,
    acc: 0,
    reported: false,
    ended: false,
  };
  g.next = take(g);
  return g;
};

// Puts the next piece at the top centre. Returns false when it does not fit (game over).
const spawn = g => {
  const type = g.next;
  g.next = take(g);
  const x = Math.floor((COLS - SHAPE_ROWS[type].length) / 2);
  if (!fits(g.grid, type, 0, x, 0)) {
    g.piece = null;
    return false;
  }
  g.piece = { type, x, y: 0, rot: 0 };
  return true;
};

const shift = (g, dx, dy) => {
  const p = g.piece;
  if (fits(g.grid, p.type, p.rot, p.x + dx, p.y + dy)) {
    p.x += dx;
    p.y += dy;
    return true;
  }
  return false;
};

const rotate = (g, dir) => {
  const p = g.piece;
  const rot = (p.rot + dir + 4) % 4;
  const hit = KICKS.find(([kx, ky]) => fits(g.grid, p.type, rot, p.x + kx, p.y + ky));
  if (!hit) {
    return false;
  }
  p.x += hit[0];
  p.y += hit[1];
  p.rot = rot;
  return true;
};

const clearRows = grid => {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y -= 1) {
    if (grid[y].every(Boolean)) {
      // Put the empty row in at the top straight away so the grid always has ROWS rows.
      grid.splice(y, 1);
      grid.unshift(new Array(COLS).fill(null));
      cleared += 1;
      y += 1; // check the row that just moved into this place
    }
  }
  return cleared;
};

const lockPiece = g => {
  const p = g.piece;
  SHAPES[p.type][p.rot].forEach(([dx, dy]) => {
    g.grid[p.y + dy][p.x + dx] = p.type;
  });
  g.piece = null;
  g.acc = 0;
  const cleared = clearRows(g.grid);
  if (cleared) {
    g.score += LINE_POINTS[cleared] * g.level;
    g.lines += cleared;
    g.level = Math.floor(g.lines / 10) + 1;
  }
  if (!spawn(g)) {
    g.state = 'over';
  }
};

// Applies one player or gravity action to the game. Only acts while playing.
const act = (g, action) => {
  if (g.state !== 'playing' || !g.piece) {
    return;
  }
  if (action === 'left') {
    shift(g, -1, 0);
  } else if (action === 'right') {
    shift(g, 1, 0);
  } else if (action === 'down') {
    if (shift(g, 0, 1)) {
      g.score += 1;
    }
  } else if (action === 'turn') {
    rotate(g, 1);
  } else if (action === 'turnBack') {
    rotate(g, -1);
  } else if (action === 'drop') {
    let rows = 0;
    while (shift(g, 0, 1)) {
      rows += 1;
    }
    g.score += 2 * rows;
    lockPiece(g);
  } else if (action === 'fall') {
    if (!shift(g, 0, 1)) {
      lockPiece(g);
    }
  }
};

const landingY = (grid, p) => {
  let y = p.y;
  while (fits(grid, p.type, p.rot, p.x, y + 1)) {
    y += 1;
  }
  return y;
};

const drawBlock = (ctx, x, y, s, type) => {
  const { base, light, dark } = PALETTE[type];
  ctx.fillStyle = base;
  ctx.fillRect(x, y, s, s);
  ctx.fillStyle = light;
  ctx.fillRect(x, y, s, 1);
  ctx.fillRect(x, y, 1, s);
  ctx.fillStyle = dark;
  ctx.fillRect(x, y + s - 1, s, 1);
  ctx.fillRect(x + s - 1, y, 1, s);
};

const drawOutline = (ctx, x, y, s, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, s, 1);
  ctx.fillRect(x, y + s - 1, s, 1);
  ctx.fillRect(x, y, 1, s);
  ctx.fillRect(x + s - 1, y, 1, s);
};

const drawWell = (ctx, g) => {
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, WELL_W, WELL_H);
  g.grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell) {
        drawBlock(ctx, x * CELL, y * CELL, CELL, cell);
      }
    }),
  );
  const p = g.piece;
  if (!p) {
    return;
  }
  const gy = landingY(g.grid, p);
  const cells = SHAPES[p.type][p.rot];
  cells.forEach(([dx, dy]) =>
    drawOutline(ctx, (p.x + dx) * CELL, (gy + dy) * CELL, CELL, PALETTE[p.type].base),
  );
  cells.forEach(([dx, dy]) => drawBlock(ctx, (p.x + dx) * CELL, (p.y + dy) * CELL, CELL, p.type));
};

const drawNext = (ctx, type) => {
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, NEXT, NEXT);
  if (!type) {
    return;
  }
  const cells = SHAPES[type][0];
  const xs = cells.map(c => c[0]);
  const ys = cells.map(c => c[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const bw = (Math.max(...xs) - minX + 1) * NEXT_CELL;
  const bh = (Math.max(...ys) - minY + 1) * NEXT_CELL;
  const ox = Math.floor((NEXT - bw) / 2) - minX * NEXT_CELL;
  const oy = Math.floor((NEXT - bh) / 2) - minY * NEXT_CELL;
  cells.forEach(([dx, dy]) =>
    drawBlock(ctx, ox + dx * NEXT_CELL, oy + dy * NEXT_CELL, NEXT_CELL, type),
  );
};

const paintCanvases = (g, ctxs) => {
  if (ctxs.well) {
    drawWell(ctxs.well, g);
  }
  if (ctxs.next) {
    drawNext(ctxs.next, g.next);
  }
};

const snapshotOf = g => ({
  state: g.state,
  score: g.score,
  lines: g.lines,
  level: g.level,
  next: g.next,
  piece: g.piece ? { type: g.piece.type, x: g.piece.x, y: g.piece.y, rot: g.piece.rot } : null,
  grid: g.grid.map(row => row.map(c => c || '.').join('')),
});

const clearHold = h => {
  window.clearTimeout(h.t1);
  window.clearInterval(h.t2);
  h.t1 = null;
  h.t2 = null;
};

// ---------- styles ----------

const Row = styled.div`
  flex: none;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 4px 5px;
`;

const WellBox = styled(Well)`
  flex: none;
  box-sizing: content-box;
  width: 180px;
  height: 360px;

  & > canvas {
    display: block;
  }
`;

const Side = styled.div`
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 116px;
`;

const NextBox = styled.div`
  flex: none;
  box-sizing: content-box;
  width: 72px;
  height: 72px;
  padding: 2px;
  background: #000000;
  ${sunken};

  & > canvas {
    display: block;
  }
`;

const Pad = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
`;

const PadBtn = styled(Btn)`
  width: 100%;
  min-width: 0;
  padding: 0;
`;

// ---------- component ----------

const Game = ({ active, w, h }) => {
  const game = useRef(null);
  if (game.current === null) {
    game.current = newGame();
  }
  const wellRef = useRef(null);
  const nextRef = useRef(null);
  const canvases = useRef({ well: null, next: null });
  const hold = useRef({ t1: null, t2: null });
  const drag = useRef(null);
  const [status, setStatus] = useState('ready');
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [best, submit] = useBest('blocks');

  const sync = () => {
    const g = game.current;
    setStatus(g.state);
    setScore(g.score);
    setLines(g.lines);
    setLevel(g.level);
  };

  const paint = () => paintCanvases(game.current, canvases.current);

  // Runs after every change: records the game over once and refreshes the screen.
  const settle = () => {
    const g = game.current;
    if (g.state === 'over' && !g.ended) {
      g.ended = true;
      clearHold(hold.current);
      submit(g.score);
      report('blocks', 'over');
    }
    sync();
    paint();
  };

  const begin = () => {
    const g = game.current;
    if (g.state !== 'ready') {
      return;
    }
    g.state = 'playing';
    g.acc = 0;
    if (!spawn(g)) {
      g.state = 'over';
    }
    settle();
  };

  // A player move. The first one is reported once per page view.
  const run = action => {
    const g = game.current;
    if (g.state !== 'playing') {
      return;
    }
    if (!g.reported) {
      g.reported = true;
      report('blocks', 'start');
    }
    act(g, action);
    settle();
  };

  const runRef = useRef(null);
  runRef.current = run;

  const press = action => {
    if (!active) {
      return;
    }
    if (game.current.state === 'ready') {
      begin();
    } else {
      run(action);
    }
  };

  const togglePause = () => {
    const g = game.current;
    if (g.state === 'playing') {
      g.state = 'paused';
      clearHold(hold.current);
    } else if (g.state === 'paused') {
      g.state = 'playing';
    } else {
      return;
    }
    settle();
  };

  const reset = () => {
    clearHold(hold.current);
    drag.current = null;
    game.current = newGame();
    settle();
  };

  const stopHold = () => clearHold(hold.current);

  // Holding < or > moves once, waits 250 ms, then repeats every 120 ms.
  const startHold = action => {
    if (!active) {
      return;
    }
    if (game.current.state === 'ready') {
      begin();
      return;
    }
    const h = hold.current;
    clearHold(h);
    run(action);
    h.t1 = window.setTimeout(() => {
      h.t2 = window.setInterval(() => runRef.current(action), 120);
    }, 250);
  };

  // Keyboard clicks on the buttons have detail 0; mouse and touch use the pointer handlers.
  const keyClick = action => e => {
    if (e.detail === 0) {
      press(action);
    }
  };

  // A mouse or touch press must not leave the focus on a side button: Space and Enter would then
  // press that button again instead of starting the game or dropping the piece.
  const keepFocus = e => e.preventDefault();

  const onKey = e => {
    const g = game.current;
    const { key } = e;
    if (key === ' ' || key === 'Enter') {
      e.preventDefault();
      if (g.state === 'ready') {
        begin();
      } else if (key === ' ' && !e.repeat) {
        run('drop');
      }
      return;
    }
    if (key === 'p' || key === 'P') {
      e.preventDefault();
      if (!e.repeat) {
        togglePause();
      }
      return;
    }
    const action = KEY_ACTIONS[key];
    if (!action) {
      return;
    }
    e.preventDefault();
    if (g.state === 'ready') {
      return;
    }
    if (e.repeat && (action === 'turn' || action === 'turnBack')) {
      return;
    }
    run(action);
  };

  // Gravity: one row per interval, and a piece that cannot fall locks on that step.
  const step = dt => {
    const g = game.current;
    if (g.state !== 'playing') {
      return;
    }
    g.acc += dt;
    const interval = gravityMs(g.level);
    if (g.acc >= interval) {
      g.acc -= interval;
      act(g, 'fall');
      settle();
    } else {
      paint();
    }
  };

  // Pointer input on the well: tap turns, sideways drag moves, quick downward swipe drops.
  const onWellDown = e => {
    const g = game.current;
    if (!active) {
      return;
    }
    if (g.state === 'ready') {
      begin();
      return;
    }
    if (g.state === 'paused') {
      togglePause();
      return;
    }
    if (g.state !== 'playing') {
      return;
    }
    const p = pointIn(e, wellRef.current);
    drag.current = { id: e.pointerId, x0: p.x, y0: p.y, t0: Date.now(), steps: 0 };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // capture is optional; the drag still works inside the well
    }
  };

  const onWellMove = e => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) {
      return;
    }
    const p = pointIn(e, wellRef.current);
    const want = Math.trunc((p.x - d.x0) / CELL);
    while (d.steps < want) {
      d.steps += 1;
      run('right');
    }
    while (d.steps > want) {
      d.steps -= 1;
      run('left');
    }
  };

  const onWellUp = e => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) {
      return;
    }
    drag.current = null;
    const p = pointIn(e, wellRef.current);
    const dx = p.x - d.x0;
    const dy = p.y - d.y0;
    const elapsed = Date.now() - d.t0;
    if (dy > 60 && dy > Math.abs(dx) * 1.5 && elapsed < 600) {
      run('drop');
    } else if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && elapsed < 400) {
      run('turn');
    }
  };

  const onWellCancel = () => {
    drag.current = null;
  };

  useLoop(step, status === 'playing' && active);
  useKeys(onKey, active);

  // Set up the canvases once the elements exist.
  useEffect(() => {
    const ctxs = canvases.current;
    ctxs.well = setupCanvas(wellRef.current, WELL_W, WELL_H);
    ctxs.next = setupCanvas(nextRef.current, NEXT, NEXT);
    paintCanvases(game.current, ctxs);
  }, []);

  // Test hook: the snapshot is read from the game ref.
  useEffect(() => {
    const games = (window.__games = window.__games || {});
    games.blocks = { snapshot: () => snapshotOf(game.current) };
    return () => {
      delete games.blocks;
    };
  }, []);

  useEffect(() => {
    const h = hold.current;
    return () => clearHold(h);
  }, []);

  // Stop repeats and drags when the window is not in front.
  useEffect(() => {
    if (!active) {
      clearHold(hold.current);
      drag.current = null;
    }
  }, [active]);

  const shown = status === 'playing' && !active ? 'paused' : status;

  let overlay = null;
  if (status === 'ready') {
    overlay = <Message title="Press Space or tap to start" />;
  } else if (status === 'over') {
    overlay = (
      <Message title="Game over" action="New" onAction={reset}>
        {`Score: ${score}`}
      </Message>
    );
  } else if (status === 'paused') {
    overlay = <Message title="Paused">Press P or tap to resume</Message>;
  } else if (shown === 'paused') {
    overlay = <Message title="Paused" />;
  }

  return (
    <Frame data-game-root="blocks" data-state={shown} style={{ width: w, height: h }}>
      <Row>
        <WellBox
          onPointerDown={onWellDown}
          onPointerMove={onWellMove}
          onPointerUp={onWellUp}
          onPointerCancel={onWellCancel}>
          <canvas
            ref={wellRef}
            role="img"
            aria-label="Blocks well"
            width={WELL_W}
            height={WELL_H}
          />
          {overlay}
        </WellBox>
        <Side>
          <Caption>Next</Caption>
          <NextBox>
            <canvas ref={nextRef} role="img" aria-label="Next piece" width={NEXT} height={NEXT} />
          </NextBox>
          <Caption>Score</Caption>
          <Readout>{score}</Readout>
          <Caption>Lines</Caption>
          <Readout>{lines}</Readout>
          <Caption>Level</Caption>
          <Readout>{level}</Readout>
          <Caption>{`Best: ${best === null ? 0 : best}`}</Caption>
          <Btn onMouseDown={keepFocus} onClick={reset}>
            New
          </Btn>
          <Pad>
            <PadBtn
              onMouseDown={keepFocus}
              aria-label="Move left"
              onPointerDown={() => startHold('left')}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              onPointerCancel={stopHold}
              onClick={keyClick('left')}>
              {'<'}
            </PadBtn>
            <PadBtn
              onMouseDown={keepFocus}
              aria-label="Move right"
              onPointerDown={() => startHold('right')}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              onPointerCancel={stopHold}
              onClick={keyClick('right')}>
              {'>'}
            </PadBtn>
            <PadBtn
              onMouseDown={keepFocus}
              aria-label="Turn"
              onPointerDown={() => press('turn')}
              onClick={keyClick('turn')}>
              Turn
            </PadBtn>
            <PadBtn
              onMouseDown={keepFocus}
              aria-label="Drop"
              onPointerDown={() => press('drop')}
              onClick={keyClick('drop')}>
              Drop
            </PadBtn>
          </Pad>
        </Side>
      </Row>
      <Hint>Arrows: move, Up: turn, Space: drop.</Hint>
    </Frame>
  );
};

Game.propTypes = {
  active: PropTypes.bool.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

export default Game;
