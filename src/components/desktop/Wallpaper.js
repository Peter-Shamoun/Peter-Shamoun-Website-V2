import React from 'react';
import styled, { keyframes } from 'styled-components';
import { withPrefix } from 'gatsby';
import { media } from '@styles';

// Ambient bubbles, hand-placed in the right 35% of the desktop and kept above the name.
// x is a share of that strip, y the bottom edge as a share of the height, s the size in px,
// d the drift time in seconds, delay a negative offset in seconds, o the opacity, rise the lift in px.
const BUBBLES = [
  { x: 6, y: 30, s: 56, d: 26, delay: -4, o: 0.5, rise: 180 },
  { x: 22, y: 48, s: 30, d: 19, delay: -11, o: 0.45, rise: 130 },
  { x: 41, y: 26, s: 84, d: 38, delay: -20, o: 0.35, rise: 240 },
  { x: 58, y: 62, s: 40, d: 22, delay: -7, o: 0.65, rise: 150 },
  { x: 73, y: 36, s: 66, d: 31, delay: -15, o: 0.4, rise: 200 },
  { x: 84, y: 70, s: 24, d: 18, delay: -2, o: 0.7, rise: 120 },
  { x: 14, y: 74, s: 90, d: 34, delay: -26, o: 0.38, rise: 220 },
];

// Only translate moves, so the bubbles never trigger layout.
const drift = keyframes`
  from {
    translate: 0 0;
  }

  to {
    translate: 20px calc(var(--rise) * -1);
  }
`;

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

// The bubble strip. Decorative, so it is hidden on phones and when motion is reduced.
const Bubbles = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 35%;
  overflow: hidden;
  pointer-events: none;
  z-index: var(--z-wallpaper);

  ${media.phone} {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const Bubble = styled.span`
  position: absolute;
  left: var(--x);
  bottom: var(--y);
  width: var(--s);
  height: var(--s);
  opacity: var(--o);
  background: url(${withPrefix('/aero/fx/bubble.svg')}) center / contain no-repeat;
  animation: ${drift} var(--d) ease-in-out var(--delay) infinite alternate;
`;

// 34px in the light weight of the large face. It is live text, so it stays sharp at any size.
const Name = styled.h1`
  margin: 0 0 4px;
  font: 300 34px/1.1 var(--main-large-font);
  letter-spacing: 0;
  white-space: nowrap;
`;

const Line = styled.p`
  margin: 0;
  font: 400 15px/1.4 var(--main-font);
  opacity: 0.92;
  white-space: nowrap;
`;

const Wallpaper = () => (
  <>
    <Bubbles aria-hidden="true" data-bubbles>
      {BUBBLES.map(b => (
        <Bubble
          key={b.x}
          style={{
            '--x': `${b.x}%`,
            '--y': `${b.y}%`,
            '--s': `${b.s}px`,
            '--d': `${b.d}s`,
            '--delay': `${b.delay}s`,
            '--o': String(b.o),
            '--rise': `${b.rise}px`,
          }}
        />
      ))}
    </Bubbles>
    <Block data-wallpaper>
      <Name>Peter Shamoun</Name>
      <Line>AI Engineer</Line>
      <Line>San Diego, CA</Line>
    </Block>
  </>
);

export default Wallpaper;
