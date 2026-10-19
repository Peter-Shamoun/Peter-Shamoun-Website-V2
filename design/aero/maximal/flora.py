"""Ivy and grass for the scene, as SVG.

Usage: python3 -I flora.py <out_dir>

  ivy.svg     strands of glossy ivy hanging from the top edge (drawn for the top-right corner;
              the site mirrors it for the left). 520 x 760.
  blades.svg  a strip of grass blades for the very front of the scene. 1600 x 180, meant to be
              drawn with preserveAspectRatio="xMidYMax slice".
"""
import math
import random
import sys

OUT = sys.argv[1]
rnd = random.Random(5)


def f(v):
    return f'{v:.1f}'


def bezier(p0, p1, p2, p3, t):
    u = 1 - t
    return (
        u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
        u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1],
    )


def leaf(x, y, size, angle, shade):
    """A five-lobed ivy leaf with its stalk at (x, y), pointing along angle (degrees)."""
    s = size
    # lobed outline in local coords, stalk at origin, tip along +y
    pts = [
        (0, 0), (-0.25, 0.05), (-0.62, -0.02), (-0.55, 0.28), (-0.85, 0.45), (-0.5, 0.6),
        (-0.45, 0.88), (-0.15, 0.8), (0, 1.15), (0.15, 0.8), (0.45, 0.88), (0.5, 0.6),
        (0.85, 0.45), (0.55, 0.28), (0.62, -0.02), (0.25, 0.05),
    ]
    a = math.radians(angle)
    ca, sa = math.cos(a), math.sin(a)

    def tr(px, py):
        return (x + (px * ca - py * sa) * s, y + (px * sa + py * ca) * s)

    # smooth closed path through the points with quadratic midpoints
    P = [tr(px, py) for px, py in pts]
    d = []
    n = len(P)
    for i in range(n):
        p = P[i]
        q = P[(i + 1) % n]
        m = ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
        if i == 0:
            d.append(f'M{f(m[0])} {f(m[1])}')
        else:
            d.append(f'Q{f(p[0])} {f(p[1])} {f(m[0])} {f(m[1])}')
    p = P[0]
    m = ((P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2)
    d.append(f'Q{f(p[0])} {f(p[1])} {f(m[0])} {f(m[1])} Z')
    out = [f'<path d="{" ".join(d)}" fill="url(#leaf{shade})" stroke="#1d6b12" stroke-width="0.8" stroke-opacity="0.5"/>']
    # veins
    c = tr(0, 0.2)
    for vx, vy in [(0, 1.0), (-0.6, 0.5), (0.6, 0.5), (-0.4, 0.05), (0.4, 0.05)]:
        e = tr(vx * 0.85, vy * 0.85)
        out.append(f'<path d="M{f(c[0])} {f(c[1])} L{f(e[0])} {f(e[1])}" stroke="#eaffc4" stroke-width="{f(s * 0.03)}" stroke-opacity="0.55" stroke-linecap="round"/>')
    # gloss
    g = tr(-0.18, 0.45)
    out.append(f'<ellipse cx="{f(g[0])}" cy="{f(g[1])}" rx="{f(s * 0.16)}" ry="{f(s * 0.08)}" transform="rotate({f(angle + 60)} {f(g[0])} {f(g[1])})" fill="#ffffff" opacity="0.55"/>')
    return ''.join(out)


def ivy():
    W, H = 520, 760
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">']
    s.append('<defs>')
    for i, (a, b) in enumerate([('#c9ff6a', '#3fae1d'), ('#a6f04a', '#2a8c17'), ('#8fdc3c', '#1f7413')]):
        s.append(f'<linearGradient id="leaf{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>')
    s.append('</defs>')
    # strands: start x on the top edge, length, sway
    strands = [(500, 720, -40), (440, 520, 30), (380, 640, -20), (300, 300, 25), (250, 420, -30),
               (170, 200, 20), (100, 140, -10), (470, 260, 20)]
    stems, leaves = [], []
    for sx, ln, sway in strands:
        p0 = (sx, -10)
        p1 = (sx + sway, ln * 0.33)
        p2 = (sx - sway, ln * 0.66)
        p3 = (sx + sway * 0.4, ln)
        pts = [bezier(p0, p1, p2, p3, i / 40) for i in range(41)]
        stems.append(f'<path d="M{" L".join(f"{f(x)} {f(y)}" for x, y in pts)}" stroke="#2b7a16" stroke-width="3" fill="none" stroke-linecap="round"/>')
        stems.append(f'<path d="M{" L".join(f"{f(x - 0.8)} {f(y)}" for x, y in pts)}" stroke="#a6e86a" stroke-width="1" fill="none" stroke-opacity="0.6"/>')
        t = 0.03
        side = 1
        while t < 1:
            x, y = bezier(p0, p1, p2, p3, t)
            size = rnd.uniform(26, 40) * (1.05 - 0.35 * t)
            ang = (-50 if side > 0 else 50) + rnd.uniform(-15, 15)
            leaves.append((y, leaf(x, y, size, ang, rnd.randrange(3))))
            side = -side
            t += rnd.uniform(0.07, 0.11) * (300 / max(ln, 200)) ** 0.5
    # a strand along the top edge
    for i in range(14):
        x = 20 + i * 36 + rnd.uniform(-6, 6)
        y = rnd.uniform(4, 22)
        leaves.append((y, leaf(x, y, rnd.uniform(28, 38), rnd.uniform(-30, 30), rnd.randrange(3))))
    s.extend(stems)
    for _, l in sorted(leaves):
        s.append(l)
    s.append('</svg>')
    return '\n'.join(s)


def blades():
    W, H = 1600, 180
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" preserveAspectRatio="xMidYMax slice">']
    s.append('<defs>'
             '<linearGradient id="b0" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#0f5a12"/><stop offset="0.6" stop-color="#3fae1d"/><stop offset="1" stop-color="#c9ff5a"/></linearGradient>'
             '<linearGradient id="b1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#0b4a0e"/><stop offset="0.7" stop-color="#2f9418"/><stop offset="1" stop-color="#9ef046"/></linearGradient>'
             '<linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e7a14" stop-opacity="0"/><stop offset="0.5" stop-color="#145e10"/><stop offset="1" stop-color="#0b3d0b"/></linearGradient>'
             '</defs>')
    for layer, (count, hmin, hmax, grad) in enumerate([(220, 40, 110, 'b1'), (260, 30, 150, 'b0')]):
        for _ in range(count):
            x = rnd.uniform(-20, W + 20)
            # taller at the ends of the strip so the middle stays low under the deck
            edge = abs(x / W - 0.5) * 2
            h = rnd.uniform(hmin, hmax) * (0.55 + 0.6 * edge ** 1.5)
            w = rnd.uniform(4, 9)
            bend = rnd.uniform(-0.6, 0.6) * h
            tipx = x + bend
            s.append(f'<path d="M{f(x - w)} {H} Q{f(x - w * 0.3 + bend * 0.3)} {f(H - h * 0.6)} {f(tipx)} {f(H - h)} Q{f(x + w * 0.4 + bend * 0.35)} {f(H - h * 0.55)} {f(x + w)} {H} Z" fill="url(#{grad})"/>')
    s.append(f'<rect x="0" y="{H - 40}" width="{W}" height="40" fill="url(#base)"/>')
    s.append('</svg>')
    return '\n'.join(s)


with open(f'{OUT}/ivy.svg', 'w') as fh:
    fh.write(ivy())
with open(f'{OUT}/blades.svg', 'w') as fh:
    fh.write(blades())
print('wrote', OUT)
