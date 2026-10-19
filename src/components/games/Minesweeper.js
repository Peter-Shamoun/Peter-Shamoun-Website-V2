import React, { useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { focusRing } from '@styles';
import { useIsoLayoutEffect } from '../desktop/DesktopProvider';
import {
  COLORS,
  Frame,
  Bar,
  Readout,
  Caption,
  Btn,
  Well,
  Message,
  Hint,
  pointIn,
  useBest,
  useKeys,
  useLoop,
  report,
} from './kit';

// Minesweeper: a 9 x 9 board with 10 mines. The board state lives in a plain object in a ref;
// React only re-renders after a move (bump) and once a second (seconds).

const SIZE = 9;
const CELLS = SIZE * SIZE;
const MINES = 10;
const SAFE = CELLS - MINES;
const MAX_SECONDS = 999;
const LONG_PRESS_MS = 400;
const SLOP = 10; // how far a touch may wander (in natural pixels) and still count as a tap

const neighboursOf = i => {
  const r = Math.floor(i / SIZE);
  const c = i % SIZE;
  const out = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      const nr = r + dr;
      const nc = c + dc;
      if ((dr !== 0 || dc !== 0) && nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
        out.push(nr * SIZE + nc);
      }
    }
  }
  return out;
};

const NEIGHBOURS = Array.from({ length: CELLS }, (_, i) => neighboursOf(i));
const INDEX = Array.from({ length: CELLS }, (_, i) => i);
const LINE = Array.from({ length: SIZE }, (_, k) => k);

const DIGIT_COLORS = [
  null,
  COLORS.blue,
  COLORS.green,
  COLORS.red,
  COLORS.navy,
  COLORS.maroon,
  COLORS.teal,
  COLORS.black,
  COLORS.shadow,
];

const freshGame = () => ({
  state: 'ready', // ready | playing | over | won
  placed: false,
  mine: Array(CELLS).fill(0),
  adj: Array(CELLS).fill(0),
  open: Array(CELLS).fill(0),
  flag: Array(CELLS).fill(0),
  hit: -1,
  openCount: 0,
  ms: 0,
  seconds: 0,
});

const countFlags = g => g.flag.reduce((n, f) => n + f, 0);

const pad3 = n => (n < 0 ? `-${String(-n).padStart(2, '0')}` : String(n).padStart(3, '0'));

// Mines go down on the first open, never on that cell or its neighbours.
const placeMines = (g, first) => {
  const banned = new Set([first, ...NEIGHBOURS[first]]);
  const pool = INDEX.filter(i => !banned.has(i));
  for (let k = 0; k < MINES; k += 1) {
    const j = k + Math.floor(Math.random() * (pool.length - k));
    const tmp = pool[k];
    pool[k] = pool[j];
    pool[j] = tmp;
    g.mine[pool[k]] = 1;
  }
  INDEX.forEach(i => {
    g.adj[i] = NEIGHBOURS[i].reduce((n, j) => n + g.mine[j], 0);
  });
  g.placed = true;
};

const winGame = g => {
  g.state = 'won';
  INDEX.forEach(i => {
    if (g.mine[i]) {
      g.flag[i] = 1;
    }
  });
};

// Opens a cell (and floods out from empty ones). Returns the event this move caused:
// 'start' (first open), 'over', 'win', or null when nothing happened.
const openCell = (g, i) => {
  if (g.state === 'over' || g.state === 'won' || g.open[i] || g.flag[i]) {
    return null;
  }
  let event = null;
  if (!g.placed) {
    placeMines(g, i);
    g.state = 'playing';
    event = 'start';
  }
  if (g.mine[i]) {
    g.state = 'over';
    g.hit = i;
    return 'over';
  }
  const stack = [i];
  while (stack.length > 0) {
    const c = stack.pop();
    if (!g.open[c] && !g.flag[c]) {
      g.open[c] = 1;
      g.openCount += 1;
      if (g.adj[c] === 0) {
        NEIGHBOURS[c].forEach(n => {
          if (!g.open[n] && !g.flag[n]) {
            stack.push(n);
          }
        });
      }
    }
  }
  if (g.openCount === SAFE) {
    winGame(g);
    return 'win';
  }
  return event;
};

