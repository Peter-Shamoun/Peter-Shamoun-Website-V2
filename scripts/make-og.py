#!/usr/bin/env python3
"""Render the social card from the finished site.

Writes static/og.png (1200 x 630) and static/og@2x.png (the same view at
device_scale_factor 2, so 2400 x 1260 pixels).

Needs the finished site served on port 9000 (Node 18.20.6, as in .nvmrc):

    source ~/.nvm/nvm.sh && nvm use
    npx gatsby build && npx gatsby serve -p 9000

then, from the repo root:

    /Library/Frameworks/Python.framework/Versions/3.12/bin/python3 scripts/make-og.py

A different address can be given as the first argument (for example http://localhost:9333/).

Playwright for Python must be installed, with its Chromium (python3 -m playwright install chromium).
"""

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:9000/"
WIDTH = 1200
HEIGHT = 630
SETTLE_MS = 4000

ROOT = Path(__file__).resolve().parent.parent
STATIC = ROOT / "static"


def capture(browser, scale, filename):
    page = browser.new_page(
        viewport={"width": WIDTH, "height": HEIGHT},
        device_scale_factor=scale,
    )
    try:
        page.goto(URL, wait_until="load")
        # Let the typing animation of the wordmark and the boot overlay finish.
        page.wait_for_timeout(SETTLE_MS)
        target = STATIC / filename
        page.screenshot(path=str(target), full_page=False)
        print(f"Wrote {target} at {WIDTH * scale}x{HEIGHT * scale}")
    finally:
        page.close()


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        try:
            capture(browser, 1, "og.png")
            capture(browser, 2, "og@2x.png")
        finally:
            browser.close()


if __name__ == "__main__":
    main()
