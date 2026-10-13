import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  COLORS,
  Bar,
  Btn,
  Caption,
  Frame,
  Message,
  Well,
  pointIn,
  report,
  useBest,
  useKeys,
  useLoop,
} from './kit';

// Klondike, draw one card. Everything is DOM and CSS, laid out in the game's natural pixels.
// The felt is 472 x 414 px inside the well. Column c starts at x = 2 + c * 68.

const CARD_W = 60;
const CARD_H = 84;
const COL_STEP = 68; // 60 px card + 8 px gap
const LEFT = 2; // the felt starts 2 px in from the edge of the well
const FELT_H = 414; // the well is 418 px tall; the felt is inside its 2 px edges
const TOP_Y = 8; // the top row (stock, waste, foundations)
const TAB_Y = 100; // the tableau starts 8 px below the top row
const TAB_ROOM = FELT_H - 8 - TAB_Y - CARD_H; // 222 px for the overlaps of one column
const DOWN_STEP = 8; // overlap of a face-down card
const UP_STEP = 22; // overlap of a face-up card, before a tall column shrinks it
const DRAG_SLOP = 5; // px a press must travel before it is a drag
const CLICK_AFTER_DRAG = 250; // ms after a drag in which the click it leaves behind is ignored

const SUITS = ['S', 'H', 'D', 'C']; // foundation order
const SUIT_NAMES = { S: 'spades', H: 'hearts', D: 'diamonds', C: 'clubs' };
const RANK_TEXT = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RANK_WORDS = [
  '',
  'Ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Jack',
  'Queen',
  'King',
];

const colX = c => LEFT + c * COL_STEP;
const idOf = (rank, suit) => `${RANK_TEXT[rank]}${suit}`;
const isRed = suit => suit === 'H' || suit === 'D';
const inkOf = suit => (isRed(suit) ? COLORS.red : COLORS.black);

// ---------- suit marks: one path per mark, a square per 'X' ----------

const mark = rows => {
  let d = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      if (row[x] === 'X') {
        d += `M${x} ${y}h1v1h-1z`;
      }
    }
  });
  return { d, rows: rows.length };
};

const MARKS = {
  H: mark([
    '.XX...XX.',
    'XXXX.XXXX',
    'XXXXXXXXX',
    'XXXXXXXXX',
    '.XXXXXXX.',
    '..XXXXX..',
    '...XXX...',
    '....X....',
  ]),
  D: mark([
    '....X....',
    '...XXX...',
    '..XXXXX..',
    '.XXXXXXX.',
    'XXXXXXXXX',
    '.XXXXXXX.',
    '..XXXXX..',
    '...XXX...',
    '....X....',
  ]),
  S: mark([
    '....X....',
    '...XXX...',
    '..XXXXX..',
    '.XXXXXXX.',
    'XXXXXXXXX',
    'XXXXXXXXX',
    'XXX.X.XXX',
    '....X....',
    '...XXX...',
  ]),
  C: mark([
    '...XXX...',
    '..XXXXX..',
    '...XXX...',
    '.XXX.XXX.',
    'XXXXXXXXX',
    'XXX.X.XXX',
    '....X....',
    '...XXX...',
  ]),
  RING: mark([
    '...XXX...',
    '..X...X..',
    '.X.....X.',
    '.X.....X.',
    '.X.....X.',
    '.X.....X.',
    '.X.....X.',
    '..X...X..',
    '...XXX...',
  ]),
};

function MarkView({ kind, color, scale }) {
  const { d, rows } = MARKS[kind];
  return (
    <svg
      width={9 * scale}
      height={rows * scale}
      viewBox={`0 0 9 ${rows}`}
      shapeRendering="crispEdges"
      style={{ display: 'block' }}
      aria-hidden="true"
      focusable="false">
      <path d={d} fill={color} />
    </svg>
  );
}

MarkView.propTypes = {
  kind: PropTypes.oneOf(Object.keys(MARKS)).isRequired,
  color: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
};

const Mark = React.memo(MarkView);

// ---------- styled parts ----------

const cardCss = css`
  position: absolute;
  box-sizing: border-box;
  width: ${CARD_W}px;
  height: ${CARD_H}px;
  margin: 0;
  padding: 0;
  border: 1px solid ${COLORS.black};
  border-radius: 0;
  background: ${COLORS.white};
  color: ${COLORS.black};
  font: 16px/1 var(--main-font);
  text-align: left;
  overflow: hidden;
  appearance: none;
  -webkit-appearance: none;
  touch-action: none;
`;

