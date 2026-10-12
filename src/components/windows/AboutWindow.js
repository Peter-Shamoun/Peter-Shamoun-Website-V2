import React from 'react';
import styled from 'styled-components';
import {
  Window,
  useDesktop,
  Heading,
  Text,
  Props,
  ButtonRow,
  BevelButton,
  BevelLink,
  ExtLink,
} from '@components/desktop';

const Details = styled(Props)`
  padding-top: 0.4rem;
`;

const Buttons = styled(ButtonRow)`
  margin-top: 0.4rem;
`;

const PROPERTIES = [
  ['Role', 'AI Engineer, Xifin (June 2026 to present)'],
  ['Education', 'B.S. Data Science, UC San Diego (March 2026)'],
  ['Research', 'AI safety for large language models, HDSI Data Smith Lab (ongoing)'],
  ['Location', 'San Diego, CA'],
  ['Tools', 'Python, SQL, TensorFlow, LangChain, AWS, Docker'],
  [
    'Coursework',
    'Data Structures & Algorithms, Machine Learning, NLP, Database Management, Cloud Computing',
  ],
];

const AboutWindow = () => {
  const { actions } = useDesktop();
  const open = id => e => actions.openWindow(id, { from: e.currentTarget });

  return (
    <Window id="about">
      <Heading>Hi, I&apos;m Peter.</Heading>

      <Text>
        I&apos;m an AI Engineer at <ExtLink href="https://www.xifin.com/">Xifin</ExtLink> in San
        Diego, where I build agentic AI workflows that prevent insurance claim denials and
        autonomously appeal them.
      </Text>

      <Text>
        I graduated from <ExtLink href="https://ucsd.edu/">UC San Diego</ExtLink> with a B.S. in
        Data Science in March 2026. I also do AI safety research at the{' '}
        <ExtLink href="https://datascience.ucsd.edu/">HDSI Data Smith Lab</ExtLink>, where I work on
        steering large language models away from harmful outputs with task vector algebra.
      </Text>

      <Text>
        Before Xifin I was a Data Science Intern at{' '}
        <ExtLink href="https://www.lpl.com/">LPL Financial</ExtLink>, the{' '}
        <ExtLink href="https://www.datasciencealliance.org/">Data Science Alliance</ExtLink> and{' '}
        <ExtLink href="https://www.nexon.com/main/en">Nexon America</ExtLink>. On the side I build
        tools that help students, like{' '}
        <ExtLink href="https://cheat-sheet-ai.com/">Cheat Sheet AI</ExtLink>.
      </Text>

      <Details>
        {PROPERTIES.map(([term, value]) => (
          <React.Fragment key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </React.Fragment>
        ))}
      </Details>

      <Buttons>
        <BevelButton onClick={open('experience')}>Experience</BevelButton>
        <BevelButton onClick={open('projects')}>Projects</BevelButton>
        <BevelButton onClick={open('contact')}>Contact</BevelButton>
        <BevelLink href="/resume.pdf">Resume.pdf</BevelLink>
      </Buttons>
    </Window>
  );
};

export default AboutWindow;
