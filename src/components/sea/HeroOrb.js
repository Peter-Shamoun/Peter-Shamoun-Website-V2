import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { withPrefix } from 'gatsby';

// The hero's picture. A still of the scene (rendered from the same shader, see
// design/sea/render-hero.js) paints first. When the browser can run it comfortably, the live
// WebGL orb loads after the page is idle and fades in over the still, frame for frame.

const T0 = 2; // the moment the stills were rendered at, in seconds of scene time

const Art = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  /* the bottom of the scene dissolves into the water of the first stop below */
  -webkit-mask-image: linear-gradient(180deg, #000 72%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 72%, transparent 100%);

  picture,
  img,
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  img {
    object-fit: cover;
    object-position: 50% 0;
  }

  canvas {
    opacity: 0;
    transition: opacity 0.9s ease;

    &[data-live='true'] {
      opacity: 1;
    }
  }
`;

const still = (name, widths) =>
  widths.map(w => `${withPrefix(`/sea/hero/${name}-${w}.webp`)} ${w}w`).join(', ');

const canRunLive = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conn = navigator.connection;
  const saveData = !!(conn && (conn.saveData || /2g/.test(conn.effectiveType || '')));
  const weak = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  return !reduce && !saveData && !weak;
};

const whenIdle = fn => {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(fn, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 1200);
  return () => window.clearTimeout(id);
};

const HeroOrb = () => {
  const box = useRef(null);
  const canvas = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!canRunLive()) {
      return undefined;
    }
    let renderer = null;
    let frame = 0;
    let stopped = false;
    let visible = true;
    let onScreen = true;
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    let start = 0;
    let io;
    let layout = null;

    const loop = now => {
      if (stopped) {
        return;
      }
      frame = 0;
      if (!visible || !onScreen || document.documentElement.hasAttribute('data-still')) {
        return;
      }
      if (!start) {
        start = now;
      }
      const el = box.current;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const t = T0 + (now - start) / 1000;
      pointer.sx += (pointer.x - pointer.sx) * 0.05;
      pointer.sy += (pointer.y - pointer.sy) * 0.05;
      const scene = layout(w, h, t);
      renderer.draw({
        w,
        h,
        dpr: Math.min(window.devicePixelRatio || 1, w < 720 ? 2 : 1.5),
        time: t,
        shift: [pointer.sx * -14, pointer.sy * -8],
        ...scene,
        orb: { ...scene.orb, x: scene.orb.x + pointer.sx * 10, y: scene.orb.y + pointer.sy * 6 },
      });
      frame = window.requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!frame && renderer && visible && onScreen && !stopped) {
        frame = window.requestAnimationFrame(loop);
      }
    };

    const onVisibility = () => {
      visible = document.visibilityState !== 'hidden';
      wake();
    };

    const onPointer = e => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };

    const cancelIdle = whenIdle(() => {
      import('./bubbleGL')
        .then(mod => {
          if (stopped) {
            return;
          }
          layout = mod.layoutScene;
          const img = new Image();
          img.decoding = 'async';
          img.onload = () => {
            if (stopped || !canvas.current) {
              return;
            }
            try {
              renderer = mod.createBubbleRenderer(canvas.current, img);
            } catch (err) {
              renderer = null;
            }
            if (!renderer) {
              return;
            }
            frame = window.requestAnimationFrame(now => {
              loop(now);
              setLive(true);
            });
          };
          img.src = withPrefix(
            window.innerWidth < 720 ? '/sea/plates/above-1600.jpg' : '/sea/plates/above-2400.jpg',
          );
        })
        .catch(() => {});
    });

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('ps-still', wake);
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', onPointer, { passive: true });
    }
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        wake();
      });
      io.observe(box.current);
    }

    return () => {
      stopped = true;
      cancelIdle();
      window.cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('ps-still', wake);
      window.removeEventListener('pointermove', onPointer);
      if (io) {
        io.disconnect();
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <Art ref={box} aria-hidden="true">
      <picture>
        <source
          media="(max-width: 719px)"
          type="image/webp"
          srcSet={still('phone', [780, 1170])}
          sizes="100vw"
        />
        <source type="image/webp" srcSet={still('wide', [1440, 1920, 2880])} sizes="100vw" />
        <img
          src={withPrefix('/sea/hero/wide-1920.jpg')}
          alt=""
          width="1920"
          height="1200"
          // React 17 passes lowercase attributes through; fetchPriority it would drop.
          // eslint-disable-next-line react/no-unknown-property
          fetchpriority="high"
          decoding="async"
        />
      </picture>
      <canvas ref={canvas} data-live={live} />
    </Art>
  );
};

export default HeroOrb;
