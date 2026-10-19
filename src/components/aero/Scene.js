import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { withPrefix } from 'gatsby';
import { media } from '@styles';
import { Goldfish, Clownfish, Minnow, Butterfly, Sparkle } from './art';

const asset = name => withPrefix(`/aero/scene/${name}`);

// The scene behind everything: the meadow plate, the globe with its aquarium, ivy, sparkles and
// the grass in front. All of it is decoration (aria-hidden); the controls that sit on it are
// SectionBubbles, GameShelf and the Deck.
//
// The globe's box is 1200 x 1400 in its drawings, so its size is one length, --globe-h, and
// everything inside is placed in percentages of that box. The masthead and the bubbles read the
// same custom properties (set on #content) to stay clear of it.
//
// Pointer parallax: Scene writes --px and --py (-1 to 1) on its root from a pointermove, once
// per frame. Layers move by different amounts. Nothing re-renders.

const Root = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: var(--z-wallpaper);
  pointer-events: none;
  --px: 0;
  --py: 0;
`;

// Each layer moves `--depth` px per unit of pointer travel.
const Layer = styled.div`
  position: absolute;
  inset: 0;
  transform: translate3d(
    calc(var(--px) * var(--depth, 0px)),
    calc(var(--py) * var(--depth, 0px) * 0.5),
    0
  );
  transition: transform 600ms var(--ease-out);
  will-change: transform;
`;

const Plate = styled.picture`
  position: absolute;
  inset: -16px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 58% 60%;
  }
`;

// ---------------------------------------------------------------- the globe

const GlobeBox = styled.div`
  position: absolute;
  left: calc(var(--globe-x) - var(--globe-h) * 3 / 7);
  bottom: var(--globe-bottom);
  width: calc(var(--globe-h) * 6 / 7);
  height: var(--globe-h);

  > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
`;

// The water part of the ball, clipped to its circle. Fish and bubbles live here, between the
// world drawing and the glass drawing. Sphere: centre (600, 580), r 556 in the 1200 x 1400 box.
const Tank = styled.div`
  position: absolute;
  left: ${(44 / 1200) * 100}%;
  top: ${(24 / 1400) * 100}%;
  width: ${(1112 / 1200) * 100}%;
  height: ${(1112 / 1400) * 100}%;
  clip-path: circle(50% at 50% 50%);
`;

const swim = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(100%);
  }
`;

// Faces right on the way out and left on the way back: half the cycle each.
const face = keyframes`
  0%,
  49.99% {
    transform: scaleX(1);
  }

  50%,
  100% {
    transform: scaleX(-1);
  }
`;

const bob = keyframes`
  from {
    transform: translateY(-6%);
  }

  to {
    transform: translateY(6%);
  }
`;

const wag = keyframes`
  from {
    transform: rotate(-9deg) scaleY(0.92);
  }

  to {
    transform: rotate(9deg) scaleY(1.06);
  }
`;

// A lane: its width is how far the fish travels. The fish rides its left edge.
const Lane = styled.div`
  position: absolute;
  left: var(--l);
  top: var(--t);
  width: var(--travel);
  height: 0;
  animation: ${swim} var(--dur) ease-in-out var(--delay) infinite alternate;
`;

const Fish = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: var(--size);
  transform-origin: 50% 50%;
  animation: ${face} calc(var(--dur) * 2) linear var(--delay) infinite;

  > div {
    animation: ${bob} var(--bob, 2.6s) ease-in-out infinite alternate;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
    filter: drop-shadow(0 4px 4px rgba(2, 40, 90, 0.35));
  }

  .fish__tail {
    transform-box: fill-box;
    transform-origin: 100% 50%;
    animation: ${wag} var(--wag, 0.5s) ease-in-out infinite alternate;
  }
`;

const rise = keyframes`
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.6);
  }

  12% {
    opacity: 1;
  }

  50% {
    transform: translate(6px, -55%) scale(0.9);
  }

  88% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(-4px, -110%) scale(1.1);
  }
`;

// Rising bubbles: one column per bubble, from the weed to the surface.
const Column = styled.span`
  position: absolute;
  left: var(--x);
  top: 48%;
  width: var(--s);
  height: 46%;
  animation: ${rise} var(--dur) linear var(--delay) infinite;
  transform-origin: 50% 100%;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(
      circle at 32% 30%,
      #ffffff 0 14%,
      rgba(255, 255, 255, 0.25) 15% 55%,
      rgba(200, 250, 255, 0.85) 75%,
      rgba(255, 255, 255, 0.95) 100%
    );
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
  }
`;

const flap = keyframes`
  0%,
  70%,
  100% {
    transform: scaleX(1);
  }

  76%,
  88% {
    transform: scaleX(0.35);
  }

  82%,
  94% {
    transform: scaleX(0.9);
  }
