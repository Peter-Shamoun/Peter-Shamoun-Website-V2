#!/usr/bin/env python3
"""Writes desktop.html and phone.html, the Frutiger Aero wallpaper sources.

Run: python3 -I design/aero/wallpaper/gen.py   (writes the two HTML files next to this script)

Each page is one inline SVG at the exact pixel size, built from gradients, blurred ellipses and
light ribbons drawn as filled bands between two offset curves. Positions are fractions of the
page (0..1), so the same recipe re-composes for portrait. Render with render.sh, then finish.py.
Seeds are fixed, so the output is reproducible.
"""
import math
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))


def fmt(v):
    return "%.1f" % v


def bez(seg, t):
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = seg
    u = 1 - t
    x = u**3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t**3 * x3
    y = u**3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t**3 * y3
    return x, y


def ribbon_centre(segs, W, H, steps=110):
    """Sample a chain of cubic segments (normalised) into page pixels."""
    pts = []
    for seg in segs:
        for i in range(steps):
            pts.append(bez(seg, i / steps))
    pts.append(segs[-1][3])
    return [(x * W, y * H) for x, y in pts]


def ribbon_band(pts, hw, phase):
    """A filled band around a centre line. Width swells in the middle and tapers at both ends."""
    n = len(pts)
    top, bot = [], []
    for i, (x, y) in enumerate(pts):
        a = pts[max(i - 1, 0)]
        b = pts[min(i + 1, n - 1)]
        tx, ty = b[0] - a[0], b[1] - a[1]
        length = math.hypot(tx, ty) or 1.0
        nx, ny = -ty / length, tx / length
        s = i / (n - 1)
        w = hw * (0.16 + 0.84 * math.sin(math.pi * s) ** 0.6)
        w *= 1 + 0.2 * math.sin(s * 6.5 + phase)
        top.append((x + nx * w * 0.56, y + ny * w * 0.56))
        bot.append((x - nx * w * 0.44, y - ny * w * 0.44))
    d = "M" + " L".join("%s,%s" % (fmt(x), fmt(y)) for x, y in top)
    d += " L" + " L".join("%s,%s" % (fmt(x), fmt(y)) for x, y in reversed(bot)) + " Z"
    return d


def line_d(pts):
    return "M" + " L".join("%s,%s" % (fmt(x), fmt(y)) for x, y in pts)


