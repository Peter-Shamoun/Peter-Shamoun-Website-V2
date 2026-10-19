import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { glass, media } from '@styles';
import { useMinuteNow } from '@hooks';
import { useDesktop } from './DesktopProvider';
import { SevenSeg } from '../aero/art';

const pad = n => String(n).padStart(2, '0');

// Local time: 24-hour, hour not padded, minutes padded (9:05, 19:13).
const formatLocal = date => `${date.getHours()}:${pad(date.getMinutes())}`;
// The LCD always shows four digits; a blank cell stands in for a leading zero (" 9:05").
const formatLcd = date => `${String(date.getHours()).padStart(2, ' ')}:${pad(date.getMinutes())}`;

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

// The time in seven-segment digits at the right of the LCD. It lights up on hover.
const ClockButton = styled.button.attrs({ type: 'button' })`
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  padding: 0 12px;
  border: 1px solid rgba(184, 244, 255, 0.18);
  border-radius: 12px;
  background: rgba(0, 20, 40, 0.25);
  color: var(--lcd-ink);
  cursor: pointer;
  transition: background var(--dur-hover) var(--ease-out),
    border-color var(--dur-hover) var(--ease-out);

  .seg {
    fill: var(--lcd-ghost);
  }

  .seg--on {
    fill: var(--lcd-ink);
  }

  svg {
    display: block;
    filter: drop-shadow(0 0 4px rgba(120, 230, 255, 0.8));
  }

  &:hover,
  &[aria-expanded='true'] {
    border-color: rgba(184, 244, 255, 0.5);
    background: rgba(120, 220, 255, 0.12);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-on-scene);
    outline-offset: 2px;
  }

  ${media.phone} {
    height: 44px;
    padding: 0 6px;

    svg {
      height: 18px;
      width: auto;
    }
  }
`;

// Glass panel that rises from the clock: three cities in LCD type.
const WorldTimePanel = styled.div`
  ${glass};
  position: absolute;
  right: 0;
  bottom: calc(100% + 18px);
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 220px;
  padding: 12px 16px;
  border-radius: var(--radius-menu);
  background-color: rgba(4, 50, 90, 0.82);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), var(--shadow-menu);
  color: var(--lcd-ink);
  animation: ${worldOpen} var(--dur-fast) var(--ease-out);
`;

const WorldRow = styled.div`
  font: 800 16px/26px var(--display-font);
  font-variant-numeric: tabular-nums;
  color: var(--lcd-ink);
  text-shadow: 0 0 6px rgba(120, 230, 255, 0.7);
  white-space: pre;

  ${media.phone} {
    line-height: 32px;
  }
`;

// The place label of a row, in a heavier weight than its time.
const WorldPlace = styled.span`
  color: var(--lime);
  text-shadow: 0 0 6px rgba(184, 255, 46, 0.7);
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
          <SevenSeg
            value={now ? formatLcd(now) : '--:--'}
            label={now ? formatLocal(now) : 'No time yet'}
            height={26}
          />
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
