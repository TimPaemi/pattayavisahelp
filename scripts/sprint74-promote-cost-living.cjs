/**
 * Sprint 74 — promote DE/RU cost-of-living-pattaya pilots; fix EN hero.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PILOTS = [
  {
    en: 'guides/cost-of-living-pattaya/index.html',
    locale: 'de/guides/cost-of-living-pattaya/index.html',
    article: 'de-cost-living-guide-article.html',
    lang: 'de',
    slug: '/de/guides/cost-of-living-pattaya/',
    title: 'Lebenshaltung Pattaya 2026 — Budget Jomtien & Expats',
    desc: 'Lebenshaltungskosten Pattaya auf Deutsch: Miete Jomtien, Essen, Visa-Nebenkosten, drei Budget-Stufen und Rechner für Rentner und DTV.',
    heroH1: 'Lebenshaltung — <span class="pk">Pattaya.</span> <span class="cy">Echte Zahlen.</span>',
    heroLede: 'Sparsam ab ~฿32.000/Monat in Jomtien. Komfortabel ~฿65.000. Miete ist der größte Hebel — Visa-Kosten und Versicherung kommen extra.',
    tldr: 'Sparsam ฿32k · Komfort ฿65k · Premium ฿140k · Miete Jomtien ฿8–20k',
    network:
      'Planen: <a href="/de/guides/retiring-in-thailand/">Rente (DE)</a> · <a href="/tools/cost-calculator/">Rechner</a> · <a href="/de/pattaya/">Pattaya (DE)</a> · <a href="/de/visas/retirement-non-o/">Non-O (DE)</a>',
  },
  {
    en: 'guides/cost-of-living-pattaya/index.html',
    locale: 'ru/guides/cost-of-living-pattaya/index.html',
    article: 'ru-cost-living-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/cost-of-living-pattaya/',
    title: 'Стоимость жизни Паттайя 2026 — бюджет Jomtien',
    desc: 'Расходы в Паттайе на русском: аренда Jomtien, еда, виза, три уровня бюджета и калькулятор для пенсионеров и DTV.',
    heroH1: 'Расходы — <span class="pk">Паттайя</span> <span class="cy">2026</span>',
    heroLede: 'Эконом от ~฿32k/мес в Jomtien. Комфорт ~฿65k. Аренда — главный фактор; виза и страховка отдельно.',
    tldr: 'Эконом ฿32k · комфорт ฿65k · премиум ฿140k · Jomtien ฿8–20k',
    network:
      '<a href="/ru/guides/retiring-in-thailand/">пенсия RU</a> · <a href="/tools/cost-calculator/">калькулятор</a> · <a href="/ru/pattaya/">Pattaya RU</a>',
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
  const otherTag = `<link rel="alternate" hreflang="${other}" href="${BASE}/${other}/guides/cost-of-living-pattaya/" />`;
  if (!h.includes(`hreflang="${other}" href="${BASE}/${other}/guides/cost-of-living-pattaya/`)) {
    h = h.replace('<link rel="alternate" hreflang="x-default"', `${otherTag}\n<link rel="alternate" hreflang="x-default"`);
  }

  h = h.replace(
    /<h1>Pattaya cost of living[\s\S]*?<\/h1>/i,
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

let en = fs.readFileSync(path.join(ROOT, 'guides/cost-of-living-pattaya/index.html'), 'utf8');
en = en.replace(
  /<p class="lede">Electricity in a 1BR[\s\S]*?<\/p>/,
  '<p class="lede">Frugal retiree in Jomtien from ~฿32,000/month. Comfortable expat ~฿65,000. Premium couple ~฿140,000. Rent is the biggest variable — visa and insurance sit on top.</p>'
);
en = en.replace(
  /<p class="tldr-text">GP visit private hospital[\s\S]*?<\/p>/,
  '<p class="tldr-text">Frugal ฿32k · Comfortable ฿65k · Premium ฿140k · Jomtien rent ฿8–20k · Use the cost calculator</p>'
);
for (const [lang, slug] of [
  ['de', '/de/guides/cost-of-living-pattaya/'],
  ['ru', '/ru/guides/cost-of-living-pattaya/'],
]) {
  const tag = `<link rel="alternate" hreflang="${lang}" href="${BASE}${slug}" />`;
  if (!en.includes(tag)) {
    en = en.replace('<link rel="alternate" hreflang="en"', `${tag}\n<link rel="alternate" hreflang="en"`);
  }
}
fs.writeFileSync(path.join(ROOT, 'guides/cost-of-living-pattaya/index.html'), en);

for (const p of PILOTS) promote(p);

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const pilots = JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]);
for (const u of ['/de/guides/cost-of-living-pattaya/', '/ru/guides/cost-of-living-pattaya/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/guides/cost-of-living-pattaya/'")) {
  meta = meta.replace(
    "  '/ru/guides/retiring-in-thailand/',",
    "  '/ru/guides/retiring-in-thailand/',\n  '/de/guides/cost-of-living-pattaya/',\n  '/ru/guides/cost-of-living-pattaya/',"
  );
  fs.writeFileSync(metaPath, meta);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
