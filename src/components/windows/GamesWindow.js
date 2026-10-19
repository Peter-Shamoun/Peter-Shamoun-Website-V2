import React from 'react';
import styled from 'styled-components';
import { media, hotTrack, hotTrackStrong } from '@styles';
import { Window, useDesktop, GAME_LIST } from '@components/desktop';
import { ICONS } from '../desktop/icons';

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Label = styled.span`
  padding: 0 2px;
  font: 400 13px/1.3 var(--main-font);
  color: var(--text);
  text-align: center;
`;

// A folder entry: the picture over its name. Selected with Explorer hot-track: a pale blue
// rounded box under the pointer, and a stronger one for keyboard focus and press.
const Entry = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 6px 4px;
  background: none;
  border: 1px solid transparent;
  border-radius: 3px;
  color: var(--text);
  cursor: default;
  transition: background var(--dur-hover) var(--ease-out),
    border-color var(--dur-hover) var(--ease-out);

  &:hover {
    ${hotTrack}
  }

  &:focus-visible,
  &:active {
    ${hotTrackStrong};
    outline: none;
  }

  & img {
    display: block;
    width: 48px;
    height: 48px;
    filter: drop-shadow(0 1px 2px rgba(0, 30, 60, 0.3));
  }

  ${media.phone} {
    min-height: 76px;
  }
`;

// The Games folder: one entry per game, each opening in its own window.
const GamesWindow = () => {
  const { actions } = useDesktop();

  return (
    <Window id="games">
      <Grid>
        {GAME_LIST.map(({ id, title, icon }) => {
          const Art = ICONS[icon];
          return (
            <li key={id}>
              <Entry
                data-game={id}
                aria-label={`Play ${title}`}
                onClick={e => actions.openWindow(id, { from: e.currentTarget })}>
                <Art size={48} />
                <Label>{title}</Label>
              </Entry>
            </li>
          );
        })}
      </Grid>
    </Window>
  );
};

export default GamesWindow;