const CardDiv = styled.div`
  ${cardCss};
`;

const CardBtn = styled.button.attrs({ type: 'button' })`
  ${cardCss};
  cursor: default;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 1px dotted ${COLORS.black};
    outline-offset: -4px;
  }
`;

const BackCard = styled(CardDiv)`
  background: ${COLORS.navy};
`;

// The stock is one button in both states, so keyboard focus survives the last draw.
const StockBtn = styled(CardBtn)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => (props.$empty ? 'transparent' : COLORS.navy)};
  border-color: ${props => (props.$empty ? COLORS.light : COLORS.black)};

  &:focus-visible {
    outline-color: ${props => (props.$empty ? COLORS.light : COLORS.black)};
  }
`;

const Slot = styled.div`
  ${cardCss};
  background: transparent;
  border-color: ${COLORS.light};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackBorder = styled.span`
  position: absolute;
  top: 3px;
  right: 3px;
  bottom: 3px;
  left: 3px;
  border: 1px solid ${COLORS.white};
`;

const Rank = styled.span`
  position: absolute;
  top: 2px;
  left: 3px;
  font: 16px/1 var(--main-font);
  white-space: nowrap;
`;

const Corner = styled.span`
  position: absolute;
  top: 19px;
  left: 3px;
  line-height: 0;
`;

const Center = styled.span`
  position: absolute;
  top: 33px;
  left: 21px;
  line-height: 0;
`;

const Felt = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  bottom: 2px;
  left: 2px;
  z-index: 0;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