// Opening the neighbours of an open number once its flags match the number.
const chord = (g, i) => {
  if (g.state !== 'playing' || !g.open[i] || !g.adj[i]) {
    return null;
  }
  const flags = NEIGHBOURS[i].filter(n => g.flag[n]).length;
  if (flags !== g.adj[i]) {
    return null;
  }
  let event = null;
  NEIGHBOURS[i].forEach(n => {
    if (event || g.flag[n] || g.open[n]) {
      return;
    }
    event = openCell(g, n);
  });
  return event;
};

const toggleFlag = (g, i) => {
  if (g.state === 'over' || g.state === 'won' || g.open[i]) {
    return false;
  }
  g.flag[i] = g.flag[i] ? 0 : 1;
  return true;
};

const displayState = (g, active) => (g.state === 'playing' && !active ? 'paused' : g.state);

const gridChar = (g, i) => {
  if (g.state === 'over' && g.mine[i]) {
    return '*';
  }
  if (g.flag[i]) {
    return 'F';
  }
  if (g.open[i]) {
    return String(g.adj[i]);
  }
  return '#';
};

const snapshotOf = (g, active) => {
  const grid = LINE.map(r => {
    let row = '';
    LINE.forEach(c => {
      row += gridChar(g, r * SIZE + c);
    });
    return row;
  });
  return {
    state: displayState(g, active),
    rows: SIZE,
    cols: SIZE,
    mines: MINES,
    flags: countFlags(g),
    opened: g.openCount,
    seconds: g.seconds,
    grid,
    minesPlaced: g.placed,
    mineCells: g.placed
      ? INDEX.filter(i => g.mine[i]).map(i => [Math.floor(i / SIZE), i % SIZE])
      : null,
  };
};

const cellLabel = (g, i) => {
  const where = `Row ${Math.floor(i / SIZE) + 1}, column ${(i % SIZE) + 1}, `;
  const over = g.state === 'over';
  let what = 'unopened';
  if (over && g.mine[i]) {
    what = 'mine';
  } else if (g.flag[i]) {
    what = over ? 'flagged, not a mine' : 'flagged';
  } else if (g.open[i]) {
    const n = g.adj[i];
    what = n ? `${n} ${n === 1 ? 'mine' : 'mines'} nearby` : 'empty';
  }
  return where + what;
};

// Pressing a pointer on a cell: a touch is held for LONG_PRESS_MS to flag, and opens on release.
const dropPress = ref => {
  const p = ref.current;
  if (p) {
    window.clearTimeout(p.timer);
    ref.current = null;
  }
};

// The small pixel mine and flag, drawn as SVG rectangles in the Aero ink colour.
const MineIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <rect x="6" y="0" width="2" height="14" fill={COLORS.black} />
    <rect x="0" y="6" width="14" height="2" fill={COLORS.black} />
    <rect x="3" y="3" width="8" height="8" fill={COLORS.black} />
    <rect x="4" y="4" width="2" height="2" fill="#ffffff" fillOpacity="0.85" />
  </svg>
);

const FlagIcon = ({ wrong }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <rect x="3" y="1" width="1" height="12" fill={COLORS.navy} />
    <polygon points="4,1 12,4 4,7" fill={COLORS.red} />
    <rect x="1" y="12" width="5" height="1" fill={COLORS.navy} />
    {wrong ? (
      <path d="M2 2 L12 12 M12 2 L2 12" stroke={COLORS.black} strokeWidth="2" fill="none" />
    ) : null}
  </svg>
);

FlagIcon.propTypes = {
  wrong: PropTypes.bool,
};

// An unopened cell: a glossy Windows 7 sky-blue tile.
const unopenedCss = css`
  background: linear-gradient(180deg, #9fd6f7 0%, #6cb6ea 49%, #4f9fe0 50%, #3b8fd6 100%);
  border: 1px solid #2f78b8;
  border-radius: 2px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);

  &:hover {
    filter: brightness(1.08);
  }
`;

// An opened cell: flat and pale, with a fine grid line.
const openedCss = css`
  background: #eef4fa;
  border: 1px solid #c5d4e2;
  border-radius: 0;
`;

const Pit = styled(Well)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Board = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(9, 28px);
  width: 252px;
  height: 252px;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
`;

const Cell = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  color: ${p => p.$color || COLORS.black};
  font: 16px/1 var(--main-font);
  cursor: default;
  ${p => (p.$open ? openedCss : unopenedCss)};
  ${p => (p.$hit ? `background: ${COLORS.red};` : '')};
  ${focusRing};
`;

const Row = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 28px;
  padding: 0 6px;
