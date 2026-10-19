import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { plate, media, focusRing } from '@styles';
import { LOADERS } from '../games';
import { Stage } from '../games/kit';
import { getGame } from './games';
import { recordGameOpen } from '../tracking';

// A game opens in a glass dialog over the page. The game's code loads the first time it opens;
// the game exists only while the dialog is open, so a closed game does nothing.

const RESERVE = { wide: 168, phone: 124 }; // title bar, padding and margins, px

const appear = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(0.97); }
  to { opacity: 1; transform: none; }
`;

const fade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Veil = styled.div`
  position: fixed;
  z-index: var(--z-dialog);
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(80% 70% at 50% 40%, rgba(6, 60, 130, 0.45), rgba(2, 20, 60, 0.78));
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  overscroll-behavior: contain;
  animation: ${fade} 0.25s ease;

  ${media.phone} {
    padding: 10px;
    padding-bottom: max(10px, env(safe-area-inset-bottom));
  }
`;

const Panel = styled.div`
  ${plate};
  display: flex;
  flex-direction: column;
  width: min(100%, var(--panel-w));
  max-height: 100%;
  border-radius: 28px;
  padding: 0 16px 16px;
  color: var(--text);
  animation: ${appear} 0.4s var(--ease-out);

  &:focus {
    outline: none;
  }

  ${media.phone} {
    width: 100%;
    border-radius: 22px;
    padding: 0 8px 8px;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  padding: 0 2px 0 8px;
`;

const Title = styled.h2`
  margin-right: auto;
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--heading);
`;

// A round glossy close button, aqua glass with a white cross.
const Close = styled.button.attrs({ type: 'button' })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 48px;
  height: 48px;
  padding: 0 16px 0 14px;
  border-radius: 999px;
  border: 1px solid #0b5c96;
  background: linear-gradient(180deg, #6dd2ff 0%, #22a6ec 50%, #0b84d4 51%, #2bb8f2 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -5px 10px -3px rgba(150, 250, 255, 0.9);
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 0 1px 1px rgba(0, 50, 110, 0.55);
  cursor: pointer;
  ${focusRing};

  &:hover {
    filter: brightness(1.08);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Body = styled.div`
  min-height: 0;
  padding: 10px;
  border-radius: 18px;
  background: var(--game-bg);
  box-shadow: inset 0 0 0 1px rgba(10, 95, 168, 0.22), inset 0 2px 6px rgba(0, 40, 90, 0.12);

  ${media.phone} {
    padding: 6px;
  }
`;

const Note = styled.p`
  padding: 24px;
  font-size: 1.5rem;
  color: var(--text-muted);
`;

const focusables = el =>
  Array.from(
    el.querySelectorAll(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(n => !n.disabled && n.getClientRects().length);

const GameDialog = ({ id, onClose }) => {
  const game = getGame(id);
  const panel = useRef(null);
  const [Game, setGame] = useState(null);
  const [failed, setFailed] = useState(false);
  const [shown, setShown] = useState(true);
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    let live = true;
    recordGameOpen(id);
    LOADERS[id]()
      .then(mod => live && setGame(() => mod.default))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [id]);

  // The page behind stops scrolling and stops taking focus while the game is open.
  useEffect(() => {
    const root = document.documentElement;
    const behind = ['content', 'site-nav'].map(n => document.getElementById(n)).filter(Boolean);
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    behind.forEach(n => n.setAttribute('inert', ''));
    setPhone(window.matchMedia('(max-width: 36em)').matches);
    panel.current.focus({ preventScroll: true });

    const onVisibility = () => setShown(document.visibilityState !== 'hidden');
    const onKey = e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const list = focusables(panel.current);
        if (!list.length) {
          e.preventDefault();
          return;
        }
        const first = list[0];
        const last = list[list.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === panel.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = overflow;
      behind.forEach(n => n.removeAttribute('inert'));
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  let content;
  if (Game) {
    content = <Game active={shown} w={game.size.w} h={game.size.h} />;
  } else {
    content = (
      <Note>{failed ? 'This game did not load. Close it and try again.' : 'Loading…'}</Note>
    );
  }

  return (
    <Veil
      onPointerDown={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      <Panel
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-title"
        tabIndex={-1}
        data-game-host
        data-reserve={phone ? RESERVE.phone : RESERVE.wide}
        style={{ '--panel-w': `${game.size.w * 1.5 + 54}px` }}>
        <Head data-game-chrome>
          <Title id="game-title">{game.title}</Title>
          <Close onClick={onClose}>
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
            Close
          </Close>
        </Head>
        <Body>
          <Stage w={game.size.w} h={game.size.h}>
            {content}
          </Stage>
        </Body>
      </Panel>
    </Veil>
  );
};

GameDialog.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GameDialog;
