/**
 * Sprint 51 — index DE/RU locale hub pages (promote from articles, rebuild pilots).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const HUBS = [
  {
    file: 'de/index.html',
    article: 'de-hub-article.html',
    robots: 'index,follow,max-image-preview:large,max-snippet:-1',
    badge: 'DEUTSCH · UNABHÄNGIG · INDEXIERT',
    tldr: '86 indexierte DE/RU-Pilotseiten: 12 Visa, 15 Vergleiche, 16 Berufe — Beratung aus Jomtien auf Deutsch.',
  },
  {
    file: 'ru/index.html',
    article: 'ru-hub-article.html',
    robots: 'index,follow,max-image-preview:large,max-snippet:-1',
    badge: 'РУССКИЙ · НЕЗАВИСИМО · В ИНДЕКСЕ',
    tldr: '86 индексированных RU/DE страниц: 12 виз, 15 сравнений, 16 профессий — консультации из Джомтьена.',
  },
];

function indexHub(cfg) {
  const fp = path.join(ROOT, cfg.file);
  const article = fs.readFileSync(path.join(__dirname, 'content', cfg.article), 'utf8');
  let h = fs.readFileSync(fp, 'utf8');

  h = h.replace(/<meta name="robots" content="[^"]*"/, `<meta name="robots" content="${cfg.robots}"`);

  h = h.replace(
    /<p style="max-width:820px;margin:2rem auto 0;padding:1rem 1.25rem;border:1px solid rgba\(6,182,212,.35\);[^"]*">[\s\S]*?<\/p>\n/g,
    ''
  );

  h = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${article}\n</main>`);

  if (cfg.badge) {
    h = h.replace(/<span>INDEPENDENT · NO COMMISSIONS<\/span>/, `<span>${cfg.badge}</span>`);
  }
  if (cfg.tldr) {
    h = h.replace(/<p class="tldr-text">[\s\S]*?<\/p>/, `<p class="tldr-text">${cfg.tldr}</p>`);
  }

  fs.writeFileSync(fp, h);
  console.log('indexed hub', cfg.file);
}

for (const cfg of HUBS) indexHub(cfg);

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const m = sm.match(/const LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\);/);
if (!m) throw new Error('LOCALE_INDEXED_PILOT not found');
const pilots = JSON.parse(m[1]);
if (!pilots.includes('/de/')) pilots.unshift('/ru/', '/de/');
else if (!pilots.includes('/ru/')) pilots.unshift('/ru/');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 51 locale hubs — 290 URLs');
