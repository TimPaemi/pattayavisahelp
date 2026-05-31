/**
 * DE/RU Pattaya neighborhood / living guides (not origin-country pages).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const NEIGHBORHOODS = new Set([
  'jomtien',
  'naklua',
  'pratumnak',
  'east-pattaya',
  'wongamat',
  'bang-saray',
  'living-in-pattaya',
]);

let styles = '';
try {
  const hub = fs.readFileSync(path.join(ROOT, 'de/index.html'), 'utf8');
  styles = hub.slice(hub.indexOf('<style>'), hub.indexOf('</style>') + 8);
} catch {
  styles = '<style>body{background:#000;color:#fafafa;font-family:Inter,sans-serif}a{color:#06b6d4}</style>';
}

function readEnMeta(slug) {
  const html = fs.readFileSync(path.join(ROOT, 'pattaya', slug, 'index.html'), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/&amp;/g, '&') || slug;
  const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1]?.replace(/&amp;/g, '&') || title.split('—')[0].trim();
  return { title, desc, h1 };
}

function autoData(lang, slug, en) {
  if (lang === 'de') {
    return {
      title: `${en.h1} 2026 — Pattaya auf Deutsch`,
      h1: en.h1,
      lede: `${en.desc.slice(0, 150)}${en.desc.length > 150 ? '…' : ''} Visum & Leben in Pattaya — Beratung auf Deutsch.`,
    };
  }
  return {
    title: `${en.h1} 2026 — Pattaya на русском`,
    h1: en.h1,
    lede: `${en.desc.slice(0, 150)}${en.desc.length > 150 ? '…' : ''} Визы и жизнь в Pattaya — консультации на русском.`,
  };
}

function build(lang, slug, data) {
  const en = `${BASE}/pattaya/${slug}/`;
  const loc = `${BASE}/${lang}/pattaya/${slug}/`;
  const labels =
    lang === 'de'
      ? { full: 'Vollständiger Pattaya-Guide (EN)', consult: 'Beratung auf Deutsch', home: '/de/' }
      : { full: 'Полный гид Pattaya (EN)', consult: 'Консультация на русском', home: '/ru/' };
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${data.title}</title>
<meta name="description" content="${data.lede}" />
<link rel="canonical" href="${loc}" />
<link rel="alternate" hreflang="en" href="${en}" />
<link rel="alternate" hreflang="de" href="${BASE}/de/pattaya/${slug}/" />
<link rel="alternate" hreflang="ru" href="${BASE}/ru/pattaya/${slug}/" />
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
<p><a href="/pattaya/${slug}/">${labels.full} →</a> · <a href="/pattaya/">All Pattaya areas</a></p>
<p><a href="/contact/">${labels.consult}</a></p>
</main>
<footer style="padding:2rem;text-align:center;font-size:.75rem;color:var(--tl,#a1a1aa)"><a href="${labels.home}">← ${lang === 'de' ? 'Deutsch Startseite' : 'Русская главная'}</a></footer>
</body>
</html>`;
}

function patchEnHreflang(slug) {
  const enFile = path.join(ROOT, 'pattaya', slug, 'index.html');
  if (!fs.existsSync(enFile)) return;
  let html = fs.readFileSync(enFile, 'utf8');
  const en = `${BASE}/pattaya/${slug}/`;
  const block = `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${BASE}/de/pattaya/${slug}/" />\n<link rel="alternate" hreflang="ru" href="${BASE}/ru/pattaya/${slug}/" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  if (html.includes(`/de/pattaya/${slug}/`)) return;
  const hreflangBlock =
    /<link rel="alternate" hreflang="en"[^>]+>\s*\n(?:<link rel="alternate" hreflang="(?:de|ru)"[^>]+>\s*\n)*<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/;
  if (hreflangBlock.test(html)) html = html.replace(hreflangBlock, block);
  else html = html.replace(`<link rel="canonical" href="${en}" />`, `<link rel="canonical" href="${en}" />\n${block.trim()}`);
  fs.writeFileSync(enFile, html);
}

const report = { areas: [], hreflang: [] };
for (const slug of NEIGHBORHOODS) {
  if (!fs.existsSync(path.join(ROOT, 'pattaya', slug, 'index.html'))) continue;
  const en = readEnMeta(slug);
  for (const lang of ['de', 'ru']) {
    const dir = path.join(ROOT, lang, 'pattaya', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), build(lang, slug, autoData(lang, slug, en)));
    report.areas.push(`${lang}/pattaya/${slug}`);
  }
  patchEnHreflang(slug);
  report.hreflang.push(slug);
}
console.log(JSON.stringify(report, null, 2));
