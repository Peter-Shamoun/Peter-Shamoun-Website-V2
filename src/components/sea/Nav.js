import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { withPrefix } from 'gatsby';
import { media, focusRing } from '@styles';

export const STOPS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'games', label: 'Games' },
  { id: 'contact', label: 'Contact' },
];

// A glass capsule at the top of the screen. On phones the links fold into a sheet.

const pill = css`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.5) 48%,
    rgba(225, 246, 255, 0.42) 52%,
    rgba(225, 246, 255, 0.58) 100%
  );
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgba(10, 95, 168, 0.3);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.85),
    inset 0 -6px 14px -8px rgba(60, 220, 255, 0.8), 0 12px 30px -10px rgba(0, 35, 90, 0.5);

  @media (prefers-reduced-transparency: reduce) {
    background: var(--plate-fill-solid);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
`;

const Bar = styled.nav`
  position: fixed;
  z-index: var(--z-nav);
  top: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  padding: 0 var(--gutter);
`;

const Capsule = styled.div`
  ${pill};
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  width: min(100%, var(--measure));
  height: var(--nav-h);
  padding: 0 8px 0 10px;
  border-radius: 999px;
`;

const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 14px 0 6px;
  margin-right: auto;
  border-radius: 999px;
  color: var(--abyss);
  font-size: 1.7rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  ${focusRing};

  img {
    width: 34px;
    height: 34px;
  }
`;

const Links = styled.ul`
  display: flex;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;

  ${media.tablet} {
    display: none;
  }
`;

const linkLook = css`
  display: inline-flex;
  align-items: center;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  color: var(--deep);
  font-size: 1.6rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color var(--dur-hover) var(--ease-out),
    border-color var(--dur-hover) var(--ease-out);
  ${focusRing};

  &:hover {
    background: rgba(255, 255, 255, 0.7);
    border-color: rgba(10, 127, 216, 0.35);
  }

  &[aria-current='true'] {
    color: #ffffff;
    text-shadow: 0 1px 1px rgba(0, 50, 110, 0.55);
    border-color: #0b5c96;
    background: linear-gradient(180deg, #6dd2ff 0%, #22a6ec 50%, #0b84d4 51%, #2bb8f2 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75),
      inset 0 -4px 8px -2px rgba(150, 250, 255, 0.9);
  }
`;

const Link = styled.a`
  ${linkLook};
`;

const MenuButton = styled.button.attrs({ type: 'button' })`
  ${linkLook};
  display: none;
  gap: 10px;
  cursor: pointer;
  background: none;

  ${media.tablet} {
    display: inline-flex;
  }

  span[aria-hidden] {
    display: grid;
    gap: 4px;
  }

  i {
    display: block;
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: currentColor;
  }
`;

// Stops every loop on the page: bubbles, light, the orb. Remembered in this browser.
const Still = styled.button.attrs({ type: 'button' })`
  ${linkLook};
  justify-content: center;
  width: 46px;
  padding: 0;
  margin-left: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.45);
  border-color: rgba(10, 95, 168, 0.25);

  &[aria-pressed='true'] {
    background: linear-gradient(180deg, #e6ffb8 0%, #c4f26c 50%, #ace24a 51%, #c9f47a 100%);
    border-color: #6fb51f;
    color: #1f4a00;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const STILL_KEY = 'ps-still';

const Sheet = styled.ul`
  ${pill};
  position: absolute;
  top: calc(var(--nav-h) + 20px);
  left: var(--gutter);
  right: var(--gutter);
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 10px;
  list-style: none;
  border-radius: 26px;
  pointer-events: auto;

  a {
    width: 100%;
    min-height: 52px;
    font-size: 1.8rem;
  }
`;

const Nav = () => {
  const [current, setCurrent] = useState(null);
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    try {
      setStill(window.localStorage.getItem(STILL_KEY) === '1');
    } catch (err) {
      // storage blocked: motion stays on
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (still) {
      root.setAttribute('data-still', '');
    } else {
      root.removeAttribute('data-still');
    }
    window.dispatchEvent(new Event('ps-still'));
  }, [still]);

  const toggleStill = () => {
    setStill(v => {
      try {
        window.localStorage.setItem(STILL_KEY, v ? '0' : '1');
      } catch (err) {
        // storage blocked: the choice lasts until the page closes
      }
      return !v;
    });
  };

  // The stop in the middle of the screen is the current one.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setCurrent(e.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['top', ...STOPS.map(s => s.id)].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKey = e => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current.focus();
      }
    };
    const onClick = e => {
      if (!e.target.closest('[data-nav]')) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  const linkProps = id => ({
    href: `#${id}`,
    'aria-current': current === id ? 'true' : undefined,
  });

  return (
    <Bar aria-label="Sections" data-nav>
      <Capsule>
        <Brand href="#top">
          <img src={withPrefix('/sea/fx/bubble.webp')} alt="" width="34" height="34" />
          <span translate="no">Peter Shamoun</span>
        </Brand>
        <Links>
          {STOPS.map(s => (
            <li key={s.id}>
              <Link {...linkProps(s.id)}>{s.label}</Link>
            </li>
          ))}
        </Links>
        <Still
          aria-pressed={still}
          aria-label="Pause motion"
          title={still ? 'Motion paused' : 'Pause motion'}
          onClick={toggleStill}>
          {still ? (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <rect x="3" y="2.5" width="3.4" height="11" rx="1" fill="currentColor" />
              <rect x="9.6" y="2.5" width="3.4" height="11" rx="1" fill="currentColor" />
            </svg>
          )}
        </Still>
        <MenuButton
          data-menu
          ref={button}
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen(o => !o)}>
          Menu
          <span aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </MenuButton>
      </Capsule>
      <Sheet id="nav-sheet" hidden={!open}>
        {STOPS.map(s => (
          <li key={s.id}>
            <Link {...linkProps(s.id)} onClick={() => setOpen(false)}>
              {s.label}
            </Link>
          </li>
        ))}
      </Sheet>
    </Bar>
  );
};

export default Nav;
