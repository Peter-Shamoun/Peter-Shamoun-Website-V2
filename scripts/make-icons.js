/**
 * Writes src/images/logo.png, a 512x512 pixel monitor, from the inline SVG below.
 * The manifest plugin reads that file, so favicons and manifest icons follow at build time.
 *
 * Run once with Node 18 from the repo root:
 *   node scripts/make-icons.js
 *
 * The SVG is drawn on a 32 x 32 pixel grid with whole-number coordinates, so every
 * pixel lands on an exact 16 x 16 block at 512 px.
 */
const path = require('path');
const sharp = require('sharp');

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="23" fill="#000000"/>
  <rect x="3" y="3" width="26" height="21" fill="#CCCCCC"/>
  <rect x="3" y="3" width="26" height="1" fill="#FFFFFF"/>
  <rect x="3" y="3" width="1" height="21" fill="#FFFFFF"/>
  <rect x="3" y="23" width="26" height="1" fill="#707070"/>
  <rect x="28" y="3" width="1" height="21" fill="#707070"/>
  <rect x="6" y="6" width="20" height="14" fill="#000000"/>
  <rect x="7" y="7" width="18" height="12" fill="#0B17B4"/>
  <rect x="10" y="9" width="11" height="7" fill="#FFFFFF"/>
  <rect x="10" y="9" width="11" height="2" fill="#011E75"/>
  <rect x="13" y="25" width="6" height="2" fill="#707070"/>
  <rect x="9" y="27" width="14" height="2" fill="#333333"/>
</svg>`;

const OUT = path.join(__dirname, '..', 'src', 'images', 'logo.png');

sharp(Buffer.from(SVG))
  .png({ compressionLevel: 9 })
  .toFile(OUT)
  .then(info => {
    process.stdout.write(`Wrote ${OUT} (${info.width}x${info.height}, ${info.size} bytes)\n`);
  })
  .catch(err => {
    process.stderr.write(`Could not write the icon: ${err}\n`);
    process.exitCode = 1;
  });
