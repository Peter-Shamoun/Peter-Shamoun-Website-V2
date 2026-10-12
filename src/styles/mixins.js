import { css } from 'styled-components';

// Raised edge: light on the top and left, shadow on the right and bottom.
export const bevel = css`
  border-style: solid;
  border-width: var(--bevel-w);
  border-color: var(--border-light-color) var(--border-shadow-color) var(--border-shadow-color)
    var(--border-light-color);
`;

// Pressed state for anything that already has the bevel.
export const bevelPressed = css`
  border-color: var(--border-shadow-color) var(--border-light-color) var(--border-light-color)
    var(--border-shadow-color);
  background-color: var(--window-active-color);
`;

// Sunken white panel.
export const inset = css`
  background: #fff;
  border-style: solid;
  border-width: var(--bevel-w);
  border-color: var(--border-shadow-color) var(--border-light-color) var(--border-light-color)
    var(--border-shadow-color);
`;

// Applied to every scroller.
export const retroScrollbar = css`
  &::-webkit-scrollbar {
    width: 30px;
    height: 30px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--scroll-thumb);
    border-radius: 1px;
    border-top: 1px solid white;
    border-left: 1px solid white;
    border-bottom: 1px solid var(--scroll-edge);
    border-right: 1px solid var(--scroll-edge);
    box-shadow: inset 2px 2px 2px rgba(255, 255, 255, 0.25), inset -2px -2px 2px rgba(0, 0, 0, 0.25);
  }
  &::-webkit-scrollbar-track {
    background-color: var(--scroll-track);
  }
  /* Firefox only: in Chromium a scrollbar-color value switches the rules above off. */
  @supports not selector(::-webkit-scrollbar) {
    scrollbar-color: var(--scroll-thumb) var(--scroll-track);
  }
`;

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;
