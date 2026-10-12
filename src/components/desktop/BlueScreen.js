import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { media } from '@styles';
import { useDesktop, getEggOpener } from './DesktopProvider';

// Full-screen blue screen. The whole screen is one real <button>, so a
// click, a tap, Enter or Space all dismiss it, and the first focusable thing in it is that button.
// Escape is handled by the provider (ESCAPE action), so it is not handled here.

const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-bsod);
  display: flex;
  background: var(--bsod-color);
`;

const Hit = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 2rem;
  border: 0;
  border-radius: 0;
  background: none;
  color: var(--select-text);
  font: 14px/1.6 var(--bsod-font);
  letter-spacing: 0;
  text-align: left;
  cursor: pointer;

  ${media.phone} {
    padding: 1.6rem;
    font-size: 13px;
  }
`;

const Text = styled.span`
  display: block;
  width: 100%;
  max-width: 80ch;
`;

const Line = styled.span`
  display: block;
  margin: 0 0 1.2em;
`;

const IGNORED_KEYS = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'];

const BlueScreen = () => {
  const { state, actions } = useDesktop();
  const { bsod, focusTick } = state;
  const button = useRef(null);
  const wasOpen = useRef(bsod);

  // Focus the button when the blue screen appears (a focusTick of kind 'bsod').
  const tickN = focusTick && focusTick.kind === 'bsod' ? focusTick.n : 0;
  useEffect(() => {
    if (tickN && button.current) {
      button.current.focus({ preventScroll: true });
    }
  }, [tickN]);

  // Return focus to the icon that opened it when the blue screen goes away.
  useEffect(() => {
    if (wasOpen.current && !bsod) {
      const target = [getEggOpener(), document.querySelector('[data-egg]')].find(
        el => el && document.contains(el) && typeof el.focus === 'function',
      );
      if (target) {
        target.focus({ preventScroll: true });
      }
    }
    wasOpen.current = bsod;
  }, [bsod]);

  // "Press any key": any key dismisses it, except Tab (kept on the button), Escape (the
  // provider dismisses on Escape) and browser shortcuts (a key held with Ctrl, Alt or Cmd).
  useEffect(() => {
    if (!bsod) {
      return undefined;
    }
    const onKeyDown = e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        return;
      }
      if (e.key === 'Escape' || e.key === 'Esc' || e.repeat) {
        return;
      }
      if (IGNORED_KEYS.includes(e.key) || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      // Enter and Space would otherwise go on to click whatever holds focus next. Focus returns
      // to the free_ram.exe icon on dismissal, so that click would open the blue screen again.
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
      }
      actions.dismissBsod();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [bsod, actions]);

  if (!bsod) {
    return null;
  }

  return (
    <Screen data-bsod role="alertdialog" aria-modal="true" aria-labelledby="bsod-label">
      <Hit ref={button} type="button" onClick={() => actions.dismissBsod()}>
        <Text>
          <Line>
            This portfolio ran into something it could not handle, so it has stopped to keep your
            afternoon intact.
          </Line>
          <Line id="bsod-label">CURIOSITY_OVERFLOW</Line>
          <Line>
            You opened free_ram.exe three times. No RAM was downloaded. No RAM can be downloaded.
            That is not how RAM works.
          </Line>
          <Line>
            If this is the first time you have seen this screen, relax. Nothing is wrong with your
            computer. This is a web page, and it is only pretending.
          </Line>
          <Line>Diagnostics for the curious:</Line>
          <Line>*** STOP: 0x000001A1 (clicks: 0x00000003, regrets: 0x00000000)</Line>
          <Line>*** free_ram.exe - no address, no base, no RAM</Line>
          <Line>Press any key, click, or tap to return to the desktop.</Line>
        </Text>
      </Hit>
    </Screen>
  );
};

export default BlueScreen;
