import React from 'react';
import styled from 'styled-components';
import { graphql, useStaticQuery } from 'gatsby';
import {
  Window,
  Heading,
  SubHeading,
  TagList,
  ButtonRow,
  BevelLink,
  ExtLink,
} from '@components/desktop';

// Empty strings and nulls from the markdown count as "no value".
const present = value => typeof value === 'string' && value.trim() !== '';

const Article = styled.article`
  margin: 0 0 1.6rem;
`;

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  column-gap: 1rem;
  margin: 1.6rem 0 0.8rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--bevel-shadow);
`;

const ArticleTitle = styled(SubHeading)`
  margin: 0;
  border: 0;
  padding: 0;
`;

const Period = styled.span`
  font: 16px/1.25 var(--main-font);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
`;

// Markdown body HTML. A div, because the markdown already wraps its text in <p>.
const Body = styled.div`
  font-size: 16px;
  line-height: 1.5;
  overflow-wrap: anywhere;

  p {
    margin: 0 0 1.2rem;
    font-size: 16px;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Entry = styled.li`
  padding: 1rem 0;
  font-size: 16px;
  border-bottom: 1px solid var(--bevel-light);

  p {
    margin: 0 0 0.8rem;
    font-size: 16px;
  }
`;

const EntryTitle = styled.h5`
  margin: 0 0 0.4rem;
  font: 16px/1.25 var(--main-font);
  font-weight: normal;
  text-transform: uppercase;
`;

const EntryLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.2rem;
  row-gap: 0.4rem;
  font-size: 16px;
`;

// Plain render functions (not components) so each markdown node is read directly.
const renderFeatured = node => {
  const { title, period, external, github, tech } = node.frontmatter;
  const hasExternal = present(external);
  const hasGithub = present(github);
  const tags = Array.isArray(tech) ? tech : [];
  const liveLabel = hasExternal && external.includes('github.io') ? 'Open app' : 'Visit site';

  return (
    <Article key={title}>
      <TitleRow>
        <ArticleTitle>{title}</ArticleTitle>
        {present(period) ? <Period>{period}</Period> : null}
      </TitleRow>
      <Body dangerouslySetInnerHTML={{ __html: node.html || '' }} />
      {tags.length > 0 ? (
        <TagList>
          {tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </TagList>
      ) : null}
      {hasExternal || hasGithub ? (
        <ButtonRow>
          {hasExternal ? <BevelLink href={external}>{liveLabel}</BevelLink> : null}
          {hasGithub ? <BevelLink href={github}>Source</BevelLink> : null}
        </ButtonRow>
      ) : null}
    </Article>
  );
};

const renderEntry = node => {
  const { title, github, external, tech } = node.frontmatter;
  const hasExternal = present(external);
  const hasGithub = present(github);
  const tags = Array.isArray(tech) ? tech : [];

  return (
    <Entry key={title}>
      <EntryTitle>{title}</EntryTitle>
      <Body dangerouslySetInnerHTML={{ __html: node.html || '' }} />
      {tags.length > 0 ? (
        <TagList>
          {tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </TagList>
      ) : null}
      {hasGithub || hasExternal ? (
        <EntryLinks>
          {hasGithub ? <ExtLink href={github}>GitHub</ExtLink> : null}
          {hasExternal ? <ExtLink href={external}>Live</ExtLink> : null}
        </EntryLinks>
      ) : null}
    </Entry>
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
          html
          frontmatter {
            title
            period
            external
            github
            tech
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
          html
          frontmatter {
            title
            github
            external
            tech
          }
        }
      }
    }
  `);

  const featured = data.featured.nodes;
  const projects = data.projects.nodes;

  return (
    <Window
      id="projects"
      footer={
        <>
          More at{' '}
          <ExtLink href="https://github.com/Peter-Shamoun">github.com/Peter-Shamoun</ExtLink>
        </>
      }>
      <Heading>Things I&apos;ve built</Heading>
      {featured.map(renderFeatured)}
      <SubHeading>Also on GitHub</SubHeading>
      <List>{projects.map(renderEntry)}</List>
    </Window>
  );
};

export default ProjectsWindow;
