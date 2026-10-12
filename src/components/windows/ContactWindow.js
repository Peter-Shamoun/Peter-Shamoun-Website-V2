import React from 'react';
import styled from 'styled-components';
import config from '@config';
import { media } from '@styles';
import { Window, Heading, BevelLink } from '@components/desktop';

// Shows a link address without its scheme, "www." or leading or trailing slash.
const addressOf = url =>
  url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/^\//, '')
    .replace(/\/$/, '');

const linkFor = name => config.socialMedia.find(item => item.name === name).url;

const ROWS = [
  { label: 'Email', href: `mailto:${config.email}`, shown: config.email },
  { label: 'GitHub', href: linkFor('GitHub'), shown: addressOf(linkFor('GitHub')) },
  { label: 'LinkedIn', href: linkFor('LinkedIn'), shown: addressOf(linkFor('LinkedIn')) },
];

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

// A full-width bevelled link: label at the left, address at the right.
const Row = styled(BevelLink)`
  && {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    column-gap: 1rem;
    width: 100%;
    height: auto;
    min-height: 32px;
    padding: 0.4rem 1rem;
    text-align: left;
  }

  ${media.phone} {
    && {
      min-height: 44px;
    }
  }
`;

// Addresses are small and may wrap on phones, so they stay on the 16 px grid size.
const Shown = styled.span`
  font: 16px/1.2 var(--main-font);
  overflow-wrap: anywhere;
  text-align: right;
`;

const ContactWindow = () => (
  <Window id="contact">
    <Heading>Contact</Heading>

    <Rows>
      {ROWS.map(row => (
        <Row key={row.label} href={row.href}>
          <span>{row.label}</span>
          <Shown>{row.shown}</Shown>
        </Row>
      ))}
    </Rows>
  </Window>
);

export default ContactWindow;
