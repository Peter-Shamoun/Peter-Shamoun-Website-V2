#!/usr/bin/env python3
"""Generate the round-1 desktop icons research, contact, games and tidy.

Run from anywhere: python3 -I design/aero/icons-b/gen.py
Writes static/aero/icons/<name>.svg at the repo root. Every object follows the
Aero art rules in .studio/DESIGN.md section 9: a base gradient, an own-hue edge,
a white gloss over the top half and a faint white rim on the bottom edge.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = os.path.join(ROOT, 'static', 'aero', 'icons')


def svg(body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">'
            + body + '</svg>')


def grad(gid, stops, x2=0, y2=1, x1=0, y1=0):
    """Linear gradient in object bounding box units."""
    s = ''.join(
        f'<stop offset="{o}" stop-color="{c}" stop-opacity="{a}"/>'
        for o, c, a in stops)
    return (f'<linearGradient id="{gid}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">'
            f'{s}</linearGradient>')


def rgrad(gid, stops, cx=0.35, cy=0.3, r=0.8):
    s = ''.join(
        f'<stop offset="{o}" stop-color="{c}" stop-opacity="{a}"/>'
        for o, c, a in stops)
    return (f'<radialGradient id="{gid}" cx="{cx}" cy="{cy}" r="{r}">'
            f'{s}</radialGradient>')


def gloss_grad(gid):
    """White gloss: .75 at the top of the shape, 0 at its bottom."""
    return grad(gid, [(0, '#ffffff', 0.75), (1, '#ffffff', 0)])


def rim(d):
    """Faint white rim on the bottom edge."""
    return (f'<path d="{d}" fill="none" stroke="#ffffff" stroke-opacity=".3" '
            'stroke-width="2.5" stroke-linecap="round"/>')


def rrect(x, y, w, h, r):
    """Path for a rounded rectangle."""
    return (f'M{x + r} {y}H{x + w - r}Q{x + w} {y} {x + w} {y + r}'
            f'V{y + h - r}Q{x + w} {y + h} {x + w - r} {y + h}'
            f'H{x + r}Q{x} {y + h} {x} {y + h - r}V{y + r}Q{x} {y} {x + r} {y}Z')


def top_rrect(x, y, w, h, r):
    """Rounded rectangle path with a rounded top and square bottom."""
    return (f'M{x} {y + h}V{y + r}Q{x} {y} {x + r} {y}H{x + w - r}'
            f'Q{x + w} {y} {x + w} {y + r}V{y + h}Z')


# ---------------------------------------------------------------- research

def research():
    p = 'research'
    flask = ('M104 34V108L48 212Q40 228 60 230H196Q216 228 208 212'
             'L152 108V34Z')
    defs = ''.join([
        grad(f'{p}-glass', [(0, '#ffffff', 0.7), (1, '#7fe3f0', 0.35)],
             x2=1, y2=1),
        grad(f'{p}-liquid', [(0, '#b6f35a', 1), (1, '#3fae1e', 1)]),
        gloss_grad(f'{p}-gloss'),
        f'<clipPath id="{p}-clip"><path d="{flask}"/></clipPath>',
    ])
    bubbles = (
        '<circle cx="110" cy="196" r="7" fill="#f4ffe0" fill-opacity=".6" '
        'stroke="#eaffd2" stroke-opacity=".9" stroke-width="1.5"/>'
        '<circle cx="141" cy="184" r="5" fill="#f4ffe0" fill-opacity=".6" '
        'stroke="#eaffd2" stroke-opacity=".9" stroke-width="1.5"/>'
        '<circle cx="124" cy="172" r="3.5" fill="#f4ffe0" fill-opacity=".6" '
        'stroke="#eaffd2" stroke-opacity=".9" stroke-width="1.5"/>'
    )
    body = (
        f'<defs>{defs}</defs>'
        f'<path d="{flask}" fill="url(#{p}-glass)"/>'
        f'<g clip-path="url(#{p}-clip)">'
        f'<path d="M40 162H216V240H40Z" fill="url(#{p}-liquid)"/>'
        '<path d="M76 162H180" stroke="#f2ffd6" stroke-width="3" '
        'stroke-opacity=".9"/>'
        f'{bubbles}'
        f'<path d="M40 30H216V130H40Z" fill="url(#{p}-gloss)"/>'
        '</g>'
        f'<path d="{flask}" fill="none" stroke="#1f7f94" stroke-width="4" '
        'stroke-linejoin="round"/>'
        f'<rect x="94" y="22" width="68" height="12" rx="4" '
        f'fill="url(#{p}-glass)" stroke="#1f7f94" stroke-width="3.5"/>'
        '<path d="M112 46V100L66 196" fill="none" stroke="#ffffff" '
        'stroke-opacity=".75" stroke-width="5" stroke-linecap="round"/>'
        '<path d="M146 46V92" fill="none" stroke="#ffffff" '
        'stroke-opacity=".45" stroke-width="2.5" stroke-linecap="round"/>'
        + rim('M62 226Q128 233 194 226')
    )
    return svg(body)


# ----------------------------------------------------------------- contact

def contact():
    p = 'contact'
    env = 'M28 72Q28 64 36 64H220Q228 64 228 72V190Q228 200 218 200H38Q28 200 28 190Z'
    flap = 'M28 70L128 146L228 70Z'
    defs = ''.join([
        grad(f'{p}-body', [(0, '#ffffff', 1), (1, '#c9dbea', 1)], x2=1, y2=1),
        grad(f'{p}-flap', [(0, '#dff3ff', 1), (1, '#74c6f2', 1)], x2=0.6, y2=1),
        gloss_grad(f'{p}-gloss'),
        rgrad(f'{p}-disc', [(0, '#e2fcff', 1), (0.35, '#7fe3f0', 1),
                            (0.7, '#16b8d4', 1), (1, '#0b7f96', 1)]),
    ])
    at = (
        '<path d="M136.9 136.7A9.5 9.5 0 1 0 136.9 143.3" fill="none" '
        'stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>'
        '<path d="M136.9 143.3C137 150 141 152.5 145.5 152" fill="none" '
        'stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>'
        '<circle cx="127" cy="141" r="4.2" fill="none" stroke="#ffffff" '
        'stroke-width="3"/>'
        '<path d="M131.2 137V145.5" fill="none" stroke="#ffffff" '
        'stroke-width="3" stroke-linecap="round"/>'
    )
    body = (
        f'<defs>{defs}</defs>'
        f'<path d="{env}" fill="url(#{p}-body)" stroke="#7d9bb8" '
        'stroke-width="3.5" stroke-linejoin="round"/>'
        '<path d="M30 198L104 136M226 198L152 136" fill="none" '
        'stroke="#9fbcd6" stroke-width="2.5" stroke-linecap="round"/>'
        f'<path d="{flap}" fill="url(#{p}-flap)" stroke="#1e88d8" '
        'stroke-width="4" stroke-linejoin="round"/>'
        '<path d="M28 70H228V118Q128 150 28 118Z" fill="url(#' + p + '-gloss)"/>'
        '<path d="M108 140A20 20 0 0 1 148 140Z" fill="url(#' + p + '-gloss)"/>'
        f'<circle cx="128" cy="140" r="20" fill="url(#{p}-disc)" '
        'stroke="#0b6f86" stroke-width="3"/>'
        f'{at}'
        + rim('M40 194Q128 201 216 194')
    )
    return svg(body)


# ------------------------------------------------------------------- games

def games():
    p = 'games'
    pad = ('M81 84H103V103H122V125H103V144H81V125H62V103H81Z')
    pad_body = ('M70 68H186Q206 68 210 96L224 150Q230 186 204 196'
                'Q184 200 172 184Q164 176 152 172H104Q92 176 84 184'
                'Q72 200 52 196Q26 186 32 150L46 96Q50 68 70 68Z')
    buttons = [
        (168, 100, 'green', '#58b92a', '#8fdc5c', '#2f7a14'),
        (182, 114, 'red', '#e0412a', '#ff8a72', '#9c2a1a'),
        (168, 128, 'aqua', '#16b8d4', '#7fe3f0', '#0b7f96'),
        (154, 114, 'orange', '#f3923b', '#ffc27a', '#b8561a'),
    ]
    defs = ''.join([
        grad(f'{p}-body', [(0, '#ffffff', 1), (1, '#c4d4e3', 1)], x2=1, y2=1),
        grad(f'{p}-pad', [(0, '#1e88d8', 1), (1, '#0b5ca8', 1)], x2=1, y2=1),
        gloss_grad(f'{p}-gloss'),
        f'<clipPath id="{p}-clip"><path d="{pad_body}"/></clipPath>',
    ])
    for _, _, name, base, light, _edge in buttons:
        defs += grad(f'{p}-btn-{name}', [(0, light, 1), (1, base, 1)],
                     x2=1, y2=1)
    btns = ''
    for cx, cy, name, _base, _light, edge in buttons:
        btns += (f'<circle cx="{cx}" cy="{cy}" r="9" fill="url(#{p}-btn-{name})" '
                 f'stroke="{edge}" stroke-width="3"/>'
                 f'<ellipse cx="{cx}" cy="{cy - 4}" rx="5.5" ry="3" '
                 f'fill="url(#{p}-gloss)"/>')
    body = (
        f'<defs>{defs}</defs>'
        f'<path d="{pad_body}" fill="url(#{p}-body)"/>'
        f'<g clip-path="url(#{p}-clip)">'
        f'<path d="M20 60H240V118H20Z" fill="url(#{p}-gloss)"/></g>'
        f'<path d="{pad_body}" fill="none" stroke="#7d95ac" stroke-width="4" '
        'stroke-linejoin="round"/>'
        f'<path d="{pad}" fill="url(#{p}-pad)" stroke="#074a86" '
        'stroke-width="3" stroke-linejoin="round"/>'
        f'<path d="M81 91H103V96H81Z" fill="#ffffff" fill-opacity=".45"/>'
        f'{btns}'
        + rim('M66 190Q128 199 190 190')
    )
    return svg(body)


# -------------------------------------------------------------------- tidy

def tidy():
    p = 'tidy'
    defs = ''.join([
        grad(f'{p}-glass', [(0, '#dff3ff', 1), (1, '#74c6f2', 1)], x2=0.6, y2=1),
        grad(f'{p}-band', [(0, '#74c6f2', 1), (1, '#1e88d8', 1)]),
        gloss_grad(f'{p}-gloss'),
    ])
    panes = [
        (116, 34, 104, 84),   # back
        (72, 74, 112, 92),    # middle
        (26, 118, 120, 100),  # front
    ]
    body = f'<defs>{defs}</defs>'
    for x, y, w, h in panes:
        body += (
            f'<path d="{rrect(x, y, w, h, 10)}" fill="url(#{p}-glass)" '
            'stroke="#0b5ca8" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<path d="{top_rrect(x + 1.5, y + 1.5, w - 3, 22, 8)}" '
            f'fill="url(#{p}-band)"/>'
            f'<path d="M{x + 4} {y + 4}H{x + w - 4}V{y + h * 0.5:.1f}'
            f'Q{x + w * 0.5:.1f} {y + h * 0.5 + 8:.1f} {x + 4} {y + h * 0.5:.1f}Z" '
            f'fill="url(#{p}-gloss)"/>'
            f'<path d="{rrect(x + 2, y + 2, w - 4, h - 4, 8)}" fill="none" '
            'stroke="#ffffff" stroke-opacity=".35" stroke-width="1.2"/>'
        )
    # Content hints in the front pane: two pale lines.
    body += (
        '<path d="M42 152H120" stroke="#ffffff" stroke-opacity=".85" '
        'stroke-width="6" stroke-linecap="round"/>'
        '<path d="M42 170H102" stroke="#ffffff" stroke-opacity=".6" '
        'stroke-width="6" stroke-linecap="round"/>'
    )
    # Bottom-edge rim on the front pane, as on the other icons.
    body += rim('M40 213Q81 216 132 213')
    # Four-point sparkle at the top right.
    body += ('<path d="M226 10Q228 22 240 24Q228 26 226 38Q224 26 212 24'
             'Q224 22 226 10Z" fill="#ffffff"/>')
    body += ('<circle cx="226" cy="24" r="2.5" fill="#ffffff" '
             'fill-opacity=".9"/>')
    return svg(body)


def main():
    os.makedirs(OUT, exist_ok=True)
    files = {
        'research.svg': research(),
        'contact.svg': contact(),
        'games.svg': games(),
        'tidy.svg': tidy(),
    }
    for name, text in files.items():
        with open(os.path.join(OUT, name), 'w', encoding='utf-8') as fh:
            fh.write(text)
        print(name, len(text.encode('utf-8')), 'bytes')


if __name__ == '__main__':
    main()
