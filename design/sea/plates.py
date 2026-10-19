"""Crops and grades the CC0 photographs into the site's plates (static/sea/plates/).

Usage: python3 -I design/sea/plates.py <photo dir> <out dir>

The photo dir holds the originals named as in static/sea/CREDITS.md (isl24.jpg, uw27.jpg, ...).
Every plate gets the same grade so the dive reads as one place: shadows lifted toward deep aqua
instead of black, highlights pushed toward cyan-white, saturation a little up.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

# name: (source, crop box as fractions (l, t, r, b), grade)
PLATES = {
    "above": ("isl24.jpg", (0.31, 0.0, 1.0, 1.0), dict(lift=(0.02, 0.10, 0.20), sat=1.12, gain=1.04, gamma=0.96)),
    "surface": ("uw27.jpg", (0.0, 0.0, 1.0, 1.0), dict(lift=(0.03, 0.16, 0.30), sat=1.05, gain=1.1, gamma=0.9)),
    "shallows": ("uw24.jpg", (0.0, 0.0, 1.0, 1.0), dict(lift=(0.03, 0.15, 0.24), sat=1.08, gain=1.08, gamma=0.92)),
    "rays": ("uw15.jpg", (0.0, 0.0, 1.0, 1.0), dict(lift=(0.03, 0.15, 0.27), sat=1.05, gain=1.06, gamma=0.9)),
    "dolphins": ("uw10.jpg", (0.0, 0.0, 1.0, 1.0), dict(lift=(0.03, 0.13, 0.30), sat=1.0, gain=1.12, gamma=0.86)),
    "deep": ("uw32.jpg", (0.0, 0.0, 1.0, 1.0), dict(lift=(0.03, 0.12, 0.33), sat=0.95, gain=1.12, gamma=0.84)),
    "school": ("uw8.jpg", (0.0, 0.0, 1.0, 1.0), dict(lift=(0.03, 0.12, 0.22), sat=1.06, gain=1.04, gamma=0.95)),
}

WIDTHS = {"above": [2400, 1600, 960], "default": [2400, 1600, 960]}


def grade(im, lift, sat, gain, gamma):
    a = np.asarray(im.convert("RGB")).astype(np.float32) / 255.0
    a = np.clip(a * gain, 0, 1) ** gamma
    lum = (a * np.array([0.2126, 0.7152, 0.0722])).sum(axis=2, keepdims=True)
    a = lum + (a - lum) * sat
    # lift: the darkest values become a deep aqua, not black
    lift = np.array(lift, dtype=np.float32)
    a = lift + a * (1.0 - lift)
    # a little bloom on the brightest parts
    hi = np.clip((lum - 0.72) / 0.28, 0, 1)
    bloom = Image.fromarray((np.clip(a * hi, 0, 1) * 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(radius=max(4, im.width // 220))
    )
    a = 1 - (1 - a) * (1 - np.asarray(bloom).astype(np.float32) / 255.0 * 0.35)
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))


for name, (src, box, g) in PLATES.items():
    path = os.path.join(SRC, src)
    if not os.path.exists(path):
        print("missing", src)
        continue
    im = Image.open(path).convert("RGB")
    W, H = im.size
    im = im.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)))
    big = im.resize((2400, round(2400 * im.height / im.width)), Image.LANCZOS)
    graded = grade(big, **g)
    for w in WIDTHS.get(name, WIDTHS["default"]):
        out = graded.resize((w, round(w * graded.height / graded.width)), Image.LANCZOS)
        out.save(os.path.join(OUT, f"{name}-{w}.jpg"), quality=84, optimize=True, progressive=True)
        out.save(os.path.join(OUT, f"{name}-{w}.webp"), quality=80, method=6)
    print(name, graded.size)
