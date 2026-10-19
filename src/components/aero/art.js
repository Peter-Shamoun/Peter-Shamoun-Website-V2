import React from 'react';
import PropTypes from 'prop-types';

// Drawn art for the scene: fish, the glass butterfly, sparkles and the seven-segment readout.
// Everything here is decorative (aria-hidden) except SevenSeg, which carries a text label.
// Gradient ids are prefixed per drawing so several copies on a page share one definition.

/** A fantail goldfish facing right. 120 x 72. The tail wags from its root (.fish__tail). */
export const Goldfish = ({ id }) => (
  <svg viewBox="0 0 120 72" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id={`${id}-body`} cx="0.62" cy="0.38" r="0.7">
        <stop offset="0" stopColor="#ffe08a" />
        <stop offset="0.35" stopColor="#ffa22e" />
        <stop offset="0.8" stopColor="#ff6a00" />
        <stop offset="1" stopColor="#d94400" />
      </radialGradient>
      <linearGradient id={`${id}-fin`} x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#ff8a1e" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffd27a" stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <g className="fish__tail">
      <path
        d="M42 36 C30 22 14 6 4 10 C12 20 14 28 20 34 C14 40 10 52 2 62 C14 66 30 50 42 38 Z"
        fill={`url(#${id}-fin)`}
      />
      <path
        d="M40 36 C30 28 18 18 8 14 M40 37 C28 40 18 50 8 58 M40 36 L10 36"
        stroke="#ffb35c"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
    </g>
    <path d="M58 18 C64 4 80 4 88 16 C78 14 68 16 62 22 Z" fill={`url(#${id}-fin)`} />
    <ellipse cx="68" cy="37" rx="32" ry="21" fill={`url(#${id}-body)`} />
    <path d="M62 50 C60 60 52 66 46 64 C52 58 54 54 56 48 Z" fill={`url(#${id}-fin)`} />
    <path
      d="M56 30 a6 6 0 0 1 8 6 M66 26 a6 6 0 0 1 8 6 M60 40 a6 6 0 0 1 8 6"
      stroke="#ffd18a"
      strokeWidth="1.2"
      fill="none"
      opacity="0.7"
    />
    <ellipse cx="66" cy="25" rx="20" ry="6" fill="#ffffff" opacity="0.55" />
    <circle cx="88" cy="32" r="6.5" fill="#ffffff" />
    <circle cx="89.5" cy="32.5" r="3.8" fill="#10223a" />
    <circle cx="91" cy="30.5" r="1.4" fill="#ffffff" />
    <path d="M98 41 q3 2 0 4" stroke="#b23a00" strokeWidth="1.4" fill="none" />
  </svg>
);

Goldfish.propTypes = { id: PropTypes.string.isRequired };

/** A clownfish facing right. 110 x 60. */
export const Clownfish = ({ id }) => (
  <svg viewBox="0 0 110 60" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffb44a" />
        <stop offset="0.55" stopColor="#ff7a12" />
        <stop offset="1" stopColor="#e05400" />
      </linearGradient>
      <clipPath id={`${id}-clip`}>
        <ellipse cx="56" cy="30" rx="36" ry="18" />
      </clipPath>
    </defs>
    <g className="fish__tail">
      <path
        d="M24 30 C16 18 8 14 4 16 C8 24 8 36 4 44 C8 46 16 42 24 30 Z"
        fill={`url(#${id}-body)`}
        stroke="#1a1a1a"
        strokeWidth="2"
      />
    </g>
    <path
      d="M44 14 C52 4 70 4 76 14 Z"
      fill={`url(#${id}-body)`}
      stroke="#1a1a1a"
      strokeWidth="2"
    />
    <ellipse cx="56" cy="30" rx="36" ry="18" fill={`url(#${id}-body)`} />
    <g clipPath={`url(#${id}-clip)`}>
      {[34, 58, 80].map(x => (
        <rect
          key={x}
          x={x - 5}
          y="0"
          width="10"
          height="60"
          rx="5"
          fill="#ffffff"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
      ))}
    </g>
    <ellipse cx="56" cy="30" rx="36" ry="18" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
    <path
      d="M54 40 C54 50 46 54 42 52 C46 48 48 44 48 40 Z"
      fill={`url(#${id}-body)`}
      stroke="#1a1a1a"
      strokeWidth="1.5"
    />
    <ellipse cx="58" cy="20" rx="22" ry="5" fill="#ffffff" opacity="0.5" />
    <circle cx="80" cy="25" r="4.6" fill="#ffffff" />
    <circle cx="81" cy="25.5" r="2.8" fill="#10223a" />
    <circle cx="82" cy="24" r="1" fill="#ffffff" />
  </svg>
);

Clownfish.propTypes = { id: PropTypes.string.isRequired };

/** A small aqua-and-lime fish, for the school. 70 x 30. */
export const Minnow = ({ id }) => (
  <svg viewBox="0 0 70 30" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bff8ff" />
        <stop offset="0.45" stopColor="#18c3e8" />
        <stop offset="1" stopColor="#0a6fb8" />
      </linearGradient>
    </defs>
    <g className="fish__tail">
      <path d="M16 15 L2 5 L6 15 L2 25 Z" fill="#7fe3f0" />
    </g>
    <path d="M14 15 C22 4 50 2 66 14 C50 26 22 26 14 15 Z" fill={`url(#${id}-body)`} />
    <path d="M18 15 C30 12 46 12 62 14" stroke="#b8ff2e" strokeWidth="2.4" fill="none" />
    <circle cx="56" cy="12" r="2.6" fill="#ffffff" />
    <circle cx="56.6" cy="12.2" r="1.5" fill="#06223f" />
  </svg>
);

