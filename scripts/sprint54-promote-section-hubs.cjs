/**
 * Sprint 54 — promote DE/RU tools + glossary section hubs.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const HUBS = [
  {
    en: 'tools/index.html',
    locale: 'de/tools/index.html',
    article: 'de-tools-hub-article.html',
    lang: 'de',
    slug: '/de/tools/',
    title: 'Thailand Visa Tools Deutsch 2026 — 9 kostenlose Tools',
    desc: 'Visa Finder, Income Test, Bank Checker, Countdown — deutsche Navigation zu 9 EN-Tools und DE-Visa-Pilots.',
    heroH1: 'Kostenlose <span class="pk">Tools.</span> <span class="cy">Echte Antworten.</span>',
    heroLede: 'Neun interaktive Tools — Quiz, Kosten, Einkommen, Checkliste, Countdown — auf Englisch, Hub auf Deutsch.',
    heroClass: 'sub',
  },
  {
    en: 'tools/index.html',
    locale: 'ru/tools/index.html',
    article: 'ru-tools-hub-article.html',
    lang: 'ru',
    slug: '/ru/tools/',
    title: 'Visa tools Таиланд 2026 — 9 бесплатных инструментов RU',
    desc: 'Visa Finder, income test, bank checker — русская навигация к EN tools и RU visa pilots.',
    heroH1: 'Бесплатные <span class="pk">tools.</span> <span class="cy">Ответы.</span>',
    heroLede: '9 инструментов на английском — русский хаб с порядком использования и ссылками на RU визы.',
    heroClass: 'sub',
  },
  {
    en: 'glossary/index.html',
    locale: 'de/glossary/index.html',
    article: 'de-glossary-hub-article.html',
    lang: 'de',
    slug: '/de/glossary/',
    title: 'Thai Visa Glossar Deutsch 2026 — 36+ Begriffe',
    desc: 'TM30, DTV, LTR, BOI — deutsches Glossar-Hub mit Links zu EN-Definitionen und DE-Visa-Pilots.',
    heroH1: 'Thai-Visa-<br><span class="gradient">Begriffe auf Deutsch</span>',
    heroLede: 'Formulare, Visa-Typen, Behörden — Navigation zum vollständigen EN-Glossar und indexierten DE-Seiten.',
    heroClass: 'lede',
  },
  {
    en: 'glossary/index.html',
    locale: 'ru/glossary/index.html',
    article: 'ru-glossary-hub-article.html',
    lang: 'ru',
    slug: '/ru/glossary/',
    title: 'Глоссарий тайских виз 2026 — хаб на русском',
    desc: 'TM30, DTV, LTR, BOI — русский хаб терминов со ссылками на EN и RU visa pilots.',
    heroH1: 'Термины виз<br><span class="gradient">на русском</span>',
    heroLede: 'Формы, типы виз, ведомства — навигация к EN-глоссарию и RU pilots.',
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
  if (heroRe.test(h)) {
    h = h.replace(heroRe, `<p class="${p.heroClass}">${p.heroLede}</p>`);
  }

  if (h.includes('<p class="tldr-text">') && p.tldr) {
    h = h.replace(/<p class="tldr-text">[\s\S]*?<\/p>/, `<p class="tldr-text">${p.tldr}</p>`);
  }
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
  { en: '/tools/', de: '/de/tools/', ru: '/ru/tools/' },
  { en: '/glossary/', de: '/de/glossary/', ru: '/ru/glossary/' },
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
for (const u of ['/de/tools/', '/ru/tools/', '/de/glossary/', '/ru/glossary/']) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 54 tools + glossary hubs — 302 URLs');
