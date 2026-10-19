import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { media, gloss, glossPressed, field, focusRing } from '@styles';

// Links that leave the page (absolute http(s) addresses and PDFs) open in a new tab.
const isExternal = href => typeof href === 'string' && /^(https?:\/\/.+|.*\.pdf)$/i.test(href);
const externalProps = href =>
  isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

const glossControl = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 14px;
  font: 400 14px/1 var(--main-font);
  letter-spacing: 0;
  text-decoration: none;
  white-space: nowrap;
  cursor: default;
  ${gloss};
  ${focusRing};

  &:active {
    ${glossPressed};
  }

  ${media.phone} {
    height: 44px;
  }
`;

/** Windows 7 push button: 26px high, 44px on phones. */
export const GlossButton = styled.button.attrs(props => ({ type: props.type || 'button' }))`
  ${glossControl};
`;

const StyledGlossLink = styled.a`
  ${glossControl};
`;

/** The same look for a link. Adds target and rel when the address leaves the page. */
export const GlossLink = React.forwardRef(({ href, ...rest }, ref) => (
  <StyledGlossLink ref={ref} href={href} {...externalProps(href)} {...rest} />
));
GlossLink.displayName = 'GlossLink';
GlossLink.propTypes = { href: PropTypes.string };

// legacy names, delete in cleanup
export const BevelButton = GlossButton;
export const BevelLink = GlossLink;

/** Window heading. */
export const Heading = styled.h3`
  margin: 0 0 12px;
  font: 300 22px/1.2 var(--main-large-font);
  color: var(--heading);
  letter-spacing: 0;
`;

// Short lines, one thought each. A row is either one phrase, or a name with a phrase beside it.
export const Lines = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 15px;
  line-height: 1.5;

  li {
    display: grid;
    grid-template-columns: 24rem minmax(0, 1fr);
    column-gap: 1.6rem;
    padding: 0.5rem 0;
  }

  li > :only-child {
    grid-column: 1 / -1;
  }

  ${media.phone} {
    li {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;

export const SubHeading = styled.h4`
  margin: 16px 0 8px;
  padding-bottom: 3px;
  font: 600 13px/1.25 var(--main-font);
  color: var(--heading);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid;
  border-image: linear-gradient(90deg, var(--sky-300), rgba(116, 198, 242, 0)) 1;
`;

/** Body paragraph. */
export const Text = styled.p`
  margin: 0 0 12px;
  font-size: 15px;
`;

/** White content field. */
export const Inset = styled.div`
  ${field};
  padding: 8px;
`;

/** Definition list in two columns (one on phones). */
export const Props = styled.dl`
  display: grid;
  grid-template-columns: 10rem 1fr;
  column-gap: 1rem;
  row-gap: 0.6rem;
  margin: 0 0 1.2rem;

  dt {
    font: 600 13px/1.5 var(--main-font);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
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
    color: var(--text-muted);
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
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: var(--link-hover);
  }

  ${focusRing};
`;

/** Underlined in-text link with the same external-target rule as GlossLink. */
export const ExtLink = React.forwardRef(({ href, ...rest }, ref) => (
  <StyledExtLink ref={ref} href={href} {...externalProps(href)} {...rest} />
));
ExtLink.displayName = 'ExtLink';
ExtLink.propTypes = { href: PropTypes.string };
