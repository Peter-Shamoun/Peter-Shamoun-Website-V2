import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { withPrefix } from 'gatsby';

// Bubbles rising through a stop. Positions come from a fixed seed so the server render and the
// browser agree. They only move while the stop is on screen.

const rise = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -130vh, 0); }
`;

const sway = keyframes`
  from { translate: -10px 0; }
  to { translate: 10px 0; }
`;

const Field = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const Bubble = styled.span`
  position: absolute;
  bottom: -60px;
  display: block;
  background: url(${withPrefix('/sea/fx/bubble.webp')}) center / contain no-repeat;
  opacity: 0.9;
  will-change: transform;

  @media (prefers-reduced-motion: no-preference) {
    [data-awake='true'] > & {
      animation: ${rise} var(--dur) linear var(--delay) infinite,
        ${sway} calc(var(--dur) / 5) ease-in-out var(--delay) infinite alternate;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    bottom: auto;
    top: var(--still);
  }
`;

const rand = seed => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const Bubbles = ({ count, awake, seed }) => {
  const items = useMemo(() => {
    const r = rand(seed + 11);
    return Array.from({ length: count }, (_, i) => {
      const size = 6 + Math.round(r() ** 2 * 34);
      return {
        key: i,
        left: `${Math.round(r() * 1000) / 10}%`,
        size,
        dur: `${Math.round(9 + (40 - size) * 0.5 + r() * 8)}s`,
        delay: `${-Math.round(r() * 30)}s`,
        still: `${Math.round(10 + r() * 80)}%`,
      };
    });
  }, [count, seed]);

  return (
    <Field data-awake={awake} aria-hidden="true">
      {items.map(b => (
        <Bubble
          key={b.key}
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            '--dur': b.dur,
            '--delay': b.delay,
            '--still': b.still,
          }}
        />
      ))}
    </Field>
  );
};

Bubbles.propTypes = {
  count: PropTypes.number.isRequired,
  awake: PropTypes.bool,
  seed: PropTypes.number,
};

Bubbles.defaultProps = {
  seed: 1,
};

export default Bubbles;
