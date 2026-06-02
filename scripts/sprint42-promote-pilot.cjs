/**
 * Sprint 42 — promote DE/RU compare pilots (smart-vs-ltr, marriage-vs-retirement, dtv-vs-elite).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'compare/smart-vs-ltr/index.html',
    locale: 'de/compare/smart-vs-ltr/index.html',
    article: 'de-smart-vs-ltr-article.html',
    lang: 'de',
    slug: '/de/compare/smart-vs-ltr/',
    title: 'SMART vs LTR 2026 — Vergleich Deutsch · Pattaya',
    desc: 'SMART vs LTR 2026 auf Deutsch — Thai-Job vs Remote/Pension, Steuer, 4 vs 10 Jahre. BOI-Endorsement erklärt. Pattaya.',
    heroH1: 'SMART vs <span class="cy">LTR.</span> Premium-Status.',
    heroLede: 'Arbeit bei BOI-Firma oder Wealth/Remote mit 10 Jahren? Steuer und Sponsor entscheiden.',
    tldr: 'SMART: Thai-Arbeit. LTR: $80k+ Steuervorteil.',
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/compare/smart-vs-ltr/">SMART vs LTR (DE)</a>',
  },
  {
    en: 'compare/smart-vs-ltr/index.html',
    locale: 'ru/compare/smart-vs-ltr/index.html',
    article: 'ru-smart-vs-ltr-article.html',
    lang: 'ru',
    slug: '/ru/compare/smart-vs-ltr/',
    title: 'SMART vs LTR 2026 — сравнение · Паттайя',
    desc: 'SMART vs LTR 2026 на русском — работа в Таиланде vs удалёнка/пенсия, налоги, 4 vs 10 лет. Независимый гид.',
    heroH1: 'SMART vs <span class="cy">LTR.</span> Премиум.',
    heroLede: 'Зарплата в BOI-компании или LTR с льготой на зарубежный доход?',
    tldr: 'SMART: работа в TH. LTR: $80k+.',
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/compare/smart-vs-ltr/">SMART vs LTR (RU)</a>',
  },
  {
    en: 'compare/marriage-vs-retirement/index.html',
    locale: 'de/compare/marriage-vs-retirement/index.html',
    article: 'de-marriage-vs-retirement-article.html',
    lang: 'de',
    slug: '/de/compare/marriage-vs-retirement/',
    title: 'Marriage vs Retirement Non-O 2026 — Deutsch',
    desc: 'Marriage vs Retirement Non-O 2026 — ฿400k vs ฿800k, Thai-Ehe, Alter 50, Jomtien. Pattaya-Paare.',
    heroH1: 'Marriage vs <span class="pk">Retirement.</span> Non-O.',
    heroLede: 'Mit Thai verheiratet — 400k und Ehe-Docs. Ab 50 allein — 800k ohne Ehepartner-Stress.',
    tldr: 'Marriage: ฿400k. Retirement: 50+ und ฿800k.',
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/compare/marriage-vs-retirement/">Marriage vs Retirement (DE)</a>',
  },
  {
    en: 'compare/marriage-vs-retirement/index.html',
    locale: 'ru/compare/marriage-vs-retirement/index.html',
    article: 'ru-marriage-vs-retirement-article.html',
    lang: 'ru',
    slug: '/ru/compare/marriage-vs-retirement/',
    title: 'Marriage vs Retirement Non-O 2026 — русский',
    desc: 'Marriage vs Retirement 2026 — ฿400k vs ฿800k, брак с тайцем, 50 лет, Джомтьен. Паттайя.',
    heroH1: 'Marriage vs <span class="pk">Retirement.</span>',
    heroLede: 'Брак с тайцем — 400k. С 50 лет — 800k без документов супруги.',
    tldr: 'Marriage: ฿400k. Retirement: 50+.',
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/compare/marriage-vs-retirement/">Marriage vs Retirement (RU)</a>',
  },
  {
    en: 'compare/dtv-vs-elite/index.html',
    locale: 'de/compare/dtv-vs-elite/index.html',
    article: 'de-dtv-vs-elite-article.html',
    lang: 'de',
    slug: '/de/compare/dtv-vs-elite/',
    title: 'DTV vs Privilege Elite 2026 — Vergleich Deutsch',
    desc: 'DTV vs Thailand Privilege 2026 — ฿10k vs ฿900k, 180 Tage vs Ganzjahr, Nomade vs VIP. Pattaya.',
    heroH1: 'DTV vs <span class="cy">Privilege.</span>',
    heroLede: '฿10k Nomade oder ฿900k Mitgliedschaft mit Fast Track? Kosten pro Tag vs Komfort.',
    tldr: 'DTV: günstig, 180 Tage. Privilege: VIP, ganzjährig.',
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/compare/dtv-vs-elite/">DTV vs Privilege (DE)</a>',
  },
  {
    en: 'compare/dtv-vs-elite/index.html',
    locale: 'ru/compare/dtv-vs-elite/index.html',
    article: 'ru-dtv-vs-elite-article.html',
    lang: 'ru',
    slug: '/ru/compare/dtv-vs-elite/',
    title: 'DTV vs Privilege Elite 2026 — на русском',
    desc: 'DTV vs Privilege 2026 — ฿10k vs ฿900k, 180 дней vs круглый год, номад vs VIP. Паттайя.',
    heroH1: 'DTV vs <span class="cy">Privilege.</span>',
    heroLede: '฿10k номад или ฿900k членство с fast track?',
    tldr: 'DTV: дёшево. Privilege: VIP.',
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/compare/dtv-vs-elite/">DTV vs Privilege (RU)</a>',
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
  '/de/compare/smart-vs-ltr/', '/ru/compare/smart-vs-ltr/',
  '/de/compare/marriage-vs-retirement/', '/ru/compare/marriage-vs-retirement/',
  '/de/compare/dtv-vs-elite/', '/ru/compare/dtv-vs-elite/',
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 42 compare pilots — 244 URLs');
