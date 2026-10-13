import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ICONS } from './icons';

// Picture box. The SVG fills it.
const Picture = styled.span`
  display: block;
  width: var(--icon-size);
  height: var(--icon-size);
  line-height: 0;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const Label = styled.span`
  margin-top: 2px;
  padding: 1px 3px;
  font: 16px/18px var(--main-font);
  letter-spacing: 0;
  white-space: nowrap;
`;

// One cell of the grid laid out by DesktopIcons.
const StyledIcon = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  min-width: var(--icon-size);
  margin: 0;
  padding: 0;
  background: none;
  border: 0;
  color: var(--text-on-desktop);
  text-shadow: var(--shadow-on-desktop);
  text-align: center;
  text-decoration: none;
  cursor: default;
  pointer-events: auto;

  /* The selected look: the label on navy inside the dotted focus rectangle. */
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
