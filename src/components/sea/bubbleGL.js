// The hero's glass: one large glass orb and a handful of soap bubbles, drawn over the island
// photo in a single WebGL fragment shader. The orb traces each pixel through a solid glass ball
// (refract in, cross the ball, refract out) and samples the photo where the ray lands, per
// colour channel, so the island shows inverted and magnified inside it with a little colour
// fringe at the edge. Reflection, the top highlight and the bottom glow are added on top.
//
// No dependencies and no DOM access at import time, so Gatsby's server render can import it.
// The same module renders the static fallback images (design/sea/render-hero.html).

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform sampler2D uImg;
uniform vec2 uImgSize;   // photo size in px
uniform vec2 uRes;       // canvas size in device px
uniform vec2 uFocus;     // object-position of the photo, 0..1
uniform vec2 uShift;     // pointer parallax of the photo, device px
uniform vec3 uOrb;       // orb centre (x, y, y-down) and radius, device px
uniform float uTime;
uniform vec4 uBub[10];   // soap bubbles: x, y, radius (device px), phase

const int BUBBLES = 10;

// The photo, laid out like background-size: cover at uFocus. px is y-down device px.
vec3 photo(vec2 px, float bias) {
  float s = max(uRes.x / uImgSize.x, uRes.y / uImgSize.y) * 1.04;
  vec2 size = uImgSize * s;
  vec2 off = (uRes - size) * uFocus + uShift;
  // mirrored beyond the edges, so rays the orb bends off the photo still land on a scene
  vec2 uv = (px - off) / size;
  uv = 1.0 - abs(1.0 - mod(uv, 2.0));
  return texture2D(uImg, clamp(uv, vec2(0.001), vec2(0.999)), bias).rgb;
}

vec3 photo(vec2 px) { return photo(px, 0.0); }

// The sky the orb reflects: a soft sample from the top band of the photo.
vec3 sky(vec3 r) {
  vec2 uv = vec2(0.5 + r.x * 0.42, 0.2 + r.y * 0.16);
  vec3 c = texture2D(uImg, uv).rgb;
  c += texture2D(uImg, uv + vec2(0.03, 0.01)).rgb;
  c += texture2D(uImg, uv - vec2(0.03, 0.012)).rgb;
  c += texture2D(uImg, uv + vec2(0.0, 0.03)).rgb;
  return c * 0.25;
}

// Where a ray that enters the ball at local point p comes out, in local units on the photo
// plane D radii behind the centre.
vec2 throughBall(vec3 p, float ior, float D) {
  vec3 v = vec3(0.0, 0.0, -1.0);
  vec3 t1 = refract(v, p, 1.0 / ior);
  float len = -2.0 * dot(p, t1);
  vec3 p2 = p + t1 * len;
  vec3 t2 = refract(t1, -p2, ior);
  if (dot(t2, t2) < 0.001) t2 = reflect(t1, -p2);
  float s = (-D - p2.z) / min(t2.z, -0.05);
  return p2.xy + t2.xy * s;
}

