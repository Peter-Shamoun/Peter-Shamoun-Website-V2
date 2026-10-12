import React from 'react';
import styled from 'styled-components';
import { Window, ExtLink } from '@components/desktop';

// The window body is flush, so this page supplies its own background and fills the area.
const Page = styled.div`
  min-height: 100%;
  background: var(--siteinfo-bg);
  color: var(--bg-color);
`;

const Title = styled.p`
  margin: 0;
  padding: 1.6rem 1rem 0.8rem;
  font: 24px/1.1 var(--main-large-font);
  text-align: center;
  text-transform: uppercase;
  color: var(--bg-color);
`;

const Para = styled.p`
  margin: 0;
  padding: 1rem;
  font-size: 16px;
  color: var(--bg-color);
`;

// Full-width blue band with the font credits. Its links are white and underlined.
const Band = styled.div`
  padding: 0.7rem 1rem;
  background: var(--bg-color);
  color: #ffffff;
  overflow-wrap: anywhere;

  h3 {
    margin: 0 0 0.4rem;
    font: 16px/1.25 var(--main-font);
    letter-spacing: 0.5px;
  }

  p {
    margin: 0;
    font-size: 16px;
    color: #ffffff;
  }

  a {
    color: #ffffff;
    text-decoration: underline;
  }
`;

const SiteInfoWindow = () => {
  const year = new Date().getFullYear();

  return (
    <Window id="siteinfo" flush>
      <Page>
        <Title>(C) {year} Peter Shamoun</Title>

        <Para>
          This site is a homage to late-1990s desktop operating systems and to the fake-desktop
          design of thestrokes.com. It is an independent personal site, not affiliated with or
          endorsed by The Strokes or their labels. Every icon, picture and word here is original.
        </Para>

        <Band>
          <h3>Typefaces</h3>
          <p>
            Web437 DOS/V re. ANK16 and ANK24 by VileR, from The Ultimate Oldschool PC Font Pack (
            <ExtLink href="https://int10h.org/oldschool-pc-fonts/">
              https://int10h.org/oldschool-pc-fonts/
            </ExtLink>
            ), licensed CC BY-SA 4.0 (
            <ExtLink href="https://creativecommons.org/licenses/by-sa/4.0/">
              https://creativecommons.org/licenses/by-sa/4.0/
            </ExtLink>
            ). Silkscreen by Jason Kottke, SIL Open Font License 1.1.
          </p>
        </Band>

        <Para>
          Built with Gatsby and React. Code forked from Brittany Chiang&apos;s{' '}
          <ExtLink href="https://github.com/bchiang7/v4">v4</ExtLink> (MIT licence).
        </Para>
      </Page>
    </Window>
  );
};

export default SiteInfoWindow;
