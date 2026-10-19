#!/usr/bin/env python3
"""Finishes a rendered wallpaper: adds grain, encodes WebP and progressive JPEG, checks budgets.

Usage: python3 -I design/aero/wallpaper/finish.py <raw.png> <out-stem>
Writes <out-stem>.webp (WebP q80, method 6) and <out-stem>.jpg (JPEG q82, progressive).
Grain is gaussian noise (sigma 1.4 per channel) that kills banding in the gradients.
Budgets: 400000 bytes for the desktop size, 250000 for the phone size. A file over budget steps its
quality down by 2 (never below 72). Also prints the luminance standard deviation of the calm zones.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

SIGMA = 1.4
SEED = 1234


def grain(img):
    rng = np.random.default_rng(SEED)
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    arr += rng.normal(0.0, SIGMA, arr.shape).astype(np.float32)
    return Image.fromarray(np.clip(arr + 0.5, 0, 255).astype(np.uint8), "RGB")


def save_webp(img, path, quality):
    img.save(path, "WEBP", quality=quality, method=6)


def save_jpg(img, path, quality):
    img.save(path, "JPEG", quality=quality, progressive=True, optimize=True)


def encode(img, path, saver, start_q, budget):
    q = start_q
    saver(img, path, q)
    size = os.path.getsize(path)
    while size > budget and q > 72:
        q = max(72, q - 2)
        saver(img, path, q)
        size = os.path.getsize(path)
    status = "OK" if size <= budget else "OVER BUDGET"
    print("%s q%d %d bytes (budget %d) %s" % (os.path.basename(path), q, size, budget, status))
    return size


def luminance(img):
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    return 0.2126 * arr[..., 0] + 0.7152 * arr[..., 1] + 0.0722 * arr[..., 2]


def detail(lum):
    """Local detail: the luminance minus a heavy blur, so the sky gradient does not count."""
    h, w = lum.shape
    small = Image.fromarray(np.clip(lum, 0, 255).astype(np.uint8), "L").resize(
        (max(1, w // 16), max(1, h // 16)), Image.BOX)
    blurred = np.asarray(small.resize((w, h), Image.BICUBIC), dtype=np.float32)
    return lum - blurred


def calm_report(img):
    lum = luminance(img)
    h, w = lum.shape
    hp = detail(lum)
    if w >= 2000:
        print("calm left column x0-240 full height: luminance std %.2f, detail std %.2f"
              % (lum[:, :240].std(), hp[:, :240].std()))
    else:
        print("calm top row y0-360 full width: luminance std %.2f, detail std %.2f"
              % (lum[:360, :].std(), hp[:360, :].std()))
    block = lum[h - 150:, w - 440:]
    print("calm bottom-right 440x150 name block: luminance std %.2f, detail std %.2f, mean %.1f"
          % (block.std(), hp[h - 150:, w - 440:].std(), block.mean()))


def main():
    if len(sys.argv) != 3:
        print("usage: finish.py <raw.png> <out-stem>")
        sys.exit(1)
    raw, stem = sys.argv[1], sys.argv[2]
    img = Image.open(raw).convert("RGB")
    w, h = img.size
    budget = 400000 if w >= 2000 else 250000
    print("source %dx%d" % (w, h))
    out = grain(img)
    encode(out, stem + ".webp", save_webp, 80, budget)
    encode(out, stem + ".jpg", save_jpg, 82, budget)
    calm_report(out)


if __name__ == "__main__":
    main()
