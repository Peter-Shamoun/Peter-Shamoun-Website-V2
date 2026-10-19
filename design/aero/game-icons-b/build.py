#!/usr/bin/env python3
# Generates the game icons bricks.svg, paddle.svg and invaders.svg (round 1, asset-game-icons-b).
# Run with: python3 -I design/aero/game-icons-b/build.py
# Output goes to static/aero/icons/games/. Coordinates are written to one decimal, whitespace stripped.
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..')
OUT = os.path.join(ROOT, 'static', 'aero', 'icons', 'games')
HEAD = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">'


def n(v):
    s = f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s


def grad(gid, stops, x1=0, y1=0, x2=1, y2=1, units=None):
    u = f' gradientUnits="{units}"' if units else ''
    body = ''.join(f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{a}"' if a is not None else '') + '/>'
                   for o, c, a in stops)
    return (f'<linearGradient id="{gid}" x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}"{u}>{body}'
            '</linearGradient>')


def gloss_grad(gid):
    # White sheen, .75 at the top to 0 at the bottom of whatever box it fills.
    return grad(gid, [(0, '#fff', .75), (1, '#fff', 0)], 0, 0, 0, 1)


def write(name, parts):
    text = ''.join(parts)
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(text)
    print(name, len(text.encode()), 'bytes')


# ---------- bricks ----------
def brick(x, y, w, h, fill, edge):
    return (f'<rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" rx="5" fill="url(#{fill})" '
            f'stroke="{edge}" stroke-width="3"/>'
            f'<rect x="{n(x + 4)}" y="{n(y + 3)}" width="{n(w - 8)}" height="{n(h / 2 - 3)}" rx="3" '
            f'fill="url(#bricks-gloss)"/>'
            f'<path d="M{n(x + 6)} {n(y + h - 2.5)}H{n(x + w - 6)}" stroke="#fff" stroke-opacity=".3" '
            f'stroke-width="1.5" stroke-linecap="round"/>')


def bricks():
    defs = ('<defs>'
            + grad('bricks-o', [(0, '#ffc47f', None), (1, '#dc6a1c', None)])
            + grad('bricks-g', [(0, '#9be36e', None), (1, '#2b8a12', None)])
            + grad('bricks-b', [(0, '#68c0f7', None), (1, '#1258a8', None)])
            + grad('bricks-ball', [(0, '#a8f2ff', None), (1, '#12aac8', None)])
            + grad('bricks-silver', [(0, '#fbfdfe', None), (1, '#8e9eb0', None)])
            + gloss_grad('bricks-gloss')
            + '</defs>')
    body = []
    # Row one: four bricks, row two: three bricks, staggered by half a brick.
    row1 = [(14, 'bricks-o', '#9a3f14'), (72, 'bricks-g', '#22660f'), (130, 'bricks-b', '#0c3f80'),
            (188, 'bricks-o', '#9a3f14')]
    row2 = [(43, 'bricks-g', '#22660f'), (101, 'bricks-b', '#0c3f80'), (159, 'bricks-o', '#9a3f14')]
    for x, f, e in row1:
        body.append(brick(x, 30, 52, 38, f, e))
    for x, f, e in row2:
        body.append(brick(x, 74, 52, 38, f, e))
    # Ball with a white crescent rim along its lower edge.
    body.append('<circle cx="128" cy="152" r="15" fill="url(#bricks-ball)" stroke="#0b7f96" stroke-width="3"/>')
    body.append('<ellipse cx="128" cy="144" rx="9" ry="5" fill="url(#bricks-gloss)"/>')
    body.append('<path d="M116.5 158.5A13 13 0 0 0 139.5 158.5" fill="none" stroke="#fff" '
                'stroke-opacity=".3" stroke-width="1.5" stroke-linecap="round"/>')
    # Silver gel paddle.
    body.append('<rect x="72" y="196" width="112" height="22" rx="11" fill="url(#bricks-silver)" '
                'stroke="#66778a" stroke-width="3"/>')
    body.append('<rect x="77" y="199" width="102" height="8" rx="4" fill="url(#bricks-gloss)"/>')
    body.append('<path d="M86 215.5H170" stroke="#fff" stroke-opacity=".3" stroke-width="1.5" '
                'stroke-linecap="round"/>')
    return [HEAD, defs] + body + ['</svg>']


