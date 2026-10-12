import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { A, initialState, reducer } from './state';
import { record, recordWindowOpen } from '../tracking';

const DesktopContext = createContext(null);

// useLayoutEffect warns during server rendering; fall back to useEffect there.
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Elements that opened something, so focus can go back to them when it closes.
const openers = new Map();
const EGG_KEY = '@egg';

export const getOpener = id => openers.get(id) || null;
export const getEggOpener = () => openers.get(EGG_KEY) || null;

// Windows the visitor just asked to open (id -> the element they used). The state diff below
// counts one only if it really went from closed to open.
const openIntent = new Map();
// Why a window or popup is about to close ('win:<id>' or 'pop:<key>' -> 'button'), and when Escape
// or a reset last ran. The state diff below reads these to name the reason of each close.
const closeVia = new Map();
let escapeAt = 0;
let resetAt = 0;
const RECENT = 1000; // ms
const dwellBand = start => {
  if (!start) {
    return 'unknown';
  }
  const s = (Date.now() - start) / 1000;
  if (s < 10) {
    return 'under 10s';
  }
  if (s < 60) {
    return '10-59s';
  }
  return s < 300 ? '1-5m' : 'over 5m';
};
const reasonFor = key => {
  if (closeVia.has(key)) {
    return closeVia.get(key);
  }
  if (Date.now() - resetAt < RECENT) {
    return 'reset';
  }
  return Date.now() - escapeAt < RECENT ? 'escape' : 'other';
};

const rememberOpener = (id, el) => {
  if (el && typeof el.focus === 'function') {
    openers.set(id, el);
  }
};

const makeActions = dispatch => ({
  // `from` is the element to return focus to when the window closes
  openWindow: (id, { from, focus = true } = {}) => {
    rememberOpener(id, from);
    // focus: false is an open the visitor did not ask for, so it is not counted.
    if (focus) {
      openIntent.set(id, from || null);
    }
    dispatch({ type: A.OPEN, id, focus });
  },
  closeWindow: id => {
    closeVia.set(`win:${id}`, 'button');
    dispatch({ type: A.CLOSE, id });
  },
  raiseWindow: id => dispatch({ type: A.RAISE, id }),
  // a taskbar button: bring the window to the front and move focus into it
  focusWindow: id => dispatch({ type: A.RAISE, id, focus: true }),
  // auto: the window was pulled back on screen after a resize, not dragged
  moveWindow: (id, dx, dy, { auto = false } = {}) => {
    if (!auto) {
      record('window_move', { props: { window: id }, once: true });
    }
    dispatch({ type: A.MOVE, id, dx, dy });
  },
  reset: () => {
    record('desktop_reset', { path: '/click/reset' });
    resetAt = Date.now();
    dispatch({ type: A.RESET });
  },
  spawnPopup: popup => dispatch({ type: A.SPAWN, popup }),
  closePopup: key => {
    closeVia.set(`pop:${key}`, 'button');
    dispatch({ type: A.CLOSE_POPUP, key });
  },
  raisePopup: key => dispatch({ type: A.RAISE_POPUP, key }),
  movePopup: (key, x, y, { auto = false } = {}) => {
    if (!auto) {
      record('popup_move', { once: true });
    }
    dispatch({ type: A.MOVE_POPUP, key, x, y });
  },
  eggClick: fromEl => {
    rememberOpener(EGG_KEY, fromEl);
    dispatch({ type: A.EGG_CLICK });
  },
  dismissBsod: () => dispatch({ type: A.BSOD_DISMISS }),
  toggleWorldTime: () => dispatch({ type: A.TOGGLE_WORLD_TIME }),
  closeWorldTime: () => dispatch({ type: A.CLOSE_WORLD_TIME }),
  toggleStart: () => dispatch({ type: A.TOGGLE_START }),
  closeStart: () => dispatch({ type: A.CLOSE_START }),
});

const RESIZE_DEBOUNCE = 150;

const DesktopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useMemo(() => makeActions(dispatch), [dispatch]);

  // Viewport: measured before the first paint, then on a debounced resize.
  useIsoLayoutEffect(() => {
    const measure = () =>
      dispatch({ type: A.VIEWPORT, w: window.innerWidth, h: window.innerHeight });
    let timeout;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(measure, RESIZE_DEBOUNCE);
    };

    measure();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Reduced motion.
  useIsoLayoutEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => dispatch({ type: A.REDUCED_MOTION, value: mql.matches });

    onChange();
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  // Escape closes the front-most thing.
  useEffect(() => {
    const onKeyDown = e => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        escapeAt = Date.now();
        dispatch({ type: A.ESCAPE });
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Analytics, read from what the state actually did rather than from what was clicked: a
  // window counts as opened only when it goes from closed to open, and every close is counted
  // however it happened (button, Escape, a reset, or a phone switching to another window).
  const { eggClicks, bsod, popups, windows, worldTimeOpen, startOpen } = state;
  const shownPopups = useRef(new Set());
  const seen = useRef({ windows, popups });
  const openedAt = useRef(new Map());

  // The window that is open when the page appears is not counted as opened, but its close is
  // counted, so its time on screen starts here.
  useEffect(() => {
    Object.keys(windows).forEach(id => {
      if (windows[id].open && !openedAt.current.has(id)) {
        openedAt.current.set(id, Date.now());
      }
    });
    // Once, for the windows of the first render.
  }, []);
  const wasBsod = useRef(false);

  useEffect(() => {
    const before = seen.current;
    seen.current = { windows, popups };
    if (before.windows !== windows) {
      Object.keys(windows).forEach(id => {
        const was = !!(before.windows[id] && before.windows[id].open);
        const now = !!windows[id].open;
        if (!was && now) {
          openedAt.current.set(id, Date.now());
          if (openIntent.has(id)) {
            recordWindowOpen(id, openIntent.get(id));
          }
        } else if (was && !now) {
          const start = openedAt.current.get(id);
          openedAt.current.delete(id);
          record('window_close', {
            props: { window: id, via: reasonFor(`win:${id}`), open: dwellBand(start) },
          });
        }
      });
    }
    if (before.popups !== popups) {
      before.popups.forEach(p => {
        if (!popups.some(q => q.key === p.key)) {
          record('popup_close', { props: { popup: p.dataId, via: reasonFor(`pop:${p.key}`) } });
        }
      });
    }
    closeVia.clear();
    openIntent.clear();
    escapeAt = 0;
    resetAt = 0;
  }, [windows, popups]);

  useEffect(() => {
    if (eggClicks > 0) {
      record('egg_click', { path: '/egg/click', props: { count: eggClicks } });
    }
  }, [eggClicks]);

  useEffect(() => {
    if (bsod) {
      record('egg_bluescreen', { path: '/egg/bluescreen' });
    } else if (wasBsod.current) {
      record('bluescreen_dismiss');
    }
    wasBsod.current = bsod;
  }, [bsod]);

  useEffect(() => {
    if (worldTimeOpen) {
      record('world_time_open', { path: '/panel/world-time' });
    }
  }, [worldTimeOpen]);

  useEffect(() => {
    if (startOpen) {
      record('start_menu_open', { path: '/panel/start', once: true });
    }
  }, [startOpen]);

  useEffect(() => {
    popups.forEach(p => {
      if (!shownPopups.current.has(p.key)) {
        shownPopups.current.add(p.key);
        record('popup_shown', { props: { popup: p.dataId } });
      }
    });
  }, [popups]);

  const value = useMemo(() => ({ state, dispatch, actions }), [state, actions]);

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
};

DesktopProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Returns { state, dispatch, actions }. Must be used under <DesktopProvider>.
export const useDesktop = () => {
  const ctx = useContext(DesktopContext);
  if (!ctx) {
    throw new Error('useDesktop() must be used inside <DesktopProvider>');
  }
  return ctx;
};

export default DesktopProvider;
