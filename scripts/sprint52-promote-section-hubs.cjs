/**
 * Sprint 52 — promote DE/RU section hubs (visas, compare, professions) from EN pillars.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const HUBS = [
  {
    en: 'visas/index.html',
    locale: 'de/visas/index.html',
    article: 'de-visas-hub-article.html',
    lang: 'de',
    slug: '/de/visas/',
    title: 'Thailand Visa Hub Deutsch 2026 — 12 Leitfäden',
    desc: 'Alle 12 Thailand-Visa auf Deutsch: DTV, LTR, Non-O, Ehe, ED, Non-B. Unabhängig aus Pattaya/Jomtien.',
    heroH1: 'Die <span class="pk">12 Visa</span> auf Deutsch.',
    heroLede: 'Vollständige indexierte Leitfäden — Kosten, Dokumente, Jomtien-Verlängerungen.',
    tldr: '12 Visa-Pilots DE — Matrix, Berufe und Beratung verlinkt.',
  },
  {
    en: 'visas/index.html',
    locale: 'ru/visas/index.html',
    article: 'ru-visas-hub-article.html',
    lang: 'ru',
    slug: '/ru/visas/',
    title: 'Визы Таиланда на русском 2026 — 12 гидов',
    desc: 'DTV, LTR, Non-O, брак, ED, Non-B — полные гиды на русском, Паттайя/Jomtien.',
    heroH1: '<span class="pk">12 виз</span> на русском.',
    heroLede: 'Полные индексированные гиды — fees, документы, продления Jomtien.',
    tldr: '12 виз RU — матрица, профессии, консультация.',
  },
  {
    en: 'compare/index.html',
    locale: 'de/compare/index.html',
    article: 'de-compare-hub-article.html',
    lang: 'de',
    slug: '/de/compare/',
    title: 'Visa-Vergleiche Deutsch 2026 — 15 Seiten',
    desc: '15 indexierte DE-Vergleiche: DTV vs LTR, Pattaya vs Bangkok, Visa-Matrix.',
    heroH1: '<span class="pk">Visa-Vergleiche</span> auf Deutsch.',
    heroLede: '15 indexierte Head-to-Head-Vergleiche und Stadtguides für Pattaya.',
    tldr: 'Matrix + DTV vs LTR + Pattaya vs Bangkok — alles DE indexiert.',
  },
  {
    en: 'compare/index.html',
    locale: 'ru/compare/index.html',
    article: 'ru-compare-hub-article.html',
    lang: 'ru',
    slug: '/ru/compare/',
    title: 'Сравнение виз Таиланд 2026 — 15 страниц RU',
    desc: '15 сравнений на русском: DTV vs LTR, Паттайя vs BKK, матрица 12 виз.',
    heroH1: '<span class="pk">Сравнения виз</span> на русском.',
    heroLede: '15 индексированных сравнений и городов для жителей Паттайи.',
    tldr: 'Матрица + DTV vs LTR + Паттайя vs BKK — RU в индексе.',
  },
  {
    en: 'professions/index.html',
    locale: 'de/professions/index.html',
    article: 'de-professions-hub-article.html',
    lang: 'de',
    slug: '/de/professions/',
    title: 'Beruf & Visum Thailand Deutsch — 16 Leitfäden',
    desc: '16 Berufe auf Deutsch: DTV, Non-B, WP, restricted occupations — Pattaya.',
    heroH1: '<span class="pk">Beruf & Visum</span> auf Deutsch.',
    heroLede: '16 indexierte Berufsleitfäden — nicht ein generischer Visa-Artikel.',
    tldr: 'Tauchlehrer bis Tattoo — jeder Beruf eigener DE-Guide.',
  },
  {
    en: 'professions/index.html',
    locale: 'ru/professions/index.html',
    article: 'ru-professions-hub-article.html',
    lang: 'ru',
    slug: '/ru/professions/',
    title: 'Профессия и виза Таиланд 2026 — 16 гидов RU',
    desc: '16 профессий на русском: DTV, Non-B, WP, restricted — Паттайя.',
    heroH1: '<span class="pk">Профессия и виза</span> на русском.',
    heroLede: '16 индексированных гидов по профессиям — не общая статья про визу.',
    tldr: 'Дайвинг, тату, remote — отдельный RU-гид на профессию.',
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

  if (!h.includes('.network-context{')) {
    h = h.replace(
      '<style>',
      `<style>\n.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}\n`
    );
  }

  fs.mkdirSync(path.dirname(locPath), { recursive: true });
  fs.writeFileSync(locPath, h);
  console.log('promoted', p.locale);
}

for (const p of HUBS) promote(p);

const BASE = 'https://pattayavisahelp.com';
const HREFLANG = [
  { en: '/visas/', de: '/de/visas/', ru: '/ru/visas/' },
  { en: '/compare/', de: '/de/compare/', ru: '/ru/compare/' },
  { en: '/professions/', de: '/de/professions/', ru: '/ru/professions/' },
];
for (const { en, de, ru } of HREFLANG) {
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
if (!m) throw new Error('LOCALE_INDEXED_PILOT not found');
const pilots = JSON.parse(m[1]);
const add = ['/de/visas/', '/ru/visas/', '/de/compare/', '/ru/compare/', '/de/professions/', '/ru/professions/'];
for (const u of add) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 52 section hubs — 296 URLs');
