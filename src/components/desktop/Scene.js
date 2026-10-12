import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { media } from '@styles';
import { SceneSprite, SceneTuft } from './icons';

// The sprite crosses the scene left to right, then starts again.
const cross = keyframes`
  from {
    transform: translateX(-200px);
  }

  to {
    transform: translateX(100vw);
  }
`;

// Phone and reduced motion: the sprite sits still in the middle.
const still = css`
  left: 50%;
  transform: translateX(-50%);
  animation: none;
`;

const Root = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: var(--z-scene);
`;

const Line = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #fff;
  top: ${props => props.$top};
`;

const Tuft = styled.span`
  position: absolute;
  top: calc(58% - 2px);
  left: ${props => props.$x}%;
  transform: translateY(-100%);
  line-height: 0;

  svg {
    display: block;
    width: 24px;
    height: 20px;
  }
`;

const Sprite = styled.div`
  position: absolute;
  top: calc(58% - 90px);
  left: 0;
  width: 160px;
  height: 90px;
  line-height: 0;
  animation: ${cross} 22s linear infinite;

  svg {
    display: block;
    width: 160px;
    height: 90px;
  }

  ${media.phone} {
    ${still}
  }

  ${media.reduced} {
    ${still}
  }
`;

// Six tufts sit on the lower horizon line.
const TUFT_X = [6, 21, 37, 63, 79, 93];

// Original artwork: two horizon lines, tufts and a pixel sprite. Purely decorative.
const Scene = () => (
  <Root aria-hidden="true">
    <Line $top="44%" />
    <Line $top="58%" />
    {TUFT_X.map(x => (
      <Tuft key={x} $x={x}>
        <SceneTuft />
      </Tuft>
    ))}
    <Sprite>
      <SceneSprite />
    </Sprite>
  </Root>
);

export default Scene;
