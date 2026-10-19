"""Renders the small effect images in static/sea/fx/.

Usage: python3 -I design/sea/fx.py <out dir>

caustic.png  512 x 512, tiles seamlessly. Light refracted by a wavy water surface onto a flat
             floor: rays start on a grid, are bent by the surface slope, and land where they
             land; the floor's brightness is how many arrive. White on transparent.
bubble.png   256 x 256 soap bubble: clear middle, thin-film colours at the rim, a window
             highlight and a glint. Transparent.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

# ---------- caustic ----------
N = 512
SS = 4  # rays per pixel side
n = N * SS
y, x = np.mgrid[0:n, 0:n].astype(np.float32) / n * 2 * np.pi
h = np.zeros_like(x)
gx = np.zeros_like(x)
gy = np.zeros_like(x)
for _ in range(14):
    kx, ky = rng.integers(-5, 6, size=2)
    if kx == 0 and ky == 0:
        continue
    amp = 1.0 / np.hypot(kx, ky) ** 1.3
    ph = rng.uniform(0, 2 * np.pi)
    arg = kx * x + ky * y + ph
    h += amp * np.sin(arg)
    gx += amp * kx * np.cos(arg)
    gy += amp * ky * np.cos(arg)
k = 0.055 * n / (2 * np.pi)
px = (np.mgrid[0:n, 0:n][1] + gx * k) % n
py = (np.mgrid[0:n, 0:n][0] + gy * k) % n
hist, _, _ = np.histogram2d(py.ravel() / SS, px.ravel() / SS, bins=N, range=[[0, N], [0, N]])
c = hist / (SS * SS)
img = Image.fromarray(np.clip(c * 60, 0, 255).astype(np.uint8))
# wrap-around blur so the tile stays seamless
big = Image.new("L", (N * 3, N * 3))
for i in range(3):
    for j in range(3):
        big.paste(img, (i * N, j * N))
big = big.filter(ImageFilter.GaussianBlur(1.6)).crop((N, N, 2 * N, 2 * N))
a = np.asarray(big).astype(np.float32) / 255.0
a = np.clip((a - 0.18) / 0.82, 0, 1) ** 1.25
rgba = np.zeros((N, N, 4), np.uint8)
rgba[..., 0] = 235
rgba[..., 1] = 252
rgba[..., 2] = 255
rgba[..., 3] = (a * 255).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, "caustic.png"), optimize=True)
Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, "caustic.webp"), quality=86, method=6)

# ---------- bubble ----------
S = 256
SSB = 3
m = S * SSB
yy, xx = (np.mgrid[0:m, 0:m].astype(np.float32) + 0.5) / m * 2 - 1
d = np.hypot(xx, yy)
inside = d < 1
z = np.sqrt(np.clip(1 - d * d, 0, 1))
film = (1 - z) ** 2.4
th = 0.6 + 0.3 * np.sin(yy * 3.1 + xx * 1.4 + 0.8) + 0.08 * np.sin(xx * 9 + yy * 5)
irid = 0.5 + 0.5 * np.cos(2 * np.pi * (th[..., None] * np.array([1.0, 0.82, 0.64]) * 2.2 + np.array([0.0, 0.33, 0.67])))
col = irid * 0.55 + np.array([0.85, 0.97, 1.0]) * 0.45
alpha = np.clip(film * 0.95 + 0.04, 0, 1)
# window highlight on the upper left and a glint
ex = (xx + 0.05) / 0.6
ey = (yy + 0.52) / 0.3
cap = np.clip((1 - np.hypot(ex, ey)) * 12, 0, 1) * np.clip(1 - (yy + 0.82) / 0.55, 0, 1) * 0.55
gl = np.clip((0.12 - np.hypot(xx + 0.45, yy + 0.45)) / 0.04, 0, 1)
hl = np.maximum(cap, gl * 0.95)
col = col * (1 - hl[..., None]) + hl[..., None]
alpha = np.maximum(alpha, hl)
# a faint bright lower rim, where light pools
low = np.clip((yy - 0.35) / 0.65, 0, 1) * np.clip((d - 0.8) / 0.2, 0, 1) * 0.35
col = col * (1 - low[..., None]) + np.array([0.75, 1.0, 1.0]) * low[..., None]
alpha = np.maximum(alpha, low)
edge = np.clip((1 - d) * m / 2.0, 0, 1)
alpha = alpha * edge * inside
rgba = np.dstack([np.clip(col, 0, 1), alpha])
im = Image.fromarray((rgba * 255).astype(np.uint8), "RGBA").resize((S, S), Image.LANCZOS)
im.save(os.path.join(OUT, "bubble.png"), optimize=True)
im.save(os.path.join(OUT, "bubble.webp"), quality=90, method=6)
print("done")

# ---------- waterline ----------
# The surface seen edge-on as the dive goes under: a bright wavy line, sky-white glow above it,
# and a band of light below it that breaks up into streaks. 2400 x 360, transparent.
W, H = 2400, 360
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
t = xx / W * 2 * np.pi
line = H * 0.38 + 7 * np.sin(t * 5 + 0.4) + 4 * np.sin(t * 13 + 1.7) + 2.2 * np.sin(t * 31 + 2.9) + 1.2 * np.sin(t * 67)
dy = yy - line
core = np.exp(-(dy / 1.6) ** 2)
glow_up = np.exp(-np.clip(-dy, 0, None) / 26) * (dy < 0) * 0.55
streak = 0.5 + 0.5 * np.sin(t * 90 + np.sin(t * 7) * 6) * np.sin(t * 37 + 1.3)
glow_dn = np.exp(-np.clip(dy, 0, None) / 70) * (dy >= 0) * (0.35 + 0.4 * streak)
a = np.clip(core * 1.0 + glow_up + glow_dn * 0.8, 0, 1)
# fade the ends so it reads as part of a wider surface
a *= np.clip(np.minimum(xx, W - xx) / 160, 0, 1) ** 0.5
rgb = np.zeros((H, W, 3), np.float32)
rgb[...] = np.array([0.82, 0.97, 1.0])
rgb = rgb * (1 - core[..., None]) + core[..., None]
out = np.dstack([rgb, a])
Image.fromarray((out * 255).astype(np.uint8), "RGBA").save(os.path.join(OUT, "waterline.webp"), quality=86, method=6)
print("waterline")
