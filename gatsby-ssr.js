/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react');

// Without JavaScript the desktop cannot open windows, so every window is drawn in normal
// page flow under the name, and the desktop furniture is hidden.
// Applies to every page; the 404 page's window is class "win", so it is not hidden.
const NO_JS_CSS = [
  '[data-window],[data-window][hidden]{display:flex!important;position:static!important;transform:none!important;width:auto!important;height:auto!important;max-height:none!important;margin:16px!important}',
  // Every <button> in a window opens or closes something with JS; the links are <a> and stay.
  '[data-window] button{display:none!important}',
  'body{overflow:auto!important}',
  'main#content{position:static!important}',
  'main#content>:not([data-window]):not(.win):not([data-wallpaper]){display:none!important}',
  '[data-wallpaper]{position:static!important;margin:16px!important;text-align:left!important}',
  // The taskbar holds only buttons (Start, the open windows, the clock), and none works without JS.
  '[data-taskbar]{display:none!important}',
].join('');

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <noscript key="no-js-fallback">
      <style dangerouslySetInnerHTML={{ __html: NO_JS_CSS }} />
    </noscript>,
  ]);
};
