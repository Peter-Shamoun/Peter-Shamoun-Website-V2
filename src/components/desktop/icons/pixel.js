import React from 'react';
import PropTypes from 'prop-types';

// Shared helpers for the pixel icon set. A drawing is a flat list of integer
// rectangles [x, y, width, height, fill] on the viewBox grid. Every rectangle is
// one pixel block or a run of pixel blocks, so the artwork stays crisp at any size.

export const PALETTE = {
  K: '#000000',
  W: '#FFFFFF',
  G: '#CCCCCC',
  D: '#707070',
  S: '#333333',
  B: '#0B17B4',
  N: '#011E75',
  T: '#22527F',
  L: '#60CD46',
  R: '#CC1B1B',
  Y: '#F2C230',
  C: '#00A8A8',
};

// Run-length rows: 'K3 .2 W1' means K K K . . W. A token without a count is one cell.
export const expandRows = rows =>
  rows.map(row =>
    row
      .split(' ')
      .map(token => token[0].repeat(Number(token.slice(1)) || 1))
      .join(''),
  );

// One character per cell. keyOf maps a character to a palette key; '.' or any
// unmapped character leaves the cell empty. Runs of the same character are merged.
export const fromGrid = (grid, x0 = 0, y0 = 0, keyOf = ch => ch) => {
  const ops = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === ch) {
        end += 1;
      }
      const fill = PALETTE[keyOf(ch)];
      if (fill) {
        ops.push([x0 + x, y0 + y, end - x, 1, fill]);
      }
      x = end;
    }
  });
  return ops;
};

// A single-colour shape: every '#' cell takes the given palette key.
export const mask = (rows, x0, y0, key) => fromGrid(rows, x0, y0, ch => (ch === '#' ? key : '.'));

export const box = (x, y, w, h, key) => [[x, y, w, h, PALETTE[key]]];

// A box with a 1 px black edge and a fill inside.
export const frame = (x, y, w, h, key) => [
  [x, y, w, h, PALETTE.K],
  [x + 1, y + 1, w - 2, h - 2, PALETTE[key]],
];

// A line of pixel blocks between two cells (thick = block size in cells).
export const pline = (x0, y0, x1, y1, key, thick = 1) => {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  const ops = [];
  for (let i = 0; i <= steps; i += 1) {
    const x = Math.round(x0 + ((x1 - x0) * i) / steps);
    const y = Math.round(y0 + ((y1 - y0) * i) / steps);
    ops.push([x, y, thick, thick, PALETTE[key]]);
  }
  return ops;
};

// A filled pixel circle of radius r centred on cell (cx, cy).
export const disc = (cx, cy, r, key) => {
  const ops = [];
  for (let dy = -r; dy <= r; dy += 1) {
    const half = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5);
    ops.push([cx - half, cy + dy, half * 2 + 1, 1, PALETTE[key]]);
  }
  return ops;
};

// A heraldic shield: black edge, straight top, tapering to a point at the bottom.
export const shield = (x0, y0, w, h, key) => {
  const ops = [];
  for (let y = 0; y < h; y += 1) {
    const inset = y < h * 0.45 ? 0 : Math.floor(((y - h * 0.45) * (w / 2 - 1)) / (h * 0.55));
    const rowW = w - inset * 2;
    ops.push([x0 + inset, y0 + y, rowW, 1, PALETTE.K]);
    if (y > 0 && rowW > 2) {
      ops.push([x0 + inset + 1, y0 + y, rowW - 2, 1, PALETTE[key]]);
    }
  }
  return ops;
};

export const shift = (ops, dx, dy) => ops.map(([x, y, w, h, c]) => [x + dx, y + dy, w, h, c]);

const toRects = ops =>
  ops.map(([x, y, w, h, fill], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />);

// Builds one component with the shared signature ({ size, title, ...rest }).
// Renders one inline <svg>: decorative unless a title is given.
export const makeIcon = (name, [vbW, vbH], defaultSize, ops, svgProps = {}) => {
  const rects = toRects(ops);

  const Icon = ({ size, title, ...rest }) => {
    const width = size || defaultSize;
    const dims =
      typeof width === 'number'
        ? { width, height: Math.round((width * vbH) / vbW) }
        : { width: '100%' };
    const a11y = title ? { role: 'img' } : { 'aria-hidden': 'true' };

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${vbW} ${vbH}`}
        shapeRendering="crispEdges"
        focusable="false"
        {...svgProps}
        {...dims}
        {...a11y}
        {...rest}>
        {title ? <title>{title}</title> : null}
        {rects}
      </svg>
    );
  };

  Icon.displayName = name;
  Icon.propTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
  };

  return Icon;
};
