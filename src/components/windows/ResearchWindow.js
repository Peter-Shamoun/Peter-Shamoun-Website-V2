import React from 'react';
import { Window, Heading, Lines, ExtLink } from '@components/desktop';

const ResearchWindow = () => (
  <Window id="research">
    <Heading>Research</Heading>
    <Lines>
      <li>
        <span>Steering language models away from harm</span>
      </li>
      <li>
        <ExtLink href="https://datascience.ucsd.edu/">HDSI Data Smith Lab, UC San Diego</ExtLink>
      </li>
    </Lines>
  </Window>
);

export default ResearchWindow;
