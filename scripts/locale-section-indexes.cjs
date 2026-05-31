/**
 * DE/RU section index pages (visas/, guides/, compare/, etc.) listing locale stubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const SECTIONS = {
  visas: { en: '/visas/', de: 'Visum-Übersichten', ru: 'Обзор виз' },
  guides: { en: '/guides/', de: 'Leitfäden', ru: 'Гиды' },
  compare: { en: '/compare/', de: 'Vergleiche', ru: 'Сравнения' },
  tools: { en: '/tools/', de: 'Tools', ru: 'Инструменты' },
  glossary: { en: '/glossary/', de: 'Glossar', ru: 'Глоссарий' },
  professions: { en: '/professions/', de: 'Berufe', ru: 'Профессии' },
  'best-visa': { en: '/best-visa/', de: 'Budget-Visa', ru: 'Визы по бюджету' },
  pattaya: { en: '/pattaya/', de: 'Pattaya', ru: 'Pattaya' },
};

let styles = '';
try {
  const hub = fs.readFileSync(path.join(ROOT, 'de/index.html'), 'utf8');
  styles = hub.slice(hub.indexOf('<style>'), hub.indexOf('</style>') + 8);
} catch {
  styles = '<style>body{background:#000;color:#fafafa;font-family:Inter,sans-serif}a{color:#06b6d4}ul{columns:2}@media(max-width:760px){ul{columns:1}}</style>';
}

function listSlugs(lang, section) {
  const dir = path.join(ROOT, lang, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((d) => d !== 'index.html' && fs.existsSync(path.join(dir, d, 'index.html')))
    .sort();
}

function build(lang, section, cfg) {
  const slugs = listSlugs(lang, section);
  const loc = `${BASE}/${lang}/${section}/`;
  const en = `${BASE}${cfg.en}`;
  const title =
    lang === 'de' ? `${cfg.de} auf Deutsch — Pattaya Visa Help` : `${cfg.ru} на русском — Pattaya Visa Help`;
  const h1 = lang === 'de' ? cfg.de : cfg.ru;
  const lede =
    lang === 'de'
      ? `${slugs.length} ${cfg.de.toLowerCase()}-Seiten auf Deutsch mit Links zu vollständigen englischen Leitfäden.`
      : `${slugs.length} страниц: ${cfg.ru.toLowerCase()} на русском со ссылками на полные английские гиды.`;
  const links = slugs.map((s) => `<li><a href="/${lang}/${section}/${s}/">${s.replace(/-/g, ' ')}</a></li>`).join('\n');
  const labels =
    lang === 'de'
      ? { full: 'Vollständige Übersicht (EN)', home: '/de/' }
      : { full: 'Полный раздел (EN)', home: '/ru/' };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${lede}" />
<link rel="canonical" href="${loc}" />
<link rel="alternate" hreflang="en" href="${en}" />
<link rel="alternate" hreflang="de" href="${BASE}/de/${section}/" />
<link rel="alternate" hreflang="ru" href="${BASE}/ru/${section}/" />
<link rel="alternate" hreflang="x-default" href="${en}" />
${styles}
<script src="/analytics-events.js" defer></script>
</head>
<body>
<a href="/" class="brand"><span class="dot"></span>PATTAYA<span class="accent">VISA</span>HELP</a>
<header class="article-head">
<h1>${h1}</h1>
<p class="lede">${lede}</p>
</header>
<main class="article-body">
<p><a href="${cfg.en}">${labels.full} →</a></p>
<ul>${links}</ul>
</main>
<footer style="padding:2rem;text-align:center;font-size:.75rem;color:var(--tl,#a1a1aa)"><a href="${labels.home}">← ${lang === 'de' ? 'Startseite' : 'Главная'}</a></footer>
</body>
</html>`;
}

function patchEnSectionIndex(section) {
  const enFile = path.join(ROOT, section, 'index.html');
  if (!fs.existsSync(enFile)) return;
  let html = fs.readFileSync(enFile, 'utf8');
  const en = `${BASE}/${section}/`;
  const block = `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${BASE}/de/${section}/" />\n<link rel="alternate" hreflang="ru" href="${BASE}/ru/${section}/" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  if (html.includes(`/de/${section}/`)) return;
  const hreflangBlock =
    /<link rel="alternate" hreflang="en"[^>]+>\s*\n(?:<link rel="alternate" hreflang="(?:de|ru)"[^>]+>\s*\n)*<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/;
  if (hreflangBlock.test(html)) html = html.replace(hreflangBlock, block);
  else if (html.includes(`<link rel="canonical" href="${en}" />`)) {
    html = html.replace(`<link rel="canonical" href="${en}" />`, `<link rel="canonical" href="${en}" />\n${block.trim()}`);
  }
  fs.writeFileSync(enFile, html);
}

const report = [];
for (const [section, cfg] of Object.entries(SECTIONS)) {
  for (const lang of ['de', 'ru']) {
    const slugs = listSlugs(lang, section);
    if (!slugs.length) continue;
    const dir = path.join(ROOT, lang, section);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), build(lang, section, cfg));
    report.push(`${lang}/${section}/`);
  }
  patchEnSectionIndex(section);
}
console.log(JSON.stringify({ indexes: report }, null, 2));
