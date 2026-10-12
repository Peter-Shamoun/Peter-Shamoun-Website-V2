# Peter Shamoun: personal website

The personal site of Peter Shamoun, live at [petershamoun.com](https://petershamoun.com). It is laid out as a 1990s desktop: a top bar, a few desktop icons, windows for About, Experience, Projects, Research and Contact, and a few popups.

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

Everything the windows show comes from three folders under `content/`.

- `content/jobs/`: one folder per role, newest first. Each `index.md` has `title`, `company`, `location`, `range`, `url` and `show`. Set `show: false` to hide a role. The bullets are the body.
- `content/featured/`: the two featured projects in the Projects window. Each has `title`, `period`, `cover` (an image in the same folder), `external` or `github`, and `tech`. The body is the description.
- `content/projects/`: one Markdown file per entry in "Also on GitHub". Set `showInProjects: false` to hide an entry.

## Credits

- The code is forked from Brittany Chiang's [v4](https://github.com/bchiang7/v4) site, released under the MIT licence. The licence and both copyright notices are in [LICENSE](LICENSE).
- Typefaces: Web437 DOS/V re ANK16 and ANK24 by VileR, from The Ultimate Oldschool PC Font Pack ([int10h.org](https://int10h.org/oldschool-pc-fonts/)), licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Silkscreen by Jason Kottke, under the SIL Open Font License 1.1.
- Design: a homage to late-1990s desktop operating systems and to the fake-desktop design of thestrokes.com. The site is not affiliated with or endorsed by The Strokes. All artwork and text here are original.
