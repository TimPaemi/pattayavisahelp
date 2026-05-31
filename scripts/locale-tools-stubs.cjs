/**
 * DE/RU tool overview stubs + hreflang on EN tool pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';
const SECTION = 'tools';
const SKIP = new Set(['index', 'ltr-eligibility']);

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
  return { title, desc, h1: title.split('—')[0].trim() };
}

function autoData(lang, slug, en) {
  if (lang === 'de') {
    return {
      title: `${en.h1} — Thailand Visum Tool auf Deutsch`,
      h1: en.h1,
      lede: `${en.desc.slice(0, 140)}${en.desc.length > 140 ? '…' : ''} Kostenlos aus Pattaya auf Deutsch.`,
    };
  }
  return {
    title: `${en.h1} — инструмент виз Таиланд на русском`,
    h1: en.h1,
    lede: `${en.desc.slice(0, 140)}${en.desc.length > 140 ? '…' : ''} Бесплатно из Pattaya на русском.`,
  };
}

function build(lang, slug, data) {
  const en = `${BASE}/${SECTION}/${slug}/`;
  const loc = `${BASE}/${lang}/${SECTION}/${slug}/`;
  const labels =
    lang === 'de'
      ? { full: 'Tool auf Englisch öffnen', consult: 'Beratung auf Deutsch', home: '/de/' }
      : { full: 'Открыть инструмент (EN)', consult: 'Консультация на русском', home: '/ru/' };
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
<p><a href="/${SECTION}/${slug}/">${labels.full} →</a> · <a href="/tools/">All tools</a></p>
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
  else if (html.includes(`<link rel="canonical" href="${en}" />`)) {
    html = html.replace(`<link rel="canonical" href="${en}" />`, `<link rel="canonical" href="${en}" />\n${block.trim()}`);
  }
  fs.writeFileSync(enFile, html);
}

const report = { tools: [], hreflang: [] };
for (const slug of fs.readdirSync(path.join(ROOT, SECTION)).filter((d) => !SKIP.has(d) && fs.existsSync(path.join(ROOT, SECTION, d, 'index.html')))) {
  const en = readEnMeta(slug);
  for (const lang of ['de', 'ru']) {
    const dir = path.join(ROOT, lang, SECTION, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), build(lang, slug, autoData(lang, slug, en)));
    report.tools.push(`${lang}/${SECTION}/${slug}`);
  }
  patchEnHreflang(slug);
  report.hreflang.push(slug);
}
console.log(JSON.stringify(report, null, 2));
