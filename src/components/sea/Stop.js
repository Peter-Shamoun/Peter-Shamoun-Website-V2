import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { withPrefix } from 'gatsby';
import useAwake from './useAwake';
import Bubbles from './Bubbles';

// One stop on the dive: a section with its photograph behind it. The photo reaches SEAM above
// the section and fades in there over the stop before it, and reaches SEAM below, where the next
// stop fades in over it, so the plates cross-fade into one continuous descent.

const drift = keyframes`
  from { transform: translate3d(0, -5%, 0); }
  to { transform: translate3d(0, 5%, 0); }
`;

const shimmerA = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-512px, -256px, 0); }
`;

const shimmerB = keyframes`
  from { transform: translate3d(0, 0, 0) scale(1.5); }
  to { transform: translate3d(384px, -512px, 0) scale(1.5); }
`;

const Section = styled.section`
  --seam: 14vh;
  position: relative;
  color: var(--text-on-water);

  &:last-of-type > [data-backdrop] {
    bottom: 0;
  }

  /* The first stop sits under the hero, which fades out over it. */
  &[data-first] > [data-backdrop] {
    top: calc(-2 * var(--seam));
    -webkit-mask-image: none;
    mask-image: none;
  }
`;

const Backdrop = styled.div`
  position: absolute;
  z-index: -1;
  left: 0;
  right: 0;
  top: calc(-1 * var(--seam));
  bottom: calc(-1 * var(--seam));
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 calc(var(--seam) * 2), #000 100%);
  mask-image: linear-gradient(180deg, transparent 0, #000 calc(var(--seam) * 2), #000 100%);

  img {
    position: absolute;
    left: 0;
    top: -6%;
    width: 100%;
    height: 112%;
    object-fit: cover;
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      img {
        animation: ${drift} linear both;
        animation-timeline: view();
      }
    }
  }
`;

// Light from the waves rippling over everything: two caustic layers drifting against each other.
const Caustics = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  mix-blend-mode: soft-light;
  opacity: ${props => props.$strength};

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: -768px;
    background: url(${withPrefix('/sea/fx/caustic.webp')}) 0 0 / 512px 512px repeat;
  }

  &::after {
    opacity: 0.7;
    background-size: 768px 768px;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-awake='true']::before {
      animation: ${shimmerA} 46s linear infinite;
    }
    &[data-awake='true']::after {
      animation: ${shimmerB} 63s linear infinite;
    }
  }
`;

// Each plate's average colour, shown while its photograph loads.
const TINT = {
  surface: '#16a6d8',
  shallows: '#3bb2bc',
  rays: '#3d92b2',
  dolphins: '#3c86b7',
  deep: '#0f69ba',
  school: '#3ca9d0',
};

const srcSet = (name, ext) =>
  [960, 1600, 2400].map(w => `${withPrefix(`/sea/plates/${name}-${w}.${ext}`)} ${w}w`).join(', ');

const Stop = ({ id, plate, focus, caustics, bubbles, first, labelledBy, children, className }) => {
  const [ref, awake] = useAwake();
  return (
    <Section
      id={id}
      aria-labelledby={labelledBy}
      className={className}
      ref={ref}
      data-first={first || undefined}>
      <Backdrop data-backdrop aria-hidden="true" style={{ backgroundColor: TINT[plate] }}>
        <picture>
          <source type="image/webp" srcSet={srcSet(plate, 'webp')} sizes="100vw" />
          <img
            src={withPrefix(`/sea/plates/${plate}-1600.jpg`)}
            srcSet={srcSet(plate, 'jpg')}
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
            style={{ objectPosition: focus }}
          />
        </picture>
        {caustics ? <Caustics $strength={caustics} data-awake={awake} /> : null}
        {bubbles ? <Bubbles count={bubbles} awake={awake} seed={id.length * 7} /> : null}
      </Backdrop>
      {children}
    </Section>
  );
};

Stop.propTypes = {
  id: PropTypes.string.isRequired,
  plate: PropTypes.string.isRequired,
  focus: PropTypes.string,
  caustics: PropTypes.number,
  bubbles: PropTypes.number,
  first: PropTypes.bool,
  labelledBy: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

Stop.defaultProps = {
  focus: '50% 50%',
};

export default Stop;