`;

// ---------- rules, on plain board objects: { stock, waste, found, tab } ----------

const newDeal = () => {
  const deck = [];
  SUITS.forEach(suit => {
    for (let rank = 1; rank <= 13; rank += 1) {
      deck.push({ id: idOf(rank, suit), rank, suit, up: false });
    }
  });
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
  const tab = [];
  let k = 0;
  for (let c = 0; c < 7; c += 1) {
    const col = [];
    for (let j = 0; j <= c; j += 1) {
      const card = deck[k];
      k += 1;
      card.up = j === c;
      col.push(card);
    }
    tab.push(col);
  }
  return { stock: deck.slice(k), waste: [], found: [[], [], [], []], tab };
};

const copyCard = card => ({ ...card });

const cloneBoard = b => ({
  stock: b.stock.map(copyCard),
  waste: b.waste.map(copyCard),
  found: b.found.map(pile => pile.map(copyCard)),
  tab: b.tab.map(col => col.map(copyCard)),
});

// The cards a source would move: a top card, or a face-up tableau card with the cards on it.
const srcStack = (b, src) => {
  if (src.kind === 'waste') {
    return b.waste.length ? [b.waste[b.waste.length - 1]] : null;
  }
  if (src.kind === 'found') {
    const pile = b.found[src.f];
    return pile.length ? [pile[pile.length - 1]] : null;
  }
  const col = b.tab[src.c];
  if (!col[src.i] || !col[src.i].up) {
    return null;
  }
  return col.slice(src.i);
};

// Whether the stack may go to dst. A source of 'none' is a loose card, not on the board.
const canPlace = (b, dst, stack, src) => {
  const card = stack[0];
  if (dst.kind === 'found') {
    if (stack.length !== 1 || card.suit !== SUITS[dst.f]) {
      return false;
    }
    const pile = b.found[dst.f];
    return pile.length ? pile[pile.length - 1].rank === card.rank - 1 : card.rank === 1;
  }
  if (src.kind === 'tab' && src.c === dst.c) {
    return false;
  }
  const col = b.tab[dst.c];
  if (!col.length) {
    // a King only, and not a whole column moved onto an empty column
    return card.rank === 13 && !(src.kind === 'tab' && src.i === 0);
  }
  const top = col[col.length - 1];
  return top.up && top.rank === card.rank + 1 && isRed(top.suit) !== isRed(card.suit);
};

// The best place for a stack: a foundation for a single card, then a non-empty column, then an
// empty one.
const findDest = (b, src, stack) => {
  if (stack.length === 1) {
    const dst = { kind: 'found', f: SUITS.indexOf(stack[0].suit) };
    if (canPlace(b, dst, stack, src)) {
      return dst;
    }
  }
  for (let pass = 0; pass < 2; pass += 1) {
    for (let c = 0; c < 7; c += 1) {
      const isEmpty = b.tab[c].length === 0;
      if (isEmpty === (pass === 1)) {
        const dst = { kind: 'tab', c };
        if (canPlace(b, dst, stack, src)) {
          return dst;
        }
      }
    }
  }
  return null;
};

const moveStack = (b, src, dst) => {
  let moved;
  if (src.kind === 'waste') {
    moved = [b.waste.pop()];
  } else if (src.kind === 'found') {
    moved = [b.found[src.f].pop()];
  } else {
    const col = b.tab[src.c];
    moved = col.splice(src.i);
    const top = col[col.length - 1];
    if (top && !top.up) {
      top.up = true;
    }
  }
  if (dst.kind === 'found') {
    b.found[dst.f].push(...moved);
  } else {
    b.tab[dst.c].push(...moved);
  }
};

const isWon = b => b.found.reduce((n, pile) => n + pile.length, 0) === 52;

// Whether any move is still possible. Stock turns count only if a card they show can be played.
const canProgress = b => {
  for (let c = 0; c < 7; c += 1) {
    const col = b.tab[c];
    for (let i = 0; i < col.length; i += 1) {
      if (col[i].up && findDest(b, { kind: 'tab', c, i }, col.slice(i))) {
        return true;
      }
    }
  }
  for (let f = 0; f < 4; f += 1) {
    const pile = b.found[f];
    if (pile.length && findDest(b, { kind: 'found', f }, [pile[pile.length - 1]])) {
      return true;
    }
  }
  if (b.waste.length) {
    const top = b.waste[b.waste.length - 1];
    if (findDest(b, { kind: 'waste' }, [top])) {
      return true;
    }
  }
  return b.stock.concat(b.waste).some(card => findDest(b, { kind: 'none' }, [card]) !== null);
};

// Only a board that has a move is dealt, so a new game never starts stuck.
const dealBoard = () => {
  let b = newDeal();
  while (!canProgress(b)) {
    b = newDeal();
  }
  return b;
};

const createGame = () => ({ ...dealBoard(), moves: 0, ms: 0, status: 'ready', history: [] });

const canFinish = b =>
  b.stock.length === 0 && b.waste.length === 0 && b.tab.every(col => col.every(c => c.up));

// One card that can go to a foundation now, from the waste or a tableau top.
const foundationMove = b => {
  const sources = [];
  if (b.waste.length) {
    sources.push({ kind: 'waste' });
  }
  for (let c = 0; c < 7; c += 1) {
    if (b.tab[c].length) {
      sources.push({ kind: 'tab', c, i: b.tab[c].length - 1 });
    }
  }
  for (let s = 0; s < sources.length; s += 1) {
    const stack = srcStack(b, sources[s]);
    const dst = { kind: 'found', f: SUITS.indexOf(stack[0].suit) };
    if (canPlace(b, dst, stack, sources[s])) {
      return { src: sources[s], dst };
    }
  }
  return null;
};

// Which card a press on the id is, for the test hooks.
const locate = (b, id) => {
  if (b.waste.length && b.waste[b.waste.length - 1].id === id) {
    return { kind: 'waste' };
  }
  for (let f = 0; f < 4; f += 1) {
    const pile = b.found[f];
    if (pile.length && pile[pile.length - 1].id === id) {
      return { kind: 'found', f };
    }
  }
  for (let c = 0; c < 7; c += 1) {
    const col = b.tab[c];
    for (let i = 0; i < col.length; i += 1) {
      if (col[i].id === id && col[i].up) {
        return { kind: 'tab', c, i };
      }
    }
  }
  return null;
};

const formatTime = ms => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// Where each thing on the board sits, in felt pixels, in draw order.
const layoutOf = g => {
  const out = [];
  out.push({ type: 'stock', key: 'stock', x: colX(0), y: TOP_Y });

  const waste = g.waste[g.waste.length - 1];
  if (waste) {
    out.push({
      type: 'card',
      key: waste.id,
      card: waste,
      x: colX(1),
      y: TOP_Y,
      src: { kind: 'waste' },
      where: 'waste pile',
    });
  } else {
    out.push({ type: 'slot', key: 'waste-slot', x: colX(1), y: TOP_Y });
  }

  for (let f = 0; f < 4; f += 1) {
    const pile = g.found[f];
    const x = colX(3 + f);
    if (pile.length) {
      out.push({
        type: 'card',
        key: pile[pile.length - 1].id,
        card: pile[pile.length - 1],
        x,
        y: TOP_Y,
        src: { kind: 'found', f },
        where: 'foundation',
      });
    } else {
      out.push({ type: 'slot', key: `found-${f}`, x, y: TOP_Y, suit: SUITS[f] });
    }
  }

  for (let c = 0; c < 7; c += 1) {
    const col = g.tab[c];
    const x = colX(c);
    if (!col.length) {
      out.push({ type: 'slot', key: `col-${c}`, x, y: TAB_Y });
    }
    const down = col.filter(card => !card.up).length;
    const up = col.length - down;
    const step =
      up > 1
        ? Math.max(4, Math.min(UP_STEP, Math.floor((TAB_ROOM - DOWN_STEP * down) / (up - 1))))
        : UP_STEP;
    col.forEach((card, i) => {
      const y = TAB_Y + (i < down ? i * DOWN_STEP : down * DOWN_STEP + (i - down) * step);
      out.push({
        type: 'card',
        key: card.id,
        card,
        x,
        y,
        src: { kind: 'tab', c, i },
        where: `column ${c + 1}`,
      });
    });
  }
  return out;
};

// Which pile a point in felt pixels is over, for a drop.
const dropTarget = p => {
  if (p.y < TOP_Y + CARD_H) {
    for (let f = 0; f < 4; f += 1) {
      const x = colX(3 + f);
      if (p.x >= x && p.x < x + CARD_W) {
        return { kind: 'found', f };
      }
    }
    return null;
  }
  for (let c = 0; c < 7; c += 1) {
    const x = colX(c);
    if (p.x >= x && p.x < x + CARD_W) {
      return { kind: 'tab', c };
    }
  }
  return null;
};

const sameIds = (stack, ids) =>
  stack.length === ids.length && stack.every((card, i) => card.id === ids[i]);

const shownState = (g, active) => (g.status === 'playing' && !active ? 'paused' : g.status);

const snapshotOf = (g, active) => ({
  state: shownState(g, active),
  moves: g.moves,
  seconds: Math.floor(g.ms / 1000),
  stock: g.stock.length,
  waste: g.waste.map(card => card.id),
  foundations: g.found.map(pile => pile.map(card => card.id)),
  tableau: g.tab.map(col => col.map(card => ({ id: card.id, up: card.up }))),
});

// ---------- the game ----------

const Game = ({ active, w, h }) => {
  const gameRef = useRef(null);
  if (gameRef.current === null) {
    gameRef.current = createGame();
  }
  const [, setRev] = useState(0);
  const redraw = () => setRev(r => r + 1);

  const feltRef = useRef(null);
  const pressRef = useRef(null);
  const dragEndRef = useRef(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  const [best, submit] = useBest('solitaire', { lowerWins: true });
  const submitRef = useRef(submit);
  submitRef.current = submit;

  const handlers = useRef({});

  const canAct = () => {
    const { status } = gameRef.current;
    return activeRef.current && status !== 'won' && status !== 'over';
  };

  // Called before a move changes the board, so Undo can return to it.
  const begin = () => {
    const g = gameRef.current;
    g.history.push({ board: cloneBoard(g), status: g.status });
    if (g.status === 'ready') {
      g.status = 'playing';
      report('solitaire', 'start');
    }
  };

  // Called after a move: a win ends the game, and a board with no move left ends it too.
  const settle = () => {
    const g = gameRef.current;
    if (isWon(g)) {
      g.status = 'won';
      submitRef.current(g.moves);
      report('solitaire', 'win');
    } else if (!canProgress(g)) {
      g.status = 'over';
      report('solitaire', 'over');
    }
  };

  const commit = (src, dst) => {
    const g = gameRef.current;
    begin();
    moveStack(g, src, dst);
    g.moves += 1;
    settle();
    redraw();
  };

  const clickCard = src => {
    if (!canAct()) {
      return;
    }
    const g = gameRef.current;
    const stack = srcStack(g, src);
    if (!stack) {
      return;
    }
    const dst = findDest(g, src, stack);
    if (dst) {
      commit(src, dst);
    }
  };

  // A click made with Enter or Space has detail 0; only a pointer click can be left by a drag.
  const onCardClick = (e, src) => {
    if (e.detail !== 0 && Date.now() - dragEndRef.current < CLICK_AFTER_DRAG) {
      return;
    }
    clickCard(src);
  };

  const clickStock = () => {
    if (!canAct()) {
      return;
    }
    const g = gameRef.current;
    if (g.stock.length) {
      begin();
      const card = g.stock.pop();
      card.up = true;
      g.waste.push(card);
    } else if (g.waste.length) {
      begin();
      const back = g.waste.reverse();
      back.forEach(card => {
        card.up = false;
      });
      g.stock = back;
      g.waste = [];
    } else {
      return;
    }
    g.moves += 1;
    settle();
    redraw();
  };

  const finish = () => {
    if (!canAct()) {
      return;
    }
    const g = gameRef.current;
    if (!canFinish(g) || !foundationMove(g)) {
      return;
    }
    begin();
    let m = foundationMove(g);
    while (m) {
      moveStack(g, m.src, m.dst);
      g.moves += 1;
      m = foundationMove(g);
    }
    settle();
    redraw();
  };

  const undo = () => {
    if (!activeRef.current) {
      return;
    }
    const g = gameRef.current;
    if (g.status === 'won' || !g.history.length) {
      return;
    }
    const snap = g.history.pop();
    pressRef.current = null;
    g.stock = snap.board.stock;
    g.waste = snap.board.waste;
    g.found = snap.board.found;
    g.tab = snap.board.tab;
    g.status = snap.status;
    if (g.status === 'ready') {
      g.ms = 0;
    }
    redraw();
  };

  const newGame = () => {
    if (!activeRef.current) {
      return;
    }
    gameRef.current = createGame();
    pressRef.current = null;
    redraw();
  };

  // Pointer input: a press that moves more than DRAG_SLOP drags; otherwise the click handler runs.
  const onCardDown = (e, src) => {
    if (!activeRef.current || e.button !== 0) {
      return;
    }
    const p = pointIn(e, feltRef.current);
    if (pressRef.current && pressRef.current.dragging) {
      // a drag whose release never arrived (or a second finger): put its cards back
      redraw();
    }
    pressRef.current = {
      src,
      pointerId: e.pointerId,
      startX: p.x,
      startY: p.y,
      dragging: false,
      dx: 0,
      dy: 0,
      ids: [],
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // without capture the drag still works while the pointer stays over the felt
    }
  };

  const onFeltMove = e => {
    const press = pressRef.current;
    if (!press || press.pointerId !== e.pointerId) {
      return;
    }
    const p = pointIn(e, feltRef.current);
    if (!press.dragging) {
      if (Math.hypot(p.x - press.startX, p.y - press.startY) <= DRAG_SLOP) {
        return;
      }
      const stack = srcStack(gameRef.current, press.src);
      if (!stack || !canAct()) {
        pressRef.current = null;
        return;
      }
      press.dragging = true;
      press.ids = stack.map(card => card.id);
    }
    press.dx = p.x - press.startX;
    press.dy = p.y - press.startY;
    redraw();
  };

  const onFeltUp = e => {
    const press = pressRef.current;
    if (!press || press.pointerId !== e.pointerId) {
      return;
    }
    pressRef.current = null;
    if (!press.dragging) {
      return;
    }
    dragEndRef.current = Date.now();
    const g = gameRef.current;
    const stack = srcStack(g, press.src);
    const dst = dropTarget(pointIn(e, feltRef.current));
    if (
      canAct() &&
      stack &&
      sameIds(stack, press.ids) &&
      dst &&
      canPlace(g, dst, stack, press.src)
    ) {
      commit(press.src, dst);
    }
    redraw();
  };

  const onFeltCancel = e => {
    const press = pressRef.current;
    if (press && press.pointerId === e.pointerId) {
      pressRef.current = null;
      redraw();
    }
  };

  // The game advances only while it is playing and its window is in front.
  const g = gameRef.current;
  const running = g.status === 'playing' && active;
  useLoop(dt => {
    const s = gameRef.current;
    const before = Math.floor(s.ms / 1000);
    s.ms += dt;
    if (Math.floor(s.ms / 1000) !== before) {
      redraw();
    }
  }, running);

  useKeys(e => {
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      newGame();
    } else if (e.key === 'u' || e.key === 'U') {
      e.preventDefault();
      undo();
    }
  }, active);

  handlers.current = { clickCard };

  useEffect(() => {
    window.__games = window.__games || {};
    window.__games.solitaire = {
      snapshot: () => snapshotOf(gameRef.current, activeRef.current),
      clickCard: id => {
        const src = locate(gameRef.current, id);
        if (src) {
          handlers.current.clickCard(src);
        }
      },
      clickStock: () => clickStock(),
    };
    return () => {
      if (window.__games) {
        delete window.__games.solitaire;
      }
    };
  }, []);

  const drag = active && pressRef.current && pressRef.current.dragging ? pressRef.current : null;
  const shown = shownState(g, active);
  const bestMoves = best === null ? g.moves : best;
  const winLine = `${g.moves} moves in ${formatTime(g.ms)}. Best: ${bestMoves} moves.`;

  const entries = layoutOf(g).map((entry, index) => {
    const dragged = !!(drag && entry.card && drag.ids.indexOf(entry.card.id) !== -1);
    const x = entry.x + (dragged ? drag.dx : 0);
    const y = entry.y + (dragged ? drag.dy : 0);
    const z = dragged ? 200 + index : index + 1;
    const pos = { left: x, top: y, zIndex: z };

    if (entry.type === 'stock') {
      const empty = g.stock.length === 0;
      let label = `Stock, ${g.stock.length} cards left. Press to turn over a card.`;
      if (empty) {
        label = g.waste.length ? 'Empty stock. Press to turn the waste back over.' : 'Empty stock.';
      }
      return (
        <StockBtn
          key="stock"
          $empty={empty}
          style={pos}
          aria-label={label}
          onClick={() => clickStock()}>
          {empty ? (
            <Mark kind="RING" color={COLORS.light} scale={2} />
          ) : (
            <BackBorder aria-hidden="true" />
          )}
        </StockBtn>
      );
    }

    if (entry.type === 'slot') {
      return (
        <Slot key={entry.key} style={pos}>
          {entry.suit ? <Mark kind={entry.suit} color={COLORS.teal} scale={2} /> : null}
        </Slot>
      );
    }

    const { card } = entry;
    if (!card.up) {
      return (
        <BackCard key={card.id} style={pos}>
          <BackBorder aria-hidden="true" />
        </BackCard>
      );
    }
    const ink = inkOf(card.suit);
    return (
      <CardBtn
        key={card.id}
        aria-label={`${RANK_WORDS[card.rank]} of ${SUIT_NAMES[card.suit]}, ${entry.where}`}
        style={{ ...pos, color: ink }}
        onPointerDown={e => onCardDown(e, entry.src)}
        onClick={e => onCardClick(e, entry.src)}>
        <Rank aria-hidden="true">{RANK_TEXT[card.rank]}</Rank>
        <Corner aria-hidden="true">
          <Mark kind={card.suit} color={ink} scale={1} />
        </Corner>
        <Center aria-hidden="true">
          <Mark kind={card.suit} color={ink} scale={2} />
        </Center>
      </CardBtn>
    );
  });

  return (
    <Frame data-game-root="solitaire" data-state={shown} style={{ width: w, height: h }}>
      <Bar>
        <Caption>{`Moves: ${g.moves}`}</Caption>
        <Btn onClick={newGame}>New</Btn>
        <Btn onClick={undo}>Undo</Btn>
        {g.status === 'playing' && canFinish(g) ? <Btn onClick={finish}>Finish</Btn> : null}
        <Caption>{`Time: ${formatTime(g.ms)}`}</Caption>
      </Bar>
      <Well $bg={COLORS.green}>
        <Felt
          ref={feltRef}
          onPointerMove={onFeltMove}
          onPointerUp={onFeltUp}
          onPointerCancel={onFeltCancel}>
          {entries}
        </Felt>
        {shown === 'paused' ? <Message title="Paused" /> : null}
        {g.status === 'won' ? (
          <Message title="You win" action="New game" onAction={newGame}>
            {winLine}
          </Message>
        ) : null}
        {g.status === 'over' ? (
          <Message title="Game over" action="New game" onAction={newGame}>
            {`No moves left after ${g.moves} moves.`}
          </Message>
        ) : null}
      </Well>
    </Frame>
  );
};

Game.propTypes = {
  active: PropTypes.bool.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

export default Game;
