// Breakpoints. Use inside a styled-components template: `${media.phone} { ... }`.
export const media = {
  phone: '@media (max-width: 36em)', // <= 576px
  tablet: '@media (min-width: 36.0625em) and (max-width: 64em)', // 577-1024px
  desktopOnly: '@media (min-width: 64.0625em)', // >= 1025px
  landscape: '@media (max-height: 500px) and (orientation: landscape) and (pointer: coarse)',
  reduced: '@media (prefers-reduced-motion: reduce)',
};

export default media;
