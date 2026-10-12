import React from 'react';
import PropTypes from 'prop-types';

// Gatsby's default document with one change: the viewport tag carries viewport-fit=cover,
// so the page has a single viewport meta. The theme-color meta comes from the manifest plugin.
const HTML = ({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  body,
  postBodyComponents,
}) => (
  // lang="en" arrives in htmlAttributes from the Helmet in head.js.
  // eslint-disable-next-line jsx-a11y/html-has-lang
  <html {...htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      {headComponents}
    </head>
    <body {...bodyAttributes}>
      {preBodyComponents}
      <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
      {postBodyComponents}
    </body>
  </html>
);

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};

export default HTML;