Minnow.propTypes = { id: PropTypes.string.isRequired };

/** A glass butterfly seen from above, wings open. 120 x 96. Wings flap from the body. */
export const Butterfly = () => (
  <svg viewBox="0 0 120 96" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="bfly-wing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e6fbff" stopOpacity="0.95" />
        <stop offset="0.5" stopColor="#5fd6ff" stopOpacity="0.7" />
        <stop offset="1" stopColor="#1a7fe0" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="bfly-wing2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d8ffb0" stopOpacity="0.9" />
        <stop offset="1" stopColor="#2bb4e8" stopOpacity="0.75" />
      </linearGradient>
    </defs>
    <g className="bfly__wing bfly__wing--l">
      <path
        d="M58 44 C40 10 10 2 6 18 C2 34 26 46 58 48 Z"
        fill="url(#bfly-wing)"
        stroke="#ffffff"
        strokeWidth="1.6"
      />
      <path
        d="M58 50 C34 52 16 66 22 82 C30 94 50 76 58 54 Z"
        fill="url(#bfly-wing2)"
        stroke="#ffffff"
        strokeWidth="1.6"
      />
      <path
        d="M56 46 C40 30 22 20 12 18 M56 47 C40 42 24 38 10 32 M56 52 C42 60 30 70 26 80"
        stroke="#ffffff"
        strokeOpacity="0.8"
        strokeWidth="1"
        fill="none"
      />
      <ellipse cx="24" cy="20" rx="10" ry="5" fill="#ffffff" opacity="0.8" />
    </g>
    <g className="bfly__wing bfly__wing--r">
      <path
        d="M62 44 C80 10 110 2 114 18 C118 34 94 46 62 48 Z"
        fill="url(#bfly-wing)"
        stroke="#ffffff"
        strokeWidth="1.6"
      />
      <path
        d="M62 50 C86 52 104 66 98 82 C90 94 70 76 62 54 Z"
        fill="url(#bfly-wing2)"
        stroke="#ffffff"
        strokeWidth="1.6"
      />
      <path
        d="M64 46 C80 30 98 20 108 18 M64 47 C80 42 96 38 110 32 M64 52 C78 60 90 70 94 80"
        stroke="#ffffff"
        strokeOpacity="0.8"
        strokeWidth="1"
        fill="none"
      />
    </g>
    <rect x="57" y="34" width="6" height="34" rx="3" fill="#0b3d74" />
    <circle cx="60" cy="32" r="4.5" fill="#0b3d74" />
    <path
      d="M58 29 C54 20 50 16 46 14 M62 29 C66 20 70 16 74 14"
      stroke="#0b3d74"
      strokeWidth="1.4"
      fill="none"
    />
    <rect x="58" y="36" width="1.6" height="26" rx="0.8" fill="#7fd8ff" />
  </svg>
);

/** A four-point sparkle. */
export const Sparkle = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <path
      d="M20 0 C21.5 13 27 18.5 40 20 C27 21.5 21.5 27 20 40 C18.5 27 13 21.5 0 20 C13 18.5 18.5 13 20 0 Z"
      fill="#ffffff"
    />
  </svg>
);

// Seven-segment digits. Segments a-g in a 22 x 40 cell; the colon is its own 8px cell.
const SEGMENTS = {
  a: '4,1 18,1 15,5 7,5',
  b: '19,2 21,4 21,18 18,20 16,18 16,6',
  c: '18,21 21,23 21,37 19,39 16,34 16,23',
  d: '4,39 18,39 15,35 7,35',
  e: '3,21 6,23 6,34 3,39 1,37 1,23',
  f: '3,2 6,6 6,18 4,20 1,18 1,4',
  g: '4,20 7,17.5 15,17.5 18,20 15,22.5 7,22.5',
};
const DIGITS = {
  0: 'abcdef',
  1: 'bc',
  2: 'abged',
  3: 'abgcd',
  4: 'fgbc',
  5: 'afgcd',
  6: 'afgedc',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcdfg',
  '-': 'g',
  ' ': '',
};

/**
 * A seven-segment LCD readout of `value` (digits, '-', ' ' and ':'). Unlit segments stay as
 * faint ghosts, the way a real LCD shows them. `label` is the accessible text.
 */
export const SevenSeg = ({ value, label, height }) => {
  const chars = String(value).split('');
  let x = 0;
  const cells = chars.map((ch, i) => {
    const key = `${i}-${ch}`;
    if (ch === ':') {
      const cell = (
        <g key={key} transform={`translate(${x} 0)`}>
          <rect x="1" y="11" width="4" height="4" rx="1" className="seg seg--on" />
          <rect x="1" y="26" width="4" height="4" rx="1" className="seg seg--on" />
        </g>
      );
      x += 8;
      return cell;
    }
    const lit = DIGITS[ch] || '';
    const cell = (
      <g key={key} transform={`translate(${x} 0) skewX(-6)`}>
        {Object.keys(SEGMENTS).map(s => (
          <polygon
            key={s}
            points={SEGMENTS[s]}
            className={lit.includes(s) ? 'seg seg--on' : 'seg'}
          />
        ))}
      </g>
    );
    x += 26;
    return cell;
  });
  const w = Math.max(x - 4, 1);
  return (
    <svg
      viewBox={`-2 0 ${w + 4} 40`}
      height={height}
      width={(height * (w + 4)) / 40}
      role="img"
      aria-label={label}
      focusable="false">
      {cells}
    </svg>
  );
};

SevenSeg.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  height: PropTypes.number,
};

SevenSeg.defaultProps = { height: 28 };
