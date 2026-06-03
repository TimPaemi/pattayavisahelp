/**
 * Sprint 53 — promote DE/RU guides section hubs from EN pillar.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const HUBS = [
  {
    en: 'guides/index.html',
    locale: 'de/guides/index.html',
    article: 'de-guides-hub-article.html',
    lang: 'de',
    slug: '/de/guides/',
    title: 'Thailand Leitfäden Deutsch 2026 — Living Guides Hub',
    desc: '36+ Living Guides auf Deutsch navigiert: TM30, Jomtien, Steuer, Bank, PR — Links zu EN-Quellen und DE-Visa-Pilots.',
    heroH1: '<span class="pk">Leitfäden</span> — Living in Thailand.',
    heroLede: 'Compliance, Geld, Gesundheit, Pattaya — deutsche Navigation zu vollständigen Guides und indexierten Visa-Pilots.',
    tldr: 'EN-Guides nach Thema + DE Visa/Compare/Professions — Jomtien-Praxis.',
  },
  {
    en: 'guides/index.html',
    locale: 'ru/guides/index.html',
    article: 'ru-guides-hub-article.html',
    lang: 'ru',
    slug: '/ru/guides/',
    title: 'Гиды по жизни в Таиланде 2026 — хаб на русском',
    desc: '36+ гидов: TM30, Jomtien, налоги, банк, PR — навигация на EN и RU visa pilots.',
    heroH1: '<span class="pk">Гиды</span> — жизнь в Таиланде.',
    heroLede: 'Compliance, деньги, здоровье, Паттайя — русская навигация к полным EN-гидам и RU visa pilots.',
    tldr: 'EN-гиды по темам + RU визы/сравнения/профессии — Jomtien.',
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
  h = h.replace(/<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${p.heroLede}</p>`);
  if (p.tldr) {
    h = h.replace(/<p class="tldr-text">[\s\S]*?<\/p>/, `<p class="tldr-text">${p.tldr}</p>`);
  }
  h = h.replace(
    /<span>INDEPENDENT · NO COMMISSIONS<\/span>/,
    `<span>${p.lang === 'de' ? 'DEUTSCH · UNABHÄNGIG' : 'РУССКИЙ · НЕЗАВИСИМО'}</span>`
  );

  const mainRe = /<main id="main"[^>]*>[\s\S]*?<\/main>/;
  h = h.replace(mainRe, `<main id="main" class="article-body">\n${article}\n</main>`);
  h = h.replace(/locale-stub-banner[\s\S]*?<\/div>\s*/g, '');

  fs.mkdirSync(path.dirname(locPath), { recursive: true });
  fs.writeFileSync(locPath, h);
  console.log('promoted', p.locale);
}

for (const p of HUBS) promote(p);

const BASE = 'https://pattayavisahelp.com';
for (const { en, de, ru } of [
  { en: '/guides/', de: '/de/guides/', ru: '/ru/guides/' },
]) {
  const file = path.join(ROOT, 'guides/index.html');
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
for (const u of ['/de/guides/', '/ru/guides/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 53 guides hubs — 298 URLs');
