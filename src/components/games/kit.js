import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bevel, bevelPressed, sunken, focusRect } from '@styles';
import { useIsoLayoutEffect } from '../desktop/DesktopProvider';
import { getBounds } from '../desktop/Window';
import { record } from '../tracking';

// Shared parts for the games. Every game is drawn in a box of a fixed "natural" size (w x h CSS
// pixels, set in the registry). Stage scales that box to fit the screen, so a game only
// ever thinks in natural pixels.

// The sixteen colours the games draw with.
export const COLORS = {
  black: '#000000',
  white: '#ffffff',
  chrome: '#c0c0c0',
  light: '#dfdfdf',
  shadow: '#808080',
  navy: '#000080',
  blue: '#0000ff',
  teal: '#008080',
  cyan: '#00a8a8',
  green: '#008000',
  lime: '#60cd46',
  red: '#cc1b1b',
  maroon: '#800000',
  yellow: '#f2c230',
  orange: '#e07a1f',
  purple: '#800080',
};

const FRAME = 8; // the window frame, left and right or top and bottom
const AREA_PAD = 12; // the padding of the game area, both sides
const MARGIN = 16; // room left around a window that is not full screen
const MAX_SCALE = 1.5;

const StageOuter = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
`;

const StageInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  background: var(--chrome);
  color: var(--text);
  font: 16px/1 var(--main-font);
`;

/**
 * Holds a game at its natural size and scales it to fit the window: down when there is less
 * room, and up (to MAX_SCALE) in a full-screen phone window that has room to spare.
 */
export const Stage = ({ w, h, children }) => {
  const outer = useRef(null);
  const [fit, setFit] = useState({ scale: 1, left: 0 });

  useIsoLayoutEffect(() => {
    const el = outer.current;
    if (!el) {
      return undefined;
    }
    const measure = () => {
      const win = el.closest('[data-window]');
      const bar = win ? win.querySelector('.win__titlebar') : null;
      const availW = el.clientWidth;
      const availH = getBounds().bottom - (bar ? bar.offsetHeight : 24) - FRAME - AREA_PAD - MARGIN;
      if (!availW) {
        return;
      }
      let scale = Math.min(MAX_SCALE, availW / w, availH / h);
      scale = Math.abs(scale - 1) < 0.005 ? 1 : Math.max(0.3, scale);
      const left = Math.max(0, Math.floor((availW - w * scale) / 2));
      setFit(prev => (prev.scale === scale && prev.left === left ? prev : { scale, left }));
    };
    measure();
    window.addEventListener('resize', measure);
    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      observer.observe(el);
    }
    return () => {
      window.removeEventListener('resize', measure);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [w, h]);

  return (
    <StageOuter ref={outer} data-stage style={{ height: Math.ceil(h * fit.scale) }}>
      <StageInner
        style={{
          width: w,
          height: h,
          transform: `translate(${fit.left}px, 0) scale(${fit.scale})`,
        }}>
        {children}
      </StageInner>
    </StageOuter>
  );
};

Stage.propTypes = {
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  children: PropTypes.node,
};

/**
 * A pointer event's position in natural pixels inside `el`, whatever the Stage scale is.
 * `el` must be laid out at its natural size (w x h) before scaling, as everything in a Stage is.
 */
export const pointIn = (e, el) => {
  const rect = el.getBoundingClientRect();
  const sx = rect.width ? el.offsetWidth / rect.width : 1;
  const sy = rect.height ? el.offsetHeight / rect.height : 1;
  return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
};

/**
 * Sizes a canvas for a sharp picture on any screen and returns its 2D context, already scaled so
 * that drawing uses natural pixels (0..w, 0..h).
 */
export const setupCanvas = (canvas, w, h) => {
  const ratio = Math.min(3, Math.max(1, Math.ceil(window.devicePixelRatio || 1)));
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return ctx;
};

/**
 * Calls step(dt) once a frame while `running` is true. dt is in milliseconds and never more
 * than 50, so a game does not jump after the tab was in the background.
 */
export const useLoop = (step, running) => {
  const saved = useRef(step);
  saved.current = step;

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    let frame;
    let last = 0;
    // A step that sets state can run this effect's cleanup before it returns, so the flag is
    // checked again before the next frame is asked for.
    let stopped = false;
    const tick = now => {
      if (stopped) {
        return;
      }
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      saved.current(dt);
      if (!stopped) {
        frame = window.requestAnimationFrame(tick);
      }
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
    };
  }, [running]);
};

const fromChrome = target =>
  !!(target && target.closest && target.closest('[data-taskbar], [data-start-menu]'));

const onControl = (e, target) =>
  (e.key === ' ' || e.key === 'Enter') &&
  !!(target && target.closest && target.closest('button, a, input, select, textarea'));

/**
 * Calls onKey(event) for key presses while `active` is true. Presses that belong to the taskbar
 * or the Start menu, presses with Ctrl, Alt or Cmd held, and Space or Enter on a focused button
 * are left alone. Call event.preventDefault() for the keys the game uses (the arrows and Space
 * scroll the page otherwise). Escape is never passed on: it closes the window.
 */
