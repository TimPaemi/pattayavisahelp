/**
 * DE/RU stubs for EN-only landing / hub pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const LANDINGS = {
  'digital-nomad': {
    de: {
      title: 'Digital Nomad Thailand 2026 — DTV & LTR auf Deutsch',
      h1: 'Digital Nomad in Thailand',
      lede: 'DTV für Remote-Arbeit, LTR Work-from-Thailand für höheres Einkommen. Pattaya, Chiang Mai, Bangkok — Visum zuerst planen.',
    },
    ru: {
      title: 'Digital Nomad Таиланд 2026 — DTV и LTR на русском',
      h1: 'Digital Nomad в Таиланде',
      lede: 'DTV для удалёнки, LTR W-from-T для высокого дохода. Pattaya, Chiang Mai — сначала виза.',
    },
  },
  retirement: {
    de: {
      title: 'Ruhestand in Thailand 2026 — Non-O, O-A, LTR auf Deutsch',
      h1: 'Ruhestand in Thailand',
      lede: '50+ Retirees: Non-O in Pattaya, O-A via Botschaft, LTR für Steuervorteile mit Royal Decree 743.',
    },
    ru: {
      title: 'Пенсия в Таиланде 2026 — Non-O, O-A, LTR',
      h1: 'Пенсия в Таиланде',
      lede: '50+: Non-O в Pattaya, O-A через консульство, LTR с RD 743.',
    },
  },
  'work-permit': {
    de: {
      title: 'Work Permit Thailand 2026 — Non-B Leitfaden auf Deutsch',
      h1: 'Work Permit Thailand',
      lede: 'Legale Arbeit nur mit Non-B + Work Permit. Renewal, Employer-Docs, Pattaya DOE.',
    },
    ru: {
      title: 'Work Permit Таиланд 2026 — Non-B на русском',
      h1: 'Work Permit Таиланд',
      lede: 'Легальная работа — Non-B + work permit. Продление, документы работодателя.',
    },
  },
  'case-studies': {
    de: {
      title: 'Fallstudien Thailand Visum 2026 — anonymisiert auf Deutsch',
      h1: 'Visum-Fallstudien',
      lede: 'Echte Muster aus Pattaya — DTV, LTR, Non-O, ED, Non-B. Anonymisiert, Tier-1-Quellen.',
    },
    ru: {
      title: 'Кейсы виз Таиланд 2026 — анонимно на русском',
      h1: 'Кейсы по визам',
      lede: 'Реальные паттерны из Pattaya — DTV, LTR, Non-O, ED. Анонимизировано.',
    },
  },
  'pattaya-digital-nomad-guide': {
    de: {
      title: 'Pattaya Digital Nomad Guide 2026 — auf Deutsch',
      h1: 'Digital Nomad Pattaya',
      lede: 'Coworking, Miete Jomtien, DTV/LTR, Steuer — Pattaya vs Bangkok für Nomaden.',
    },
    ru: {
      title: 'Digital Nomad Pattaya 2026 — на русском',
      h1: 'Digital Nomad Pattaya',
      lede: 'Коворкинги, аренда Jomtien, DTV/LTR — Pattaya для номадов.',
    },
  },
  healthcare: {
    de: {
      title: 'Gesundheitsversorgung Thailand 2026 — für Expats auf Deutsch',
      h1: 'Healthcare Thailand',
      lede: 'Krankenhäuser Pattaya, Versicherung für O-A/LTR, Bangkok International Hospital Netzwerk.',
    },
    ru: {
      title: 'Медицина Таиланд 2026 — для expat на русском',
      h1: 'Healthcare Таиланд',
      lede: 'Больницы Pattaya, страховка для O-A/LTR.',
    },
  },
  banking: {
    de: {
      title: 'Banking Thailand 2026 — Konten für Ausländer auf Deutsch',
      h1: 'Banking Thailand',
      lede: 'Thai Bankkonto, FET Form, DTV Seasoning — Pattaya Filialen.',
    },
    ru: {
      title: 'Банки Таиланд 2026 — счета для иностранцев',
      h1: 'Banking Таиланд',
      lede: 'Счёт, FET, DTV seasoning — отделения Pattaya.',
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
  const en = `${BASE}/${slug}/`;
  const loc = `${BASE}/${lang}/${slug}/`;
  const labels =
    lang === 'de'
      ? { full: 'Vollständiger Leitfaden (EN)', consult: 'Beratung auf Deutsch', home: '/de/' }
      : { full: 'Полный гид (EN)', consult: 'Консультация на русском', home: '/ru/' };
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${data.title}</title>
<meta name="description" content="${data.lede}" />
<link rel="canonical" href="${loc}" />
<link rel="alternate" hreflang="en" href="${en}" />
<link rel="alternate" hreflang="de" href="${BASE}/de/${slug}/" />
<link rel="alternate" hreflang="ru" href="${BASE}/ru/${slug}/" />
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
<p><a href="/${slug}/">${labels.full} →</a></p>
<p><a href="/contact/">${labels.consult}</a></p>
</main>
<footer style="padding:2rem;text-align:center;font-size:.75rem;color:var(--tl,#a1a1aa)"><a href="${labels.home}">← ${lang === 'de' ? 'Startseite' : 'Главная'}</a></footer>
</body>
</html>`;
}

function patchEn(slug) {
  const enFile = path.join(ROOT, slug, 'index.html');
  if (!fs.existsSync(enFile)) return;
  let html = fs.readFileSync(enFile, 'utf8');
  const en = `${BASE}/${slug}/`;
  const block = `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${BASE}/de/${slug}/" />\n<link rel="alternate" hreflang="ru" href="${BASE}/ru/${slug}/" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  if (html.includes(`/de/${slug}/`)) return;
  const hreflangBlock =
    /<link rel="alternate" hreflang="en"[^>]+>\s*\n(?:<link rel="alternate" hreflang="(?:de|ru)"[^>]+>\s*\n)*<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/;
  if (hreflangBlock.test(html)) html = html.replace(hreflangBlock, block);
  else html = html.replace(`<link rel="canonical" href="${en}" />`, `<link rel="canonical" href="${en}" />\n${block.trim()}`);
  fs.writeFileSync(enFile, html);
}

const report = [];
for (const slug of Object.keys(LANDINGS)) {
  for (const lang of ['de', 'ru']) {
    const dir = path.join(ROOT, lang, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), build(lang, slug, LANDINGS[slug][lang]));
    report.push(`${lang}/${slug}/`);
  }
  patchEn(slug);
}
console.log(JSON.stringify({ landings: report }, null, 2));
