import React from 'react';
import styled from 'styled-components';
import { media } from '@styles';
import { useDesktop } from './DesktopProvider';
import { DESKTOP_ICONS } from './registry';
import DesktopIcon from './DesktopIcon';

// One column from the top-left corner, filled top to bottom. A second column starts only when
// the desktop is too short for the first. A row is the picture, 2px and the 20px label.
// On phones: rows of four across the top. Only the icons take pointer events.
const StyledIcons = styled.nav`
  position: absolute;
  top: 16px;
  bottom: 16px;
  left: 16px;
  z-index: var(--z-icons);
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(auto-fill, calc(var(--icon-size) + 22px));
  grid-auto-columns: 104px;
  row-gap: 10px;
  pointer-events: none;

  ${media.phone} {
    top: 12px;
    right: 8px;
    bottom: auto;
    left: 8px;
    grid-auto-flow: row;
    grid-template-rows: none;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-columns: auto;
    row-gap: 12px;
  }
`;

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
    <StyledIcons aria-label="Desktop" data-desktop-icons>
      {DESKTOP_ICONS.map(item => (
        <DesktopIcon key={item.key} item={item} onActivate={activate(item)} />
      ))}
    </StyledIcons>
  );
};

export default DesktopIcons;
