/**
 * Sprint 68 — promote DE/RU re-entry + overstay pilots; fix EN heroes.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PILOTS = [
  {
    en: 'guides/re-entry-permits/index.html',
    locale: 'de/guides/re-entry-permits/index.html',
    article: 'de-reentry-guide-article.html',
    lang: 'de',
    slug: '/de/guides/re-entry-permits/',
    title: 'Re-entry Permit Thailand 2026 — vor der Ausreise',
    desc: 'Re-entry Permit auf Deutsch: Single vs Multiple, ฿1.000/฿3.800, Flughafen vs Jomtien, wer es braucht und was passiert wenn vergessen.',
    heroH1: 'Re-entry — <span class="pk">nicht</span> <span class="cy">verlieren.</span>',
    heroLede: 'Single-Entry-Visa erlischt beim Verlassen ohne TM.8 — ฿1.000 einmal oder ฿3.800 für unbegrenzte Reisen bis Visumsende.',
    tldr: 'Single ฿1.000 · Multiple ฿3.800 · Vor Abflug beantragen · DTV/LTR brauchen keins',
    network:
      'Pattaya: <a href="/de/guides/jomtien-immigration-office/">Jomtien (DE)</a> · <a href="/de/guides/90-day-reporting/">90-Tage (DE)</a> · <a href="/glossary/re-entry-permit/">Glossar</a>',
  },
  {
    en: 'guides/re-entry-permits/index.html',
    locale: 'ru/guides/re-entry-permits/index.html',
    article: 'ru-reentry-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/re-entry-permits/',
    title: 'Re-entry permit Таиланд 2026 — до выезда',
    desc: 'Re-entry на русском: single/multiple, аэропорт и Jomtien, кому нужен permit.',
    heroH1: 'Re-entry — <span class="pk">сохранить</span> <span class="cy">визу.</span>',
    heroLede: 'Single-entry сгорает при выезде без TM.8 — ฿1.000 или ฿3.800 multiple до конца визы.',
    tldr: 'Single ฿1.000 · Multiple ฿3.800 · до вылета · DTV/LTR не нужен',
    network:
      'Паттайя: <a href="/ru/guides/jomtien-immigration-office/">Jomtien RU</a> · <a href="/ru/guides/90-day-reporting/">90-day RU</a> · <a href="/glossary/re-entry-permit/">глоссарий</a>',
  },
  {
    en: 'guides/visa-overstay-penalties/index.html',
    locale: 'de/guides/visa-overstay-penalties/index.html',
    article: 'de-overstay-guide-article.html',
    lang: 'de',
    slug: '/de/guides/visa-overstay-penalties/',
    title: 'Visum Overstay Thailand 2026 — Strafen & Blacklist',
    desc: 'Overstay auf Deutsch: ฿500/Tag, Selbstmeldung vs erwischt, Blacklist-Stufen und Jomtien-Schritte.',
    heroH1: 'Overstay — <span class="pk">Strafen.</span> <span class="cy">Blacklist.</span>',
    heroLede: 'Ab Tag 1 nach Stempelablauf: ฿500/Tag (max ฿20.000), ab 90 Tagen 1-Jahres-Ban — sofort Jomtien oder Exit.',
    tldr: '฿500/Tag · Selbst melden = kein Ban unter 90 Tagen · Erwischt = schlimmer',
    network:
      'Freiwillig: <a href="/blog/overstay-voluntary-surrender-2026/">Blog</a> · <a href="/de/guides/jomtien-immigration-office/">Jomtien (DE)</a> · <a href="/glossary/overstay/">Glossar</a>',
  },
  {
    en: 'guides/visa-overstay-penalties/index.html',
    locale: 'ru/guides/visa-overstay-penalties/index.html',
    article: 'ru-overstay-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/visa-overstay-penalties/',
    title: 'Overstay Таиланд 2026 — штрафы и бан',
    desc: 'Overstay на русском: штрафы, самостоятельная сдача vs задержание, Jomtien.',
    heroH1: 'Overstay — <span class="pk">штрафы</span> <span class="cy">и бан</span>',
    heroLede: 'С первого дня после штампа: ฿500/день, с 90 дней — бан 1 год. Срочно в Jomtien.',
    tldr: '฿500/день · сами = без бана до 90д · поймали = хуже',
    network:
      '<a href="/blog/overstay-voluntary-surrender-2026/">блог</a> · <a href="/ru/guides/jomtien-immigration-office/">Jomtien RU</a> · <a href="/glossary/overstay/">глоссарий</a>',
  },
];

function promote(p) {
  const enPath = path.join(ROOT, p.en);
  const locPath = path.join(ROOT, p.locale);
  const article = fs.readFileSync(path.join(__dirname, 'content', p.article), 'utf8');
  const enSlug = '/' + p.en.replace('/index.html', '/');
  const enUrl = `${BASE}${enSlug}`;
  const locUrl = `${BASE}${p.slug}`;

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
  const other = p.lang === 'de' ? 'ru' : 'de';
  const base = p.en.includes('re-entry') ? 're-entry-permits' : 'visa-overstay-penalties';
  const otherSlug = `/${other}/guides/${base}/`;
  const otherTag = `<link rel="alternate" hreflang="${other}" href="${BASE}${otherSlug}" />`;
  if (!h.includes(`hreflang="${other}"`)) {
    h = h.replace('<link rel="alternate" hreflang="x-default"', `${otherTag}\n<link rel="alternate" hreflang="x-default"`);
  }

  h = h.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${p.heroH1}</h1>`);
  h = h.replace(/<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${p.heroLede}</p>`);
  h = h.replace(/<p class="tldr-text">[\s\S]*?<\/p>/, `<p class="tldr-text">${p.tldr}</p>`);
  if (p.network) {
    h = h.replace(/<p class="network-context">[\s\S]*?<\/p>\s*(?=<main)/, `<p class="network-context">${p.network}</p>\n`);
  }
  if (h.includes('INDEPENDENT · NO COMMISSIONS')) {
    h = h.replace(
      /<span>INDEPENDENT · NO COMMISSIONS<\/span>/,
      `<span>${p.lang === 'de' ? 'DEUTSCH · UNABHÄNGIG' : 'РУССКИЙ · НЕЗАВИСИМО'}</span>`
    );
  }

  h = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${article}\n</main>`);
  h = h.replace(/locale-stub-banner[\s\S]*?<\/div>\s*/g, '');
  h = h.replace(/<!-- sprint61-stub-mesh -->[\s\S]*?<\/p>\s*/g, '');
  h = h.replace(/\/\* sprint64-stub-nav \*\/[\s\S]*?body\{padding-bottom:72px\}\s*\}/, '');

  fs.mkdirSync(path.dirname(locPath), { recursive: true });
  fs.writeFileSync(locPath, h);
  console.log('promoted', p.locale);
}

