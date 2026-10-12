// The one list of windows and desktop icons. Ids are used everywhere.

// w: width in px. maxH: CSS max-height. h: fixed height in px (optional).
// x, y: the window centre as a percentage of the viewport.
export const WINDOWS = [
  { id: 'about', title: 'About', tabLabel: 'About', w: 604, maxH: '64vh', x: 50, y: 50 },
  { id: 'experience', title: 'Experience', tabLabel: 'Work', w: 540, maxH: '60vh', x: 30, y: 50 },
  { id: 'projects', title: 'Projects', tabLabel: 'Projects', w: 540, maxH: '60vh', x: 70, y: 50 },
  { id: 'research', title: 'Research', tabLabel: 'Research', w: 540, maxH: '60vh', x: 43, y: 40 },
  { id: 'contact', title: 'Contact', tabLabel: 'Contact', w: 540, maxH: '60vh', x: 57, y: 58 },
  {
    id: 'siteinfo',
    title: 'About this site',
    tabLabel: null,
    w: 540,
    maxH: '360px',
    h: 360,
    x: 50,
    y: 50,
  },
];

export const TAB_ORDER = ['about', 'experience', 'projects', 'research', 'contact'];

// left / tabletLeft: percentage of the desktop width. phone: row 0 is the bottom row.
export const DESKTOP_ICONS = [
  {
    key: 'about',
    label: 'About',
    kind: 'window',
    target: 'about',
    icon: 'IconAbout',
    left: 2,
    tabletLeft: 2,
    phone: { row: 0, left: 8 },
  },
  {
    key: 'experience',
    label: 'Experience',
    kind: 'window',
    target: 'experience',
    icon: 'IconExperience',
    left: 12,
    tabletLeft: 19,
    phone: { row: 0, left: 32 },
  },
  {
    key: 'projects',
    label: 'Projects',
    kind: 'window',
    target: 'projects',
    icon: 'IconProjects',
    left: 22,
    tabletLeft: 36,
    phone: { row: 0, left: 55 },
  },
  {
    key: 'research',
    label: 'Research',
    kind: 'window',
    target: 'research',
    icon: 'IconResearch',
    left: 32,
    tabletLeft: 53,
    phone: { row: 1, left: 32 },
  },
  {
    key: 'contact',
    label: 'Contact',
    kind: 'window',
    target: 'contact',
    icon: 'IconContact',
    left: 42,
    tabletLeft: 70,
    phone: { row: 0, left: 78 },
  },
  {
    key: 'resume',
    label: 'Resume',
    kind: 'link',
    href: '/resume.pdf',
    icon: 'IconResume',
    left: 52,
    tabletLeft: 87,
    phone: { row: 1, left: 55 },
  },
  {
    key: 'egg',
    label: 'free_ram.exe',
    kind: 'egg',
    icon: 'IconEgg',
    left: 82,
    tabletLeft: 87,
    phone: null,
  },
];

export const getWindow = id => WINDOWS.find(w => w.id === id);
