import React from 'react';
import PropTypes from 'prop-types';
import { Analytics } from '@vercel/analytics/react';
import { GlobalStyle } from '@styles';
import Head from './head';

const Layout = ({ children }) => (
  <>
    <Head />
    <GlobalStyle />
    <Analytics />

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
