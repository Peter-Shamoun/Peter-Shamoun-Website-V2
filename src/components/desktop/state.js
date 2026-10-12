import { WINDOWS } from './registry';

// Action types. Components never dispatch these directly; they call actions.* from useDesktop().
export const A = {
  BOOT_DONE: 'BOOT_DONE',
  VIEWPORT: 'VIEWPORT',
  REDUCED_MOTION: 'REDUCED_MOTION',
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  TOGGLE: 'TOGGLE',
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
  TOGGLE_MENU: 'TOGGLE_MENU',
  ESCAPE: 'ESCAPE',
};

export const MAX_POPUPS = 12;
export const EGG_BSOD_AT = 3;
export const PHONE_MAX = 576;
export const TABLET_MAX = 1024;

const makeWindows = () =>
  WINDOWS.reduce((acc, w) => {
    acc[w.id] = { open: false, z: 0, dx: 0, dy: 0 };
    return acc;
  }, {});

export const initialState = {
  bootDone: false,
  reducedMotion: false, // set after mount from matchMedia
  viewport: { w: 0, h: 0, phone: false, tablet: false, ready: false },
  windows: makeWindows(), // one entry per registry id: { open, z, dx, dy }
  topZ: 1000,
  popups: [], // { key, dataId, x, y, w, z }
  popupEpoch: 0, // bumped by RESET, the blue screen and BSOD_DISMISS; the spawner cancels timers
  eggClicks: 0, // never reset
  bsod: false,
  worldTimeOpen: false,
  menuOpenFor: null, // window id whose phone menu is open
  wordmarkRun: 0, // bumped by BOOT_DONE and RESET; the wordmark replays on change
  focusTick: null, // { kind: 'window' | 'bsod', id, n } - a request to move focus
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
  windows[id] = { ...windows[id], open: true, z: topZ };
  return {
    ...state,
    windows,
    topZ,
    worldTimeOpen: false,
    menuOpenFor: null,
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
    menuOpenFor: state.menuOpenFor === id ? null : state.menuOpenFor,
  };
};

const closePopup = (state, key) => {
  const popups = state.popups.filter(p => p.key !== key);
  return popups.length === state.popups.length ? state : { ...state, popups };
};

const dismissBsod = state =>
  state.bsod ? { ...state, bsod: false, popups: [], popupEpoch: state.popupEpoch + 1 } : state;

// Escape closes whichever open window or popup is in front.
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
    case A.BOOT_DONE:
      return state.bootDone
        ? state
        : { ...state, bootDone: true, wordmarkRun: state.wordmarkRun + 1 };

    case A.VIEWPORT: {
      const { w, h } = action;
      const phone = w <= PHONE_MAX;
      const tablet = w > PHONE_MAX && w <= TABLET_MAX;
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
      return {
        ...state,
        windows,
        viewport: { w, h, phone, tablet, ready: true },
        menuOpenFor: null,
      };
    }

    case A.REDUCED_MOTION:
      return state.reducedMotion === !!action.value
        ? state
        : { ...state, reducedMotion: !!action.value };

    case A.OPEN:
      return openWindow(state, action.id, action.focus);

    case A.CLOSE:
      return closeWindow(state, action.id);

    case A.TOGGLE: {
      const win = state.windows[action.id];
      if (!win) {
        return state;
      }
      return win.open ? closeWindow(state, action.id) : openWindow(state, action.id, action.focus);
    }

    case A.RAISE: {
      const win = state.windows[action.id];
      if (!win || !win.open || win.z === state.topZ) {
        return state;
      }
      const topZ = state.topZ + 1;
      return { ...state, topZ, windows: { ...state.windows, [action.id]: { ...win, z: topZ } } };
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
        wordmarkRun: state.wordmarkRun + 1,
        worldTimeOpen: false,
        menuOpenFor: null,
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
        menuOpenFor: null,
        focusTick: nextTick(state, 'bsod', null),
      };
    }

    case A.BSOD_DISMISS:
      return dismissBsod(state);

    case A.TOGGLE_WORLD_TIME:
      return { ...state, worldTimeOpen: !state.worldTimeOpen, menuOpenFor: null };

    case A.CLOSE_WORLD_TIME:
      return state.worldTimeOpen ? { ...state, worldTimeOpen: false } : state;

    case A.TOGGLE_MENU:
      return {
        ...state,
        menuOpenFor: state.menuOpenFor === action.id ? null : action.id,
        worldTimeOpen: false,
      };

    case A.ESCAPE:
      if (state.bsod) {
        return dismissBsod(state);
      }
      if (state.worldTimeOpen || state.menuOpenFor) {
        return { ...state, worldTimeOpen: false, menuOpenFor: null };
      }
      return closeTop(state);

    default:
      return state;
  }
};
