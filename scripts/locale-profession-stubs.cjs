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
  'affiliate-marketer': {
    de: { title: 'Thailand Visum für Affiliate Marketer 2026', h1: 'Affiliate Marketer', lede: 'Auslandseinkommen aus Affiliate-Netzwerken → DTV. Thai-Traffic monetarisieren → Steuer beachten.', visa: '/visas/dtv/' },
    ru: { title: 'Виза для affiliate marketer 2026', h1: 'Affiliate marketer', lede: 'Доход из зарубежных сетей → DTV. Монетизация тайского трафика → налоги.', visa: '/visas/dtv/' },
  },
  'ai-engineer': {
    de: { title: 'Thailand Visum für AI Engineers 2026', h1: 'AI Engineer', lede: 'Remote für ausländischen Arbeitgeber → DTV oder LTR W-from-T. Thai-Arbeitgeber → SMART/Non-B.', visa: '/visas/dtv/' },
    ru: { title: 'Виза для AI engineer 2026', h1: 'AI engineer', lede: 'Remote на иностранную компанию → DTV или LTR. Тайский employer → SMART/Non-B.', visa: '/visas/dtv/' },
  },
  chef: {
    de: { title: 'Thailand Visum für Köche 2026 — Non-B', h1: 'Koch / Chef', lede: 'Arbeit in thailändischem Restaurant → Non-B + Work Permit. Eigenes Catering ohne WP → illegal.', visa: '/visas/business-non-b/' },
    ru: { title: 'Виза для шеф-повара 2026 — Non-B', h1: 'Шеф-повар', lede: 'Работа в тайском ресторане → Non-B + work permit.', visa: '/visas/business-non-b/' },
  },
  'diving-instructor': {
    de: { title: 'Thailand Visum für Tauchlehrer 2026', h1: 'Tauchlehrer', lede: 'Bei PADI-Zentrum angestellt → Non-B. Saisonales Einkommen dokumentieren für Verlängerung.', visa: '/visas/business-non-b/' },
    ru: { title: 'Виза для diving instructor 2026', h1: 'Diving instructor', lede: 'Работа в дайв-центре → Non-B. Сезонный доход для продления.', visa: '/visas/business-non-b/' },
  },
  'fitness-trainer': {
    de: { title: 'Thailand Visum für Personal Trainer 2026', h1: 'Fitness Trainer', lede: 'Online-Coaching Ausland → DTV. Training in thailändischem Gym → Non-B Sponsoring.', visa: '/visas/dtv/' },
    ru: { title: 'Виза для fitness trainer 2026', h1: 'Fitness trainer', lede: 'Онлайн-коучинг → DTV. Работа в зале → Non-B.', visa: '/visas/dtv/' },
  },
  hairdresser: {
    de: { title: 'Thailand Visum für Friseure 2026 — Non-B', h1: 'Friseur / Hairdresser', lede: 'Salon-Arbeit in Pattaya → Non-B + Work Permit. Freelance ohne WP → Risiko.', visa: '/visas/business-non-b/' },
    ru: { title: 'Виза для парикмахера 2026', h1: 'Hairdresser', lede: 'Работа в салоне → Non-B + work permit.', visa: '/visas/business-non-b/' },
  },
  'online-business-owner': {
    de: { title: 'Thailand Visum für Online Business Owner 2026', h1: 'Online Business Owner', lede: 'E-Commerce / SaaS mit ausländischen Kunden → DTV. Thai Ltd + lokaler Umsatz → Non-B Struktur.', visa: '/visas/dtv/' },
    ru: { title: 'Виза для online business owner 2026', h1: 'Online business owner', lede: 'E-commerce с зарубежными клиентами → DTV. Тайская компания → Non-B.', visa: '/visas/dtv/' },
  },
  photographer: {
    de: { title: 'Thailand Visum für Fotografen 2026', h1: 'Fotograf', lede: 'Stock + Auslandskunden → DTV. Hochzeiten/commercial shoots in Thailand → Non-B oder korrekte Rechnungsstellung.', visa: '/visas/dtv/' },
    ru: { title: 'Виза для фотографа 2026', h1: 'Photographer', lede: 'Stock и клиенты из-за рубежа → DTV. Съёмки в Таиланде → Non-B.', visa: '/visas/dtv/' },
  },
  'real-estate-agent': {
    de: { title: 'Thailand Visum für Immobilienmakler 2026', h1: 'Immobilienmakler', lede: 'Thai License + Non-B erforderlich für legalen Verkauf. Auslands-Einkommen → DTV wenn remote.', visa: '/visas/business-non-b/' },
    ru: { title: 'Виза для риелтора 2026', h1: 'Real estate agent', lede: 'Лицензия + Non-B для легальной работы. Remote доход → DTV.', visa: '/visas/business-non-b/' },
  },
  'tattoo-artist': {
    de: { title: 'Thailand Visum für Tattoo Artists 2026', h1: 'Tattoo Artist', lede: 'Studio mit Work Permit → Non-B. Guest spots ohne WP → grau — Pattaya DTV für Auslandseinkommen parallel.', visa: '/visas/dtv/' },
    ru: { title: 'Виза для tattoo artist 2026', h1: 'Tattoo artist', lede: 'Студия с work permit → Non-B. Guest spots → риск. DTV для дохода из-за рубежа.', visa: '/visas/dtv/' },
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
