/**
 * DE/RU best-visa budget tier stubs + hreflang on EN tier pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';
const SECTION = 'best-visa';

const TIER_LABELS = {
  'under-5k': { de: 'Unter ฿5.000', ru: 'До ฿5 000' },
  'under-20k': { de: 'Unter ฿20.000', ru: 'До ฿20 000' },
  'under-50k': { de: 'Unter ฿50.000', ru: 'До ฿50 000' },
  'under-100k': { de: 'Unter ฿100.000', ru: 'До ฿100 000' },
  'under-500k': { de: 'Unter ฿500.000', ru: 'До ฿500 000' },
  'under-1m': { de: 'Unter ฿1M', ru: 'До ฿1M' },
};

let styles = '';
try {
  const hub = fs.readFileSync(path.join(ROOT, 'de/index.html'), 'utf8');
  styles = hub.slice(hub.indexOf('<style>'), hub.indexOf('</style>') + 8);
} catch {
  styles = '<style>body{background:#000;color:#fafafa;font-family:Inter,sans-serif}a{color:#06b6d4}</style>';
}

function readEnMeta(slug) {
  const html = fs.readFileSync(path.join(ROOT, SECTION, slug, 'index.html'), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/&amp;/g, '&') || slug;
  const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
  return { title, desc };
}

function autoData(lang, slug, en) {
  const tier = TIER_LABELS[slug]?.[lang] || slug;
  if (lang === 'de') {
    return {
      title: `Beste Thailand-Visa ${tier} 2026 — Budget auf Deutsch`,
      h1: `Beste Visa ${tier}`,
      lede: `${en.desc.slice(0, 140)}${en.desc.length > 140 ? '…' : ''} Unabhängige Empfehlung aus Pattaya.`,
    };
  }
  return {
    title: `Лучшие визы Таиланд ${tier} 2026 — бюджет на русском`,
    h1: `Лучшие визы ${tier}`,
    lede: `${en.desc.slice(0, 140)}${en.desc.length > 140 ? '…' : ''} Независимая рекомендация из Pattaya.`,
  };
}

function build(lang, slug, data) {
  const en = `${BASE}/${SECTION}/${slug}/`;
  const loc = `${BASE}/${lang}/${SECTION}/${slug}/`;
  const labels =
    lang === 'de'
      ? { full: 'Vollständiger Budget-Vergleich (EN)', consult: 'Beratung auf Deutsch', home: '/de/' }
      : { full: 'Полное сравнение бюджета (EN)', consult: 'Консультация на русском', home: '/ru/' };
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${data.title}</title>
<meta name="description" content="${data.lede}" />
<link rel="canonical" href="${loc}" />
<link rel="alternate" hreflang="en" href="${en}" />
<link rel="alternate" hreflang="de" href="${BASE}/de/${SECTION}/${slug}/" />
<link rel="alternate" hreflang="ru" href="${BASE}/ru/${SECTION}/${slug}/" />
<link rel="alternate" hreflang="x-default" href="${en}" />
${styles}
<script src="/analytics-events.js" defer></script>
</head>
<body>
<a href="/" class="brand"><span class="dot"></span>PATTAYA<span class="accent">VISA</span>HELP</a>
<header class="article-head">
<h1>${data.h1}</h1>
<p class="lede">${data.lede}</p>
</header>
<main class="article-body">
<p><a href="/${SECTION}/${slug}/">${labels.full} →</a> · <a href="/tools/visa-finder/">Visa finder</a></p>
<p><a href="/contact/">${labels.consult}</a></p>
</main>
<footer style="padding:2rem;text-align:center;font-size:.75rem;color:var(--tl,#a1a1aa)"><a href="${labels.home}">← ${lang === 'de' ? 'Deutsch Startseite' : 'Русская главная'}</a></footer>
</body>
</html>`;
}

function patchEnHreflang(slug) {
  const enFile = path.join(ROOT, SECTION, slug, 'index.html');
  if (!fs.existsSync(enFile)) return;
  let html = fs.readFileSync(enFile, 'utf8');
  const en = `${BASE}/${SECTION}/${slug}/`;
  const block = `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${BASE}/de/${SECTION}/${slug}/" />\n<link rel="alternate" hreflang="ru" href="${BASE}/ru/${SECTION}/${slug}/" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  if (html.includes(`/de/${SECTION}/${slug}/`)) return;
  const hreflangBlock =
    /<link rel="alternate" hreflang="en"[^>]+>\s*\n(?:<link rel="alternate" hreflang="(?:de|ru)"[^>]+>\s*\n)*<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/;
  if (hreflangBlock.test(html)) html = html.replace(hreflangBlock, block);
  else html = html.replace(`<link rel="canonical" href="${en}" />`, `<link rel="canonical" href="${en}" />\n${block.trim()}`);
  fs.writeFileSync(enFile, html);
}

const report = { tiers: [], hreflang: [] };
for (const slug of Object.keys(TIER_LABELS)) {
  if (!fs.existsSync(path.join(ROOT, SECTION, slug, 'index.html'))) continue;
  const en = readEnMeta(slug);
  for (const lang of ['de', 'ru']) {
    const dir = path.join(ROOT, lang, SECTION, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), build(lang, slug, autoData(lang, slug, en)));
    report.tiers.push(`${lang}/${SECTION}/${slug}`);
  }
  patchEnHreflang(slug);
  report.hreflang.push(slug);
}
console.log(JSON.stringify(report, null, 2));
