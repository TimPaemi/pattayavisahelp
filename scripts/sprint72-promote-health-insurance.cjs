/**
 * Sprint 72 — promote DE/RU health-insurance pilots; fix EN hero.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PILOTS = [
  {
    en: 'guides/health-insurance/index.html',
    locale: 'de/guides/health-insurance/index.html',
    article: 'de-health-insurance-guide-article.html',
    lang: 'de',
    slug: '/de/guides/health-insurance/',
    title: 'Thailand Krankenversicherung Visum 2026 — O-A, LTR, Non-O',
    desc: 'Krankenversicherung für Thailand-Visa auf Deutsch: O-A 3 Mio. ฿, LTR $50k, Non-O ohne Pflicht, TGIA und Jomtien-Tipps.',
    heroH1: 'Krankenversicherung — <span class="pk">Visum.</span> <span class="cy">Was gilt wirklich?</span>',
    heroLede: 'O-A verlangt 3 Mio. ฿ Deckung. LTR: $50k Police oder $100k Ersparnisse. Non-O in Pattaya: keine Pflicht — der Hauptgrund für Non-O statt O-A.',
    tldr: 'O-A 3M ฿ · LTR $50k oder $100k · Non-O keine Pflicht · ab 70 oft Non-O-Wechsel',
    network:
      'Visa: <a href="/de/visas/retirement-non-o/">Non-O (DE)</a> · <a href="/de/visas/retirement-o-a/">O-A (DE)</a> · <a href="/de/visas/ltr/">LTR (DE)</a> · <a href="/de/compare/non-o-vs-o-a/">Non-O vs O-A</a>',
  },
  {
    en: 'guides/health-insurance/index.html',
    locale: 'ru/guides/health-insurance/index.html',
    article: 'ru-health-insurance-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/health-insurance/',
    title: 'Медстраховка для визы в Таиланд 2026 — O-A, LTR, Non-O',
    desc: 'Страховка для тайской визы на русском: O-A 3 млн ฿, LTR $50k, Non-O без обязательства.',
    heroH1: 'Медстраховка — <span class="pk">виза</span> <span class="cy">Таиланд</span>',
    heroLede: 'O-A: 3 млн ฿. LTR: $50k или $100k на счёте. Non-O в Паттайе — без обязательной страховки.',
    tldr: 'O-A 3M ฿ · LTR $50k · Non-O не нужна · после 70 чаще Non-O',
    network:
      '<a href="/ru/visas/retirement-non-o/">Non-O RU</a> · <a href="/ru/visas/retirement-o-a/">O-A RU</a> · <a href="/ru/visas/ltr/">LTR RU</a>',
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
  const otherTag = `<link rel="alternate" hreflang="${other}" href="${BASE}/${other}/guides/health-insurance/" />`;
  if (!h.includes(`hreflang="${other}" href="${BASE}/${other}/guides/health-insurance/`)) {
    h = h.replace('<link rel="alternate" hreflang="x-default"', `${otherTag}\n<link rel="alternate" hreflang="x-default"`);
  }

  h = h.replace(
    /<h1>Thailand visa health insurance[\s\S]*?<\/h1>/,
    `<h1>${p.heroH1}</h1>`
  );
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

let en = fs.readFileSync(path.join(ROOT, 'guides/health-insurance/index.html'), 'utf8');
en = en.replace(
  /<p class="lede">The LTR visa is more flexible[\s\S]*?<\/p>/,
  '<p class="lede">O-A requires 3M THB coverage. LTR: $50k policy or $100k savings. Non-O in Pattaya: no mandatory insurance — the main reason retirees choose Non-O over O-A.</p>'
);
en = en.replace(
  /<p class="tldr-text">Each dependent[\s\S]*?<\/p>/,
  '<p class="tldr-text">O-A 3M THB · LTR $50k or $100k · Non-O not required · 70+ often switches to Non-O</p>'
);
for (const [lang, slug] of [
  ['de', '/de/guides/health-insurance/'],
  ['ru', '/ru/guides/health-insurance/'],
]) {
  const tag = `<link rel="alternate" hreflang="${lang}" href="${BASE}${slug}" />`;
  if (!en.includes(tag)) {
    en = en.replace('<link rel="alternate" hreflang="en"', `${tag}\n<link rel="alternate" hreflang="en"`);
  }
}
fs.writeFileSync(path.join(ROOT, 'guides/health-insurance/index.html'), en);

for (const p of PILOTS) promote(p);

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const pilots = JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]);
for (const u of ['/de/guides/health-insurance/', '/ru/guides/health-insurance/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/guides/health-insurance/'")) {
  meta = meta.replace(
    "  '/ru/guides/thai-bank-account-as-foreigner/',",
    "  '/ru/guides/thai-bank-account-as-foreigner/',\n  '/de/guides/health-insurance/',\n  '/ru/guides/health-insurance/',"
  );
  fs.writeFileSync(metaPath, meta);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