float ellipse(vec2 q, vec2 c, vec2 r, float a) {
  vec2 d = q - c;
  float ca = cos(a), sa = sin(a);
  d = vec2(ca * d.x - sa * d.y, sa * d.x + ca * d.y);
  return length(d / r);
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec3 col = photo(px);

  // ---------- the glass orb ----------
  vec2 q = (px - uOrb.xy) / uOrb.z;
  float d = length(q);
  float aa = 1.5 / uOrb.z;

  // A soft cool shade and halo on the photo around the ball: it sits in the air, catching light.
  if (d > 1.0) {
    float halo = exp(-(d - 1.0) * 9.0);
    col = mix(col, vec3(0.86, 0.97, 1.0), halo * 0.28);
  }

  if (d < 1.0 + aa) {
    float wob = 0.012;
    vec2 qw = q + wob * vec2(sin(q.y * 3.1 + uTime * 0.9), cos(q.x * 2.7 + uTime * 0.7));
    float d2 = min(dot(qw, qw), 0.9995);
    vec3 p = vec3(qw, sqrt(1.0 - d2));

    // the scene through the ball, one channel at a time
    const float D = 4.2;
    vec2 hr = throughBall(p, 1.43, D);
    vec2 hg = throughBall(p, 1.45, D);
    vec2 hb = throughBall(p, 1.475, D);
    // toward the rim the ball squeezes a wide view into few pixels: blur it as glass would
    float bias = 3.5 * smoothstep(0.55, 1.0, d);
    vec3 through = vec3(
      photo(uOrb.xy + hr * uOrb.z, bias).r,
      photo(uOrb.xy + hg * uOrb.z, bias).g,
      photo(uOrb.xy + hb * uOrb.z, bias).b
    );
    // aqua glass: absorbs a little red along the chord, brightened toward the bottom
    through *= vec3(0.9, 0.99, 1.02);
    through = mix(through, through * 1.12 + vec3(0.02, 0.06, 0.07), smoothstep(-0.2, 0.9, q.y));

    vec3 r = reflect(vec3(0.0, 0.0, -1.0), p);
    float fres = 0.04 + 0.96 * pow(1.0 - p.z, 5.0);
    vec3 glass = mix(through, sky(r) * 1.15 + 0.06, clamp(fres, 0.0, 0.85));

    // the bottom glow: light focused by the ball pools inside its lower rim
    float low = smoothstep(0.25, 1.0, q.y);
    float rimIn = smoothstep(0.62, 0.99, d);
    glass += vec3(0.38, 0.86, 1.0) * low * rimIn * 0.75;
    glass += vec3(0.55, 0.95, 1.0) * smoothstep(0.82, 0.995, d) * smoothstep(0.55, 1.0, q.y) * 0.5;

    // the top highlight: the big soft window reflection of an Aero gloss cap
    float e = ellipse(q, vec2(-0.05, -0.55), vec2(0.66, 0.36), 0.0);
    float cap = smoothstep(1.0, 0.97, e) * mix(0.9, 0.06, smoothstep(-0.9, -0.22, q.y));
    glass = mix(glass, vec3(1.0), cap);

    // a hard glint and a thin bright rim
    float glint = smoothstep(0.075, 0.035, length(q - vec2(-0.5, -0.5)));
    glass = mix(glass, vec3(1.0), glint * 0.95);
    float rim = smoothstep(0.955, 0.995, d);
    glass = mix(glass, vec3(0.92, 0.99, 1.0), rim * 0.6);

    // edge definition: a hairline of deeper aqua just inside the silhouette
    float edge = smoothstep(0.975, 0.99, d) * (1.0 - smoothstep(0.995, 1.0, d));
    glass = mix(glass, vec3(0.1, 0.45, 0.7), edge * 0.35);

    float inside = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, d);
    col = mix(col, glass, inside);
  }

  // ---------- soap bubbles ----------
  for (int i = 0; i < BUBBLES; i++) {
    vec4 b = uBub[i];
    if (b.z < 1.0) continue;
    vec2 bq = (px - b.xy) / b.z;
    float bd = length(bq);
    if (bd > 1.0 + 2.0 / b.z) continue;
    float bz = sqrt(max(0.0, 1.0 - bd * bd));
    // a thin film barely bends light: a touch of lensing at the rim
    vec3 under = photo(px - bq * b.z * 0.12 * (1.0 - bz));
    float th = 0.55 + 0.35 * sin(b.w + bq.y * 3.3 + bq.x * 1.7 + uTime * 0.6);
    vec3 irid = 0.5 + 0.5 * cos(6.2831 * (th * vec3(1.0, 0.82, 0.64) * 2.2 + vec3(0.0, 0.33, 0.67)));
    float film = pow(1.0 - bz, 2.2);
    vec3 bc = under * (1.0 - film * 0.25) + irid * film * 0.55 + vec3(0.85, 0.97, 1.0) * film * 0.35;
    float bglint = smoothstep(0.2, 0.08, length(bq - vec2(-0.42, -0.45)));
    float bcap = smoothstep(1.0, 0.9, ellipse(bq, vec2(0.0, -0.55), vec2(0.6, 0.3), 0.0)) * 0.22;
    bc = mix(bc, vec3(1.0), max(bglint * 0.9, bcap));
    float bin = 1.0 - smoothstep(1.0 - 1.5 / b.z, 1.0 + 1.5 / b.z, bd);
    col = mix(col, bc, bin);
  }

  // ---------- the sun's flare, from beyond the top-right corner ----------
  vec2 sun = vec2(uRes.x * 0.96, -uRes.y * 0.08);
  vec2 axis = uRes * 0.5 - sun;
  float unit = uRes.y;
  float sunGlow = exp(-length(px - sun) / (unit * 0.32));
  col += vec3(1.0, 0.98, 0.9) * sunGlow * 0.42;
  for (int k = 0; k < 4; k++) {
    float t = k == 0 ? 0.42 : k == 1 ? 0.63 : k == 2 ? 0.9 : 1.35;
    float rr = k == 0 ? 0.035 : k == 1 ? 0.06 : k == 2 ? 0.022 : 0.09;
    vec3 tint = k == 0 ? vec3(0.6, 1.0, 0.8) : k == 1 ? vec3(0.5, 0.85, 1.0) : k == 2 ? vec3(1.0, 0.95, 0.7) : vec3(0.55, 0.75, 1.0);
    float g = length(px - (sun + axis * t)) / (unit * rr);
    col += tint * (smoothstep(1.0, 0.7, g) * 0.06 + smoothstep(1.0, 0.97, g) * smoothstep(0.92, 0.97, g) * 0.03);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

const compile = (gl, type, src) => {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`bubble shader: ${log}`);
  }
  return sh;
};

