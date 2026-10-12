import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';
import { useStaticQuery, graphql } from 'gatsby';
import config from '@config';

// https://www.gatsbyjs.com/docs/add-seo-component/

const SITE_NAME = 'Peter Shamoun';

// Person object from section 2.11 of the build plan. No address and no telephone, on purpose.
const personJsonLd = siteUrl => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: config.name,
  jobTitle: 'AI Engineer',
  worksFor: { '@type': 'Organization', name: 'Xifin' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of California San Diego' },
  url: siteUrl,
  sameAs: config.socialMedia.map(link => link.url),
  email: `mailto:${config.email}`,
});

const Head = ({ title, description, image }) => {
  const { pathname } = useLocation();

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            defaultTitle: title
            defaultDescription: description
            keywords
            siteUrl
            defaultImage: image
            twitterUsername
          }
        }
      }
    `,
  );

  const { defaultTitle, defaultDescription, keywords, siteUrl, defaultImage, twitterUsername } =
    site.siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  };

  return (
    <Helmet
      title={title}
      defaultTitle={seo.title}
      titleTemplate={`%s | ${SITE_NAME}`}
      script={[
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(personJsonLd(siteUrl)),
        },
      ]}>
      <html lang="en" />

      <meta name="description" content={seo.description} />
      <meta name="keywords" content={keywords} />
      <meta name="image" content={seo.image} />
      <link rel="canonical" href={seo.url} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      {twitterUsername ? <meta name="twitter:creator" content={twitterUsername} /> : null}
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
};

export default Head;

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Head.defaultProps = {
  title: null,
  description: null,
  image: null,
};
