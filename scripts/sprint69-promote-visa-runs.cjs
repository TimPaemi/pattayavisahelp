/**
 * Sprint 69 — promote DE/RU visa-runs vs extensions pilots.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PILOTS = [
  {
    en: 'guides/visa-runs-vs-extensions/index.html',
    locale: 'de/guides/visa-runs-vs-extensions/index.html',
    article: 'de-visa-runs-guide-article.html',
    lang: 'de',
    slug: '/de/guides/visa-runs-vs-extensions/',
    title: 'Visa-Runs vs Verlängerungen 2026 — Pattaya Realität',
    desc: 'Visa-Runs vs Verlängerung auf Deutsch: 2×-Landgrenze-Regel, Jomtien, DTV-Alternative, wann Runs noch Sinn machen.',
    heroH1: 'Runs vs <span class="pk">Verlängern</span> — <span class="cy">2026.</span>',
    heroLede: 'Die 2×-Landgrenze-Regel beendet die Run-Schleife für die meisten — Verlängerung in Jomtien oder DTV/Non-O ist der Pattaya-Standard.',
    tldr: 'Landgrenze max 2×/Jahr · Jomtien-Verlängerung oft besser · DTV für Nomaden',
    network:
      'Pattaya: <a href="/de/guides/jomtien-immigration-office/">Jomtien (DE)</a> · <a href="/de/visas/dtv/">DTV (DE)</a> · <a href="/guides/visa-runs-vs-extensions/">EN</a>',
  },
  {
    en: 'guides/visa-runs-vs-extensions/index.html',
    locale: 'ru/guides/visa-runs-vs-extensions/index.html',
    article: 'ru-visa-runs-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/visa-runs-vs-extensions/',
    title: 'Visa-run vs продление 2026 — Паттайя',
    desc: 'Visa-run vs продление на русском: лимит 2× суша, Jomtien, DTV.',
    heroH1: 'Run vs <span class="pk">продление</span> — <span class="cy">2026</span>',
    heroLede: 'Лимит 2 пересечения суши в год — продление в Jomtien или DTV/Non-O.',
    tldr: 'Суша 2×/год · Jomtien · DTV для номадов',
    network:
      '<a href="/ru/guides/jomtien-immigration-office/">Jomtien RU</a> · <a href="/ru/visas/dtv/">DTV RU</a>',
  },
];

function promote(p) {
  const enPath = path.join(ROOT, p.en);
  const locPath = path.join(ROOT, p.locale);
  const article = fs.readFileSync(path.join(__dirname, 'content', p.article), 'utf8');
  const enSlug = '/' + p.en.replace('/index.html', '/');
  const locUrl = `${BASE}${p.slug}`;

  let h = fs.readFileSync(enPath, 'utf8');
  h = h.replace(/<html lang="en">/, `<html lang="${p.lang}">`);
  h = h.split(`${BASE}${enSlug}`).join(locUrl);
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${p.title}</title>`);
  h = h.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${p.desc}"`);
  h = h.replace(/content="index,follow[^"]*"/, 'content="index,follow,max-image-preview:large,max-snippet:-1"');
  h = h.replace(/content="noindex[^"]*"/, 'content="index,follow,max-image-preview:large,max-snippet:-1"');
  if (!h.includes(`hreflang="${p.lang}"`)) {
    h = h.replace(
      '<link rel="alternate" hreflang="en"',
      `<link rel="alternate" hreflang="${p.lang}" href="${locUrl}" />\n<link rel="alternate" hreflang="en"`
    );
  }
  const other = p.lang === 'de' ? 'ru' : 'de';
  const otherSlug = `/${other}/guides/visa-runs-vs-extensions/`;
  const otherTag = `<link rel="alternate" hreflang="${other}" href="${BASE}${otherSlug}" />`;
  if (!h.includes(`hreflang="${other}"`)) {
    h = h.replace('<link rel="alternate" hreflang="x-default"', `${otherTag}\n<link rel="alternate" hreflang="x-default"`);
  }

  h = h.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${p.heroH1}</h1>`);
  h = h.replace(/<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${p.heroLede}</p>`);
  h = h.replace(/<p class="tldr-text">[\s\S]*?<\/p>/, `<p class="tldr-text">${p.tldr}</p>`);
  if (p.network) {
    h = h.replace(/<p class="network-context">[\s\S]*?<\/p>\s*(?=<main)/, `<p class="network-context">${p.network}</p>\n`);
  }
  if (h.includes('INDEPENDENT · NO COMMISSIONS')) {
    h = h.replace(
      /<span>INDEPENDENT · NO COMMISSIONS<\/span>/,
      `<span>${p.lang === 'de' ? 'DEUTSCH · UNABHÄNGIG' : 'РУССКИЙ · НЕЗАВИСИМО'}</span>`
    );
  }

  h = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${article}\n</main>`);
  h = h.replace(/locale-stub-banner[\s\S]*?<\/div>\s*/g, '');
  h = h.replace(/\/\* sprint64-stub-nav \*\/[\s\S]*?body\{padding-bottom:72px\}\s*\}/, '');

  fs.mkdirSync(path.dirname(locPath), { recursive: true });
  fs.writeFileSync(locPath, h);
  console.log('promoted', p.locale);
}

let en = fs.readFileSync(path.join(ROOT, 'guides/visa-runs-vs-extensions/index.html'), 'utf8');
en = en.replace(/<p class="lede">Air-arrival cap<\/p>/, '<p class="lede">Land border entries capped at 2 per year for most nationals — extensions at Jomtien or a proper long-stay visa beat the run loop in Pattaya.</p>');
en = en.replace(/<p class="tldr-text">6\/year<\/p>/, '<p class="tldr-text">2 land entries/year · Jomtien extension often better · DTV for remote workers</p>');
for (const [lang, slug] of [
  ['de', '/de/guides/visa-runs-vs-extensions/'],
  ['ru', '/ru/guides/visa-runs-vs-extensions/'],
]) {
  const tag = `<link rel="alternate" hreflang="${lang}" href="${BASE}${slug}" />`;
  if (!en.includes(tag)) {
    en = en.replace('<link rel="alternate" hreflang="en"', `${tag}\n<link rel="alternate" hreflang="en"`);
  }
}
fs.writeFileSync(path.join(ROOT, 'guides/visa-runs-vs-extensions/index.html'), en);

for (const p of PILOTS) promote(p);

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const pilots = JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]);
for (const u of ['/de/guides/visa-runs-vs-extensions/', '/ru/guides/visa-runs-vs-extensions/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/guides/visa-runs-vs-extensions/'")) {
  meta = meta.replace(
    "  '/ru/guides/visa-overstay-penalties/',",
    "  '/ru/guides/visa-overstay-penalties/',\n  '/de/guides/visa-runs-vs-extensions/',\n  '/ru/guides/visa-runs-vs-extensions/',"
  );
  fs.writeFileSync(metaPath, meta);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
