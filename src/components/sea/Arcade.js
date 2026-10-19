import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withPrefix } from 'gatsby';
import { media, focusOnWater } from '@styles';
import Stop from './Stop';
import { Wrap, WaterTitle, WaterLede } from './ui';
import GAMES from './games';

// The deep. Seven games glow on a lime acrylic ledge in the blue, each in a glass case.

const Inner = styled(Wrap)`
  padding: clamp(100px, 18vh, 200px) 0 clamp(110px, 20vh, 220px);
`;

const Shelf = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(22px, 3vw, 40px) clamp(16px, 2.4vw, 32px);
  margin: clamp(36px, 6vh, 64px) 0 0;
  padding: 0;
  list-style: none;

  li {
    width: clamp(140px, 17vw, 232px);
  }

  ${media.phone} {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 14px;

    li {
      width: auto;
    }

    li:last-child {
      grid-column: 1 / -1;
      justify-self: center;
      width: calc(50% - 7px);
    }
  }
`;

const Tile = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  text-align: center;
  cursor: pointer;
  border-radius: 26px;
  ${focusOnWater};
`;

// The glass case: the game's own first frame behind thick glass, a gloss cap on top, lime light
// coming up from the ledge underneath.
const Case = styled.span`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1;
  padding: 8px;
  border-radius: 26px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(190, 240, 255, 0.28) 45%,
    rgba(120, 220, 255, 0.18) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: inset 0 0 0 1px rgba(10, 95, 168, 0.25),
    inset 0 -10px 22px -10px rgba(170, 255, 90, 0.9), 0 18px 36px -14px rgba(0, 10, 40, 0.8),
    0 24px 40px -18px rgba(155, 226, 45, 0.55);
  transition: transform 0.45s var(--ease-spring), box-shadow 0.45s var(--ease-out);

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 18px;
    object-fit: cover;
    background: #0b2c5c;
  }

  &::after {
    content: '';
    position: absolute;
    left: 8px;
    right: 8px;
    top: 8px;
    height: 46%;
    border-radius: 18px 18px 50% 50% / 18px 18px 22px 22px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.04) 85%,
      rgba(255, 255, 255, 0)
    );
    mix-blend-mode: screen;
    pointer-events: none;
  }

  ${Tile}:hover &,
  ${Tile}:focus-visible & {
    transform: translateY(-6px) scale(1.03);
    box-shadow: inset 0 0 0 1px rgba(10, 95, 168, 0.25),
      inset 0 -12px 26px -10px rgba(190, 255, 110, 1), 0 26px 44px -14px rgba(0, 10, 40, 0.85),
      0 30px 50px -16px rgba(155, 226, 45, 0.8);
  }
`;

const Title = styled.span`
  display: block;
  margin-top: 14px;
  font-size: 1.9rem;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 20, 60, 0.8);
`;

const How = styled.span`
  display: block;
  margin-top: 2px;
  font-size: 1.4rem;
  color: var(--text-on-water-soft);
`;

const Arcade = ({ onPlay }) => (
  <Stop id="games" plate="deep" focus="40% 40%" bubbles={16} labelledBy="games-title">
    <Inner>
      <WaterTitle id="games-title">Games</WaterTitle>
      <WaterLede>
        Seven classics, rebuilt for this site. They run right here, keyboard or touch.
      </WaterLede>
      <Shelf>
        {GAMES.map(g => (
          <li key={g.id}>
            <Tile
              data-arcade-tile
              onClick={e => onPlay(g.id, e.currentTarget)}
              aria-haspopup="dialog">
              <Case>
                <img
                  src={withPrefix(`/sea/games/${g.id}.webp`)}
                  width="200"
                  height="200"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </Case>
              <Title>{g.title}</Title>
              <How>{g.how}</How>
            </Tile>
          </li>
        ))}
      </Shelf>
    </Inner>
  </Stop>
);

Arcade.propTypes = {
  onPlay: PropTypes.func.isRequired,
};

export default Arcade;
