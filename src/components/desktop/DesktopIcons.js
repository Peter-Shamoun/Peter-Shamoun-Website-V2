import React from 'react';
import styled from 'styled-components';
import { useDesktop } from './DesktopProvider';
import { DESKTOP_ICONS } from './registry';
import DesktopIcon from './DesktopIcon';

// Left edge, in percent of the desktop width, when the landscape phone shows one row.
const LANDSCAPE_LEFT = {
  about: 5,
  experience: 20,
  projects: 35,
  research: 50,
  contact: 65,
  resume: 80,
};

// Covers the desktop area without catching pointer events; only the icons take them.
const StyledIcons = styled.nav`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-icons);
  pointer-events: none;
`;

// Each icon gets its positions as custom properties; media queries in DesktopIcon choose one.
const iconStyle = item => ({
  '--icon-x': `${item.left}%`,
  '--icon-x-tablet': `${item.tabletLeft}%`,
  '--icon-x-phone': `${item.phone ? item.phone.left : 0}%`,
  '--icon-row': item.phone ? item.phone.row : 0,
  '--icon-x-land': `${LANDSCAPE_LEFT[item.key] || 0}%`,
});

const DesktopIcons = () => {
  const { actions } = useDesktop();

  const activate = item => e => {
    if (item.kind === 'window') {
      actions.openWindow(item.target, { from: e.currentTarget });
    } else if (item.kind === 'egg') {
      actions.eggClick(e.currentTarget);
    }
  };

  return (
    <StyledIcons aria-label="Desktop">
      {DESKTOP_ICONS.map(item => (
        <DesktopIcon
          key={item.key}
          item={item}
          style={iconStyle(item)}
          onActivate={activate(item)}
        />
      ))}
    </StyledIcons>
  );
};

export default DesktopIcons;
