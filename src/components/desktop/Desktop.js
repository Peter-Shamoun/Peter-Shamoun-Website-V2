import React from 'react';
import styled from 'styled-components';
import DesktopProvider from './DesktopProvider';
import Wallpaper from './Wallpaper';
import DesktopIcons from './DesktopIcons';
import Taskbar from './Taskbar';
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

// The desktop area above the taskbar. It is its own stacking context (z-index: 1), so windows
// inside it always sit below the taskbar and its menus.
const StyledDesktop = styled.main`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: var(--taskbar-total);
  z-index: 1;
  overflow: hidden;

  /* It takes focus from the skip link; it is not a control. */
  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

// DOM order is the tab order: the desktop icons, the open windows, then the taskbar.
const Desktop = () => (
  <DesktopProvider>
    <StyledDesktop id="content" tabIndex={-1}>
      <Wallpaper />
      <DesktopIcons />
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
