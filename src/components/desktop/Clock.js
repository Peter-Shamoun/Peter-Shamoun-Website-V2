import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { bevelWindow, media } from '@styles';
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

// Intl puts a narrow no-break space before AM/PM; the pixel font needs a plain space.
const NARROW_SPACES = /[\u00a0\u202f]/g;

// A flat button that fills the sunken tray at the right end of the taskbar.
const ClockButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  height: 100%;
  padding: 0 9px;
  background: none;
  border: 0;
  color: var(--text);
  font: 16px/1 var(--main-font);
  cursor: default;

  &:focus-visible {
    outline: 1px dotted var(--text);
    outline-offset: -2px;
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

// Opens upward from the tray.
const WorldTimePanel = styled.div`
  position: absolute;
  right: 2px;
  bottom: 100%;
  display: flex;
  flex-direction: column;
  padding: 6px 12px;
  background: var(--chrome);
  color: var(--text);
  ${bevelWindow};
`;

const WorldRow = styled.div`
  font: 16px/24px var(--main-font);
  white-space: pre;

  ${media.phone} {
    line-height: 32px;
  }
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
          <WorldRow key={zone.label}>{`${zone.label}  ${formatZone(zone, now)}`}</WorldRow>
        ))}
      </WorldTimePanel>
    </>
  );
};

export default Clock;
