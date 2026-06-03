/**
 * Sprint 55 — promote DE/RU best-visa + pattaya section hubs.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const HUBS = [
  {
    en: 'best-visa/index.html',
    locale: 'de/best-visa/index.html',
    article: 'de-best-visa-hub-article.html',
    lang: 'de',
    slug: '/de/best-visa/',
    title: 'Beste Thailand-Visa nach Budget — Deutsch 2026',
    desc: 'Sechs Budget-Stufen: echte Jahreskosten DTV, Non-O, LTR, Privilege — Links zu EN-Tiers und DE-Visa-Pilots.',
    heroH1: 'Beste Visa nach <span class="pk">Budget.</span>',
    heroLede: 'Echte All-in-Kosten in sechs Stufen — nicht nur die ฿1.900 Counter-Gebühr.',
    heroClass: 'lede',
  },
  {
    en: 'best-visa/index.html',
    locale: 'ru/best-visa/index.html',
    article: 'ru-best-visa-hub-article.html',
    lang: 'ru',
    slug: '/ru/best-visa/',
    title: 'Лучшая виза по бюджету Таиланд 2026 — RU',
    desc: '6 уровней годовых затрат: DTV, Non-O, LTR — навигация EN + RU visa pilots.',
    heroH1: 'Лучшая виза по <span class="pk">бюджету.</span>',
    heroLede: 'Полная стоимость года — не только fee в иммиграции.',
    heroClass: 'lede',
  },
  {
    en: 'pattaya/index.html',
    locale: 'de/pattaya/index.html',
    article: 'de-pattaya-hub-article.html',
    lang: 'de',
    slug: '/de/pattaya/',
    title: 'Pattaya Visa & Leben — Deutsch 2026',
    desc: 'Jomtien, Stadtteile, Deutschland → Thailand — lokaler Hub mit DE-Visa- und Compare-Links.',
    heroH1: 'Pattaya — <span class="pk">vor Ort.</span>',
    heroLede: 'Jomtien Immigration, Stadtteile und Herkunftsleitfäder — verlinkt zum DE-Visa-Netzwerk.',
    heroClass: 'lede',
  },
  {
    en: 'pattaya/index.html',
    locale: 'ru/pattaya/index.html',
    article: 'ru-pattaya-hub-article.html',
    lang: 'ru',
    slug: '/ru/pattaya/',
    title: 'Паттайя визы и жизнь 2026 — хаб RU',
    desc: 'Jomtien, районы, РФ → Таиланд — связь с RU visa pilots и сравнениями городов.',
    heroH1: 'Паттайя — <span class="pk">на месте.</span>',
    heroLede: 'Джомтьен, районы, въезд из РФ — ссылки на RU визы и compare.',
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

  fs.mkdirSync(path.dirname(locPath), { recursive: true });
  fs.writeFileSync(locPath, h);
  console.log('promoted', p.locale);
}

for (const p of HUBS) promote(p);

const BASE = 'https://pattayavisahelp.com';
for (const { en, de, ru } of [
  { en: '/best-visa/', de: '/de/best-visa/', ru: '/ru/best-visa/' },
  { en: '/pattaya/', de: '/de/pattaya/', ru: '/ru/pattaya/' },
]) {
  const file = path.join(ROOT, en.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  let h = fs.readFileSync(file, 'utf8');
  const deTag = `<link rel="alternate" hreflang="de" href="${BASE}${de}" />`;
  const ruTag = `<link rel="alternate" hreflang="ru" href="${BASE}${ru}" />`;
  if (h.includes(deTag) && h.includes(ruTag)) {
    console.log('skip hreflang', en);
    continue;
  }
  const enLine = `<link rel="alternate" hreflang="en" href="${BASE}${en}" />`;
  let inject = '';
  if (!h.includes(deTag)) inject += deTag + '\n';
  if (!h.includes(ruTag)) inject += ruTag + '\n';
  h = h.replace(enLine, enLine + '\n' + inject.trim());
  fs.writeFileSync(file, h);
  console.log('hreflang', en);
}

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const m = sm.match(/const LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\);/);
const pilots = JSON.parse(m[1]);
for (const u of ['/de/best-visa/', '/ru/best-visa/', '/de/pattaya/', '/ru/pattaya/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 55 best-visa + pattaya — 306 URLs');
