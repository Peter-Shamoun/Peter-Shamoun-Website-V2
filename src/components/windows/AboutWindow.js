import React from 'react';
import { Window, Heading, Lines } from '@components/desktop';

const AboutWindow = () => (
  <Window id="about">
    <Heading>Hi, I&apos;m Peter.</Heading>
    <Lines>
      <li>
        <span>Building agents</span>
      </li>
      <li>
        <span>Researching AI safety</span>
      </li>
      <li>
        <span>Finding fraud in data</span>
      </li>
    </Lines>
  </Window>
);

export default AboutWindow;
