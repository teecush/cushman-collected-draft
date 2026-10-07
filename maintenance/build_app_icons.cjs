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
    for (const variant of [{size:512},{size:192},{size:180},{size:512,maskable:true}]) {
      const {size,maskable}=variant;
      const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
      let svg = fs.readFileSync(path.join(root, 'icons/cc-source.svg'), 'utf8');
      if(maskable) svg=svg.replace('<defs>', '<g transform="translate(256 256) scale(.75) translate(-256 -256)"><defs>').replace('</svg>\n','</g></svg>\n');
      await page.setContent(`<style>html,body{margin:0;width:100%;height:100%}svg{display:block;width:100%;height:100%}</style>${svg}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        const img = document.querySelector('image');
        await new Promise((resolve, reject) => {
          const probe = new Image(); probe.onload = resolve; probe.onerror = reject;
          probe.src = img.getAttribute('href');
        });
      });
      await page.screenshot({ path: path.join(root, `icons/cc-${maskable ? "maskable-" : ""}${size}.png`) });
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
