import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { visuallyHidden } from '@styles';
import { useDesktop } from './DesktopProvider';
import { getWindow } from './registry';
import { getBounds } from './Window';
import { MAX_POPUPS } from './state';
import { AUTO, POPUPS } from './popupData';
import { PHONE_W, placePopup, spawnDelays, windowRect } from './placement';
import Popup from './Popup';

// Egg pool order (BUILD_PLAN 6 WP4): these three first, then the automatic ones.
const EGG_POOL = ['linkedin', 'mail', 'ram'];
const ABOUT_SLOT = '@about';
const PHONE_GAP = 500;

const popupById = id => POPUPS.find(p => p.id === id);

// Read out by screen readers when a popup appears. Popups never take focus.
const Announcer = styled.div`
  ${visuallyHidden};
`;

const viewportClass = ({ phone, tablet }) => {
  if (phone) {
    return 'phone';
  }
  return tablet ? 'tablet' : 'desktop';
};

const rectOf = el => {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
};

// Rectangles a popup never covers: the wordmark and the free_ram.exe icon.
const fixedExclusions = () => {
  const rects = [];
  ['[data-wordmark]', '[data-egg]'].forEach(selector => {
    const el = document.querySelector(selector);
    if (el && el.getClientRects().length > 0) {
      rects.push(rectOf(el));
    }
  });
  return rects;
};

// Top edge of the desktop icons (the upper row on phones), or 0 when none is on screen.
const iconRowTop = () => {
  let top = 0;
  document.querySelectorAll('[data-icon-for]').forEach(el => {
    if (el.getClientRects().length > 0) {
      const y = el.getBoundingClientRect().top;
      top = top ? Math.min(top, y) : y;
    }
  });
  return top;
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

// Owns the automatic popups, the About window that follows them, and the chain that the
// free_ram.exe icon starts. Every timer is cancelled when popupEpoch changes (reset, blue
// screen dismissed) or on unmount.
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
  const started = useRef(false);
  const eggSeen = useRef(state.eggClicks);

  const schedule = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const cancelTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Place and spawn one popup. Returns true when it was placed. A popup never covers the
  // wordmark, the egg icon, the icon row or another popup. `mode` says what happens when
  // there is no spot clear of the windows:
  //   'strict'  the popup is skipped
  //   'peek'    it may sit up to half under a window (used for popups that spawn before
  //             About opens, so About ends up in front of them)
  //   'over'    as 'peek', and failing that anywhere over the windows (tablets, where About
  //             opens last and in front)
  //   'pile'    as 'over', and failing that on top of other popups too (the egg, which the
  //             visitor asked for; the cap of 12 still holds)
  const trySpawn = (dataId, phone, mode = 'strict') => {
    const data = popupById(dataId);
    const current = onScreen.current;
    if (!data || current.length >= MAX_POPUPS || current.some(p => p.dataId === dataId)) {
      return false;
    }
    const w = phone ? PHONE_W : data.w;
    const viewportInfo = {
      w: window.innerWidth,
      h: window.innerHeight,
      top: getBounds().top,
      phone,
      floor: phone ? iconRowTop() : 0,
    };
    const fixed = fixedExclusions();
    const taken = current.map(p => takenRect(p, phone));
    const windows = [...windowExclusions(), windowRect(getWindow('about'), viewportInfo)];
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
    let spot = place([...fixed, ...windows], []);
    if (!spot && mode !== 'strict') {
      spot = place(fixed, windows);
    }
    if (!spot && (mode === 'over' || mode === 'pile')) {
      spot = place(fixed, []);
    }
    if (!spot && mode === 'pile') {
      spot = place(fixed, [], []);
    }
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

  // Start-up queue, once, after the boot overlay has finished and the viewport is measured.
  useEffect(() => {
    if (started.current || !state.bootDone || !state.viewport.ready) {
      return;
    }
    started.current = true;

    if (state.reducedMotion) {
      // Reduced motion: no popups and no delays. About opens and nothing else.
      actions.openWindow('about', { focus: false });
      return;
    }

    const cls = viewportClass(state.viewport);
    const auto = AUTO[cls];
    let slots;
    let gaps;
    if (cls === 'phone') {
      slots = [...auto, ABOUT_SLOT];
      gaps = [PHONE_GAP];
    } else if (cls === 'tablet') {
      // A tablet has no free space beside About, so the popups go in first and About opens
      // in front of them, as on phones. They show at its edges and when it is moved or closed.
      slots = [...auto, ABOUT_SLOT];
      gaps = spawnDelays(slots.length, 180, 60);
    } else {
      // About goes in before the last popup: p1, p2, p3, p4, @about, p5 on desktop.
      const last = auto.slice(-1);
      slots = [...auto.slice(0, -1), ABOUT_SLOT, ...last];
      gaps = spawnDelays(slots.length, 180, 60);
    }

    runChain(
      slots.length,
      gaps,
      i => {
        const slot = slots[i];
        if (slot === ABOUT_SLOT) {
          actions.openWindow('about', { focus: false });
        } else {
          let mode = 'over';
          if (cls === 'desktop') {
            // Popups before About may tuck under it; the one after it must be clear of it.
            mode = i < slots.indexOf(ABOUT_SLOT) ? 'peek' : 'strict';
          }
          trySpawn(slot, state.viewport.phone, mode);
        }
        return false;
      },
      schedule,
      false,
    );
    // trySpawn and schedule read refs and stable actions; the effect runs once per start.
  }, [state.bootDone, state.viewport.ready, state.reducedMotion]);

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
    const pool = [...EGG_POOL, ...AUTO.desktop].filter(
      (id, index, all) => all.indexOf(id) === index && !onScreen.current.some(p => p.dataId === id),
    );
    let spawned = 0;
    runChain(
      pool.length,
      spawnDelays(3, 120, 30),
      i => {
        if (trySpawn(pool[i], phone, 'pile')) {
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
