import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { visuallyHidden } from '@styles';
import { useDesktop } from './DesktopProvider';
import { getBounds } from './Window';
import { MAX_POPUPS } from './state';
import { EGG_POOL, POPUPS } from './popupData';
import { PHONE_W, placePopup, spawnDelays } from './placement';
import Popup from './Popup';

const popupById = id => POPUPS.find(p => p.id === id);

// Read out by screen readers when a popup appears. Popups never take focus.
const Announcer = styled.div`
  ${visuallyHidden};
`;

const rectOf = el => {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
};

// The box around the desktop icons. A popup never covers them, so free_ram.exe stays in reach.
const iconsRect = () => {
  const el = document.querySelector('[data-desktop-icons]');
  return el && el.getClientRects().length > 0 ? rectOf(el) : null;
};

// Rectangles of every open window.
const windowExclusions = () => {
  const rects = [];
  document.querySelectorAll('[data-window]').forEach(el => {
    if (!el.hidden) {
      rects.push(rectOf(el));
    }
  });
  return rects;
};

// A popup already on screen: its measured size when it is rendered, otherwise an estimate.
const takenRect = (popup, phone) => {
  const el = document.querySelector(`[data-popup-key="${popup.key}"]`);
  const w = phone ? PHONE_W : popup.w;
  if (el) {
    const r = el.getBoundingClientRect();
    return { x: popup.x, y: popup.y, w, h: r.height };
  }
  return { x: popup.x, y: popup.y, w, h: Math.round(w * 0.95) };
};

/**
 * Runs `count` attempts in order. Attempt i+1 runs gaps[i] ms after attempt i; the first runs
 * at once. An attempt that returns true stops the chain. With `instant`, every attempt runs
 * synchronously (reduced motion).
 */
const runChain = (count, gaps, attempt, schedule, instant) => {
  const step = i => {
    if (i >= count) {
      return;
    }
    if (attempt(i) === true) {
      return;
    }
    if (i + 1 < count) {
      const gap = gaps[Math.min(i, gaps.length - 1)] || 0;
      if (instant) {
        step(i + 1);
      } else {
        schedule(() => step(i + 1), gap);
      }
    }
  };
  step(0);
};

// Owns the popups that the free_ram.exe icon starts. Nothing here runs by itself. Every timer
// is cancelled when popupEpoch changes (reset, blue screen) or on unmount.
const PopupSpawner = () => {
  const { state, actions } = useDesktop();

  // The popups as the reducer has them, plus any spawned in this same batch.
  const onScreen = useRef(state.popups);
  onScreen.current = state.popups;

  // The newest popup is announced politely, because popups appear without taking focus.
  // A phone popup sits behind the open window, so it is not announced while it is covered.
  const [announcement, setAnnouncement] = useState('');
  const announced = useRef(0);
  useEffect(() => {
    const count = state.popups.length;
    if (count > announced.current) {
      const data = popupById(state.popups[count - 1].dataId);
      const covered = state.viewport.phone && Object.values(state.windows).some(w => w.open);
      if (data && !covered) {
        setAnnouncement(`Popup: ${data.title}. ${data.body}`);
      }
    } else if (count === 0) {
      setAnnouncement('');
    }
    announced.current = count;
    // Only a change in the number of popups drives this.
  }, [state.popups.length]);

  const timers = useRef([]);
  const seq = useRef(0);
  const eggSeen = useRef(state.eggClicks);

  const schedule = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const cancelTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Place and spawn one popup. Returns true when it was placed. A popup never covers the
  // desktop icons. It looks for a spot clear of the windows and the other popups; failing that
  // one up to half under a window, then anywhere over the windows, then on top of other popups
  // too (the visitor asked for them; the cap of 12 still holds).
  const trySpawn = (dataId, phone) => {
    const data = popupById(dataId);
    const current = onScreen.current;
    if (!data || current.length >= MAX_POPUPS || current.some(p => p.dataId === dataId)) {
      return false;
    }
    const w = phone ? PHONE_W : data.w;
    const icons = iconsRect();
    const viewportInfo = {
      w: window.innerWidth,
      h: getBounds().bottom,
      phone,
      ceiling: phone && icons ? icons.y + icons.h : 0,
    };
    const fixed = icons ? [icons] : [];
    const taken = current.map(p => takenRect(p, phone));
    const windows = windowExclusions();
    const place = (exclude, soft, others = taken) =>
      placePopup({
        w,
        h: (phone ? data.hPhone : data.h) || Math.round(w * (phone ? 1.35 : 0.95)),
        viewport: viewportInfo,
        exclude,
        taken: others,
        soft,
        rand: Math.random,
      });
    const spot =
      place([...fixed, ...windows], []) ||
      place(fixed, windows) ||
      place(fixed, []) ||
      place(fixed, [], []);
    if (!spot) {
      return false;
    }
    seq.current += 1;
    const key = `${dataId}-${seq.current}`;
    onScreen.current = [...onScreen.current, { key, dataId, x: spot.x, y: spot.y, w }];
    actions.spawnPopup({ key, dataId, x: spot.x, y: spot.y, w });
    return true;
  };

  // Any change of popupEpoch (reset, blue screen dismissed) cancels the running chains.
  useEffect(() => {
    cancelTimers();
  }, [state.popupEpoch]);

  useEffect(() => cancelTimers, []);

  // Egg chain: each click (1 and 2) adds up to three popups from the pool. Click 3 opens the
  // blue screen, which bumps popupEpoch and so cancels the chain. Nothing spawns while the
  // blue screen is up.
  useEffect(() => {
    const prev = eggSeen.current;
    eggSeen.current = state.eggClicks;
    if (state.eggClicks <= prev || state.bsod) {
      return;
    }
    const { phone } = state.viewport;
    const pool = EGG_POOL.filter(id => !onScreen.current.some(p => p.dataId === id));
    let spawned = 0;
    runChain(
      pool.length,
      spawnDelays(3, 120, 30),
      i => {
        if (trySpawn(pool[i], phone)) {
          spawned += 1;
        }
        return spawned >= 3;
      },
      schedule,
      state.reducedMotion,
    );
    // trySpawn and schedule read refs and stable actions, so only the click count and the
    // blue screen state drive this effect.
  }, [state.eggClicks, state.bsod]);

  return (
    <>
      {state.popups.map(popup => (
        <Popup key={popup.key} popup={popup} />
      ))}
      <Announcer role="status" aria-live="polite" data-popup-status>
        {announcement}
      </Announcer>
    </>
  );
};

export default PopupSpawner;