function fixEn() {
  const re = path.join(ROOT, 'guides/re-entry-permits/index.html');
  let r = fs.readFileSync(re, 'utf8');
  r = r.replace(
    /<h1>Re-entry permits[\s\S]*?<\/h1>/,
    "<h1>Re-entry permits — don't lose your visa abroad.</h1>"
  );
  r = r.replace(
    /<p class="lede">Multiple re-entry<\/p>/,
    '<p class="lede">Single-entry visas cancel when you leave without a TM.8 re-entry permit — ฿1,000 once or ฿3,800 for unlimited trips until your visa expires.</p>'
  );
  r = r.replace(
    /<p class="tldr-text">฿3,800<\/p>/,
    '<p class="tldr-text">Single ฿1,000 · Multiple ฿3,800 · Apply before departure · DTV/LTR exempt</p>'
  );
  r = r.replace(
    /<main id="main" class="article-body">\s*<p>฿3,800<\/p><p>Unlimited trips during visa validity<\/p>\s*/,
    '<main id="main" class="article-body">\n'
  );
  fs.writeFileSync(re, r);

  const ov = path.join(ROOT, 'guides/visa-overstay-penalties/index.html');
  let o = fs.readFileSync(ov, 'utf8');
  o = o.replace(
    /<p class="tldr-text">You realize your visa[\s\S]*?<\/p>/,
    '<p class="tldr-text">฿500/day (max ฿20,000) · Self-report under 90 days = no ban · Caught = blacklist tiers</p>'
  );
  fs.writeFileSync(ov, o);
  console.log('EN heroes: re-entry + overstay');
}

function patchEnHreflang(enFile, slugs) {
  const enPath = path.join(ROOT, enFile);
  let eg = fs.readFileSync(enPath, 'utf8');
  for (const [lang, slug] of slugs) {
    const tag = `<link rel="alternate" hreflang="${lang}" href="${BASE}${slug}" />`;
    if (!eg.includes(tag)) {
      eg = eg.replace('<link rel="alternate" hreflang="en"', `${tag}\n<link rel="alternate" hreflang="en"`);
    }
  }
  fs.writeFileSync(enPath, eg);
}

function refreshJomtien() {
  for (const [loc, art] of [
    ['de/guides/jomtien-immigration-office/index.html', 'de-jomtien-guide-article.html'],
    ['ru/guides/jomtien-immigration-office/index.html', 'ru-jomtien-guide-article.html'],
  ]) {
    const f = path.join(ROOT, loc);
    const article = fs.readFileSync(path.join(__dirname, 'content', art), 'utf8');
    let h = fs.readFileSync(f, 'utf8');
    h = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${article}\n</main>`);
    fs.writeFileSync(f, h);
    console.log('refreshed', loc);
  }
}

fixEn();
refreshJomtien();
for (const p of PILOTS) promote(p);

patchEnHreflang('guides/re-entry-permits/index.html', [
  ['de', '/de/guides/re-entry-permits/'],
  ['ru', '/ru/guides/re-entry-permits/'],
]);
patchEnHreflang('guides/visa-overstay-penalties/index.html', [
  ['de', '/de/guides/visa-overstay-penalties/'],
  ['ru', '/ru/guides/visa-overstay-penalties/'],
]);

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const pilots = JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]);
for (const u of [
  '/de/guides/re-entry-permits/',
  '/ru/guides/re-entry-permits/',
  '/de/guides/visa-overstay-penalties/',
  '/ru/guides/visa-overstay-penalties/',
]) {
  if (!pilots.includes(u)) pilots.push(u);
}
sm = sm.replace(
  /const LOCALE_INDEXED_PILOT = new Set\(\[[\s\S]*?\]\);/,
  `const LOCALE_INDEXED_PILOT = new Set(${JSON.stringify(pilots)});`
);
fs.writeFileSync(smPath, sm);

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/guides/re-entry-permits/'")) {
  meta = meta.replace(
    "  '/ru/guides/90-day-reporting/',",
    "  '/ru/guides/90-day-reporting/',\n  '/de/guides/re-entry-permits/',\n  '/ru/guides/re-entry-permits/',\n  '/de/guides/visa-overstay-penalties/',\n  '/ru/guides/visa-overstay-penalties/',"
  );
  fs.writeFileSync(metaPath, meta);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
