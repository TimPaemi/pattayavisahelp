/**
 * Sprint 48 — promote DE/RU location compare pilots (bangkok, chiang-mai, phuket).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'compare/pattaya-vs-bangkok/index.html',
    locale: 'de/compare/pattaya-vs-bangkok/index.html',
    article: 'de-pattaya-vs-bangkok-article.html',
    lang: 'de',
    slug: '/de/compare/pattaya-vs-bangkok/',
    title: 'Pattaya vs Bangkok 2026 — Vergleich auf Deutsch',
    desc: 'Kosten, Gesundheit, Immigration Jomtien vs Chaeng Watthana — Long-Stay Expats Pattaya.',
    heroH1: 'Pattaya vs <span class="cy">Bangkok.</span>',
    heroLede: 'Bangkok: Top-Kliniken und Corporate-Jobs. Pattaya: Strand, niedrigere Miete, Jomtien Immigration — für viele Rentner und Remote-Arbeiter die bessere Basis.',
    tldr: 'Pattaya: Budget + Strand. Bangkok: Medizin + Job.',
  },
  {
    en: 'compare/pattaya-vs-bangkok/index.html',
    locale: 'ru/compare/pattaya-vs-bangkok/index.html',
    article: 'ru-pattaya-vs-bangkok-article.html',
    lang: 'ru',
    slug: '/ru/compare/pattaya-vs-bangkok/',
    title: 'Паттайя vs Бангкок 2026 — сравнение на русском',
    desc: 'Стоимость, медицина, иммиграция Джомтьен vs Чаэнг Ваттана — long-stay expats.',
    heroH1: 'Паттайя vs <span class="cy">Бангкок.</span>',
    heroLede: 'BKK: топ-клиники и корпорации. Паттайя: пляж, ниже аренда, иммиграция Soi 5.',
    tldr: 'Паттайя: бюджет. BKK: медицина.',
  },
  {
    en: 'compare/pattaya-vs-chiang-mai/index.html',
    locale: 'de/compare/pattaya-vs-chiang-mai/index.html',
    article: 'de-pattaya-vs-chiang-mai-article.html',
    lang: 'de',
    slug: '/de/compare/pattaya-vs-chiang-mai/',
    title: 'Pattaya vs Chiang Mai 2026 — Deutsch · Strand vs Nomad',
    desc: 'Digital Nomad CM vs Beach Pattaya — Klima, Co-Working, DTV, Jomtien Immigration.',
    heroH1: 'Pattaya vs <span class="pk">Chiang Mai.</span>',
    heroLede: 'Chiang Mai: Nomad-Ökosystem und kühle Saison. Pattaya: Meer, keine Smoke-Saison, Bangkok-Flughafen 90 Min.',
    tldr: 'CM: Nomads. Pattaya: Strand + Rentner.',
  },
  {
    en: 'compare/pattaya-vs-chiang-mai/index.html',
    locale: 'ru/compare/pattaya-vs-chiang-mai/index.html',
    article: 'ru-pattaya-vs-chiang-mai-article.html',
    lang: 'ru',
    slug: '/ru/compare/pattaya-vs-chiang-mai/',
    title: 'Паттайя vs Чиангмай 2026 — русский',
    desc: 'Nomad CM vs пляж Паттайя — климат, коворкинг, DTV, иммиграция.',
    heroH1: 'Паттайя vs <span class="pk">Чиангмай.</span>',
    heroLede: 'CM: nomads и прохлада. Паттайя: море, без дыма, BKK 90 мин.',
    tldr: 'CM: nomads. Паттайя: пляж.',
  },
  {
    en: 'compare/pattaya-vs-phuket/index.html',
    locale: 'de/compare/pattaya-vs-phuket/index.html',
    article: 'de-pattaya-vs-phuket-article.html',
    lang: 'de',
    slug: '/de/compare/pattaya-vs-phuket/',
    title: 'Pattaya vs Phuket 2026 — Vergleich Deutsch',
    desc: 'Zwei Strandstädte — Kosten, Community, Condo-Value, Immigration für Long-Stay.',
    heroH1: 'Pattaya vs <span class="cy">Phuket.</span>',
    heroLede: 'Phuket: Andaman-Ästhetik, höhere Preise. Pattaya: stabile Langzeit-Community, Bangkok-Nähe, besseres Condo-Value.',
    tldr: 'Pattaya: Value + BKK-Nähe. Phuket: Premium Strand.',
  },
  {
    en: 'compare/pattaya-vs-phuket/index.html',
    locale: 'ru/compare/pattaya-vs-phuket/index.html',
    article: 'ru-pattaya-vs-phuket-article.html',
    lang: 'ru',
    slug: '/ru/compare/pattaya-vs-phuket/',
    title: 'Паттайя vs Пхукет 2026 — на русском',
    desc: 'Два пляжных города — цены, community, кондо, иммиграция long-stay.',
    heroH1: 'Паттайя vs <span class="cy">Пхукет.</span>',
    heroLede: 'Пхукет: красивее андаман, дороже. Паттайя: long-stay база, близость BKK, выгоднее кондо.',
    tldr: 'Паттайя: value. Пхукет: premium.',
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
  '/de/compare/pattaya-vs-bangkok/', '/ru/compare/pattaya-vs-bangkok/',
  '/de/compare/pattaya-vs-chiang-mai/', '/ru/compare/pattaya-vs-chiang-mai/',
  '/de/compare/pattaya-vs-phuket/', '/ru/compare/pattaya-vs-phuket/',
  '/de/professions/content-creator/', '/ru/professions/content-creator/',
  '/de/professions/saas-founder/', '/ru/professions/saas-founder/',
  '/de/professions/online-business-owner/', '/ru/professions/online-business-owner/',
  '/de/professions/affiliate-marketer/', '/ru/professions/affiliate-marketer/',
  '/de/professions/crypto-trader/', '/ru/professions/crypto-trader/',
  '/de/professions/ai-engineer/', '/ru/professions/ai-engineer/',
  '/de/professions/english-teacher/', '/ru/professions/english-teacher/',
  '/de/professions/fitness-trainer/', '/ru/professions/fitness-trainer/',
  '/de/professions/diving-instructor/', '/ru/professions/diving-instructor/',
  '/de/professions/yoga-teacher/', '/ru/professions/yoga-teacher/',
  '/de/professions/photographer/', '/ru/professions/photographer/',
  '/de/professions/real-estate-agent/', '/ru/professions/real-estate-agent/',
  '/de/professions/chef/', '/ru/professions/chef/',
  '/de/professions/dj/', '/ru/professions/dj/',
  '/de/professions/hairdresser/', '/ru/professions/hairdresser/',
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 48 location compare pilots — 280 URLs');
