import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { focusRing, glass, media } from '@styles';
import { useMinuteNow } from '@hooks';
import { useDesktop } from './DesktopProvider';

const pad = n => String(n).padStart(2, '0');

// Local time: 24-hour, hour not padded, minutes padded (9:05, 19:13).
const formatLocal = date => `${date.getHours()}:${pad(date.getMinutes())}`;

// Rows of the world-time panel. Labels and zones are fixed by the content plan.
const ZONES = [
  { label: 'SAN', timeZone: 'America/Los_Angeles' },
  { label: 'LON', timeZone: 'Europe/London' },
  { label: 'TYO', timeZone: 'Asia/Tokyo' },
].map(zone => ({
  ...zone,
  format: new Intl.DateTimeFormat('en-US', {
    timeZone: zone.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }),
}));

// Intl puts a narrow no-break space before AM/PM; the clock's text needs a plain space.
const NARROW_SPACES = /[\u00a0\u202f]/g;

// The panel rises a few pixels into place as it opens.
const worldOpen = keyframes`
  from {
    opacity: 0;
    translate: 0 8px;
  }
`;

// A flat clock inside the glass tray. It lights up like a task button on hover.
const ClockButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  height: 30px;
  padding: 0 9px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: none;
  color: #fff;
  font: 400 14px/1 var(--main-font);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  cursor: default;
  transition: background 160ms cubic-bezier(0.16, 0.84, 0.3, 1),
    border-color 160ms cubic-bezier(0.16, 0.84, 0.3, 1);
  ${focusRing};

  &:focus-visible {
    outline-color: #fff;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.28);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.22) 0,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0) 51%,
      rgba(255, 255, 255, 0.06) 100%
    );
  }

  /* the touch area is the full height of the taskbar */
  ${media.phone} {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -4px 0 -2px;
    }
  }
`;

// Glass panel that opens upward from the tray.
const WorldTimePanel = styled.div`
  ${glass};
  position: absolute;
  right: 0;
  bottom: calc(100% + 6px);
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  border-radius: var(--radius-menu);
  /* a denser tint than the other glass, so the dark text reads over bright grass */
  background-color: rgba(220, 238, 252, 0.88);
  box-shadow: inset 0 0 0 1px var(--glass-hi), var(--shadow-menu);
  color: var(--text-on-glass);
  animation: ${worldOpen} var(--dur-fast) var(--ease-out);
`;

const WorldRow = styled.div`
  font: 400 14px/24px var(--main-font);
  font-variant-numeric: tabular-nums;
  color: var(--text-on-glass);
  text-shadow: var(--title-glow);
  white-space: pre;

  ${media.phone} {
    line-height: 32px;
  }
`;

// The place label of a row, in a heavier weight than its time.
const WorldPlace = styled.span`
  font-weight: 600;
`;

const formatZone = (zone, now) =>
  now ? zone.format.format(now).replace(NARROW_SPACES, ' ') : '--:--';

// The clock shows local time. It opens a panel with three world times.
const Clock = () => {
  const { state, actions } = useDesktop();
  const now = useMinuteNow();
  const open = state.worldTimeOpen;
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  // A press anywhere outside the button and the panel closes the panel.
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = e => {
      const inside = [buttonRef.current, panelRef.current].some(el => el && el.contains(e.target));
      if (!inside) {
        actions.closeWorldTime();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, actions]);

  return (
    <>
      <ClockButton
        ref={buttonRef}
        data-clock
        aria-label={now ? `World time, ${formatLocal(now)}` : 'World time'}
        aria-expanded={open}
        aria-controls="world-time"
        onClick={() => actions.toggleWorldTime()}>
        <time dateTime={now ? now.toISOString() : undefined}>
          {now ? formatLocal(now) : '--:--'}
        </time>
      </ClockButton>
      <WorldTimePanel
        ref={panelRef}
        id="world-time"
        role="region"
        aria-label="World time"
        hidden={!open}>
        {ZONES.map(zone => (
          <WorldRow key={zone.label}>
            <WorldPlace>{zone.label}</WorldPlace>
            {`  ${formatZone(zone, now)}`}
          </WorldRow>
        ))}
      </WorldTimePanel>
    </>
  );
};

export default Clock;
