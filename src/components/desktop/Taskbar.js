import React from 'react';
import styled from 'styled-components';
import { bevel, bevelPressed, focusRect, media, sunkenThin } from '@styles';
import { useDesktop } from './DesktopProvider';
import { WINDOWS } from './registry';
import { frontZ } from './state';
import StartMenu from './StartMenu';
import Clock from './Clock';

// Fixed to the bottom edge. The two light lines along the top are its only bevel.
const Bar = styled.nav`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-taskbar);
  display: flex;
  align-items: stretch;
  gap: 4px;
  height: var(--taskbar-total);
  padding: 4px 2px calc(2px + env(safe-area-inset-bottom, 0px));
  background: var(--chrome);
  color: var(--text);
  box-shadow: inset 0 1px var(--bevel-light), inset 0 2px var(--bevel-hi);

  /* Phones: 40px buttons in the 44px bar. Their touch area is the full height (see ::after). */
  ${media.phone} {
    padding: 3px 2px calc(1px + env(safe-area-inset-bottom, 0px));
  }
`;

// One button per open window. Hidden on phones, where only one window is open at a time.
const Tasks = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 3px;

  ${media.phone} {
    visibility: hidden;
  }
`;

const TaskButton = styled.button.attrs({ type: 'button' })`
  flex: 0 1 160px;
  min-width: 0;
  padding: 0 8px;
  background: var(--chrome);
  color: var(--text);
  font: 16px/1 var(--main-font);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  ${bevel};
  ${focusRect};

  &:active,
  &[aria-pressed='true'] {
    ${bevelPressed};
  }

  /* the window in front: a pressed button on a lighter face */
  &[aria-pressed='true'] {
    background: var(--bevel-light);
  }
`;

const Tray = styled.div`
  flex: none;
  padding: 1px;
  ${sunkenThin};
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
      <Tray>
        <Clock />
      </Tray>
    </Bar>
  );
};

export default Taskbar;
