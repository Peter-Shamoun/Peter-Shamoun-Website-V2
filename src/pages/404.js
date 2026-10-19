import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { withPrefix } from 'gatsby';
import { Layout } from '@components';
import { Plate, GelLink } from '../components/sea/ui';

// Lost at sea: the open-water plate and one glass plate with the way back.

const Main = styled.main`
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px var(--gutter);

  picture,
  img {
    position: absolute;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:focus {
    outline: none;
  }
`;

const Card = styled(Plate)`
  max-width: 520px;
  text-align: center;
`;

const Code = styled.h1`
  font-size: clamp(7rem, 12vw, 11rem);
  font-weight: 300;
  letter-spacing: -0.04em;
  color: var(--heading);
`;

const Text = styled.p`
  margin: 8px 0 26px;
  font-size: 1.8rem;
  color: var(--text);
`;

const NotFoundPage = ({ location }) => (
  <Layout location={location}>
    <Helmet title="Page Not Found" meta={[{ name: 'robots', content: 'noindex' }]} />
    <Main id="content" tabIndex={-1}>
      <picture>
        <source type="image/webp" srcSet={withPrefix('/sea/plates/dolphins-1600.webp')} />
        <img src={withPrefix('/sea/plates/dolphins-1600.jpg')} alt="" />
      </picture>
      <Card>
        <Code>404</Code>
        <Text>This page drifted off. It may have moved, or it never existed.</Text>
        <GelLink href="/">Back to the surface</GelLink>
      </Card>
    </Main>
  </Layout>
);

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NotFoundPage;
