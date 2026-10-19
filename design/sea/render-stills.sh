#!/bin/zsh
# Renders the hero stills (static/sea/hero/) from the live shader.
# Usage: NODE_PATH=<dir with puppeteer-core> design/sea/render-stills.sh   (from the repo root)
set -e
tmp=$(mktemp -d)
node design/sea/render-hero.js $tmp/wide.png 1440 900 2 2
node design/sea/render-hero.js $tmp/phone.png 390 844 3 2
mkdir -p static/sea/hero
python3 -I - $tmp <<'PY'
import sys
from PIL import Image
tmp = sys.argv[1]
wide = Image.open(f"{tmp}/wide.png").convert("RGB")
for w in (2880, 1920, 1440):
    im = wide.resize((w, round(w * wide.height / wide.width)), Image.LANCZOS)
    im.save(f"static/sea/hero/wide-{w}.webp", quality=82, method=6)
wide.resize((1920, 1200), Image.LANCZOS).save("static/sea/hero/wide-1920.jpg", quality=82, optimize=True, progressive=True)
phone = Image.open(f"{tmp}/phone.png").convert("RGB")
for w in (1170, 780):
    im = phone.resize((w, round(w * phone.height / phone.width)), Image.LANCZOS)
    im.save(f"static/sea/hero/phone-{w}.webp", quality=80, method=6)
PY
rm -rf $tmp
ls -la static/sea/hero
