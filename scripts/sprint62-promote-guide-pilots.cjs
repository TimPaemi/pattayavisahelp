/**
 * Sprint 62 — promote DE/RU Jomtien immigration guide pilots.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'guides/jomtien-immigration-office/index.html',
    locale: 'de/guides/jomtien-immigration-office/index.html',
    article: 'de-jomtien-guide-article.html',
    lang: 'de',
    slug: '/de/guides/jomtien-immigration-office/',
    title: 'Jomtien Immigration Büro 2026 — Wartezeiten & Ablauf',
    desc: 'Jomtien Immigration Soi 5: Öffnungszeiten, Queue-Strategie, Unterlagen, typische Fehler. Praxis aus Pattaya für DE-Bewohner.',
    heroH1: 'Jomtien Immigration — <span class="pk">Praxis.</span>',
    heroLede: 'Mo–Fr vor 8:30 ankommen. TM30, Bankbrief, Gebäude A/B — Feldguide auf Deutsch.',
    heroClass: 'lede',
  },
  {
    en: 'guides/jomtien-immigration-office/index.html',
    locale: 'ru/guides/jomtien-immigration-office/index.html',
    article: 'ru-jomtien-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/jomtien-immigration-office/',
    title: 'Иммиграция Jomtien 2026 — очереди и документы',
    desc: 'Офис Jomtien Soi 5: часы, очередь, TM30, продления Non-O и DTV. Практика Паттайи на русском.',
    heroH1: 'Jomtien Immigration — <span class="pk">практика.</span>',
    heroLede: 'Приезжайте до 8:30. TM30, банк, здания A/B — гид на русском.',
    heroClass: 'lede',
  },
];

function promote(p) {
  const enPath = path.join(ROOT, p.en);
  const locPath = path.join(ROOT, p.locale);
  const article = fs.readFileSync(path.join(__dirname, 'content', p.article), 'utf8');
  const enSlug = '/' + p.en.replace('/index.html', '/');
  const enUrl = `https://pattayavisahelp.com${enSlug}`;
  const locUrl = `https://pattayavisahelp.com${p.slug}`;

  let h = fs.readFileSync(enPath, 'utf8');
  h = h.replace(/<html lang="en">/, `<html lang="${p.lang}">`);
  h = h.split(enUrl).join(locUrl);
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
  const otherSlug = p.lang === 'de' ? '/ru/guides/jomtien-immigration-office/' : '/de/guides/jomtien-immigration-office/';
  const otherTag = `<link rel="alternate" hreflang="${other}" href="https://pattayavisahelp.com${otherSlug}" />`;
  if (!h.includes(`hreflang="${other}"`)) {
    h = h.replace('<link rel="alternate" hreflang="x-default"', `${otherTag}\n<link rel="alternate" hreflang="x-default"`);
  }

  h = h.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${p.heroH1}</h1>`);
  const heroRe = new RegExp(`<p class="${p.heroClass}">[\\s\\S]*?<\\/p>`);
  if (heroRe.test(h)) h = h.replace(heroRe, `<p class="${p.heroClass}">${p.heroLede}</p>`);
  if (h.includes('INDEPENDENT · NO COMMISSIONS')) {
    h = h.replace(
      /<span>INDEPENDENT · NO COMMISSIONS<\/span>/,
      `<span>${p.lang === 'de' ? 'DEUTSCH · UNABHÄNGIG' : 'РУССКИЙ · НЕЗАВИСИМО'}</span>`
    );
  }

  h = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${article}\n</main>`);
  h = h.replace(/locale-stub-banner[\s\S]*?<\/div>\s*/g, '');
  h = h.replace(/<!-- sprint61-stub-mesh -->[\s\S]*?<\/p>\s*/g, '');

  fs.mkdirSync(path.dirname(locPath), { recursive: true });
  fs.writeFileSync(locPath, h);
  console.log('promoted', p.locale);
}

for (const p of PILOTS) promote(p);

const enGuide = path.join(ROOT, 'guides/jomtien-immigration-office/index.html');
let eg = fs.readFileSync(enGuide, 'utf8');
const BASE = 'https://pattayavisahelp.com';
for (const [lang, slug] of [
  ['de', '/de/guides/jomtien-immigration-office/'],
  ['ru', '/ru/guides/jomtien-immigration-office/'],
]) {
  const tag = `<link rel="alternate" hreflang="${lang}" href="${BASE}${slug}" />`;
  if (!eg.includes(tag)) {
    eg = eg.replace(
      '<link rel="alternate" hreflang="en"',
      `${tag}\n<link rel="alternate" hreflang="en"`
    );
  }
}
fs.writeFileSync(enGuide, eg);
console.log('hreflang EN jomtien guide');

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const m = sm.match(/const LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\);/);
const pilots = JSON.parse(m[1]);
for (const u of ['/de/guides/jomtien-immigration-office/', '/ru/guides/jomtien-immigration-office/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/guides/jomtien-immigration-office/'")) {
  meta = meta.replace(
    "  '/de/pattaya/',\n  '/ru/pattaya/',",
    "  '/de/pattaya/',\n  '/ru/pattaya/',\n  '/de/guides/jomtien-immigration-office/',\n  '/ru/guides/jomtien-immigration-office/',"
  );
  fs.writeFileSync(metaPath, meta);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 62 Jomtien pilots promoted');
