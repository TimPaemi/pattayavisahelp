/**
 * Sprint 67 — promote DE/RU TM30 + 90-day reporting pilots (indexed).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PILOTS = [
  {
    en: 'guides/tm30-reporting/index.html',
    locale: 'de/guides/tm30-reporting/index.html',
    article: 'de-tm30-guide-article.html',
    lang: 'de',
    slug: '/de/guides/tm30-reporting/',
    title: 'TM30 Thailand 2026 — Vermieter & 24-Stunden-Regel',
    desc: 'TM30 auf Deutsch: Wer meldet, 24-Stunden-Frist, Online-Portal, Jomtien Walk-in und typische Vermieter-Probleme in Pattaya.',
    heroH1: 'TM30 — <span class="pk">24 Stunden.</span> <span class="cy">Ihr Vermieter.</span>',
    heroLede: 'Jeder Check-in muss innerhalb 24 Stunden gemeldet werden — meist der Vermieter, aber ohne Quittung keine Verlängerung in Jomtien.',
    tldr: 'Vermieter meldet in 24h · Quittung für Verlängerung & 90-Tage nötig',
  },
  {
    en: 'guides/tm30-reporting/index.html',
    locale: 'ru/guides/tm30-reporting/index.html',
    article: 'ru-tm30-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/tm30-reporting/',
    title: 'TM30 Таиланд 2026 — арендодатель и 24 часа',
    desc: 'TM30 на русском: кто подаёт, срок 24 часа, портал, Jomtien и отказы арендодателя в Паттайе.',
    heroH1: 'TM30 — <span class="pk">24 часа.</span> <span class="cy">Арендодатель.</span>',
    heroLede: 'Регистрация адреса за 24 часа — обычно арендодатель; без квитанции нет продления в Jomtien.',
    tldr: 'Арендодатель за 24ч · квитанция для 90-day и продлений',
  },
  {
    en: 'guides/90-day-reporting/index.html',
    locale: 'de/guides/90-day-reporting/index.html',
    article: 'de-90day-guide-article.html',
    lang: 'de',
    slug: '/de/guides/90-day-reporting/',
    title: '90-Tage-Meldung TM47 2026 — Fristen & Jomtien',
    desc: '90-Tage-Meldung auf Deutsch: TM47-Fenster, Online vs Jomtien, erste Meldung vor Ort, Strafen und LTR-Ausnahme.',
    heroH1: '90-Tage-Meldung — <span class="pk">TM47.</span> <span class="cy">Alle 90 Tage.</span>',
    heroLede: 'Pflicht auf Langzeitvisa — kostenlos rechtzeitig, ฿2.000 verspätet in Jomtien. Erste Meldung nur persönlich.',
    tldr: 'Kostenlos pünktlich · 15 Tage vor bis 7 Tage nach Fälligkeit · LTR befreit',
  },
  {
    en: 'guides/90-day-reporting/index.html',
    locale: 'ru/guides/90-day-reporting/index.html',
    article: 'ru-90day-guide-article.html',
    lang: 'ru',
    slug: '/ru/guides/90-day-reporting/',
    title: 'Отчёт 90 дней TM47 2026 — сроки и Jomtien',
    desc: '90-day на русском: окно TM47, онлайн и Jomtien, первая подача лично, штрафы и исключение LTR.',
    heroH1: '90-day — <span class="pk">TM47.</span> <span class="cy">Каждые 90 дней.</span>',
    heroLede: 'Обязательно на долгих визах — бесплатно в срок, ฿2.000 при опоздании в Jomtien. Первая подача только лично.',
    tldr: 'Бесплатно в срок · за 15 дней до и 7 после · LTR освобождён',
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
  const otherSlug =
    p.en.includes('tm30')
      ? other === 'de'
        ? '/de/guides/tm30-reporting/'
        : '/ru/guides/tm30-reporting/'
      : other === 'de'
        ? '/de/guides/90-day-reporting/'
        : '/ru/guides/90-day-reporting/';
  const otherTag = `<link rel="alternate" hreflang="${other}" href="${BASE}${otherSlug}" />`;
  if (!h.includes(`hreflang="${other}"`)) {
    h = h.replace('<link rel="alternate" hreflang="x-default"', `${otherTag}\n<link rel="alternate" hreflang="x-default"`);
  }

  h = h.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${p.heroH1}</h1>`);
  const heroRe = /<p class="lede">[\s\S]*?<\/p>/;
  if (heroRe.test(h)) h = h.replace(heroRe, `<p class="lede">${p.heroLede}</p>`);
  if (h.includes('INDEPENDENT · NO COMMISSIONS')) {
    h = h.replace(
      /<span>INDEPENDENT · NO COMMISSIONS<\/span>/,
      `<span>${p.lang === 'de' ? 'DEUTSCH · UNABHÄNGIG' : 'РУССКИЙ · НЕЗАВИСИМО'}</span>`
    );
  }
  h = h.replace(/<p class="tldr-text">[^<]*<\/p>/, `<p class="tldr-text">${p.tldr}</p>`);

  h = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${article}\n</main>`);
  h = h.replace(/locale-stub-banner[\s\S]*?<\/div>\s*/g, '');
  h = h.replace(/<!-- sprint61-stub-mesh -->[\s\S]*?<\/p>\s*/g, '');
  h = h.replace(/<!-- sprint64-stub-nav -->[\s\S]*?<!-- sprint64-stub-nav end -->\s*/g, '');
  h = h.replace(/\/\* sprint64-stub-nav \*\/[\s\S]*?body\{padding-bottom:72px\}\s*\}/, '');

  fs.mkdirSync(path.dirname(locPath), { recursive: true });
  fs.writeFileSync(locPath, h);
  console.log('promoted', p.locale);
}

