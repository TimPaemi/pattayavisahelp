/**
 * Generate DE/RU origin-country stub pages + fix hreflang on EN origin guides.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const ORIGINS = {
  'germany-to-thailand': {
    lang: 'de',
    title: 'Deutschland nach Thailand 2026 — Visum für deutsche Staatsbürger',
    description:
      'Beste Thailand-Visa für Deutsche 2026 — DTV, Non-O Rente, LTR, Heirat. Apostille, Rente, Steuer. Aus Pattaya auf Deutsch.',
    h1: 'Deutschland → Thailand',
    lede: 'Deutsche Auswanderer in Pattaya wählen meist DTV (Remote), Non-O Rente (50+) oder LTR (Vermögende). Apostille und Krankenversicherung früh planen.',
    bullets: [
      '<a href="/de/visas/dtv/">DTV auf Deutsch</a> — Remote-Arbeit, 5 Jahre',
      '<a href="/de/visas/retirement-non-o/">Non-O Rente</a> — 50+, ฿800K oder ฿65K/Monat',
      '<a href="/de/visas/ltr/">LTR</a> — Royal Decree 743 Steuerbefreiung',
      '<a href="/pattaya/germany-to-thailand/">Vollständiger EN-Leitfaden</a>',
    ],
    enPath: '/pattaya/germany-to-thailand/',
  },
  'russia-to-thailand': {
    lang: 'ru',
    title: 'Россия → Таиланд 2026 — визы для граждан РФ',
    description:
      'Лучшие визы Таиланд для россиян 2026 — DTV, Non-O, LTR, брак. Консульства, seasoning, Pattaya на русском.',
    h1: 'Россия → Таиланд',
    lede: 'Русскоязычные expats в Pattaya чаще берут DTV (удалёнка), Non-O (50+) или LTR. Seasoning и консульство — ключевые шаги.',
    bullets: [
      '<a href="/ru/visas/dtv/">DTV на русском</a> — удалённая работа, 5 лет',
      '<a href="/ru/visas/retirement-non-o/">Non-O пенсия</a> — 50+',
      '<a href="/ru/visas/ltr/">LTR</a> — Royal Decree 743',
      '<a href="/pattaya/russia-to-thailand/">Полный гид на английском</a>',
    ],
    enPath: '/pattaya/russia-to-thailand/',
  },
};

let styles = '';
try {
  const hub = fs.readFileSync(path.join(ROOT, 'de/index.html'), 'utf8');
  styles = hub.slice(hub.indexOf('<style>'), hub.indexOf('</style>') + 8);
} catch {
  styles = '<style>body{background:#000;color:#fafafa;font-family:Inter,sans-serif}a{color:#06b6d4}</style>';
}

function buildOrigin(slug, data) {
  const lang = data.lang;
  const enUrl = `${BASE}${data.enPath}`;
  const locUrl = `${BASE}/${lang}/pattaya/${slug}/`;
  const deUrl = `${BASE}/de/pattaya/germany-to-thailand/`;
  const ruUrl = `${BASE}/ru/pattaya/russia-to-thailand/`;
  const hub = `/${lang}/`;
  const list = data.bullets.map((b) => `<li>${b}</li>`).join('\n');
  const labels =
    lang === 'de'
      ? { home: 'Deutsch Startseite', consult: 'Beratung auf Deutsch' }
      : { home: 'Русская главная', consult: 'Консультация на русском' };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${data.title}</title>
<meta name="description" content="${data.description}" />
<link rel="canonical" href="${locUrl}" />
<link rel="alternate" hreflang="en" href="${enUrl}" />
<link rel="alternate" hreflang="de" href="${deUrl}" />
<link rel="alternate" hreflang="ru" href="${ruUrl}" />
<link rel="alternate" hreflang="x-default" href="${enUrl}" />
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
<ul>${list}</ul>
<p><a href="${data.enPath}"><strong>Full English guide →</strong></a></p>
<p><a href="/contact/">${labels.consult}</a> · WhatsApp +66 96 728 6999</p>
</main>
<footer style="padding:2rem;text-align:center;font-size:.75rem;color:var(--tl,#a1a1aa)"><a href="${hub}">← ${labels.home}</a></footer>
</body>
</html>`;
}

function patchEnOrigin(slug, data) {
  const f = path.join(ROOT, 'pattaya', slug, 'index.html');
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf8');
  const en = `${BASE}/pattaya/${slug}/`;
  const de = `${BASE}/de/pattaya/germany-to-thailand/`;
  const ru = `${BASE}/ru/pattaya/russia-to-thailand/`;
  const block = `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${de}" />\n<link rel="alternate" hreflang="ru" href="${ru}" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  html = html.replace(
    /<link rel="alternate" hreflang="en"[^>]+>\s*\n(?:<link rel="alternate" hreflang="[^"]+"[^>]+>\s*\n)*<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/,
    block
  );
  fs.writeFileSync(f, html);
}

const report = [];
for (const [slug, data] of Object.entries(ORIGINS)) {
  const dir = path.join(ROOT, data.lang, 'pattaya', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildOrigin(slug, data));
  patchEnOrigin(slug, data);
  report.push(`${data.lang}/pattaya/${slug}`);
}

console.log(JSON.stringify({ origins: report }, null, 2));
