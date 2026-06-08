/**
 * Sprint 73 — promote DE/RU retiring-in-thailand pilots; fix EN hero.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PILOTS = [
  {
    en: 'guides/retiring-in-thailand/index.html',
    locale: 'de/guides/retiring-in-thailand/index.html',
    article: 'de-retiring-guide-article.html',
    lang: 'de',
    slug: '/de/guides/retiring-in-thailand/',
    title: 'Rente in Thailand 2026 — Pattaya & Jomtien Leitfaden',
    desc: 'Rente in Thailand auf Deutsch: Non-O, O-A, LTR, Bankkonto, TM30, Versicherung und typische Reihenfolge für Pattaya-Rentner in Jomtien.',
    heroH1: 'Rente in Thailand — <span class="pk">Pattaya.</span> <span class="cy">Der Praxisplan.</span>',
    heroLede: 'Non-O ohne Versicherungspflicht, ฿800k Seasoning, Jomtien-Verlängerung — oder LTR/Privilege für höhere Budgets. Bank, TM30 und Re-entry in der richtigen Reihenfolge.',
    tldr: 'Non-O Standard · ฿800k + Jomtien · Bank vor Seasoning · Re-entry vor EU-Reise',
    network:
      'Visa: <a href="/de/visas/retirement-non-o/">Non-O (DE)</a> · <a href="/de/guides/thai-bank-account-as-foreigner/">Bank (DE)</a> · <a href="/de/guides/health-insurance/">Versicherung (DE)</a> · <a href="/de/guides/jomtien-immigration-office/">Jomtien (DE)</a>',
  },
  {
    en: 'guides/retiring-in-thailand/index.html',
    locale: 'ru/guides/retiring-in-thailand/index.html',
    article: 'ru-retiring-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/retiring-in-thailand/',
    title: 'Пенсия в Таиланде 2026 — Паттайя и Jomtien',
    desc: 'Пенсия в Таиланде на русском: Non-O, банк, TM30, страховка и порядок действий для жителей Паттайи.',
    heroH1: 'Пенсия в Таиланде — <span class="pk">Паттайя</span> <span class="cy">практика</span>',
    heroLede: 'Non-O без обязательной страховки, ฿800k seasoning, продление в Jomtien. Банк, TM30 и re-entry — в правильном порядке.',
    tldr: 'Non-O · ฿800k · счёт до seasoning · re-entry перед поездкой',
    network:
      '<a href="/ru/visas/retirement-non-o/">Non-O RU</a> · <a href="/ru/guides/thai-bank-account-as-foreigner/">банк RU</a> · <a href="/ru/guides/health-insurance/">страховка RU</a>',
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
  const otherTag = `<link rel="alternate" hreflang="${other}" href="${BASE}/${other}/guides/retiring-in-thailand/" />`;
  if (!h.includes(`hreflang="${other}" href="${BASE}/${other}/guides/retiring-in-thailand/`)) {
    h = h.replace('<link rel="alternate" hreflang="x-default"', `${otherTag}\n<link rel="alternate" hreflang="x-default"`);
  }

  h = h.replace(/<h1>Retiring in Thailand[\s\S]*?<\/h1>/, `<h1>${p.heroH1}</h1>`);
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

let en = fs.readFileSync(path.join(ROOT, 'guides/retiring-in-thailand/index.html'), 'utf8');
en = en.replace(
  /<p class="lede">\$80k\+[\s\S]*?<\/p>/,
  '<p class="lede">Pattaya retirement in 2026: Non-O with ฿800k seasoning (no mandatory insurance), annual extensions at Jomtien, or LTR/Privilege for higher budgets. Bank account and TM30 before your first extension.</p>'
);
en = en.replace(
  /<p class="tldr-text">฿900k[\s\S]*?<\/p>/,
  '<p class="tldr-text">Non-O default · ฿800k + Jomtien · open bank before seasoning · re-entry before EU trips</p>'
);
for (const [lang, slug] of [
  ['de', '/de/guides/retiring-in-thailand/'],
  ['ru', '/ru/guides/retiring-in-thailand/'],
]) {
  const tag = `<link rel="alternate" hreflang="${lang}" href="${BASE}${slug}" />`;
  if (!en.includes(tag)) {
    en = en.replace('<link rel="alternate" hreflang="en"', `${tag}\n<link rel="alternate" hreflang="en"`);
  }
}
fs.writeFileSync(path.join(ROOT, 'guides/retiring-in-thailand/index.html'), en);

for (const p of PILOTS) promote(p);

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const pilots = JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]);
for (const u of ['/de/guides/retiring-in-thailand/', '/ru/guides/retiring-in-thailand/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/guides/retiring-in-thailand/'")) {
  meta = meta.replace(
    "  '/ru/guides/health-insurance/',",
    "  '/ru/guides/health-insurance/',\n  '/de/guides/retiring-in-thailand/',\n  '/ru/guides/retiring-in-thailand/',"
  );
  fs.writeFileSync(metaPath, meta);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
