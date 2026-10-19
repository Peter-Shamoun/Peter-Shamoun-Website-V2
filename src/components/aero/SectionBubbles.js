import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { media } from '@styles';
import { useDesktop, DESKTOP_ICONS } from '@components/desktop';
import { ICONS } from '../desktop/icons';

// The six sections as soap bubbles floating left of the globe, and the masthead above them.
// A bubble is a button: it pops, then its pane opens over the globe and the bubble forms again.
// On phones they are a 3 x 2 grid under the globe.

const Column = styled.div`
  position: absolute;
  top: clamp(20px, 5vh, 56px);
  left: clamp(20px, 4vw, 72px);
  bottom: calc(var(--taskbar-total) + 8px);
  width: calc(var(--globe-x) - var(--globe-h) * 0.4 - clamp(20px, 4vw, 72px));
  z-index: var(--z-icons);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 3vh, 36px);
  pointer-events: none;

  ${media.phone} {
    top: 14px;
    left: 0;
    right: 0;
    width: auto;
    align-items: center;
    justify-content: space-between;
  }
`;

const Mast = styled.header`
  color: var(--text-on-desktop);
  pointer-events: auto;

  ${media.phone} {
    text-align: center;
  }
`;

// Heavy rounded type, white, lifted off the sky with a soft navy shadow.
const Name = styled.h1`
  margin: 0;
  font: 900 clamp(36px, 4.6vw, 80px) / 1 var(--display-font);
  letter-spacing: -0.015em;
  white-space: nowrap;
  text-shadow: 0 2px 0 rgba(0, 70, 160, 0.35), 0 6px 20px rgba(0, 30, 110, 0.55);

  ${media.phone} {
    font-size: 34px;
  }
`;

const Line = styled.p`
  margin: 0.55em 0 0;
  font: 600 clamp(15px, 1.25vw, 20px) / 1.3 var(--main-font);
  text-shadow: var(--shadow-on-desktop);

  ${media.phone} {
    margin-top: 2px;
    font-size: 15px;
  }
`;

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  column-gap: clamp(16px, 3vw, 56px);
  row-gap: clamp(0px, 1vh, 12px);
  margin: 0;
  padding: 0 0 0 4px;
  list-style: none;

  /* the right column floats half a bubble lower, so the six read as a loose cluster */
  > li:nth-child(even) {
    margin-top: calc(var(--bubble) * 0.5);
    margin-bottom: calc(var(--bubble) * -0.5);
  }

  @media (min-width: 1700px) {
    grid-template-columns: repeat(3, max-content);

    > li:nth-child(even) {
      margin: 0;
    }

    > li:nth-child(3n + 2) {
      margin-top: calc(var(--bubble) * 0.55);
      margin-bottom: calc(var(--bubble) * -0.55);
    }
  }

  ${media.phone} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 8px;
    row-gap: 6px;
    width: 100%;
    padding: 0 10px;

    > li:nth-child(even) {
      margin: 0;
    }
  }
`;

const bob = keyframes`
  from {
    transform: translate3d(0, -7px, 0);
  }

  to {
    transform: translate3d(0, 7px, 0);
  }
`;

const Item = styled.li`
  display: flex;
  justify-content: center;
  animation: ${bob} var(--bob) ease-in-out var(--delay) infinite alternate;
  pointer-events: none;
`;

const pop = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }

  22% {
    transform: scale(1.16, 1.1);
    opacity: 1;
  }

  34% {
    transform: scale(1.32);
    opacity: 0;
  }

  62% {
    transform: scale(0.35);
    opacity: 0;
  }

  86% {
    transform: scale(1.06);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const burst = keyframes`
  0%,
  20% {
    transform: scale(0.6);
    opacity: 0;
  }

  30% {
    opacity: 1;
  }

  60%,
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

const dip = keyframes`
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  30% {
    transform: translateY(6px) scale(0.9);
  }

  70% {
    transform: translateY(-3px) scale(1.04);
  }
`;

// The button is the bubble and its label together, so the whole thing is one 44px+ target.
const Bubble = styled.button.attrs({ type: 'button' })`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-on-glass);
  cursor: pointer;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: none;
  }

  ${media.phone} {
    gap: 3px;
  }
`;

