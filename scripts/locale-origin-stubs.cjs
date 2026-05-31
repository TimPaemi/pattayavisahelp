/**
 * Generate DE/RU origin-country stub pages + fix hreflang on EN origin guides.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const ORIGINS = {
  'germany-to-thailand': {
    langs: ['de'],
    de: {
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
    },
  },
  'russia-to-thailand': {
    langs: ['ru'],
    ru: {
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
    },
  },
  'uk-to-thailand': {
    langs: ['de', 'ru'],
    de: {
      title: 'UK nach Thailand 2026 — Visum für britische Staatsbürger',
      description: 'Beste Thailand-Visa für Briten 2026 — DTV, Non-O Rente, LTR, GBP-Pension. Pattaya Beratung auf Deutsch.',
      h1: 'UK → Thailand',
      lede: 'Britische Rentner und Remote-Arbeiter in Pattaya — DTV, Non-O (50+) oder LTR je nach Einkommen und Steuerplan.',
      bullets: [
        '<a href="/de/visas/dtv/">DTV</a> · <a href="/de/visas/retirement-non-o/">Non-O Rente</a>',
        '<a href="/pattaya/uk-to-thailand/">Full English guide</a>',
      ],
    },
    ru: {
      title: 'UK → Таиланд 2026 — визы для британцев',
      description: 'Лучшие визы для граждан UK 2026 — DTV, Non-O, LTR. Консультации Pattaya на русском.',
      h1: 'UK → Таиланд',
      lede: 'Британские expats в Pattaya — DTV, Non-O или LTR по профилю дохода.',
      bullets: [
        '<a href="/ru/visas/dtv/">DTV</a> · <a href="/ru/visas/retirement-non-o/">Non-O</a>',
        '<a href="/pattaya/uk-to-thailand/">English guide</a>',
      ],
    },
  },
  'usa-to-thailand': {
    langs: ['de', 'ru'],
    de: {
      title: 'USA nach Thailand 2026 — Visum für US-Bürger',
      description: 'Thailand-Visa für Amerikaner 2026 — DTV, LTR, Non-O, Privilege. Pattaya auf Deutsch.',
      h1: 'USA → Thailand',
      lede: 'US-Bürger nutzen DTV (Remote), LTR (WGC) oder Non-O Rente — Embassy Seasoning 6 Monate üblich.',
      bullets: ['<a href="/de/visas/dtv/">DTV</a> · <a href="/de/visas/ltr/">LTR</a>', '<a href="/pattaya/usa-to-thailand/">EN guide</a>'],
    },
    ru: {
      title: 'США → Таиланд 2026 — визы для американцев',
      description: 'Визы Таиланд для US citizens 2026 — DTV, LTR, Non-O.',
      h1: 'США → Таиланд',
      lede: 'Американцы в Pattaya — DTV, LTR или Non-O; seasoning 6 месяцев в посольстве.',
      bullets: ['<a href="/ru/visas/dtv/">DTV</a> · <a href="/ru/visas/ltr/">LTR</a>', '<a href="/pattaya/usa-to-thailand/">EN guide</a>'],
    },
  },
  'australia-to-thailand': {
    langs: ['de', 'ru'],
    de: {
      title: 'Australien nach Thailand 2026 — Visum für australische Bürger',
      description: 'Thailand-Visa für Australier 2026 — DTV, Non-O, LTR. Pattaya Beratung.',
      h1: 'Australien → Thailand',
      lede: 'Australische Nomaden und Rentner in Pattaya — DTV oder Non-O häufigste Routen.',
      bullets: ['<a href="/de/visas/dtv/">DTV</a> · <a href="/de/visas/retirement-non-o/">Non-O</a>', '<a href="/pattaya/australia-to-thailand/">EN guide</a>'],
    },
    ru: {
      title: 'Австралия → Таиланд 2026 — визы',
      description: 'Визы Таиланд для австралийцев 2026.',
      h1: 'Австралия → Таиланд',
      lede: 'Австралийцы в Pattaya — DTV или Non-O по профилю.',
      bullets: ['<a href="/ru/visas/dtv/">DTV</a> · <a href="/ru/visas/retirement-non-o/">Non-O</a>', '<a href="/pattaya/australia-to-thailand/">EN guide</a>'],
    },
  },
  'china-to-thailand': {
    langs: ['de', 'ru'],
    de: {
      title: 'China nach Thailand 2026 — Visum für chinesische Staatsbürger',
      description: 'Thailand-Visa für Chinesen 2026 — DTV, ED, Non-B. Pattaya.',
      h1: 'China → Thailand',
      lede: 'Chinesische Staatsbürger — DTV, ED oder Non-B je nach Einkommen und Arbeit.',
      bullets: ['<a href="/de/visas/dtv/">DTV</a> · <a href="/de/visas/education-ed/">ED</a>', '<a href="/pattaya/china-to-thailand/">EN guide</a>'],
    },
    ru: {
      title: 'Китай → Таиланд 2026 — визы',
      description: 'Визы для граждан КНР 2026.',
      h1: 'Китай → Таиланд',
      lede: 'DTV, ED или Non-B — по профилю.',
      bullets: ['<a href="/ru/visas/dtv/">DTV</a> · <a href="/ru/visas/education-ed/">ED</a>', '<a href="/pattaya/china-to-thailand/">EN guide</a>'],
    },
  },
  'india-to-thailand': {
    langs: ['de', 'ru'],
    de: {
      title: 'Indien nach Thailand 2026 — Visum für indische Staatsbürger',
      description: 'Thailand-Visa für Inder 2026 — DTV, Non-B, ED. Pattaya.',
      h1: 'Indien → Thailand',
      lede: 'Indische Remote-Arbeiter und Unternehmer — DTV oder Non-B häufig.',
      bullets: ['<a href="/de/visas/dtv/">DTV</a> · <a href="/de/visas/business-non-b/">Non-B</a>', '<a href="/pattaya/india-to-thailand/">EN guide</a>'],
    },
    ru: {
      title: 'Индия → Таиланд 2026 — визы',
      description: 'Визы для граждан Индии 2026.',
      h1: 'Индия → Таиланд',
      lede: 'DTV или Non-B — по занятости и доходу.',
      bullets: ['<a href="/ru/visas/dtv/">DTV</a> · <a href="/ru/visas/business-non-b/">Non-B</a>', '<a href="/pattaya/india-to-thailand/">EN guide</a>'],
    },
  },
};

let styles = '';
try {
  const hub = fs.readFileSync(path.join(ROOT, 'de/index.html'), 'utf8');
  styles = hub.slice(hub.indexOf('<style>'), hub.indexOf('</style>') + 8);
} catch {
  styles = '<style>body{background:#000;color:#fafafa;font-family:Inter,sans-serif}a{color:#06b6d4}</style>';
}

function buildOrigin(slug, lang, data) {
  const cfg = ORIGINS[slug];
  const enPath = `/pattaya/${slug}/`;
  const enUrl = `${BASE}${enPath}`;
  const locUrl = `${BASE}/${lang}/pattaya/${slug}/`;
  const deUrl = cfg.langs.includes('de') ? `${BASE}/de/pattaya/${slug}/` : `${BASE}/de/`;
  const ruUrl = cfg.langs.includes('ru') ? `${BASE}/ru/pattaya/${slug}/` : `${BASE}/ru/`;
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
<p><a href="${enPath}"><strong>Full English guide →</strong></a></p>
<p><a href="/contact/">${labels.consult}</a> · WhatsApp +66 96 728 6999</p>
</main>
<footer style="padding:2rem;text-align:center;font-size:.75rem;color:var(--tl,#a1a1aa)"><a href="/${lang}/">← ${labels.home}</a></footer>
</body>
</html>`;
}

function patchEnOrigin(slug) {
  const f = path.join(ROOT, 'pattaya', slug, 'index.html');
  if (!fs.existsSync(f)) return;
  const cfg = ORIGINS[slug];
  let html = fs.readFileSync(f, 'utf8');
  const en = `${BASE}/pattaya/${slug}/`;
  const de = cfg.langs.includes('de') ? `${BASE}/de/pattaya/${slug}/` : `${BASE}/de/`;
  const ru = cfg.langs.includes('ru') ? `${BASE}/ru/pattaya/${slug}/` : `${BASE}/ru/`;
  const block = `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${de}" />\n<link rel="alternate" hreflang="ru" href="${ru}" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  html = html.replace(
    /<link rel="alternate" hreflang="en"[^>]+>\s*\n(?:<link rel="alternate" hreflang="[^"]+"[^>]+>\s*\n)*<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/,
    block
  );
  fs.writeFileSync(f, html);
}

const report = [];
for (const [slug, cfg] of Object.entries(ORIGINS)) {
  for (const lang of cfg.langs) {
    const data = cfg[lang];
    if (!data) continue;
    const dir = path.join(ROOT, lang, 'pattaya', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), buildOrigin(slug, lang, data));
    report.push(`${lang}/pattaya/${slug}`);
  }
  patchEnOrigin(slug);
}
console.log(JSON.stringify({ origins: report }, null, 2));
