/**
 * Sprint 40 — promote DE/RU compare pilots (dtv-vs-ltr, ed-vs-dtv, privilege-vs-ltr).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const PILOTS = [
  {
    en: 'compare/dtv-vs-ltr/index.html',
    locale: 'de/compare/dtv-vs-ltr/index.html',
    article: 'de-dtv-vs-ltr-article.html',
    lang: 'de',
    slug: '/de/compare/dtv-vs-ltr/',
    title: 'DTV vs LTR 2026 — Vergleich auf Deutsch · Pattaya',
    desc: 'DTV vs LTR 2026 auf Deutsch — Gebühren, Steuer, 180-Tage vs 10 Jahre, Entscheidungsbaum für Nomaden und High Earner. Unabhängig aus Pattaya.',
    heroH1: 'DTV vs <span class="cy">LTR.</span> Welches Long-Stay?',
    heroLede: '฿10k vs ฿50k — aber die Steuerfrage entscheidet. Vergleich für Remote-Arbeiter und Rentner in Pattaya.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"DTV oder LTR?","acceptedAnswer":{"@type":"Answer","text":"Unter $80k/Jahr meist DTV. Ab $80k und 180+ Tagen/Jahr oft LTR wegen Steuerbefreiung."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/compare/dtv-vs-ltr/">DTV vs LTR auf Deutsch</a>',
    tldr: 'DTV: ฿10k · 5 Jahre · Nomaden. LTR: ฿50k · 10 Jahre · Steuerbefreiung ab $80k.',
  },
  {
    en: 'compare/dtv-vs-ltr/index.html',
    locale: 'ru/compare/dtv-vs-ltr/index.html',
    article: 'ru-dtv-vs-ltr-article.html',
    lang: 'ru',
    slug: '/ru/compare/dtv-vs-ltr/',
    title: 'DTV vs LTR 2026 — сравнение на русском · Паттайя',
    desc: 'DTV vs LTR 2026 на русском — пошлины, налоги, 180 дней vs 10 лет, выбор для номадов и высоких доходов. Независимый гид Паттайя.',
    heroH1: 'DTV vs <span class="cy">LTR.</span> Что выбрать?',
    heroLede: '฿10k против ฿50k — но решает налог. Сравнение для удалёнщиков и пенсионеров в Паттайе.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"DTV или LTR?","acceptedAnswer":{"@type":"Answer","text":"До $80k/год чаще DTV. От $80k и 180+ дней/год — LTR из-за налоговой льготы."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/compare/dtv-vs-ltr/">DTV vs LTR на русском</a>',
    tldr: 'DTV: ฿10k · 5 лет. LTR: ฿50k · 10 лет · льгота при $80k+.',
  },
  {
    en: 'compare/ed-vs-dtv/index.html',
    locale: 'de/compare/ed-vs-dtv/index.html',
    article: 'de-ed-vs-dtv-article.html',
    lang: 'de',
    slug: '/de/compare/ed-vs-dtv/',
    title: 'ED vs DTV 2026 — Bildung oder Nomade · Deutsch',
    desc: 'ED vs DTV 2026 auf Deutsch — MOE-Schule vs 5-Jahres-Remote-Visum, Kosten Jomtien, Wechsel ED→DTV. Leitfaden Pattaya.',
    heroH1: 'ED vs <span class="pk">DTV.</span> Unter 50 in Thailand.',
    heroLede: 'Echte Schule mit MOE — oder legal remote mit DTV? Pattaya-Vergleich inkl. Verlängerung und Kosten.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Remote auf ED?","acceptedAnswer":{"@type":"Answer","text":"Nein — DTV oder illegal. ED nur mit echter Anwesenheit."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/compare/ed-vs-dtv/">ED vs DTV auf Deutsch</a>',
    tldr: 'ED: MOE + 90-Tage-Verlängerung. DTV: 5 Jahre, ฿10k, Remote legal.',
  },
  {
    en: 'compare/ed-vs-dtv/index.html',
    locale: 'ru/compare/ed-vs-dtv/index.html',
    article: 'ru-ed-vs-dtv-article.html',
    lang: 'ru',
    slug: '/ru/compare/ed-vs-dtv/',
    title: 'ED vs DTV 2026 — учёба или номад · русский',
    desc: 'ED vs DTV 2026 на русском — школа MOE vs 5-летняя удалёнка, расходы Джомтьен, переход ED→DTV. Гид Паттайя.',
    heroH1: 'ED vs <span class="pk">DTV.</span> До 50 лет.',
    heroLede: 'Реальная MOE-школа или легальная удалёнка на DTV? Сравнение для Паттайи.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Remote на ED?","acceptedAnswer":{"@type":"Answer","text":"Нет — только DTV при удалёнке."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/compare/ed-vs-dtv/">ED vs DTV на русском</a>',
    tldr: 'ED: MOE + продление 90 дней. DTV: 5 лет, ฿10k, легальная удалёнка.',
  },
  {
    en: 'compare/privilege-vs-ltr/index.html',
    locale: 'de/compare/privilege-vs-ltr/index.html',
    article: 'de-privilege-vs-ltr-article.html',
    lang: 'de',
    slug: '/de/compare/privilege-vs-ltr/',
    title: 'Privilege vs LTR 2026 — Premium-Vergleich Deutsch',
    desc: 'Thailand Privilege vs LTR 2026 auf Deutsch — Mitgliedschaft ฿650k–5M vs BOI-Steuervorteil. Wann Elite, wann LTR. Pattaya.',
    heroH1: 'Privilege vs <span class="cy">LTR.</span> Premium stay.',
    heroLede: 'VIP-Mitgliedschaft oder Steuer-Residence? 10-Jahres-Kosten und Pattaya-Entscheidung.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Privilege oder LTR?","acceptedAnswer":{"@type":"Answer","text":"LTR bei $80k+ und Steuerfokus. Privilege bei Komfort ohne Einkommensnachweis."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Neu:</strong> <a href="/de/compare/privilege-vs-ltr/">Privilege vs LTR (DE)</a>',
    tldr: 'Privilege: VIP · ฿650k+. LTR: ฿50k · Steuerbefreiung $80k+.',
  },
  {
    en: 'compare/privilege-vs-ltr/index.html',
    locale: 'ru/compare/privilege-vs-ltr/index.html',
    article: 'ru-privilege-vs-ltr-article.html',
    lang: 'ru',
    slug: '/ru/compare/privilege-vs-ltr/',
    title: 'Privilege vs LTR 2026 — сравнение на русском',
    desc: 'Privilege vs LTR 2026 на русском — членство ฿650k–5M vs налоговая льгота BOI. Когда Elite, когда LTR. Паттайя.',
    heroH1: 'Privilege vs <span class="cy">LTR.</span> Премиум stay.',
    heroLede: 'VIP-членство или налоговая резиденция? Стоимость за 10 лет.',
    faqSchema: `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Privilege или LTR?","acceptedAnswer":{"@type":"Answer","text":"LTR при $80k+ и налогах. Privilege при VIP без порога дохода."}}]}`,
    hubBanner: '<strong style="color:#06b6d4">Новое:</strong> <a href="/ru/compare/privilege-vs-ltr/">Privilege vs LTR (RU)</a>',
    tldr: 'Privilege: VIP · ฿650k+. LTR: ฿50k · льгота от $80k.',
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
];
const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[^\]]+\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(ALL_PILOTS)});`
);
fs.writeFileSync(smPath, sm);

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 40 compare pilots — 232 URLs');
