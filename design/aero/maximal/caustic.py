"""A seamless tile of pool caustics (a net of light lines at about half alpha) for the glass.

Usage: python3 -I caustic.py <out.webp>

Cellular (Worley) noise on a torus: the light gathers where the nearest and second-nearest cell
centres are about equally far (F2 - F1 near zero), which draws the cell borders. A slight warp
bends the borders so they read as water, not as a honeycomb. Distances wrap, so the tile repeats.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

N = 320
rng = np.random.default_rng(8)
pts = rng.random((26, 2)) * N
y, x = np.mgrid[0:N, 0:N].astype(np.float32)
# warp (whole periods across the tile, so it still wraps)
wx = x + 7 * np.sin(2 * np.pi * (y / N) * 2 + 1.3) + 4 * np.sin(2 * np.pi * (x / N) * 3)
wy = y + 7 * np.sin(2 * np.pi * (x / N) * 2 + 0.4) + 4 * np.sin(2 * np.pi * (y / N) * 3 + 2)
d = []
for px, py in pts:
    dx = np.abs(wx - px)
    dy = np.abs(wy - py)
    dx = np.minimum(dx % N, N - dx % N)
    dy = np.minimum(dy % N, N - dy % N)
    d.append(np.hypot(dx, dy))
d = np.sort(np.stack(d), axis=0)
edge = d[1] - d[0]
lines = np.clip(1 - edge / 5.5, 0, 1) ** 2.2
# brighter where three cells meet
lines = np.clip(lines + np.clip(1 - (d[2] - d[0]) / 10, 0, 1) ** 2 * 0.6, 0, 1)
img = Image.fromarray((lines * 120).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(0.9))
rgba = Image.merge('RGBA', [Image.new('L', (N, N), 255)] * 3 + [img])
rgba.save(sys.argv[1], quality=80, method=6)