def crest_path(points, W, H):
    """Smooth Catmull-Rom curve through normalised points, returned as cubic Bezier segments."""
    P = [(x * W, y * H) for x, y in points]
    d = "M%s,%s" % (fmt(P[0][0]), fmt(P[0][1]))
    n = len(P)
    for i in range(n - 1):
        p0 = P[i - 1] if i > 0 else P[i]
        p1, p2 = P[i], P[i + 1]
        p3 = P[i + 2] if i + 2 < n else P[i + 1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += " C%s,%s %s,%s %s,%s" % (
            fmt(c1[0]), fmt(c1[1]), fmt(c2[0]), fmt(c2[1]), fmt(p2[0]), fmt(p2[1])
        )
    return d


def hex_points(cx, cy, r, rot=0.0):
    pts = []
    for i in range(6):
        a = rot + i * math.pi / 3
        pts.append("%s,%s" % (fmt(cx + r * math.cos(a)), fmt(cy + r * math.sin(a))))
    return " ".join(pts)


# ---------------------------------------------------------------------------
# Layouts. Every list is normalised to the page: x across, y down.
# ---------------------------------------------------------------------------

DESKTOP = dict(
    name="desktop",
    W=2560,
    H=1600,
    seed=7,
    # hills: crest lines, low in the page. The front one dips lowest at x 70-85%.
    back=[(-0.05, 0.70), (0.12, 0.67), (0.32, 0.71), (0.52, 0.69), (0.70, 0.75), (0.86, 0.76), (1.05, 0.70)],
    front=[(-0.05, 0.78), (0.14, 0.75), (0.38, 0.80), (0.60, 0.78), (0.74, 0.84), (0.84, 0.86), (0.95, 0.82), (1.05, 0.80)],
    gloss_back=[(0.55, 0.73, 0.30, 0.03, 0.22)],
    gloss_front=[(0.30, 0.84, 0.36, 0.035, 0.30), (0.86, 0.90, 0.18, 0.03, 0.16)],
    # aurora ribbons: S-curves from lower left to upper right, as chains of cubic segments
    ribbons=[
        [[(-0.05, 0.76), (0.22, 0.80), (0.34, 0.60), (0.52, 0.50)],
         [(0.52, 0.50), (0.70, 0.40), (0.74, 0.30), (0.88, 0.22)],
         [(0.88, 0.22), (0.97, 0.17), (1.00, 0.15), (1.05, 0.14)]],
        [[(-0.05, 0.88), (0.24, 0.96), (0.42, 0.74), (0.60, 0.64)],
         [(0.60, 0.64), (0.78, 0.54), (0.84, 0.42), (0.95, 0.30)],
         [(0.95, 0.30), (1.00, 0.26), (1.03, 0.24), (1.05, 0.24)]],
        [[(-0.05, 0.62), (0.28, 0.66), (0.44, 0.40), (0.62, 0.34)],
         [(0.62, 0.34), (0.80, 0.28), (0.86, 0.20), (0.94, 0.11)],
         [(0.94, 0.11), (0.98, 0.07), (1.02, 0.06), (1.05, 0.06)]],
    ],
    ribbon_hw=[96, 56, 120],
    ribbon_phase=[0.0, 1.7, 3.1],
    core_index=0,
    # lens flare
    flare=(0.80, 0.16),
    flare_to=(0.35, 0.70),
    flare_scale=1.0,
    ghosts=[(0.42, 64, 0.10, "hex"), (0.62, 36, 0.07, "circ"), (0.83, 96, 0.05, "circ"),
            (1.02, 50, 0.12, "hex"), (1.28, 120, 0.05, "circ"), (1.50, 30, 0.08, "hex")],
    # cumulus banks: (cx, cy, rx, ry, opacity), normalised
    cumulus=[
        (0.60, 0.575, 0.075, 0.018, 0.55), (0.655, 0.56, 0.09, 0.026, 0.65),
        (0.72, 0.575, 0.085, 0.020, 0.60), (0.78, 0.59, 0.060, 0.014, 0.45),
        (0.58, 0.59, 0.050, 0.012, 0.40),
        (0.84, 0.47, 0.060, 0.016, 0.50), (0.90, 0.46, 0.070, 0.022, 0.60),
        (0.96, 0.48, 0.050, 0.014, 0.45),
    ],
    bubbles=34,
    bokeh=64,
    bubble_rule="desktop",
)

PHONE = dict(
    name="phone",
    W=1200,
    H=2600,
    seed=11,
    back=[(-0.05, 0.79), (0.20, 0.76), (0.45, 0.80), (0.70, 0.77), (1.05, 0.79)],
    front=[(-0.05, 0.84), (0.25, 0.82), (0.50, 0.86), (0.74, 0.90), (0.90, 0.87), (1.05, 0.85)],
    gloss_back=[(0.50, 0.785, 0.30, 0.008, 0.30)],
    gloss_front=[(0.50, 0.87, 0.40, 0.010, 0.35), (0.85, 0.93, 0.12, 0.007, 0.25)],
    ribbons=[
        [[(-0.05, 0.70), (0.25, 0.66), (0.40, 0.46), (0.58, 0.42)],
         [(0.58, 0.42), (0.75, 0.38), (0.88, 0.26), (1.05, 0.18)]],
        [[(-0.05, 0.56), (0.20, 0.62), (0.42, 0.36), (0.62, 0.34)],
         [(0.62, 0.34), (0.80, 0.30), (0.95, 0.14), (1.05, 0.04)]],
        [[(-0.05, 0.88), (0.30, 0.80), (0.52, 0.60), (0.75, 0.55)],
         [(0.75, 0.55), (0.90, 0.50), (1.00, 0.36), (1.05, 0.32)]],
    ],
    ribbon_hw=[70, 40, 95],
    ribbon_phase=[0.0, 1.7, 3.1],
    core_index=0,
    flare=(0.78, 0.20),
    flare_to=(0.30, 0.70),
    flare_scale=0.8,
    ghosts=[(0.42, 60, 0.10, "hex"), (0.62, 34, 0.07, "circ"), (0.83, 90, 0.05, "circ"),
            (1.02, 46, 0.12, "hex"), (1.28, 110, 0.05, "circ")],
    cumulus=[
        (0.25, 0.42, 0.10, 0.016, 0.50), (0.31, 0.41, 0.12, 0.022, 0.60),
        (0.38, 0.43, 0.09, 0.016, 0.50),
        (0.72, 0.56, 0.11, 0.018, 0.45), (0.79, 0.55, 0.09, 0.022, 0.55),
    ],
    bubbles=26,
    bokeh=50,
    bubble_rule="phone",
)


def in_name_block(x, y, W, H):
    return x > W - 560 and y > H - 200


def bubble_ok(x, y, r, layout):
    W, H = layout["W"], layout["H"]
    if layout["bubble_rule"] == "desktop":
        if x - r < 240:  # the icon column stays calm
            return False
        fx, fy = layout["flare"][0] * W, layout["flare"][1] * H
        if math.hypot(x - fx, y - fy) < 300 * layout["flare_scale"] + r:  # keep the flare clean
            return False
        if 0.3 * W - r < x < 0.7 * W + r and y - r < 0.65 * H:  # windows open in the centre
            return False
        if in_name_block(x, y, W, H) and r > 14:
            return False
        return True
    # phone: the top 360px is the icon row, bubbles run down the right edge and behind the name
    if y - r < 370:
        return False
    fx, fy = layout["flare"][0] * W, layout["flare"][1] * H
    if math.hypot(x - fx, y - fy) < 300 * layout["flare_scale"] + r:  # keep the flare clean
        return False
    return True


def sample_bubbles(layout, rnd):
    W, H = layout["W"], layout["H"]
    out = []
    tries = 0
    while len(out) < layout["bubbles"] and tries < 20000:
        tries += 1
        if layout["bubble_rule"] == "desktop":
            x = W * (0.64 + 0.34 * rnd.random())
            y = H * (0.10 + 0.82 * rnd.random())
        else:
            x = W * (0.56 + 0.41 * rnd.random())
            y = H * (0.15 + 0.82 * rnd.random())
        r = 8 + 82 * rnd.random() ** 2.2
        if not bubble_ok(x, y, r, layout):
            continue
        if any(math.hypot(x - a, y - b) < 0.8 * (r + c) for a, b, c, _o in out):
            continue
        out.append((x, y, r, 0.55 + 0.4 * rnd.random()))
    return out


def bubble_svg(layout, rnd):
    parts = []
    for x, y, r, op in sample_bubbles(layout, rnd):
        s = r / 50.0
        parts.append('<use href="#bub" transform="translate(%s,%s) scale(%s)" opacity="%s"/>'
                     % (fmt(x), fmt(y), "%.3f" % s, "%.2f" % op))
    return "\n".join(parts)


def bokeh_svg(layout, rnd):
    W, H = layout["W"], layout["H"]
    groups = {6: [], 12: [], 20: []}
    for _ in range(layout["bokeh"]):
        if layout["bubble_rule"] == "desktop":
            x = W * (0.36 + 0.64 * rnd.random() ** 0.8)
            y = H * 0.60 * rnd.random() ** 1.2
            if x < 260:
                continue
        else:
            x = W * (0.30 + 0.70 * rnd.random())
            y = H * (0.14 + 0.5 * rnd.random() ** 1.1)
        r = 10 + 50 * rnd.random() ** 1.4
        op = 0.06 + 0.14 * rnd.random()
        col = "#ffffff" if rnd.random() < 0.6 else "#7fe3f0"
        blur = rnd.choice([6, 12, 20])
        groups[blur].append('<circle cx="%s" cy="%s" r="%s" fill="%s" opacity="%s"/>'
                            % (fmt(x), fmt(y), fmt(r), col, "%.2f" % op))
    out = []
    for blur, items in groups.items():
        out.append('<g filter="url(#bk%d)">%s</g>' % (blur, "".join(items)))
    return "\n".join(out)


def cumulus_svg(layout):
    W, H = layout["W"], layout["H"]
    shade, white = [], []
    for cx, cy, rx, ry, op in layout["cumulus"]:
        X, Y, RX, RY = cx * W, cy * H, rx * W, ry * H
        shade.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#a6def7" opacity="%s"/>'
                     % (fmt(X), fmt(Y + RY * 0.45), fmt(RX), fmt(RY * 0.9), "%.2f" % (op * 0.5)))
        white.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#ffffff" opacity="%s"/>'
                     % (fmt(X), fmt(Y), fmt(RX), fmt(RY), "%.2f" % op))
    return ('<g filter="url(#cu)">%s%s</g>' % ("".join(shade), "".join(white)))


