// node design/sea/render-hero.js <out.png> <w> <h> [dpr] [t] [img]
/* eslint-disable no-console */
// Serves the repo root, opens render-hero.html in Chrome and saves the canvas as a PNG.
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const [, , out, w, h, dpr = '1', t = '2', img = '/static/sea/plates/above-2400.jpg'] = process.argv;
const root = path.resolve(__dirname, '../..');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png': 'image/png',
};
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
server.listen(0, async () => {
  const port = server.address().port;
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage();
  page.on('console', m => console.log('console:', m.text()));
  page.on('pageerror', e => console.log('pageerror:', e.message));
  await page.setViewport({ width: +w, height: +h, deviceScaleFactor: +dpr });
  await page.goto(
    `http://localhost:${port}/design/sea/render-hero.html?w=${w}&h=${h}&dpr=${dpr}&t=${t}&img=${img}`,
  );
  await page.waitForFunction('window.__done === true', { timeout: 60000 });
  const data = await page.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
  console.log('saved', out);
  await browser.close();
  server.close();
});
