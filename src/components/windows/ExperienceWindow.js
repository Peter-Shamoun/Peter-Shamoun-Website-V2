import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Window, Heading, Lines, ExtLink } from '@components/desktop';

// Each job is its markdown file's company and one-line summary; the newest comes first.
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
              company
              url
              summary
            }
          }
        }
      }
    `,
  );

  return (
    <Window id="experience">
      <Heading>Work</Heading>
      <Lines>
        {data.allMarkdownRemark.nodes.map(({ id, frontmatter }) => (
          <li key={id}>
            <ExtLink href={frontmatter.url}>{frontmatter.company}</ExtLink>
            <span>{frontmatter.summary}</span>
          </li>
        ))}
      </Lines>
    </Window>
  );
};

export default ExperienceWindow;
