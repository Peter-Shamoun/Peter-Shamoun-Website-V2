import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDesktop, useIsoLayoutEffect, getOpener } from './DesktopProvider';
import { getWindow } from './registry';
import { frontZ } from './state';
import { GlyphClose } from './icons';

const clamp = (value, lo, hi) => Math.max(lo, Math.min(value, hi));

/**
 * The rectangle things may be dragged within: the viewport above the taskbar.
 * Browser only.
 */
export const getBounds = () => {
  const taskbar = document.querySelector('[data-taskbar]');
  const bottom = taskbar ? taskbar.getBoundingClientRect().top : window.innerHeight;
  return { left: 0, top: 0, right: window.innerWidth, bottom };
};

const canTakeFocus = el => !!el && document.contains(el) && el.getClientRects().length > 0;

/**
 * Pointer-event dragging for a handle element.
 *   onStart(event)        the press that starts a drag (take a snapshot of the origin here)
 *   onMove(dx, dy, event) whole-pixel distance from the press point
 *   onEnd(event)          release or cancel
 * Presses on buttons, links and form fields inside the handle are ignored.
 * Returns props to spread on the handle.
 */
export const useDrag = ({ enabled = true, onStart, onMove, onEnd } = {}) => {
  const drag = useRef(null);
  const handlers = useRef({});
  handlers.current = { onStart, onMove, onEnd };

  const onPointerDown = e => {
    if (!enabled || drag.current || e.button > 0) {
      return;
    }
    if (e.target.closest && e.target.closest('button, a, input, select, textarea')) {
      return;
    }
    drag.current = { pointerId: e.pointerId, x: e.clientX, y: e.clientY };
    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
        // the pointer is already gone; dragging still works without capture
      }
    }
    if (handlers.current.onStart) {
      handlers.current.onStart(e);
    }
  };

  const onPointerMove = e => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) {
      return;
    }
    if (handlers.current.onMove) {
      handlers.current.onMove(Math.round(e.clientX - d.x), Math.round(e.clientY - d.y), e);
    }
  };

  const finish = e => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) {
      return;
    }
    drag.current = null;
    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // capture was already released
      }
    }
    if (handlers.current.onEnd) {
      handlers.current.onEnd(e);
    }
  };

  return { onPointerDown, onPointerMove, onPointerUp: finish, onPointerCancel: finish };
};

/**
 * The title strip of a window: the title at the left, close at the right.
 */
export const TitleBar = ({ title, titleId, onClose, closeLabel, dragProps }) => (
  <header className="win__titlebar" data-drag-handle {...dragProps}>
    <h2 className="win__title" id={titleId}>
      {title}
    </h2>
    <button
      type="button"
      className="win__close"
      aria-label={closeLabel || `Close ${title}`}
      onClick={onClose}>
      <GlyphClose />
    </button>
  </header>
);

TitleBar.propTypes = {
  title: PropTypes.string.isRequired,
  titleId: PropTypes.string,
  onClose: PropTypes.func,
  closeLabel: PropTypes.string,
  dragProps: PropTypes.object,
};

