# Generates the four Aero game icons (minesweeper, solitaire, snake, blocks).
# Run from the repo root: python3 -I design/aero/game-icons-a/gen.py
# Output goes to static/aero/icons/games/*.svg. Numbers are rounded to one decimal.
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', '..', 'static', 'aero', 'icons', 'games')


def f(v):
    s = '%.1f' % v
    return s[:-2] if s.endswith('.0') else s


def lg(id_, stops, x1=0, y1=0, x2=0, y2=1, units=None):
    u = ' gradientUnits="%s"' % units if units else ''
    s = ''.join('<stop offset="%s" stop-color="%s"%s/>' % (
        o, c, '' if op is None else ' stop-opacity="%s"' % op) for o, c, op in stops)
    return '<linearGradient id="%s" x1="%s" y1="%s" x2="%s" y2="%s"%s>%s</linearGradient>' % (
        id_, f(x1), f(y1), f(x2), f(y2), u, s)


def rg(id_, stops, cx=.35, cy=.3, r=.75):
    s = ''.join('<stop offset="%s" stop-color="%s"/>' % (o, c) for o, c in stops)
    return '<radialGradient id="%s" cx="%s" cy="%s" r="%s">%s</radialGradient>' % (id_, cx, cy, r, s)


def svg(defs, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><defs>%s</defs>%s</svg>\n'
            % (''.join(defs), body))


def write(name, text):
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, name), 'w') as fh:
        fh.write(text)
    print(name, len(text.encode()), 'bytes')


def gloss(d, gid):
    return '<path d="%s" fill="url(#%s)"/>' % (d, gid)


def rim(d):
    return '<path d="%s" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>' % d


# ---------------------------------------------------------------- minesweeper
def minesweeper():
    p = 'minesweeper'
    defs = [
        lg(p + '-tile', [(0, '#9fd6f7', None), (1, '#3b8fd6', None)], 24, 24, 232, 232, 'userSpaceOnUse'),
        lg(p + '-gloss', [(0, '#fff', .75), (1, '#fff', 0)]),
        rg(p + '-ball', [(0, '#4d6480'), (.45, '#15283d'), (1, '#0c1d2e')]),
    ]
    tile = ('<rect x="24" y="24" width="208" height="208" rx="40" fill="url(#%s-tile)" '
            'stroke="#1f64ad" stroke-width="4"/>' % p)
    tile_gloss = gloss('M24,64 Q24,24 64,24 H192 Q232,24 232,64 V118 Q128,142 24,112 Z', p + '-gloss')
    tile_rim = rim('M58,220 Q128,232 198,220')
    # Eight tapered spikes around the ball, pointing out from its centre.
    cx, cy = 128, 140
    spike_paths = []
    for k in range(8):
        a = math.radians(k * 45)
        ux, uy = math.cos(a), math.sin(a)
        px, py = -uy, ux
        b = [(cx + ux * 44 + px * 11, cy + uy * 44 + py * 11), (cx + ux * 90, cy + uy * 90),
             (cx + ux * 44 - px * 11, cy + uy * 44 - py * 11)]
        spike_paths.append('M%s,%s L%s,%s L%s,%s Z' % tuple(f(v) for pt in b for v in pt))
    spikes = ('<path d="%s" fill="url(#%s-ball)" stroke="#06325f" stroke-width="3" stroke-linejoin="round"/>'
              % (' '.join(spike_paths), p))
    ball = '<circle cx="128" cy="140" r="56" fill="url(#%s-ball)" stroke="#06325f" stroke-width="4"/>' % p
    ball_gloss = gloss('M74,140 A56,56 0 0 1 182,140 Q128,118 74,140 Z', p + '-gloss')
    spec = ('<circle cx="102" cy="112" r="12" fill="#fff" fill-opacity=".95"/>'
            '<circle cx="96" cy="106" r="4" fill="#fff"/>')
    ball_rim = rim('M90,184 A56,56 0 0 0 166,184')
    write(p + '.svg', svg(defs, tile + tile_gloss + tile_rim + spikes + ball + ball_gloss + spec + ball_rim))


# ---------------------------------------------------------------- solitaire
HEART = ('M0,18 C-4,12 -30,-2 -30,-16 C-30,-28 -20,-34 -10,-34 C-4,-34 -1,-30 0,-26 '
         'C1,-30 4,-34 10,-34 C20,-34 30,-28 30,-16 C30,-2 4,12 0,18 Z')


