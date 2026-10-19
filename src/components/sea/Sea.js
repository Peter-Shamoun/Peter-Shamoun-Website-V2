import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Nav from './Nav';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Research from './Research';
import Arcade from './Arcade';
import Contact from './Contact';
import GameDialog from './GameDialog';

// The stops paint their photographs at z-index -1; this keeps them above the body's water.
const Main = styled.main`
  position: relative;
  isolation: isolate;
`;

// The whole page: one dive, top to bottom (.studio/DESIGN-PERFECT.md).
const Sea = () => {
  const [game, setGame] = useState(null);
  const opener = useRef(null);

  const play = useCallback((id, from) => {
    opener.current = from || null;
    setGame(id);
  }, []);

  const close = useCallback(() => setGame(null), []);

  // Focus goes back to the tile that opened the game. This runs after the dialog's own cleanup
  // has made the page focusable again.
  useEffect(() => {
    const el = opener.current;
    if (!game && el && document.contains(el)) {
      el.focus({ preventScroll: true });
      opener.current = null;
    }
  }, [game]);

  return (
    <>
      <div id="site-nav">
        <Nav />
      </div>
      <Main id="content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Research />
        <Arcade onPlay={play} />
        <Contact />
      </Main>
      {game ? <GameDialog id={game} onClose={close} /> : null}
    </>
  );
};

export default Sea;
