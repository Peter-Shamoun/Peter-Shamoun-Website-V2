import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDesktop, useIsoLayoutEffect } from './DesktopProvider';
import { TitleBar, useDrag, getBounds } from './Window';
import { BevelButton, BevelLink, ButtonRow } from './ui';
import { ART } from './icons';
import { POPUPS } from './popupData';

const clamp = (value, lo, hi) => Math.max(lo, Math.min(value, hi));

const Copy = styled.p`
  margin: 0 0 1rem;
`;

const Actions = styled(ButtonRow)`
  justify-content: center;
  margin-top: 0.6rem;
`;

// A promo popup: window chrome, a small picture, one sentence or two, one bevelled action.
// popup is a state entry { key, dataId, x, y, w, z }. On phones the CSS sets the width and
// the z-index (.popup in GlobalStyle), so the inline values are left out there, and dragging
// is off.
const Popup = ({ popup }) => {
  const { state, actions } = useDesktop();
  const { viewport } = state;
  const data = POPUPS.find(p => p.id === popup.dataId);
  const ref = useRef(null);
  const origin = useRef(null);
  const titleId = `popup-${popup.key}-title`;

  // After a resize, pull the popup back inside the viewport (never on phones: they are pinned).
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || !viewport.ready || viewport.phone) {
      return;
    }
    const bounds = getBounds();
    const { width, height } = el.getBoundingClientRect();
    const x = Math.round(clamp(popup.x, bounds.left, bounds.right - width));
    const y = Math.round(clamp(popup.y, bounds.top, bounds.bottom - height));
    if (x !== popup.x || y !== popup.y) {
      actions.movePopup(popup.key, x, y);
    }
  }, [viewport.w, viewport.h, viewport.ready, viewport.phone]);

  // When a popup that holds focus goes away (its close button, Escape), focus would fall to
  // <body>. Hand it to the desktop instead. A layout effect's cleanup runs while the popup is
  // still in the document, so the check can see where focus is.
  useIsoLayoutEffect(
    () => () => {
      const el = ref.current;
      if (el && el.contains(document.activeElement)) {
        const desktop = document.getElementById('content');
        if (desktop) {
          desktop.focus({ preventScroll: true });
        }
      }
    },
    [],
  );

  const dragProps = useDrag({
    enabled: !viewport.phone,
    onStart: () => {
      const el = ref.current;
      if (!el) {
        origin.current = null;
        return;
      }
      const rect = el.getBoundingClientRect();
      origin.current = { x: popup.x, y: popup.y, width: rect.width, height: rect.height };
    },
    onMove: (dx, dy) => {
      const o = origin.current;
      if (!o) {
        return;
      }
      const bounds = getBounds();
      const x = clamp(o.x + dx, bounds.left, bounds.right - o.width);
      const y = clamp(o.y + dy, bounds.top, bounds.bottom - o.height);
      actions.movePopup(popup.key, Math.round(x), Math.round(y));
    },
    onEnd: () => {
      origin.current = null;
    },
  });

  if (!data) {
    return null;
  }

  const style = { left: popup.x, top: popup.y };
  if (!viewport.phone) {
    style.width = popup.w;
    style.zIndex = popup.z;
  }

  // On phones the popup sits behind the open window, where nobody can see it. It is made inert
  // there, so keyboard focus and screen readers skip it until the window is closed.
  const covered = viewport.phone && Object.values(state.windows).some(w => w.open);
  const hiddenProps = covered ? { inert: '', 'aria-hidden': true } : {};

  const Art = ART[data.art];

  return (
    <section
      ref={ref}
      className="popup"
      role="dialog"
      aria-labelledby={titleId}
      data-popup={data.id}
      data-popup-key={popup.key}
      style={style}
      {...hiddenProps}
      onPointerDown={() => actions.raisePopup(popup.key)}>
      <header className="win__chrome">
        <TitleBar
          title={data.title}
          titleId={titleId}
          closeLabel={`Close ${data.title}`}
          onClose={() => actions.closePopup(popup.key)}
          dragProps={dragProps}
        />
      </header>
      <div className="popup__body">
        {Art ? <Art className="popup__art" /> : null}
        <Copy>{data.body}</Copy>
        <Actions>
          {data.href ? (
            <BevelLink href={data.href}>{data.cta}</BevelLink>
          ) : (
            <BevelButton
              onClick={e => actions.openWindow(data.opensWindow, { from: e.currentTarget })}>
              {data.cta}
            </BevelButton>
          )}
        </Actions>
      </div>
    </section>
  );
};

Popup.propTypes = {
  popup: PropTypes.shape({
    key: PropTypes.string.isRequired,
    dataId: PropTypes.string.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    z: PropTypes.number,
  }).isRequired,
};

export default Popup;
