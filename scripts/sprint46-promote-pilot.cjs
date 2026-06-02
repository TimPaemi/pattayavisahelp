/**
 * Sprint 46 — promote DE/RU profession pilots (yoga-teacher, photographer, real-estate-agent).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'professions/yoga-teacher/index.html',
    locale: 'de/professions/yoga-teacher/index.html',
    article: 'de-yoga-teacher-article.html',
    lang: 'de',
    slug: '/de/professions/yoga-teacher/',
    title: 'Thailand Visum Yoga-Lehrer 2026 — Deutsch · Pattaya',
    desc: 'Resort Non-B vs DTV Online-Kurse — RYT-200/500, Wellness-Jobs Pattaya 2026.',
    heroH1: 'Visum für <span class="cy">Yoga-Lehrer.</span>',
    heroLede: 'Unterricht im Thai-Resort oder Studio? Non-B + Work Permit. Nur Auslandskunden online? DTV.',
    tldr: 'Resort TH: Non-B. Online Ausland: DTV.',
  },
  {
    en: 'professions/yoga-teacher/index.html',
    locale: 'ru/professions/yoga-teacher/index.html',
    article: 'ru-yoga-teacher-article.html',
    lang: 'ru',
    slug: '/ru/professions/yoga-teacher/',
    title: 'Виза Таиланд для инструкторов йоги 2026 — русский',
    desc: 'Resort Non-B vs DTV онлайн — RYT, wellness Паттайи 2026.',
    heroH1: 'Виза для <span class="cy">инструкторов йоги.</span>',
    heroLede: 'Классы в тайском resort? Non-B + work permit. Только зарубежные ученики онлайн? DTV.',
    tldr: 'Resort в TH: Non-B. Онлайн: DTV.',
  },
  {
    en: 'professions/photographer/index.html',
    locale: 'de/professions/photographer/index.html',
    article: 'de-photographer-article.html',
    lang: 'de',
    slug: '/de/professions/photographer/',
    title: 'Thailand Visum Fotograf & Videograf 2026 — Deutsch',
    desc: 'Hochzeit Pattaya — DTV Auslandskunden vs Non-B Thai-Kunden, CAAT Drohne.',
    heroH1: 'Visum für <span class="pk">Fotografen.</span>',
    heroLede: 'Bezahlte Shoots für Thai-Firma oder Brautpaar in TH? Non-B. Nur EU/US-Kunden mit Auslandszahlung? DTV.',
    tldr: 'Thai-Kunde: Non-B. Ausland: DTV.',
  },
  {
    en: 'professions/photographer/index.html',
    locale: 'ru/professions/photographer/index.html',
    article: 'ru-photographer-article.html',
    lang: 'ru',
    slug: '/ru/professions/photographer/',
    title: 'Виза Таиланд для фотографов 2026 — русский',
    desc: 'Свадьбы Паттайи — DTV vs Non-B, дрон CAAT, тайские vs зарубежные клиенты.',
    heroH1: 'Виза для <span class="pk">фотографов.</span>',
    heroLede: 'Оплата тайской фирме или свадьбе в TH? Non-B. Только клиенты из-за рубежа? DTV.',
    tldr: 'Тайский клиент: Non-B. Зарубеж: DTV.',
  },
  {
    en: 'professions/real-estate-agent/index.html',
    locale: 'de/professions/real-estate-agent/index.html',
    article: 'de-real-estate-agent-article.html',
    lang: 'de',
    slug: '/de/professions/real-estate-agent/',
    title: 'Thailand Visum Immobilienmakler 2026 — Pattaya',
    desc: 'Restricted occupation — Agentur Non-B, Ltd ฿2M, DTV nur Referral ohne Showings.',
    heroH1: 'Visum für <span class="cy">Immobilienmakler.</span>',
    heroLede: 'Besichtigungen und Provision in TH? Non-B über Thai-Ltd. Nur Online-Marketing für Ausländer? DTV mit klaren Grenzen.',
    tldr: 'Showings TH: Non-B. Nur Referral: DTV.',
  },
  {
    en: 'professions/real-estate-agent/index.html',
    locale: 'ru/professions/real-estate-agent/index.html',
    article: 'ru-real-estate-agent-article.html',
    lang: 'ru',
    slug: '/ru/professions/real-estate-agent/',
    title: 'Виза Таиланд для риелторов 2026 — Паттайя',
    desc: 'Restricted occupation — Non-B агентство, Ltd, DTV только referral без показов.',
    heroH1: 'Виза для <span class="cy">риелторов.</span>',
    heroLede: 'Показы и комиссия в TH? Non-B через Thai Ltd. Только маркетинг для expat? DTV с границами.',
    tldr: 'Показы в TH: Non-B. Referral: DTV.',
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
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 46 profession pilots — 268 URLs');
