/**
 * Sprint 63 — correct hreflang alternates on all indexed DE/RU pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const sm = fs.readFileSync(path.join(__dirname, 'rebuild-sitemaps.cjs'), 'utf8');
const pilots = [...JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1])];

function enPath(localePath) {
  if (localePath === '/de/' || localePath === '/ru/') return '/';
  if (localePath.startsWith('/de/')) return localePath.replace(/^\/de/, '') || '/';
  if (localePath.startsWith('/ru/')) return localePath.replace(/^\/ru/, '') || '/';
  return localePath;
}

function localePath(enPath, lang) {
  if (enPath === '/') return `/${lang}/`;
  return `/${lang}${enPath}`;
}

function buildTags(en, de, ru) {
  return [
    `<link rel="alternate" hreflang="en" href="${BASE}${en}" />`,
    `<link rel="alternate" hreflang="de" href="${BASE}${de}" />`,
    `<link rel="alternate" hreflang="ru" href="${BASE}${ru}" />`,
    `<link rel="alternate" hreflang="x-default" href="${BASE}${en}" />`,
  ];
}

let fixed = 0;
const seen = new Set();

for (const loc of pilots) {
  const lang = loc.startsWith('/de/') ? 'de' : loc.startsWith('/ru/') ? 'ru' : null;
  if (!lang) continue;
  const en = enPath(loc);
  const key = en;
  if (seen.has(key)) continue;
  seen.add(key);

  const de = localePath(en, 'de');
  const ru = localePath(en, 'ru');
  const tags = buildTags(en, de, ru);
  const block = tags.join('\n');

  for (const p of [de, ru]) {
    const file = path.join(ROOT, p.slice(1), 'index.html');
    if (!fs.existsSync(file)) {
      console.warn('missing', p);
      continue;
    }
    let h = fs.readFileSync(file, 'utf8');
    const before = h;
    h = h.replace(/<link rel="alternate" hreflang="(?:en|de|ru|x-default)"[^>]*\/?>\s*\n?/gi, '');
    const canon = h.match(/<link rel="canonical"[^>]*>/i);
    if (!canon) {
      console.warn('no canonical', p);
      continue;
    }
    h = h.replace(canon[0], `${canon[0]}\n${block}`);
    if (h !== before) {
      fs.writeFileSync(file, h);
      fixed++;
      console.log('hreflang', p);
    }
  }
}

console.log('fixed files:', fixed);
