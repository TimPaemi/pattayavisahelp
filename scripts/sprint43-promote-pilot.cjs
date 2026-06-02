/**
 * Sprint 43 — promote DE/RU profession pilots (content-creator, saas-founder, online-business-owner).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'professions/content-creator/index.html',
    locale: 'de/professions/content-creator/index.html',
    article: 'de-content-creator-article.html',
    lang: 'de',
    slug: '/de/professions/content-creator/',
    title: 'Thailand Visum Content Creator & YouTuber 2026 — Deutsch',
    desc: 'YouTube, TikTok, AdSense — DTV vs LTR mit Royal Decree 743 Steuerlogik. Pattaya Creator-Guide auf Deutsch.',
    heroH1: 'Visum für <span class="cy">Content Creator</span> &amp; YouTuber.',
    heroLede: 'Plattform-Einkommen aus dem Ausland? DTV für die meisten — LTR ab $80k+ für Steueroptimierung in Pattaya.',
    tldr: 'DTV: Plattform-Geld aus dem Ausland. LTR: $80k+ und RD 743.',
  },
  {
    en: 'professions/content-creator/index.html',
    locale: 'ru/professions/content-creator/index.html',
    article: 'ru-content-creator-article.html',
    lang: 'ru',
    slug: '/ru/professions/content-creator/',
    title: 'Виза Таиланд для блогеров и YouTube 2026 — русский',
    desc: 'YouTube, TikTok, AdSense — DTV vs LTR и Royal Decree 743. Гид для креаторов в Паттайе на русском.',
    heroH1: 'Виза для <span class="cy">креаторов</span> и YouTube.',
    heroLede: 'Доход с зарубежных платформ? DTV для большинства — LTR от $80k+ для налоговой оптимизации.',
    tldr: 'DTV: доход из-за рубежа. LTR: $80k+ и RD 743.',
  },
  {
    en: 'professions/saas-founder/index.html',
    locale: 'de/professions/saas-founder/index.html',
    article: 'de-saas-founder-article.html',
    lang: 'de',
    slug: '/de/professions/saas-founder/',
    title: 'Thailand Visum SaaS Founder 2026 — auf Deutsch · Pattaya',
    desc: 'SaaS mit Auslands-Firma — DTV, SMART-S, LTR. MRR-Nachweise, Steuer, Thai-Ltd wenn TH-Markt. Pattaya.',
    heroH1: 'Visum für <span class="cy">SaaS Founder.</span>',
    heroLede: 'Delaware oder Singapore Pte + globale Kunden? DTV-Standard — SMART oder LTR bei Skalierung.',
    tldr: 'DTV: Auslands-Incorporation. SMART/LTR bei BOI oder $80k+.',
  },
  {
    en: 'professions/saas-founder/index.html',
    locale: 'ru/professions/saas-founder/index.html',
    article: 'ru-saas-founder-article.html',
    lang: 'ru',
    slug: '/ru/professions/saas-founder/',
    title: 'Виза Таиланд для SaaS founder 2026 — на русском · Паттайя',
    desc: 'SaaS с offshore — DTV, SMART-S, LTR. MRR, налоги, тайская компания для рынка TH. Независимый гид.',
    heroH1: 'Виза для <span class="cy">SaaS founder.</span>',
    heroLede: 'Компания за рубежом и глобальные клиенты? DTV по умолчанию — SMART или LTR при росте.',
    tldr: 'DTV: offshore. SMART/LTR при BOI или $80k+.',
  },
  {
    en: 'professions/online-business-owner/index.html',
    locale: 'de/professions/online-business-owner/index.html',
    article: 'de-online-business-owner-article.html',
    lang: 'de',
    slug: '/de/professions/online-business-owner/',
    title: 'Thailand Visum Online Business Owner 2026 — Deutsch',
    desc: 'E-Commerce, Agentur, Kurse — DTV, LTR, Thai-Ltd, Privilege. Steuer 2024, Pattaya-Kosten. Unabhängig.',
    heroH1: 'Visum für <span class="pk">Online Business</span> Owner.',
    heroLede: 'Auslands-Firma und Auslandskunden? DTV — Thai-Markt braucht Ltd + Non-B oder LTR bei Umsatz.',
    tldr: 'DTV: offshore. Ltd + Non-B für Thailand-Markt.',
  },
  {
    en: 'professions/online-business-owner/index.html',
    locale: 'ru/professions/online-business-owner/index.html',
    article: 'ru-online-business-owner-article.html',
    lang: 'ru',
    slug: '/ru/professions/online-business-owner/',
    title: 'Виза Таиланд online business 2026 — русский · Паттайя',
    desc: 'E-commerce, агентства, курсы — DTV, LTR, тайская Ltd, Privilege. Налоги 2024, Паттайя.',
    heroH1: 'Виза для <span class="pk">online business.</span>',
    heroLede: 'Компания за рубежом? DTV — рынок TH требует Ltd + Non-B или LTR при обороте.',
    tldr: 'DTV: offshore. Ltd + Non-B для TH.',
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
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 43 profession pilots — 250 URLs');
