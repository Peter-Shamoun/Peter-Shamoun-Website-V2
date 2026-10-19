import React, { useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { withPrefix } from 'gatsby';
import { glass, focusRing, hotTrack, visuallyHidden, media } from '@styles';
import { useDesktop } from './DesktopProvider';
import { DESKTOP_ICONS } from './registry';
import { ICONS, IconTidy } from './icons';

const Root = styled.div`
  flex: none;
  position: relative;
  width: calc(var(--orb) + 12px);
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
`;

const Hidden = styled.span`
  ${visuallyHidden};
`;

// The orb is an image, so the button has no text and no box of its own. It overhangs the top
// of the bar the way the Windows 7 orb does.
const StartButton = styled.button.attrs({ type: 'button' })`
  flex: none;
  width: var(--orb);
  height: var(--orb);
  padding: 0;
  border: 0;
  background: none;
  border-radius: 50%;
  margin-top: -8px;
  cursor: default;
  transition: filter var(--dur-hover) var(--ease-out), box-shadow var(--dur-hover) var(--ease-out);
  ${focusRing};

  &:focus-visible {
    outline-offset: 3px;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  &:hover {
    filter: brightness(1.12) saturate(1.15);
    box-shadow: 0 0 14px 4px rgba(120, 220, 255, 0.75);
  }

  &:active,
  &[aria-expanded='true'] {
    filter: brightness(0.92);
    box-shadow: 0 0 10px 2px rgba(90, 200, 255, 0.9);
  }

  ${media.phone} {
    margin-top: 0;
  }
`;

const rise = keyframes`
  from {
    opacity: 0;
    translate: 0 8px;
  }
`;

// Opens upward from the Start button. The white list sits on the glass as a pseudo-element.
const Menu = styled.div`
  position: absolute;
  left: 2px;
  bottom: calc(100% + 6px);
  display: flex;
  flex-direction: column;
  width: min(260px, 100vw - 8px);
  max-height: calc(100vh - var(--taskbar-total) - 16px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 10px;
  color: var(--text);
  border-radius: var(--radius-menu);
  ${glass};
  box-shadow: inset 0 0 0 1px var(--glass-hi), var(--shadow-menu);
  animation: ${rise} var(--dur-fast) var(--ease-out);

  &::before {
    content: '';
    position: absolute;
    inset: 6px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--field-edge);
    border-radius: 4px;
  }

  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

const item = css`
  position: relative;
  z-index: 1;
  flex: none;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 40px;
  padding: 4px 12px 4px 6px;
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius-ctl);
  color: var(--text);
  font: 400 14px/1.2 var(--main-font);
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
  cursor: default;

  /* The pointer moves focus, so there is only ever one highlighted row. The hot-track box is
     the keyboard focus indicator. */
  &:hover,
  &:focus {
    ${hotTrack};
    outline: none;
  }

  svg {
    flex: none;
  }

  ${media.phone} {
    min-height: 44px;
  }
`;

const ItemButton = styled.button.attrs({ type: 'button' })`
  ${item};
`;

const ItemLink = styled.a`
  ${item};
`;

const Separator = styled.div`
  position: relative;
  z-index: 1;
  flex: none;
  height: 1px;
  margin: 4px 8px;
  border: 0;
  background: linear-gradient(90deg, transparent, rgba(30, 64, 100, 0.25), transparent);
`;

const ICON = 32;
const itemsOf = menu => Array.from(menu.querySelectorAll('[role="menuitem"]'));

// The Start button and its menu: every window and the Tidy desktop command.
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
          width={44}
          height={44}
          alt=""
          draggable={false}
        />
        <Hidden>Peter Shamoun</Hidden>
      </StartButton>
      <Menu
        ref={menuRef}
        id="start-menu"
        role="menu"
        aria-label="Peter Shamoun"
        tabIndex={-1}
        hidden={!open}
        onKeyDown={onMenuKeyDown}>
        {DESKTOP_ICONS.map(entry => {
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
          <IconTidy size={ICON} />
          Tidy desktop
        </ItemButton>
      </Menu>
    </Root>
  );
};

export default StartMenu;
