/**
 * Inject FAQPage schema + FAQ block into top DE guide stubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const GUIDE_FAQ = {
  '90-day-reporting': {
    de: [
      { q: 'Wann muss ich die 90-Tage-Meldung abgeben?', a: 'Zwischen 15 Tage vor und 7 Tage nach dem Fälligkeitsdatum — online oder persönlich in Jomtien.' },
      { q: 'Brauche ich TM30 für die Online-Meldung?', a: 'Ja — die Adresse muss mit dem letzten TM30 übereinstimmen, sonst lehnt das Portal ab.' },
    ],
  },
  'tm30-reporting': {
    de: [
      { q: 'Wer muss TM30 melden?', a: 'Vermieter, Hotel oder juristic person innerhalb 24 Stunden nach Check-in des Ausländers.' },
      { q: 'Was passiert ohne TM30?', a: 'Visumverlängerungen und 90-Tage-Meldungen werden abgelehnt.' },
    ],
  },
  'jomtien-immigration-office': {
    de: [
      { q: 'Wann ist Jomtien am wenigsten voll?', a: 'Mo–Fr vor 08:30 Uhr — nach 10 Uhr steigen Wartezeiten stark.' },
      { q: 'Gebäude A oder B?', a: '90-Tage-Meldungen oft Gebäude A; Verlängerungen anderer Schalter — Sicherheit fragen.' },
    ],
  },
  'thai-bank-account-as-foreigner': {
    de: [
      { q: 'Welche Dokumente brauche ich?', a: 'Pass, TM30, Mietvertrag — manche Filialen verlangen Referenzschreiben oder Visum.' },
      { q: 'Kann ich DTV Seasoning auf Thai-Konto nachweisen?', a: 'Ja — offizielles Bank-PDF mit 3–6 Monaten Historie, kein App-Screenshot.' },
    ],
  },
  'retiring-in-thailand': {
    de: [
      { q: 'Non-O oder O-A für Rentner?', a: 'Non-O oft einfacher in Pattaya (lokale Verlängerung); O-A vor Reise mit 3M THB Versicherung.' },
      { q: 'Ab welchem Alter?', a: '50+ für Non-O, O-A und O-X (O-X nur 14 Nationalitäten).' },
    ],
  },
  'switch-ed-to-dtv': {
    de: [
      { q: 'Kann ich ED direkt zu DTV wechseln?', a: 'Meist Ausreise und DTV-Antrag im Konsulat — kein In-Country-Switch von ED zu DTV.' },
      { q: 'Bleibt ED-Overstay beim Wechsel?', a: 'Nein überstayen — ED vor Ablauf beenden oder verlängern, dann geplant ausreisen.' },
    ],
  },
  're-entry-permits': {
    de: [
      { q: 'Single oder Multiple Re-Entry?', a: 'Single ฿1.000 einmal; Multiple ฿3.800 für häufige Reisen — vor Abflug beantragen.' },
      { q: 'Gilt Re-Entry für DTV?', a: 'DTV ist Multi-Entry — Re-Entry Permit betrifft vor allem Verlängerungs-Stamps wie Non-O.' },
    ],
  },
  'visa-overstay-penalties': {
    de: [
      { q: 'Wie hoch ist die Overstay-Strafe?', a: '฿500 pro Tag, bei freiwilliger Stellung oft max ฿20.000 — aktuelle Regel am Tag prüfen.' },
      { q: 'Ab wann Re-entry-Verbot?', a: 'Längere Overstays können 1–10 Jahre Ban auslösen — freiwillige Stellung bevorzugt.' },
    ],
  },
  'permanent-residency-thailand': {
    de: [
      { q: 'Wann kann ich PR beantragen?', a: 'Typisch 3+ Jahre ununterbrochen auf qualifizierendem Visum plus Kategorie-Anforderungen.' },
      { q: 'Gibt es ein Kontingent?', a: 'Ja — ca. 100 pro Nationalität pro Jahr, Antragsfenster meist Okt–Dez.' },
    ],
  },
  'thai-tax-foreign-residents': {
    de: [
      { q: 'Ab wann bin ich steuerpflichtig?', a: 'Oft ab 180 Tagen Aufenthalt pro Jahr — Remittance-Regel seit 2024 beachten.' },
      { q: 'Hat DTV Steuervorteil wie LTR?', a: 'Nein — Royal Decree 743 gilt nur für bestimmte LTR-Kategorien, nicht DTV.' },
    ],
  },
};

function injectFaq(html, faqs, lang) {
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
  const faqHtml = `\n<h2>FAQ</h2>\n${block}\n`;
  const schemaTag = `<script type="application/ld+json">\n${JSON.stringify(schema)}\n</script>\n`;
  html = html.replace('</head>', `${schemaTag}</head>`);
  html = html.replace('</main>', `${faqHtml}</main>`);
  return html;
}

const report = [];
for (const [slug, langs] of Object.entries(GUIDE_FAQ)) {
  for (const lang of ['de']) {
    const faqs = langs[lang] || langs.de;
    if (!faqs) continue;
    const f = path.join(ROOT, lang, 'guides', slug, 'index.html');
    if (!fs.existsSync(f)) continue;
    let html = fs.readFileSync(f, 'utf8');
    const next = injectFaq(html, faqs, lang);
    if (next !== html) {
      fs.writeFileSync(f, next);
      report.push(`${lang}/guides/${slug}`);
    }
  }
}
console.log(JSON.stringify({ faqGuides: report }, null, 2));
