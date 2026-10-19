// Glossy drawing helpers for the game boards: beads, bricks and cells with a lit top half, and the
// painted backgrounds. Every function draws onto a canvas context in natural pixels.

// The text font for anything drawn on a canvas. Open Sans is self-hosted, so it always exists.
export const FONT = '600 16px "Segoe UI", "Open Sans", sans-serif';

// Darkens (amount < 0) or lightens (amount > 0) a #rrggbb colour by a fraction.
export const shade = (hex, amount) => {
  const k = Math.abs(amount);
  const target = amount < 0 ? 0 : 255;
  const out = [1, 3, 5].map(i => {
    const v = parseInt(hex.slice(i, i + 2), 16);
    return Math.round(v + (target - v) * k);
  });
  return `#${out.map(v => v.toString(16).padStart(2, '0')).join('')}`;
};

// A rounded rectangle path, built by hand so older browsers without roundRect still work.
const rrPath = (ctx, x, y, w, h, r) => {
  const k = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.arcTo(x + w, y, x + w, y + h, k);
  ctx.arcTo(x + w, y + h, x, y + h, k);
  ctx.arcTo(x, y + h, x, y, k);
  ctx.arcTo(x, y, x + w, y, k);
  ctx.closePath();
};

// A rounded rect in colour, a 1px edge one shade darker, and a white sheen over the top half.
export const glossRect = (ctx, x, y, w, h, color, r = 2) => {
  ctx.save();
  rrPath(ctx, x, y, w, h, r);
  ctx.fillStyle = color;
  ctx.fill();
  rrPath(ctx, x + 0.5, y + 0.5, w - 1, h - 1, Math.max(0, r - 0.5));
  ctx.strokeStyle = shade(color, -0.3);
  ctx.lineWidth = 1;
  ctx.stroke();
  rrPath(ctx, x, y, w, h, r);
  ctx.clip();
  const sheen = ctx.createLinearGradient(0, y, 0, y + h / 2);
  sheen.addColorStop(0, 'rgba(255,255,255,0.45)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(x, y, w, h / 2);
  ctx.restore();
};

// The same recipe for a bead or a ball, centred on (x, y), with a small highlight at top left.
export const glossCircle = (ctx, x, y, r, color) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, r - 0.5, 0, Math.PI * 2);
  ctx.strokeStyle = shade(color, -0.3);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  const sheen = ctx.createLinearGradient(0, y - r, 0, y);
  sheen.addColorStop(0, 'rgba(255,255,255,0.45)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(x - r, y - r, r * 2, r);
  ctx.beginPath();
  ctx.ellipse(x - r * 0.35, y - r * 0.4, r * 0.28, r * 0.2, -0.6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fill();
  ctx.restore();
};

// Small seeded generator, so the same seed always gives the same stars.
const seeded = seed => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// A deep night-sky gradient with 30 to 40 faint stars.
export const nightSky = (ctx, w, h, seed) => {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#0b2b52');
  sky.addColorStop(1, '#04142a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  const rand = seeded(seed);
  const count = 30 + Math.floor(rand() * 11);
  for (let i = 0; i < count; i += 1) {
    const x = Math.floor(rand() * w);
    const y = Math.floor(rand() * h);
    const a = (0.15 + rand() * 0.35).toFixed(2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(x, y, 1, 1);
  }
};

// A soft green lawn. With a cell size, every other cell gets a very faint white checker.
export const grass = (ctx, w, h, cell) => {
  const lawn = ctx.createLinearGradient(0, 0, 0, h);
  lawn.addColorStop(0, '#c8f0a4');
  lawn.addColorStop(1, '#86cf5c');
  ctx.fillStyle = lawn;
  ctx.fillRect(0, 0, w, h);
  if (cell) {
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    for (let y = 0; y * cell < h; y += 1) {
      for (let x = 0; x * cell < w; x += 1) {
        if ((x + y) % 2 === 0) {
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    }
  }
};

// Paints a background once into an offscreen canvas, so a board redrawn every frame can copy it.
// The canvas is sized to the natural board, at the same device scale that setupCanvas uses.
export const bake = (w, h, draw, scale) => {
  const ratio = scale || Math.min(3, Math.max(1, Math.ceil(window.devicePixelRatio || 1)));
  const canvas = document.createElement('canvas');
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw(ctx);
  return canvas;
};
