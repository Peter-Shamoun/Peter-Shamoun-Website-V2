import React from 'react';
import styled from 'styled-components';
import { media } from '@styles';
import { useDesktop } from './DesktopProvider';
import { WINDOWS, DESKTOP_ICONS } from './registry';
import { frontZ } from './state';
import StartMenu from './StartMenu';
import Clock from './Clock';

// The Aero Deck: a chrome-and-candy media player docked at the bottom. The orb opens the
// playlist (every section), the LCD shows the pane in front, the open panes as tracks and the
// time, and the transport buttons step through the sections in playlist order.

const SECTIONS = DESKTOP_ICONS.filter(i => i.kind === 'window').map(i => i.target);

// The candy body sits inside a chrome bezel (the border box carries the chrome gradient).
const Bar = styled.nav`
  position: fixed;
  left: 50%;
  bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  z-index: var(--z-taskbar);
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(860px, 100vw - 32px);
  height: calc(var(--taskbar-h) - 16px);
  padding: 0 14px 0 6px;
  transform: translateX(-50%);
  border: 3px solid transparent;
  border-radius: 999px;
  background: var(--candy) padding-box, var(--chrome) border-box;
  box-shadow: 0 18px 40px rgba(0, 30, 80, 0.5), 0 4px 10px rgba(0, 30, 80, 0.35),
    inset 0 -8px 18px rgba(0, 60, 140, 0.45);
  color: var(--text-on-bar);

  /* the gloss cap across the top half of the plastic */
  &::before {
    content: '';
    position: absolute;
    left: 28px;
    right: 28px;
    top: 2px;
    height: 46%;
    border-radius: 999px 999px 40% 40% / 999px 999px 18px 18px;
    background: var(--candy-cap);
    opacity: 0.75;
    pointer-events: none;
  }

  ${media.phone} {
    bottom: calc(8px + env(safe-area-inset-bottom, 0px));
    width: calc(100vw - 16px);
    gap: 6px;
    padding: 0 6px 0 4px;
  }
`;

// The LCD: dark blue-green glass sunk into the body, with faint scanlines.
const Lcd = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 58px;
  padding: 0 6px 0 16px;
  border-radius: 16px;
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0 1px, transparent 1px 3px),
    radial-gradient(ellipse at 30% 0%, rgba(120, 220, 255, 0.25), transparent 60%),
    linear-gradient(180deg, #0a4a6e 0%, var(--lcd-glass) 100%);
  border: 1px solid rgba(0, 20, 50, 0.7);
  box-shadow: inset 0 3px 8px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(255, 255, 255, 0.55);

  /* the glass over the LCD catches the light along its top edge */
  &::after {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    top: 2px;
    height: 40%;
    border-radius: 14px 14px 50% 50% / 14px 14px 10px 10px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0));
    pointer-events: none;
  }

  ${media.phone} {
    height: 48px;
    padding: 0 4px 0 12px;
    border-radius: 14px;
  }
`;

const Track = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

// The name of the pane in front, lit in LCD cyan.
const NowShowing = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font: 900 19px/1.1 var(--display-font);
  letter-spacing: 0.02em;
  color: var(--lcd-ink);
  text-shadow: 0 0 8px rgba(120, 230, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg {
    flex: none;
    filter: drop-shadow(0 0 4px rgba(120, 230, 255, 0.9));
  }

  ${media.phone} {
    gap: 5px;
    font-size: 14px;
    letter-spacing: 0;
  }
`;

// The open panes as LCD tracks. Hidden on phones, where only one pane is open at a time.
const Tasks = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  overflow: hidden;

  &:empty {
    display: none;
  }

  ${media.phone} {
    display: none;
  }
`;

const TaskButton = styled.button.attrs({ type: 'button' })`
  flex: 0 1 auto;
  min-width: 0;
  height: 20px;
  padding: 0 8px;
  border: 1px solid rgba(184, 244, 255, 0.35);
  border-radius: 6px;
  background: rgba(184, 244, 255, 0.06);
  color: rgba(184, 244, 255, 0.75);
  font: 800 12px/1 var(--display-font);
  letter-spacing: 0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: background var(--dur-hover) var(--ease-out), color var(--dur-hover) var(--ease-out);

  &:hover {
    background: rgba(184, 244, 255, 0.18);
    color: var(--lcd-ink);
  }

  /* the pane in front: a lit lime track */
  &[aria-pressed='true'] {
    border-color: var(--lime);
    background: rgba(184, 255, 46, 0.18);
    color: var(--lime);
    text-shadow: 0 0 6px rgba(184, 255, 46, 0.8);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-on-scene);
    outline-offset: 1px;
  }
