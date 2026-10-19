/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react');

// Without JavaScript the page still reads top to bottom. Two things need it: the phone menu
// button (so the menu sheet shows open instead) and the games (their tiles dim).
const NO_JS_CSS = [
  '[data-menu]{display:none!important}',
  '#nav-sheet[hidden]{display:none!important}',
  '@media (max-width:56em){#nav-sheet[hidden]{display:grid!important}}',
  '[data-arcade-tile]{pointer-events:none;opacity:.55}',
].join('');

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <noscript key="no-js-fallback">
      <style dangerouslySetInnerHTML={{ __html: NO_JS_CSS }} />
    </noscript>,
    <link
      key="hero-preload"
      rel="preload"
      as="image"
      type="image/webp"
      imageSrcSet="/sea/hero/wide-1440.webp 1440w, /sea/hero/wide-1920.webp 1920w, /sea/hero/wide-2880.webp 2880w"
      imageSizes="100vw"
      media="(min-width: 720px)"
    />,
    <link
      key="hero-preload-phone"
      rel="preload"
      as="image"
      type="image/webp"
      imageSrcSet="/sea/hero/phone-780.webp 780w, /sea/hero/phone-1170.webp 1170w"
      imageSizes="100vw"
      media="(max-width: 719px)"
    />,
  ]);
};
