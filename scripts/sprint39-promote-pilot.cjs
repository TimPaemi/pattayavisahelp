/**
 * Sprint 39 — promote DE/RU O-A, O-X, Media Non-M pilots (complete 12 pillars).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'visas/retirement-o-a/index.html',
    locale: 'de/visas/retirement-o-a/index.html',
    article: 'de-o-a-article.html',
    lang: 'de',
    slug: '/de/visas/retirement-o-a/',
    title: 'O-A Rentenvisum Thailand 2026 — auf Deutsch · Pattaya',
    desc: 'Non-O-A 2026 auf Deutsch — Konsulatsvisum 50+, ฿800K, Pflicht-Krankenversicherung, Multi-Entry, Verlängerung Jomtien. O-A vs Non-O erklärt.',
    heroH1: '<span class="pk">O-A Retirement.</span> Das <span class="cy">Botschafts-Visum.</span>',
    heroLede:
      'Non-Immigrant O-A: 1 Jahr Multi-Entry vor Abflug im Konsulat — 50+, Versicherungspflicht, ฿800K oder Pension. Jährlich Jomtien. Oft schlägt Non-O in Thailand.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"O-A in Thailand beantragen?","acceptedAnswer":{"@type":"Answer","text":"Erstausstellung im Ausland."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/retirement-o-a/">O-A Rentenvisum auf Deutsch</a>',
  },
  {
    en: 'visas/retirement-o-a/index.html',
    locale: 'ru/visas/retirement-o-a/index.html',
    article: 'ru-o-a-article.html',
    lang: 'ru',
    slug: '/ru/visas/retirement-o-a/',
    title: 'O-A пенсионная виза Таиланд 2026 — на русском · Паттайя',
    desc: 'Non-O-A 2026 на русском — виза в консульстве 50+, ฿800K, обязательная страховка, multi-entry, продление Джомтьен. O-A vs Non-O.',
    heroH1: '<span class="pk">O-A Retirement.</span> Виза через <span class="cy">консульство.</span>',
    heroLede:
      'O-A: год multi-entry до вылета — 50+, страховка, ฿800K или пенсия. Ежегодно Джомтьен. Часто проще Non-O в Таиланде.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"O-A в Таиланде?","acceptedAnswer":{"@type":"Answer","text":"Первично — только консульство."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/retirement-o-a/">O-A на русском</a>',
  },
  {
    en: 'visas/retirement-o-x/index.html',
    locale: 'de/visas/retirement-o-x/index.html',
    article: 'de-o-x-article.html',
    lang: 'de',
    slug: '/de/visas/retirement-o-x/',
    title: 'O-X Rentenvisum Thailand 2026 — 10 Jahre · Deutsch',
    desc: 'Non-O-X 2026 auf Deutsch — 10 Jahre (5+5), 14 Länder, ฿3M Deposit, Versicherung. Wann O-X vs Non-O vs LTR. Leitfaden Pattaya.',
    heroH1: '<span class="pk">O-X Retirement.</span> 10 Jahre, <span class="cy">große Kaution.</span>',
    heroLede:
      'O-X: 10-Jahres-Rente für 14 Nationalitäten — ฿3M auf Thai-Konto, Pflichtversicherung. Selten in Pattaya; meist Non-O oder LTR.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Deutschland berechtigt?","acceptedAnswer":{"@type":"Answer","text":"Ja — in der 14-Länder-Liste."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/retirement-o-x/">O-X 10-Jahres-Rente auf Deutsch</a>',
  },
  {
    en: 'visas/retirement-o-x/index.html',
    locale: 'ru/visas/retirement-o-x/index.html',
    article: 'ru-o-x-article.html',
    lang: 'ru',
    slug: '/ru/visas/retirement-o-x/',
    title: 'O-X пенсия Таиланд 2026 — 10 лет · русский',
    desc: 'Non-O-X 2026 на русском — 10 лет (5+5), 14 стран, ฿3M на счёте, страховка. РФ не в списке — Non-O или LTR. Независимый гид Паттайя.',
    heroH1: '<span class="pk">O-X.</span> 10 лет, <span class="cy">฿3M депозит.</span>',
    heroLede:
      'O-X: премиум-пенсия для 14 стран — 3M бат, страховка. Для России недоступен — смотрите Non-O или LTR.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Россия в списке?","acceptedAnswer":{"@type":"Answer","text":"Нет."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/retirement-o-x/">O-X на русском</a>',
  },
  {
    en: 'visas/media-non-m/index.html',
    locale: 'de/visas/media-non-m/index.html',
    article: 'de-media-article.html',
    lang: 'de',
    slug: '/de/visas/media-non-m/',
    title: 'Media Non-M Thailand 2026 — Pressevisum Deutsch',
    desc: 'Non-M Media 2026 auf Deutsch — Journalisten, PRD-Endorsement, Dokumentation, Work Permit für Medien. Nicht für Influencer. Pattaya-Leitfaden.',
    heroH1: '<span class="pk">Media Non-M.</span> Das <span class="cy">Presse-Visum.</span>',
    heroLede:
      'Non-Immigrant M für akkreditierte Journalisten und Doku-Crews — PRD-Freigabe vor dem Konsulat. Legal arbeiten als Presse, nicht als Vlogger.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"YouTuber?","acceptedAnswer":{"@type":"Answer","text":"Nein — DTV oder Tourist."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/media-non-m/">Media Non-M auf Deutsch</a>',
  },
  {
    en: 'visas/media-non-m/index.html',
    locale: 'ru/visas/media-non-m/index.html',
    article: 'ru-media-article.html',
    lang: 'ru',
    slug: '/ru/visas/media-non-m/',
    title: 'Media Non-M Таиланд 2026 — пресса на русском',
    desc: 'Non-M Media 2026 на русском — журналисты, одобрение PRD, документалистика, work permit для СМИ. Не для блогеров. Гид Паттайя.',
    heroH1: '<span class="pk">Media Non-M.</span> <span class="cy">Пресс-виза.</span>',
    heroLede:
      'Non-M для аккредитованных журналистов и съёмочных групп — одобрение PRD до консульства. Легальная медиа-работа, не инфлюенсер.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Блогер?","acceptedAnswer":{"@type":"Answer","text":"Нет — DTV."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/media-non-m/">Non-M на русском</a>',
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
  h = h.replace(
    /<span>INDEPENDENT · NO COMMISSIONS<\/span>/,
    `<span>${p.lang === 'de' ? 'DEUTSCH · UNABHÄNGIG' : 'РУССКИЙ · НЕЗАВИСИМО'}</span>`
  );

  const mainRe = /<main id="main">[\s\S]*?<\/main>/;
  if (mainRe.test(h)) {
    h = h.replace(mainRe, `<main id="main">\n${article}\n</main>`);
  }
  h = h.replace(/locale-stub-banner[\s\S]*?<\/div>\s*/g, '');

  if (p.faqSchema) {
    h = h.replace(
      /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema.org","@type":"FAQPage"[\s\S]*?<\/script>\s*/,
      `<script type="application/ld+json">\n${p.faqSchema}\n</script>\n`
    );
  }

  if (!h.includes('.network-context{')) {
    h = h.replace(
      '<style>',
      `<style>\n.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}\n`
    );
  }

  fs.mkdirSync(path.dirname(locPath), { recursive: true });
  fs.writeFileSync(locPath, h);
  console.log('promoted', p.locale);

  const hubPath = path.join(ROOT, `${p.lang}/index.html`);
  if (fs.existsSync(hubPath) && p.hubBanner && !fs.readFileSync(hubPath, 'utf8').includes(p.slug)) {
    let hub = fs.readFileSync(hubPath, 'utf8');
    hub = hub.replace(
      '<header class="article-head">',
      `<p style="max-width:820px;margin:2rem auto 0;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.35);background:rgba(6,182,212,.08);border-radius:8px;font-size:.95rem">${p.hubBanner} (indexiert).</p>\n<header class="article-head">`
    );
    fs.writeFileSync(hubPath, hub);
  }
}

for (const p of PILOTS) promote(p);

const enPaths = [
  ['visas/retirement-o-a/index.html', '/de/visas/retirement-o-a/', '/ru/visas/retirement-o-a/'],
  ['visas/retirement-o-x/index.html', '/de/visas/retirement-o-x/', '/ru/visas/retirement-o-x/'],
  ['visas/media-non-m/index.html', '/de/visas/media-non-m/', '/ru/visas/media-non-m/'],
];
for (const [rel, de, ru] of enPaths) {
  const f = path.join(ROOT, rel);
  let h = fs.readFileSync(f, 'utf8');
  h = h.replace(
    /Language: EN · <a href="\/de\/">Deutsch<\/a> · <a href="\/ru\/">Русский<\/a>[^<]*/,
    `Language: EN · <a href="${de}">Deutsch</a> · <a href="${ru}">Русский</a>`
  );
  fs.writeFileSync(f, h);
}

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
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 39 locale pilots done — 226 URLs (all 12 visa pillars)');
