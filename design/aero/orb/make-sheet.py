#!/usr/bin/env python3
"""Build the orb contact sheet.

Usage: python3 -I design/aero/orb/make-sheet.py <out_dir>

Copies static/aero/orb/start-orb.svg and src/images/logo.png into <out_dir>,
writes PIL downscales of the logo (16px and 32px), and writes sheet.html.
Render the sheet afterwards with render.sh, at 700x420.

logo.png is rendered from static/aero/orb/start-orb.svg inlined in an HTML
wrapper, because render.sh cannot load a file:// SVG inside its setContent page
and produces a broken-image placeholder.
"""
import os
import shutil
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
SVG = os.path.join(REPO, "static", "aero", "orb", "start-orb.svg")
LOGO = os.path.join(REPO, "src", "images", "logo.png")

HTML = """<!doctype html>
<html><head><meta charset="utf-8"><title>Orb sheet</title>
<style>
body { margin: 0; padding: 20px; width: 660px; font: 13px/1.4 "Open Sans", Arial, sans-serif;
  color: #1b2a3a; background: #ffffff; }
.bar { height: 48px; width: 660px; margin-bottom: 14px; display: flex; align-items: center;
  gap: 18px; padding: 0 14px; box-sizing: border-box;
  background: linear-gradient(180deg, rgba(160,205,238,.9) 0%, rgba(70,120,170,.95) 49%, rgba(22,62,104,1) 50%, rgba(10,40,76,1) 100%); }
.bar img { width: 44px; height: 44px; }
.bar .big { width: 48px; height: 48px; }
.row { display: flex; align-items: center; gap: 22px; margin-bottom: 14px; }
.white { width: 660px; box-sizing: border-box; padding: 14px; background: #ffffff; margin-bottom: 14px;
  display: flex; align-items: center; gap: 26px; border: 1px solid #dde6ee; }
.white img { width: 96px; height: 96px; }
.lbl { color: #546a80; font-size: 12px; }
.fav { display: flex; align-items: flex-end; gap: 14px; }
</style></head>
<body>
<div class="lbl">Taskbar glass, 44px (desktop) and 48px (phone)</div>
<div class="bar">
  <img src="start-orb.svg" alt="">
  <img class="big" src="start-orb.svg" alt="">
  <span style="color:#fff;font-size:14px;text-shadow:0 1px 2px rgba(0,0,0,.6)">Peter Shamoun</span>
</div>
<div class="white">
  <img src="start-orb.svg" alt="">
  <div>
    <div class="lbl">96px on white</div>
    <div class="fav" style="margin-top:12px">
      <img src="logo-32.png" width="32" height="32" alt="">
      <img src="logo-16.png" width="16" height="16" alt="">
      <span class="lbl">32px and 16px favicon (PIL downscale of logo.png)</span>
    </div>
  </div>
</div>
<div class="lbl">logo.png (512px, transparent) shown at 96px on white and on the bar glass</div>
<div class="row">
  <img src="logo.png" width="96" height="96" alt="">
  <div class="bar" style="width:240px;height:60px;margin:0"><img src="logo.png" width="44" height="44" alt=""></div>
</div>
</body></html>
"""


def main():
    out = os.path.abspath(sys.argv[1])
    os.makedirs(out, exist_ok=True)
    shutil.copy(SVG, os.path.join(out, "start-orb.svg"))
    shutil.copy(LOGO, os.path.join(out, "logo.png"))
    logo = Image.open(LOGO).convert("RGBA")
    for size in (16, 32):
        logo.resize((size, size), Image.LANCZOS).save(os.path.join(out, "logo-%d.png" % size))
    with open(os.path.join(out, "sheet.html"), "w") as f:
        f.write(HTML)
    print("wrote", os.path.join(out, "sheet.html"))


if __name__ == "__main__":
    main()