const Window = ({ id, flush, game, footer, children }) => {
  const { state, actions } = useDesktop();
  const def = getWindow(id);
  const win = state.windows[id];
  const { viewport } = state;
  const ref = useRef(null);
  const origin = useRef(null);
  const wasOpen = useRef(win.open);
  const [height, setHeight] = useState(0);

  // On phones and short landscape phones the CSS pins the window (transform: none).
  const isPinned = el => window.getComputedStyle(el).transform === 'none';

  // Measure the height so the CSS can keep the vertical position on screen.
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!win.open || !el) {
      return undefined;
    }
    const measure = () => setHeight(el.offsetHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [win.open, viewport.w, viewport.h]);

  // Pull a dragged window back inside the viewport after a resize or a change of size.
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!win.open || !el || !viewport.ready || !height) {
      return;
    }
    if (Math.abs(el.offsetHeight - height) > 1 || isPinned(el)) {
      return;
    }
    const measured = el.getBoundingClientRect();
    // The CSS position comes from percentages and half heights, so it can land on a fraction
    // of a pixel. --win-fx / --win-fy shift it to a whole pixel so pixel fonts stay sharp.
    const oldFx = parseFloat(el.style.getPropertyValue('--win-fx')) || 0;
    const oldFy = parseFloat(el.style.getPropertyValue('--win-fy')) || 0;
    const baseLeft = measured.left - oldFx;
    const baseTop = measured.top - oldFy;
    const fx = Math.round(baseLeft) - baseLeft;
    const fy = Math.round(baseTop) - baseTop;
    if (Math.abs(fx - oldFx) > 0.01 || Math.abs(fy - oldFy) > 0.01) {
      el.style.setProperty('--win-fx', `${fx.toFixed(3)}px`);
      el.style.setProperty('--win-fy', `${fy.toFixed(3)}px`);
    }
    const rect = {
      left: baseLeft + fx,
      top: baseTop + fy,
      width: measured.width,
      height: measured.height,
    };
    const bounds = getBounds();
    const left = clamp(rect.left, bounds.left, bounds.right - rect.width);
    const top = clamp(rect.top, bounds.top, bounds.bottom - rect.height);
    const dx = Math.round(win.dx + left - rect.left);
    const dy = Math.round(win.dy + top - rect.top);
    if (dx !== win.dx || dy !== win.dy) {
      actions.moveWindow(id, dx, dy, { auto: true });
    }
  }, [win.open, win.dx, win.dy, viewport.w, viewport.h, viewport.ready, height]);

  // Move focus into the window when it was opened by the visitor.
  const tick = state.focusTick;
  const tickN = tick && tick.kind === 'window' && tick.id === id ? tick.n : 0;
  useEffect(() => {
    if (tickN && ref.current && !ref.current.hidden) {
      ref.current.focus({ preventScroll: true });
    }
  }, [tickN]);

  // Give focus back when the window closes.
  useEffect(() => {
    if (wasOpen.current && !win.open) {
      const el = ref.current;
      const active = document.activeElement;
      if (!active || active === document.body || (el && el.contains(active))) {
        const target = [
          getOpener(id),
          document.querySelector(`[data-icon-for="${id}"]`),
          document.querySelector('[data-start-button]'),
        ].find(canTakeFocus);
        if (target) {
          target.focus({ preventScroll: true });
        }
      }
    }
    wasOpen.current = win.open;
  }, [win.open]);

  const dragProps = useDrag({
    enabled: !viewport.phone,
    onStart: () => {
      const el = ref.current;
      if (!el || isPinned(el)) {
        origin.current = null;
        return;
      }
      const rect = el.getBoundingClientRect();
      origin.current = {
        dx: win.dx,
        dy: win.dy,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    },
    onMove: (ddx, ddy) => {
      const o = origin.current;
      if (!o) {
        return;
      }
      const bounds = getBounds();
      const left = clamp(o.left + ddx, bounds.left, bounds.right - o.width);
      const top = clamp(o.top + ddy, bounds.top, bounds.bottom - o.height);
      actions.moveWindow(id, Math.round(o.dx + left - o.left), Math.round(o.dy + top - o.top));
    },
    onEnd: () => {
      origin.current = null;
    },
  });

  const classes = ['win', `win--${id}`];
  if (flush) {
    classes.push('win--flush');
  }
  if (game) {
    classes.push('win--game');
  }
  // The title bar is navy on the window in front and grey on the others.
  if (win.open && win.z === frontZ(state)) {
    classes.push('is-active');
  }

  const style = {
    '--win-w': `${def.w}px`,
    '--win-maxh': def.maxH,
    '--win-step': def.step,
    '--win-h': `${height}px`,
    '--win-dx': `${win.dx}px`,
    '--win-dy': `${win.dy}px`,
    zIndex: win.z || undefined,
  };

  const titleId = `win-${id}-title`;

  return (
    <section
      ref={ref}
      className={classes.join(' ')}
      role="dialog"
      aria-labelledby={titleId}
      data-window={id}
      tabIndex={-1}
      hidden={!win.open}
      style={style}
      onPointerDown={() => actions.raiseWindow(id)}
      onFocus={() => actions.raiseWindow(id)}>
      <TitleBar
        title={def.title}
        titleId={titleId}
        onClose={() => actions.closeWindow(id)}
        closeLabel={`Close ${def.title}`}
        dragProps={{ ...dragProps, onDoubleClick: () => actions.moveWindow(id, 0, 0) }}
      />
      <div className="win__body">
        <div className="win__area">{children}</div>
      </div>
      {footer ? <div className="win__footer">{footer}</div> : null}
    </section>
  );
};

Window.propTypes = {
  id: PropTypes.string.isRequired,
  flush: PropTypes.bool,
  game: PropTypes.bool,
  footer: PropTypes.node,
  children: PropTypes.node,
};

Window.defaultProps = {
  flush: false,
  game: false,
  footer: null,
  children: null,
};

export default Window;
