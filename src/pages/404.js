import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { Layout } from '@components';
import { BevelLink, Text } from '@components/desktop/ui';

// The Aero wallpaper with one static glass window. There is no desktop state on this page,
// so the window is drawn with the shared window classes, not with the Window component.

const Main = styled.main`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.6rem;
  overflow: auto;

  &:focus {
    outline: none;
  }
`;

const Content = styled.div`
  padding: 2rem 0.5rem 1.6rem;
  text-align: center;
`;

const Code = styled.h1`
  margin: 0 0 12px;
  font: 300 64px/1 var(--main-large-font);
  color: var(--heading);
  letter-spacing: 0;
`;

const NotFoundPage = ({ location }) => (
  <Layout location={location}>
    <Helmet title="Page Not Found" meta={[{ name: 'robots', content: 'noindex' }]} />
    <Main id="content" tabIndex={-1}>
      <section className="win win--static is-active" aria-labelledby="error-window-title">
        <header className="win__titlebar">
          <div className="win__title" id="error-window-title">
            Error
          </div>
        </header>
        <div className="win__body">
          <div className="win__area">
            <Content>
              <Code>404</Code>
              <Text>
                This file is not on the disk. It may have been moved, renamed, or never existed.
              </Text>
              <BevelLink href="/">Back to desktop</BevelLink>
            </Content>
          </div>
        </div>
      </section>
    </Main>
  </Layout>
);

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NotFoundPage;
