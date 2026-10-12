// Promo popups. They never appear by themselves: free_ram.exe spawns them. Entry shape:
// { id, title, body, cta, href?, opensWindow?, art, w, h, hPhone? }
// h is the rendered desktop height in px, rounded up; placement uses it to stay above the taskbar.
// hPhone is the same for the 260px phone popup, where it has been measured.
// art is a key of ART in ./icons. w is the desktop width in px (phones use PHONE_W from
// ./placement). Each w is wide enough for the whole title to show in the title strip.
export const POPUPS = [
  {
    id: 'cheatsheet',
    title: 'FINALS WEEK DETECTED',
    body: 'Cheat Sheet AI generates personalized cheat sheets with fine-tuned LLMs. Serving 2,000+ users.',
    cta: 'VISIT CHEAT-SHEET-AI.COM',
    href: 'https://cheat-sheet-ai.com/',
    art: 'ArtCheatSheet',
    w: 300,
    h: 330,
    hPhone: 345,
  },
  {
    id: 'github',
    title: 'FREE SOURCE CODE!!!',
    body: 'It was always free. That is how GitHub works.',
    cta: 'BROWSE REPOS',
    href: 'https://github.com/Peter-Shamoun',
    art: 'ArtGithub',
    w: 240,
    h: 256,
  },
  {
    id: 'research',
    title: 'IS YOUR LLM BEHAVING?',
    body: 'I research AI safety at the HDSI Data Smith Lab: steering models away from harmful outputs with task vector algebra.',
    cta: 'READ MORE',
    opensWindow: 'research',
    art: 'ArtResearch',
    w: 300,
    h: 330,
  },
  {
    id: 'linkedin',
    title: '1 CONNECTION (PENDING YOU)',
    body: `Let's connect. No fax machine required.`,
    cta: 'OPEN LINKEDIN',
    href: 'https://www.linkedin.com/in/peter-shamoun',
    art: 'ArtLinkedin',
    w: 300,
    h: 290,
  },
  {
    id: 'mail',
    title: 'INBOX: 0 MESSAGES FROM YOU',
    body: 'Fix that. petershamoun80@gmail.com',
    cta: 'WRITE TO PETER',
    href: 'mailto:petershamoun80@gmail.com',
    art: 'ArtMail',
    w: 300,
    h: 290,
  },
  {
    id: 'ram',
    title: 'DOWNLOADING RAM: 0%',
    body: 'Still 0%. It will stay 0%. Try the Projects window instead.',
    cta: 'OPEN PROJECTS',
    opensWindow: 'projects',
    art: 'ArtRam',
    w: 300,
    h: 290,
  },
];

// The order free_ram.exe hands them out in: up to three per click.
export const EGG_POOL = ['linkedin', 'mail', 'ram', 'cheatsheet', 'github', 'research'];
