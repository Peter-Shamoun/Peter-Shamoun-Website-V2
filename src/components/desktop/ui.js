import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { media, bevel, bevelPressed, focusRect, inset } from '@styles';

// Links that leave the page (absolute http(s) addresses and PDFs) open in a new tab.
const isExternal = href => typeof href === 'string' && /^(https?:\/\/.+|.*\.pdf)$/i.test(href);
const externalProps = href =>
  isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

const bevelControl = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  padding: 0 1.2rem;
  background: var(--chrome);
  color: var(--text);
  font: 16px/1 var(--main-font);
  letter-spacing: 0.5px;
  text-decoration: none;
  white-space: nowrap;
  cursor: default;
  ${bevel};
  ${focusRect};

  &:active {
    ${bevelPressed};
  }

  ${media.phone} {
    height: 44px;
  }
`;

/** Grey bevel button: 25px high, 44px on phones. */
export const BevelButton = styled.button.attrs(props => ({ type: props.type || 'button' }))`
  ${bevelControl};
`;

const StyledBevelLink = styled.a`
  ${bevelControl};
`;

/** The same look for a link. Adds target and rel when the address leaves the page. */
export const BevelLink = React.forwardRef(({ href, ...rest }, ref) => (
  <StyledBevelLink ref={ref} href={href} {...externalProps(href)} {...rest} />
));
BevelLink.displayName = 'BevelLink';
BevelLink.propTypes = { href: PropTypes.string };

/** Window heading. */
export const Heading = styled.h3`
  margin: 0 0 1rem;
  font: 24px/1.1 var(--main-large-font);
  letter-spacing: 1px;
`;

export const SubHeading = styled.h4`
  margin: 1.6rem 0 0.8rem;
  padding-bottom: 0.3rem;
  font: 16px/1.25 var(--main-font);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-bottom: 1px solid var(--bevel-shadow);
`;

/** Body paragraph. */
export const Text = styled.p`
  margin: 0 0 1.2rem;
  font-size: 16px;
`;

/** Sunken panel. */
export const Inset = styled.div`
  ${inset};
`;

/** Definition list in two columns (one on phones). */
export const Props = styled.dl`
  display: grid;
  grid-template-columns: 10rem 1fr;
  column-gap: 1rem;
  row-gap: 0.6rem;
  margin: 0 0 1.2rem;

  dt {
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    min-width: 0;
  }

  ${media.phone} {
    grid-template-columns: 1fr;
    row-gap: 0.2rem;

    dd {
      margin-bottom: 0.6rem;
    }
  }
`;

/** Inline list, items separated by " / ". */
export const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;

  li + li::before {
    content: ' / ';
    white-space: pre;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.2rem;
`;

const StyledExtLink = styled.a`
  color: var(--link);
  text-decoration: underline;
`;

/** Underlined in-text link with the same external-target rule as BevelLink. */
export const ExtLink = React.forwardRef(({ href, ...rest }, ref) => (
  <StyledExtLink ref={ref} href={href} {...externalProps(href)} {...rest} />
));
ExtLink.displayName = 'ExtLink';
ExtLink.propTypes = { href: PropTypes.string };