`;

// Prev and next: round chrome beads with an aqua glyph.
const Transport = styled.div`
  flex: none;
  display: flex;
  gap: 8px;

  ${media.phone} {
    gap: 4px;
  }
`;

const Bead = styled.button.attrs({ type: 'button' })`
  position: relative;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--chrome-edge);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 30%, #ffffff 0, #e4f1fb 40%, #9fb9cf 75%, #6f8aa6 100%);
  box-shadow: inset 0 -4px 8px rgba(30, 60, 100, 0.35), inset 0 2px 2px #ffffff,
    0 3px 6px rgba(0, 30, 70, 0.4);
  color: var(--lagoon);
  cursor: pointer;
  transition: transform var(--dur-hover) var(--ease-spring),
    box-shadow var(--dur-hover) var(--ease-out);

  svg {
    filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.9));
  }

  &:hover {
    transform: scale(1.06);
    box-shadow: inset 0 -4px 8px rgba(30, 60, 100, 0.35), inset 0 2px 2px #ffffff,
      0 0 14px 2px rgba(184, 255, 46, 0.7);
  }

  &:active {
    transform: scale(0.94);
    box-shadow: inset 0 3px 8px rgba(30, 60, 100, 0.45), 0 1px 2px rgba(0, 30, 70, 0.4);
  }

  &:focus-visible {
    outline: 3px solid var(--focus-on-scene);
    outline-offset: 2px;
  }

  ${media.phone} {
    width: 44px;
    height: 44px;
  }
`;

// A speaker grille at the right end of the body; holes drawn as a dot pattern.
const Grille = styled.span`
  flex: none;
  width: 54px;
  height: 46px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 40, 90, 0.55) 0 1.6px, transparent 2.2px) 0 0 / 7px
    7px;
  -webkit-mask: radial-gradient(ellipse, #000 60%, transparent 72%);
  mask: radial-gradient(ellipse, #000 60%, transparent 72%);
  opacity: 0.8;

  @media (max-width: 760px) {
    display: none;
  }
`;

const PlayGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <path d="M3 1.5 L12.5 7 L3 12.5 Z" fill="currentColor" />
  </svg>
);

const PrevGlyph = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true" focusable="false">
    <rect x="1" y="2" width="3" height="12" rx="1.2" fill="currentColor" />
    <path d="M18 2 L18 14 L11 8 Z M11 2 L11 14 L4.5 8 Z" fill="currentColor" />
  </svg>
);

const NextGlyph = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true" focusable="false">
    <path d="M2 2 L2 14 L9 8 Z M9 2 L9 14 L15.5 8 Z" fill="currentColor" />
    <rect x="16" y="2" width="3" height="12" rx="1.2" fill="currentColor" />
  </svg>
);

const Taskbar = () => {
  const { state, actions } = useDesktop();
  const front = frontZ(state);
  const open = WINDOWS.filter(w => state.windows[w.id].open).sort(
    (a, b) => state.windows[a.id].order - state.windows[b.id].order,
  );
  const frontWin = open.find(w => state.windows[w.id].z === front);

  // Prev and next walk the playlist from the section in front (a game counts as Games), close
  // that section, and open the neighbour. Focus stays on the button so it can be pressed again.
  const step = dir => () => {
    const current = frontWin ? (SECTIONS.includes(frontWin.id) ? frontWin.id : 'games') : null;
    const at = current ? SECTIONS.indexOf(current) : dir > 0 ? -1 : 0;
    const next = SECTIONS[(at + dir + SECTIONS.length) % SECTIONS.length];
    if (frontWin && SECTIONS.includes(frontWin.id)) {
      actions.closeWindow(frontWin.id);
    }
    actions.openWindow(next, { focus: false });
  };

  return (
    <Bar aria-label="Deck" data-taskbar>
      <StartMenu />
      <Lcd>
        <Track>
          <NowShowing aria-live="polite">
            <PlayGlyph />
            {frontWin ? frontWin.title : 'Pick a bubble'}
          </NowShowing>
          <Tasks data-tasks>
            {open.map(w => (
              <TaskButton
                key={w.id}
                data-task={w.id}
                aria-pressed={state.windows[w.id].z === front}
                onClick={() => actions.focusWindow(w.id)}>
                {w.title}
              </TaskButton>
            ))}
          </Tasks>
        </Track>
        <Clock />
      </Lcd>
      <Transport>
        <Bead aria-label="Previous section" data-prev onClick={step(-1)}>
          <PrevGlyph />
        </Bead>
        <Bead aria-label="Next section" data-next onClick={step(1)}>
          <NextGlyph />
        </Bead>
      </Transport>
      <Grille aria-hidden="true" />
    </Bar>
  );
};

export default Taskbar;
