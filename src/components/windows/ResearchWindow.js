import React from 'react';
import styled from 'styled-components';
import config from '@config';
import { Window, Heading, Text, Props, ButtonRow, BevelLink } from '@components/desktop';

// The closing line sits directly above the button, so the row needs no extra top margin.
const Action = styled(ButtonRow)`
  margin-top: 0;
`;

const ResearchWindow = () => (
  <Window id="research">
    <Heading>AI safety for large language models</Heading>

    <Text>
      I lead a research project at the HDSI Data Smith Lab at UC San Diego on a novel AI safety
      technique: using task vector algebra to strategically fine-tune large language models,
      precisely manipulating model behavior to mitigate harmful outputs from jailbreak attempts.
    </Text>

    <Props>
      <dt>Lab</dt>
      <dd>HDSI Data Smith Lab, UC San Diego</dd>
      <dt>Role</dt>
      <dd>AI Researcher</dd>
      <dt>Since</dt>
      <dd>May 2025 (ongoing)</dd>
      <dt>Topics</dt>
      <dd>Task vectors, fine-tuning, jailbreak mitigation, LLM safety</dd>
    </Props>

    <Text>Want to talk about this work?</Text>
    <Action>
      <BevelLink href={`mailto:${config.email}`}>Email me</BevelLink>
    </Action>
  </Window>
);

export default ResearchWindow;