`;

const ButterflyBox = styled.div`
  position: absolute;
  left: 68%;
  top: 3%;
  width: 16%;
  transform: rotate(16deg);

  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
    filter: drop-shadow(0 6px 6px rgba(0, 40, 100, 0.3));
  }

  .bfly__wing {
    transform-box: fill-box;
    animation: ${flap} 5s ease-in-out infinite;
  }

  .bfly__wing--l {
    transform-origin: 100% 50%;
  }

  .bfly__wing--r {
    transform-origin: 0% 50%;
  }
`;

const twinkle = keyframes`
  0%,
  100% {
    opacity: 0.15;
    transform: scale(0.4) rotate(0deg);
  }

  50% {
    opacity: 1;
    transform: scale(1) rotate(45deg);
  }
`;

const Star = styled.span`
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  animation: ${twinkle} var(--dur) ease-in-out var(--delay) infinite;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.95))
    drop-shadow(0 0 14px rgba(140, 230, 255, 0.9));

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

// ---------------------------------------------------------------- ivy and grass

const Ivy = styled.img`
  position: absolute;
  top: -8px;
  width: var(--w);
  height: auto;
  filter: drop-shadow(0 10px 10px rgba(0, 40, 20, 0.35));

  &[data-side='right'] {
    right: -18px;
  }

  &[data-side='left'] {
    left: -24px;
    transform: scaleX(-1);
  }

  ${media.phone} {
    &[data-side='left'] {
      display: none;
    }

    &[data-side='right'] {
      right: -40px;
      width: 150px;
    }
  }
`;

const Blades = styled.img`
  position: absolute;
  left: -40px;
  right: -40px;
  bottom: -6px;
  width: calc(100% + 80px);
  height: clamp(90px, 15vh, 170px);
  object-fit: cover;
  object-position: 50% 100%;
`;

// Out-of-focus bubbles right in front of the lens, for depth.
const Bokeh = styled.span`
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    rgba(255, 255, 255, 0.55) 0 8%,
    rgba(255, 255, 255, 0.05) 30% 62%,
    rgba(190, 245, 255, 0.4) 86%,
    rgba(255, 255, 255, 0.6) 100%
  );
  filter: blur(var(--blur, 3px));
  opacity: 0.8;
`;

// ---------------------------------------------------------------- bubbles you can pop

const drift = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(var(--sway), -55vh, 0);
  }

  to {
    transform: translate3d(0, -115vh, 0);
  }
`;

const popOut = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }

  40% {
    transform: scale(1.3);
    opacity: 0.9;
  }

  100% {
    transform: scale(1.6);
    opacity: 0;
  }
`;

// A bubble rising from the meadow. A press pops it; it comes back from the grass on its next
// trip. Pointer only: they are decoration, so they are not in the tab order.
const Floater = styled.span`
  position: absolute;
  left: var(--x);
  top: 100%;
  width: var(--s);
  height: var(--s);
  pointer-events: auto;
  cursor: pointer;
  animation: ${drift} var(--dur) linear var(--delay) infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 26%, #ffffff 0 7%, transparent 8%),
      radial-gradient(
        circle,
        rgba(255, 255, 255, 0.04) 0 58%,
        rgba(170, 240, 255, 0.35) 76%,
        rgba(255, 255, 255, 0.85) 100%
      );
    box-shadow: inset 0 -4px 10px rgba(184, 255, 120, 0.35);
  }

  &.is-popped::before {
    animation: ${popOut} 260ms var(--ease-out) forwards;
  }

  ${media.phone} {
    display: none;
  }
`;

const FLOATERS = [
  { x: '36vw', s: '46px', dur: 19, delay: -4, sway: '30px' },
  { x: '40vw', s: '26px', dur: 15, delay: -11, sway: '-24px' },
  { x: '33vw', s: '34px', dur: 23, delay: -17, sway: '40px' },
  { x: '84vw', s: '38px', dur: 21, delay: -2, sway: '-30px' },
  { x: '90vw', s: '24px', dur: 16, delay: -9, sway: '26px' },
  { x: '79vw', s: '56px', dur: 27, delay: -20, sway: '-40px' },
];

const pop = e => {
  const el = e.currentTarget;
  if (!el.classList.contains('is-popped')) {
    el.classList.add('is-popped');
  }
};

const unpop = e => e.currentTarget.classList.remove('is-popped');

// ---------------------------------------------------------------- lens flare