`;

const Minesweeper = ({ active, w, h }) => {
  const gRef = useRef(null);
  if (gRef.current === null) {
    gRef.current = freshGame();
  }
  const activeRef = useRef(active);
  activeRef.current = active;
  const boardRef = useRef(null);
  const cellEls = useRef([]);
  const pressRef = useRef(null);
  // False from the moment the window closes, before the loop and timers are cleaned up.
  const aliveRef = useRef(true);
  useIsoLayoutEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const [, bump] = useReducer(n => n + 1, 0);
  const [seconds, setSeconds] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [best, submit] = useBest('minesweeper', { lowerWins: true });
  const submitRef = useRef(submit);
  submitRef.current = submit;

  const g = gRef.current;
  const shown = displayState(g, active);
  const playing = g.state === 'playing';
  const flags = countFlags(g);

  // Seconds count only while playing and the window is in front. A frame can still arrive after
  // the game was paused or closed but before useLoop has stopped; it must do nothing then (a
  // setSeconds in that frame would also leave the loop running for good).
  const step = dt => {
    const cur = gRef.current;
    if (!aliveRef.current || !activeRef.current || cur.state !== 'playing') {
      return;
    }
    cur.ms += dt;
    const s = Math.min(MAX_SECONDS, Math.floor(cur.ms / 1000));
    if (s !== cur.seconds) {
      cur.seconds = s;
      setSeconds(s);
    }
  };
  useLoop(step, playing && active);

  // Reports what a move caused and re-renders.
  const finish = event => {
    const cur = gRef.current;
    if (event === 'start') {
      report('minesweeper', 'start');
    } else if (event === 'over') {
      report('minesweeper', 'over');
      setSeconds(cur.seconds);
    } else if (event === 'win') {
      submitRef.current(cur.seconds);
      report('minesweeper', 'win');
      setSeconds(cur.seconds);
    }
    bump();
  };

  // A tap, click or Enter/Space on a cell: flags in flag mode, otherwise opens (or chords).
  const act = i => {
    if (!activeRef.current) {
      return;
    }
    const cur = gRef.current;
    if (flagMode) {
      toggleFlag(cur, i);
      bump();
      return;
    }
    finish(cur.open[i] ? chord(cur, i) : openCell(cur, i));
  };

  const onKey = e => {
    const target = e.target;
    if (!target || !target.hasAttribute || !target.hasAttribute('data-idx')) {
      return;
    }
    if (!activeRef.current) {
      return;
    }
    const key = e.key;
    const i = Number(target.getAttribute('data-idx'));
    const r = Math.floor(i / SIZE);
    const c = i % SIZE;
    if (key && key.startsWith('Arrow')) {
      let next = -1;
      if (key === 'ArrowLeft' && c > 0) {
        next = i - 1;
      } else if (key === 'ArrowRight' && c < SIZE - 1) {
        next = i + 1;
      } else if (key === 'ArrowUp' && r > 0) {
        next = i - SIZE;
      } else if (key === 'ArrowDown' && r < SIZE - 1) {
        next = i + SIZE;
      }
      e.preventDefault();
      if (next >= 0 && cellEls.current[next]) {
        cellEls.current[next].focus();
      }
      return;
    }
    if (key === 'f' || key === 'F') {
      e.preventDefault();
      toggleFlag(gRef.current, i);
      bump();
    }
  };
  useKeys(onKey, active);

  const onCellKey = (e, i) => {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }
    e.preventDefault();
    if (!e.repeat) {
      act(i);
    }
  };

  const onCellDown = (e, i) => {
    if (!activeRef.current) {
      return;
    }
    // Right click flags; so does Ctrl + click, which is the right click of a Mac trackpad.
    if (e.button === 2 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      if (toggleFlag(gRef.current, i)) {
        bump();
      }
      return;
    }
    if (e.button !== 0) {
      return;
    }
    dropPress(pressRef);
    const pt = pointIn(e, boardRef.current);
    const touch = e.pointerType !== 'mouse';
    const p = { id: e.pointerId, idx: i, touch, x: pt.x, y: pt.y, fired: false, timer: null };
    if (touch) {
      p.timer = window.setTimeout(() => {
        p.timer = null;
        p.fired = true;
        if (aliveRef.current && activeRef.current && toggleFlag(gRef.current, i)) {
          bump();
        }
      }, LONG_PRESS_MS);
    }
    pressRef.current = p;
  };

  const onBoardMove = e => {
    const p = pressRef.current;
    if (!p || !p.touch || p.fired || p.id !== e.pointerId) {
      return;
    }
    const pt = pointIn(e, boardRef.current);
    if (Math.hypot(pt.x - p.x, pt.y - p.y) > SLOP) {
      dropPress(pressRef);
    }
  };

  const onBoardUp = e => {
    const p = pressRef.current;
    if (!p || p.id !== e.pointerId) {
      return;
    }
    dropPress(pressRef);
    if (p.fired) {
      return;
    }
    const cell = e.target && e.target.closest ? e.target.closest('[data-idx]') : null;
    if (!cell || Number(cell.getAttribute('data-idx')) !== p.idx) {
      return;
    }
    act(p.idx);
  };

  const onBoardCancel = e => {
    const p = pressRef.current;
    if (p && p.id === e.pointerId) {
      dropPress(pressRef);
    }
  };

  const onBoardLeave = () => {
    const p = pressRef.current;
    if (p && !p.touch) {
      dropPress(pressRef);
    }
  };

  const preventMenu = e => e.preventDefault();

  const onNew = () => {
    gRef.current = freshGame();
    dropPress(pressRef);
    setSeconds(0);
    bump();
  };

  useEffect(() => {
    if (!active) {
      dropPress(pressRef);
    }
  }, [active]);

  useEffect(() => () => dropPress(pressRef), []);

  useEffect(() => {
    window.__games = window.__games || {};
    window.__games.minesweeper = {
      snapshot: () => snapshotOf(gRef.current, activeRef.current),
    };
    return () => {
      if (window.__games) {
        delete window.__games.minesweeper;
      }
    };
  }, []);

  let hint = '';
  if (shown === 'ready') {
    hint = 'Open any square to start.';
  } else if (shown === 'playing') {
    hint = flagMode ? 'Tap a square to flag it.' : 'Hold, or right-click, to flag.';
  } else if (shown === 'paused') {
    hint = 'Paused. Click here to resume.';
  } else if (shown === 'over') {
    hint = 'Game over. Press New to retry.';
  } else {
    hint = 'You win! Press New to play again.';
  }

  const renderFace = i => {
    const over = g.state === 'over';
    if (over && g.mine[i]) {
      return <MineIcon />;
    }
    if (g.flag[i]) {
      return <FlagIcon wrong={over && !g.mine[i]} />;
    }
    if (g.open[i] && g.adj[i]) {
      return g.adj[i];
    }
    return null;
  };

  return (
    <Frame data-game-root="minesweeper" data-state={shown} style={{ width: w, height: h }}>
      <Bar>
        <Readout>{pad3(MINES - flags)}</Readout>
        <Btn onClick={onNew}>New</Btn>
        <Readout>{pad3(seconds)}</Readout>
      </Bar>
      <Pit>
        <Board
          ref={boardRef}
          role="grid"
          aria-label="Minesweeper board"
          onPointerMove={onBoardMove}
          onPointerUp={onBoardUp}
          onPointerCancel={onBoardCancel}
          onPointerLeave={onBoardLeave}
          onContextMenu={preventMenu}>
          {LINE.map(r => (
            <div role="row" key={r} style={{ display: 'contents' }}>
              {LINE.map(c => {
                const i = r * SIZE + c;
                return (
                  <div role="gridcell" key={i} style={{ display: 'contents' }}>
                    <Cell
                      ref={el => {
                        cellEls.current[i] = el;
                      }}
                      data-idx={i}
                      aria-label={cellLabel(g, i)}
                      tabIndex={i === cursor ? 0 : -1}
                      onFocus={() => setCursor(i)}
                      onPointerDown={e => onCellDown(e, i)}
                      onKeyDown={e => onCellKey(e, i)}
                      $open={!!g.open[i]}
                      $hit={g.hit === i}
                      $color={g.open[i] && g.adj[i] ? DIGIT_COLORS[g.adj[i]] : null}>
                      {renderFace(i)}
                    </Cell>
                  </div>
                );
              })}
            </div>
          ))}
        </Board>
        {shown === 'paused' ? <Message title="Paused">Click the window to resume.</Message> : null}
      </Pit>
      <Row>
        <Btn aria-pressed={flagMode} onClick={() => setFlagMode(v => !v)}>
          Flag
        </Btn>
        <Caption>{best === null ? 'Best: -' : `Best: ${best}s`}</Caption>
      </Row>
      <Hint>{hint}</Hint>
    </Frame>
  );
};

Minesweeper.propTypes = {
  active: PropTypes.bool.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

export default Minesweeper;
