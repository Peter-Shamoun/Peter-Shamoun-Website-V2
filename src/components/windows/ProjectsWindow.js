import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Window, Lines, ExtLink } from '@components/desktop';

const ProjectsWindow = () => {
  const data = useStaticQuery(graphql`
    query ProjectsWindowQuery {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        nodes {
          frontmatter {
            title
            summary
            external
          }
        }
      }
    }
  `);

  return (
    <Window id="projects">
      <Lines>
        {data.allMarkdownRemark.nodes.map(({ frontmatter }) => (
          <li key={frontmatter.title}>
            <ExtLink href={frontmatter.external}>{frontmatter.title}</ExtLink>
            <span>{frontmatter.summary}</span>
          </li>
        ))}
      </Lines>
    </Window>
  );
};

export default ProjectsWindow;
