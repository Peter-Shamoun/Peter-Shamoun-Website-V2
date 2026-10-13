# Peter Shamoun: personal website

The personal site of Peter Shamoun, live at [petershamoun.com](https://petershamoun.com). It is laid out as a calm 1990s desktop: the Windows XP hill-and-sky wallpaper, a column of desktop icons, a taskbar with a Start menu and a clock along the bottom, and grey bevelled windows for About, Experience, Projects, Research and Contact.

Built with [Gatsby](https://www.gatsbyjs.org/) 3, React 17 and styled-components. Content is kept in Markdown files.

## Build and run

Gatsby 3 needs Node 18 and the legacy OpenSSL provider.

```sh
source ~/.nvm/nvm.sh && nvm use 18.20.6
export NODE_OPTIONS=--openssl-legacy-provider

npm install            # first time only
npx gatsby develop     # dev server, or: npm start
npx gatsby clean && npx gatsby build
npx gatsby serve       # preview the production build, or: npm run serve
```

## Content

Everything the windows show comes from two folders under `content/`.

- `content/jobs/`: one folder per role, newest first. Each `index.md` has `title`, `company`, `location`, `range`, `url` and `show`. Set `show: false` to hide a role. The bullets are the body.
- `content/featured/`: the projects in the Projects window, in `date` order. Each `index.md` has `title`, `external` (the link) and `summary` (the short phrase).

## Games

The Games folder on the desktop holds seven small games, each in its own window: Minesweeper, Solitaire, Snake, Blocks, Bricks, Paddle and Invaders. All of them are written for this site, with no images, sounds or outside code.

- `src/components/games/<Name>.js`: one file per game. It is fetched only when its window first opens.
- `src/components/games/kit.js`: the parts they share (the box that scales a game to fit a phone, the game loop, keys, best scores, buttons and readouts).
- `GAME_LIST` in `src/components/desktop/registry.js`: the list of games, their icons and sizes. Add a game there and in `src/components/games/index.js`.

Best scores are kept in the visitor's own browser and nowhere else.

## Analytics

Visits are counted with Vercel Web Analytics (no cookies) and page speed with Vercel Speed Insights. Both are read in the Vercel dashboard. The code
is in `src/components/tracking.js`.

Each interaction is sent as a custom event and also as a virtual page view, so it appears in the
Pages panel on Vercel's free plan. The address bar never changes. Virtual paths:

| Path                                            | Meaning                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `/`                                             | A real visit                                                                    |
| `/window/<id>`                                  | The visitor opened that window (About, open on arrival, is not counted)         |
| `/click/email`                                  | Clicked an email link                                                           |
| `/click/file`, `/click/phone`                   | Opened another file on the site, clicked a phone link                           |
| `/out/<host>/<path>`                            | Clicked a link to another site                                                  |
| `/popup/<id>`                                   | Clicked the button in a popup (popups only come from `free_ram.exe`)            |
| `/egg/click`, `/egg/bluescreen`                 | Clicked `free_ram.exe`, reached the blue screen                                 |
| `/engaged/15s`, `/engaged/60s`, `/engaged/180s` | Kept the tab visible that long                                                  |
| `/from/<source>`                                | Arrived through a tagged link such as `https://petershamoun.com/?from=linkedin` |
| `/panel/world-time`, `/panel/start`             | Opened the clock panel, opened the Start menu                                   |
| `/click/reset`                                  | Chose "Tidy desktop" in the Start menu                                          |
| `/error/js`, `/error/promise`                   | A script error happened on the page                                             |

Because of the virtual paths, the dashboard's total page-view number counts actions as well as
visits; the row for `/` is the number of real visits. Set `VIRTUAL_PAGEVIEWS` to `false` in
`tracking.js` to turn them off.

## Credits

- The code is forked from Brittany Chiang's [v4](https://github.com/bchiang7/v4) site, released under the MIT licence. The licence and both copyright notices are in [LICENSE](LICENSE).
- Typefaces: Web437 DOS/V re ANK16 and ANK24 by VileR, from The Ultimate Oldschool PC Font Pack ([int10h.org](https://int10h.org/oldschool-pc-fonts/)), licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Silkscreen by Jason Kottke, under the SIL Open Font License 1.1.
- Design: a homage to late-1990s desktop operating systems and to the fake-desktop design of thestrokes.com. The site is not affiliated with or endorsed by The Strokes. All artwork and text here are original.
