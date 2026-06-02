/**
 * Sprint 32 — self-host critical woff2 + wire homepage + visa-finder.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const FONT_DIR = path.join(ROOT, 'assets/fonts');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const CSS_URL =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetch(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
      .on('error', reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          fs.writeFileSync(dest, Buffer.concat(chunks));
          resolve(dest);
        });
      })
      .on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(FONT_DIR, { recursive: true });
  const css = await fetch(CSS_URL);
  const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1]);
  const names = ['space-grotesk-600.woff2', 'inter-400.woff2', 'jetbrains-mono-400.woff2'];
  for (let i = 0; i < urls.length && i < names.length; i++) {
    await download(urls[i], path.join(FONT_DIR, names[i]));
    console.log('saved', names[i]);
  }

  const fontsCss = `/* Self-hosted fonts — Sprint 32 LCP pilot */
@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:600;font-display:swap;src:url('/assets/fonts/space-grotesk-600.woff2') format('woff2')}
@font-face{font-family:'Inter';font-style:normal;font-weight:400;font-display:swap;src:url('/assets/fonts/inter-400.woff2') format('woff2')}
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:400;font-display:swap;src:url('/assets/fonts/jetbrains-mono-400.woff2') format('woff2')}
`;
  fs.writeFileSync(path.join(FONT_DIR, 'fonts-pilot.css'), fontsCss);

  const GOOGLE_BLOCK =
    /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[^>]*>\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin[^>]*>\s*\s*<link rel="preconnect" href="https:\/\/www\.google-analytics\.com"[^>]*>\s*<link rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>\s*<link href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>\s*<noscript>[\s\S]*?<\/noscript>/;

  const REPLACEMENT = `<link rel="preload" href="/assets/fonts/space-grotesk-600.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="/assets/fonts/fonts-pilot.css" />
<link rel="preconnect" href="https://www.google-analytics.com" />`;

  const PILOT = ['index.html', 'tools/visa-finder/index.html'];
  for (const rel of PILOT) {
    const file = path.join(ROOT, rel);
    let h = fs.readFileSync(file, 'utf8');
    if (h.includes('/assets/fonts/fonts-pilot.css')) {
      console.log('skip fonts', rel);
      continue;
    }
    if (GOOGLE_BLOCK.test(h)) {
      h = h.replace(GOOGLE_BLOCK, REPLACEMENT);
      fs.writeFileSync(file, h);
      console.log('fonts pilot', rel);
    } else {
      console.warn('pattern miss', rel);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
