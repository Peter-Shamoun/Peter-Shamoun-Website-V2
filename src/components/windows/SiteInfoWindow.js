import React from 'react';
import styled from 'styled-components';
import { Window, Heading, SubHeading, Text, ExtLink } from '@components/desktop';

// The font credits hold two long addresses, which may break anywhere.
const Credits = styled(Text)`
  overflow-wrap: anywhere;
`;

const Last = styled(Text)`
  margin-bottom: 0;
`;

const SiteInfoWindow = () => {
  const year = new Date().getFullYear();

  return (
    <Window id="siteinfo">
      <Heading>(C) {year} Peter Shamoun</Heading>

      <Text>
        This site is a homage to late-1990s desktop operating systems and to the fake-desktop design
        of thestrokes.com. It is an independent personal site, not affiliated with or endorsed by
        The Strokes or their labels. Every icon, picture and word here is original.
      </Text>

      <SubHeading as="h3">Typefaces</SubHeading>
      <Credits>
        Web437 DOS/V re. ANK16 and ANK24 by VileR, from The Ultimate Oldschool PC Font Pack (
        <ExtLink href="https://int10h.org/oldschool-pc-fonts/">
          https://int10h.org/oldschool-pc-fonts/
        </ExtLink>
        ), licensed CC BY-SA 4.0 (
        <ExtLink href="https://creativecommons.org/licenses/by-sa/4.0/">
          https://creativecommons.org/licenses/by-sa/4.0/
        </ExtLink>
        ). Silkscreen by Jason Kottke, SIL Open Font License 1.1.
      </Credits>

      <Text>
        Built with Gatsby and React. Code forked from Brittany Chiang&apos;s{' '}
        <ExtLink href="https://github.com/bchiang7/v4">v4</ExtLink> (MIT licence).
      </Text>

      <Last>
        Visits and clicks are counted with Vercel Web Analytics, which sets no cookies and is not
        used for advertising.
      </Last>
    </Window>
  );
};

export default SiteInfoWindow;