def flare_svg(layout, rnd):
    W, H = layout["W"], layout["H"]
    k = layout["flare_scale"]
    cx, cy = layout["flare"][0] * W, layout["flare"][1] * H
    tx, ty = layout["flare_to"][0] * W, layout["flare_to"][1] * H
    out = []
    # soft glow and haze
    out.append('<circle cx="%s" cy="%s" r="%s" fill="url(#glow)"/>' % (fmt(cx), fmt(cy), fmt(440 * k)))
    # starburst: thin tapered spikes, slightly blurred
    spikes = []
    for i in range(12):
        ang = i * (2 * math.pi / 12) + 0.15 * math.sin(i * 2.3)
        length = (150 + 170 * rnd.random()) * k
        if i % 3 == 0:
            length *= 1.6
        w = 3.5 * k
        px, py = -math.sin(ang), math.cos(ang)
        p1 = (cx + px * w, cy + py * w)
        p2 = (cx - px * w, cy - py * w)
        tip = (cx + math.cos(ang) * length, cy + math.sin(ang) * length)
        spikes.append('<polygon points="%s %s %s" fill="#fff6d8" opacity="0.26"/>'
                      % ("%s,%s" % (fmt(p1[0]), fmt(p1[1])),
                         "%s,%s" % (fmt(p2[0]), fmt(p2[1])),
                         "%s,%s" % (fmt(tip[0]), fmt(tip[1]))))
    out.append('<g filter="url(#sp)">%s</g>' % "".join(spikes))
    # white-gold core
    out.append('<circle cx="%s" cy="%s" r="%s" fill="#fff6d8" opacity="0.7" filter="url(#sp)"/>'
               % (fmt(cx), fmt(cy), fmt(44 * k)))
    out.append('<circle cx="%s" cy="%s" r="%s" fill="#ffffff" opacity="0.9" filter="url(#sp)"/>'
               % (fmt(cx), fmt(cy), fmt(12 * k)))
    # ghosts along the line toward the target
    dx, dy = tx - cx, ty - cy
    ghosts = []
    for s, r, op, shape in layout["ghosts"]:
        gx, gy = cx + dx * s, cy + dy * s
        rr = r * k
        if shape == "hex":
            ghosts.append('<polygon points="%s" fill="#ffffff" fill-opacity="%s" stroke="#ffffff" '
                          'stroke-opacity="%s" stroke-width="%s"/>'
                          % (hex_points(gx, gy, rr, 0.1), "%.3f" % (op * 0.5),
                             "%.3f" % min(1.0, op * 2.4), fmt(2 * k)))
        else:
            ghosts.append('<circle cx="%s" cy="%s" r="%s" fill="#ffffff" fill-opacity="%s" '
                          'stroke="#cdeeff" stroke-opacity="%s" stroke-width="%s"/>'
                          % (fmt(gx), fmt(gy), fmt(rr), "%.3f" % (op * 0.35),
                             "%.3f" % min(1.0, op * 1.8), fmt(2 * k)))
    out.append('<g>%s</g>' % "".join(ghosts))
    return "\n".join(out)


