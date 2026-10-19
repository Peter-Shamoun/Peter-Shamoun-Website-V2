"""Background plate: sky, lagoon and meadow behind the globe.

Usage: python3 -I plate.py <sky.jpg> <grass.jpg> <out_dir> [preview]

Inputs are the two CC0 photos listed in static/aero/CREDITS.md. The sky is mirrored, cropped
and graded deep blue at the zenith; the grass is laid on a ground plane in perspective over two
rolling hills; a lagoon between them reflects the sky. The sun and its flare are drawn here too.
Writes plate-desktop (2560x1440) and plate-phone (1170x2532) as .jpg and .webp.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

SKY, GRASS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
PREVIEW = len(sys.argv) > 4

rng = np.random.default_rng(7)


def load(path):
    return np.asarray(Image.open(path).convert('RGB'), dtype=np.float32) / 255.0


def smooth(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], dtype=np.float32) / 255.0


def resize(arr, w, h):
    im = Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8))
    return np.asarray(im.resize((w, h), Image.LANCZOS), dtype=np.float32) / 255.0


def blur(arr, r):
    im = Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), dtype=np.float32) / 255.0


def sample(tex, u, v):
    """Bilinear sample of a mirrored-repeat texture at float pixel coords."""
    th, tw = tex.shape[:2]

    def mirror(c, n):
        c = np.mod(c, 2 * n)
        return np.where(c >= n, 2 * n - 1 - c, c)

    u0 = np.floor(u).astype(np.int64)
    v0 = np.floor(v).astype(np.int64)
    fu = (u - u0)[..., None]
    fv = (v - v0)[..., None]
    a = tex[mirror(v0, th), mirror(u0, tw)]
    b = tex[mirror(v0, th), mirror(u0 + 1, tw)]
    c = tex[mirror(v0 + 1, th), mirror(u0, tw)]
    d = tex[mirror(v0 + 1, th), mirror(u0 + 1, tw)]
    return (a * (1 - fu) + b * fu) * (1 - fv) + (c * (1 - fu) + d * fu) * fv


def grade_sky(sky, H, horizon):
    """Push the photo toward the saturated Aero sky: deep at the zenith, pale at the horizon."""
    h, w = sky.shape[:2]
    y = np.linspace(0, 1, h)[:, None, None]
    lum = sky.mean(axis=2, keepdims=True)
    # How "cloud" a pixel is: bright and low in saturation.
    sat = sky.max(axis=2, keepdims=True) - sky.min(axis=2, keepdims=True)
    cloud = smooth((lum - 0.55) / 0.3) * smooth((0.32 - sat) / 0.2)
    zenith, mid, low = hexc('#03205f'), hexc('#1668d6'), hexc('#8fd4ff')
    t = y * (h / horizon)
    blue = np.where(t < 0.55, lerp(zenith, mid, smooth(t / 0.55)), lerp(mid, low, smooth((t - 0.55) / 0.45)))
    # Keep the photo's sky texture as a light modulation of the graded blue.
    sky_part = blue * (0.78 + 0.5 * (lum - lum.mean()))
    # Clouds: lift the grey shadows, tint them cyan-blue, keep the tops white.
    c_shadow, c_top = hexc('#7fa9e0'), hexc('#ffffff')
    cl = lerp(c_shadow, c_top, smooth((lum - 0.45) / 0.5))
    cl = lerp(cl, cl * (0.9 + 0.2 * blue / blue.max()), 0.25)
    out = lerp(sky_part, cl, cloud)
    # Clouds near the zenith thin out so the top stays deep.
    out = lerp(out, blue * 0.95 + out * 0.05, smooth(0.25 - y * (h / horizon)) * 0.6)
    return np.clip(out, 0, 1)


def hills_profile(xs, W, base, amps):
    y = np.full_like(xs, base, dtype=np.float32)
    for amp, period, phase in amps:
        y += amp * np.sin(xs / W * 2 * np.pi * period + phase)
    return y


def mips(tex, levels=8):
    out = [tex]
    for _ in range(levels):
        h, w = out[-1].shape[:2]
        if min(h, w) < 16:
            break
        out.append(resize(out[-1], max(1, w // 2), max(1, h // 2)))
    return out


def ground(tex_mips, W, H, horizon, cx, scale, shift=0.0):
    """Perspective ground plane. Depth Z = A / dy; u = (x - cx) * Z / B, v = Z. A is chosen so a
    texel is about 1.4 screen pixels at the bottom edge; levels of a mip chain stop the far
    rows from aliasing."""
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    dy = np.maximum(ys - horizon, 0.75)
    bottom = H - horizon
    A = 0.7 * bottom * bottom * scale
    B = A / bottom * 1.1
    Z = A / dy
    v = Z + shift
    u = (xs - cx) * Z / B + tex_mips[0].shape[1] * 0.5
    # texels per pixel, per row
    rate = np.maximum(A / (dy * dy), Z / B)
    lvl = np.clip(np.log2(np.maximum(rate, 1e-6)), 0, len(tex_mips) - 1.001)
    out = np.zeros((H, W, 3), np.float32)
    lo = np.floor(lvl).astype(np.int64)
    for L in range(len(tex_mips) - 1):
        m = (lo == L)
        if not m.any():
            continue
        f = (lvl - L)[m][:, None]
        s0 = sample(tex_mips[L], u[m] / (2 ** L), v[m] / (2 ** L))
        s1 = sample(tex_mips[L + 1], u[m] / (2 ** (L + 1)), v[m] / (2 ** (L + 1)))
        out[m] = s0 * (1 - f) + s1 * f
    return out, Z / A * bottom


def sun_layer(W, H, sx, sy, size):
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.hypot(xs - sx, ys - sy) / size
    core = np.exp(-(r / 0.08) ** 2)
    glow = np.exp(-(r / 0.3) ** 1.2) * 0.85
    wide = np.exp(-(r / 1.6)) * 0.35
    ang = np.arctan2(ys - sy, xs - sx)
    rays = ((0.5 + 0.5 * np.cos(ang * 7 + 0.4)) ** 10 * 0.6 + (0.5 + 0.5 * np.cos(ang * 13 + 1.1)) ** 16 * 0.4) * np.exp(-r / 0.35) * 0.22
    a = np.clip(core + glow + wide + rays, 0, 1)[..., None]
    col = lerp(hexc('#fff7d6'), hexc('#ffffff'), np.clip(core, 0, 1)[..., None])
    return col, a


def flare(W, H, sx, sy, tx, ty, size):
    """Lens flare ghosts along the line from the sun through the frame centre."""
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    acc = np.zeros((H, W, 3), np.float32)
    ghosts = [
        (0.35, 0.05, '#aef3ff', 0.18, 'disc'),
        (0.55, 0.025, '#d8ffb0', 0.22, 'ring'),
        (0.7, 0.08, '#7fdcff', 0.10, 'disc'),
        (0.9, 0.04, '#ffffff', 0.16, 'ring'),
        (1.15, 0.12, '#b4e6ff', 0.07, 'disc'),
    ]
    for t, rad, col, alpha, kind in ghosts:
        gx = lerp(sx, tx, t)
        gy = lerp(sy, ty, t)
        r = np.hypot(xs - gx, ys - gy) / (rad * size)
        if kind == 'disc':
            m = smooth((1.0 - r) / 0.25)
        else:
            m = np.exp(-((r - 1.0) / 0.08) ** 2)
        acc += hexc(col) * m[..., None] * alpha
    return acc


def make(W, H, horizon_f, sun, sky_crop, hill_sets, lagoon, cx_f, out_name):
    sky_src = load(SKY)[:, ::-1]  # mirrored: the heavy cloud bank goes to the right
    x0, y0, x1, y1 = sky_crop
    sh, sw = sky_src.shape[:2]
    crop = sky_src[int(y0 * sh):int(y1 * sh), int(x0 * sw):int(x1 * sw)]
    sky = resize(crop, W, H)
    horizon = horizon_f * H
    sky = grade_sky(sky, H, horizon)

    # Haze band at the horizon.
    yy = np.arange(H, dtype=np.float32)[:, None, None]
    haze = np.exp(-((yy - horizon) / (0.07 * H)) ** 2)
    img = lerp(sky, hexc('#d9f4ff'), haze * 0.55)

    # Sun.
    sx, sy, ss = sun[0] * W, sun[1] * H, sun[2] * max(W, H)
    scol, sa = sun_layer(W, H, sx, sy, ss)
    img = img + (1 - img) * scol * sa  # screen

    grass = load(GRASS)
    # Saturate and lime the grass texture once.
    g_l = grass.mean(axis=2, keepdims=True)
    grass = np.clip(lerp(g_l, grass, 1.55), 0, 1)
    grass = grass * hexc('#c9ff7a') * 1.25
    grass = np.clip(grass, 0, 1)
    grass_m = mips(grass)

    # Sunlit patches drifting across the meadow (cloud shadows), low frequency.
    def patches(seed):
        r = np.random.default_rng(seed).random((H // 64 + 2, W // 64 + 2)).astype(np.float32)
        return blur(np.repeat(resize(np.repeat(r[..., None], 3, 2), W, H), 1, 2)[..., :3], 30)[..., :1]

    xs = np.arange(W, dtype=np.float32)

    def draw_lagoon():
        """A strip of still water at the horizon, reflecting what is above it."""
        nonlocal img
        if not lagoon:
            return
        ly0, ly1 = lagoon
        top, bot = int(ly0 * H), int(ly1 * H)
        n = bot - top
        refl_src = img[max(0, top - n):top][::-1]
        refl = resize(refl_src, W, n)
        rows = np.arange(n, dtype=np.float32)[:, None]
        # Ripples: rows shift sideways a little more the nearer they are.
        wob = (np.sin(rows * 0.7 + np.sin(xs[None, :] * 0.013) * 3) * (1 + rows * 0.04)).astype(np.int64)
        idx = np.clip(np.arange(W)[None, :] + wob, 0, W - 1)
        refl = refl[np.arange(n)[:, None], idx]
        depth_t = (rows / n)[..., None]
        water = lerp(refl * hexc('#9be3ff'), hexc('#0f86d0'), 0.3 + 0.35 * smooth(depth_t))
        # Sun glitter: short horizontal dashes, densest under the sun.
        dots = (rng.random((n, W)) > 0.9993).astype(np.float32)
        k = np.ones(13, np.float32)
        dash = np.apply_along_axis(lambda r: np.convolve(r, k, 'same'), 1, dots)
        near_sun = np.exp(-((xs - sx) / (0.12 * W)) ** 2)[None, :]
        dash = dash * (0.15 + 0.85 * near_sun) * (1 - 0.6 * depth_t[..., 0])
        water = water + dash[..., None] * 0.8
        # A path of light under the sun.
        water = water + hexc('#ffffff') * (near_sun * 0.25 * (1 - depth_t[..., 0]))[..., None]
        img[top:bot] = np.clip(water, 0, 1)

    for i, hs in enumerate(hill_sets):
        if i == 1:
            draw_lagoon()
        base, amps, scale, tint, rim, shade = hs
        crest = hills_profile(xs, W, base * H, [(a * H, p, ph) for a, p, ph in amps])
        g, depth = ground(grass_m, W, H, horizon, cx_f * W, scale)
        ys = np.arange(H, dtype=np.float32)[:, None]
        inside = smooth((ys - crest[None, :]) / 2.5)[..., None]
        # Light falls off away from the crest; the crest gets a hot rim from the sun behind.
        below = (ys - crest[None, :]) / H
        light = 1.0 + rim * np.exp(-np.clip(below, 0, None) / 0.012)[..., None]
        shade_t = smooth(below / shade)[..., None]
        col = g * tint * light * (0.82 + 0.4 * patches(i + 3))
        col = lerp(col, col * hexc('#2e8f3c'), shade_t * 0.55)
        # Far hills are hazier.
        far = smooth((depth - 3.0) / 14.0)[..., None]
        col = lerp(col, hexc('#a8e4ff'), far * 0.6)
        img = lerp(img, np.clip(col, 0, 1), inside)

    # Mowed stripes on the nearest hill catch the light in a shallow arc.
    ys = np.arange(H, dtype=np.float32)[:, None]
    stripes = 0.5 + 0.5 * np.sin((xs[None, :] - W * 0.5) / W * 7 + (ys - H) / H * 3)
    near = smooth((ys - 0.82 * H) / (0.18 * H))
    img = img * (1 + 0.06 * (stripes - 0.5) * near)[..., None]

    # Flare over everything.
    img = img + flare(W, H, sx, sy, W * 0.5, H * 0.62, max(W, H))

    # Gentle vignette at the bottom corners.
    xx = (np.arange(W, dtype=np.float32)[None, :] / W - 0.5) * 2
    yy2 = (np.arange(H, dtype=np.float32)[:, None] / H)
    vig = 1 - 0.28 * smooth((np.abs(xx) * 0.7 + yy2 * 0.6 - 0.7) / 0.6)
    img = img * vig[..., None]

    img = np.clip(img, 0, 1)
    pil = Image.fromarray((img * 255 + rng.random(img.shape) * 0.9).astype(np.uint8))
    if PREVIEW:
        pil.resize((W // 2, H // 2), Image.LANCZOS).save(f'{OUT}/{out_name}-preview.jpg', quality=88)
        return
    pil.save(f'{OUT}/{out_name}.jpg', quality=80, optimize=True, progressive=True)
    pil.save(f'{OUT}/{out_name}.webp', quality=78, method=6)


# Desktop: horizon at 63%, sun top right of centre over the globe.
make(
    2560, 1440, 0.6,
    sun=(0.66, 0.09, 0.22),
    sky_crop=(0.0, 0.56, 1.0, 0.935),
    hill_sets=[
        # base, [(amp, periods, phase)], perspective scale, tint, rim, shade depth
        (0.606, [(0.006, 1.3, 0.4), (0.004, 3.1, 1.0)], 0.5, 0.9, 0.6, 0.03),
        (0.715, [(0.03, 0.9, 2.2), (0.01, 2.3, 0.3)], 1.0, 1.05, 0.7, 0.2),
    ],
    lagoon=(0.615, 0.75),
    cx_f=0.55,
    out_name='plate-desktop',
)

# Phone: tall crop, higher horizon so the meadow holds the bubble grid.
make(
    1170, 2532, 0.48,
    sun=(0.72, 0.06, 0.32),
    sky_crop=(0.12, 0.38, 0.88, 0.97),
    hill_sets=[
        (0.484, [(0.004, 1.1, 0.4), (0.003, 2.6, 1.0)], 0.5, 0.9, 0.6, 0.02),
        (0.55, [(0.016, 0.8, 2.2), (0.006, 2.0, 0.3)], 1.0, 1.05, 0.7, 0.2),
    ],
    lagoon=(0.49, 0.58),
    cx_f=0.5,
    out_name='plate-phone',
)