// Ghosts of the sun on the lens, strung along the line from the sun (top right of the globe)
// through the middle of the screen. They sit in front of everything and slide against the
// pointer, the way a real flare moves when the camera does.
const Ghost = styled.span`
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
  border-radius: 50%;
  mix-blend-mode: screen;
  opacity: var(--o);

  &[data-kind='disc'] {
    background: radial-gradient(circle, var(--c) 0 55%, transparent 72%);
  }

  &[data-kind='ring'] {
    background: radial-gradient(circle, transparent 58%, var(--c) 66%, transparent 74%);
  }

  &[data-kind='streak'] {
    width: calc(var(--s) * 6);
    height: 3px;
    margin: -1.5px 0 0 calc(var(--s) * -3);
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, var(--c), transparent);
    transform: rotate(-24deg);
  }

  ${media.phone} {
    display: none;
  }
`;

const GHOSTS = [
  { kind: 'streak', x: '71%', y: '9%', s: '90px', c: 'rgba(255, 255, 255, 0.9)', o: 0.7 },
  { kind: 'disc', x: '52%', y: '30%', s: '54px', c: 'rgba(180, 245, 255, 0.5)', o: 0.55 },
  { kind: 'ring', x: '46%', y: '38%', s: '120px', c: 'rgba(200, 255, 160, 0.55)', o: 0.6 },
  { kind: 'disc', x: '37%', y: '52%', s: '26px', c: 'rgba(255, 255, 255, 0.7)', o: 0.6 },
  { kind: 'ring', x: '28%', y: '64%', s: '70px', c: 'rgba(150, 230, 255, 0.6)', o: 0.5 },
  { kind: 'disc', x: '20%', y: '76%', s: '150px', c: 'rgba(140, 220, 255, 0.18)', o: 0.6 },
];

const FISH = [
  // kind, top in the tank, lane left, travel, size, seconds, delay, tail-wag seconds
  { kind: 'gold', t: '63%', l: '10%', travel: '58%', size: '19%', dur: 15, delay: -3, wag: 0.45 },
  { kind: 'gold', t: '74%', l: '20%', travel: '48%', size: '15%', dur: 12, delay: -9, wag: 0.4 },
  { kind: 'clown', t: '56%', l: '18%', travel: '52%', size: '13%', dur: 10, delay: -1, wag: 0.3 },
  { kind: 'clown', t: '82%', l: '30%', travel: '36%', size: '10%', dur: 9, delay: -6, wag: 0.28 },
  { kind: 'minnow', t: '60%', l: '30%', travel: '50%', size: '7%', dur: 8, delay: -2, wag: 0.22 },
  { kind: 'minnow', t: '62%', l: '34%', travel: '50%', size: '6%', dur: 8, delay: -2.3, wag: 0.2 },
  {
    kind: 'minnow',
    t: '58%',
    l: '36%',
    travel: '50%',
    size: '6.5%',
    dur: 8,
    delay: -2.6,
    wag: 0.24,
  },
];

const ART = { gold: Goldfish, clown: Clownfish, minnow: Minnow };

const BUBBLES = [
  { x: '17%', s: '1.6%', dur: 7, delay: -1 },
  { x: '19%', s: '1%', dur: 5.5, delay: -3 },
  { x: '62%', s: '1.4%', dur: 6.5, delay: -2 },
  { x: '64%', s: '0.9%', dur: 5, delay: -4.5 },
  { x: '84%', s: '1.8%', dur: 8, delay: -5 },
  { x: '47%', s: '1.1%', dur: 6, delay: -0.5 },
];

const STARS = [
  // on the globe (box %) and in the sky (viewport %), see the two lists below
  { x: '22%', y: '15%', s: '7%', dur: 3.2, delay: -1 },
  { x: '78%', y: '44%', s: '4%', dur: 2.6, delay: -2 },
  { x: '10%', y: '52%', s: '3.5%', dur: 3.8, delay: -0.4 },
  { x: '90%', y: '20%', s: '4.5%', dur: 3, delay: -2.6 },
];

const SKY_STARS = [
  { x: '31%', y: '14%', s: '26px', dur: 3.4, delay: -1.2 },
  { x: '44%', y: '30%', s: '16px', dur: 2.8, delay: -0.3 },
  { x: '86%', y: '62%', s: '22px', dur: 3.9, delay: -2.1 },
  { x: '40%', y: '58%', s: '14px', dur: 2.5, delay: -1.7 },
];