def hills_svg(layout):
    W, H = layout["W"], layout["H"]
    out = []
    for key, grad, rim_op, gloss, gloss_grad in (
        ("back", "backG", 0.5, layout["gloss_back"], "gloss"),
        ("front", "frontG", 0.55, layout["gloss_front"], "gloss"),
    ):
        crest = crest_path(layout[key], W, H)
        body = crest + " L%d,%d L%d,%d Z" % (1.05 * W, H + 4, -0.05 * W, H + 4)
        out.append('<path d="%s" fill="url(#%s)"/>' % (body, grad))
        out.append('<path d="%s" fill="url(#hillBase)"/>' % body)
        # blurred white rim light along the crest, then a crisp thin line
        out.append('<path d="%s" fill="none" stroke="#ffffff" stroke-width="12" opacity="%s" '
                   'filter="url(#rim)"/>' % (crest, "%.2f" % rim_op))
        out.append('<path d="%s" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.5"/>'
                   % crest)
        for cx, cy, rx, ry, op in gloss:
            out.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#ffffff" opacity="%s" '
                       'filter="url(#gl)"/>' % (fmt(cx * W), fmt(cy * H), fmt(rx * W), fmt(ry * H),
                                                "%.2f" % op))
    return "\n".join(out)


def ribbons_svg(layout):
    """Aurora: each ribbon is three nested bands (a wide aqua haze, a green-white body and a
    narrow white heart), each blurred to a different degree, plus one crisp core line."""
    W, H = layout["W"], layout["H"]
    outer, body, heart, cores = [], [], [], []
    for i, segs in enumerate(layout["ribbons"]):
        pts = ribbon_centre(segs, W, H)
        hw = layout["ribbon_hw"][i]
        ph = layout["ribbon_phase"][i]
        outer.append('<path d="%s" fill="url(#rbo)"/>' % ribbon_band(pts, hw * 2.1, ph))
        body.append('<path d="%s" fill="url(#rb%d)"/>' % (ribbon_band(pts, hw, ph), i))
        heart.append('<path d="%s" fill="#f2fffb" fill-opacity="0.4"/>'
                     % ribbon_band(pts, hw * 0.3, ph + 0.5))
        if i == layout["core_index"]:
            # the crisp core line, drawn on the middle 84% of the ribbon
            n = len(pts)
            cores.append(line_d(pts[int(n * 0.08):int(n * 0.92)]))
    core = "".join('<path d="%s" fill="none" stroke="#ffffff" stroke-width="2.5" '
                   'stroke-linecap="round" opacity="0.85"/>' % c for c in cores)
    return (
        '<g style="mix-blend-mode:screen">'
        '<g filter="url(#rb24)" opacity="0.95">%s</g>'
        '<g filter="url(#rb8)">%s</g>'
        '<g filter="url(#rb3)" opacity="0.8">%s</g>'
        '<g filter="url(#rb1)">%s</g>'
        '</g>' % ("".join(outer), "".join(body), "".join(heart), core)
    )


