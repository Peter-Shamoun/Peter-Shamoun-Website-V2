import React from 'react';
import styled from 'styled-components';
import { graphql, useStaticQuery } from 'gatsby';
import { media } from '@styles';
import Stop from './Stop';
import { Wrap, Plate, WaterTitle, GlassLink, external } from './ui';

// Over the turquoise sand. One tall plate; each job hangs off a column of rising bubbles.

const Inner = styled(Wrap)`
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(28px, 5vw, 80px);
  align-items: start;
  padding: clamp(90px, 16vh, 180px) 0;

  ${media.tablet} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Head = styled.div`
  position: sticky;
  top: calc(var(--nav-h) + 48px);

  ${media.tablet} {
    position: static;
  }
`;

const Jobs = styled(Plate)`
  margin: 0;
  padding-top: clamp(14px, 2vw, 22px);
  padding-bottom: clamp(14px, 2vw, 22px);
  list-style: none;
`;

const Job = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  column-gap: 18px;
  padding: 20px 0;

  & + & {
    border-top: 1px solid rgba(10, 95, 168, 0.16);
  }

  /* the bubble that marks the job, and the stream of light joining them */
  &::before {
    content: '';
    grid-row: 1 / span 3;
    width: 18px;
    height: 18px;
    margin-top: 6px;
    border-radius: 50%;
    background: radial-gradient(circle at 34% 30%, #ffffff 0 18%, rgba(255, 255, 255, 0) 30%),
      radial-gradient(circle at 50% 50%, #5fd8ff 0%, #138bd6 70%, #0a5fa8 100%);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9), 0 0 12px 2px rgba(60, 200, 255, 0.55);
  }

  &:first-child::before {
    background: radial-gradient(circle at 34% 30%, #ffffff 0 18%, rgba(255, 255, 255, 0) 30%),
      radial-gradient(circle at 50% 50%, #d4ff7a 0%, #7fcf12 70%, #3c8a0c 100%);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9), 0 0 14px 3px rgba(155, 226, 45, 0.6);
  }
`;

const Role = styled.h3`
  font-size: clamp(1.9rem, 1.6vw, 2.1rem);
  font-weight: 600;
  line-height: 1.3;
  color: var(--abyss);

  a {
    font-weight: inherit;
  }
`;

const When = styled.p`
  margin-top: 2px;
  font-size: 1.5rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`;

const What = styled.p`
  margin-top: 6px;
  font-size: 1.7rem;
  color: var(--text);
`;

const Experience = () => {
  const data = useStaticQuery(graphql`
    query SeaJobs {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/jobs/" }
          frontmatter: { show: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        nodes {
          id
          frontmatter {
            title
            company
            range
            url
            summary
          }
        }
      }
    }
  `);
  const jobs = data.allMarkdownRemark.nodes;

  return (
    <Stop
      id="experience"
      plate="shallows"
      focus="40% 50%"
      caustics={0.55}
      bubbles={10}
      labelledBy="experience-title">
      <Inner>
        <Head>
          <WaterTitle id="experience-title">Experience</WaterTitle>
        </Head>
        <Jobs as="ol">
          {jobs.map(({ id, frontmatter: f }) => (
            <Job key={id}>
              <Role>
                {f.title},{' '}
                <GlassLink href={f.url} {...external}>
                  {f.company}
                </GlassLink>
              </Role>
              {f.range ? <When>{f.range.replace(/\s*-\s*/, ' to ')}</When> : null}
              {f.summary ? <What>{f.summary}</What> : null}
            </Job>
          ))}
        </Jobs>
      </Inner>
    </Stop>
  );
};

export default Experience;
