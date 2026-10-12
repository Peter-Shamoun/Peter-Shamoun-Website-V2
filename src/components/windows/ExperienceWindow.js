import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import styled from 'styled-components';
import config from '@config';
import { media } from '@styles';
import { Window, Heading, ExtLink } from '@components/desktop';

// "Present" means the job is current. Otherwise show the last four-digit year in the range.
const statusFor = range => {
  const text = range || '';
  if (/present/i.test(text)) {
    return 'NOW';
  }
  const years = text.match(/\d{4}/g);
  return years ? years[years.length - 1] : '';
};

const StripHeading = styled(Heading)`
  margin: 0;
  padding: 1.6rem 2rem 1.2rem;
  border-bottom: 1px solid #ffffff;
`;

const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  padding: 1.4rem 2rem;
  border-bottom: 1px solid #ffffff;
  color: #ffffff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 14rem minmax(0, 1fr) auto;
  column-gap: 1.6rem;
  align-items: start;

  ${media.phone} {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.6rem;
    text-align: center;
  }
`;

const Range = styled.p`
  margin: 0;
  font-size: 16px;
  text-transform: uppercase;
  overflow-wrap: anywhere;
`;

const Details = styled.div`
  min-width: 0;
`;

const JobTitle = styled.h4`
  margin: 0;
  font: 24px/1.1 var(--main-large-font);
  letter-spacing: 1px;
  overflow-wrap: anywhere;
`;

const Meta = styled.p`
  margin: 0.4rem 0 0;
  font-size: 16px;
  text-transform: uppercase;
  overflow-wrap: anywhere;
`;

const Status = styled.p`
  margin: 0;
  font-size: 16px;
  text-transform: uppercase;
  white-space: nowrap;
`;

const Bullets = styled.div`
  margin-top: 1rem;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    position: relative;
    margin: 0 0 0.6rem;
    padding-left: 1.6rem;
    font-size: 16px;
    color: #cccccc;
  }

  li:last-child {
    margin-bottom: 0;
  }

  li::before {
    content: '-';
    position: absolute;
    left: 0;
  }
`;

const FooterLine = styled.p`
  margin: 0;
`;

const ExperienceWindow = () => {
  const data = useStaticQuery(
    graphql`
      query ExperienceJobs {
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
              location
              range
              url
            }
            html
          }
        }
      }
    `,
  );

  const jobs = data.allMarkdownRemark.nodes;

  return (
    <Window
      id="experience"
      dark
      flush
      footer={
        <FooterLine>
          Full history: <ExtLink href={config.resumeUrl}>Resume.pdf</ExtLink>
        </FooterLine>
      }>
      <StripHeading>Where I've worked</StripHeading>
      <List>
        {jobs.map(({ id, frontmatter, html }) => (
          <Row key={id}>
            <Grid>
              <Range>{frontmatter.range}</Range>
              <Details>
                <JobTitle>{frontmatter.title}</JobTitle>
                <Meta>
                  <ExtLink href={frontmatter.url}>{frontmatter.company}</ExtLink>
                </Meta>
                <Meta>{frontmatter.location}</Meta>
              </Details>
              <Status>{statusFor(frontmatter.range)}</Status>
            </Grid>
            <Bullets dangerouslySetInnerHTML={{ __html: html }} />
          </Row>
        ))}
      </List>
    </Window>
  );
};

export default ExperienceWindow;