DEFS = """
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="{H}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#0a4a92"/>
    <stop offset="0.34" stop-color="#1e88d8"/>
    <stop offset="0.60" stop-color="#6cc6f2"/>
    <stop offset="0.76" stop-color="#e2f6ff"/>
    <stop offset="1" stop-color="#e2f6ff"/>
  </linearGradient>
  <radialGradient id="vig" cx="0.55" cy="0.45" r="0.75">
    <stop offset="0.55" stop-color="#042a52" stop-opacity="0"/>
    <stop offset="1" stop-color="#042a52" stop-opacity="0.22"/>
  </radialGradient>
  <linearGradient id="backG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#86d148"/>
    <stop offset="0.6" stop-color="#4fb032"/>
    <stop offset="1" stop-color="#2f8a1e"/>
  </linearGradient>
  <linearGradient id="frontG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b2ec66"/>
    <stop offset="0.55" stop-color="#6ec83c"/>
    <stop offset="1" stop-color="#3a9a1f"/>
  </linearGradient>
  <linearGradient id="hillBase" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0a3c10" stop-opacity="0"/>
    <stop offset="0.72" stop-color="#0a3c10" stop-opacity="0"/>
    <stop offset="1" stop-color="#0a3c10" stop-opacity="0.26"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#fff6d8" stop-opacity="0.95"/>
    <stop offset="0.12" stop-color="#fff6d8" stop-opacity="0.7"/>
    <stop offset="0.35" stop-color="#fff6d8" stop-opacity="0.3"/>
    <stop offset="1" stop-color="#fff6d8" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="rb0" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="0.2" stop-color="#ffffff" stop-opacity="0.42"/>
    <stop offset="0.45" stop-color="#9fefff" stop-opacity="0.72"/>
    <stop offset="0.75" stop-color="#b4f58a" stop-opacity="0.6"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0.15"/>
  </linearGradient>
  <linearGradient id="rb1" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="0.3" stop-color="#ffffff" stop-opacity="0.35"/>
    <stop offset="0.6" stop-color="#9fefff" stop-opacity="0.5"/>
    <stop offset="1" stop-color="#b4f58a" stop-opacity="0.25"/>
  </linearGradient>
  <linearGradient id="rb2" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="0.3" stop-color="#9fefff" stop-opacity="0.22"/>
    <stop offset="0.6" stop-color="#b4f58a" stop-opacity="0.3"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0.1"/>
  </linearGradient>
  <linearGradient id="rbo" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#7fe3f0" stop-opacity="0"/>
    <stop offset="0.4" stop-color="#7fe3f0" stop-opacity="0.5"/>
    <stop offset="0.7" stop-color="#b4f58a" stop-opacity="0.34"/>
    <stop offset="1" stop-color="#7fe3f0" stop-opacity="0.12"/>
  </linearGradient>
  <radialGradient id="bubFill" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0.72" stop-color="#bdf2ff" stop-opacity="0"/>
    <stop offset="0.9" stop-color="#c8f4ff" stop-opacity="0.12"/>
    <stop offset="1" stop-color="#e2fbff" stop-opacity="0.34"/>
  </radialGradient>
  <linearGradient id="bubRim" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7fe3f0"/>
    <stop offset="0.5" stop-color="#b9b0ff" stop-opacity="0.8"/>
    <stop offset="1" stop-color="#b4f58a"/>
  </linearGradient>
  <g id="bub">
    <circle r="50" fill="url(#bubFill)"/>
    <circle r="48.5" fill="none" stroke="url(#bubRim)" stroke-width="3" opacity="0.6"/>
    <path d="M-36,-6 Q-30,-34 -4,-40" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.9"/>
    <path d="M-24,12 Q-20,26 -6,31" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity="0.35"/>
    <circle cx="26" cy="-30" r="3.4" fill="#ffffff" opacity="0.95"/>
  </g>
  <filter id="cu" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="sp" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="rim" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="gl" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="rb1" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="1"/></filter>
  <filter id="rb3" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="rb8" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="rb24" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="24"/></filter>
  <filter id="bk6" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="bk12" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="12"/></filter>
  <filter id="bk20" filterUnits="userSpaceOnUse" x="-600" y="-600" width="{W1200}" height="{H1200}"><feGaussianBlur stdDeviation="20"/></filter>
</defs>
"""


