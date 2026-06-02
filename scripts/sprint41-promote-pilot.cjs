/**
 * Sprint 41 — promote DE/RU compare pilots (non-o-vs-o-a, o-a-vs-o-x, dtv-vs-smart).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'compare/non-o-vs-o-a/index.html',
    locale: 'de/compare/non-o-vs-o-a/index.html',
    article: 'de-non-o-vs-o-a-article.html',
    lang: 'de',
    slug: '/de/compare/non-o-vs-o-a/',
    title: 'Non-O vs O-A Rentner 2026 — Vergleich Deutsch · Pattaya',
    desc: 'Non-O vs O-A 2026 auf Deutsch — Versicherungspflicht, Jomtien vs Konsulat, 800k, Wechsel. Unabhängiger Pattaya-Vergleich.',
    heroH1: 'Non-O vs <span class="pk">O-A.</span> Rentnerwahl.',
    heroLede: 'In Thailand verlängern ohne Pflichtversicherung — oder O-A mit ฿3M Police im Konsulat? Pattaya-Realität 2026.',
    tldr: 'Non-O: kein Insurance-Zwang. O-A: ฿3M Pflicht — oft ฿900k über 10 Jahre.',
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/compare/non-o-vs-o-a/">Non-O vs O-A (DE)</a>',
  },
  {
    en: 'compare/non-o-vs-o-a/index.html',
    locale: 'ru/compare/non-o-vs-o-a/index.html',
    article: 'ru-non-o-vs-o-a-article.html',
    lang: 'ru',
    slug: '/ru/compare/non-o-vs-o-a/',
    title: 'Non-O vs O-A пенсия 2026 — сравнение · Паттайя',
    desc: 'Non-O vs O-A 2026 на русском — страховка, Джомтьен vs консульство, 800k, переход. Независимый гид Паттайя.',
    heroH1: 'Non-O vs <span class="pk">O-A.</span> Пенсия.',
    heroLede: 'Продление в Таиланде без обязательной страховки — или O-A с ฿3M в консульстве?',
    tldr: 'Non-O: без обязательной страховки. O-A: ฿3M полис.',
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/compare/non-o-vs-o-a/">Non-O vs O-A (RU)</a>',
  },
  {
    en: 'compare/o-a-vs-o-x/index.html',
    locale: 'de/compare/o-a-vs-o-x/index.html',
    article: 'de-o-a-vs-o-x-article.html',
    lang: 'de',
    slug: '/de/compare/o-a-vs-o-x/',
    title: 'O-A vs O-X Rentenvisum 2026 — Deutsch · Pattaya',
    desc: 'O-A vs O-X 2026 auf Deutsch — ฿800k vs ฿3M, 1 Jahr vs 10 Jahre, 14 Länder, Versicherung. Pattaya-Leitfaden.',
    heroH1: 'O-A vs <span class="cy">O-X.</span> Konsulats-Rente.',
    heroLede: 'Standard 800k oder Premium 3M Deposit? Wer O-X wirklich braucht — und wer Non-O in Pattaya wählt.',
    tldr: 'O-A: ฿800k · weltweit. O-X: ฿3M · 14 Nationalitäten.',
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/compare/o-a-vs-o-x/">O-A vs O-X (DE)</a>',
  },
  {
    en: 'compare/o-a-vs-o-x/index.html',
    locale: 'ru/compare/o-a-vs-o-x/index.html',
    article: 'ru-o-a-vs-o-x-article.html',
    lang: 'ru',
    slug: '/ru/compare/o-a-vs-o-x/',
    title: 'O-A vs O-X пенсия 2026 — на русском · Паттайя',
    desc: 'O-A vs O-X 2026 на русском — ฿800k vs ฿3M, 1 год vs 10 лет, 14 стран, страховка. Гид Паттайя.',
    heroH1: 'O-A vs <span class="cy">O-X.</span> Через консульство.',
    heroLede: '800k или 3M депозит? Россияне: O-X обычно недоступен — смотрите Non-O.',
    tldr: 'O-A: ฿800k. O-X: ฿3M · 14 стран.',
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/compare/o-a-vs-o-x/">O-A vs O-X (RU)</a>',
  },
  {
    en: 'compare/dtv-vs-smart/index.html',
    locale: 'de/compare/dtv-vs-smart/index.html',
    article: 'de-dtv-vs-smart-article.html',
    lang: 'de',
    slug: '/de/compare/dtv-vs-smart/',
    title: 'DTV vs SMART 2026 — Tech-Visa Vergleich Deutsch',
    desc: 'DTV vs SMART 2026 auf Deutsch — Remote vs Thai-Arbeitgeber, BOI, ฿500k vs ฿200k Gehalt. Pattaya Nomaden.',
    heroH1: 'DTV vs <span class="cy">SMART.</span> Tech in Thailand.',
    heroLede: 'Nomade remote oder BOI-Angestellter? Pattaya-Freelancer fast immer DTV.',
    tldr: 'DTV: kein Sponsor. SMART: BOI + Thai-Job.',
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/compare/dtv-vs-smart/">DTV vs SMART (DE)</a>',
  },
  {
    en: 'compare/dtv-vs-smart/index.html',
    locale: 'ru/compare/dtv-vs-smart/index.html',
    article: 'ru-dtv-vs-smart-article.html',
    lang: 'ru',
    slug: '/ru/compare/dtv-vs-smart/',
    title: 'DTV vs SMART 2026 — сравнение на русском',
    desc: 'DTV vs SMART 2026 на русском — удалёнка vs тайский employer, BOI, ฿500k vs зарплата 200k+. Паттайя.',
    heroH1: 'DTV vs <span class="cy">SMART.</span> IT в Таиланде.',
    heroLede: 'Номад на зарубеж или зарплата в BOI-компании? В Паттайе почти всегда DTV.',
    tldr: 'DTV: без спонсора. SMART: BOI + работа.',
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/compare/dtv-vs-smart/">DTV vs SMART (RU)</a>',
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

for (const p of PILOTS) promote(p);

const ALL_PILOTS = [
  '/de/visas/dtv/', '/ru/visas/dtv/', '/de/visas/ltr/', '/ru/visas/ltr/',
  '/de/visas/retirement-non-o/', '/ru/visas/retirement-non-o/',
  '/de/visas/privilege-elite/', '/ru/visas/privilege-elite/',
  '/de/visas/marriage-non-o/', '/ru/visas/marriage-non-o/',
  '/de/visas/business-non-b/', '/ru/visas/business-non-b/',
  '/de/visas/smart/', '/ru/visas/smart/',
  '/de/visas/education-ed/', '/ru/visas/education-ed/',
  '/de/visas/tourist-tr-evisa/', '/ru/visas/tourist-tr-evisa/',
  '/de/visas/retirement-o-a/', '/ru/visas/retirement-o-a/',
  '/de/visas/retirement-o-x/', '/ru/visas/retirement-o-x/',
  '/de/visas/media-non-m/', '/ru/visas/media-non-m/',
  '/de/compare/dtv-vs-ltr/', '/ru/compare/dtv-vs-ltr/',
  '/de/compare/ed-vs-dtv/', '/ru/compare/ed-vs-dtv/',
  '/de/compare/privilege-vs-ltr/', '/ru/compare/privilege-vs-ltr/',
  '/de/compare/non-o-vs-o-a/', '/ru/compare/non-o-vs-o-a/',
  '/de/compare/o-a-vs-o-x/', '/ru/compare/o-a-vs-o-x/',
  '/de/compare/dtv-vs-smart/', '/ru/compare/dtv-vs-smart/',
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 41 compare pilots — 238 URLs');
