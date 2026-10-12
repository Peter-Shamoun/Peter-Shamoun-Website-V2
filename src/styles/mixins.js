import { css } from 'styled-components';

// The classic two-pixel edges, drawn as inset shadows so the dark lines run the full length of
// the bottom and right sides. A shadow sits under the content, so anything with one of these
// needs at least 2px of padding (1px for the thin ones).

// Raised edge of a button.
export const bevel = css`
  border: 0;
  border-radius: 0;
  box-shadow: inset -1px -1px var(--bevel-dark), inset 1px 1px var(--bevel-hi),
    inset -2px -2px var(--bevel-shadow), inset 2px 2px var(--bevel-light);
`;

// Raised edge of a window frame: the two light lines are the other way round.
export const bevelWindow = css`
  border: 0;
  border-radius: 0;
  box-shadow: inset -1px -1px var(--bevel-dark), inset 1px 1px var(--bevel-light),
    inset -2px -2px var(--bevel-shadow), inset 2px 2px var(--bevel-hi);
`;

// Pressed state for anything that already has the bevel.
export const bevelPressed = css`
  box-shadow: inset -1px -1px var(--bevel-hi), inset 1px 1px var(--bevel-dark),
    inset -2px -2px var(--bevel-light), inset 2px 2px var(--bevel-shadow);
`;

// Sunken edge of a field.
export const sunken = css`
  border: 0;
  border-radius: 0;
  box-shadow: inset -1px -1px var(--bevel-hi), inset 1px 1px var(--bevel-shadow),
    inset -2px -2px var(--bevel-light), inset 2px 2px var(--bevel-dark);
`;

// One-pixel sunken edge: the status bar and the tray.
export const sunkenThin = css`
  border: 0;
  border-radius: 0;
  box-shadow: inset -1px -1px var(--bevel-hi), inset 1px 1px var(--bevel-shadow);
`;

// Sunken white panel.
export const inset = css`
  padding: 2px;
  background: var(--field);
  ${sunken};
`;

// The focus rectangle of a control that sits on grey chrome.
export const focusRect = css`
  &:focus-visible {
    outline: 1px dotted var(--text);
    outline-offset: -4px;
  }
`;

// Applied to every scroller.
export const retroScrollbar = css`
  &::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--chrome);
    ${bevel};
  }
  &::-webkit-scrollbar-track,
  &::-webkit-scrollbar-corner {
    background-color: var(--chrome);
  }
  /* Firefox only: in Chromium a scrollbar-color value switches the rules above off. */
  @supports not selector(::-webkit-scrollbar) {
    scrollbar-color: var(--bevel-shadow) var(--chrome);
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
