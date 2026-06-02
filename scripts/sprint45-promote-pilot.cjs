/**
 * Sprint 45 — promote DE/RU profession pilots (english-teacher, fitness-trainer, diving-instructor).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'professions/english-teacher/index.html',
    locale: 'de/professions/english-teacher/index.html',
    article: 'de-english-teacher-article.html',
    lang: 'de',
    slug: '/de/professions/english-teacher/',
    title: 'Thailand Visum Englischlehrer 2026 — Deutsch · Pattaya',
    desc: 'Schule Non-B vs ED vs Online-DTV — MOE, Work Permit, internationale Schulen Pattaya 2026.',
    heroH1: 'Visum für <span class="cy">Englischlehrer.</span>',
    heroLede: 'Thai-Schule? Non-B + Work Permit. Nur Auslandskunden online? DTV — nicht verwechseln.',
    tldr: 'Schule: Non-B. Online Ausland: DTV.',
  },
  {
    en: 'professions/english-teacher/index.html',
    locale: 'ru/professions/english-teacher/index.html',
    article: 'ru-english-teacher-article.html',
    lang: 'ru',
    slug: '/ru/professions/english-teacher/',
    title: 'Виза Таиланд для учителей английского 2026 — русский',
    desc: 'Школа Non-B vs ED vs DTV онлайн — MOE, work permit, международные школы Паттайи.',
    heroH1: 'Виза для <span class="cy">учителей английского.</span>',
    heroLede: 'Тайская школа? Non-B + permit. Только зарубежные ученики онлайн? DTV.',
    tldr: 'Школа: Non-B. Онлайн зарубеж: DTV.',
  },
  {
    en: 'professions/fitness-trainer/index.html',
    locale: 'de/professions/fitness-trainer/index.html',
    article: 'de-fitness-trainer-article.html',
    lang: 'de',
    slug: '/de/professions/fitness-trainer/',
    title: 'Thailand Visum Fitness Trainer 2026 — auf Deutsch',
    desc: 'Online-Coach DTV vs Gym Non-B + WP10 — ACE/NASM, Resort-Gyms Pattaya.',
    heroH1: 'Visum für <span class="pk">Fitness Trainer.</span>',
    heroLede: 'Auslandskunden online? DTV. Thai-Gym oder Resort? Non-B + Work Permit vom Arbeitgeber.',
    tldr: 'Online Ausland: DTV. Thai-Gym: Non-B.',
  },
  {
    en: 'professions/fitness-trainer/index.html',
    locale: 'ru/professions/fitness-trainer/index.html',
    article: 'ru-fitness-trainer-article.html',
    lang: 'ru',
    slug: '/ru/professions/fitness-trainer/',
    title: 'Виза Таиланд для фитнес-тренеров 2026 — русский',
    desc: 'Онлайн DTV vs зал Non-B + WP10 — сертификаты, отели Паттайи.',
    heroH1: 'Виза для <span class="pk">фитнес-тренеров.</span>',
    heroLede: 'Клиенты из-за рубежа онлайн? DTV. Тайский зал или отель? Non-B + work permit.',
    tldr: 'Онлайн: DTV. Зал в TH: Non-B.',
  },
  {
    en: 'professions/diving-instructor/index.html',
    locale: 'de/professions/diving-instructor/index.html',
    article: 'de-diving-instructor-article.html',
    lang: 'de',
    slug: '/de/professions/diving-instructor/',
    title: 'Thailand Visum Tauchlehrer 2026 — Deutsch · Pattaya',
    desc: 'Non-B + WP10 Pflicht am Zentrum — PADI, 4:1-Regel, DTV nur für Auslandseinkommen.',
    heroH1: 'Visum für <span class="cy">Tauchlehrer.</span>',
    heroLede: 'Unterricht in Thai-Tauchzentrum? Non-B + Work Permit — DTV ersetzt das nicht.',
    tldr: 'Tauchkurse TH: Non-B. DTV: nur Ausland.',
  },
  {
    en: 'professions/diving-instructor/index.html',
    locale: 'ru/professions/diving-instructor/index.html',
    article: 'ru-diving-instructor-article.html',
    lang: 'ru',
    slug: '/ru/professions/diving-instructor/',
    title: 'Виза Таиланд для инструкторов по дайвингу 2026',
    desc: 'Non-B + WP10 в центре — PADI, правило 4:1, DTV только для дохода из-за рубежа.',
    heroH1: 'Виза для <span class="cy">инструкторов по дайвингу.</span>',
    heroLede: 'Обучение в тайском центре? Non-B + work permit — DTV не заменяет.',
    tldr: 'Дайв в TH: Non-B. DTV: offshore.',
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
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 45 profession pilots — 262 URLs');
