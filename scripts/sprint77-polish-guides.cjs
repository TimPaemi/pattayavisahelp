/**
 * Sprint 77 — polish new SEO guides: crumbs, schema, EN driving meta, hreflang EN.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const GUIDES = [
  {
    slug: 'thailand-digital-arrival-card',
    title: 'Thailand Digital Arrival Card (TDAC) 2026 — Guide',
    crumb: 'Thailand Digital Arrival Card (TDAC)',
    schemaDesc: 'Complete 2026 guide to Thailand Digital Arrival Card (TDAC): 72-hour window, step-by-step portal, QR code, Pattaya tips.',
    faq: [
      ['Is TDAC the same as TM6?', 'TDAC replaced the paper arrival card (TM6) for most entries.'],
      ['Do children need TDAC?', 'Yes — every passport holder including infants.'],
      ['Do DTV holders need TDAC?', 'Yes — every entry regardless of visa type.'],
    ],
  },
  {
    slug: 'non-o-extension-pattaya',
    title: 'Non-O Extension Pattaya 2026 — Jomtien Guide',
    crumb: 'Non-O Extension Pattaya',
    schemaDesc: 'Non-O retirement visa annual extension at Jomtien Immigration Pattaya 2026: documents, bank letter, TM30, fees.',
    faq: [
      ['Can I extend at Bangkok instead of Jomtien?', 'Use the office matching your TM30 province — Pattaya residents use Jomtien.'],
      ['How much is the extension fee?', '฿1,900 cash for a typical one-year Non-O extension.'],
      ['When should I apply?', 'Within 30 days before your visa expiry date.'],
    ],
  },
];

function faqJson(items) {
  const mainEntity = items.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  }));
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity }, null, 2);
}

for (const g of GUIDES) {
  const file = path.join(ROOT, `guides/${g.slug}/index.html`);
  let h = fs.readFileSync(file, 'utf8');
  const url = `${BASE}/guides/${g.slug}/`;

  h = h.replace(
    /<span>90 Day Reporting<\/span>/,
    `<span>${g.crumb}</span>`
  );
  h = h.replace(
    /"name":"90-Day Reporting Thailand 2026[^"]*"/,
    `"name":"${g.title}"`
  );
  h = h.replace(
    /"name": "90-Day Reporting Thailand 2026[^"]*"/,
    `"name": "${g.title}"`
  );
  h = h.replace(/"mainEntityOfPage": "[^"]*"/, `"mainEntityOfPage": "${url}"`);

  h = h.replace(
    /<script type="application\/ld\+json">\s*\{\s*"@context":"https:\/\/schema\.org",\s*"@type":"FAQPage"[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${faqJson(g.faq)}\n</script>`
  );

  h = h.replace(
    /"position":3,"name":"90-day reporting","item":"[^"]*"/,
    `"position":3,"name":"${g.crumb}","item":"${url}"`
  );

  fs.writeFileSync(file, h);
  console.log('polished', g.slug);
}

// EN driving licence meta (was <120 chars)
const driving = path.join(ROOT, 'guides/driving-licence-thailand/index.html');
let d = fs.readFileSync(driving, 'utf8');
const dDesc =
  'Convert your foreign licence to a Thai driving licence in Pattaya 2026: Jomtien residence certificate, DLT Sukhumvit, ฿205 fee, same-day for EU/UK/US.';
if (!d.includes(dDesc.slice(0, 40))) {
  d = d.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${dDesc}"`
  );
  d = d.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${dDesc}"`
  );
  d = d.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${dDesc}"`
  );
  fs.writeFileSync(driving, d);
  console.log('driving meta');
}
