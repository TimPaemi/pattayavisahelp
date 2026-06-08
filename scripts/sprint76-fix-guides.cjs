/**
 * Sprint 76b — fix new guide pages: content sync, OG/Twitter, schema, header, hreflang.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const FIX = [
  {
    slug: 'thailand-digital-arrival-card',
    title: 'Thailand Digital Arrival Card (TDAC) 2026 — Guide',
    desc: 'TDAC Thailand 2026: mandatory digital arrival card within 72h before landing. Step-by-step, QR code, Pattaya tips, 90-day link. Free at tdac.immigration.go.th.',
    crumb: 'Thailand Digital Arrival Card (TDAC)',
    h1: 'Thailand Digital Arrival Card — <span class="pk">TDAC</span> <span class="cy">2026</span>',
    lede: 'Every foreigner entering Thailand must file TDAC within 72 hours before arrival — free at tdac.immigration.go.th. Replaced paper TM6 in 2025. Save the QR PDF; missing TDAC blocks online 90-day reporting.',
    tldr: '72h before arrival · tdac.immigration.go.th · free · QR PDF · every entry · Pattaya = Chonburi province',
    label: '// GUIDE · ARRIVAL · COMPLIANCE',
    article: 'tdac-guide-article.html',
    schemaDesc: 'Complete 2026 guide to Thailand Digital Arrival Card (TDAC): 72-hour window, step-by-step portal, QR code, Pattaya tips, link to 90-day reporting.',
  },
  {
    slug: 'non-o-extension-pattaya',
    title: 'Non-O Extension Pattaya 2026 — Jomtien Guide',
    desc: 'Non-O retirement visa extension at Jomtien Immigration Pattaya 2026. ฿800k bank letter, TM30, TM7 checklist, ฿1,900 fee, timing window, common rejections.',
    crumb: 'Non-O Extension Pattaya',
    h1: 'Non-O extension — <span class="pk">Pattaya</span> <span class="cy">Jomtien</span>',
    lede: 'Annual Non-O retirement extension at Chonburi Immigration (Jomtien): ฿1,900 fee, ฿800,000 bank letter or ฿65,000/month income, TM30, lease + map. Apply 30 days before expiry — collared shirt, no shorts.',
    tldr: '฿1,900 · ฿800k or ฿65k/mo · TM7 + TM30 · Jomtien Soi 5 · 30-day window',
    label: '// GUIDE · RETIREMENT · EXTENSION',
    article: 'non-o-extension-pattaya-article.html',
    schemaDesc: 'Non-O retirement visa annual extension at Jomtien Immigration Pattaya 2026: documents, bank letter, TM30, fees, timing, rejections.',
  },
];

function setMeta(html, name, content, attr = 'name') {
  const esc = content.replace(/"/g, '&quot;');
  const re1 = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["'][^"']*["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["'][^"']*["'][^>]+${attr}=["']${name}["']`, 'i');
  const repl = (m) => m.replace(/content=["'][^"']*["']/i, `content="${esc}"`);
  if (re1.test(html)) return html.replace(re1, repl);
  if (re2.test(html)) return html.replace(re2, repl);
  return html;
}

for (const g of FIX) {
  const file = path.join(ROOT, `guides/${g.slug}/index.html`);
  const article = fs.readFileSync(path.join(__dirname, 'content', g.article), 'utf8');
  let h = fs.readFileSync(file, 'utf8');
  const url = `${BASE}/guides/${g.slug}/`;

  h = h.replace(/<title>[^<]*<\/title>/, `<title>${g.title}</title>`);
  h = setMeta(h, 'description', g.desc);
  h = setMeta(h, 'og:title', g.title, 'property');
  h = setMeta(h, 'og:description', g.desc, 'property');
  h = setMeta(h, 'twitter:title', g.title);
  h = setMeta(h, 'twitter:description', g.desc);

  h = h.replace(/"name": "90-Day Reporting Thailand 2026[^"]*"/, `"name": "${g.title}"`);
  h = h.replace(/"headline": "[^"]*"/, `"headline": "${g.title}"`);
  h = h.replace(/"description": "Comprehensive 2026 guide[^"]*"/, `"description": "${g.schemaDesc}"`);

  h = h.replace(/<span>90-day reporting<\/span>/, `<span>${g.crumb}</span>`);
  if (g.h1) {
    h = h.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${g.h1}</h1>`);
    h = h.replace(/<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${g.lede}</p>`);
    h = h.replace(/<p class="tldr-text">[\s\S]*?<\/p>/, `<p class="tldr-text">${g.tldr}</p>`);
    h = h.replace(/<span class="article-label">[^<]*<\/span>/, `<span class="article-label">${g.label}</span>`);
  }
  h = h.replace(
    /<link rel="alternate" hreflang="de" href="[^"]*\/de\/guides\/[^"]*" \/>/,
    ''
  );
  h = h.replace(
    /<link rel="alternate" hreflang="ru" href="[^"]*\/ru\/guides\/[^"]*" \/>/,
    ''
  );

  h = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${article}\n</main>`);

  fs.writeFileSync(file, h);
  console.log('fixed', g.slug);
}
