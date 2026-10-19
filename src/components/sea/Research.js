import React from 'react';
import styled from 'styled-components';
import { media } from '@styles';
import Stop from './Stop';
import { Wrap, Plate, WaterTitle } from './ui';

// Open water, with the dolphins. One question, set large.

const Inner = styled(Wrap)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: clamp(90px, 18vh, 200px) 0 clamp(120px, 24vh, 260px);

  ${media.tablet} {
    align-items: stretch;
  }
`;

const Card = styled(Plate)`
  max-width: 640px;
  margin-top: clamp(28px, 5vh, 48px);
`;

const Paper = styled.p`
  font-size: clamp(2.8rem, 3vw, 4rem);
  font-weight: 300;
  line-height: 1.18;
  letter-spacing: -0.015em;
  color: var(--abyss);
`;

const Status = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  padding: 7px 16px 8px 12px;
  border-radius: 999px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f4a00;
  background: linear-gradient(180deg, #e6ffb8 0%, #c4f26c 50%, #ace24a 51%, #c9f47a 100%);
  border: 1px solid #6fb51f;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);

  /* a live indicator: the paper is being written now */
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ffffff 0 20%, #57b80f 45%, #2f7a00 100%);
  }
`;

const Notes = styled.p`
  margin-top: 22px;
  font-size: 1.7rem;
  line-height: 1.6;
  color: var(--text);
`;

const Research = () => (
  <Stop id="research" plate="dolphins" focus="55% 40%" bubbles={8} labelledBy="research-title">
    <Inner>
      <WaterTitle id="research-title">Research</WaterTitle>
      <Card>
        <Paper>Sleep patterns as an alternative to epoch training</Paper>
        <Status>Publication coming soon</Status>
        <Notes>
          At UC San Diego&apos;s data science institute I study small language models. At the AI
          Smith Lab I work on AI safety: using task vector algebra to fine-tune large language
          models so they hold up against jailbreak attempts.
        </Notes>
      </Card>
    </Inner>
  </Stop>
);

export default Research;
