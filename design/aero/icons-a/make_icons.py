#!/usr/bin/env python3
"""Generates the Frutiger Aero desktop icons about, experience and projects.

Run from the repo root:  python3 -I design/aero/icons-a/make_icons.py
Writes static/aero/icons/{about,experience,projects}.svg. Sources live here, not in static/.
Art rules: viewBox 0 0 256 256, light from the top left, base gradient, own-hue edge stroke,
white gloss over the top half, faint white rim on the bottom edge. Ids are prefixed per file.
"""

import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', '..', 'static', 'aero', 'icons')

HEAD = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">'


def gloss_grad(p, y1=0, y2=1):
    # White sheen: .75 at the top fading to nothing.
    return (
        f'<linearGradient id="{p}-gloss" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0" stop-color="#fff" stop-opacity=".75"/>'
        f'<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    )


def strip(svg):
    """Drop indentation and newlines, keep single spaces inside tags."""
    svg = re.sub(r'\s+', ' ', svg).strip()
    svg = re.sub(r'>\s+<', '><', svg)
    return svg


def about():
    p = 'about'
    card = 'x="36" y="54" width="184" height="148" rx="14"'
    svg = f'''{HEAD}
<defs>
<linearGradient id="{p}-base" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9dcec"/></linearGradient>
<linearGradient id="{p}-head" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#74c6f2"/><stop offset="1" stop-color="#1e88d8"/></linearGradient>
<linearGradient id="{p}-aqua" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#7fe3f0"/><stop offset="1" stop-color="#16b8d4"/></linearGradient>
<linearGradient id="{p}-person" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e4f6fa"/></linearGradient>
{gloss_grad(p)}
<clipPath id="{p}-card"><rect {card}/></clipPath>
<clipPath id="{p}-disc"><circle cx="84" cy="146" r="32"/></clipPath>
</defs>
<g transform="rotate(-6 128 128)">
<rect {card} fill="url(#{p}-base)" stroke="#4f78a0" stroke-width="4"/>
<g clip-path="url(#{p}-card)">
<rect x="36" y="54" width="184" height="44" fill="url(#{p}-head)"/>
<rect x="50" y="71" width="72" height="9" rx="4.5" fill="#ffffff" opacity=".9"/>
<rect x="36" y="54" width="184" height="74" fill="url(#{p}-gloss)"/>
<rect x="36" y="54" width="184" height="4" fill="#ffffff" opacity=".5"/>
</g>
<circle cx="84" cy="146" r="32" fill="url(#{p}-aqua)" stroke="#0a7f98" stroke-width="3"/>
<g clip-path="url(#{p}-disc)">
<circle cx="84" cy="134" r="12" fill="url(#{p}-person)"/>
<path d="M50 180 C50 158 64 150 84 150 C104 150 118 158 118 180 Z" fill="url(#{p}-person)"/>
</g>
<rect x="132" y="130" width="66" height="10" rx="5" fill="#8795a6"/>
<rect x="132" y="150" width="52" height="10" rx="5" fill="#8795a6"/>
<rect x="132" y="170" width="60" height="10" rx="5" fill="#b7c2cf"/>
<path d="M52 198 H204" stroke="#ffffff" stroke-opacity=".3" stroke-width="2.5" stroke-linecap="round"/>
</g>
</svg>'''
    return strip(svg)


def experience():
    p = 'experience'
    body = 'x="34" y="94" width="188" height="118" rx="18"'
    svg = f'''{HEAD}
<defs>
<linearGradient id="{p}-leather" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#f3a43b"/><stop offset="1" stop-color="#a4561a"/></linearGradient>
<linearGradient id="{p}-silver" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#f4f7fa"/><stop offset="1" stop-color="#9aa9b8"/></linearGradient>
{gloss_grad(p)}
<clipPath id="{p}-body"><rect {body}/></clipPath>
</defs>
<path d="M92 96 V70 Q92 46 118 46 H138 Q164 46 164 70 V96" fill="none" stroke="#4c5868" stroke-width="18" stroke-linecap="round"/>
<path d="M92 96 V70 Q92 46 118 46 H138 Q164 46 164 70 V96" fill="none" stroke="url(#{p}-silver)" stroke-width="11" stroke-linecap="round"/>
<rect {body} fill="url(#{p}-leather)" stroke="#6e3209" stroke-width="4.5"/>
<g clip-path="url(#{p}-body)">
<rect x="34" y="94" width="188" height="70" fill="url(#{p}-gloss)"/>
<rect x="34" y="94" width="188" height="5" fill="#ffffff" opacity=".55"/>
<rect x="34" y="186" width="188" height="26" fill="#6e2e08" opacity=".22"/>
<rect x="46" y="108" width="164" height="7" rx="3.5" fill="#ffffff" opacity=".3"/>
<rect x="34" y="150" width="188" height="3" fill="#7a3a0e" opacity=".35"/>
</g>
<rect x="104" y="128" width="48" height="30" rx="6" fill="url(#{p}-silver)" stroke="#6f7f90" stroke-width="2.5"/>
<rect x="120" y="137" width="16" height="12" rx="3" fill="#6f7f90" opacity=".55"/>
<path d="M56 206 H200" stroke="#ffffff" stroke-opacity=".3" stroke-width="2.5" stroke-linecap="round"/>
</svg>'''
    return strip(svg)


def projects():
    p = 'projects'
    svg = f'''{HEAD}
<defs>
<linearGradient id="{p}-back" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#f6d26c"/><stop offset="1" stop-color="#c98a1e"/></linearGradient>
<linearGradient id="{p}-page" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d6e4ef"/></linearGradient>
<linearGradient id="{p}-blue" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#74c6f2"/><stop offset="1" stop-color="#1e88d8"/></linearGradient>
<linearGradient id="{p}-flap" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#fff3c4" stop-opacity=".92"/>
<stop offset="1" stop-color="#eaa83a" stop-opacity=".78"/></linearGradient>
{gloss_grad(p)}
<clipPath id="{p}-flapclip"><path d="M30 130 Q30 120 40 120 H218 Q226 120 226 130 V206 Q226 214 218 214 H38 Q30 214 30 206 Z"/></clipPath>
</defs>
<path d="M30 92 Q30 84 38 84 H94 Q100 84 106 90 L116 100 H218 Q226 100 226 108 V206 Q226 214 218 214 H38 Q30 214 30 206 Z" fill="url(#{p}-back)" stroke="#9a6510" stroke-width="3.5"/>
<rect x="96" y="40" width="112" height="84" rx="5" fill="url(#{p}-page)" stroke="#8fa6bb" stroke-width="2.5"/>
<rect x="62" y="62" width="132" height="96" rx="6" fill="url(#{p}-blue)" stroke="#16649f" stroke-width="3"/>
<path d="M80 62 V158 M100 62 V158 M120 62 V158 M140 62 V158 M160 62 V158 M180 62 V158 M62 80 H194 M62 98 H194 M62 116 H194 M62 134 H194 M62 152 H194" stroke="#ffffff" stroke-opacity=".3" stroke-width="1.5"/>
<path d="M76 136 L102 106 L124 120 L150 92 L178 114" fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>
<path d="M30 130 Q30 120 40 120 H218 Q226 120 226 130 V206 Q226 214 218 214 H38 Q30 214 30 206 Z" fill="url(#{p}-flap)" stroke="#8f5c0a" stroke-width="4"/>
<g clip-path="url(#{p}-flapclip)">
<rect x="30" y="120" width="196" height="40" fill="url(#{p}-gloss)"/>
</g>
<path d="M44 210 H212" stroke="#ffffff" stroke-opacity=".3" stroke-width="2.5" stroke-linecap="round"/>
</svg>'''
    return strip(svg)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, fn in (('about', about), ('experience', experience), ('projects', projects)):
        data = fn()
        path = os.path.join(OUT, name + '.svg')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(data)
        print(f'{name}.svg {len(data.encode("utf-8"))} bytes')


if __name__ == '__main__':
    main()
