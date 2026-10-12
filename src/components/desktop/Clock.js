import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { bevel, media } from '@styles';
import { useMinuteNow } from '@hooks';
import { useDesktop } from './DesktopProvider';
import { BevelButton } from './ui';

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

const WorldTimePanel = styled.div`
  position: absolute;
  top: 3.1rem;
  right: 3.4rem;
  display: flex;
  flex-direction: column;

  ${media.phone} {
    top: 5.4rem;
    right: 0.4rem;
  }
`;

const WorldRow = styled.div`
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 1rem;
  background: var(--window-color);
  color: var(--main-color);
  font: 16px/1 var(--main-font);
  letter-spacing: 0.5px;
  white-space: pre;
  ${bevel};

  ${media.phone} {
    height: 40px;
    font: 24px/1 var(--main-large-font);
  }
`;

const formatZone = (zone, now) =>
  now ? zone.format.format(now).replace(NARROW_SPACES, ' ') : '--:--';

// The clock is a bevel button showing local time. It opens a panel with three world times.
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
      <BevelButton
        ref={buttonRef}
        data-clock
        aria-label={now ? `World time, ${formatLocal(now)}` : 'World time'}
        aria-expanded={open}
        aria-controls="world-time"
        onClick={() => actions.toggleWorldTime()}>
        <time dateTime={now ? now.toISOString() : undefined}>
          {now ? formatLocal(now) : '--:--'}
        </time>
      </BevelButton>
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