const Scene = () => {
  const ref = useRef(null);

  // Pointer parallax on fine pointers only, and never with reduced motion.
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia) {
      return undefined;
    }
    const fine = window.matchMedia('(pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let next = null;
    const apply = () => {
      frame = 0;
      if (next) {
        el.style.setProperty('--px', next.x.toFixed(3));
        el.style.setProperty('--py', next.y.toFixed(3));
      }
    };
    const onMove = e => {
      if (!fine.matches || calm.matches) {
        return;
      }
      next = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
      if (!frame) {
        frame = requestAnimationFrame(apply);
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Root ref={ref} aria-hidden="true" data-scene>
      <Layer style={{ '--depth': '-8px' }}>
        <Plate>
          <source media="(max-width: 576px)" type="image/webp" srcSet={asset('plate-phone.webp')} />
          <source media="(max-width: 576px)" srcSet={asset('plate-phone.jpg')} />
          <source type="image/webp" srcSet={asset('plate-desktop.webp')} />
          <img
            src={asset('plate-desktop.jpg')}
            width={2560}
            height={1440}
            alt=""
            // React 17 does not know fetchPriority; the lowercase attribute reaches the DOM.
            // eslint-disable-next-line react/no-unknown-property
            fetchpriority="high"
            decoding="async"
          />
        </Plate>
        {SKY_STARS.map(s => (
          <Star
            key={s.x}
            style={{
              '--x': s.x,
              '--y': s.y,
              '--s': s.s,
              '--dur': `${s.dur}s`,
              '--delay': `${s.delay}s`,
            }}>
            <Sparkle />
          </Star>
        ))}
      </Layer>

      <Layer style={{ '--depth': '-16px' }}>
        <GlobeBox data-globe>
          <img
            src={asset('globe-back.webp')}
            srcSet={`${asset('globe-back-600.webp')} 600w, ${asset('globe-back.webp')} 1200w`}
            sizes="(max-width: 576px) 380px, 760px"
            width={1200}
            height={1400}
            alt=""
            decoding="async"
          />
          <Tank>
            {BUBBLES.map(b => (
              <Column
                key={b.x}
                style={{ '--x': b.x, '--s': b.s, '--dur': `${b.dur}s`, '--delay': `${b.delay}s` }}
              />
            ))}
            {FISH.map((f, i) => {
              const Art = ART[f.kind];
              return (
                <Lane
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  style={{
                    '--t': f.t,
                    '--l': f.l,
                    '--travel': f.travel,
                    '--dur': `${f.dur}s`,
                    '--delay': `${f.delay}s`,
                  }}>
                  <Fish
                    style={{
                      // the fish's width as a share of its lane, so it is f.size of the tank
                      '--size': `${(parseFloat(f.size) / parseFloat(f.travel)) * 100}%`,
                      '--wag': `${f.wag}s`,
                    }}>
                    <div>
                      <Art id={`fish${i}`} />
                    </div>
                  </Fish>
                </Lane>
              );
            })}
          </Tank>
          <img
            src={asset('globe-front.webp')}
            srcSet={`${asset('globe-front-600.webp')} 600w, ${asset('globe-front.webp')} 1200w`}
            sizes="(max-width: 576px) 380px, 760px"
            width={1200}
            height={1400}
            alt=""
            decoding="async"
          />
          {STARS.map(s => (
            <Star
              key={s.x}
              style={{
                '--x': s.x,
                '--y': s.y,
                '--s': s.s,
                '--dur': `${s.dur}s`,
                '--delay': `${s.delay}s`,
              }}>
              <Sparkle />
            </Star>
          ))}
          <ButterflyBox>
            <Butterfly />
          </ButterflyBox>
        </GlobeBox>
      </Layer>

      <Layer style={{ '--depth': '-22px' }}>
        <Ivy
          src={asset('ivy.svg')}
          width={520}
          height={760}
          alt=""
          data-side="right"
          style={{ '--w': 'clamp(220px, 24vw, 440px)' }}
        />
        <Ivy
          src={asset('ivy.svg')}
          width={520}
          height={760}
          alt=""
          data-side="left"
          style={{ '--w': 'clamp(160px, 16vw, 300px)' }}
        />
      </Layer>

      <Layer style={{ '--depth': '-28px' }}>
        {FLOATERS.map(b => (
          <Floater
            key={b.x}
            onPointerDown={pop}
            onAnimationIteration={unpop}
            style={{
              '--x': b.x,
              '--s': b.s,
              '--dur': `${b.dur}s`,
              '--delay': `${b.delay}s`,
              '--sway': b.sway,
            }}
          />
        ))}
      </Layer>

      <Layer style={{ '--depth': '26px' }}>
        {GHOSTS.map(g => (
          <Ghost
            key={g.x}
            data-kind={g.kind}
            style={{ '--x': g.x, '--y': g.y, '--s': g.s, '--c': g.c, '--o': g.o }}
          />
        ))}
      </Layer>

      <Layer style={{ '--depth': '-34px' }}>
        <Blades src={asset('blades.svg')} width={1600} height={180} alt="" />
        <Bokeh style={{ '--x': '-3%', '--y': '72%', '--s': '150px', '--blur': '4px' }} />
        <Bokeh style={{ '--x': '93%', '--y': '80%', '--s': '110px', '--blur': '3px' }} />
      </Layer>
    </Root>
  );
};

export default Scene;
