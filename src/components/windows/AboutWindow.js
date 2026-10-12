import React from 'react';
import { Window, Heading, Lines } from '@components/desktop';

const AboutWindow = () => (
  <Window id="about">
    <Heading>Hi, I&apos;m Peter.</Heading>
    <Lines>
      <li>
        <span>I build and study AI systems.</span>
      </li>
    </Lines>
  </Window>
);

export default AboutWindow;
