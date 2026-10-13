import { WINDOWS } from './registry';

// Action types. Components never dispatch these directly; they call actions.* from useDesktop().
export const A = {
  VIEWPORT: 'VIEWPORT',
  REDUCED_MOTION: 'REDUCED_MOTION',
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  RAISE: 'RAISE',
  MOVE: 'MOVE',
  RESET: 'RESET',
  TOGGLE_WORLD_TIME: 'TOGGLE_WORLD_TIME',
  CLOSE_WORLD_TIME: 'CLOSE_WORLD_TIME',
  TOGGLE_START: 'TOGGLE_START',
  CLOSE_START: 'CLOSE_START',
  ESCAPE: 'ESCAPE',
};

const PHONE_MAX = 576;

const BASE_Z = 1000;
// The window that is already open when the page appears. It is open in the first render, so it
// is in the server's HTML and nothing moves on load.
const OPEN_AT_START = 'about';

const makeWindows = () =>
  WINDOWS.reduce((acc, w) => {
    const open = w.id === OPEN_AT_START;
    acc[w.id] = { open, z: open ? BASE_Z + 1 : 0, dx: 0, dy: 0, order: open ? 1 : 0 };
    return acc;
  }, {});

export const initialState = {
  reducedMotion: false, // set after mount from matchMedia
  viewport: { w: 0, h: 0, phone: false, ready: false },
  windows: makeWindows(), // one entry per registry id: { open, z, dx, dy, order }
  topZ: BASE_Z + 1,
  openCount: 1, // source of windows[id].order, which sorts the taskbar buttons
  worldTimeOpen: false,
  startOpen: false,
  focusTick: null, // { kind: 'window', id, n } - a request to move focus
};

// The z of the window in front. 0 when nothing is open.
export const frontZ = state => {
  let z = 0;
  Object.keys(state.windows).forEach(id => {
    const w = state.windows[id];
    if (w.open && w.z > z) {
      z = w.z;
    }
  });
  return z;
};

const nextTick = (state, kind, id) => ({
  kind,
  id,
  n: (state.focusTick ? state.focusTick.n : 0) + 1,
});

const mapWindows = (windows, fn) =>
  Object.keys(windows).reduce((acc, id) => {
    acc[id] = fn(windows[id], id);
    return acc;
  }, {});

const openWindow = (state, id, focus) => {
  if (!state.windows[id]) {
    return state;
  }
  const topZ = state.topZ + 1;
  // On a phone only one main window is open at a time.
  const windows = mapWindows(state.windows, (w, key) =>
    state.viewport.phone && key !== id && w.open ? { ...w, open: false } : w,
  );
  const wasOpen = windows[id].open;
  const openCount = wasOpen ? state.openCount : state.openCount + 1;
  windows[id] = {
    ...windows[id],
    open: true,
    z: topZ,
    order: wasOpen ? windows[id].order : openCount,
  };
  return {
    ...state,
    windows,
    topZ,
    openCount,
    worldTimeOpen: false,
    startOpen: false,
    focusTick: focus ? nextTick(state, 'window', id) : state.focusTick,
  };
};

const closeWindow = (state, id) => {
  const win = state.windows[id];
  if (!win || !win.open) {
    return state;
  }
  return {
    ...state,
    windows: { ...state.windows, [id]: { ...win, open: false } },
  };
};

// Escape closes whichever open window is in front. Keyboard focus brings its window to the
// front, so that is also the one holding focus.
const closeTop = state => {
  let top = null;
  Object.keys(state.windows).forEach(id => {
    const w = state.windows[id];
    if (w.open && (!top || w.z > top.z)) {
      top = { id, z: w.z };
    }
  });
  return top ? closeWindow(state, top.id) : state;
};

export const reducer = (state, action) => {
  switch (action.type) {
    case A.VIEWPORT: {
      const { w, h } = action;
      const phone = w <= PHONE_MAX;
      let { windows } = state;
      if (phone && !state.viewport.phone) {
        // Entering the phone layout: keep only the front window open.
        const openIds = Object.keys(windows).filter(id => windows[id].open);
        if (openIds.length > 1) {
          const keep = openIds.reduce((a, b) => (windows[a].z >= windows[b].z ? a : b));
          windows = mapWindows(windows, (win, id) =>
            win.open && id !== keep ? { ...win, open: false } : win,
          );
        }
      }
      return { ...state, windows, viewport: { w, h, phone, ready: true } };
    }

    case A.REDUCED_MOTION:
      return state.reducedMotion === !!action.value
        ? state
        : { ...state, reducedMotion: !!action.value };

    case A.OPEN:
      return openWindow(state, action.id, action.focus);

    case A.CLOSE:
      return closeWindow(state, action.id);

    // focus: true also moves keyboard focus into the window (a taskbar button).
    case A.RAISE: {
      const win = state.windows[action.id];
      if (!win || !win.open) {
        return state;
      }
      const focusTick = action.focus ? nextTick(state, 'window', action.id) : state.focusTick;
      if (win.z === state.topZ) {
        return action.focus ? { ...state, focusTick } : state;
      }
      const topZ = state.topZ + 1;
      return {
        ...state,
        topZ,
        focusTick,
        windows: { ...state.windows, [action.id]: { ...win, z: topZ } },
      };
    }

    case A.MOVE: {
      const win = state.windows[action.id];
      if (!win || (win.dx === action.dx && win.dy === action.dy)) {
        return state;
      }
      return {
        ...state,
        windows: { ...state.windows, [action.id]: { ...win, dx: action.dx, dy: action.dy } },
      };
    }

    case A.RESET:
      return {
        ...state,
        windows: mapWindows(state.windows, w => ({ ...w, open: false, dx: 0, dy: 0 })),
        worldTimeOpen: false,
        startOpen: false,
      };

    case A.TOGGLE_WORLD_TIME:
      return { ...state, worldTimeOpen: !state.worldTimeOpen, startOpen: false };

    case A.CLOSE_WORLD_TIME:
      return state.worldTimeOpen ? { ...state, worldTimeOpen: false } : state;

    case A.TOGGLE_START:
      return { ...state, startOpen: !state.startOpen, worldTimeOpen: false };

    case A.CLOSE_START:
      return state.startOpen ? { ...state, startOpen: false } : state;

    case A.ESCAPE:
      if (state.worldTimeOpen || state.startOpen) {
        return { ...state, worldTimeOpen: false, startOpen: false };
      }
      return closeTop(state);

    default:
      return state;
  }
};
