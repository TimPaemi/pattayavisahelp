/**
 * Sprint 36 — promote DE/RU Privilege + Marriage pilots (improved URL patching).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'visas/privilege-elite/index.html',
    locale: 'de/visas/privilege-elite/index.html',
    article: 'de-privilege-article.html',
    lang: 'de',
    slug: '/de/visas/privilege-elite/',
    title: 'Thailand Privilege Elite 2026 — Visum auf Deutsch · Pattaya',
    desc: 'Thailand Privilege 2026 auf Deutsch — 5–20 Jahre, ฿650K–5M, keine Einkommensprüfung, Bronze bis Reserve. Unabhängiger Leitfaden aus Pattaya.',
    heroH1: 'Thailand <span class="yl">Privilege.</span> Einmal zahlen, <span class="pu">lange bleiben.</span>',
    heroLede:
      'Thailand Privilege (ehemals Elite) — Pay-to-Stay ohne Einkommensnachweis: 5–20 Jahre, ฿650.000 bis ฿5.000.000, Concierge inklusive. Keine Arbeitserlaubnis.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Kann ich auf Privilege arbeiten?","acceptedAnswer":{"@type":"Answer","text":"Nein — nur Aufenthalt. Work Permit auf Privilege nicht möglich."}},{"@type":"Question","name":"90-Tage-Meldung?","acceptedAnswer":{"@type":"Answer","text":"Ja — TM47 weiterhin alle 90 Tage."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/privilege-elite/">Privilege Elite auf Deutsch</a>',
    hubLink: {
      from: '<a href="/visas/privilege-elite/">Privilege</a>',
      to: '<a href="/de/visas/privilege-elite/">Privilege (DE)</a><a href="/visas/privilege-elite/">Privilege (EN)</a>',
    },
  },
  {
    en: 'visas/privilege-elite/index.html',
    locale: 'ru/visas/privilege-elite/index.html',
    article: 'ru-privilege-article.html',
    lang: 'ru',
    slug: '/ru/visas/privilege-elite/',
    title: 'Thailand Privilege Elite 2026 — виза на русском · Паттайя',
    desc: 'Thailand Privilege 2026 на русском — 5–20 лет, ฿650K–5M, без проверки дохода. Bronze–Reserve. Независимый гид из Паттайи.',
    heroH1: 'Thailand <span class="yl">Privilege.</span> Заплатил — <span class="pu">живёшь годами.</span>',
    heroLede:
      'Thailand Privilege (бывший Elite) — виза без proof of income: 5–20 лет, от ฿650 000 до ฿5 000 000, консьерж. Работа запрещена.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Можно работать на Privilege?","acceptedAnswer":{"@type":"Answer","text":"Нет."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/privilege-elite/">Privilege Elite на русском</a>',
    hubLink: {
      from: '<a href="/visas/privilege-elite/">Privilege</a>',
      to: '<a href="/ru/visas/privilege-elite/">Privilege (RU)</a><a href="/visas/privilege-elite/">Privilege (EN)</a>',
    },
  },
  {
    en: 'visas/marriage-non-o/index.html',
    locale: 'de/visas/marriage-non-o/index.html',
    article: 'de-marriage-article.html',
    lang: 'de',
    slug: '/de/visas/marriage-non-o/',
    title: 'Non-O Ehe Thailand 2026 — Ehevisum auf Deutsch · Pattaya',
    desc: 'Non-O Ehe 2026 auf Deutsch — ฿400.000 oder ฿40.000/Monat, Work Permit möglich, Jomtien-Verlängerung. Leitfaden für Ausländer mit thailändischem Ehepartner.',
    heroH1: 'Ehe-<span class="pk">Non-O.</span> Mit Thai verheiratet? <span class="cy">Halbe Schwelle.</span>',
    heroLede:
      'Non-O für Ehe mit Thai — ฿400.000 Bank oder ฿40.000/Monat, kein Mindestalter, Work Permit möglich. Jährliche Verlängerung in Jomtien. Weg zur dauerhaften Aufenthaltserlaubnis.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Kann ich auf Ehe-Non-O arbeiten?","acceptedAnswer":{"@type":"Answer","text":"Mit separatem Work Permit ja — anders als Rentner-Non-O."}},{"@type":"Question","name":"Wie viel auf dem Konto?","acceptedAnswer":{"@type":"Answer","text":"฿400.000 mit 2 Monaten Seasoning."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/marriage-non-o/">Ehe-Non-O auf Deutsch</a>',
    hubLink: {
      from: '<a href="/visas/marriage-non-o/">Marriage</a>',
      to: '<a href="/de/visas/marriage-non-o/">Ehe (DE)</a><a href="/visas/marriage-non-o/">Marriage (EN)</a>',
    },
  },
  {
    en: 'visas/marriage-non-o/index.html',
    locale: 'ru/visas/marriage-non-o/index.html',
    article: 'ru-marriage-article.html',
    lang: 'ru',
    slug: '/ru/visas/marriage-non-o/',
    title: 'Non-O брак Таиланд 2026 — виза на русском · Паттайя',
    desc: 'Non-O по браку 2026 на русском — ฿400 000 или ฿40 000/мес, work permit возможен, продление в Джомтьене. Гид для иностранцев с супругом из Таиланда.',
    heroH1: 'Брак <span class="pk">Non-O.</span> Супруг из Таиланда? <span class="cy">Меньше порог.</span>',
    heroLede:
      'Non-O для брака с тайцем — ฿400 000 или ฿40 000/мес, без возрастного лимита, возможен work permit. Ежегодное продление в Джомтьене.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Можно работать?","acceptedAnswer":{"@type":"Answer","text":"С work permit — да."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/marriage-non-o/">Non-O по браку на русском</a>',
    hubLink: {
      from: '<a href="/visas/marriage-non-o/">Marriage</a>',
      to: '<a href="/ru/visas/marriage-non-o/">Брак (RU)</a><a href="/visas/marriage-non-o/">Marriage (EN)</a>',
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
    if (p.hubLink && hub.includes(p.hubLink.from) && !hub.includes(p.hubLink.to.slice(0, 30))) {
      hub = hub.replace(p.hubLink.from, p.hubLink.to);
    }
    fs.writeFileSync(hubPath, hub);
  }
}

for (const p of PILOTS) promote(p);

// EN lang switches
const enPriv = path.join(ROOT, 'visas/privilege-elite/index.html');
let priv = fs.readFileSync(enPriv, 'utf8');
priv = priv.replace(
  'Language: EN · <a href="/de/">Deutsch</a> · <a href="/ru/">Русский</a> — visa advice in German &amp; Russian',
  'Language: EN · <a href="/de/visas/privilege-elite/">Deutsch</a> · <a href="/ru/visas/privilege-elite/">Русский</a>'
);
fs.writeFileSync(enPriv, priv);

const enMar = path.join(ROOT, 'visas/marriage-non-o/index.html');
let mar = fs.readFileSync(enMar, 'utf8');
mar = mar.replace(
  /Language: EN · <a href="\/de\/">Deutsch<\/a> · <a href="\/ru\/">Русский<\/a>[^<]*/,
  'Language: EN · <a href="/de/visas/marriage-non-o/">Deutsch</a> · <a href="/ru/visas/marriage-non-o/">Русский</a>'
);
fs.writeFileSync(enMar, mar);

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
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 36 locale pilots done — 212 URLs');
