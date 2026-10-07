/* Render the existing portrait + CC vector composition as home-screen PNGs.
   Requires Playwright and Chrome. PLAYWRIGHT_MODULE / CHROME_PATH may override local defaults. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    for (const size of [512, 192, 180]) {
      const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
      const svg = fs.readFileSync(path.join(root, 'icons/cc-source.svg'), 'utf8');
      await page.setContent(`<style>html,body{margin:0;width:100%;height:100%}svg{display:block;width:100%;height:100%}</style>${svg}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        const img = document.querySelector('image');
        await new Promise((resolve, reject) => {
          const probe = new Image(); probe.onload = resolve; probe.onerror = reject;
          probe.src = img.getAttribute('href');
        });
      });
      await page.screenshot({ path: path.join(root, `icons/cc-${size}.png`) });
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
