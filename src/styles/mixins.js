import { css } from 'styled-components';

// The dive's materials (.studio/DESIGN-PERFECT.md, Materials).

// A frosted glass plate floating in the water: white fill, a bright band across the top that
// stops hard, a cyan glow inside the bottom edge, a white inner edge. Pair with a radius.
export const plate = css`
  position: relative;
  isolation: isolate;
  background-color: var(--plate-fill);
  background-image: var(--plate-sheen), var(--plate-glow);
  background-size: 100% 190px, 100% 100%;
  background-repeat: no-repeat;
  -webkit-backdrop-filter: blur(22px) saturate(170%);
  backdrop-filter: blur(22px) saturate(170%);
  border: 1px solid var(--plate-rim);
  box-shadow: inset 0 0 0 1px var(--plate-edge), inset 0 -10px 24px -14px rgba(60, 220, 255, 0.7),
    var(--plate-shadow);

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background-color: var(--plate-fill-solid);
  }

  @media (prefers-reduced-transparency: reduce) {
    background-color: var(--plate-fill-solid);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
`;

// The games' message boxes use this name.
export const glass = plate;

// A small glossy push button: white gel with a split gloss. Hover and pressed built in.
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

// The big gel pills. $tone: 'aqua' (default) or 'lime'. The gloss cap is ::before, the bottom
// glow ::after, so the label can be any element.
export const gel = css`
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 28px;
  border-radius: var(--radius-ctl);
  font: 600 1.7rem/1 var(--main-font);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  overflow: hidden;
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0, 50, 110, 0.55);
  border: 1px solid #0b5c96;
  background: linear-gradient(180deg, #59c9ff 0%, #1d9fe8 50%, #0a7fd0 51%, #23b4f0 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -6px 14px -4px rgba(140, 250, 255, 0.9), 0 10px 24px -8px rgba(0, 60, 140, 0.6),
    0 0 0 4px rgba(255, 255, 255, 0.22);
  transition: transform var(--dur-hover) var(--ease-out), filter var(--dur-hover) var(--ease-out),
    box-shadow var(--dur-hover) var(--ease-out);

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    left: 6px;
    right: 6px;
    top: 2px;
    height: 48%;
    border-radius: 999px 999px 40% 40% / 999px 999px 18px 18px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.18));
    pointer-events: none;
  }

  &:hover {
    filter: brightness(1.08) saturate(1.08);
    transform: translateY(-1px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85),
      inset 0 -8px 16px -4px rgba(160, 252, 255, 1), 0 14px 30px -8px rgba(0, 60, 140, 0.65),
      0 0 0 4px rgba(255, 255, 255, 0.32);
  }

  &:active {
    transform: translateY(1px) scale(0.985);
    filter: brightness(0.96);
  }

  ${props =>
    props.$tone === 'lime' &&
    css`
      color: #183d02;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.55);
      border-color: #3c8a0c;
      background: linear-gradient(180deg, #d4ff7a 0%, #a6ea34 50%, #7fcf12 51%, #b4f040 100%);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85),
        inset 0 -6px 14px -4px rgba(235, 255, 160, 1), 0 10px 24px -8px rgba(30, 90, 0, 0.6),
        0 0 0 4px rgba(255, 255, 255, 0.22);

      &:hover {
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9),
          inset 0 -8px 16px -4px rgba(240, 255, 170, 1), 0 14px 30px -8px rgba(30, 90, 0, 0.6),
          0 0 0 4px rgba(255, 255, 255, 0.32);
      }
    `}
`;

// A white content field.
export const field = css`
  background: var(--field);
  border: 1px solid var(--field-edge);
  border-radius: 2px;
  box-shadow: inset 0 1px 2px rgba(0, 30, 60, 0.08);
`;

// Keyboard focus on light glass: a blue ring with a soft halo.
export const focusRing = css`
  &:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 3px;
    box-shadow: 0 0 0 6px rgba(24, 195, 232, 0.28);
  }
`;

// Keyboard focus over a photograph: a lime ring that reads on blue water and white cloud.
export const focusOnWater = css`
  &:focus-visible {
    outline: 3px solid var(--focus-on-water);
    outline-offset: 3px;
    box-shadow: 0 0 0 7px rgba(3, 35, 90, 0.45);
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
