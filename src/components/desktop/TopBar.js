import React from 'react';
import styled from 'styled-components';
import { bevel, media } from '@styles';
import { useDesktop } from './DesktopProvider';
import { BevelButton } from './ui';
import Clock from './Clock';

const StyledTopBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-topbar);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  width: 100%;
  height: var(--topbar-h);
  padding: 0 4px;
  background: var(--window-color);
  ${bevel};
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

// The copyright button: a bevel button with the link font, square on phones.
const CopyrightButton = styled(BevelButton)`
  padding: 0 0.5rem;
  font-family: var(--link-font);

  ${media.phone} {
    width: 44px;
    padding: 0;
    font-family: var(--link-font);
  }
`;

const TopBar = () => {
  const { state, actions } = useDesktop();

  return (
    <StyledTopBar role="banner">
      <Group>
        <BevelButton
          data-name-button
          aria-label="Peter Shamoun: reset desktop"
          onClick={() => actions.reset()}>
          PETER SHAMOUN
        </BevelButton>
      </Group>
      <Group>
        <Clock />
        <CopyrightButton
          data-copyright-button
          aria-label="About this site"
          aria-pressed={state.windows.siteinfo.open}
          onClick={e => actions.toggleWindow('siteinfo', { from: e.currentTarget })}>
          &copy;
        </CopyrightButton>
      </Group>
    </StyledTopBar>
  );
};

export default TopBar;
