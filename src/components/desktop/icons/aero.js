import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';

// The Aero icons are drawn SVG files under static/aero/icons (.studio/DESIGN.md section 9).
// Each component has the same signature as makeIcon ({ size, title, ...rest }): decorative
// unless a title is given.
export const makeAeroIcon = (name, path) => {
  const Icon = ({ size, title, ...rest }) => {
    const width = size || 64;
    return (
      <img
        src={withPrefix(path)}
        width={width}
        height={width}
        alt={title || ''}
        aria-hidden={title ? undefined : 'true'}
        draggable={false}
        decoding="async"
        {...rest}
      />
    );
  };

  Icon.displayName = name;
  Icon.propTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
  };

  return Icon;
};

export const IconAbout = makeAeroIcon('IconAbout', '/aero/icons/about.svg');
export const IconExperience = makeAeroIcon('IconExperience', '/aero/icons/experience.svg');
export const IconProjects = makeAeroIcon('IconProjects', '/aero/icons/projects.svg');
export const IconResearch = makeAeroIcon('IconResearch', '/aero/icons/research.svg');
export const IconContact = makeAeroIcon('IconContact', '/aero/icons/contact.svg');
export const IconGames = makeAeroIcon('IconGames', '/aero/icons/games.svg');
export const IconTidy = makeAeroIcon('IconTidy', '/aero/icons/tidy.svg');

export const IconMines = makeAeroIcon('IconMines', '/aero/icons/games/minesweeper.svg');
export const IconCards = makeAeroIcon('IconCards', '/aero/icons/games/solitaire.svg');
export const IconSnake = makeAeroIcon('IconSnake', '/aero/icons/games/snake.svg');
export const IconBlocks = makeAeroIcon('IconBlocks', '/aero/icons/games/blocks.svg');
export const IconBricks = makeAeroIcon('IconBricks', '/aero/icons/games/bricks.svg');
export const IconPaddle = makeAeroIcon('IconPaddle', '/aero/icons/games/paddle.svg');
export const IconInvaders = makeAeroIcon('IconInvaders', '/aero/icons/games/invaders.svg');
