import React from 'react';
import styled from 'styled-components';
import { media } from '@styles';

// Bottom-right line. Shown only on desktops wider than 1024 px.
const StyledFooter = styled.footer`
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 0.5rem 1rem;
  font: 16px var(--main-font);
  text-transform: uppercase;
  color: #fff;
  white-space: nowrap;

  ${media.tablet} {
    display: none;
  }

  ${media.phone} {
    display: none;
  }
`;

const SiteFooter = () => (
  <StyledFooter>(C) {new Date().getFullYear()} PETER SHAMOUN. ALL CLICKS RESERVED.</StyledFooter>
);

export default SiteFooter;
