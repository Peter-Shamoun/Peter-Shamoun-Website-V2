import React from 'react';
import styled from 'styled-components';
import { media } from '@styles';
import { Window, useDesktop, GAME_LIST } from '@components/desktop';
import { ICONS } from '../desktop/icons';

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 12px 4px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Label = styled.span`
  padding: 1px 3px;
  font: 16px/18px var(--main-font);
`;

// A folder entry: the picture over its name, selected the way a desktop icon is.
const Entry = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 4px 0;
  background: none;
  border: 0;
  color: var(--text);
  cursor: default;

  &:focus-visible,
  &:active {
    outline: none;
  }

  &:focus-visible ${Label}, &:active ${Label} {
    background: var(--select);
    color: var(--select-text);
    outline: 1px dotted var(--select-text);
    outline-offset: -1px;
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
