/**
 * Sprint 33 — replace Google Fonts with self-hosted assets on all HTML pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const FONT_HEAD = `<link rel="preload" href="/assets/fonts/space-grotesk-600.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="/assets/fonts/fonts.css" />
`;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'node_modules' || e.name === 'functions') continue;
      walk(p, acc);
    } else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function patchFonts(html) {
  if (html.includes('/assets/fonts/fonts.css')) {
    if (html.includes('fonts-pilot.css')) {
      return html.replace(/\/assets\/fonts\/fonts-pilot\.css/g, '/assets/fonts/fonts.css');
    }
    return null;
  }
  if (!html.includes('fonts.googleapis.com')) return null;

  let h = html;
  h = h.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[^>]*>\s*/gi, '');
  h = h.replace(/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*>\s*/gi, '');
  h = h.replace(/<link rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>\s*/gi, '');
  h = h.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>\s*/gi, '');
  h = h.replace(/<noscript><link href="https:\/\/fonts\.googleapis\.com\/css2[^<]*<\/noscript>\s*/gi, '');

  if (h.includes('<style>')) {
    h = h.replace('<style>', FONT_HEAD + '<style>');
  } else if (/<\/head>/i.test(h)) {
    h = h.replace(/<\/head>/i, FONT_HEAD + '</head>');
  } else {
    return null;
  }
  return h;
}

let n = 0;
let skip = 0;
for (const f of walk(ROOT)) {
  const html = fs.readFileSync(f, 'utf8');
  const next = patchFonts(html);
  if (next === null) {
    if (html.includes('/assets/fonts/fonts')) skip++;
    continue;
  }
  fs.writeFileSync(f, next);
  n++;
}
console.log(`Fonts site-wide: ${n} patched, ${skip} already self-hosted`);
