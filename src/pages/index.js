import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { withPrefix } from 'gatsby';
import { Layout } from '@components';
import { Plate } from '../components/sea/ui';

// Under maintenance: the open-water plate and one glass plate with the notice.
// The full site lives in the Sea component; restore it by reverting this file.

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

const Title = styled.h1`
  font-size: clamp(3.6rem, 6vw, 5.6rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: var(--heading);
`;

const Text = styled.p`
  margin: 12px 0 0;
  font-size: 1.8rem;
  color: var(--text);
`;

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <Helmet title="Under Maintenance" />
    <Main id="content" tabIndex={-1}>
      <picture>
        <source type="image/webp" srcSet={withPrefix('/sea/plates/dolphins-1600.webp')} />
        <img src={withPrefix('/sea/plates/dolphins-1600.jpg')} alt="" />
      </picture>
      <Card>
        <Title>Under maintenance</Title>
        <Text>The site is being worked on and will be back soon.</Text>
      </Card>
    </Main>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
