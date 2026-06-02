/**
 * Sprint 35 — promote DE/RU LTR + Non-O retirement pilots (full EN chrome + translated main).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'visas/ltr/index.html',
    locale: 'de/visas/ltr/index.html',
    article: 'de-ltr-article.html',
    lang: 'de',
    slug: '/de/visas/ltr/',
    title: 'LTR Visum Thailand 2026 — 10 Jahre, Steuerbefreiung · Pattaya',
    desc: 'LTR Thailand 2026 auf Deutsch — 10 Jahre Aufenthalt, Royal Decree 743, 4 Kategorien, ฿50.000 Gebühr, BOI-Antrag. Vollständiger Leitfaden aus Pattaya.',
    heroH1: 'LTR. <span class="pk">10 Jahre</span> mit <span class="cy">Steuervorteil</span>.',
    heroLede:
      'Long-Term Resident über die BOI — 10 Jahre (5+5), vier Kategorien, Auslandseinkommen oft steuerfrei (W/P/T) nach Royal Decree 743. Für Antragsteller mit 80.000 USD/Jahr und langfristigem Pattaya-Aufenthalt.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Ist LTR automatisch steuerfrei?","acceptedAnswer":{"@type":"Answer","text":"Nein — Royal Decree 743 muss beim Revenue Department beantragt werden. Nur W, P, T."}},{"@type":"Question","name":"Wie lange dauert LTR?","acceptedAnswer":{"@type":"Answer","text":"3–6 Monate BOI-Bearbeitung."}},{"@type":"Question","name":"LTR vs DTV?","acceptedAnswer":{"@type":"Answer","text":"LTR: höhere Gebühr, $80k Einkommen, Steuervorteil. DTV: ฿500K Seasoning, schneller."}}]}`,
    hubBanner:
      '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/ltr/">Vollständiger LTR-Leitfaden auf Deutsch</a>',
    hubLink: { from: '<a href="/visas/ltr/">LTR</a>', to: '<a href="/de/visas/ltr/">LTR (DE)</a><a href="/visas/ltr/">LTR (EN)</a>' },
  },
  {
    en: 'visas/ltr/index.html',
    locale: 'ru/visas/ltr/index.html',
    article: 'ru-ltr-article.html',
    lang: 'ru',
    slug: '/ru/visas/ltr/',
    title: 'LTR Таиланд 2026 — 10 лет, налоги · Паттайя',
    desc: 'LTR Таиланд 2026 на русском — 10 лет, Royal Decree 743, 4 категории, ฿50 000, заявка BOI. Полный гид для удалёнщиков и пенсионеров в Паттайе.',
    heroH1: 'LTR. <span class="pk">10 лет</span> и <span class="cy">налоговый</span> статус.',
    heroLede:
      'Long-Term Resident через BOI — 10 лет (5+5), четыре категории, освобождение иностранного дохода для W/P/T по Royal Decree 743. Для дохода от $80 000/год.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"LTR освобождает от налогов?","acceptedAnswer":{"@type":"Answer","text":"Только после заявления R.D. 743 для W, P, T."}},{"@type":"Question","name":"Срок рассмотрения?","acceptedAnswer":{"@type":"Answer","text":"3–6 месяцев."}}]}`,
    hubBanner:
      '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/ltr/">Полный гид LTR на русском</a>',
    hubLink: { from: '<a href="/visas/ltr/">LTR</a>', to: '<a href="/ru/visas/ltr/">LTR (RU)</a><a href="/visas/ltr/">LTR (EN)</a>' },
  },
  {
    en: 'visas/retirement-non-o/index.html',
    locale: 'de/visas/retirement-non-o/index.html',
    article: 'de-non-o-article.html',
    lang: 'de',
    slug: '/de/visas/retirement-non-o/',
    title: 'Non-O Retirement Thailand 2026 — Rentenvisum · Pattaya',
    desc: 'Non-O Retirement 2026 auf Deutsch — ฿800.000 Bank oder ฿65.000/Monat, Jomtien-Verlängerung ฿1.900, Schritt-für-Schritt für Rentner in Pattaya.',
    heroH1: 'Non-O. <span class="pk">Rentner</span> in <span class="cy">Pattaya</span>.',
    heroLede:
      'Das klassische 1-Jahres-Rentenvisum ab 50 — ฿800.000 Seasoning oder ฿65.000/Monat Einkommen, jährliche Verlängerung in Jomtien für ฿1.900. Der Standard für Pattaya-Rentner.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Brauche ich Krankenversicherung auf Non-O?","acceptedAnswer":{"@type":"Answer","text":"Für In-Country Non-O Retirement nicht Pflicht — anders als O-A."}},{"@type":"Question","name":"Wie viel Bankguthaben?","acceptedAnswer":{"@type":"Answer","text":"฿800.000 mit 2 Monaten Seasoning, ฿400.000 Minimum im Visajahr."}}]}`,
    hubBanner:
      '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/retirement-non-o/">Non-O Retirement auf Deutsch</a>',
    hubLink: {
      from: '<a href="/visas/retirement-non-o/">Retirement</a>',
      to: '<a href="/de/visas/retirement-non-o/">Rentner (DE)</a><a href="/visas/retirement-non-o/">Retirement (EN)</a>',
    },
  },
  {
    en: 'visas/retirement-non-o/index.html',
    locale: 'ru/visas/retirement-non-o/index.html',
    article: 'ru-non-o-article.html',
    lang: 'ru',
    slug: '/ru/visas/retirement-non-o/',
    title: 'Non-O Retirement Таиланд 2026 — пенсионная виза · Паттайя',
    desc: 'Non-O Retirement 2026 на русском — ฿800 000 в банке или ฿65 000/мес, продление в Джомтьене ฿1 900. Пошаговый гид для пенсионеров в Паттайе.',
    heroH1: 'Non-O. <span class="pk">Пенсия</span> в <span class="cy">Паттайе</span>.',
    heroLede:
      'Классическая годовая пенсионная виза с 50 лет — ฿800 000 seasoning или ฿65 000/мес дохода, продление в Джомтьене за ฿1 900.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Нужна ли страховка?","acceptedAnswer":{"@type":"Answer","text":"Для Non-O в Таиланде не обязательна."}},{"@type":"Question","name":"Сколько в банке?","acceptedAnswer":{"@type":"Answer","text":"฿800 000, 2 месяца seasoning, минимум ฿400 000 в году."}}]}`,
    hubBanner:
      '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/retirement-non-o/">Non-O Retirement на русском</a>',
    hubLink: {
      from: '<a href="/visas/retirement-non-o/">Retirement</a>',
      to: '<a href="/ru/visas/retirement-non-o/">Пенсия (RU)</a><a href="/visas/retirement-non-o/">Retirement (EN)</a>',
    },
  },
];

function promote(p) {
  const enPath = path.join(ROOT, p.en);
  const locPath = path.join(ROOT, p.locale);
  const article = fs.readFileSync(path.join(__dirname, 'content', p.article), 'utf8');
  let h = fs.readFileSync(enPath, 'utf8');

  const enSlug = '/' + p.en.replace('/index.html', '/') ;
  h = h.replace(/<html lang="en">/, `<html lang="${p.lang}">`);
  h = h.replace(new RegExp(enSlug.replace(/\//g, '\\/'), 'g'), p.slug);
  h = h.replace(/https:\/\/pattayavisahelp\.com\/visas\/ltr\//g, `https://pattayavisahelp.com${p.slug}`);
  h = h.replace(/https:\/\/pattayavisahelp\.com\/visas\/retirement-non-o\//g, `https://pattayavisahelp.com${p.slug}`);

  h = h.replace(/<title>[^<]*<\/title>/, `<title>${p.title}</title>`);
  h = h.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${p.desc}"`);
  h = h.replace(/content="index,follow[^"]*"/, 'content="index,follow,max-image-preview:large,max-snippet:-1"');
  h = h.replace(/content="noindex[^"]*"/, 'content="index,follow,max-image-preview:large,max-snippet:-1"');

  if (!h.includes(`hreflang="${p.lang}"`)) {
    h = h.replace(
      '<link rel="alternate" hreflang="en"',
      `<link rel="alternate" hreflang="${p.lang}" href="https://pattayavisahelp.com${p.slug}" />\n<link rel="alternate" hreflang="en"`
    );
  }

  h = h.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${p.heroH1}</h1>`);
  h = h.replace(/<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${p.heroLede}</p>`);
  h = h.replace(/<span>INDEPENDENT · NO COMMISSIONS<\/span>/, `<span>${p.lang === 'de' ? 'DEUTSCH · UNABHÄNGIG' : 'РУССКИЙ · НЕЗАВИСИМО'}</span>`);

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
  if (fs.existsSync(hubPath)) {
    let hub = fs.readFileSync(hubPath, 'utf8');
    if (!hub.includes(p.hubBanner)) {
      hub = hub.replace(
        '<header class="article-head">',
        `<p style="max-width:820px;margin:2rem auto 0;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.35);background:rgba(6,182,212,.08);border-radius:8px;font-size:.95rem">${p.hubBanner} (indexiert).</p>\n<header class="article-head">`
      );
    }
    if (hub.includes(p.hubLink.from) && !hub.includes(p.hubLink.to.split('<a')[1])) {
      hub = hub.replace(p.hubLink.from, p.hubLink.to);
    }
    fs.writeFileSync(hubPath, hub);
  }
}

for (const p of PILOTS) promote(p);

// EN lang switches
const enLtr = path.join(ROOT, 'visas/ltr/index.html');
let ltr = fs.readFileSync(enLtr, 'utf8');
ltr = ltr.replace(
  'Language: EN · <a href="/de/">Deutsch</a> · <a href="/ru/">Русский</a> — visa advice in German &amp; Russian',
  'Language: EN · <a href="/de/visas/ltr/">Deutsch (LTR)</a> · <a href="/ru/visas/ltr/">Русский (LTR)</a>'
);
fs.writeFileSync(enLtr, ltr);

const enNonO = path.join(ROOT, 'visas/retirement-non-o/index.html');
let nono = fs.readFileSync(enNonO, 'utf8');
if (!nono.includes('/de/visas/retirement-non-o/')) {
  nono = nono.replace(
    /<p class="lang-switch"[^>]*>[\s\S]*?<\/p>/,
    '<p class="lang-switch" style="font:600 .72rem \'JetBrains Mono\',\'JetBrains Mono Fallback\',ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--tl);margin:0 0 1.25rem">Language: EN · <a href="/de/visas/retirement-non-o/">Deutsch</a> · <a href="/ru/visas/retirement-non-o/">Русский</a></p>'
  );
}
fs.writeFileSync(enNonO, nono);

// Sitemap pilots
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const pilots = [
  '/de/visas/dtv/',
  '/ru/visas/dtv/',
  '/de/visas/ltr/',
  '/ru/visas/ltr/',
  '/de/visas/retirement-non-o/',
  '/ru/visas/retirement-non-o/',
];
if (!sm.includes('/de/visas/ltr/')) {
  sm = sm.replace(
    /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
    `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
  );
  fs.writeFileSync(smPath, sm);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 35 locale pilots done');
