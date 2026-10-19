"""The glass globe, as two SVG layers that sandwich the swimming fish.

Usage: python3 -I globe.py <out_dir>

  globe-back.svg   the world inside: sky, a glass-tower island with a wind turbine and palms,
                   the waterline, and the aquarium below (light shafts, sand, weed, coral).
  globe-front.svg  the glass itself (rim, highlights, reflections) and the chrome-and-candy
                   stand it sits in.

Both are 1200 x 1400 with the sphere centred at (600, 580), r = 560, so the site can stack them
with the fish layer between. Rasterise with tools/render.sh at 1200 x 1400 --transparent.
"""
import math
import random
import sys

OUT = sys.argv[1]
W, H = 1200, 1400
CX, CY, R = 600, 580, 560
WATER = 560  # waterline y
rnd = random.Random(11)


def f(v):
    return f'{v:.1f}'


def wave(y, x0, x1, amp, period, phase, steps=60):
    pts = []
    for i in range(steps + 1):
        x = x0 + (x1 - x0) * i / steps
        pts.append((x, y + amp * math.sin(x / period + phase)))
    return pts


def path(pts, close=False):
    d = 'M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in pts)
    return d + (' Z' if close else '')


# ---------------------------------------------------------------- back layer: the world inside

def back():
    s = []
    s.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
    s.append('''<defs>
  <clipPath id="ball"><circle cx="600" cy="580" r="556"/></clipPath>
  <linearGradient id="isky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0d63d8"/>
    <stop offset="0.45" stop-color="#3aa5f5"/>
    <stop offset="1" stop-color="#bdf0ff"/>
  </linearGradient>
  <radialGradient id="isun" cx="0.68" cy="0.18" r="0.35">
    <stop offset="0" stop-color="#fffbe6" stop-opacity="1"/>
    <stop offset="0.12" stop-color="#fff6c9" stop-opacity="0.85"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2fd0f5"/>
    <stop offset="0.18" stop-color="#0e9ae0"/>
    <stop offset="0.55" stop-color="#0559ad"/>
    <stop offset="1" stop-color="#022a6a"/>
  </linearGradient>
  <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e8fdff" stop-opacity="0.55"/>
    <stop offset="1" stop-color="#e8fdff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff1c4"/>
    <stop offset="0.5" stop-color="#e9c98a"/>
    <stop offset="1" stop-color="#b98f55"/>
  </linearGradient>
  <linearGradient id="isle" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b6f23a"/>
    <stop offset="0.35" stop-color="#4dbb1c"/>
    <stop offset="1" stop-color="#1f7a14"/>
  </linearGradient>
  <linearGradient id="beach" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff6d8"/>
    <stop offset="1" stop-color="#e3bf7c"/>
  </linearGradient>
  <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#0b4fa8"/>
    <stop offset="0.18" stop-color="#5cc9ff"/>
    <stop offset="0.32" stop-color="#e9fbff"/>
    <stop offset="0.45" stop-color="#7fd8ff"/>
    <stop offset="0.8" stop-color="#1a78cf"/>
    <stop offset="1" stop-color="#0a3f8a"/>
  </linearGradient>
  <linearGradient id="towerG" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#11804a"/>
    <stop offset="0.2" stop-color="#5fe0a0"/>
    <stop offset="0.34" stop-color="#eafff4"/>
    <stop offset="0.5" stop-color="#7debb5"/>
    <stop offset="1" stop-color="#0d6a3c"/>
  </linearGradient>
  <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#7a4f22"/>
    <stop offset="0.4" stop-color="#d9a35c"/>
    <stop offset="1" stop-color="#6b4219"/>
  </linearGradient>
  <linearGradient id="frond" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b8ff4a"/>
    <stop offset="1" stop-color="#2a9a17"/>
  </linearGradient>
  <linearGradient id="weed" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#0d6b2a"/>
    <stop offset="0.6" stop-color="#3fc23a"/>
    <stop offset="1" stop-color="#a6f05a"/>
  </linearGradient>
  <linearGradient id="coral" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#1aa3b8"/>
    <stop offset="1" stop-color="#b6fff4"/>
  </linearGradient>
  <linearGradient id="coral2" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#6fbf10"/>
    <stop offset="1" stop-color="#e9ff8a"/>
  </linearGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="soft2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="caustic" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="turbulence" baseFrequency="0.035 0.06" numOctaves="1" seed="4" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -28 1.6" result="lines"/>
    <feGaussianBlur in="lines" stdDeviation="0.8"/>
  </filter>
  <filter id="cloud" x="-20%" y="-50%" width="140%" height="200%">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="9"/>
    <feDisplacementMap in="SourceGraphic" scale="40"/>
    <feGaussianBlur stdDeviation="3"/>
  </filter>
</defs>''')
    s.append('<g clip-path="url(#ball)">')
    # sky inside
    s.append(f'<rect x="0" y="0" width="{W}" height="{WATER + 4}" fill="url(#isky)"/>')
    s.append(f'<rect x="0" y="0" width="{W}" height="{WATER}" fill="url(#isun)"/>')
    # clouds: lumpy ellipses pushed through turbulence
    for cx, cy, sc in [(330, 300, 1.0), (860, 380, 0.8), (520, 210, 0.6)]:
        g = []
        for _ in range(9):
            dx = rnd.uniform(-110, 110) * sc
            dy = rnd.uniform(-22, 10) * sc
            rr = rnd.uniform(38, 70) * sc
            g.append(f'<circle cx="{f(cx + dx)}" cy="{f(cy + dy)}" r="{f(rr)}"/>')
        s.append(f'<g fill="#ffffff" opacity="0.92" filter="url(#cloud)">{"".join(g)}'
                 f'<rect x="{f(cx - 150 * sc)}" y="{f(cy)}" width="{f(300 * sc)}" height="{f(40 * sc)}" rx="{f(20 * sc)}"/></g>')
    # far sea strip behind the island
    s.append(f'<rect x="0" y="{WATER - 26}" width="{W}" height="30" fill="#21b7ec"/>')
    s.append(f'<rect x="0" y="{WATER - 26}" width="{W}" height="3" fill="#cdf6ff" opacity="0.8"/>')

    # ---- the island
    isl = [(330, WATER + 2)]
    for i in range(0, 41):
        t = i / 40
        x = 330 + 540 * t
        y = WATER - 58 * math.sin(math.pi * t) ** 0.7 - 10 * math.sin(t * 9) * math.sin(math.pi * t)
        isl.append((x, y))
    isl.append((870, WATER + 2))
    s.append(f'<path d="{path(isl, True)}" fill="url(#beach)"/>')
    grassy = [(360, WATER - 6)]
    for i in range(0, 41):
        t = i / 40
        x = 360 + 480 * t
        y = WATER - 8 - 62 * math.sin(math.pi * t) ** 0.7 - 10 * math.sin(t * 9) * math.sin(math.pi * t)
        grassy.append((x, y))
    grassy.append((840, WATER - 6))
    s.append(f'<path d="{path(grassy, True)}" fill="url(#isle)"/>')

    # glass towers (back to front), each a rounded capsule with bands of windows
    towers = [
        (560, 250, 46, 'tower'), (640, 190, 58, 'tower'), (505, 310, 40, 'towerG'),
        (712, 290, 44, 'towerG'), (600, 330, 34, 'tower'), (770, 350, 30, 'tower'),
    ]
    for x, top, w, grad in towers:
        base = WATER - 52
        s.append(f'<g><rect x="{x - w / 2}" y="{top}" width="{w}" height="{base - top}" rx="{w / 2}" fill="url(#{grad})"/>')
        for yy in range(int(top + w * 0.7), int(base - 8), 22):
            s.append(f'<rect x="{x - w / 2 + 2}" y="{yy}" width="{w - 4}" height="1.5" fill="#03306e" opacity="0.12"/>')
        s.append(f'<rect x="{x - w * 0.22}" y="{top + 8}" width="{w * 0.12}" height="{base - top - 20}" rx="{w * 0.06}" fill="#ffffff" opacity="0.7"/>')
        s.append('</g>')
    # a leaf-shaped roof garden on the tallest
    s.append('<ellipse cx="640" cy="196" rx="34" ry="10" fill="#8ff23a"/>')
    s.append('<ellipse cx="640" cy="193" rx="22" ry="5" fill="#d9ff9a"/>')

    # wind turbine on the left hill
    tx, ty = 430, WATER - 60
    s.append(f'<rect x="{tx - 3}" y="{ty - 150}" width="6" height="150" rx="3" fill="#f4fbff"/>')
    s.append(f'<rect x="{tx - 1}" y="{ty - 150}" width="2" height="150" fill="#9fc6e6"/>')
    for a in (-90, 30, 150):
        rad = math.radians(a)
        x2, y2 = tx + 78 * math.cos(rad), ty - 150 + 78 * math.sin(rad)
        s.append(f'<path d="M{tx} {ty - 150} L{f(x2)} {f(y2)}" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>')
    s.append(f'<circle cx="{tx}" cy="{ty - 150}" r="7" fill="#e6f3ff" stroke="#9fc6e6" stroke-width="2"/>')

    # palms on the right of the island
    def palm(x, y, h, lean, scale=1.0):
        out = []
        top = (x + lean, y - h)
        out.append(f'<path d="M{x - 7 * scale} {y} Q{x + lean * 0.4} {y - h * 0.5} {f(top[0] - 3)} {f(top[1])} L{f(top[0] + 4)} {f(top[1])} Q{x + lean * 0.5 + 8 * scale} {y - h * 0.5} {x + 7 * scale} {y} Z" fill="url(#trunk)"/>')
        for ang in (-170, -135, -100, -60, -20, 15):
            a = math.radians(ang)
            L = 70 * scale
            ex, ey = top[0] + L * math.cos(a), top[1] + L * math.sin(a) + 30 * scale
            mx, my = top[0] + L * 0.5 * math.cos(a), top[1] + L * 0.5 * math.sin(a) - 12 * scale
            out.append(f'<path d="M{f(top[0])} {f(top[1])} Q{f(mx)} {f(my - 10 * scale)} {f(ex)} {f(ey)} Q{f(mx)} {f(my + 10 * scale)} {f(top[0])} {f(top[1])} Z" fill="url(#frond)"/>')
        out.append(f'<circle cx="{f(top[0])}" cy="{f(top[1] + 4)}" r="{6 * scale}" fill="#7a4f22"/>')
        return ''.join(out)

    s.append(palm(815, WATER - 30, 110, 26, 1.0))
    s.append(palm(780, WATER - 40, 80, -18, 0.75))
    s.append(palm(395, WATER - 22, 70, -20, 0.7))

    # ---- the sea (under the waterline)
    s.append(f'<rect x="0" y="{WATER}" width="{W}" height="{H - WATER}" fill="url(#sea)"/>')
    # light shafts fanning down from the surface
    for i in range(9):
        x = 180 + i * 110 + rnd.uniform(-30, 30)
        w0 = rnd.uniform(18, 46)
        spread = rnd.uniform(60, 140)
        s.append(f'<path d="M{f(x)} {WATER} L{f(x + w0)} {WATER} L{f(x + w0 + spread)} {WATER + 620} L{f(x - spread * 0.4)} {WATER + 620} Z" fill="url(#shaft)" opacity="{rnd.uniform(0.35, 0.8):.2f}" filter="url(#soft)"/>')
    # caustic net just under the surface
    s.append('<linearGradient id="cfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>'
             f'<mask id="cmask"><rect x="0" y="{WATER}" width="{W}" height="300" fill="url(#cfade)"/></mask>')
    s.append(f'<g mask="url(#cmask)"><rect x="0" y="{WATER}" width="{W}" height="300" filter="url(#caustic)" opacity="0.4"/></g>')
    # under-surface: the bright mirror band
    s.append(f'<rect x="0" y="{WATER}" width="{W}" height="16" fill="#c8fbff" opacity="0.75"/>')
    s.append(f'<path d="{path(wave(WATER + 14, 0, W, 4, 26, 0.5))} L{W} {WATER} L0 {WATER} Z" fill="#7febff" opacity="0.6"/>')
    # island's underwater foot
    s.append(f'<path d="M330 {WATER} Q600 {WATER + 120} 870 {WATER} Z" fill="#c9a865" opacity="0.35" filter="url(#soft)"/>')

    # sand floor following the sphere's curve
    floor = [(0, 1000)]
    for i in range(0, 61):
        x = W * i / 60
        floor.append((x, 960 + 26 * math.sin(x / 140 + 1.3) + 14 * math.sin(x / 47)))
    floor.append((W, H))
    floor.append((0, H))
    s.append(f'<path d="{path(floor, True)}" fill="url(#sand)"/>')
    # sand ripples
    for i in range(14):
        y = 990 + i * 11
        s.append(f'<path d="{path(wave(y, 0, W, 3, 30 + i, i))}" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2" fill="none"/>')

    # weed
    def weed(x, y, h, sway, width):
        pts_l, pts_r = [], []
        for i in range(21):
            t = i / 20
            cx = x + sway * math.sin(t * 3.2) * t
            ww = width * (1 - t) ** 0.6
            pts_l.append((cx - ww, y - h * t))
            pts_r.append((cx + ww, y - h * t))
        return f'<path d="{path(pts_l + pts_r[::-1], True)}" fill="url(#weed)"/>'

    for x, h, sway, w in [(150, 300, 30, 10), (185, 220, -24, 9), (215, 340, 26, 11), (250, 200, -20, 8),
                          (285, 150, 18, 7), (960, 320, -26, 11), (995, 230, 30, 9), (1030, 280, -22, 10),
                          (1060, 170, 18, 8), (920, 160, -14, 7), (360, 120, 12, 6), (860, 130, -12, 6),
                          (560, 90, 10, 5), (640, 110, -10, 5)]:
        s.append(weed(x, 990, h, sway, w))

    # coral: branching tubes
    def coral(x, y, grad, sc):
        out = []
        for ang, ln in [(-90, 120), (-60, 90), (-120, 95), (-40, 60), (-140, 60)]:
            a = math.radians(ang)
            x2, y2 = x + ln * sc * math.cos(a), y + ln * sc * math.sin(a)
            out.append(f'<path d="M{x} {y} Q{f(x + (x2 - x) * 0.2)} {f(y + (y2 - y) * 0.6)} {f(x2)} {f(y2)}" stroke="url(#{grad})" stroke-width="{f(16 * sc)}" stroke-linecap="round" fill="none"/>')
            out.append(f'<circle cx="{f(x2)}" cy="{f(y2)}" r="{f(9 * sc)}" fill="#ffffff" opacity="0.55"/>')
        return ''.join(out)

    s.append(coral(700, 985, 'coral', 1.0))
    s.append(coral(450, 990, 'coral2', 0.8))
    s.append(coral(800, 975, 'coral2', 0.6))

    # glossy pebbles
    for i in range(16):
        x = rnd.uniform(300, 920)
        y = rnd.uniform(1000, 1060)
        rr = rnd.uniform(8, 20)
        col = rnd.choice(['#ffffff', '#9fe9ff', '#d9ff8a', '#7cc6ff'])
        s.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rr * 1.3)}" ry="{f(rr)}" fill="{col}"/>')
        s.append(f'<ellipse cx="{f(x - rr * 0.35)}" cy="{f(y - rr * 0.4)}" rx="{f(rr * 0.45)}" ry="{f(rr * 0.25)}" fill="#ffffff" opacity="0.85"/>')

    # deep-water vignette inside the ball
    s.append('<radialGradient id="vig" cx="0.5" cy="0.45" r="0.55"><stop offset="0.7" stop-color="#022a66" stop-opacity="0"/><stop offset="1" stop-color="#022a66" stop-opacity="0.55"/></radialGradient>')
    s.append(f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="url(#vig)"/>')
    s.append('</g></svg>')
    return '\n'.join(s)


# ---------------------------------------------------------------- front layer: glass and stand

def front():
    s = []
    s.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
    s.append('''<defs>
  <radialGradient id="fresnel" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0.8" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="0.93" stop-color="#d9f6ff" stop-opacity="0.18"/>
    <stop offset="0.975" stop-color="#ffffff" stop-opacity="0.75"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0.95"/>
  </radialGradient>
  <radialGradient id="tint" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0.75" stop-color="#7fe0ff" stop-opacity="0"/>
    <stop offset="1" stop-color="#2a9fe0" stop-opacity="0.22"/>
  </radialGradient>
  <linearGradient id="hi" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
    <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.25"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="hi2" x1="1" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#e9fffb" stop-opacity="0.7"/>
    <stop offset="1" stop-color="#e9fffb" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset="0.22" stop-color="#cfe0ee"/>
    <stop offset="0.45" stop-color="#6f8aa4"/>
    <stop offset="0.5" stop-color="#2c4660"/>
    <stop offset="0.56" stop-color="#9fb9d0"/>
    <stop offset="0.8" stop-color="#f2f8fc"/>
    <stop offset="1" stop-color="#8aa3ba"/>
  </linearGradient>
  <linearGradient id="chromeH" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#000000" stop-opacity="0.35"/>
    <stop offset="0.2" stop-color="#000000" stop-opacity="0"/>
    <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.55"/>
    <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="0.8" stop-color="#000000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0.4"/>
  </linearGradient>
  <linearGradient id="candy" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7fe6ff"/>
    <stop offset="0.45" stop-color="#14a6e0"/>
    <stop offset="1" stop-color="#05509a"/>
  </linearGradient>
  <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0.08"/>
  </linearGradient>
  <linearGradient id="lime" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f2ffb8"/>
    <stop offset="0.5" stop-color="#b8ff2e"/>
    <stop offset="1" stop-color="#5fd400"/>
  </linearGradient>
  <filter id="blur4" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="blur12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
  <filter id="blur30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
  <clipPath id="ball"><circle cx="600" cy="580" r="560"/></clipPath>
</defs>''')
    # contact shadow on the grass under the stand
    s.append('<ellipse cx="600" cy="1330" rx="470" ry="46" fill="#0b3d10" opacity="0.45" filter="url(#blur30)"/>')

    # glass: tint toward the edge, fresnel rim, chromatic edge
    s.append(f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="url(#tint)"/>')
    s.append(f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="url(#fresnel)"/>')
    s.append(f'<circle cx="{CX}" cy="{CY}" r="{R - 3}" fill="none" stroke="#7ff7ff" stroke-width="3" opacity="0.5"/>')
    s.append(f'<circle cx="{CX}" cy="{CY}" r="{R - 1}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.9"/>')
    s.append('<g clip-path="url(#ball)">')
    # big crescent highlight, top left
    s.append('<path d="M140 520 A470 470 0 0 1 560 110 A520 520 0 0 0 210 560 Z" fill="url(#hi)" opacity="0.9"/>')
    s.append('<path d="M190 300 A430 430 0 0 1 420 140 A470 470 0 0 0 230 330 Z" fill="#ffffff" opacity="0.9" filter="url(#blur4)"/>')
    # window-shaped reflection, top right (a soft bright rectangle bent over the ball)
    s.append('<path d="M790 140 Q900 170 960 250 L900 300 Q850 230 760 205 Z" fill="#ffffff" opacity="0.55" filter="url(#blur4)"/>')
    s.append('<path d="M970 270 Q1010 330 1025 400 L975 410 Q963 350 930 305 Z" fill="#ffffff" opacity="0.4" filter="url(#blur4)"/>')
    # lower-right bounce light from the grass
    s.append('<path d="M1080 700 A480 480 0 0 1 760 1090 A520 520 0 0 0 1040 690 Z" fill="#d8ff9a" opacity="0.55" filter="url(#blur4)"/>')
    # bottom caustic glow where light focuses through the ball
    s.append('<ellipse cx="600" cy="1080" rx="260" ry="40" fill="#e9fffb" opacity="0.5" filter="url(#blur12)"/>')
    s.append('</g>')
    # hard specular dots
    s.append('<ellipse cx="300" cy="250" rx="34" ry="20" transform="rotate(-38 300 250)" fill="#ffffff"/>')
    s.append('<circle cx="350" cy="205" r="9" fill="#ffffff"/>')
    s.append('<circle cx="870" cy="185" r="6" fill="#ffffff" opacity="0.9"/>')

    # ---- the stand: chrome collar over a candy-aqua base with a lime light band
    # base body
    s.append('<path d="M172 1116 L1028 1116 L1066 1290 A466 56 0 0 1 134 1290 Z" fill="url(#candy)"/>')
    s.append('<path d="M134 1290 A466 56 0 0 0 1066 1290" fill="none" stroke="#023a78" stroke-width="4" opacity="0.5"/>')
    s.append('<path d="M180 1140 A420 40 0 0 0 1020 1140 L1034 1200 A434 46 0 0 1 166 1200 Z" fill="url(#gloss)" opacity="0.7"/>')
    # lime light band
    s.append('<path d="M150 1236 A452 52 0 0 0 1050 1236" fill="none" stroke="#7dff00" stroke-width="26" opacity="0.6" filter="url(#blur12)"/>')
    s.append('<path d="M150 1236 A452 52 0 0 0 1050 1236" fill="none" stroke="url(#lime)" stroke-width="16" stroke-linecap="round"/>')
    s.append('<path d="M160 1232 A444 50 0 0 0 1040 1232" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.8" stroke-linecap="round"/>')
    # chrome collar: only its front half shows; the ball sinks into it
    s.append('<path d="M168 1100 A432 64 0 0 0 1032 1100 L1032 1128 A432 72 0 0 1 168 1128 Z" fill="url(#chrome)"/>')
    s.append('<path d="M168 1100 A432 64 0 0 0 1032 1100 L1032 1128 A432 72 0 0 1 168 1128 Z" fill="url(#chromeH)"/>')
    s.append('<path d="M176 1104 A424 60 0 0 0 1024 1104" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.9"/>')
    s.append('<path d="M168 1100 A432 64 0 0 1 1032 1100" fill="none" stroke="#e9f6ff" stroke-width="4" opacity="0.55"/>')
    # where glass meets metal: a dark line and a bright caustic just above it
    s.append('<path d="M200 1098 A400 56 0 0 0 1000 1098" stroke="#0d2a46" stroke-width="5" fill="none" opacity="0.45" filter="url(#blur4)"/>')
    for x in (300, 450, 600, 750, 900):
        y = 1100 + 64 * math.sqrt(max(0, 1 - ((x - 600) / 432) ** 2))
        s.append(f'<circle cx="{x}" cy="{f(y + 12)}" r="4" fill="#ffffff" opacity="0.95"/>')
    s.append('</svg>')
    return '\n'.join(s)


with open(f'{OUT}/globe-back.svg', 'w') as fh:
    fh.write(back())
with open(f'{OUT}/globe-front.svg', 'w') as fh:
    fh.write(front())
print('wrote', OUT)
