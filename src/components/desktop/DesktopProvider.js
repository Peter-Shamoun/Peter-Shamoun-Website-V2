import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { A, initialState, reducer } from './state';

const DesktopContext = createContext(null);

// useLayoutEffect warns during server rendering; fall back to useEffect there.
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Elements that opened something, so focus can go back to them when it closes.
const openers = new Map();
const EGG_KEY = '@egg';

export const getOpener = id => openers.get(id) || null;
export const getEggOpener = () => openers.get(EGG_KEY) || null;

const rememberOpener = (id, el) => {
  if (el && typeof el.focus === 'function') {
    openers.set(id, el);
  }
};

const makeActions = dispatch => ({
  // `from` is the element to return focus to when the window closes
  openWindow: (id, { from, focus = true } = {}) => {
    rememberOpener(id, from);
    dispatch({ type: A.OPEN, id, focus });
  },
  closeWindow: id => dispatch({ type: A.CLOSE, id }),
  toggleWindow: (id, { from } = {}) => {
    rememberOpener(id, from);
    dispatch({ type: A.TOGGLE, id, focus: true });
  },
  raiseWindow: id => dispatch({ type: A.RAISE, id }),
  moveWindow: (id, dx, dy) => dispatch({ type: A.MOVE, id, dx, dy }),
  reset: () => dispatch({ type: A.RESET }),
  spawnPopup: popup => dispatch({ type: A.SPAWN, popup }),
  closePopup: key => dispatch({ type: A.CLOSE_POPUP, key }),
  raisePopup: key => dispatch({ type: A.RAISE_POPUP, key }),
  movePopup: (key, x, y) => dispatch({ type: A.MOVE_POPUP, key, x, y }),
  eggClick: fromEl => {
    rememberOpener(EGG_KEY, fromEl);
    dispatch({ type: A.EGG_CLICK });
  },
  dismissBsod: () => dispatch({ type: A.BSOD_DISMISS }),
  bootDone: () => dispatch({ type: A.BOOT_DONE }),
  toggleWorldTime: () => dispatch({ type: A.TOGGLE_WORLD_TIME }),
  closeWorldTime: () => dispatch({ type: A.CLOSE_WORLD_TIME }),
  toggleMenu: id => dispatch({ type: A.TOGGLE_MENU, id }),
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
        dispatch({ type: A.ESCAPE });
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

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