def solitaire():
    p = 'solitaire'
    defs = [
        lg(p + '-white', [(0, '#ffffff', None), (1, '#d3e2f1', None)], -62, -84, 62, 84),
        lg(p + '-blue', [(0, '#3aa2ea', None), (1, '#0b3f7a', None)], -62, -84, 62, 84),
        lg(p + '-red', [(0, '#f5785e', None), (1, '#c02a1c', None)], -30, -34, 30, 18),
        lg(p + '-gloss', [(0, '#fff', .75), (1, '#fff', 0)]),
        '<pattern id="%s-pat" width="18" height="18" patternUnits="userSpaceOnUse">'
        '<path d="M9,1 L17,9 L9,17 L1,9 Z" fill="none" stroke="#8fd0f7" stroke-opacity=".7" stroke-width="2"/>'
        '</pattern>' % p,
    ]
    back_card = ('<rect x="-62" y="-84" width="124" height="168" rx="16" fill="url(#%s-blue)" '
                 'stroke="#0a3566" stroke-width="4"/>'
                 '<rect x="-48" y="-70" width="96" height="140" rx="10" fill="url(#%s-pat)" '
                 'stroke="#fff" stroke-opacity=".55" stroke-width="2.5"/>' % (p, p))
    back_gloss = gloss('M-62,-68 Q-62,-84 -46,-84 H46 Q62,-84 62,-68 V-22 Q0,-4 -62,-30 Z', p + '-gloss')
    back = '<g transform="translate(94 132) rotate(-16)">%s%s</g>' % (back_card, back_gloss)

    front_card = ('<rect x="-62" y="-84" width="124" height="168" rx="16" fill="url(#%s-white)" '
                  'stroke="#8ea9c4" stroke-width="4"/>' % p)
    ace = ('<path d="M-56,-58 L-48,-76 L-40,-58 M-53,-65 H-43" fill="none" stroke="#d63a24" '
           'stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>')
    heart = ('<g transform="translate(0 8) scale(1.3)"><path d="%s" fill="url(#%s-red)" '
             'stroke="#9a1a12" stroke-width="2"/></g>' % (HEART, p))
    front_gloss = gloss('M-62,-68 Q-62,-84 -46,-84 H46 Q62,-84 62,-68 V-26 Q0,-8 -62,-38 Z', p + '-gloss')
    front_rim = rim('M-46,76 Q0,84 46,76')
    front = '<g transform="translate(150 124) rotate(9)">%s%s%s%s%s</g>' % (
        front_card, ace, heart, front_gloss, front_rim)
    write(p + '.svg', svg(defs, back + front))


