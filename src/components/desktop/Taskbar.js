import React from 'react';
import styled from 'styled-components';
import { fieldThin, focusRing, media } from '@styles';
import { useDesktop } from './DesktopProvider';
import { WINDOWS, DESKTOP_ICONS, GAME_LIST } from './registry';
import { ICONS } from './icons';
import { frontZ } from './state';
import StartMenu from './StartMenu';
import Clock from './Clock';

// The icon for a window: a desktop icon's art, or a game's art for a game window.
const iconFor = id =>
  ICONS[(DESKTOP_ICONS.find(i => i.target === id) || GAME_LIST.find(g => g.id === id) || {}).icon];

// Fixed to the bottom edge, one glass strip on every screen size. The light line along the top
// and the glass sheen are its only edge highlights. Phones use the same padding.
const Bar = styled.nav`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-taskbar);
  display: flex;
  align-items: center;
  gap: 6px;
  height: var(--taskbar-total);
  padding: 0 6px env(safe-area-inset-bottom, 0px);
  background: var(--bar-glass);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  backdrop-filter: blur(12px) saturate(160%);
  border-top: 1px solid var(--bar-edge);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 -2px 12px rgba(0, 30, 70, 0.25);
  color: var(--text-on-bar);
`;

// One button per open window. Hidden on phones, where only one window is open at a time.
const Tasks = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;

  ${media.phone} {
    visibility: hidden;
  }
`;

// A glass pill per window. The window in front is the brighter, aqua-lit one.
const TaskButton = styled.button.attrs({ type: 'button' })`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 1 168px;
  min-width: 0;
  height: 32px;
  padding: 0 10px 0 6px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: var(--radius-ctl);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22) 0,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0) 51%,
    rgba(255, 255, 255, 0.06) 100%
  );
  box-shadow: inset 0 0 0 1px rgba(0, 20, 50, 0.35);
  color: var(--text-on-bar);
  font: 400 14px/1 var(--main-font);
  text-align: left;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  cursor: default;
  transition: background 160ms cubic-bezier(0.16, 0.84, 0.3, 1),
    border-color 160ms cubic-bezier(0.16, 0.84, 0.3, 1),
    box-shadow 160ms cubic-bezier(0.16, 0.84, 0.3, 1);
  ${focusRing};

  &:focus-visible {
    outline-color: #fff;
  }

  &:hover {
    border-color: rgba(200, 235, 255, 0.6);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.44) 0,
      rgba(255, 255, 255, 0.16) 50%,
      rgba(255, 255, 255, 0) 51%,
      rgba(255, 255, 255, 0.12) 100%
    );
    box-shadow: inset 0 0 0 1px rgba(0, 20, 50, 0.35), 0 0 12px rgba(140, 210, 255, 0.8);
  }

  /* the window in front: a lit aqua pane with a glow along the bottom */
  &[aria-pressed='true'] {
    border-color: rgba(255, 255, 255, 0.6);
    background: linear-gradient(
      180deg,
      rgba(200, 235, 255, 0.55) 0,
      rgba(120, 190, 240, 0.35) 50%,
      rgba(60, 140, 210, 0.35) 51%,
      rgba(120, 200, 255, 0.45) 100%
    );
    box-shadow: inset 0 0 0 1px rgba(0, 20, 50, 0.35),
      inset 0 -6px 10px -4px rgba(150, 230, 255, 0.8);
  }
`;

// The window icon, then the title. The title truncates; the icon never shrinks.
const TaskIcon = styled.span`
  flex: none;
  display: inline-flex;
`;

const TaskTitle = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// The glass tray at the right end, holding the clock.
const Tray = styled.div`
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 4px;
  ${fieldThin};
`;

const Taskbar = () => {
  const { state, actions } = useDesktop();
  const front = frontZ(state);
  const open = WINDOWS.filter(w => state.windows[w.id].open).sort(
    (a, b) => state.windows[a.id].order - state.windows[b.id].order,
  );

  return (
    <Bar aria-label="Taskbar" data-taskbar>
      <StartMenu />
      <Tasks data-tasks>
        {open.map(w => {
          const Art = iconFor(w.id);
          return (
            <TaskButton
              key={w.id}
              data-task={w.id}
              aria-pressed={state.windows[w.id].z === front}
              onClick={() => actions.focusWindow(w.id)}>
              <TaskIcon>{Art ? <Art size={20} /> : null}</TaskIcon>
              <TaskTitle>{w.title}</TaskTitle>
            </TaskButton>
          );
        })}
      </Tasks>
      <Tray>
        <Clock />
      </Tray>
    </Bar>
  );
};

export default Taskbar;
