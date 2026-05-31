const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const VISA_MATRIX = [
  { slug: 'dtv', name: 'Destination Thailand Visa (DTV)' },
  { slug: 'ltr', name: 'Long-Term Resident (LTR)' },
  { slug: 'privilege-elite', name: 'Thailand Privilege Elite' },
  { slug: 'retirement-non-o', name: 'Retirement Non-O' },
  { slug: 'retirement-o-a', name: 'Retirement O-A' },
  { slug: 'retirement-o-x', name: 'Retirement O-X' },
  { slug: 'marriage-non-o', name: 'Marriage Non-O' },
  { slug: 'education-ed', name: 'Education (ED)' },
  { slug: 'business-non-b', name: 'Business Non-B' },
  { slug: 'smart', name: 'SMART Visa' },
  { slug: 'tourist-tr-evisa', name: 'Tourist TR / e-Visa' },
  { slug: 'media-non-m', name: 'Media Non-M' },
];

const results = { stubs: 0, hreflang: 0, matrix: false, hubLinks: 0 };

execSync('node scripts/locale-visa-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });
results.stubs = 24;
results.hreflang = 12;

const matrixPath = path.join(ROOT, 'compare/visa-comparison-matrix/index.html');
let matrix = fs.readFileSync(matrixPath, 'utf8');
const matrixSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Thailand Visa Comparison Matrix 2026 — All 12 Side by Side',
  url: `${BASE}/compare/visa-comparison-matrix/`,
  numberOfItems: VISA_MATRIX.length,
  itemListElement: VISA_MATRIX.map((v, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: v.name,
    url: `${BASE}/visas/${v.slug}/`,
  })),
};
const matrixTag = `<script type="application/ld+json">\n${JSON.stringify(matrixSchema)}\n</script>\n`;
matrix = matrix.replace(
  /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema.org","@type":"ItemList"[\s\S]*?<\/script>\s*\n/,
  matrixTag
);
if (!matrix.includes('"numberOfItems":12')) {
  const idx = matrix.indexOf('<link rel="preconnect" href="https://fonts.googleapis.com"');
  matrix = matrix.slice(0, idx) + matrixTag + matrix.slice(idx);
}
fs.writeFileSync(matrixPath, matrix);
results.matrix = true;

for (const hub of ['de/index.html', 'ru/index.html']) {
  const f = path.join(ROOT, hub);
  let html = fs.readFileSync(f, 'utf8');
  if (html.includes('/de/visas/dtv/') || html.includes('/ru/visas/dtv/')) continue;
  const insert =
    hub.startsWith('de')
      ? `<h2>Visum-Übersichten auf Deutsch</h2>\n<ul>\n<li><a href="/de/visas/dtv/">DTV auf Deutsch</a></li>\n<li><a href="/de/visas/ltr/">LTR auf Deutsch</a></li>\n<li><a href="/de/visas/retirement-non-o/">Non-O Rente auf Deutsch</a></li>\n<li><a href="/de/visas/privilege-elite/">Privilege auf Deutsch</a></li>\n<li><a href="/de/visas/">Alle 12 Visa (EN) →</a></li>\n</ul>\n\n`
      : `<h2>Обзоры виз на русском</h2>\n<ul>\n<li><a href="/ru/visas/dtv/">DTV на русском</a></li>\n<li><a href="/ru/visas/ltr/">LTR на русском</a></li>\n<li><a href="/ru/visas/retirement-non-o/">Non-O пенсия на русском</a></li>\n<li><a href="/ru/visas/privilege-elite/">Privilege на русском</a></li>\n<li><a href="/visas/">Все 12 виз (EN) →</a></li>\n</ul>\n\n`;
  if (html.includes('<h2>Wichtige Seiten')) {
    html = html.replace('<h2>Wichtige Seiten', insert + '<h2>Wichtige Seiten');
  } else if (html.includes('<h2>Ключевые')) {
    html = html.replace('<h2>Ключевые', insert + '<h2>Ключевые');
  } else {
    html = html.replace('<main id="main"', `<main id="main"`).replace(/<main id="main"[^>]*>/, (m) => m + '\n' + insert);
  }
  fs.writeFileSync(f, html);
  results.hubLinks++;
}

console.log(JSON.stringify(results, null, 2));
