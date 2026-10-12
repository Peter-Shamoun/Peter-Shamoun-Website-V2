import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { media } from '@styles';
import { ICONS, IconSelection } from './icons';

// Picture box. The SVG fills it; the selection overlay is drawn on top of the picture.
const Picture = styled.span`
  position: relative;
  display: block;
  width: 62px;
  height: 62px;
  line-height: 0;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  ${media.phone} {
    width: 52px;
    height: 52px;
  }

  ${media.landscape} {
    width: 35px;
    height: 35px;
  }
`;

const Selection = styled.span`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Label = styled.span`
  margin-top: 2px;
  font: 13px/16px var(--link-font);
  letter-spacing: 0.5px;
  white-space: nowrap;

  ${media.phone} {
    font-size: 15px;
    line-height: 19px;
  }

  /* The narrowest phones: without this, neighbouring labels in a row touch. */
  @media (max-width: 359px) {
    font-size: 14px;
    letter-spacing: 0;
  }

  ${media.landscape} {
    font-size: 10px;
    line-height: 12px;
  }
`;

// Position comes from custom properties set by DesktopIcons: --icon-x (desktop),
// --icon-x-tablet, --icon-x-phone, --icon-row (phone), --icon-x-land (landscape phone).
const StyledIcon = styled.button`
  position: absolute;
  bottom: ${props => (props.$egg ? '113px' : '18px')};
  left: var(--icon-x, 0%);
  z-index: var(--z-icons);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: var(--icon-size);
  margin: 0;
  padding: 0;
  background: none;
  border: 0;
  color: #fff;
  text-align: center;
  text-decoration: none;
  cursor: default;
  pointer-events: auto;

  &:hover ${Selection}, &:focus-visible ${Selection} {
    display: block;
  }

  &:focus-visible {
    outline: 1px dotted #fff;
    outline-offset: 2px;
  }

  ${media.tablet} {
    left: var(--icon-x-tablet, var(--icon-x, 0%));
  }

  ${media.phone} {
    left: var(--icon-x-phone, 0%);
    bottom: calc(10px + var(--icon-row, 0) * 80px + env(safe-area-inset-bottom, 0px));
    min-width: 52px;
    min-height: 73px;
  }

  ${media.landscape} {
    left: var(--icon-x-land, 0%);
    bottom: 2px;
    min-width: 0;
    min-height: 0;
  }

  ${props =>
    props.$egg &&
    css`
      ${media.phone} {
        display: none;
      }

      ${media.landscape} {
        display: none;
      }
    `}
`;

// Picture, label and the hover and focus overlay. Shared by the button and link forms.
const Content = ({ item }) => {
  const Art = ICONS[item.icon];
  return (
    <>
      <Picture>
        {Art ? <Art /> : null}
        <Selection>
          <IconSelection />
        </Selection>
      </Picture>
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

// One desktop icon. Window icons are buttons, the resume is a link, the egg is a button.
const DesktopIcon = ({ item, onActivate, style }) => {
  if (item.kind === 'link') {
    return (
      <StyledIcon as="a" href={item.href} target="_blank" rel="noopener noreferrer" style={style}>
        <Content item={item} />
      </StyledIcon>
    );
  }

  if (item.kind === 'egg') {
    return (
      <StyledIcon type="button" data-egg $egg onClick={onActivate} style={style}>
        <Content item={item} />
      </StyledIcon>
    );
  }

  return (
    <StyledIcon
      type="button"
      data-icon-for={item.target}
      aria-label={`Open ${item.label}`}
      onClick={onActivate}
      style={style}>
      <Content item={item} />
    </StyledIcon>
  );
};

DesktopIcon.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    kind: PropTypes.oneOf(['window', 'link', 'egg']).isRequired,
    target: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  onActivate: PropTypes.func,
  style: PropTypes.object,
};

export default DesktopIcon;
