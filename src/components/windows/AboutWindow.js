import React from 'react';
import styled from 'styled-components';
import { StaticImage } from 'gatsby-plugin-image';
import { media } from '@styles';
import {
  Window,
  useDesktop,
  Heading,
  Text,
  Inset,
  Props,
  ButtonRow,
  BevelButton,
  BevelLink,
  ExtLink,
} from '@components/desktop';
import { BannerAbout } from '@components/desktop/icons';

// Banner strip across the top of the window. Decorative; the heading sits over it.
const Banner = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  background: var(--window-title-bar-color);

  & > svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  ${media.phone} {
    height: 100px;
  }
`;

const BannerHeading = styled(Heading)`
  position: absolute;
  left: 1.5rem;
  bottom: 1.2rem;
  margin: 0;
  color: #ffffff;
  pointer-events: none;

  ${media.phone} {
    left: 1rem;
    bottom: 0.8rem;
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

// Headshot in a sunken frame: floated right on desktop, stacked above the text on phones.
const Headshot = styled(Inset)`
  float: right;
  margin: 0 0 1rem 1.5rem;
  padding: 0.4rem;
  background: #ffffff;

  img {
    display: block;
  }

  ${media.phone} {
    float: none;
    width: fit-content;
    margin: 0 auto 1.2rem;
  }
`;

const Details = styled(Props)`
  clear: both;
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
    <Window id="about" flush>
      <Banner>
        <BannerAbout preserveAspectRatio="xMidYMid slice" />
        <BannerHeading>Hi, I&apos;m Peter.</BannerHeading>
      </Banner>

      <Content>
        <Headshot>
          <StaticImage src="../../images/me.jpg" width={140} alt="Peter Shamoun" />
        </Headshot>

        <Text>
          I&apos;m an AI Engineer at <ExtLink href="https://www.xifin.com/">Xifin</ExtLink> in San
          Diego, where I build agentic AI workflows that prevent insurance claim denials and
          autonomously appeal them.
        </Text>

        <Text>
          I graduated from <ExtLink href="https://ucsd.edu/">UC San Diego</ExtLink> with a B.S. in
          Data Science in March 2026. I also do AI safety research at the{' '}
          <ExtLink href="https://datascience.ucsd.edu/">HDSI Data Smith Lab</ExtLink>, where I work
          on steering large language models away from harmful outputs with task vector algebra.
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
      </Content>
    </Window>
  );
};

export default AboutWindow;