function patchEnHreflang(enFile, slugs) {
  const enPath = path.join(ROOT, enFile);
  let eg = fs.readFileSync(enPath, 'utf8');
  const enSlug = '/' + enFile.replace('/index.html', '/');
  for (const [lang, slug] of slugs) {
    const tag = `<link rel="alternate" hreflang="${lang}" href="${BASE}${slug}" />`;
    if (!eg.includes(tag)) {
      eg = eg.replace('<link rel="alternate" hreflang="en"', `${tag}\n<link rel="alternate" hreflang="en"`);
    }
  }
  if (!eg.includes(`hreflang="de"`)) {
    /* ensure de+ru on EN */
  }
  fs.writeFileSync(enPath, eg);
}

function fixEnHeroes() {
  const tm30 = path.join(ROOT, 'guides/tm30-reporting/index.html');
  let t = fs.readFileSync(tm30, 'utf8');
  t = t.replace(
    /<h1>TM30 reporting[\s\S]*?<\/h1>/,
    "<h1>TM30 reporting — your landlord's rule that becomes your problem.</h1>"
  );
  t = t.replace(
    /<p class="lede">Filing window<\/p>/,
    '<p class="lede">Every foreign check-in must be reported within 24 hours — usually by your landlord, not you. Without the receipt, Jomtien blocks extensions.</p>'
  );
  t = t.replace(
    /<p class="tldr-text">24 hours<\/p>/,
    '<p class="tldr-text">Landlord files within 24h · You need the receipt for extensions and 90-day reports</p>'
  );
  t = t.replace(
    /<main id="main" class="article-body">\s*<p>24 hours<\/p><p>From foreigner's arrival<\/p>\s*<p>Late fine<\/p><p>฿800–2,000<\/p><p>Per offence · paid by landlord \(in theory\)<\/p>\s*/,
    '<main id="main" class="article-body">\n'
  );
  fs.writeFileSync(tm30, t);

  const d90 = path.join(ROOT, 'guides/90-day-reporting/index.html');
  let n = fs.readFileSync(d90, 'utf8');
  n = n.replace(/<p class="lede">Cost<\/p>/, '<p class="lede">File TM47 every 90 days on long-stay visas — free on time, ฿2,000 if late at Jomtien. First report must be in person.</p>');
  n = n.replace(
    /<p class="tldr-text">Free<\/p>/,
    '<p class="tldr-text">Free on time · File 15 days before to 7 days after due · LTR exempt (annual only)</p>'
  );
  fs.writeFileSync(d90, n);
  console.log('EN hero fixes: tm30 + 90-day');
}

fixEnHeroes();

for (const p of PILOTS) promote(p);

patchEnHreflang('guides/tm30-reporting/index.html', [
  ['de', '/de/guides/tm30-reporting/'],
  ['ru', '/ru/guides/tm30-reporting/'],
]);
patchEnHreflang('guides/90-day-reporting/index.html', [
  ['de', '/de/guides/90-day-reporting/'],
  ['ru', '/ru/guides/90-day-reporting/'],
]);

const smPath = path.join(ROOT, 'scripts/rebuild-sitemaps.cjs');
let sm = fs.readFileSync(smPath, 'utf8');
const m = sm.match(/const LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\);/);
const pilots = JSON.parse(m[1]);
for (const u of [
  '/de/guides/tm30-reporting/',
  '/ru/guides/tm30-reporting/',
  '/de/guides/90-day-reporting/',
  '/ru/guides/90-day-reporting/',
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
if (!meta.includes("'/de/guides/tm30-reporting/'")) {
  meta = meta.replace(
    "  '/ru/guides/jomtien-immigration-office/',",
    "  '/ru/guides/jomtien-immigration-office/',\n  '/de/guides/tm30-reporting/',\n  '/ru/guides/tm30-reporting/',\n  '/de/guides/90-day-reporting/',\n  '/ru/guides/90-day-reporting/',"
  );
  fs.writeFileSync(metaPath, meta);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
console.log('Sprint 67 compliance guide pilots promoted');
