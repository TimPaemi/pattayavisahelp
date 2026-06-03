/**
 * Sprint 49 — promote DE/RU compare pilots (hua-hin, hua-hin-deep, visa matrix).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'compare/pattaya-vs-hua-hin/index.html',
    locale: 'de/compare/pattaya-vs-hua-hin/index.html',
    article: 'de-pattaya-vs-hua-hin-article.html',
    lang: 'de',
    slug: '/de/compare/pattaya-vs-hua-hin/',
    title: 'Pattaya vs Hua Hin 2026 — Vergleich auf Deutsch',
    desc: 'Rente, Kosten, Strand, Immigration Jomtien vs Prachuap — Golfküste Ost vs West.',
    heroH1: 'Pattaya vs <span class="cy">Hua Hin.</span>',
    heroLede: 'Pattaya: Expat-Infrastruktur und Bangkok 90 Min. Hua Hin: Ruhe, bessere Strände, Golf — schwächere internationale Anbindung.',
    tldr: 'Pattaya: Scale + Immigration. Hua Hin: Ruhe + Golf.',
  },
  {
    en: 'compare/pattaya-vs-hua-hin/index.html',
    locale: 'ru/compare/pattaya-vs-hua-hin/index.html',
    article: 'ru-pattaya-vs-hua-hin-article.html',
    lang: 'ru',
    slug: '/ru/compare/pattaya-vs-hua-hin/',
    title: 'Паттайя vs Хуахин 2026 — сравнение на русском',
    desc: 'Пенсия, стоимость, пляж, иммиграция Джомтьен vs Прачуап — восток vs запад залива.',
    heroH1: 'Паттайя vs <span class="cy">Хуахин.</span>',
    heroLede: 'Паттайя: инфраструктура expat и BKK 90 мин. Хуахин: покой, пляж, гольф.',
    tldr: 'Паттайя: масштаб. Хуахин: тишина.',
  },
  {
    en: 'compare/pattaya-vs-hua-hin-deep/index.html',
    locale: 'de/compare/pattaya-vs-hua-hin-deep/index.html',
    article: 'de-pattaya-vs-hua-hin-deep-article.html',
    lang: 'de',
    slug: '/de/compare/pattaya-vs-hua-hin-deep/',
    title: 'Pattaya vs Hua Hin Deep Dive 2026 — Deutsch',
    desc: 'Langzeit-Rentner: Krankenhaus, Property, Golf, Immigration — Eastern Seaboard vs Gulf West.',
    heroH1: 'Pattaya vs Hua Hin — <span class="pk">Deep Dive.</span>',
    heroLede: 'Für 5–10 Jahre Aufenthalt: BHP vs BHH, Bangkok-Zugang, Golf-Kultur, 49% Condo-Quota.',
    tldr: 'Detail für Langzeit-Entscheidung.',
  },
  {
    en: 'compare/pattaya-vs-hua-hin-deep/index.html',
    locale: 'ru/compare/pattaya-vs-hua-hin-deep/index.html',
    article: 'ru-pattaya-vs-hua-hin-deep-article.html',
    lang: 'ru',
    slug: '/ru/compare/pattaya-vs-hua-hin-deep/',
    title: 'Паттайя vs Хуахин — глубокое сравнение на русском',
    desc: 'Long-stay: медицина, недвижимость, гольф, иммиграция — восточное побережье vs запад залива.',
    heroH1: 'Паттайя vs Хуахин — <span class="pk">deep dive.</span>',
    heroLede: 'Для решения на годы: BHP, доступ в BKK, гольф, quota 49%.',
    tldr: 'Детально для long-stay.',
  },
  {
    en: 'compare/visa-comparison-matrix/index.html',
    locale: 'de/compare/visa-comparison-matrix/index.html',
    article: 'de-visa-comparison-matrix-article.html',
    lang: 'de',
    slug: '/de/compare/visa-comparison-matrix/',
    title: 'Thailand Visa-Matrix 2026 — alle 12 Visa auf Deutsch',
    desc: 'Gültigkeit, Kosten, Finanzen, Steuer — Entscheidungsbaum und Pattaya-Fit.',
    heroH1: 'Visa-Matrix <span class="cy">2026.</span>',
    heroLede: 'Alle 12 Wege in einer Tabelle — dann Visa Finder oder Deep-Dive-Vergleiche.',
    tldr: '12 Visa · eine Tabelle · DE.',
  },
  {
    en: 'compare/visa-comparison-matrix/index.html',
    locale: 'ru/compare/visa-comparison-matrix/index.html',
    article: 'ru-visa-comparison-matrix-article.html',
    lang: 'ru',
    slug: '/ru/compare/visa-comparison-matrix/',
    title: 'Матрица виз Таиланда 2026 — 12 типов на русском',
    desc: 'Срок, стоимость, финансы, налоги — дерево решений и Паттайя.',
    heroH1: 'Матрица виз <span class="cy">2026.</span>',
    heroLede: '12 путей в одной таблице — затем Visa Finder или пары сравнений.',
    tldr: '12 виз · одна таблица · RU.',
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
  '/de/compare/pattaya-vs-hua-hin/', '/ru/compare/pattaya-vs-hua-hin/',
  '/de/compare/pattaya-vs-hua-hin-deep/', '/ru/compare/pattaya-vs-hua-hin-deep/',
  '/de/compare/visa-comparison-matrix/', '/ru/compare/visa-comparison-matrix/',
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
console.log('Sprint 49 compare pilots — 286 URLs');