/**
 * Sets up the renderer on a canvas with a loaded photo. Returns { draw(state), dispose() } or
 * null when WebGL is not available. state: { w, h, dpr, orb: {x, y, r} (CSS px), bubbles:
 * [{x, y, r, phase}] (CSS px), time (s), focus: [fx, fy], shift: [sx, sy] (CSS px) }.
 */
export const createBubbleRenderer = (canvas, image) => {
  const gl =
    canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: true }) ||
    canvas.getContext('experimental-webgl');
  if (!gl) {
    return null;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(`bubble program: ${gl.getProgramInfoLog(prog)}`);
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  // Stretched onto a power-of-two square so WebGL 1 can mipmap it: the orb's rim squeezes a
  // lot of photo into a few pixels, and without mipmaps that shimmers.
  const pot = document.createElement('canvas');
  pot.width = 2048;
  pot.height = 2048;
  pot.getContext('2d').drawImage(image, 0, 0, 2048, 2048);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, pot);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const loc = name => gl.getUniformLocation(prog, name);
  const u = {
    img: loc('uImg'),
    imgSize: loc('uImgSize'),
    res: loc('uRes'),
    focus: loc('uFocus'),
    shift: loc('uShift'),
    orb: loc('uOrb'),
    time: loc('uTime'),
    bub: loc('uBub'),
  };
  gl.uniform1i(u.img, 0);
  gl.uniform2f(u.imgSize, image.naturalWidth || image.width, image.naturalHeight || image.height);
  const bubData = new Float32Array(40);

  const draw = state => {
    const { w, h, dpr, orb, bubbles = [], time = 0, focus = [0.5, 0.5], shift = [0, 0] } = state;
    const cw = Math.round(w * dpr);
    const ch = Math.round(h * dpr);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    gl.viewport(0, 0, cw, ch);
    gl.uniform2f(u.res, cw, ch);
    gl.uniform2f(u.focus, focus[0], focus[1]);
    gl.uniform2f(u.shift, shift[0] * dpr, shift[1] * dpr);
    gl.uniform3f(u.orb, orb.x * dpr, orb.y * dpr, orb.r * dpr);
    gl.uniform1f(u.time, time);
    bubData.fill(0);
    bubbles.slice(0, 10).forEach((b, i) => {
      bubData[i * 4] = b.x * dpr;
      bubData[i * 4 + 1] = b.y * dpr;
      bubData[i * 4 + 2] = b.r * dpr;
      bubData[i * 4 + 3] = b.phase;
    });
    gl.uniform4fv(u.bub, bubData);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const dispose = () => {
    gl.deleteTexture(tex);
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) {
      lose.loseContext();
    }
  };

  return { draw, dispose };
};

/**
 * Where the orb and the bubbles sit for a viewport of w x h CSS px at time t (seconds). Shared by
 * the live hero and the static render so both frame the scene the same way.
 */
export const layoutScene = (w, h, t = 0) => {
  const phone = w < 720;
  const r = phone ? Math.min(w * 0.44, h * 0.23) : Math.min(h * 0.345, w * 0.24);
  const orb = phone
    ? { x: w * 0.56, y: h * 0.6 + Math.sin(t * 0.5) * 5, r }
    : { x: w * 0.705, y: h * 0.55 + Math.sin(t * 0.5) * 6, r };
  const seeds = [
    [0.47, 0.62, 0.05, 0.3],
    [0.53, 0.84, 0.026, 1.7],
    [0.9, 0.22, 0.04, 2.9],
    [0.95, 0.8, 0.062, 4.1],
    [0.6, 0.2, 0.02, 5.3],
    [0.82, 0.93, 0.024, 0.8],
    [0.4, 0.9, 0.034, 3.6],
    [0.985, 0.5, 0.022, 2.2],
  ];
  const unit = phone ? w : h;
  const bubbles = seeds.map(([fx, fy, fr, ph]) => {
    const rise = ((t * 0.012 * (1.2 - fr * 6) + ph) % 1) * 0.0 + Math.sin(t * 0.4 + ph) * 0.012;
    return {
      x: w * fx + Math.sin(t * 0.3 + ph * 2) * unit * 0.012,
      y: h * fy + rise * h,
      r: unit * fr * (phone ? 1.2 : 1),
      phase: ph,
    };
  });
  return { orb, bubbles, focus: phone ? [0.66, 0.2] : [0.5, 0.06] };
};
