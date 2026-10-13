import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Window, useDesktop, getWindow } from '@components/desktop';
import { frontZ } from '../desktop/state';
import { LOADERS } from '../games';
import { Stage } from '../games/kit';

const Note = styled.p`
  margin: 0;
  padding: 12px;
`;

// The window a game runs in. The game is fetched when the window first opens and exists only
// while the window is open, so a closed game does nothing. `active` tells the game it is the
// window in front on a visible page; games pause themselves when it is false.
const GameWindow = ({ id }) => {
  const { state } = useDesktop();
  const { game: size } = getWindow(id);
  const win = state.windows[id];
  const [Game, setGame] = useState(null);
  const [failed, setFailed] = useState(false);
  const [pageShown, setPageShown] = useState(true);

  useEffect(() => {
    if (!win.open || Game) {
      return undefined;
    }
    let live = true;
    setFailed(false);
    LOADERS[id]()
      .then(mod => live && setGame(() => mod.default))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [win.open, Game, id]);

  useEffect(() => {
    const onChange = () => setPageShown(document.visibilityState !== 'hidden');
    onChange();
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  const active = win.open && win.z === frontZ(state) && !state.startOpen && pageShown;

  // When the game becomes the thing in front again (the Start menu closed, say) the keyboard
  // goes back to it, unless focus is already somewhere inside its window.
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-window="${id}"]`);
      if (el && !el.hidden && !el.contains(document.activeElement)) {
        el.focus({ preventScroll: true });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [active, id]);

  let content = null;
  if (win.open && Game) {
    content = <Game active={active} w={size.w} h={size.h} />;
  } else if (win.open) {
    content = (
      <Note>{failed ? 'This game did not load. Close it and try again.' : 'Loading...'}</Note>
    );
  }

  return (
    <Window id={id} game>
      {win.open ? (
        <Stage w={size.w} h={size.h}>
          {content}
        </Stage>
      ) : null}
    </Window>
  );
};

GameWindow.propTypes = {
  id: PropTypes.string.isRequired,
};

export default GameWindow;