def page(layout):
    W, H = layout["W"], layout["H"]
    rnd = random.Random(layout["seed"])
    # the RNG draws happen in a fixed order, so the output does not change between runs
    flare = flare_svg(layout, rnd)
    bubbles = bubble_svg(layout, rnd)
    bokeh = bokeh_svg(layout, rnd)
    defs = (DEFS.replace("{H}", str(H)).replace("{W1200}", str(W + 1200))
            .replace("{H1200}", str(H + 1200)))
    body = "\n".join([
        '<rect width="%d" height="%d" fill="url(#sky)"/>' % (W, H),
        cumulus_svg(layout),
        ribbons_svg(layout),
        flare,
        hills_svg(layout),
        bubbles,
        bokeh,
        '<rect width="%d" height="%d" fill="url(#vig)"/>' % (W, H),
    ])
    return (
        '<!doctype html>\n'
        '<html lang="en">\n'
        '<head>\n'
        '<meta charset="utf-8">\n'
        '<title>Aero wallpaper, %s</title>\n'
        '<style>html,body{margin:0;padding:0;overflow:hidden;background:#1e88d8}'
        'svg{display:block}</style>\n'
        '</head>\n'
        '<body>\n'
        '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">\n'
        '%s\n%s\n</svg>\n'
        '</body>\n'
        '</html>\n'
    ) % (layout["name"], W, H, W, H, defs, body)


def main():
    for layout in (DESKTOP, PHONE):
        path = os.path.join(HERE, layout["name"] + ".html")
        with open(path, "w") as fh:
            fh.write(page(layout))
        print("wrote", path)


if __name__ == "__main__":
    main()