// The film: clear in the middle, an iridescent rim, a hard window highlight top left and a soft
// bounce light bottom right.
const Film = styled.span`
  position: relative;
  display: grid;
  place-items: center;
  width: var(--bubble);
  height: var(--bubble);
  border-radius: 50%;
  background: radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.95) 0 5%, transparent 6%),
    radial-gradient(ellipse 30% 14% at 34% 18%, rgba(255, 255, 255, 0.7), transparent 70%),
    radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.05) 0 56%,
      rgba(180, 240, 255, 0.28) 74%,
      rgba(255, 255, 255, 0.55) 92%,
      rgba(255, 255, 255, 0.9) 100%
    );
  box-shadow: 0 10px 26px rgba(0, 40, 110, 0.25), inset 0 -6px 14px rgba(160, 255, 200, 0.35);
  transition: transform var(--dur-hover) var(--ease-spring);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      from 210deg,
      #ff9ff3,
      #7fe3ff,
      #b8ff2e,
      #ffe27a,
      #ff9ff3,
      #7fe3ff,
      #ff9ff3
    );
    -webkit-mask: radial-gradient(circle, transparent 62%, #000 76%, #000 90%, transparent 100%);
    mask: radial-gradient(circle, transparent 62%, #000 76%, #000 90%, transparent 100%);
    opacity: 0.55;
    mix-blend-mode: screen;
  }

  &::after {
    content: '';
    position: absolute;
    right: 14%;
    bottom: 10%;
    width: 30%;
    height: 14%;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(255, 255, 255, 0.75), transparent 70%);
    transform: rotate(-35deg);
  }

  img {
    position: relative;
    width: 56%;
    height: 56%;
    filter: drop-shadow(0 4px 5px rgba(0, 40, 90, 0.4));
    transition: transform var(--dur-hover) var(--ease-spring);
  }

  ${Bubble}:hover & {
    transform: scale(1.07);
  }

  ${Bubble}:hover & img {
    transform: rotate(-6deg) scale(1.06);
  }

  ${Bubble}:active & {
    transform: scale(0.96);
  }

  /* keyboard focus: a lime ring around the film */
  ${Bubble}:focus-visible & {
    box-shadow: 0 0 0 3px #ffffff, 0 0 0 7px var(--focus-on-scene),
      0 0 24px 6px rgba(184, 255, 46, 0.7);
  }

  ${Bubble}.is-popping & {
    animation: ${pop} 1000ms var(--ease-out) both;
  }

  ${Bubble}.is-popping & img {
    animation: ${dip} 1000ms var(--ease-out) both;
  }
`;

// Droplets that fly off when the film bursts.
const Spray = styled.span`
  position: absolute;
  left: 50%;
  top: calc(var(--bubble) / 2);
  width: var(--bubble);
  height: var(--bubble);
  margin: calc(var(--bubble) / -2) 0 0 calc(var(--bubble) / -2);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 4%, #fff 0 3%, transparent 4%),
    radial-gradient(circle at 92% 30%, #e9fdff 0 2.5%, transparent 3.5%),
    radial-gradient(circle at 88% 78%, #fff 0 3%, transparent 4%),
    radial-gradient(circle at 50% 97%, #e9fdff 0 2.4%, transparent 3.4%),
    radial-gradient(circle at 10% 76%, #fff 0 3%, transparent 4%),
    radial-gradient(circle at 6% 26%, #e9fdff 0 2.6%, transparent 3.6%),
    radial-gradient(circle at 30% 10%, #fff 0 1.8%, transparent 2.8%),
    radial-gradient(circle at 72% 8%, #fff 0 1.8%, transparent 2.8%);

  ${Bubble}.is-popping & {
    animation: ${burst} 1000ms var(--ease-out) both;
  }
`;

// A glossy white pill under the bubble. Dark text, so it reads on sky, cloud and grass.
const Label = styled.span`
  padding: 4px 14px 5px;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98) 0,
    rgba(236, 250, 255, 0.95) 50%,
    rgba(206, 240, 255, 0.95) 51%,
    rgba(236, 252, 255, 0.98) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 10px rgba(0, 40, 110, 0.3), inset 0 -1px 0 rgba(0, 90, 160, 0.2);
  font: 800 15px/1.2 var(--display-font);
  color: var(--text-on-glass);
  white-space: nowrap;

  ${Bubble}:hover &,
  ${Bubble}:focus-visible & {
    background: linear-gradient(180deg, #f6ffe6 0, #e2ffb4 50%, #c8f770 51%, #e6ffb8 100%);
  }

  ${media.phone} {
    padding: 3px 10px 4px;
    font-size: 13px;
  }
`;

const BOB = [
  { bob: '5.2s', delay: '-1.1s' },
  { bob: '6.4s', delay: '-3.3s' },
  { bob: '5.8s', delay: '-0.4s' },
  { bob: '6.9s', delay: '-2.2s' },
  { bob: '5.5s', delay: '-4.1s' },
  { bob: '6.1s', delay: '-1.7s' },
];

const POP_MS = 1000;

const SectionBubbles = () => {
  const { actions, state } = useDesktop();
  const [popping, setPopping] = useState(null);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const open = item => e => {
    if (!state.reducedMotion) {
      clearTimeout(timer.current);
      setPopping(item.key);
      timer.current = setTimeout(() => setPopping(null), POP_MS);
    }
    actions.openWindow(item.target, { from: e.currentTarget });
  };

  return (
    <Column data-front>
      <Mast>
        <Name>Peter Shamoun</Name>
        <Line>AI engineer in San Diego, CA</Line>
      </Mast>
      <nav aria-label="Sections">
        <Grid data-bubbles>
          {DESKTOP_ICONS.map((item, i) => {
            const Art = ICONS[item.icon];
            return (
              <Item key={item.key} style={{ '--bob': BOB[i].bob, '--delay': BOB[i].delay }}>
                <Bubble
                  data-icon-for={item.target}
                  className={popping === item.key ? 'is-popping' : undefined}
                  onClick={open(item)}>
                  <Film>
                    <Art size={72} />
                  </Film>
                  <Spray />
                  <Label>{item.label}</Label>
                </Bubble>
              </Item>
            );
          })}
        </Grid>
      </nav>
    </Column>
  );
};

export default SectionBubbles;
