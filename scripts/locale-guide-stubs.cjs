/**
 * DE/RU guide overview stubs for top how-to guides.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const GUIDES = {
  '90-day-reporting': {
    de: {
      title: '90-Tage-Meldung Thailand 2026 — TM47 Leitfaden auf Deutsch',
      h1: '90-Tage-Meldung in Thailand',
      lede: 'Pflicht für Langzeitvisa. Online via immigration.go.th oder persönlich in Jomtien. TM30 muss vorher vorliegen.',
    },
    ru: {
      title: '90-дневная отчётность Таиланд 2026 — TM47 на русском',
      h1: '90-дневная отчётность',
      lede: 'Обязательна для долгосрочных виз. Онлайн на immigration.go.th или лично в Jomtien. Нужен TM30.',
    },
  },
  'tm30-reporting': {
    de: {
      title: 'TM30 Meldung Thailand 2026 — Vermieter & Check-in',
      h1: 'TM30 Meldung',
      lede: 'Jeder Ausländer-Check-in innerhalb 24h melden. Vermieter, Hotel oder Juristische Person. Ohne TM30 keine Verlängerung.',
    },
    ru: {
      title: 'TM30 отчётность Таиланд 2026 — арендодатель и check-in',
      h1: 'TM30 отчётность',
      lede: 'Check-in иностранца за 24 часа. Арендодатель, отель или juristic person. Без TM30 — нет продления.',
    },
  },
  'jomtien-immigration-office': {
    de: {
      title: 'Jomtien Immigration Büro 2026 — Wartezeiten & Ablauf',
      h1: 'Jomtien Immigration',
      lede: 'Größtes Pattaya-Büro für Non-O, DTV, 90-Tage. Mo–Fr vor 08:30 ankommen. Gebäude A vs B beachten.',
    },
    ru: {
      title: 'Иммиграция Jomtien 2026 — очереди и порядок',
      h1: 'Иммиграция Jomtien',
      lede: 'Главный офис Pattaya для Non-O, DTV, 90-day. Пн–Пт до 08:30. Здание A vs B.',
    },
  },
  'thai-bank-account-as-foreigner': {
    de: {
      title: 'Thai Bankkonto als Ausländer 2026 — Pattaya',
      h1: 'Bankkonto in Thailand',
      lede: 'Pass + TM30 + Mietvertrag für die meisten Pattaya-Filialen. DTV/LTR-Konten für Seasoning-Nachweis.',
    },
    ru: {
      title: 'Банковский счёт в Таиланде для иностранца 2026',
      h1: 'Банковский счёт',
      lede: 'Паспорт + TM30 + договор аренды в Pattaya. Счёт для DTV/LTR seasoning.',
    },
  },
  'cost-of-living-pattaya': {
    de: {
      title: 'Lebenshaltungskosten Pattaya 2026 — Budget für Expats',
      h1: 'Lebenshaltungskosten Pattaya',
      lede: 'Miete Jomtien ฿12–25K, Essen ฿8–15K, Visa-Kosten extra. DTV vs Non-O vs LTR im Vergleich.',
    },
    ru: {
      title: 'Стоимость жизни Pattaya 2026 — бюджет expat',
      h1: 'Стоимость жизни Pattaya',
      lede: 'Аренда Jomtien ฿12–25K, еда ฿8–15K. DTV vs Non-O vs LTR отдельно.',
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
  const en = `${BASE}/guides/${slug}/`;
  const loc = `${BASE}/${lang}/guides/${slug}/`;
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
<link rel="alternate" hreflang="de" href="${BASE}/de/guides/${slug}/" />
<link rel="alternate" hreflang="ru" href="${BASE}/ru/guides/${slug}/" />
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
<p><a href="/guides/${slug}/">${labels.full} →</a></p>
<p><a href="/contact/">${labels.consult}</a></p>
</main>
<footer style="padding:2rem;text-align:center;font-size:.75rem;color:var(--tl,#a1a1aa)"><a href="${labels.home}">← ${lang === 'de' ? 'Deutsch Startseite' : 'Русская главная'}</a></footer>
</body>
</html>`;
}

const report = [];
for (const slug of Object.keys(GUIDES)) {
  for (const lang of ['de', 'ru']) {
    const dir = path.join(ROOT, lang, 'guides', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), build(lang, slug, GUIDES[slug][lang]));
    report.push(`${lang}/guides/${slug}`);
  }
  const enFile = path.join(ROOT, 'guides', slug, 'index.html');
  if (!fs.existsSync(enFile)) continue;
  let html = fs.readFileSync(enFile, 'utf8');
  const en = `${BASE}/guides/${slug}/`;
  const block = `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${BASE}/de/guides/${slug}/" />\n<link rel="alternate" hreflang="ru" href="${BASE}/ru/guides/${slug}/" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
  const hreflangBlock =
    /<link rel="alternate" hreflang="en"[^>]+>\s*\n(?:<link rel="alternate" hreflang="(?:de|ru)"[^>]+>\s*\n)*<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/;
  if (hreflangBlock.test(html) && !html.includes(`/de/guides/${slug}/`)) {
    html = html.replace(hreflangBlock, block);
    fs.writeFileSync(enFile, html);
  }
}
console.log(JSON.stringify({ guides: report }, null, 2));
