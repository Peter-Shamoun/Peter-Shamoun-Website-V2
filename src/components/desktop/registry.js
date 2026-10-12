// The one list of windows and desktop icons. Ids are used everywhere.

// w: width in px. maxH: CSS max-height. step: place in the opening cascade (0 is centred, each
// step is one title bar further down and to the right).
export const WINDOWS = [
  { id: 'about', title: 'About', w: 604, maxH: '64vh', step: 0 },
  { id: 'experience', title: 'Experience', w: 540, maxH: '60vh', step: 1 },
  { id: 'projects', title: 'Projects', w: 540, maxH: '60vh', step: 2 },
  { id: 'research', title: 'Research', w: 540, maxH: '60vh', step: 3 },
  { id: 'contact', title: 'Contact', w: 540, maxH: '60vh', step: 4 },
  { id: 'siteinfo', title: 'About this site', w: 540, maxH: '60vh', step: 5 },
];

// In the order they are shown: down the desktop column, and down the Start menu (which leaves
// the egg out).
export const DESKTOP_ICONS = [
  { key: 'about', label: 'About', kind: 'window', target: 'about', icon: 'IconAbout' },
  {
    key: 'experience',
    label: 'Experience',
    kind: 'window',
    target: 'experience',
    icon: 'IconExperience',
  },
  { key: 'projects', label: 'Projects', kind: 'window', target: 'projects', icon: 'IconProjects' },
  { key: 'research', label: 'Research', kind: 'window', target: 'research', icon: 'IconResearch' },
  { key: 'contact', label: 'Contact', kind: 'window', target: 'contact', icon: 'IconContact' },
  { key: 'egg', label: 'free_ram.exe', kind: 'egg', icon: 'IconEgg' },
];

export const getWindow = id => WINDOWS.find(w => w.id === id);
