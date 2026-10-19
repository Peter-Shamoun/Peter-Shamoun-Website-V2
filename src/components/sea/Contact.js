import React from 'react';
import styled from 'styled-components';
import { withPrefix } from 'gatsby';
import config from '@config';
import { media, plate, focusOnWater } from '@styles';
import Stop from './Stop';
import { Wrap, WaterTitle, WaterLede, external } from './ui';

// Back up through the school of fish to the surface.

const linkFor = name => config.socialMedia.find(item => item.name === name).url;
const shown = url => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const ROWS = [
  { label: 'Email', href: `mailto:${config.email}`, text: config.email, ext: false },
  { label: 'GitHub', href: linkFor('GitHub'), text: shown(linkFor('GitHub')), ext: true },
  { label: 'LinkedIn', href: linkFor('LinkedIn'), text: shown(linkFor('LinkedIn')), ext: true },
];

const Inner = styled(Wrap)`
  padding: clamp(110px, 20vh, 220px) 0 0;
`;

const Rows = styled.ul`
  display: grid;
  gap: 14px;
  max-width: 760px;
  margin: clamp(30px, 5vh, 48px) 0 0;
  padding: 0;
  list-style: none;
`;

// A wide glass command link: the action in bold blue at the left, the address at the right.
const Row = styled.a`
  ${plate};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px 18px;
  min-height: 72px;
  padding: 14px 26px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 0.35s var(--ease-out);
  ${focusOnWater};

  &:hover {
    transform: translateX(6px);
  }

  ${media.phone} {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 24px;
    padding: 14px 22px;
  }
`;

const Label = styled.span`
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--heading);
`;

const Address = styled.span`
  font-size: 1.7rem;
  color: var(--text-muted);
  overflow-wrap: anywhere;
`;

const Foot = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  margin-top: clamp(90px, 16vh, 160px);
  padding: 22px 0 max(26px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  font-size: 1.5rem;
  color: #04305e;

  a {
    color: inherit;
    font-weight: 600;
    border-radius: 4px;
  }
`;

const Contact = () => (
  <Stop id="contact" plate="school" focus="50% 60%" bubbles={18} labelledBy="contact-title">
    <Inner>
      <WaterTitle id="contact-title">Say hello</WaterTitle>
      <WaterLede>Email is the quickest way to reach me.</WaterLede>
      <Rows>
        {ROWS.map(r => (
          <li key={r.label}>
            <Row href={r.href} {...(r.ext ? external : {})}>
              <Label>{r.label}</Label>
              <Address>{r.text}</Address>
            </Row>
          </li>
        ))}
      </Rows>
      <Foot>
        <span>© {new Date().getFullYear()} Peter Shamoun</span>
        <span>
          Photographs: CC0, <a href={withPrefix('/sea/CREDITS.md')}>credits</a>.{' '}
          <a href="#top">Back to the surface</a>
        </span>
      </Foot>
    </Inner>
  </Stop>
);

export default Contact;
