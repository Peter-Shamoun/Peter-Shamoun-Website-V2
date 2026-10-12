import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Desktop } from '@components';

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <Desktop />
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
