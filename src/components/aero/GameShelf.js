import React from 'react';
import styled from 'styled-components';
import { useDesktop, GAME_LIST } from '@components/desktop';
import { ICONS } from '../desktop/icons';

// Two lime acrylic shelves hanging from the ivy at the right edge, with the seven games standing
// on them like cartridges. A shortcut: the Games bubble opens the same games in a folder, so the
// shelves only show where there is room for them beside the globe.

const Shelves = styled.nav`
  position: absolute;
  right: clamp(18px, 2.4vw, 56px);
  top: clamp(150px, 26vh, 300px);
  z-index: var(--z-icons);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 58px;
  pointer-events: none;

  @media (max-width: 1259px), (max-height: 659px) {
    display: none;
  }
`;

// The plank: a translucent lime slab with a hot front edge, glowing onto the air below it.
// The two vines it hangs from run up past the top of the screen.
const Shelf = styled.ul`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  margin: 0;
  padding: 0 14px 18px;
  list-style: none;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 18px;
    border-radius: 4px 4px 7px 7px;
    background: linear-gradient(
        180deg,
        rgba(240, 255, 190, 0.95) 0,
        rgba(200, 255, 90, 0.75) 34%,
        rgba(160, 255, 20, 0.7) 36%,
        rgba(120, 230, 0, 0.75) 100%
      ),
      linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.5),
        transparent 30%,
        transparent 70%,
        rgba(255, 255, 255, 0.4)
      );
    background-blend-mode: screen;
    border: 1px solid rgba(240, 255, 200, 0.9);
    box-shadow: 0 0 18px 4px rgba(125, 255, 0, 0.55), 0 16px 26px -6px rgba(125, 255, 0, 0.5),
      inset 0 -3px 6px rgba(60, 140, 0, 0.45);
  }

  /* vines */
  &::after {
    content: '';
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 16px;
    height: 100vh;
    border-left: 2px solid #2b7a16;
    border-right: 2px solid #2b7a16;
    -webkit-mask: linear-gradient(transparent 20%, #000 70%);
    mask: linear-gradient(transparent 20%, #000 70%);
    pointer-events: none;
    z-index: -1;
  }
`;

const Slot = styled.li`
  position: relative;
  display: flex;
`;

// A game: its glossy icon standing on the plank, reflected in it. The name shows on hover and
// focus in a glass tag above.
const Game = styled.button.attrs({ type: 'button' })`
  position: relative;
  display: grid;
  place-items: center;
  width: 60px;
  height: 64px;
  padding: 0;
  border: 0;
  border-radius: 14px;
  background: none;
  cursor: pointer;
  pointer-events: auto;
  transition: transform var(--dur-hover) var(--ease-spring);

  img {
    width: 54px;
    height: 54px;
    filter: drop-shadow(0 4px 4px rgba(0, 50, 20, 0.45));
    -webkit-box-reflect: below 2px linear-gradient(transparent 70%, rgba(255, 255, 255, 0.35));
  }

  &:hover,
  &:focus-visible {
    transform: translateY(-6px) rotate(-3deg);
  }

  &:focus-visible {
    outline: 3px solid var(--focus-on-scene);
    outline-offset: 3px;
    box-shadow: 0 0 18px 4px rgba(184, 255, 46, 0.6);
  }

  @media (min-width: 1700px) {
    width: 76px;
    height: 80px;

    img {
      width: 68px;
      height: 68px;
    }
  }
`;

const Tag = styled.span`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  translate: -50% 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ffffff, #dff6ff);
  box-shadow: 0 4px 12px rgba(0, 40, 100, 0.35);
  font: 800 13px/1.2 var(--display-font);
  color: var(--text-on-glass);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-hover) var(--ease-out), translate var(--dur-hover) var(--ease-out);

  ${Game}:hover + &,
  ${Game}:focus-visible + & {
    opacity: 1;
    translate: -50% 0;
  }
`;

const ROWS = [GAME_LIST.slice(0, 4), GAME_LIST.slice(4)];

const GameShelf = () => {
  const { actions } = useDesktop();

  return (
    <Shelves aria-label="Games" data-front data-shelves>
      {ROWS.map(row => (
        <Shelf key={row[0].id}>
          {row.map(({ id, title, icon }) => {
            const Art = ICONS[icon];
            return (
              <Slot key={id}>
                <Game
                  data-shelf-game={id}
                  aria-label={`Play ${title}`}
                  onClick={e => actions.openWindow(id, { from: e.currentTarget })}>
                  <Art size={54} />
                </Game>
                <Tag aria-hidden="true">{title}</Tag>
              </Slot>
            );
          })}
        </Shelf>
      ))}
    </Shelves>
  );
};

export default GameShelf;
