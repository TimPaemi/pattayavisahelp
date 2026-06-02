/**
 * Sprint 38 — promote DE/RU ED + Tourist TR pilots.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'visas/education-ed/index.html',
    locale: 'de/visas/education-ed/index.html',
    article: 'de-ed-article.html',
    lang: 'de',
    slug: '/de/visas/education-ed/',
    title: 'ED Bildungsvisum Thailand 2026 — auf Deutsch · Pattaya',
    desc: 'ED Visum 2026 auf Deutsch — MOE-Schule, Muay Thai, vierteljährliche Verlängerung Jomtien, Anwesenheitspflicht. Unabhängiger Leitfaden aus Pattaya.',
    heroH1: 'Non-<span class="pu">ED.</span> Studieren — <span class="cy">legal bleiben.</span>',
    heroLede:
      'Education-Visum für Sprachkurs, Muay Thai oder Universität — nur MOE-anerkannte Schulen. Vierteljährliche Verlängerung in Jomtien. Keine Arbeit — Remote = DTV.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"MOE-Schule prüfen?","acceptedAnswer":{"@type":"Answer","text":"moe.go.th und unser verify-moe-accredited-school Leitfaden."}},{"@type":"Question","name":"Arbeit auf ED?","acceptedAnswer":{"@type":"Answer","text":"Nein."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/education-ed/">ED-Bildungsvisum auf Deutsch</a>',
  },
  {
    en: 'visas/education-ed/index.html',
    locale: 'ru/visas/education-ed/index.html',
    article: 'ru-ed-article.html',
    lang: 'ru',
    slug: '/ru/visas/education-ed/',
    title: 'ED учебная виза Таиланд 2026 — на русском · Паттайя',
    desc: 'ED виза 2026 на русском — школа MOE, муай-тай, продление в Джомтьене каждые 90 дней, посещаемость. Независимый гид из Паттайи.',
    heroH1: 'Non-<span class="pu">ED.</span> Учёба — <span class="cy">легальный stay.</span>',
    heroLede:
      'Учебная виза: тайский, муай-тай, вуз — только MOE. Продление в Джомтьене. Работа запрещена; удалёнка — DTV.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Проверка MOE?","acceptedAnswer":{"@type":"Answer","text":"moe.go.th и наш гид verify-moe-accredited-school."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/education-ed/">ED на русском</a>',
  },
  {
    en: 'visas/tourist-tr-evisa/index.html',
    locale: 'de/visas/tourist-tr-evisa/index.html',
    article: 'de-tourist-article.html',
    lang: 'de',
    slug: '/de/visas/tourist-tr-evisa/',
    title: 'Tourist Visa TR Thailand 2026 — auf Deutsch · Pattaya',
    desc: 'Tourist TR 2026 auf Deutsch — 60+30 Tage, e-Visa, METV, Verlängerung Jomtien. Wann TR vs visa-exempt vs DTV. Leitfaden aus Pattaya.',
    heroH1: '<span class="pk">Tourist TR.</span> 60 + 30 = <span class="cy">90 Tage.</span>',
    heroLede:
      'Touristenvisum TR: 60 Tage Einreise, +30 in Jomtien. e-Visa online. Für längeren Aufenthalt DTV oder Non-O — nicht endlos TR verlängern.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Wie oft +30 Verlängerung?","acceptedAnswer":{"@type":"Answer","text":"Einmal pro 60-Tage-Stempel."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/visas/tourist-tr-evisa/">Tourist TR auf Deutsch</a>',
  },
  {
    en: 'visas/tourist-tr-evisa/index.html',
    locale: 'ru/visas/tourist-tr-evisa/index.html',
    article: 'ru-tourist-article.html',
    lang: 'ru',
    slug: '/ru/visas/tourist-tr-evisa/',
    title: 'Tourist Visa TR Таиланд 2026 — на русском · Паттайя',
    desc: 'Tourist TR 2026 на русском — 60+30 дней, e-Visa, METV, продление в Джомтьене. TR vs безвиз vs DTV. Независимый гид из Паттайи.',
    heroH1: '<span class="pk">Tourist TR.</span> 60 + 30 = <span class="cy">90 дней.</span>',
    heroLede:
      'Туристическая TR: 60 дней, +30 в иммиграции. e-Visa онлайн. Для долгого stay — DTV или Non-O, не бесконечный TR.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Сколько продлений +30?","acceptedAnswer":{"@type":"Answer","text":"Один раз на каждые 60 дней."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/visas/tourist-tr-evisa/">Tourist TR на русском</a>',
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

const enEd = path.join(ROOT, 'visas/education-ed/index.html');
let ed = fs.readFileSync(enEd, 'utf8');
ed = ed.replace(
  /Language: EN · <a href="\/de\/">Deutsch<\/a> · <a href="\/ru\/">Русский<\/a>[^<]*/,
  'Language: EN · <a href="/de/visas/education-ed/">Deutsch</a> · <a href="/ru/visas/education-ed/">Русский</a>'
);
fs.writeFileSync(enEd, ed);

const enTr = path.join(ROOT, 'visas/tourist-tr-evisa/index.html');
let tr = fs.readFileSync(enTr, 'utf8');
tr = tr.replace(
  /Language: EN · <a href="\/de\/">Deutsch<\/a> · <a href="\/ru\/">Русский<\/a>[^<]*/,
  'Language: EN · <a href="/de/visas/tourist-tr-evisa/">Deutsch</a> · <a href="/ru/visas/tourist-tr-evisa/">Русский</a>'
);
fs.writeFileSync(enTr, tr);

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
  '/de/visas/education-ed/',
  '/ru/visas/education-ed/',
  '/de/visas/tourist-tr-evisa/',
  '/ru/visas/tourist-tr-evisa/',
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 38 locale pilots done — 220 URLs');
