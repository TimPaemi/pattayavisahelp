/**
 * Sprint 64 — align JSON-LD inLanguage + OG/Twitter with locale pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const sm = fs.readFileSync(path.join(__dirname, 'rebuild-sitemaps.cjs'), 'utf8');
const pilots = [...JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1])];

function patch(file, lang) {
  let h = fs.readFileSync(file, 'utf8');
  const before = h;
  const title = (h.match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim();
  const desc = (h.match(/<meta name="description" content="([^"]*)"/i) || [])[1]?.trim();
  if (!title) return false;

  h = h.replace(/"inLanguage":"en"/g, `"inLanguage":"${lang}"`);
  h = h.replace(/"inLanguage": "en"/g, `"inLanguage": "${lang}"`);

  if (desc) {
    h = h.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${desc}"`);
    h = h.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${desc}"`);
  }
  h = h.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`);
  h = h.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`);

  if (h !== before) {
    fs.writeFileSync(file, h);
    return true;
  }
  return false;
}

let n = 0;
for (const url of pilots) {
  if (url === '/de/' || url === '/ru/') continue;
  const lang = url.startsWith('/de/') ? 'de' : url.startsWith('/ru/') ? 'ru' : null;
  if (!lang) continue;
  const file = path.join(ROOT, url.slice(1), 'index.html');
  if (!fs.existsSync(file)) continue;
  if (patch(file, lang)) {
    n++;
    console.log('meta', url);
  }
}
console.log('locale meta patched:', n);
