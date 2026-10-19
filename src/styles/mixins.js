import { css } from 'styled-components';

// The Frutiger Aero materials (.studio/DESIGN-MAXIMAL.md, Materials).

// Aero glass: the window frame, the Start menu, flyouts. Pair with a radius.
export const glass = css`
  background-color: var(--glass-tint);
  background-image: var(--glass-streaks), var(--glass-sheen);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  border: 1px solid var(--glass-edge);
  box-shadow: inset 0 0 0 1px var(--glass-hi), var(--shadow-win);

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background-color: var(--glass-tint-solid);
  }
`;

// The same sheet when it is not in front: clearer, flatter, smaller shadow.
export const glassInactive = css`
  background-color: var(--glass-tint-inactive);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5), var(--shadow-win-inactive);
`;

// Windows 7 push button. Hover and pressed are built in.
export const gloss = css`
  border: 1px solid var(--btn-edge);
  border-radius: var(--radius-ctl);
  background: var(--btn-face);
  color: var(--text);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.75);
  transition: background var(--dur-hover) var(--ease-out),
    border-color var(--dur-hover) var(--ease-out);

  &:hover {
    border-color: var(--btn-edge-hover);
    background: var(--btn-face-hover);
  }
`;

export const glossPressed = css`
  border-color: var(--btn-edge-down);
  background: var(--btn-face-down);
  box-shadow: inset 0 1px 3px rgba(0, 40, 80, 0.35);
  transition: none;
`;

// Primary action: an aqua gel pill. Use at most once per window.
export const glossAqua = css`
  border: 1px solid #0b5c96;
  border-radius: 999px;
  background: linear-gradient(180deg, #8fdcff 0%, #3cb2f0 48%, #1690dc 50%, #34b6f2 100%);
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 50, 100, 0.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 1px 3px rgba(0, 60, 120, 0.35);

  &:hover {
    filter: brightness(1.08) saturate(1.1);
  }
`;

// A white content field (replaces sunken / inset).
export const field = css`
  background: var(--field);
  border: 1px solid var(--field-edge);
  border-radius: 2px;
  box-shadow: inset 0 1px 2px rgba(0, 30, 60, 0.08);
`;

// A thin divider well (replaces sunkenThin): the status bar, the clock tray.
export const fieldThin = css`
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-ctl);
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.18);
`;

// Explorer-style row highlight: Start menu rows, folder entries, hovered icons on white.
export const hotTrack = css`
  border: 1px solid var(--hot-edge);
  border-radius: 12px;
  background: var(--hot-fill);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
`;

export const hotTrackStrong = css`
  border: 1px solid var(--hot-edge-strong);
  border-radius: 12px;
  background: var(--hot-fill-strong);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
`;

// Keyboard focus: a soft blue ring. Never remove focus without this.
export const focusRing = css`
  &:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(31, 142, 232, 0.25);
  }
`;

// Windows 7 scrollbar for every scroller.
export const aeroScrollbar = css`
  &::-webkit-scrollbar {
    width: 14px;
    height: 14px;
  }
  &::-webkit-scrollbar-track,
  &::-webkit-scrollbar-corner {
    background: linear-gradient(90deg, #e6ecf2, #f5f8fb);
  }
  &::-webkit-scrollbar-thumb {
    border: 1px solid #9aa9b8;
    border-radius: 4px;
    background: linear-gradient(90deg, #f4f7fa 0%, #e3e9ef 50%, #d5dee7 100%);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  }
  &::-webkit-scrollbar-thumb:hover {
    border-color: var(--btn-edge-hover);
    background: linear-gradient(90deg, #eaf6fd 0%, #c8e8fb 50%, #a7d9f5 100%);
  }
  @supports not selector(::-webkit-scrollbar) {
    scrollbar-color: #b8c6d4 #eef3f7;
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

// legacy XP names, delete in cleanup
export const bevel = gloss;
export const bevelPressed = glossPressed;
export const bevelWindow = glass;
export const sunken = field;
export const sunkenThin = fieldThin;
export const inset = css`
  padding: 2px;
  ${field};
`;
export const focusRect = focusRing;
export const retroScrollbar = aeroScrollbar;
