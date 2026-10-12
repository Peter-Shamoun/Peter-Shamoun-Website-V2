import React from 'react';
import styled from 'styled-components';
import DesktopProvider from './DesktopProvider';
import Boot from './Boot';
import TopBar from './TopBar';
import Wordmark from './Wordmark';
import Scene from './Scene';
import DesktopIcons from './DesktopIcons';
import PopupSpawner from './PopupSpawner';
import SiteFooter from './SiteFooter';
import BlueScreen from './BlueScreen';
import {
  AboutWindow,
  ExperienceWindow,
  ProjectsWindow,
  ResearchWindow,
  ContactWindow,
  SiteInfoWindow,
} from '../windows';

// The desktop area under the top bar. It is its own stacking context (z-index: 1), so windows
// and popups inside it always sit above the page footer and below the top bar.
const StyledDesktop = styled.main`
  position: fixed;
  top: var(--topbar-h);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;

  /* It takes focus from the skip link and from a closed popup; it is not a control. */
  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

// DOM order is the tab order.
const Desktop = () => (
  <DesktopProvider>
    <Boot />
    <TopBar />
    <StyledDesktop id="content" tabIndex={-1}>
      <Wordmark />
      <Scene />
      <DesktopIcons />
      <AboutWindow />
      <ExperienceWindow />
      <ProjectsWindow />
      <ResearchWindow />
      <ContactWindow />
      <SiteInfoWindow />
      <PopupSpawner />
    </StyledDesktop>
    <SiteFooter />
    <BlueScreen />
  </DesktopProvider>
);

export default Desktop;
