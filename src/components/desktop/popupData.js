// Promo popups. Copy is final (BUILD_PLAN section 2.8). Entry shape:
// { id, title, body, cta, href?, opensWindow?, art, w, h, hPhone?, auto: [viewport classes] }
// h is the rendered desktop height in px, rounded up; placement uses it to keep the icon row clear.
// hPhone is the same for the 260px phone popup (only the popup that phones show has one).
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
    auto: ['desktop', 'tablet', 'phone'],
  },
  {
    id: 'graph',
    title: 'SHORTEST PATH FOUND',
    body: `Graph Theory Visualizer: an interactive D3.js web app that visualizes BFS, DFS and Dijkstra's. Used as a teaching tool in UC San Diego's DSC 40B.`,
    cta: 'RUN IT',
    href: 'https://peter-shamoun.github.io/Graph-Theory/',
    art: 'ArtGraph',
    w: 300,
    h: 350,
    auto: ['desktop', 'tablet'],
  },
  {
    id: 'resume',
    title: 'RESUME.PDF HAS ARRIVED',
    body: 'One page. Zero viruses. Opens in a new tab.',
    cta: 'OPEN RESUME',
    href: '/resume.pdf',
    art: 'ArtResume',
    w: 260,
    h: 268,
    auto: ['desktop', 'tablet'],
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
    auto: ['desktop'],
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
    auto: ['desktop'],
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
    auto: [],
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
    auto: [],
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
    auto: [],
  },
];

// Popups that appear by themselves, in order, per viewport class.
export const AUTO = {
  desktop: ['cheatsheet', 'graph', 'resume', 'github', 'research'],
  tablet: ['cheatsheet', 'graph', 'resume'],
  phone: ['cheatsheet'],
};
