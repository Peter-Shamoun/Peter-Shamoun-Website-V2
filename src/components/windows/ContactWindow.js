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
  gap: 8px;
`;

// A full-width gloss command link, the Windows 7 style: the action name in bold blue at the
// left, the address in muted text at the right. The whole row is the link.
const Row = styled(BevelLink)`
  && {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    column-gap: 12px;
    width: 100%;
    height: auto;
    min-height: 40px;
    padding: 6px 12px;
    text-align: left;
  }

  ${media.phone} {
    && {
      min-height: 44px;
    }
  }
`;

const Label = styled.span`
  font: 600 14px/1.3 var(--main-font);
  color: var(--heading);
`;

// Addresses wrap anywhere on narrow screens rather than push the row wider than the window.
const Shown = styled.span`
  font: 400 14px/1.3 var(--main-font);
  color: var(--text-muted);
  overflow-wrap: anywhere;
  text-align: right;
`;

const ContactWindow = () => (
  <Window id="contact">
    <Heading>Contact</Heading>

    <Rows>
      {ROWS.map(row => (
        <Row key={row.label} href={row.href}>
          <Label>{row.label}</Label>
          <Shown>{row.shown}</Shown>
        </Row>
      ))}
    </Rows>
  </Window>
);

export default ContactWindow;
