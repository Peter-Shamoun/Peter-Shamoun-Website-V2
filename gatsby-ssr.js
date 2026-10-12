/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react');

// Without JavaScript the desktop cannot open windows, so every window is drawn in normal
// page flow, the desktop furniture is hidden and the boot overlay is removed.
// Applies to every page; the 404 page's window is class "win", so it is not hidden.
const NO_JS_CSS = [
  '[data-window][hidden]{display:block!important;position:static!important;transform:none!important;width:auto!important;height:auto!important;max-height:none!important;margin:16px!important}',
  // Every <button> in a window opens or closes something with JS; the links are <a> and stay.
  '[data-window] .win__tabs,[data-window] button{display:none!important}',
  'body{overflow:auto!important}',
  'main#content{position:static!important;padding-top:0!important}',
  'main#content>:not([data-window]):not(.win){display:none!important}',
  '[data-boot]{display:none!important}',
  'body>#___gatsby footer{display:none!important}',
  // The top bar holds only buttons (reset, clock, site info), and none of them works without JS.
  'header[role=banner]{display:none!important}',
].join('');

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <noscript key="no-js-fallback">
      <style dangerouslySetInnerHTML={{ __html: NO_JS_CSS }} />
    </noscript>,
  ]);
};