# ---------------------------------------------------------------- snake
def snake():
    p = 'snake'
    # A gel-bead snake: beads run along a wave from the tail (bottom left) up to the head.
    n = 9
    beads = []
    for i in range(n + 1):
        t = i / n
        x = 52 + 70 * t + 30 * math.sin(t * math.pi * 2.6)
        y = 210 - 150 * t
        beads.append((x, y, 21 + 6 * t))
    hx, hy, hr = beads[-1]
    defs = [
        rg(p + '-bead', [(0, '#e4fbc4'), (.4, '#7fd94c'), (1, '#23840f')], .36, .3, .72),
        rg(p + '-head', [(0, '#e4fbc4'), (.45, '#7fd94c'), (1, '#23840f')], .36, .3, .72),
        lg(p + '-gloss', [(0, '#fff', .8), (1, '#fff', 0)]),
        lg(p + '-hgloss', [(0, '#fff', .8), (1, '#fff', 0)]),
        lg(p + '-apple', [(0, '#ff8a70', None), (1, '#b3241a', None)], 150, 130, 240, 228, 'userSpaceOnUse'),
        lg(p + '-leaf', [(0, '#9be85a', None), (1, '#2f9a1c', None)]),
        lg(p + '-agloss', [(0, '#fff', .75), (1, '#fff', 0)]),
    ]
    body = ''
    for x, y, r in beads[:-1]:
        body += ('<g><circle cx="%s" cy="%s" r="%s" fill="url(#%s-bead)" stroke="#1d6a10" stroke-width="3"/>'
                 '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#%s-gloss)"/></g>'
                 % (f(x), f(y), f(r), p, f(x - r * .12), f(y - r * .42), f(r * .6), f(r * .34), p))
    head = ('<circle cx="%s" cy="%s" r="%s" fill="url(#%s-head)" stroke="#1d6a10" stroke-width="3"/>'
            % (f(hx), f(hy), f(hr), p))
    eyes = ''.join(
        '<circle cx="%s" cy="%s" r="7" fill="#fff"/><circle cx="%s" cy="%s" r="3.6" fill="#0f3d12"/>'
        '<circle cx="%s" cy="%s" r="1.4" fill="#fff"/>' % (
            f(hx + ex), f(hy - 4), f(hx + ex + 1), f(hy - 3), f(hx + ex - 1), f(hy - 6))
        for ex in (-8, 8))
    smile = ('<path d="M%s,%s Q%s,%s %s,%s" fill="none" stroke="#0f3d12" stroke-width="2.6" stroke-linecap="round"/>'
             % (f(hx - 6), f(hy + 8), f(hx), f(hy + 13), f(hx + 6), f(hy + 8)))
    head_gloss = ('<ellipse cx="%s" cy="%s" rx="13" ry="7" fill="#fff" fill-opacity=".55" transform="rotate(-30 %s %s)"/>'
                  % (f(hx - 2), f(hy - 15), f(hx - 2), f(hy - 15)))
    apple = ('<path d="M196,150 C206,140 230,138 236,160 C244,186 232,222 214,222 C206,222 202,218 196,218 '
             'C188,220 180,224 170,216 C152,202 148,176 160,160 C170,146 186,152 196,150 Z" '
             'fill="url(#%s-apple)" stroke="#8a1a12" stroke-width="4"/>' % p)
    apple_gloss = ('<path d="M168,166 C170,156 180,152 190,154 C180,160 176,170 178,182 C170,180 167,174 168,166 Z" '
                   'fill="url(#%s-agloss)"/>' % p)
    stem = '<path d="M196,150 Q194,132 202,124" fill="none" stroke="#5b3b1b" stroke-width="5" stroke-linecap="round"/>'
    leaf = ('<path d="M200,138 Q214,116 238,120 Q228,142 200,138 Z" fill="url(#%s-leaf)" '
            'stroke="#2f7a14" stroke-width="3" stroke-linejoin="round"/>' % p)
    write(p + '.svg', svg(defs, body + head + head_gloss + eyes + smile + apple + apple_gloss + stem + leaf))


# ---------------------------------------------------------------- blocks
JEWELS = {
    'aqua': ('#7fe6f5', '#0a8fac', '#066e86'),
    'green': ('#9ee86e', '#2d8a12', '#1f6510'),
    'amber': ('#ffe68a', '#e08a0c', '#a2640a'),
    'pink': ('#ff9ccc', '#b82a78', '#862058'),
}


def blocks():
    p = 'blocks'
    s = 68
    # Order of cells: row of three, then the T's top cell.
    cells = [(16, 120, 'aqua'), (90, 120, 'green'), (164, 120, 'amber'), (90, 46, 'pink')]
    defs = [lg(p + '-gloss', [(0, '#fff', .8), (1, '#fff', 0)])]
    for k, (hi, lo, _) in JEWELS.items():
        defs.append(lg('%s-%s' % (p, k), [(0, hi, None), (1, lo, None)]))
    body = ''
    for x, y, k in cells:
        edge = JEWELS[k][2]
        x1, x2 = x + 8, x + s - 8
        top_gloss = ('M%s,%s Q%s,%s %s,%s H%s Q%s,%s %s,%s V%s Q%s,%s %s,%s Z' % (
            f(x1), f(y + 14), f(x1), f(y + 8), f(x1 + 6), f(y + 8), f(x2 - 6), f(x2), f(y + 8), f(x2), f(y + 14),
            f(y + s * .44), f(x + s / 2), f(y + s * .56), f(x1), f(y + s * .42)))
        body += ('<g>'
                 '<rect x="%s" y="%s" width="%s" height="%s" rx="13" fill="url(#%s-%s)" stroke="%s" stroke-width="4"/>'
                 '<rect x="%s" y="%s" width="%s" height="%s" rx="8" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.5"/>'
                 '%s%s</g>' % (
                     f(x), f(y), s, s, p, k, edge,
                     f(x + 8), f(y + 8), f(s - 16), f(s - 16),
                     gloss(top_gloss, p + '-gloss'),
                     rim('M%s,%s H%s' % (f(x + 14), f(y + s - 6), f(x + s - 14)))))
    write(p + '.svg', svg(defs, body))


if __name__ == '__main__':
    minesweeper()
    solitaire()
    snake()
    blocks()
