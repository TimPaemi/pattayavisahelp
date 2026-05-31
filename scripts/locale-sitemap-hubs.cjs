/**
 * Generate DE/RU locale sitemap hub pages listing all locale URLs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

let styles = '';
try {
  const hub = fs.readFileSync(path.join(ROOT, 'de/index.html'), 'utf8');
  styles = hub.slice(hub.indexOf('<style>'), hub.indexOf('</style>') + 8);
} catch {
  styles = '<style>body{background:#000;color:#fafafa;font-family:Inter,sans-serif}a{color:#06b6d4}ul{columns:2;gap:2rem}@media(max-width:760px){ul{columns:1}}</style>';
}

function walkLocale(lang, acc = []) {
  const base = path.join(ROOT, lang);
  if (!fs.existsSync(base)) return acc;
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === 'index.html') continue;
        walk(p);
      } else if (e.name === 'index.html' && dir !== base) {
        const rel = path.relative(ROOT, dir).replace(/\\/g, '/');
        acc.push(`/${rel}/`);
      }
    }
  }
  walk(base);
  return acc.sort();
}

function build(lang) {
  const urls = walkLocale(lang);
  const loc = `${BASE}/${lang}/sitemap/`;
  const en = `${BASE}/sitemap/`;
  const title =
    lang === 'de' ? 'Seitenübersicht — Deutsch · Pattaya Visa Help' : 'Карта сайта — русский · Pattaya Visa Help';
  const h1 = lang === 'de' ? 'Alle deutschen Seiten' : 'Все русские страницы';
  const lede =
    lang === 'de'
      ? `${urls.length} indexierbare Seiten auf Deutsch und lokalisierte Übersichten.`
      : `${urls.length} индексируемых страниц на русском и локализованных обзоров.`;
  const sections = {};
  for (const u of urls) {
    const parts = u.split('/').filter(Boolean);
    const section = parts[1] || 'root';
    if (!sections[section]) sections[section] = [];
    sections[section].push(u);
  }
  const body = Object.keys(sections)
    .sort()
    .map((sec) => {
      const links = sections[sec].map((u) => `<li><a href="${u}">${u}</a></li>`).join('\n');
      return `<h2>${sec}</h2>\n<ul>\n${links}\n</ul>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${lede}" />
<link rel="canonical" href="${loc}" />
<link rel="alternate" hreflang="en" href="${en}" />
<link rel="alternate" hreflang="de" href="${BASE}/de/sitemap/" />
<link rel="alternate" hreflang="ru" href="${BASE}/ru/sitemap/" />
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
<p><a href="/sitemap/">English sitemap →</a> · <a href="/sitemap.xml">XML sitemap</a></p>
${body}
</main>
<footer style="padding:2rem;text-align:center;font-size:.75rem;color:var(--tl,#a1a1aa)"><a href="/${lang}/">← ${lang === 'de' ? 'Startseite' : 'Главная'}</a></footer>
</body>
</html>`;
}

for (const lang of ['de', 'ru']) {
  const dir = path.join(ROOT, lang, 'sitemap');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), build(lang));
  console.log(`Built /${lang}/sitemap/ (${walkLocale(lang).length} URLs listed)`);
}