export const useKeys = (onKey, active) => {
  const saved = useRef(onKey);
  saved.current = onKey;

  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const onKeyDown = e => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Escape' || e.key === 'Esc') {
        return;
      }
      if (fromChrome(e.target) || onControl(e, e.target)) {
        return;
      }
      saved.current(e);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active]);
};

/**
 * The set of keys held down right now, as a ref to a Set of event.key values (letters in lower
 * case). The listed keys do not scroll the page while `active`. Empty whenever `active` is false.
 */
export const useHeldKeys = (active, keys = []) => {
  const held = useRef(new Set());
  const list = keys.join('|');

  useEffect(() => {
    const set = held.current;
    if (!active) {
      set.clear();
      return undefined;
    }
    const wanted = new Set(list.split('|'));
    const norm = key => (key.length === 1 ? key.toLowerCase() : key);
    const down = e => {
      if (e.ctrlKey || e.altKey || e.metaKey || fromChrome(e.target) || onControl(e, e.target)) {
        return;
      }
      const key = norm(e.key);
      if (wanted.has(key)) {
        e.preventDefault();
      }
      set.add(key);
    };
    const up = e => set.delete(norm(e.key));
    const clear = () => set.clear();
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
      set.clear();
    };
  }, [active, list]);

  return held;
};

/**
 * The best score kept in this browser. Returns [best, submit]; submit(score) saves the score if
 * it beats the best one and returns true when it did. lowerWins is for times and move counts.
 * best is null until there is one.
 */
export const useBest = (game, { lowerWins = false } = {}) => {
  const key = `ps-game-best-${game}`;
  const [best, setBest] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      const value = raw === null ? NaN : Number(raw);
      if (Number.isFinite(value)) {
        setBest(value);
      }
    } catch (err) {
      // storage is blocked; the game works without a saved best
    }
  }, [key]);

  const submit = score => {
    if (!Number.isFinite(score)) {
      return false;
    }
    const beats = best === null || (lowerWins ? score < best : score > best);
    if (!beats) {
      return false;
    }
    setBest(score);
    try {
      window.localStorage.setItem(key, String(score));
    } catch (err) {
      // storage is blocked; the best lasts until the page is closed
    }
    return true;
  };

  return [best, submit];
};

/**
 * Counts a game event for the site's anonymous visit counts. what: 'start' (first move of the
 * first game), 'over' or 'win'. Each is counted once per game per page view.
 */
export const report = (game, what) => record(`game_${what}`, { props: { game }, once: true });

// ---------- parts ----------

// The whole game: a column filling the natural box.
export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  height: 100%;
`;

// The strip above the board: readouts at the sides, the New button in the middle.
export const Bar = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 36px;
  padding: 0 6px;
  box-shadow: inset -1px -1px var(--bevel-hi), inset 1px 1px var(--bevel-shadow);
`;

// A number on a black panel, like a calculator display.
export const Readout = styled.span`
  flex: none;
  min-width: 52px;
  padding: 3px 6px 2px;
  background: #000000;
  color: #ff3b30;
  font: 24px/1 var(--main-large-font);
  text-align: right;
  white-space: nowrap;
`;

// A plain caption on the grey: "Score", "Best".
export const Caption = styled.span`
  font: 16px/1 var(--main-font);
  white-space: nowrap;
`;

export const Btn = styled.button.attrs({ type: 'button' })`
  flex: none;
  min-width: 28px;
  height: 28px;
  padding: 0 10px;
  background: var(--chrome);
  color: var(--text);
  font: 16px/1 var(--main-font);
  white-space: nowrap;
  cursor: default;
  ${bevel};
  ${focusRect};

  &:active,
  &[aria-pressed='true'] {
    ${bevelPressed};
  }
`;

// The sunken well the board sits in. It takes the rest of the height.
export const Well = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  padding: 2px;
  background: ${props => props.$bg || 'var(--chrome)'};
  ${sunken};
`;

const Veil = styled.div`
  position: absolute;
  inset: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  /* A press on the message or the dimmed board goes through to the board ("tap to start"). */
  pointer-events: none;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 86%;
  padding: 12px 16px;
  background: var(--chrome);
  color: var(--text);
  text-align: center;
  line-height: 1.25;
  ${bevel};

  button {
    pointer-events: auto;
  }
`;

/**
 * A small message box over the board: "Game over", "Paused", "You win". Place it inside a Well.
 * title is the headline, children the lines under it, and action (with onAction) the button.
 */
export const Message = ({ title, children, action, onAction }) => (
  <Veil>
    <Box role="status">
      <strong>{title}</strong>
      {children ? <span>{children}</span> : null}
      {action ? <Btn onClick={onAction}>{action}</Btn> : null}
    </Box>
  </Veil>
);

Message.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  action: PropTypes.string,
  onAction: PropTypes.func,
};

// One line of instructions under the board.
export const Hint = styled.p`
  flex: none;
  margin: 0;
  padding: 0 2px;
  font: 16px/18px var(--main-font);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
