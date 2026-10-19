import React, { useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { withPrefix } from 'gatsby';
import { glass, hotTrack, visuallyHidden, media } from '@styles';
import { useDesktop } from './DesktopProvider';
import { DESKTOP_ICONS } from './registry';
import { ICONS, IconTidy } from './icons';

const Root = styled.div`
  flex: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  width: calc(var(--orb) - 4px);
`;

const Hidden = styled.span`
  ${visuallyHidden};
`;

// The orb: the water-drop button in a chrome ring, bigger than the deck so it bulges out of
// the top and bottom of the body.
const StartButton = styled.button.attrs({ type: 'button' })`
  flex: none;
  position: relative;
  width: var(--orb);
  height: var(--orb);
  padding: 4px;
  border: 0;
  border-radius: 50%;
  background: var(--chrome);
  box-shadow: 0 6px 14px rgba(0, 30, 80, 0.5), inset 0 0 0 1px var(--chrome-edge);
  cursor: pointer;
  transition: transform var(--dur-hover) var(--ease-spring),
    box-shadow var(--dur-hover) var(--ease-out);

  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0, 30, 80, 0.5), 0 0 22px 6px rgba(120, 230, 255, 0.85);
  }

  &:active,
  &[aria-expanded='true'] {
    transform: scale(0.96);
    box-shadow: 0 2px 6px rgba(0, 30, 80, 0.5), 0 0 18px 6px rgba(184, 255, 46, 0.75);
  }

  &:focus-visible {
    outline: 3px solid var(--focus-on-scene);
    outline-offset: 3px;
  }
`;

const rise = keyframes`
  from {
    opacity: 0;
    translate: 0 14px;
    scale: 0.96;
  }
`;

// The playlist: a glass panel rising from the orb. The white list sits on the glass.
const Menu = styled.div`
  position: absolute;
  left: -6px;
  bottom: calc(100% + 22px);
  display: flex;
  flex-direction: column;
  width: min(300px, 100vw - 16px);
  max-height: calc(100vh - var(--taskbar-total) - 24px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 10px;
  color: var(--text);
  border-radius: var(--radius-menu);
  ${glass};
  box-shadow: inset 0 0 0 1px var(--glass-hi), var(--shadow-menu);
  animation: ${rise} 260ms var(--ease-spring);

  &::before {
    content: '';
    position: absolute;
    inset: 44px 8px 8px;
    background: linear-gradient(180deg, #e6f9ff 0, #ffffff 80px);
    border: 1px solid var(--field-edge);
    border-radius: 12px;
  }

  &:focus,
  &:focus-visible {
    outline: none;
  }

  ${media.phone} {
    left: -4px;
  }
`;

const MenuTitle = styled.p`
  position: relative;
  z-index: 1;
  margin: 2px 6px 12px;
  font: 900 18px/24px var(--display-font);
  color: var(--text-on-glass);
  text-shadow: var(--title-glow);
`;

const item = css`
  position: relative;
  z-index: 1;
  flex: none;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 46px;
  padding: 4px 12px 4px 8px;
  background: none;
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--text);
  font: 800 16px/1.2 var(--display-font);
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  /* The pointer moves focus, so there is only ever one highlighted row. The hot-track box is
     the keyboard focus indicator. */
  &:hover,
  &:focus {
    ${hotTrack};
    border-radius: 12px;
    outline: none;
  }

  img {
    flex: none;
  }
`;

const ItemButton = styled.button.attrs({ type: 'button' })`
  ${item};
`;

const ItemLink = styled.a`
  ${item};
`;

// The track number, in the playlist order that the deck's prev and next buttons follow.
const Num = styled.span`
  flex: none;
  width: 22px;
  font: 800 13px/1 var(--display-font);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`;

const Separator = styled.div`
  position: relative;
  z-index: 1;
  flex: none;
  height: 1px;
  margin: 6px 10px;
  border: 0;
  background: linear-gradient(90deg, transparent, rgba(10, 80, 150, 0.3), transparent);
`;

const ICON = 34;
const itemsOf = menu => Array.from(menu.querySelectorAll('[role="menuitem"]'));

// The orb and its playlist: every section, and a command that closes every pane.
const StartMenu = () => {
  const { state, actions } = useDesktop();
  const open = state.startOpen;
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const wasOpen = useRef(open);
  // What to focus once the menu has opened: 'first', 'last' or 'menu' (a pointer opened it).
  const focusOnOpen = useRef('menu');
  // Set when the menu closes from the keyboard or by a command that opens nothing.
  const focusBack = useRef(false);

  useEffect(() => {
    const menu = menuRef.current;
    if (open && !wasOpen.current && menu) {
      const items = itemsOf(menu);
      const target = { first: items[0], last: items[items.length - 1] }[focusOnOpen.current];
      (target || menu).focus({ preventScroll: true });
    } else if (!open && wasOpen.current && focusBack.current && buttonRef.current) {
      buttonRef.current.focus({ preventScroll: true });
    }
    focusBack.current = false;
    wasOpen.current = open;
  }, [open]);

  // A press anywhere outside the button and the menu closes the menu.
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        actions.closeStart();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, actions]);

  const openWith = focus => {
    focusOnOpen.current = focus;
    actions.toggleStart();
  };

  // Enter and Space arrive as a click with no pointer behind it (detail 0).
  const onButtonClick = e => openWith(e.detail === 0 ? 'first' : 'menu');

  const onButtonKeyDown = e => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') {
      return;
    }
    e.preventDefault();
    const edge = e.key === 'ArrowDown' ? 'first' : 'last';
    if (!open) {
      openWith(edge);
      return;
    }
    const items = itemsOf(menuRef.current);
    items[edge === 'first' ? 0 : items.length - 1].focus();
  };

  const onMenuKeyDown = e => {
    const items = itemsOf(menuRef.current);
    const at = items.indexOf(document.activeElement);
    let next = null;
    if (e.key === 'ArrowDown') {
      next = items[(at + 1) % items.length];
    } else if (e.key === 'ArrowUp') {
      next = items[at <= 0 ? items.length - 1 : at - 1];
    } else if (e.key === 'Home') {
      next = items[0];
    } else if (e.key === 'End') {
      next = items[items.length - 1];
    } else if (e.key === 'Tab') {
      actions.closeStart();
    }
    if (next) {
      e.preventDefault();
      next.focus();
    }
  };

  // Escape itself is handled by the provider, which closes the menu; this only asks for focus
  // to go back to the Start button afterwards.
  const onRootKeyDown = e => {
    if (open && (e.key === 'Escape' || e.key === 'Esc')) {
      focusBack.current = true;
    }
  };

  // The window takes focus when it opens, and gives it to the Start button when it closes.
  const openWindow = id => () => actions.openWindow(id, { from: buttonRef.current });

  const reset = () => {
    focusBack.current = true;
    actions.reset();
  };

  const followLink = () => {
    focusBack.current = true;
    actions.closeStart();
  };

  const hover = e => e.currentTarget.focus({ preventScroll: true });

  return (
    <Root ref={rootRef} data-start-menu onKeyDown={onRootKeyDown}>
      <StartButton
        ref={buttonRef}
        data-start-button
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="start-menu"
        onClick={onButtonClick}
        onKeyDown={onButtonKeyDown}>
        <img
          src={withPrefix('/aero/orb/start-orb.svg')}
          width={66}
          height={66}
          alt=""
          draggable={false}
        />
        <Hidden>Playlist</Hidden>
      </StartButton>
      <Menu
        ref={menuRef}
        id="start-menu"
        role="menu"
        aria-label="Playlist"
        tabIndex={-1}
        hidden={!open}
        onKeyDown={onMenuKeyDown}>
        <MenuTitle aria-hidden="true">Playlist</MenuTitle>
        {DESKTOP_ICONS.map((entry, i) => {
          const Art = ICONS[entry.icon];
          return entry.kind === 'link' ? (
            <ItemLink
              key={entry.key}
              role="menuitem"
              tabIndex={-1}
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={followLink}
              onPointerMove={hover}>
              <Art size={ICON} />
              {entry.label}
            </ItemLink>
          ) : (
            <ItemButton
              key={entry.key}
              role="menuitem"
              tabIndex={-1}
              data-start-item={entry.target}
              onClick={openWindow(entry.target)}
              onPointerMove={hover}>
              <Num aria-hidden="true">{String(i + 1).padStart(2, '0')}</Num>
              <Art size={ICON} />
              {entry.label}
            </ItemButton>
          );
        })}
        <Separator role="separator" />
        <ItemButton
          role="menuitem"
          tabIndex={-1}
          data-start-item="tidy"
          onClick={reset}
          onPointerMove={hover}>
          <Num aria-hidden="true" />
          <IconTidy size={ICON} />
          Close all panes
        </ItemButton>
      </Menu>
    </Root>
  );
};

export default StartMenu;
