/**
 * Sprint 44 — promote DE/RU profession pilots (affiliate-marketer, crypto-trader, ai-engineer).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'professions/affiliate-marketer/index.html',
    locale: 'de/professions/affiliate-marketer/index.html',
    article: 'de-affiliate-marketer-article.html',
    lang: 'de',
    slug: '/de/professions/affiliate-marketer/',
    title: 'Thailand Visum Affiliate Marketer 2026 — Deutsch',
    desc: 'CPA, Performance Marketing — DTV vs LTR Steuer, Privilege. Pattaya Affiliate-Guide auf Deutsch.',
    heroH1: 'Visum für <span class="cy">Affiliate Marketer.</span>',
    heroLede: 'Provisionen aus Auslands-Netzwerken? DTV für die meisten — LTR ab $80k+ wenn Sie dauerhaft remittieren.',
    tldr: 'DTV: CPA aus dem Ausland. LTR: RD 743 ab $80k+.',
  },
  {
    en: 'professions/affiliate-marketer/index.html',
    locale: 'ru/professions/affiliate-marketer/index.html',
    article: 'ru-affiliate-marketer-article.html',
    lang: 'ru',
    slug: '/ru/professions/affiliate-marketer/',
    title: 'Виза Таиланд для affiliate 2026 — русский',
    desc: 'CPA, performance marketing — DTV vs LTR, Privilege. Гид для affiliate в Паттайе.',
    heroH1: 'Виза для <span class="cy">affiliate marketer.</span>',
    heroLede: 'Комиссии с зарубежных сетей? DTV для большинства — LTR от $80k+ при постоянном remittance.',
    tldr: 'DTV: CPA из-за рубежа. LTR: RD 743 от $80k+.',
  },
  {
    en: 'professions/crypto-trader/index.html',
    locale: 'de/professions/crypto-trader/index.html',
    article: 'de-crypto-trader-article.html',
    lang: 'de',
    slug: '/de/professions/crypto-trader/',
    title: 'Thailand Visum Crypto Trader 2026 — auf Deutsch',
    desc: 'Trading-Einkommen, DTV, LTR, Privilege — Remittance-Steuer 2024. Pattaya Krypto-Guide.',
    heroH1: 'Visum für <span class="pk">Crypto Trader.</span>',
    heroLede: '฿500k liquide und Auslands-Börse? DTV — LTR W ab $1M Assets für Steuer-Exempt auf Remittance.',
    tldr: 'DTV: ฿500k Mittel. LTR W: RD 743 bei Skala.',
  },
  {
    en: 'professions/crypto-trader/index.html',
    locale: 'ru/professions/crypto-trader/index.html',
    article: 'ru-crypto-trader-article.html',
    lang: 'ru',
    slug: '/ru/professions/crypto-trader/',
    title: 'Виза Таиланд для crypto trader 2026 — русский',
    desc: 'Трейдинг, DTV, LTR, Privilege — налоги remittance 2024. Гид из Паттайи.',
    heroH1: 'Виза для <span class="pk">crypto trader.</span>',
    heroLede: '฿500k и offshore биржа? DTV — LTR W от $1M для льготы на remittance.',
    tldr: 'DTV: ฿500k. LTR W: RD 743.',
  },
  {
    en: 'professions/ai-engineer/index.html',
    locale: 'de/professions/ai-engineer/index.html',
    article: 'de-ai-engineer-article.html',
    lang: 'de',
    slug: '/de/professions/ai-engineer/',
    title: 'Thailand Visum AI / ML Engineer 2026 — Deutsch',
    desc: 'Remote FAANG, SMART-T, LTR H/W — DTV vs Steuer Pattaya. EEC Chonburi für BOI-Tech.',
    heroH1: 'Visum für <span class="cy">AI / ML Engineers.</span>',
    heroLede: 'Remote $150k+ vom Ausland? DTV — SMART-T oder LTR wenn Thai-BOI-Job oder $80k+ Steuerplan.',
    tldr: 'DTV: Remote EN. SMART/LTR: Thai Tech oder $80k+.',
  },
  {
    en: 'professions/ai-engineer/index.html',
    locale: 'ru/professions/ai-engineer/index.html',
    article: 'ru-ai-engineer-article.html',
    lang: 'ru',
    slug: '/ru/professions/ai-engineer/',
    title: 'Виза Таиланд для AI engineer 2026 — на русском',
    desc: 'Remote ML/AI, SMART-T, LTR — DTV vs налоги в Паттайе. EEC для BOI-tech.',
    heroH1: 'Виза для <span class="cy">AI / ML engineer.</span>',
    heroLede: 'Remote $150k+ из-за рубежа? DTV — SMART-T или LTR при работе в TH tech или $80k+.',
    tldr: 'DTV: remote. SMART/LTR: TH tech или $80k+.',
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
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 44 profession pilots — 256 URLs');
