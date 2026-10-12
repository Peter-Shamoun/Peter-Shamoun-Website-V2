import React from 'react';
import styled from 'styled-components';
import { media } from '@styles';

// The name, written on the wallpaper in the bottom-right corner, behind everything else.
const Block = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: var(--z-wallpaper);
  color: var(--text-on-desktop);
  text-shadow: var(--shadow-on-desktop);
  text-align: right;
  pointer-events: none;

  ${media.phone} {
    right: 12px;
    bottom: 12px;
  }
`;

// 24px is the size the large face is drawn for, so the name stays on the pixel grid.
const Name = styled.h1`
  margin: 0 0 4px;
  font: 24px/1.2 var(--main-large-font);
  letter-spacing: 0;
  white-space: nowrap;
`;

const Line = styled.p`
  margin: 0;
  font: 16px/1.4 var(--main-font);
  white-space: nowrap;
`;

const Wallpaper = () => (
  <Block data-wallpaper>
    <Name>Peter Shamoun</Name>
    <Line>AI Engineer</Line>
    <Line>San Diego, CA</Line>
  </Block>
);

export default Wallpaper;
