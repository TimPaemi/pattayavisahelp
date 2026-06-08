/**
 * Sprint 77 — promote DE/RU driving-licence-thailand pilots; fix EN hero/meta.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PILOTS = [
  {
    en: 'guides/driving-licence-thailand/index.html',
    locale: 'de/guides/driving-licence-thailand/index.html',
    article: 'de-driving-guide-article.html',
    lang: 'de',
    slug: '/de/guides/driving-licence-thailand/',
    title: 'Thai-Führerschein Pattaya 2026 — Umtausch auf Deutsch',
    desc: 'Führerschein Thailand auf Deutsch: EU/UK/US Direktumtausch Pattaya DLT, Jomtien Aufenthaltsschein, ฿205 Gebühr, Dokumente und Ablauf 2026.',
    heroH1: 'Führerschein — <span class="pk">Thailand.</span> <span class="cy">Pattaya DLT.</span>',
    heroLede: 'EU-, UK-, US- und AU-Scheine tauschen Sie in Pattaya (DLT Sukhumvit) meist direkt um — Aufenthaltsschein von Jomtien, Medizin-Attest, ฿205. Ein Vormittag reicht.',
    tldr: 'Jomtien Cert · DLT Sukhumvit · ฿205 Auto · +฿105 Moto · EU/UK/US direkt',
    network:
      'Praxis: <a href="/de/guides/jomtien-immigration-office/">Jomtien (DE)</a> · <a href="/de/guides/90-day-reporting/">90-Tage (DE)</a> · <a href="/de/pattaya/">Pattaya (DE)</a>',
  },
  {
    en: 'guides/driving-licence-thailand/index.html',
    locale: 'ru/guides/driving-licence-thailand/index.html',
    article: 'ru-driving-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/driving-licence-thailand/',
    title: 'Тайские права Паттайя 2026 — обмен на русском',
    desc: 'Обмен иностранных прав на тайские в Паттайе: DLT Sukhumvit, справка Jomtien, ฿205, EU/UK/US без экзамена. Пошаговый гид на русском 2026.',
    heroH1: 'Права — <span class="pk">Таиланд</span> <span class="cy">Паттайя</span>',
    heroLede: 'Права ЕС, UK, США, AU меняют в DLT Pattaya без теории — справка Jomtien, меддокумент, ฿205. Утро одного дня.',
    tldr: 'Jomtien · DLT · ฿205 авто · +฿105 мото · EU/UK/US',
    network:
      '<a href="/ru/guides/jomtien-immigration-office/">Jomtien RU</a> · <a href="/ru/guides/90-day-reporting/">90-day</a> · <a href="/ru/pattaya/">Pattaya RU</a>',
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
  const otherTag = `<link rel="alternate" hreflang="${other}" href="${BASE}/${other}/guides/driving-licence-thailand/" />`;
  if (!h.includes(`hreflang="${other}" href="${BASE}/${other}/guides/driving-licence-thailand/`)) {
    h = h.replace('<link rel="alternate" hreflang="x-default"', `${otherTag}\n<link rel="alternate" hreflang="x-default"`);
  }

  h = h.replace(/<h1>Thai driving licence conversion guide<\/h1>/i, `<h1>${p.heroH1}</h1>`);
  h = h.replace(/<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${p.heroLede}</p>`);
  h = h.replace(/<p class="tldr-text">[\s\S]*?<\/p>/, `<p class="tldr-text">${p.tldr}</p>`);
  if (p.network) {
    h = h.replace(/<p class="network-context">[\s\S]*?<\/p>\s*(?=<main)/, `<p class="network-context">${p.network}</p>\n`);
  }
  if (h.includes('INDEPENDENT · NO COMMISSIONS')) {
    h = h.replace(
      /<span>INDEPENDENT · NO COMMISSIONS<\/span>/,
      `<span>${p.lang === 'de' ? 'DEUTCH · UNABHÄNGIG' : 'РУССКИЙ · НЕЗАВИСИМО'}</span>`
    );
  }

  h = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${article}\n</main>`);
  h = h.replace(/locale-stub-banner[\s\S]*?<\/div>\s*/g, '');
  h = h.replace(/\/\* sprint64-stub-nav \*\/[\s\S]*?body\{padding-bottom:72px\}\s*\}/, '');

  fs.mkdirSync(path.dirname(locPath), { recursive: true });
  fs.writeFileSync(locPath, h);
  console.log('promoted', p.locale);
}

let en = fs.readFileSync(path.join(ROOT, 'guides/driving-licence-thailand/index.html'), 'utf8');
en = en.replace(
  /<p class="lede">UK photocard[\s\S]*?<\/p>/,
  '<p class="lede">EU, UK, US, AU and most developed-country licences convert at Pattaya DLT (Sukhumvit Road) with a Jomtien residence certificate, medical certificate, and ฿205 fee. Allow one full morning.</p>'
);
en = en.replace(
  /<p class="tldr-text">Most US state[\s\S]*?<\/p>/,
  '<p class="tldr-text">Jomtien cert · DLT Sukhumvit · ฿205 car · +฿105 bike · EU/UK/US direct conversion</p>'
);
for (const [lang, slug] of [
  ['de', '/de/guides/driving-licence-thailand/'],
  ['ru', '/ru/guides/driving-licence-thailand/'],
]) {
  const tag = `<link rel="alternate" hreflang="${lang}" href="${BASE}${slug}" />`;
  if (!en.includes(tag)) {
    en = en.replace('<link rel="alternate" hreflang="en"', `${tag}\n<link rel="alternate" hreflang="en"`);
  }
}
fs.writeFileSync(path.join(ROOT, 'guides/driving-licence-thailand/index.html'), en);

for (const p of PILOTS) promote(p);

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const pilots = JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]);
for (const u of ['/de/guides/driving-licence-thailand/', '/ru/guides/driving-licence-thailand/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/guides/driving-licence-thailand/'")) {
  meta = meta.replace(
    "  '/ru/guides/cost-of-living-pattaya/',",
    "  '/ru/guides/cost-of-living-pattaya/',\n  '/de/guides/driving-licence-thailand/',\n  '/ru/guides/driving-licence-thailand/',"
  );
  fs.writeFileSync(metaPath, meta);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