# ---------- paddle (Pong) ----------
def paddle():
    defs = ('<defs>'
            + grad('paddle-screen', [(0, '#0f3868', None), (1, '#03112a', None)])
            + grad('paddle-bar', [(0, '#ffffff', None), (1, '#9ef0ff', None)])
            + grad('paddle-gloss', [(0, '#fff', .5), (1, '#fff', 0)], 0, 0, 0, 1)
            + '<filter id="paddle-glow" x="-50%" y="-50%" width="200%" height="200%">'
              '<feGaussianBlur stdDeviation="7"/></filter>'
            + '</defs>')
    body = [
        # Glass screen with a dark edge and a sheen across the top.
        '<rect x="12" y="12" width="232" height="232" rx="36" fill="url(#paddle-screen)" '
        'stroke="#06325f" stroke-width="4"/>',
        '<rect x="18" y="18" width="220" height="108" rx="30" fill="url(#paddle-gloss)"/>',
        '<path d="M48 238H208" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>',
    ]
    # Centre net: a column of short dashes.
    for i in range(9):
        y = 30 + i * 24
        body.append(f'<rect x="126.5" y="{n(y)}" width="3" height="12" rx="1.5" fill="#fff" fill-opacity=".22"/>')
    # Glow layer: one blur on a copy of the paddles and ball.
    glow = ('<g filter="url(#paddle-glow)" fill="#7ff0ff" opacity=".9">'
            '<rect x="28" y="94" width="14" height="68" rx="7"/>'
            '<rect x="214" y="94" width="14" height="68" rx="7"/>'
            '<circle cx="128" cy="128" r="10"/></g>')
    crisp = ('<rect x="28" y="94" width="14" height="68" rx="7" fill="url(#paddle-bar)"/>'
             '<rect x="214" y="94" width="14" height="68" rx="7" fill="url(#paddle-bar)"/>'
             '<circle cx="128" cy="128" r="9" fill="#ffffff"/>'
             '<circle cx="125" cy="125" r="3" fill="#ffffff" fill-opacity=".9"/>')
    return [HEAD, defs] + body + [glow, crisp, '</svg>']


# ---------- invaders ----------
PAT = [
    "..X.....X..",
    "...X...X...",
    "..XXXXXXX..",
    ".XX.XXX.XX.",
    "XXXXXXXXXXX",
    "X.XXXXXXX.X",
    "X.X.....X.X",
    "...XX.XX...",
]
EYES = {(2, 3), (2, 7)}
X0, Y0, P = 29, 36, 18  # origin, pitch of cells
GEL = 14                # gel cell size, leaves 3-unit edge rim in darker green


def invaders():
    cells_edge, cells_gel, gloss, eyes = [], [], [], []
    for r, row in enumerate(PAT):
        for c, ch in enumerate(row):
            if ch != 'X':
                continue
            x = X0 + c * P
            y = Y0 + r * P
            cells_edge.append(f'<rect x="{n(x - 1)}" y="{n(y - 1)}" width="20" height="20" rx="6"/>')
            if (r, c) in EYES:
                eyes.append(f'<rect x="{n(x + 2)}" y="{n(y + 2)}" width="{GEL}" height="{GEL}" rx="4.2" '
                            f'fill="url(#invaders-eye)"/>'
                            f'<circle cx="{n(x + 9.5)}" cy="{n(y + 9.5)}" r="3" fill="#174a0e"/>'
                            f'<circle cx="{n(x + 8.5)}" cy="{n(y + 8.5)}" r="1" fill="#fff"/>')
            else:
                cells_gel.append(f'<rect x="{n(x + 2)}" y="{n(y + 2)}" width="{GEL}" height="{GEL}" rx="4.2"/>')
                gloss.append(f'<rect x="{n(x + 2)}" y="{n(y + 2)}" width="{GEL}" height="7" rx="4.2" '
                             f'fill="url(#invaders-gloss)"/>')
    body = ('<g id="invaders-body">'
            '<g fill="#1d6b12">' + ''.join(cells_edge) + '</g>'
            '<g fill="url(#invaders-gel)">' + ''.join(cells_gel) + '</g>'
            + ''.join(gloss) + ''.join(eyes) + '</g>')
    defs = ('<defs>'
            + grad('invaders-gel', [(0, '#9be85a', None), (1, '#2e8a1c', None)], 29, 36, 227, 178, 'userSpaceOnUse')
            + grad('invaders-eye', [(0, '#ffffff', None), (1, '#cdeec0', None)])
            + gloss_grad('invaders-gloss')
            + grad('invaders-fade', [(0, '#fff', .25), (1, '#fff', 0)], 0, 181, 0, 244, 'userSpaceOnUse')
            + '<mask id="invaders-mirror" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256">'
              '<rect x="0" y="181" width="256" height="75" fill="url(#invaders-fade)"/></mask>'
            + body
            + '</defs>')
    # Mirrored reflection about the bottom edge (y = 181), faded by the mask.
    # The mask sits on an outer group so it is in page space, not the flipped space.
    reflect = ('<g mask="url(#invaders-mirror)"><use href="#invaders-body" '
               'transform="matrix(1 0 0 -1 0 362)"/></g>')
    return [HEAD, defs, '<use href="#invaders-body"/>', reflect, '</svg>']


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    write('bricks.svg', bricks())
    write('paddle.svg', paddle())
    write('invaders.svg', invaders())
