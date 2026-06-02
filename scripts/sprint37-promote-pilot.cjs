/**
 * Sprint 37 — promote DE/RU Non-B + SMART pilots.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'visas/business-non-b/index.html',
    locale: 'de/visas/business-non-b/index.html',
    article: 'de-non-b-article.html',
    lang: 'de',
    slug: '/de/visas/business-non-b/',
    title: 'Non-B Arbeitvisum Thailand 2026 — auf Deutsch · Pattaya',
    desc: 'Non-B 2026 auf Deutsch — Thai-Arbeitgeber, Work Permit, 4:1-Regel, Verlängerung Pattaya/EEC. Unabhängiger Leitfaden aus Jomtien.',
    heroH1: 'Non-B. Das <span class="pk">Arbeits</span>visum mit <span class="cy">Thai-Boss.</span>',
    heroLede:
      'Non-Immigrant B für bezahlte Arbeit bei thailändischem Arbeitgeber — 1 Jahr, jährlich verlängerbar, separates Work Permit Pflicht. Nicht für Remote ins Ausland.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Remote auf Non-B?","acceptedAnswer":{"@type":"Answer","text":"Nein — DTV oder LTR für Auslands-Remote."}},{"@type":"Question","name":"Work Permit Pflicht?","acceptedAnswer":{"@type":"Answer","text":"Ja — Ministry of Labour Bang Lamung."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/business-non-b/">Non-B Arbeitvisum auf Deutsch</a>',
    hubLink: {
      from: '<a href="/visas/marriage-non-o/">Marriage</a><a href="/visas/">All 12 →</a>',
      to: '<a href="/visas/marriage-non-o/">Marriage</a><a href="/de/visas/business-non-b/">Non-B (DE)</a><a href="/visas/business-non-b/">Non-B (EN)</a><a href="/visas/">All 12 →</a>',
    },
  },
  {
    en: 'visas/business-non-b/index.html',
    locale: 'ru/visas/business-non-b/index.html',
    article: 'ru-non-b-article.html',
    lang: 'ru',
    slug: '/ru/visas/business-non-b/',
    title: 'Non-B рабочая виза Таиланд 2026 — на русском · Паттайя',
    desc: 'Non-B 2026 на русском — тайский работодатель, work permit, правило 4:1, продление в Паттайе и EEC. Независимый гид из Джомтьена, без комиссий.',
    heroH1: 'Non-B. <span class="pk">Рабочая</span> виза с <span class="cy">тайским работодателем.</span>',
    heroLede:
      'Non-Immigrant B для официальной работы в тайской компании — 1 год, ежегодное продление, обязателен work permit. Не для удалёнки за рубеж.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Remote на Non-B?","acceptedAnswer":{"@type":"Answer","text":"Нет — DTV или LTR."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/business-non-b/">Non-B на русском</a>',
    hubLink: {
      from: '<a href="/visas/marriage-non-o/">Marriage</a><a href="/visas/">All 12 →</a>',
      to: '<a href="/visas/marriage-non-o/">Marriage</a><a href="/ru/visas/business-non-b/">Non-B (RU)</a><a href="/visas/business-non-b/">Non-B (EN)</a><a href="/visas/">All 12 →</a>',
    },
  },
  {
    en: 'visas/smart/index.html',
    locale: 'de/visas/smart/index.html',
    article: 'de-smart-article.html',
    lang: 'de',
    slug: '/de/visas/smart/',
    title: 'SMART Visa Thailand 2026 — auf Deutsch · Pattaya',
    desc: 'SMART Visa 2026 auf Deutsch — 4 Jahre, BOI, 13 Branchen, kein Work Permit. Tech-Talent und Executives. Leitfaden aus Pattaya.',
    heroH1: '<span class="cy">SMART.</span> BOI-Tech-Visum <span class="pu">ohne WP.</span>',
    heroLede:
      'SMART Visa — 4 Jahre für BOI-Talent, Executives und Startups in 13 Zielbranchen. Work Permit entfällt. Thai-Endorsement nötig — kein reines Remote-Visum.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Remote ohne Thai-Boss?","acceptedAnswer":{"@type":"Answer","text":"Nein — DTV oder LTR."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/smart/">SMART Visa auf Deutsch</a>',
    hubLink: {
      from: '<a href="/de/visas/business-non-b/">Non-B (DE)</a><a href="/visas/business-non-b/">Non-B (EN)</a><a href="/visas/">All 12 →</a>',
      to: '<a href="/de/visas/business-non-b/">Non-B (DE)</a><a href="/visas/business-non-b/">Non-B (EN)</a><a href="/de/visas/smart/">SMART (DE)</a><a href="/visas/smart/">SMART (EN)</a><a href="/visas/">All 12 →</a>',
    },
  },
  {
    en: 'visas/smart/index.html',
    locale: 'ru/visas/smart/index.html',
    article: 'ru-smart-article.html',
    lang: 'ru',
    slug: '/ru/visas/smart/',
    title: 'SMART Visa Таиланд 2026 — на русском · Паттайя',
    desc: 'SMART Visa 2026 на русском — 4 года BOI, 13 отраслей, без work permit, зарплата ฿200k+. Tech и стартапы. Независимый гид из Паттайи.',
    heroH1: '<span class="cy">SMART.</span> BOI-виза <span class="pu">без permit.</span>',
    heroLede:
      'SMART — 4 года для талантов BOI, топ-менеджеров и стартапов. Work permit не нужен. Нужен тайский endorsement — не для чистой удалёнки.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Remote без тайского босса?","acceptedAnswer":{"@type":"Answer","text":"Нет — DTV или LTR."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/smart/">SMART на русском</a>',
    hubLink: {
      from: '<a href="/ru/visas/business-non-b/">Non-B (RU)</a><a href="/visas/business-non-b/">Non-B (EN)</a><a href="/visas/">All 12 →</a>',
      to: '<a href="/ru/visas/business-non-b/">Non-B (RU)</a><a href="/visas/business-non-b/">Non-B (EN)</a><a href="/ru/visas/smart/">SMART (RU)</a><a href="/visas/smart/">SMART (EN)</a><a href="/visas/">All 12 →</a>',
    },
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

  h = h.replace(/<main id="main">[\s\S]*?<\/main>/, `<main id="main">\n${article}\n</main>`);
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
  if (fs.existsSync(hubPath) && p.hubBanner) {
    let hub = fs.readFileSync(hubPath, 'utf8');
    if (!hub.includes(p.slug)) {
      hub = hub.replace(
        '<header class="article-head">',
        `<p style="max-width:820px;margin:2rem auto 0;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.35);background:rgba(6,182,212,.08);border-radius:8px;font-size:.95rem">${p.hubBanner} (indexiert).</p>\n<header class="article-head">`
      );
    }
    if (p.hubLink && hub.includes(p.hubLink.from) && !hub.includes(p.hubLink.to.slice(0, 40))) {
      hub = hub.replace(p.hubLink.from, p.hubLink.to);
    }
    fs.writeFileSync(hubPath, hub);
  }
}

for (const p of PILOTS) promote(p);

const enNonB = path.join(ROOT, 'visas/business-non-b/index.html');
let nonB = fs.readFileSync(enNonB, 'utf8');
nonB = nonB.replace(
  /Language: EN · <a href="\/de\/">Deutsch<\/a> · <a href="\/ru\/">Русский<\/a>[^<]*/,
  'Language: EN · <a href="/de/visas/business-non-b/">Deutsch</a> · <a href="/ru/visas/business-non-b/">Русский</a>'
);
fs.writeFileSync(enNonB, nonB);

const enSmart = path.join(ROOT, 'visas/smart/index.html');
let smart = fs.readFileSync(enSmart, 'utf8');
smart = smart.replace(
  /Language: EN · <a href="\/de\/">Deutsch<\/a> · <a href="\/ru\/">Русский<\/a>[^<]*/,
  'Language: EN · <a href="/de/visas/smart/">Deutsch</a> · <a href="/ru/visas/smart/">Русский</a>'
);
fs.writeFileSync(enSmart, smart);

const ALL_PILOTS = [
  '/de/visas/dtv/',
  '/ru/visas/dtv/',
  '/de/visas/ltr/',
  '/ru/visas/ltr/',
  '/de/visas/retirement-non-o/',
  '/ru/visas/retirement-non-o/',
  '/de/visas/privilege-elite/',
  '/ru/visas/privilege-elite/',
  '/de/visas/marriage-non-o/',
  '/ru/visas/marriage-non-o/',
  '/de/visas/business-non-b/',
  '/ru/visas/business-non-b/',
  '/de/visas/smart/',
  '/ru/visas/smart/',
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 37 locale pilots done — 216 URLs');
