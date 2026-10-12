import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { media } from '@styles';
import { useDesktop } from './DesktopProvider';

// Reveals the name from left to right in 13 steps, one step per character.
const typeOn = keyframes`
  from {
    clip-path: inset(0 100% 0 0);
  }

  to {
    clip-path: inset(0 0 0 0);
  }
`;

const Container = styled.div`
  position: absolute;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
  width: min(50rem, 92vw);
  text-align: center;
  pointer-events: none;

  ${media.phone} {
    top: 14.5rem;
  }
`;

// $hidden: before the boot screen ends the name is clipped out of sight but stays in the
// accessibility tree. $animate: the typing reveal runs once the boot screen has ended.
const Title = styled.h1`
  margin: 0;
  font: 72px/1 var(--main-large-font);
  letter-spacing: 0;
  text-transform: uppercase;
  color: #fff;
  white-space: nowrap;

  ${props =>
    props.$hidden &&
    css`
      clip-path: inset(0 100% 0 0);
    `}

  ${props =>
    props.$animate &&
    css`
      animation: ${typeOn} 1.3s steps(13) both;
    `}

  ${media.phone} {
    font-size: 48px;
  }

  @media (max-width: 359px) {
    font-size: 24px;
  }

  ${media.reduced} {
    clip-path: none;
    animation: none;
  }
`;

const Tagline = styled.p`
  margin: 0.6rem 0 0;
  font: 16px var(--main-font);
  text-transform: uppercase;
  color: #fff;
`;

// Foundation stub replaced by the desktop-surface package: 72 px name with the typing reveal.
const Wordmark = () => {
  const { state } = useDesktop();
  const { bootDone, wordmarkRun } = state;

  return (
    <Container data-wordmark>
      <Title key={wordmarkRun} $hidden={!bootDone} $animate={bootDone}>
        Peter Shamoun
      </Title>
      <Tagline>AI Engineer / San Diego, CA</Tagline>
    </Container>
  );
};

export default Wordmark;
