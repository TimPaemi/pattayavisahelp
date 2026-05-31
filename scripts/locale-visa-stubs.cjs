/**
 * Generate DE/RU visa stub pages + fix hreflang on English pillars.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const VISAS = {
  dtv: {
    de: {
      title: 'DTV Thailand Visum 2026 — Destination Thailand Visa auf Deutsch',
      description:
        'DTV Visum Thailand 2026 — 5 Jahre, 180 Tage pro Einreise, ฿500.000 Bankguthaben, ฿10.000 Gebühr. Für Remote-Arbeiter. Pattaya Beratung auf Deutsch.',
      h1: 'DTV — Destination Thailand Visa',
      lede: 'Das DTV ist das wichtigste Visum für digitale Nomaden und Remote-Arbeiter mit ausländischem Einkommen.',
      bullets: [
        '5 Jahre Multi-Entry · 180 Tage pro Einreise (1× verlängerbar)',
        '฿500.000 Bankguthaben — 3–6 Monate Seasoning je nach Botschaft',
        'Remote-Arbeit für ausländische Arbeitgeber erlaubt',
        'Keine Royal-Decree-743-Steuerbefreiung (nur LTR)',
      ],
    },
    ru: {
      title: 'DTV Таиланд 2026 — Destination Thailand Visa на русском',
      description:
        'DTV виза Таиланд 2026 — 5 лет, 180 дней за въезд, ฿500 000 на счёте. Для удалёнщиков. Консультации из Пattaya.',
      h1: 'DTV — Destination Thailand Visa',
      lede: 'DTV — главная виза для цифровых кочевников с иностранным доходом.',
      bullets: [
        '5 лет multi-entry · 180 дней за въезд',
        '฿500 000 на счёте — seasoning 3–6 месяцев',
        'Удалённая работа на иностранного работодателя',
        'Нет освобождения RD 743 (только LTR)',
      ],
    },
  },
  ltr: {
    de: {
      title: 'LTR Visum Thailand 2026 — Long-Term Resident auf Deutsch',
      description: 'LTR Thailand 2026 — 10 Jahre, Royal Decree 743 Steuerbefreiung. Voraussetzungen und Pattaya-Schritte.',
      h1: 'LTR — Long-Term Resident',
      lede: '10-Jahres-Visum mit BOI-Genehmigung — einzige gängige Route mit ausländischer Einkommensbefreiung.',
      bullets: ['10 Jahre (5+5) · USD 80.000/Jahr', 'Royal Decree 743 für W, P, T', 'USD 50.000 Krankenversicherung'],
    },
    ru: {
      title: 'LTR виза Таиланд 2026 — на русском',
      description: 'LTR Таиланд 2026 — 10 лет, Royal Decree 743. Требования и шаги в Пattaya.',
      h1: 'LTR — Long-Term Resident',
      lede: '10-летняя виза с одобрением BOI — путь с налоговым освобождением иностранного дохода.',
      bullets: ['10 лет (5+5) · USD 80 000/год', 'Royal Decree 743 для W, P, T', 'Медстраховка USD 50 000'],
    },
  },
  'privilege-elite': {
    de: {
      title: 'Thailand Privilege Elite Visum 2026 — auf Deutsch',
      description: 'Privilege Elite 2026 — 5–20 Jahre, ฿650K–5M. Kein Einkommensnachweis.',
      h1: 'Thailand Privilege (Elite)',
      lede: 'Mitgliedschaftsvisum für Kapitalreiche ohne Einkommensdokumentation.',
      bullets: ['Bronze ฿650K bis Reserve ฿5M', 'Kein Einkommensnachweis', 'Keine RD-743-Befreiung'],
    },
    ru: {
      title: 'Thailand Privilege Elite 2026 — на русском',
      description: 'Privilege Elite 2026 — 5–20 лет, ฿650K–5M. Без подтверждения дохода.',
      h1: 'Thailand Privilege (Elite)',
      lede: 'Членская виза для тех, у кого есть капитал, но нет документов о доходе.',
      bullets: ['Bronze ฿650K до Reserve ฿5M', 'Без подтверждения дохода', 'Нет RD 743'],
    },
  },
  'retirement-non-o': {
    de: {
      title: 'Non-O Rentenvisum Thailand 2026 — auf Deutsch',
      description: 'Non-O Retirement 2026 — 50+, ฿800K Bank oder ฿65K/Monat. Jährliche Verlängerung Pattaya.',
      h1: 'Non-O Retirement',
      lede: 'Standard für Rentner ab 50 in Pattaya — ohne 3M-THB-Versicherungspflicht wie O-A.',
      bullets: ['50+ · ฿800.000 oder ฿65.000/Monat', 'Jährliche Verlängerung Jomtien', '90-Tage-Meldung Pflicht'],
    },
    ru: {
      title: 'Non-O пенсионная виза 2026 — на русском',
      description: 'Non-O Retirement 2026 — 50+, ฿800K или ฿65K/мес. Продление в Пattaya.',
      h1: 'Non-O Retirement',
      lede: 'Стандарт для пенсионеров 50+ — проще O-A.',
      bullets: ['50+ · ฿800 000 или ฿65 000/мес', 'Продление Jomtien Immigration', '90-day report'],
    },
  },
  'retirement-o-a': {
    de: {
      title: 'O-A Rentenvisum Thailand 2026 — auf Deutsch',
      description: 'O-A Retirement 2026 — Botschaftsvisum, THB 3M Krankenversicherung Pflicht.',
      h1: 'O-A Retirement',
      lede: 'Visum vor Reiseantritt mit mandatory Thai health insurance.',
      bullets: ['Vor Reise in Botschaft', 'THB 3M Versicherung/Jahr', '50+ · ฿800K oder ฿65K/Monat'],
    },
    ru: {
      title: 'O-A пенсионная виза 2026 — на русском',
      description: 'O-A Retirement 2026 — консульство до поездки, страховка THB 3M.',
      h1: 'O-A Retirement',
      lede: 'Консульская виза с обязательной медстраховкой.',
      bullets: ['Оформление дома', 'Страховка THB 3M/год', '50+ · ฿800K или ฿65K/мес'],
    },
  },
  'retirement-o-x': {
    de: {
      title: 'O-X Rentenvisum Thailand 2026 — auf Deutsch',
      description: 'O-X Retirement 2026 — 5 Jahre, 14 Nationalitäten, ฿3M Thai Bank.',
      h1: 'O-X Retirement',
      lede: '5-Jahres-Rentenvisum für 14 berechtigte Nationalitäten.',
      bullets: ['5 Jahre', '฿3M Thai Bank', '14 Nationalitäten'],
    },
    ru: {
      title: 'O-X пенсионная виза 2026 — на русском',
      description: 'O-X Retirement 2026 — 5 лет, 14 гражданств, ฿3M в банке.',
      h1: 'O-X Retirement',
      lede: '5-летняя пенсионная виза для 14 eligible гражданств.',
      bullets: ['5 лет', '฿3M в тайском банке', '14 гражданств'],
    },
  },
  'marriage-non-o': {
    de: {
      title: 'Heirats-Non-O Visum Thailand 2026 — auf Deutsch',
      description: 'Marriage Non-O 2026 — Thai Ehepartner, ฿400K oder ฿40K/Monat.',
      h1: 'Marriage Non-O',
      lede: 'Visum für Ausländer mit thailändischem Ehepartner.',
      bullets: ['Thai Ehepartner', '฿400.000 oder ฿40.000/Monat', 'Jährliche Verlängerung'],
    },
    ru: {
      title: 'Брачная Non-O виза 2026 — на русском',
      description: 'Marriage Non-O 2026 — брак с гражданином Таиланда.',
      h1: 'Marriage Non-O',
      lede: 'Виза для иностранцев в браке с тайцем.',
      bullets: ['Тайский супруг', '฿400 000 или ฿40 000/мес', 'Ежегодное продление'],
    },
  },
  'education-ed': {
    de: {
      title: 'ED Bildungsvisum Thailand 2026 — auf Deutsch',
      description: 'Education ED 2026 — MOE-Akkreditierung, Sprachschule, Muay Thai.',
      h1: 'Education (ED)',
      lede: 'Für echte Studenten an akkreditierten Schulen — verschärfte Kontrollen seit 2025.',
      bullets: ['MOE-Akkreditierung Pflicht', 'Anwesenheit wird geprüft', 'DTV oft besser für Nomaden'],
    },
    ru: {
      title: 'ED образовательная виза 2026 — на русском',
      description: 'Education ED 2026 — аккредитация MOE, языковые школы.',
      h1: 'Education (ED)',
      lede: 'Для реальных студентов аккредитованных школ.',
      bullets: ['Аккредитация MOE', 'Контроль посещаемости', 'DTV часто лучше для номадов'],
    },
  },
  'business-non-b': {
    de: {
      title: 'Non-B Arbeitvisum Thailand 2026 — auf Deutsch',
      description: 'Non-B 2026 — Thai-Arbeitgeber, Work Permit Pflicht.',
      h1: 'Non-B + Work Permit',
      lede: 'Legale Route für Arbeit bei thailändischem Arbeitgeber.',
      bullets: ['Thai Sponsor', 'Work Permit Pflicht', 'Steuer auf Thai-Einkommen'],
    },
    ru: {
      title: 'Non-B рабочая виза 2026 — на русском',
      description: 'Non-B 2026 — тайский работодатель, work permit.',
      h1: 'Non-B + Work Permit',
      lede: 'Легальный путь работы у тайского работодателя.',
      bullets: ['Тайский спонсор', 'Work permit обязателен', 'Налог в Таиланде'],
    },
  },
  smart: {
    de: {
      title: 'SMART Visum Thailand 2026 — auf Deutsch',
      description: 'SMART Visa 2026 — Tech, BOI-zertifiziert, 2–4 Jahre.',
      h1: 'SMART Visa',
      lede: 'BOI-Programm für qualifizierte Tech-Profile — nicht für generische Nomaden.',
      bullets: ['BOI SMART Zertifizierung', '2–4 Jahre', 'Work Permit oft inkludiert'],
    },
    ru: {
      title: 'SMART виза Таиланд 2026 — на русском',
      description: 'SMART Visa 2026 — tech, сертификация BOI.',
      h1: 'SMART Visa',
      lede: 'Программа BOI для квалифицированных tech-специалистов.',
      bullets: ['Сертификация BOI', '2–4 года', 'Work permit часто включён'],
    },
  },
  'tourist-tr-evisa': {
    de: {
      title: 'Tourist TR e-Visa Thailand 2026 — auf Deutsch',
      description: 'Tourist TR 2026 — 60 Tage, nicht für Langzeitaufenthalt.',
      h1: 'Tourist TR / e-Visa',
      lede: 'Kurzaufenthalt — kein Ersatz für DTV oder Retirement.',
      bullets: ['60 Tage', '1× 30 Tage Verlängerung', 'TDAC vor Ankunft Pflicht'],
    },
    ru: {
      title: 'Туристическая TR e-Visa 2026 — на русском',
      description: 'Tourist TR 2026 — 60 дней, не для длительного проживания.',
      h1: 'Tourist TR / e-Visa',
      lede: 'Краткий визит — не замена DTV.',
      bullets: ['60 дней', '1 продление 30 дней', 'TDAC перед прилётом'],
    },
  },
  'media-non-m': {
    de: {
      title: 'Media Non-M Visum Thailand 2026 — auf Deutsch',
      description: 'Media Non-M 2026 — akkreditierte Journalisten.',
      h1: 'Media Non-M',
      lede: 'Für akkreditierte Korrespondenten — nicht für Content Creator.',
      bullets: ['Presseakkreditierung', 'Nicht für YouTuber ohne Akkreditierung'],
    },
    ru: {
      title: 'Media Non-M виза 2026 — на русском',
      description: 'Media Non-M 2026 — аккредитованные журналисты.',
      h1: 'Media Non-M',
      lede: 'Для аккредитованных корреспондентов.',
      bullets: ['Пресс-аккредитация', 'Не для блогеров без статуса'],
    },
  },
};

let styles = '';
try {
  const hub = fs.readFileSync(path.join(ROOT, 'de/index.html'), 'utf8');
  const i = hub.indexOf('<style>');
  const j = hub.indexOf('</style>') + 8;
  styles = hub.slice(i, j);
} catch {
  styles = '<style>body{background:#000;color:#fafafa;font-family:Inter,sans-serif}a{color:#06b6d4}</style>';
}

function hreflangBlock(slug) {
  const en = `${BASE}/visas/${slug}/`;
  const de = `${BASE}/de/visas/${slug}/`;
  const ru = `${BASE}/ru/visas/${slug}/`;
  return `<link rel="alternate" hreflang="en" href="${en}" />\n<link rel="alternate" hreflang="de" href="${de}" />\n<link rel="alternate" hreflang="ru" href="${ru}" />\n<link rel="alternate" hreflang="x-default" href="${en}" />\n`;
}

function buildStub(lang, slug, data) {
  const enUrl = `${BASE}/visas/${slug}/`;
  const locUrl = `${BASE}/${lang}/visas/${slug}/`;
  const deUrl = `${BASE}/de/visas/${slug}/`;
  const ruUrl = `${BASE}/ru/visas/${slug}/`;
  const hubUrl = `/${lang}/`;
  const fullEn = `/visas/${slug}/`;
  const labels =
    lang === 'de'
      ? { full: 'Vollständiger englischer Leitfaden', consult: 'Kostenlose Beratung auf Deutsch', home: 'Deutsch Startseite', en: 'English', other: 'Русский', otherHref: ruUrl }
      : { full: 'Полный гид на английском', consult: 'Бесплатная консультация на русском', home: 'Русская главная', en: 'English', other: 'Deutsch', otherHref: deUrl };
  const list = data.bullets.map((b) => `<li>${b}</li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${data.title}</title>
<meta name="description" content="${data.description}" />
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
<link rel="canonical" href="${locUrl}" />
<link rel="alternate" hreflang="en" href="${enUrl}" />
<link rel="alternate" hreflang="de" href="${deUrl}" />
<link rel="alternate" hreflang="ru" href="${ruUrl}" />
<link rel="alternate" hreflang="x-default" href="${enUrl}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","url":"${locUrl}","name":${JSON.stringify(data.title)},"inLanguage":"${lang}","isPartOf":{"@type":"WebSite","url":"${BASE}/","name":"Pattaya Visa Help"}}
</script>
${styles}
<script src="/analytics-events.js" defer></script>
</head>
<body id="top">
<a href="/" class="brand"><span class="dot"></span>PATTAYA<span class="accent">VISA</span>HELP</a>
<nav class="nav" aria-label="Primary">
<a href="${hubUrl}">${labels.home}</a>
<a href="${fullEn}">${labels.full} →</a>
<a href="/contact/" class="cta">Contact →</a>
</nav>
<header class="article-head">
<div class="crumbs"><a href="${hubUrl}">${lang.toUpperCase()}</a><span class="sep">/</span><span>${data.h1}</span></div>
<span class="article-label">// ${lang.toUpperCase()} · VISA OVERVIEW</span>
<h1>${data.h1}</h1>
<p class="lede">${data.lede}</p>
<div class="article-meta"><span class="live">UPDATED 31 MAY 2026</span></div>
</header>
<main id="main" class="article-body">
<p class="lang-switch">Language: <a href="${fullEn}">${labels.en}</a> · <a href="${labels.otherHref}">${labels.other}</a></p>
<ul>${list}</ul>
<p><a href="${fullEn}"><strong>${labels.full} →</strong></a></p>
<p><a href="/contact/">${labels.consult}</a> · WhatsApp +66 96 728 6999</p>
</main>
<footer style="padding:2rem 1.5rem 5rem;text-align:center;font-size:.75rem;color:var(--tl,#a1a1aa)">
<a href="${hubUrl}">← ${labels.home}</a> · <a href="/visas/">All visas</a>
</footer>
</body>
</html>`;
}

function patchEnHreflang(slug) {
  const f = path.join(ROOT, 'visas', slug, 'index.html');
  if (!fs.existsSync(f)) return false;
  let html = fs.readFileSync(f, 'utf8');
  const en = `${BASE}/visas/${slug}/`;
  const block = hreflangBlock(slug);
  const re = /<link rel="alternate" hreflang="en"[^>]+>\s*\n(?:<link rel="alternate" hreflang="[^"]+"[^>]+>\s*\n)*<link rel="alternate" hreflang="x-default"[^>]+>\s*\n/;
  if (re.test(html)) {
    html = html.replace(re, block);
  } else {
    html = html.replace(
      `<link rel="canonical" href="${en}" />`,
      `<link rel="canonical" href="${en}" />\n${block.trim()}`
    );
  }
  fs.writeFileSync(f, html);
  return true;
}

const report = { stubs: [], hreflang: [] };

for (const slug of Object.keys(VISAS)) {
  for (const lang of ['de', 'ru']) {
    const out = path.join(ROOT, lang, 'visas', slug);
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'index.html'), buildStub(lang, slug, VISAS[slug][lang]));
    report.stubs.push(`${lang}/visas/${slug}`);
  }
  if (patchEnHreflang(slug)) report.hreflang.push(`visas/${slug}`);
}

console.log(JSON.stringify(report, null, 2));
