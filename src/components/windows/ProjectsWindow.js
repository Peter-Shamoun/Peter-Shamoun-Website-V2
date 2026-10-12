import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Window, Heading, Lines, ExtLink } from '@components/desktop';

// Empty strings and nulls from the markdown count as "no value".
const present = value => typeof value === 'string' && value.trim() !== '';

// One line per project: its name, linked to the live site (or the code), and a short summary.
const renderProject = node => {
  const { title, summary, external, github } = node.frontmatter;
  const href = present(external) ? external : github;

  return (
    <li key={title}>
      {present(href) ? <ExtLink href={href}>{title}</ExtLink> : <span>{title}</span>}
      <span>{summary}</span>
    </li>
  );
};

const ProjectsWindow = () => {
  const data = useStaticQuery(graphql`
    query ProjectsWindowQuery {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        nodes {
          frontmatter {
            title
            summary
            external
            github
          }
        }
      }
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        nodes {
          frontmatter {
            title
            summary
            external
            github
          }
        }
      }
    }
  `);

  return (
    <Window
      id="projects"
      footer={
        <>
          More at{' '}
          <ExtLink href="https://github.com/Peter-Shamoun">github.com/Peter-Shamoun</ExtLink>
        </>
      }>
      <Heading>Projects</Heading>
      <Lines>{[...data.featured.nodes, ...data.projects.nodes].map(renderProject)}</Lines>
    </Window>
  );
};

export default ProjectsWindow;
