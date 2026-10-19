import React from 'react';
import styled from 'styled-components';
import { withPrefix } from 'gatsby';
import { media, glossAqua, focusRing } from '@styles';
import { Window, Heading, useDesktop } from '@components/desktop';

// Peter's photo inside a soap bubble, beside the greeting.
const Intro = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  column-gap: 22px;

  ${media.phone} {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    row-gap: 14px;
    text-align: center;
  }
`;

const Portrait = styled.picture`
  position: relative;
  display: block;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(0, 50, 120, 0.3), 0 0 0 4px #ffffff, 0 0 0 6px rgba(24, 195, 232, 0.6);

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  /* the bubble's film over the photo: a window highlight and an iridescent rim */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.9) 0 5%, transparent 6%),
      radial-gradient(ellipse 34% 16% at 34% 16%, rgba(255, 255, 255, 0.55), transparent 70%),
      radial-gradient(
        circle,
        transparent 62%,
        rgba(150, 240, 255, 0.35) 82%,
        rgba(255, 255, 255, 0.7) 100%
      );
    pointer-events: none;
  }
`;

const Line = styled.p`
  margin: 0;
  font-size: 17px;
  color: var(--text);
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;

  ${media.phone} {
    justify-content: center;
  }
`;

// Aqua gel pills that open the other panes.
const Go = styled.button.attrs({ type: 'button' })`
  min-height: 40px;
  padding: 0 18px;
  font: 800 15px/1 var(--display-font);
  cursor: pointer;
  ${glossAqua};
  ${focusRing};

  ${media.phone} {
    min-height: 44px;
  }
`;

const NEXT = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const AboutWindow = () => {
  const { actions } = useDesktop();
  return (
    <Window id="about">
      <Intro>
        <Portrait>
          <source type="image/webp" srcSet={withPrefix('/aero/about/peter.webp')} />
          <img
            src={withPrefix('/aero/about/peter.jpg')}
            width={132}
            height={132}
            alt="Peter Shamoun"
            loading="lazy"
            decoding="async"
          />
        </Portrait>
        <div>
          <Heading>Hi, I&apos;m Peter.</Heading>
          <Line>I build and study AI sometimes.</Line>
        </div>
      </Intro>
      <Row>
        {NEXT.map(n => (
          <Go key={n.id} onClick={e => actions.openWindow(n.id, { from: e.currentTarget })}>
            {n.label}
          </Go>
        ))}
      </Row>
    </Window>
  );
};

export default AboutWindow;
