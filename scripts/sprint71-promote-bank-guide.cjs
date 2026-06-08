/**
 * Sprint 71 — promote DE/RU thai-bank-account pilots; fix EN hero.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PILOTS = [
  {
    en: 'guides/thai-bank-account-as-foreigner/index.html',
    locale: 'de/guides/thai-bank-account-as-foreigner/index.html',
    article: 'de-bank-guide-article.html',
    lang: 'de',
    slug: '/de/guides/thai-bank-account-as-foreigner/',
    title: 'Thai Bankkonto Ausländer 2026 — Pattaya & Jomtien',
    desc: 'Thai Bankkonto auf Deutsch: Bangkok Bank Pattaya, TM30, DTV & Non-O Seasoning ฿800k, Unterlagen und Filial-Tipps.',
    heroH1: 'Bankkonto — <span class="pk">Thailand.</span> <span class="cy">Als Ausländer.</span>',
    heroLede: 'Bangkok Bank Beach Road oder Jomtien — Pass, Langzeitvisum, TM30, Adressnachweis. Für Non-O: Konto vor dem ฿800k-Seasoning.',
    tldr: 'BBL Beach Road / Jomtien · TM30 + Visum · ฿800k 2 Monate für Non-O',
    network:
      'Nach dem Konto: <a href="/de/guides/jomtien-immigration-office/">Jomtien (DE)</a> · <a href="/de/visas/retirement-non-o/">Non-O (DE)</a> · <a href="/de/visas/dtv/">DTV (DE)</a>',
  },
  {
    en: 'guides/thai-bank-account-as-foreigner/index.html',
    locale: 'ru/guides/thai-bank-account-as-foreigner/index.html',
    article: 'ru-bank-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/thai-bank-account-as-foreigner/',
    title: 'Банковский счёт в Таиланде 2026 — Паттайя',
    desc: 'Счёт в тайском банке на русском: Bangkok Bank, TM30, DTV и Non-O ฿800k.',
    heroH1: 'Счёт в банке — <span class="pk">Таиланд</span> <span class="cy">для иностранца</span>',
    heroLede: 'Bangkok Bank Beach Road или Jomtien — паспорт, виза, TM30. Для Non-O: счёт до seasoning ฿800k.',
    tldr: 'BBL Pattaya · TM30 + виза · ฿800k 2 мес для Non-O',
    network:
      '<a href="/ru/guides/jomtien-immigration-office/">Jomtien RU</a> · <a href="/ru/visas/retirement-non-o/">Non-O RU</a> · <a href="/ru/visas/dtv/">DTV RU</a>',
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
  const otherTag = `<link rel="alternate" hreflang="${other}" href="${BASE}/${other}/guides/thai-bank-account-as-foreigner/" />`;
  if (!h.includes(`hreflang="${other}"`)) {
    h = h.replace('<link rel="alternate" hreflang="x-default"', `${otherTag}\n<link rel="alternate" hreflang="x-default"`);
  }

  h = h.replace(/<h1>Open a Thai bank account[\s\S]*?<\/h1>/, `<h1>${p.heroH1}</h1>`);
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

let en = fs.readFileSync(path.join(ROOT, 'guides/thai-bank-account-as-foreigner/index.html'), 'utf8');
en = en.replace(
  /<h1>Open a Thai bank account[\s\S]*?<\/h1>/,
  "<h1>Open a Thai bank account — as a foreigner in Pattaya, 2026.</h1>"
);
en = en.replace(
  /<p class="lede">These visas are explicitly[\s\S]*?<\/p>/,
  '<p class="lede">Bangkok Bank Beach Road or Jomtien — passport, long-stay visa, TM30, proof of address. For Non-O: open the account before ฿800k seasoning.</p>'
);
for (const [lang, slug] of [
  ['de', '/de/guides/thai-bank-account-as-foreigner/'],
  ['ru', '/ru/guides/thai-bank-account-as-foreigner/'],
]) {
  const tag = `<link rel="alternate" hreflang="${lang}" href="${BASE}${slug}" />`;
  if (!en.includes(tag)) {
    en = en.replace('<link rel="alternate" hreflang="en"', `${tag}\n<link rel="alternate" hreflang="en"`);
  }
}
fs.writeFileSync(path.join(ROOT, 'guides/thai-bank-account-as-foreigner/index.html'), en);

for (const p of PILOTS) promote(p);

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const pilots = JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]);
for (const u of ['/de/guides/thai-bank-account-as-foreigner/', '/ru/guides/thai-bank-account-as-foreigner/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/guides/thai-bank-account-as-foreigner/'")) {
  meta = meta.replace(
    "  '/ru/guides/visa-runs-vs-extensions/',",
    "  '/ru/guides/visa-runs-vs-extensions/',\n  '/de/guides/thai-bank-account-as-foreigner/',\n  '/ru/guides/thai-bank-account-as-foreigner/',"
  );
  fs.writeFileSync(metaPath, meta);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
