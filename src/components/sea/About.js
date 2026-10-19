import React from 'react';
import styled from 'styled-components';
import { withPrefix } from 'gatsby';
import { media } from '@styles';
import Stop from './Stop';
import { Wrap, Plate, WaterTitle } from './ui';

// Just under the waves. Peter's photo sits in a glass porthole on a wide plate.

const Inner = styled(Wrap)`
  padding: clamp(80px, 14vh, 160px) 0 clamp(90px, 16vh, 180px);
`;

const Card = styled(Plate)`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(24px, 4vw, 56px);
  max-width: 980px;
  margin-top: clamp(24px, 4vh, 40px);

  ${media.phone} {
    grid-template-columns: minmax(0, 1fr);
    justify-items: start;
  }
`;

// The porthole: the photo under a thick glass lens with a bright cap and a cyan rim.
const Porthole = styled.div`
  position: relative;
  width: clamp(148px, 18vw, 216px);
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 7px;
  background: linear-gradient(160deg, #ffffff 0%, #bfeaff 45%, #5fc4ef 100%);
  box-shadow: 0 18px 36px -12px rgba(0, 40, 100, 0.55), inset 0 -3px 6px rgba(0, 90, 160, 0.35);

  picture,
  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 7px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(
        64% 36% at 50% 14%,
        rgba(255, 255, 255, 0.78),
        rgba(255, 255, 255, 0.12) 70%,
        transparent 71%
      ),
      radial-gradient(
        circle at 50% 50%,
        transparent 64%,
        rgba(120, 230, 255, 0.35) 86%,
        rgba(255, 255, 255, 0.6) 100%
      );
    box-shadow: inset 0 -10px 18px -6px rgba(120, 240, 255, 0.7);
  }
`;

const Hello = styled.p`
  font-size: clamp(2.6rem, 2.8vw, 3.6rem);
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--heading);
`;

const Body = styled.p`
  max-width: 36em;
  margin-top: 14px;
  font-size: clamp(1.7rem, 1.4vw, 1.9rem);
  line-height: 1.6;
  color: var(--text);
`;

const About = () => (
  <Stop
    id="about"
    plate="surface"
    focus="50% 20%"
    caustics={0.5}
    bubbles={14}
    first
    labelledBy="about-title">
    <Inner>
      <WaterTitle id="about-title">About</WaterTitle>
      <Card>
        <Porthole>
          <picture>
            <source type="image/webp" srcSet={withPrefix('/sea/about/peter.webp')} />
            <img
              src={withPrefix('/sea/about/peter.jpg')}
              width="216"
              height="216"
              alt="Peter Shamoun"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </Porthole>
        <div>
          <Hello>Hi, I’m Peter.</Hello>
          <Body>
            I’m an AI engineer at Xifin in San Diego, building agents that keep insurance claims
            from being denied and appeal the ones that are. I also do AI research at UC San Diego:
            small language models, AI safety, and whether sleep patterns can stand in for epoch
            training.
          </Body>
        </div>
      </Card>
    </Inner>
  </Stop>
);

export default About;
