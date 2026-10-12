import React from 'react';
import PropTypes from 'prop-types';
import { GlobalStyle } from '@styles';
import Head from './head';
import SiteAnalytics from './tracking';

const Layout = ({ children }) => (
  <>
    <Head />
    <GlobalStyle />
    <SiteAnalytics />

    <a className="skip-link" href="#content">
      Skip to content
    </a>

    {children}
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object,
};

export default Layout;
