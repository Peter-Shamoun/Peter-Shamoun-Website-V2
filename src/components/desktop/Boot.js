import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { media } from '@styles';
import { usePrefersReducedMotion } from '@hooks';
import { useDesktop } from './DesktopProvider';

// Boot text is decorative and hidden from assistive technology.
const LINES = [
  'PS-BIOS v2026.10',
  'Memory test: 640K OK',
  'Detecting portfolio... found',
  'Loading desktop...',
];
const LINE_DELAYS = [0, 250, 550, 850]; // ms after the overlay appears
const BOOT_MS = 1200;

// The overlay hides itself with CSS after BOOT_MS, so it goes away even if JavaScript never runs.
const bootOut = keyframes`
  to {
    visibility: hidden;
  }
`;

const showLine = keyframes`
  to {
    visibility: visible;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  padding: 2rem;
  background: #000;
  color: #ccc;
  font: 16px/1.5 var(--main-font);
  letter-spacing: 0.5px;
  z-index: var(--z-boot);
  pointer-events: none;
  animation: ${bootOut} 0s linear ${BOOT_MS / 1000}s forwards;

  ${media.reduced} {
    display: none;
  }
`;

const Line = styled.div`
  visibility: hidden;
  white-space: pre;
  animation: ${showLine} 0s linear ${props => props.$delay}ms forwards;
`;

// Covers the desktop for about 1.2 s. A key press or a pointer press skips it.
const Boot = () => {
  const { state, actions } = useDesktop();
  const { bootDone } = state;
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (bootDone) {
      return undefined;
    }
    if (reducedMotion) {
      actions.bootDone();
      return undefined;
    }

    let timer = null;
    const cleanup = () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', finish);
      document.removeEventListener('pointerdown', finish);
    };
    function finish() {
      cleanup();
      actions.bootDone();
    }

    timer = setTimeout(finish, BOOT_MS);
    document.addEventListener('keydown', finish);
    document.addEventListener('pointerdown', finish);
    return cleanup;
  }, [bootDone, reducedMotion, actions]);

  if (bootDone) {
    return null;
  }

  return (
    <Overlay data-boot aria-hidden="true">
      {LINES.map((text, i) => (
        <Line key={text} $delay={LINE_DELAYS[i]}>
          {text}
        </Line>
      ))}
    </Overlay>
  );
};

export default Boot;
