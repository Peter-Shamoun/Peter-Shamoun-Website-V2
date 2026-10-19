import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Sea } from '@components';

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <Sea />
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
