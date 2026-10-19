import React from 'react';
import styled from 'styled-components';
import { withPrefix } from 'gatsby';
import { media } from '@styles';
import HeroOrb from './HeroOrb';
import { GelLink } from './ui';

// Above the atoll: the orb over the reef, the name in the sky.

const Section = styled.header`
  position: relative;
  min-height: max(100svh, 620px);
  display: flex;
  flex-direction: column;
  color: var(--text-on-water);

  /* The sky deepens toward the top and behind the words, the way it does at noon. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(70% 60% at 12% 22%, rgba(4, 52, 140, 0.42), rgba(4, 52, 140, 0) 70%),
      linear-gradient(180deg, rgba(4, 52, 140, 0.4) 0%, rgba(4, 52, 140, 0) 34%);
  }

  ${media.phone} {
    &::after {
      background: linear-gradient(
        180deg,
        rgba(4, 50, 135, 0.62) 0%,
        rgba(4, 50, 135, 0.42) 26%,
        rgba(4, 50, 135, 0) 46%
      );
    }
  }
`;

// Where the dive breaks the surface: the waterline seen edge-on, across the hero's last stretch.
const Waterline = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 84%;
  height: clamp(150px, 22vh, 240px);
  transform: translateY(-38%);
  background: url(${withPrefix('/sea/fx/waterline.webp')}) center / 100% 100% no-repeat;
  pointer-events: none;
`;

const Copy = styled.div`
  position: relative;
  z-index: 1;
  width: min(100% - var(--gutter) * 2, var(--measure));
  margin: 0 auto;
  padding-top: calc(var(--nav-h) + clamp(40px, 11vh, 120px));

  ${media.phone} {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-top: calc(var(--nav-h) + 28px);
    padding-bottom: 28px;
  }
`;

const Name = styled.h1`
  font-size: clamp(5rem, 6vw, 10.4rem);
  font-weight: 300;
  letter-spacing: -0.035em;
  line-height: 0.98;
  text-shadow: 0 2px 3px rgba(0, 35, 100, 0.35), 0 0 30px rgba(0, 50, 140, 0.35);

  ${media.phone} {
    font-size: clamp(4.4rem, 13vw, 5.6rem);
  }
`;

const Line = styled.p`
  max-width: min(30em, 42vw);
  margin-top: clamp(16px, 2.4vh, 26px);
  font-size: clamp(1.8rem, 1.55vw, 2.2rem);
  line-height: 1.5;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 35, 100, 0.7), 0 0 16px rgba(0, 40, 120, 0.55);

  ${media.phone} {
    max-width: 30em;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: clamp(24px, 4vh, 40px);

  ${media.phone} {
    margin-top: auto;
    padding-top: 24px;

    a {
      flex: 1 1 140px;
    }
  }
`;

const Hero = () => (
  <Section id="top">
    <HeroOrb />
    <Waterline aria-hidden="true" />
    <Copy>
      <Name translate="no">Peter Shamoun</Name>
      <Line>
        AI engineer in San Diego. I build agents for healthcare at Xifin and research small language
        models at UC San Diego.
      </Line>
      <Actions>
        <GelLink href="#about">Dive In</GelLink>
        <GelLink href="#games" $tone="lime">
          Play a Game
        </GelLink>
      </Actions>
    </Copy>
  </Section>
);

export default Hero;
