/**
 * DE/RU profession overview stubs for top profession pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PROFESSIONS = {
  'saas-founder': {
    de: {
      title: 'Thailand Visum für SaaS-Gründer 2026 — DTV vs LTR',
      h1: 'SaaS-Gründer in Thailand',
      lede: 'Foreign-incorporated SaaS → DTV. High-revenue + assets → LTR Wealthy Global Citizen. Thai market → Non-B structure.',
      visa: '/visas/dtv/',
    },
    ru: {
      title: 'Виза Таиланд для SaaS-фounder 2026 — DTV vs LTR',
      h1: 'SaaS-founder в Таиланде',
      lede: 'SaaS на иностранную компанию → DTV. Высокий доход → LTR WGC. Тайский рынок → Non-B.',
      visa: '/visas/dtv/',
    },
  },
  dj: {
    de: {
      title: 'Thailand Visum für DJs 2026 — DTV + Non-B',
      h1: 'DJ / Electronic Artist',
      lede: 'Streaming-Einkommen → DTV. Pattaya Club-Gigs → Non-B Sponsoring für gebuchte Wochenenden.',
      visa: '/visas/dtv/',
    },
    ru: {
      title: 'Виза Таиланд для DJ 2026 — DTV + Non-B',
      h1: 'DJ / электронная музыка',
      lede: 'Стриминг → DTV. Клубные гиги в Pattaya → Non-B от спонсора на выходные.',
      visa: '/visas/dtv/',
    },
  },
  'crypto-trader': {
    de: {
      title: 'Thailand Visum für Crypto Trader 2026',
      h1: 'Crypto Trader',
      lede: 'Trading-Einkommen zählt nur wenn dokumentiert und embassy-konform. DTV oder LTR je nach Volumen.',
      visa: '/visas/dtv/',
    },
    ru: {
      title: 'Виза Таиланд для crypto trader 2026',
      h1: 'Crypto trader',
      lede: 'Доход от трейдинга — только с документами для консульства. DTV или LTR по профилю.',
      visa: '/visas/dtv/',
    },
  },
  'english-teacher': {
    de: {
      title: 'Thailand Visum für Englischlehrer 2026 — Non-B vs ED',
      h1: 'Englischlehrer',
      lede: 'Echte Schule mit Work Permit → Non-B. Sprachkurs ED nur bei MOE-Schule — kein Shortcut mehr.',
      visa: '/visas/education-ed/',
    },
    ru: {
      title: 'Виза Таиланд для преподавателя английского 2026',
      h1: 'Преподаватель английского',
      lede: 'Школа с work permit → Non-B. ED только при аккредитации MOE.',
      visa: '/visas/education-ed/',
    },
  },
  'yoga-teacher': {
    de: {
      title: 'Thailand Visum für Yoga-Lehrer 2026 — ED vs DTV',
      h1: 'Yoga-Lehrer',
      lede: 'Anerkannte Yoga-Ausbildung → ED. Remote-Kurse + Auslandseinkommen → DTV oft besser.',
      visa: '/visas/dtv/',
    },
    ru: {
      title: 'Виза Таиланд для yoga teacher 2026',
      h1: 'Yoga teacher',
      lede: 'Аккредитованное обучение → ED. Удалённые курсы → часто DTV.',
      visa: '/visas/dtv/',
    },
  },
  'content-creator': {
    de: {
      title: 'Thailand Visum für Content Creator 2026 — DTV',
      h1: 'Content Creator / YouTuber',
      lede: 'AdSense und Brand Deals aus dem Ausland → DTV remote-work route. Thai-Sponsor Content → Non-B.',
      visa: '/visas/dtv/',
    },
    ru: {
      title: 'Виза Таиланд для content creator 2026',
      h1: 'Content creator / YouTuber',
      lede: 'AdSense и бренды из-за рубежа → DTV. Контент для тайского спонсора → Non-B.',
      visa: '/visas/dtv/',
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

function build(lang, slug, data) {
  const en = `${BASE}/professions/${slug}/`;
  const loc = `${BASE}/${lang}/professions/${slug}/`;
  const labels =
    lang === 'de'
      ? { home: '/de/', full: 'Vollständiger Berufsguide (EN)', consult: 'Beratung auf Deutsch' }
      : { home: '/ru/', full: 'Полный гид профессии (EN)', consult: 'Консультация на русском' };
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${data.title}</title>
<meta name="description" content="${data.lede}" />
<link rel="canonical" href="${loc}" />
<link rel="alternate" hreflang="en" href="${en}" />
<link rel="alternate" hreflang="de" href="${BASE}/de/professions/${slug}/" />
<link rel="alternate" hreflang="ru" href="${BASE}/ru/professions/${slug}/" />
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
<p><a href="/professions/${slug}/">${labels.full} →</a> · <a href="${data.visa}">Visa guide →</a></p>
<p><a href="/contact/">${labels.consult}</a></p>
</main>
</body>
</html>`;
}

const report = [];
for (const slug of Object.keys(PROFESSIONS)) {
  for (const lang of ['de', 'ru']) {
    const dir = path.join(ROOT, lang, 'professions', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), build(lang, slug, PROFESSIONS[slug][lang]));
    report.push(`${lang}/professions/${slug}`);
  }
  const enFile = path.join(ROOT, 'professions', slug, 'index.html');
  if (!fs.existsSync(enFile)) continue;
  let html = fs.readFileSync(enFile, 'utf8');
  const en = `${BASE}/professions/${slug}/`;
  const block = `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${BASE}/de/professions/${slug}/" />\n<link rel="alternate" hreflang="ru" href="${BASE}/ru/professions/${slug}/" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  const re = /<link rel="alternate" hreflang="en"[^>]+>\s*\n<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/;
  if (re.test(html) && !html.includes('de/professions')) {
    html = html.replace(re, block);
    fs.writeFileSync(enFile, html);
  }
}
console.log(JSON.stringify({ stubs: report }, null, 2));
