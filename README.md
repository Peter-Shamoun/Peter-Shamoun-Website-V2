# Peter Shamoun: personal website

The personal site of Peter Shamoun, live at [petershamoun.com](https://petershamoun.com), in the Frutiger Aero style of 2007. You scroll it like a dive. It opens in the air above a Maldives atoll, beside a large glass orb that hangs over the reef and shows the island upside down inside it (a WebGL shader that bends the photo through the glass). Below the waterline each section is a stop on the way down: About just under the waves, Experience over the sand with a turtle, Projects in the sun shafts, Research with the dolphins, the seven games in the deep blue, and Contact back up through a school of fish. Content sits on frosted glass plates; the games open in a glass dialog.

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

Experience and Projects come from two folders under `content/`.

- `content/jobs/`: one folder per role, newest first. Each `index.md` has `title`, `company`, `location`, `range`, `url` and `show`. Set `show: false` to hide a role. The bullets are the body.
- `content/featured/`: the projects, in `date` order. Each `index.md` has `title`, `external` (the link), `summary` and optionally `tech` and a body paragraph. The screenshot for each lives in `static/sea/projects/` and is named in `SHOTS` in `src/components/sea/Projects.js`.

The About, Research and Contact words are in their components in `src/components/sea/`; the email and profile links are in `src/config.js`.

## Games

The Games stop holds seven small games: Minesweeper, Solitaire, Snake, Tetris, Breakout, Pong and Space Invaders. All of them are written for this site, with no images, sounds or outside code. Each opens in a glass dialog.

- `src/components/games/<Name>.js`: one file per game. It is fetched only when it first opens.
- `src/components/games/kit.js`: the parts they share (the box that scales a game to fit the screen, the game loop, keys, best scores, buttons and readouts).
- `src/components/sea/games.js`: the list of games, their sizes and the hint on each tile. Add a game there and in `src/components/games/index.js`, and put a 400 px square frame of it in `static/sea/games/<id>.webp`.

Best scores are kept in the visitor's own browser and nowhere else.

## Analytics

Visits are counted with Vercel Web Analytics (no cookies) and page speed with Vercel Speed Insights. Both are read in the Vercel dashboard. The code
is in `src/components/tracking.js`.

Each interaction is sent as a custom event and also as a virtual page view, so it appears in the
Pages panel on Vercel's free plan. The address bar never changes. Virtual paths:

| Path                                            | Meaning                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `/`                                             | A real visit                                                                    |
| `/game/<id>`                                    | The visitor opened that game                                                    |
| `/click/email`                                  | Clicked an email link                                                           |
| `/click/file`, `/click/phone`                   | Opened another file on the site, clicked a phone link                           |
| `/out/<host>/<path>`                            | Clicked a link to another site                                                  |
| `/engaged/15s`, `/engaged/60s`, `/engaged/180s` | Kept the tab visible that long                                                  |
| `/from/<source>`                                | Arrived through a tagged link such as `https://petershamoun.com/?from=linkedin` |
| `/error/js`, `/error/promise`                   | A script error happened on the page                                             |

The `stop_reached` event (no virtual path) records how far down the page a visitor got.

Because of the virtual paths, the dashboard's total page-view number counts actions as well as
visits; the row for `/` is the number of real visits. Set `VIRTUAL_PAGEVIEWS` to `false` in
`tracking.js` to turn them off.

## Credits

- The code is forked from Brittany Chiang's [v4](https://github.com/bchiang7/v4) site, released under the MIT licence. The licence and both copyright notices are in [LICENSE](LICENSE).
- Typefaces: Segoe UI where it is installed, otherwise Open Sans (SIL Open Font License 1.1), shipped with the site.
- Photos: seven CC0 Unsplash photographs by Ibrahim Asad, Krystian Tambur, Jeremy Bishop, Talia Cohen, Matt Alaniz and Jakob Owens. Sources and licences for every outside file are in [static/sea/CREDITS.md](static/sea/CREDITS.md).
- Design: a homage to the Frutiger Aero look of 2004-2013. No real product logos or characters are used. The orb, bubbles, caustics and waterline are rendered for this site; their generators and the photo grading are in `design/sea/`, and the design notes in `.studio/DESIGN-PERFECT.md`.
