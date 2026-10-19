import React from 'react';
import styled from 'styled-components';
import { media } from '@styles';
import DesktopProvider from './DesktopProvider';
import Taskbar from './Taskbar';
import Scene from '../aero/Scene';
import SectionBubbles from '../aero/SectionBubbles';
import GameShelf from '../aero/GameShelf';
import {
  AboutWindow,
  ExperienceWindow,
  ProjectsWindow,
  ResearchWindow,
  ContactWindow,
  GamesWindow,
  GameWindow,
} from '../windows';
import { GAME_LIST } from './registry';

// The whole screen, under the deck. It is its own stacking context (z-index: 1), so panes
// inside it always sit below the deck and its menus.
//
// The globe's size and place are custom properties here, because the scene draws it while the
// bubbles, the shelves and the panes each keep clear of it:
//   --globe-h       height of the globe's 1200 x 1400 box (the ball is 80% of its width)
//   --globe-x       the ball's centre line
//   --globe-bottom  the box's bottom edge, from the bottom of the screen
const StyledDesktop = styled.main`
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  --globe-h: min(88vh, 60vw * 7 / 6, 1240px);
  --globe-x: 60vw;
  --globe-bottom: calc(var(--globe-h) * -0.03);

  @media (min-width: 1700px) {
    --globe-x: 58vw;
  }

  ${media.phone} {
    --globe-h: min(47vh, 100vw * 7 / 6);
    --globe-x: 50vw;
    --globe-bottom: calc(100% - var(--globe-h) - 76px);
  }

  /* It takes focus from the skip link; it is not a control. */
  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

// DOM order is the tab order: the masthead and section bubbles, the game shelves, the open
// panes, then the deck.
const Desktop = () => (
  <DesktopProvider>
    <StyledDesktop id="content" tabIndex={-1}>
      <Scene />
      <SectionBubbles />
      <GameShelf />
      <AboutWindow />
      <ExperienceWindow />
      <ProjectsWindow />
      <ResearchWindow />
      <ContactWindow />
      <GamesWindow />
      {GAME_LIST.map(game => (
        <GameWindow key={game.id} id={game.id} />
      ))}
    </StyledDesktop>
    <Taskbar />
  </DesktopProvider>
);

export default Desktop;
