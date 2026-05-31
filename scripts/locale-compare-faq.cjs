/**
 * FAQPage on top DE/RU compare stubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const COMPARE_FAQ = {
  'dtv-vs-ltr': {
    de: [
      { q: 'DTV oder LTR für Remote-Arbeiter?', a: 'DTV bei ฿500K Seasoning; LTR bei USD 80K/Jahr + BOI und Steuervorteil RD 743.' },
      { q: 'Was kostet 10 Jahre?', a: 'DTV ~฿10K + Verlängerungen; LTR ~USD 50K+ Setup — LTR lohnt bei hohem remitted income.' },
    ],
    ru: [
      { q: 'DTV или LTR для удалёнщика?', a: 'DTV при ฿500K; LTR при USD 80K/год + BOI и RD 743.' },
      { q: 'Стоимость 10 лет?', a: 'DTV дешевле; LTR оправдан при большом remitted доходе.' },
    ],
  },
  'ed-vs-dtv': {
    de: [
      { q: 'ED oder DTV für Nomaden?', a: 'DTV wenn Remote-Einkommen nachweisbar — ED nur für echte Schulbesuche.' },
      { q: 'Kann ich ED zu DTV wechseln?', a: 'Meist Ausreise + Konsulatsantrag, nicht In-Country.' },
    ],
    ru: [
      { q: 'ED или DTV?', a: 'DTV для remote; ED только для реального обучения.' },
      { q: 'Смена ED на DTV?', a: 'Обычно выезд и консульство.' },
    ],
  },
  'privilege-vs-ltr': {
    de: [
      { q: 'Privilege oder LTR?', a: 'Privilege = Kapital ohne Einkommensnachweis; LTR = Einkommen + Steuervorteile.' },
      { q: 'Privilege Steuerfreiheit?', a: 'Nein — keine RD 743 Befreiung wie LTR W/P/T.' },
    ],
    ru: [
      { q: 'Privilege или LTR?', a: 'Privilege — капитал; LTR — доход и налоговые льготы.' },
      { q: 'Privilege без налога?', a: 'Нет RD 743 как у LTR.' },
    ],
  },
  'non-o-vs-o-a': {
    de: [
      { q: 'Non-O oder O-A in Pattaya?', a: 'Non-O: lokale Verlängerung Jomtien; O-A: Botschaft + 3M THB Versicherung.' },
      { q: 'Gleiches Einkommen?', a: 'Beide ~฿800K oder ฿65K/Monat — Anforderungen ähnlich, Prozess unterschiedlich.' },
    ],
    ru: [
      { q: 'Non-O или O-A?', a: 'Non-O — продление в Pattaya; O-A — консульство + страховка.' },
      { q: 'Одинаковый доход?', a: 'Оба ~฿800K или ฿65K/мес.' },
    ],
  },
  'visa-comparison-matrix': {
    de: [
      { q: 'Welches Visum passt zu mir?', a: 'Nutzen Sie den Visa Finder — Matrix zeigt alle 12 Nebeneinander.' },
      { q: 'Aktuell für 2026?', a: 'Ja — DTV, LTR, O-X Änderungen eingepflegt.' },
    ],
    ru: [
      { q: 'Какая виза мне подходит?', a: 'Visa Finder quiz + матрица 12 виз.' },
      { q: 'Актуально 2026?', a: 'Да — включены DTV, LTR, O-X.' },
    ],
  },
};

function injectFaq(html, faqs) {
  if (html.includes('FAQPage') || html.includes('<h2>FAQ</h2>')) return html;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const block = faqs.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n');
  html = html.replace('</head>', `<script type="application/ld+json">\n${JSON.stringify(schema)}\n</script>\n</head>`);
  html = html.replace('</main>', `\n<h2>FAQ</h2>\n${block}\n</main>`);
  return html;
}

const report = [];
for (const [slug, langs] of Object.entries(COMPARE_FAQ)) {
  for (const lang of ['de', 'ru']) {
    const faqs = langs[lang];
    const f = path.join(ROOT, lang, 'compare', slug, 'index.html');
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');
    const next = injectFaq(html, faqs);
    if (next !== html) {
      fs.writeFileSync(f, next);
      report.push(`${lang}/compare/${slug}`);
    }
  }
}
console.log(JSON.stringify({ compareFaq: report }, null, 2));
