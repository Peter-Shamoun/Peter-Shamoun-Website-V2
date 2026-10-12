import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { bevel, bevelPressed, bevelWindow, focusRect, media } from '@styles';
import { useDesktop } from './DesktopProvider';
import { DESKTOP_ICONS } from './registry';
import { ICONS, GlyphApp, GlyphMenu } from './icons';

const Root = styled.div`
  flex: none;
  display: flex;
`;

const StartButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px 0 6px;
  background: var(--chrome);
  color: var(--text);
  font: 16px/1 var(--main-font);
  white-space: nowrap;
  cursor: default;
  ${bevel};
  ${focusRect};

  &:active,
  &[aria-expanded='true'] {
    ${bevelPressed};
  }

  ${media.phone} {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -3px 0 -1px;
    }
  }
`;

// The two small glyphs are one colour each, so each sits on a tile it shows up on: the white
// window on navy, the black lines on white.
const Tile = styled.span`
  flex: none;
  display: block;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => (props.$light ? 'var(--field)' : 'var(--title-active)')};
  line-height: 0;
`;

// Opens upward from the Start button.
const Menu = styled.div`
  position: absolute;
  left: 2px;
  bottom: 100%;
  display: flex;
  flex-direction: column;
  width: min(232px, 100vw - 4px);
  max-height: calc(100vh - var(--taskbar-total) - 4px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 3px;
  background: var(--chrome);
  color: var(--text);
  ${bevelWindow};

  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

const item = css`
  flex: none;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 40px;
  padding: 4px 16px 4px 8px;
  background: none;
  border: 0;
  color: var(--text);
  font: 16px/1 var(--main-font);
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
  cursor: default;

  /* The pointer moves focus, so there is only ever one highlighted row. */
  &:focus,
  &:focus-visible {
    background: var(--select);
    color: var(--select-text);
    outline: 1px dotted var(--select-text);
    outline-offset: -1px;
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
  flex: none;
  height: 2px;
  margin: 3px 2px;
  box-shadow: inset 0 1px var(--bevel-shadow), inset 0 -1px var(--bevel-hi);
`;

const ICON = 32;
const ITEMS = DESKTOP_ICONS.filter(entry => entry.kind !== 'egg');
const itemsOf = menu => Array.from(menu.querySelectorAll('[role="menuitem"]'));

// The Start button and its menu: every window and the two desktop commands.
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
        <Tile $size={16} aria-hidden="true">
          <GlyphApp size={16} />
        </Tile>
        Peter Shamoun
      </StartButton>
      <Menu
        ref={menuRef}
        id="start-menu"
        role="menu"
        aria-label="Peter Shamoun"
        tabIndex={-1}
        hidden={!open}
        onKeyDown={onMenuKeyDown}>
        {ITEMS.map(entry => {
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
          data-start-item="siteinfo"
          onClick={openWindow('siteinfo')}
          onPointerMove={hover}>
          <Tile $size={ICON} aria-hidden="true">
            <GlyphApp size={ICON} />
          </Tile>
          About this site
        </ItemButton>
        <ItemButton
          role="menuitem"
          tabIndex={-1}
          data-start-item="tidy"
          onClick={reset}
          onPointerMove={hover}>
          <Tile $size={ICON} $light aria-hidden="true">
            <GlyphMenu size={ICON} />
          </Tile>
          Tidy desktop
        </ItemButton>
      </Menu>
    </Root>
  );
};

export default StartMenu;
