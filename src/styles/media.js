// Breakpoints. Use inside a styled-components template: `${media.phone} { ... }`.
export const media = {
  phone: '@media (max-width: 36em)', // <= 576px
  short: '@media (max-height: 500px)',
  landscape: '@media (max-height: 500px) and (orientation: landscape) and (pointer: coarse)',
};

export default media;
