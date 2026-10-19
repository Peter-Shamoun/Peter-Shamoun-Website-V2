import React from 'react';
import styled from 'styled-components';
import { graphql, useStaticQuery, withPrefix } from 'gatsby';
import { media, focusOnWater } from '@styles';
import Stop from './Stop';
import { Wrap, Plate, WaterTitle, external } from './ui';

// In the sun shafts. Each project is its own site, shown on a slab of glass that stands on the
// light with its reflection under it, like a 2008 product shot.

const SHOTS = {
  'Cheat Sheet AI': 'cheatsheet',
  Wireframd: 'wireframd',
};

const Inner = styled(Wrap)`
  padding: clamp(90px, 16vh, 180px) 0 clamp(110px, 18vh, 200px);
`;

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(28px, 4vw, 64px);
  margin: clamp(32px, 6vh, 64px) 0 0;
  padding: 0;
  list-style: none;

  ${media.tablet} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;

  &:nth-child(2) {
    margin-top: clamp(0px, 8vh, 96px);

    ${media.tablet} {
      margin-top: 0;
    }
  }
`;

// The slab: a thick glass frame round the screenshot, bright along the top edge.
const Slab = styled.a`
  position: relative;
  display: block;
  padding: 10px;
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(210, 244, 255, 0.5) 40%,
    rgba(150, 225, 255, 0.35) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 0 0 1px rgba(10, 95, 168, 0.25),
    inset 0 -8px 20px -10px rgba(80, 230, 255, 0.9), 0 30px 60px -24px rgba(0, 30, 80, 0.7);
  transition: transform 0.5s var(--ease-out), box-shadow 0.5s var(--ease-out);
  ${focusOnWater};

  picture,
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 15px;
  }

  /* the glass over the screen: one diagonal sheen */
  &::after {
    content: '';
    position: absolute;
    inset: 10px;
    border-radius: 15px;
    pointer-events: none;
    background: linear-gradient(
      118deg,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.14) 32%,
      rgba(255, 255, 255, 0) 33%
    );
    box-shadow: inset 0 0 0 1px rgba(0, 40, 90, 0.18);
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-6px);
      box-shadow: inset 0 0 0 1px rgba(10, 95, 168, 0.25),
        inset 0 -8px 20px -10px rgba(80, 230, 255, 0.9), 0 40px 70px -24px rgba(0, 30, 80, 0.75);
    }
  }
`;

// The reflection on the water below the slab.
const Mirror = styled.div`
  height: 70px;
  margin: 2px 10px 0;
  border-radius: 0 0 15px 15px;
  background-size: 100% auto;
  background-position: 50% 100%;
  transform: scaleY(-1);
  opacity: 0.35;
  -webkit-mask-image: linear-gradient(0deg, #000 0%, transparent 85%);
  mask-image: linear-gradient(0deg, #000 0%, transparent 85%);
  filter: blur(1px);
`;

// The caption floats on the slab's reflection, a smaller plate of the same glass.
const Info = styled(Plate)`
  position: relative;
  margin: -46px 18px 0;
  padding: 20px 24px 22px;
  border-radius: 20px;

  ${media.phone} {
    margin: -40px 8px 0;
  }
`;

const Name = styled.h3`
  font-size: clamp(2.6rem, 2.3vw, 3.2rem);
  font-weight: 300;
  letter-spacing: -0.015em;
  color: var(--heading);
`;

const Summary = styled.p`
  margin-top: 6px;
  max-width: 34em;
  font-size: 1.7rem;
  color: var(--text);
`;

const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 4px 13px 5px;
    border-radius: 999px;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--deep);
    background: linear-gradient(180deg, #ffffff 0%, #e4f6ff 49%, #cdeeff 50%, #e2f7ff 100%);
    border: 1px solid rgba(10, 127, 216, 0.4);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query SeaProjects {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        nodes {
          rawMarkdownBody
          frontmatter {
            title
            summary
            external
            tech
          }
        }
      }
    }
  `);

  return (
    <Stop
      id="projects"
      plate="rays"
      focus="50% 30%"
      rays={0.6}
      bubbles={12}
      labelledBy="projects-title">
      <Inner>
        <WaterTitle id="projects-title">Projects</WaterTitle>
        <Grid>
          {data.allMarkdownRemark.nodes.map(({ frontmatter: f, rawMarkdownBody }) => {
            const shot = SHOTS[f.title];
            const body = rawMarkdownBody.trim();
            return (
              <Item key={f.title}>
                {shot ? (
                  <>
                    <Slab
                      href={f.external}
                      {...external}
                      aria-label={`${f.title} (opens the site)`}>
                      <picture>
                        <source
                          type="image/webp"
                          srcSet={`${withPrefix(
                            `/sea/projects/${shot}-720.webp`,
                          )} 720w, ${withPrefix(`/sea/projects/${shot}-1280.webp`)} 1280w`}
                          sizes="(max-width: 896px) 92vw, 560px"
                        />
                        <img
                          src={withPrefix(`/sea/projects/${shot}-720.jpg`)}
                          width="1280"
                          height="800"
                          alt={`The ${f.title} home page`}
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </Slab>
                    <Mirror
                      aria-hidden="true"
                      style={{
                        backgroundImage: `url(${withPrefix(`/sea/projects/${shot}-720.webp`)})`,
                      }}
                    />
                  </>
                ) : null}
                <Info>
                  <Name>{f.title}</Name>
                  <Summary>{body || `${f.summary}.`}</Summary>
                  {f.tech && f.tech.length ? (
                    <Tags aria-label="Built with">
                      {f.tech.map(t => (
                        <li key={t}>{t}</li>
                      ))}
                    </Tags>
                  ) : null}
                </Info>
              </Item>
            );
          })}
        </Grid>
      </Inner>
    </Stop>
  );
};

export default Projects;
