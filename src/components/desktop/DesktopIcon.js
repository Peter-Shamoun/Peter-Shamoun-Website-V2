import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ICONS } from './icons';

// Picture box. The art fills it. The drop shadow lifts the icon off the wallpaper.
const Picture = styled.span`
  display: block;
  width: var(--icon-size);
  height: var(--icon-size);
  line-height: 0;

  img,
  svg {
    display: block;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 2px 3px rgba(0, 30, 60, 0.45));
  }
`;

// Two lines at most. No background: the label sits on the wallpaper, and the selection box is the button.
const Label = styled.span`
  margin-top: 2px;
  padding: 0 2px;
  font: 400 14px/18px var(--main-font);
  letter-spacing: 0;
  white-space: normal;
  max-width: 96px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// One cell of the grid laid out by DesktopIcons. The whole button is the selection box.
const StyledIcon = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  min-width: var(--icon-size);
  margin: 0;
  padding: 4px 4px 3px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: none;
  color: var(--text-on-desktop);
  text-shadow: var(--shadow-on-desktop);
  text-align: center;
  text-decoration: none;
  cursor: default;
  pointer-events: auto;
  transition: background var(--dur-hover) var(--ease-out),
    border-color var(--dur-hover) var(--ease-out);

  &:hover {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.36), rgba(255, 255, 255, 0.16));
    border-color: rgba(255, 255, 255, 0.7);
  }

  /* Selected by keyboard or press: a frosted blue box around the icon and its label.
     The box is the focus indicator, so the button has no outline. */
  &:focus-visible,
  &:active {
    outline: none;
    background: linear-gradient(180deg, rgba(190, 228, 255, 0.5), rgba(120, 190, 245, 0.35));
    border-color: rgba(210, 238, 255, 0.95);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
  }
`;

// Picture and label. Shared by the button and link forms.
const Content = ({ item }) => {
  const Art = ICONS[item.icon];
  return (
    <>
      <Picture>{Art ? <Art /> : null}</Picture>
      <Label>{item.label}</Label>
    </>
  );
};

Content.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

// One desktop icon. Window icons are buttons, a link entry is a link.
const DesktopIcon = ({ item, onActivate }) => {
  if (item.kind === 'link') {
    return (
      <StyledIcon as="a" href={item.href} target="_blank" rel="noopener noreferrer">
        <Content item={item} />
      </StyledIcon>
    );
  }

  return (
    <StyledIcon
      type="button"
      data-icon-for={item.target}
      aria-label={`Open ${item.label}`}
      onClick={onActivate}>
      <Content item={item} />
    </StyledIcon>
  );
};

DesktopIcon.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    kind: PropTypes.oneOf(['window', 'link']).isRequired,
    target: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  onActivate: PropTypes.func,
};

export default DesktopIcon;
