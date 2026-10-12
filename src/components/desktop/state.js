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
  SPAWN: 'SPAWN',
  CLOSE_POPUP: 'CLOSE_POPUP',
  RAISE_POPUP: 'RAISE_POPUP',
  MOVE_POPUP: 'MOVE_POPUP',
  EGG_CLICK: 'EGG_CLICK',
  BSOD_DISMISS: 'BSOD_DISMISS',
  TOGGLE_WORLD_TIME: 'TOGGLE_WORLD_TIME',
  CLOSE_WORLD_TIME: 'CLOSE_WORLD_TIME',
  TOGGLE_START: 'TOGGLE_START',
  CLOSE_START: 'CLOSE_START',
  ESCAPE: 'ESCAPE',
};

export const MAX_POPUPS = 12;
const EGG_BSOD_AT = 3;
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
  popups: [], // { key, dataId, x, y, w, z }
  popupEpoch: 0, // bumped by RESET, the blue screen and BSOD_DISMISS; the spawner cancels timers
  eggClicks: 0, // never reset
  bsod: false,
  worldTimeOpen: false,
  startOpen: false,
  focusTick: null, // { kind: 'window' | 'bsod', id, n } - a request to move focus
};

// The z of whatever is in front, a window or a popup. 0 when nothing is open.
export const frontZ = state => {
  let z = 0;
  Object.keys(state.windows).forEach(id => {
    const w = state.windows[id];
    if (w.open && w.z > z) {
      z = w.z;
    }
  });
  state.popups.forEach(p => {
    if (p.z > z) {
      z = p.z;
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

const closePopup = (state, key) => {
  const popups = state.popups.filter(p => p.key !== key);
  return popups.length === state.popups.length ? state : { ...state, popups };
};

const dismissBsod = state =>
  state.bsod ? { ...state, bsod: false, popups: [], popupEpoch: state.popupEpoch + 1 } : state;

// Escape closes whichever open window or popup is in front. Keyboard focus brings its window
// or popup to the front, so that is also the one holding focus.
const closeTop = state => {
  let top = null;
  Object.keys(state.windows).forEach(id => {
    const w = state.windows[id];
    if (w.open && (!top || w.z > top.z)) {
      top = { type: 'window', id, z: w.z };
    }
  });
  state.popups.forEach(p => {
    if (!top || p.z > top.z) {
      top = { type: 'popup', key: p.key, z: p.z };
    }
  });
  if (!top) {
    return state;
  }
  return top.type === 'window' ? closeWindow(state, top.id) : closePopup(state, top.key);
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
        popups: [],
        popupEpoch: state.popupEpoch + 1,
        worldTimeOpen: false,
        startOpen: false,
      };

    case A.SPAWN: {
      const { popup } = action;
      if (
        !popup ||
        state.bsod ||
        state.popups.length >= MAX_POPUPS ||
        state.popups.some(p => p.dataId === popup.dataId || p.key === popup.key)
      ) {
        return state;
      }
      const topZ = state.topZ + 1;
      return { ...state, topZ, popups: [...state.popups, { ...popup, z: topZ }] };
    }

    case A.CLOSE_POPUP:
      return closePopup(state, action.key);

    case A.RAISE_POPUP: {
      const popup = state.popups.find(p => p.key === action.key);
      if (!popup || popup.z === state.topZ) {
        return state;
      }
      const topZ = state.topZ + 1;
      return {
        ...state,
        topZ,
        popups: state.popups.map(p => (p.key === action.key ? { ...p, z: topZ } : p)),
      };
    }

    case A.MOVE_POPUP:
      return {
        ...state,
        popups: state.popups.map(p =>
          p.key === action.key ? { ...p, x: action.x, y: action.y } : p,
        ),
      };

    case A.EGG_CLICK: {
      if (state.bsod) {
        return state;
      }
      const eggClicks = state.eggClicks + 1;
      if (eggClicks < EGG_BSOD_AT) {
        return { ...state, eggClicks };
      }
      return {
        ...state,
        eggClicks,
        bsod: true,
        popupEpoch: state.popupEpoch + 1,
        worldTimeOpen: false,
        startOpen: false,
        focusTick: nextTick(state, 'bsod', null),
      };
    }

    case A.BSOD_DISMISS:
      return dismissBsod(state);

    case A.TOGGLE_WORLD_TIME:
      return { ...state, worldTimeOpen: !state.worldTimeOpen, startOpen: false };

    case A.CLOSE_WORLD_TIME:
      return state.worldTimeOpen ? { ...state, worldTimeOpen: false } : state;

    case A.TOGGLE_START:
      return { ...state, startOpen: !state.startOpen, worldTimeOpen: false };

    case A.CLOSE_START:
      return state.startOpen ? { ...state, startOpen: false } : state;

    case A.ESCAPE:
      if (state.bsod) {
        return dismissBsod(state);
      }
      if (state.worldTimeOpen || state.startOpen) {
        return { ...state, worldTimeOpen: false, startOpen: false };
      }
      return closeTop(state);

    default:
      return state;
  }
};
