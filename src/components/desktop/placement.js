// Popup placement (BUILD_PLAN sections 4.7 and 6 WP4). Everything here is pure: no DOM reads.
// Rectangles are { x, y, w, h } in viewport pixels.
// viewport is { w, h, top, phone, floor }: w and h are the window size, top is the top bar
// height, floor (phones only) is the top edge of the upper icon row.

const TRIES = 30;
const EDGE = 8; // gap kept from the viewport edges
const ICON_ROW = 110; // keeps the desktop icon row clear
export const PHONE_W = 260; // matches .popup on phones in GlobalStyle

const clamp = (value, lo, hi) => Math.max(lo, Math.min(value, hi));

export const overlaps = (a, b) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

const overlapArea = (a, b) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

/**
 * Returns { x, y } for a popup of size w x h, or null when no free spot is found in 30 tries.
 * exclude: rectangles the popup must not cover (wordmark, About default, open windows).
 * taken: rectangles of popups already on screen.
 * soft: rectangles the popup may cover in part, up to softLimit of its own area in total.
 * rand: injectable random source (0 <= rand() < 1).
 */
export const placePopup = ({
  w,
  h,
  viewport,
  exclude = [],
  taken = [],
  soft = [],
  softLimit = 0.5,
  rand = Math.random,
}) => {
  if (viewport.phone) {
    // Phones: a fixed spot, under the window layer. 230px below the top bar clears the phone
    // wordmark and its tagline. On a short screen the popup would reach the icon rows from
    // there, so it is skipped: the icons must stay clear.
    const y = viewport.top + 230;
    if (viewport.floor && y + h > viewport.floor - EDGE) {
      return null;
    }
    return { x: Math.round((viewport.w - PHONE_W) / 2), y };
  }

  const minX = EDGE;
  const maxX = viewport.w - w - EDGE;
  const minY = viewport.top + EDGE;
  const maxY = viewport.h - h - ICON_ROW;
  if (maxX < minX || maxY < minY) {
    return null;
  }

  const blocked = [...exclude, ...taken];
  for (let i = 0; i < TRIES; i += 1) {
    const x = Math.round(minX + rand() * (maxX - minX));
    const y = Math.round(minY + rand() * (maxY - minY));
    const rect = { x, y, w, h };
    if (blocked.some(other => overlaps(rect, other))) {
      continue;
    }
    const covered = soft.reduce((sum, other) => sum + overlapArea(rect, other), 0);
    if (covered <= softLimit * w * h) {
      return { x, y };
    }
  }
  return null;
};

/**
 * Gap list in ms for a chain of `slots` steps: slots - 1 values, starting near `start`
 * and easing to `end`. Formula from BUILD_PLAN 6 WP4:
 *   round(start + (end - start) * (1 - (1 - t) ** 0.5)), t = (k - 1) / max(1, n - 1),
 *   n = max(1, slots - 1), k = 1 .. slots - 1.
 */
export const spawnDelays = (slots, start, end = start) => {
  const n = Math.max(1, slots - 1);
  const gaps = [];
  for (let k = 1; k <= slots - 1; k += 1) {
    const t = (k - 1) / Math.max(1, n - 1);
    gaps.push(Math.round(start + (end - start) * (1 - (1 - t) ** 0.5)));
  }
  return gaps;
};

/**
 * The default rectangle of a window from the registry (BUILD_PLAN 4.5), whether or not it is open.
 * def: a WINDOWS entry. Heights given in vh are resolved against viewport.h.
 */
export const windowRect = (def, viewport) => {
  const maxH = /vh$/.test(def.maxH)
    ? (parseFloat(def.maxH) / 100) * viewport.h
    : parseFloat(def.maxH);
  const w = def.w;
  const h = Math.round(def.h || maxH);
  const cx = (def.x / 100) * viewport.w;
  const cy = (def.y / 100) * viewport.h;
  return {
    x: Math.round(clamp(cx - w / 2, EDGE, viewport.w - w - EDGE)),
    y: Math.round(clamp(cy - h / 2, viewport.top + EDGE, viewport.h - h - EDGE)),
    w,
    h,
  };
};
