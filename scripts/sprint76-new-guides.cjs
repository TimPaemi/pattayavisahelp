/**
 * Sprint 76 — SEO pillar guides: TDAC + Non-O extension Pattaya.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';
const TEMPLATE = path.join(ROOT, 'guides/90-day-reporting/index.html');

const GUIDES = [
  {
    slug: 'thailand-digital-arrival-card',
    title: 'Thailand Digital Arrival Card (TDAC) 2026 — Guide',
    desc: 'TDAC Thailand 2026: mandatory digital arrival card within 72h before landing. Step-by-step, QR code, Pattaya tips, 90-day link. Free at tdac.immigration.go.th.',
    h1: 'Thailand Digital Arrival Card — <span class="pk">TDAC</span> <span class="cy">2026</span>',
    lede: 'Every foreigner entering Thailand must file TDAC within 72 hours before arrival — free at tdac.immigration.go.th. Replaced paper TM6 in 2025. Save the QR PDF; missing TDAC blocks online 90-day reporting.',
    tldr: '72h before arrival · tdac.immigration.go.th · free · QR PDF · every entry · Pattaya = Chonburi province',
    label: '// GUIDE · ARRIVAL · COMPLIANCE',
    crumb: 'Thailand Digital Arrival Card (TDAC)',
    article: 'tdac-guide-article.html',
    schemaName: 'How to complete Thailand Digital Arrival Card (TDAC)',
    schemaHeadline: 'Thailand Digital Arrival Card (TDAC) — 2026 Complete Guide',
    readNext: [
      { href: '/guides/90-day-reporting/', title: '90-day reporting', desc: 'TM47 after entry' },
      { href: '/guides/tm30-reporting/', title: 'TM30', desc: 'Landlord 24h rule' },
      { href: '/guides/jomtien-immigration-office/', title: 'Jomtien', desc: 'Pattaya immigration' },
    ],
  },
  {
    slug: 'non-o-extension-pattaya',
    title: 'Non-O Extension Pattaya 2026 — Jomtien Guide',
    desc: 'Non-O retirement visa extension at Jomtien Immigration Pattaya 2026. ฿800k bank letter, TM30, TM7 checklist, ฿1,900 fee, timing window, common rejections.',
    h1: 'Non-O extension — <span class="pk">Pattaya</span> <span class="cy">Jomtien</span>',
    lede: 'Annual Non-O retirement extension at Chonburi Immigration (Jomtien): ฿1,900 fee, ฿800,000 bank letter or ฿65,000/month income, TM30, lease + map. Apply 30 days before expiry — collared shirt, no shorts.',
    tldr: '฿1,900 · ฿800k or ฿65k/mo · TM7 + TM30 · Jomtien Soi 5 · 30-day window',
    label: '// GUIDE · RETIREMENT · EXTENSION',
    crumb: 'Non-O Extension Pattaya',
    article: 'non-o-extension-pattaya-article.html',
    schemaName: 'How to extend Non-O retirement visa at Jomtien Pattaya',
    schemaHeadline: 'Non-O Retirement Extension at Jomtien Immigration Pattaya — 2026',
    readNext: [
      { href: '/visas/retirement-non-o/', title: 'Non-O visa', desc: 'Full visa guide' },
      { href: '/guides/jomtien-immigration-office/', title: 'Jomtien office', desc: 'Queue & hours' },
      { href: '/guides/thai-bank-account-as-foreigner/', title: 'Bank account', desc: '฿800k seasoning' },
    ],
  },
];

function setAllMeta(h, g, url) {
  const esc = (s) => s.replace(/"/g, '&quot;');
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${g.title}</title>`);
  h = h.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(g.desc)}"`);
  h = h.replace(/content="https:\/\/pattayavisahelp\.com\/guides\/90-day-reporting\/"/g, `content="${url}"`);
  h = h.replace(/https:\/\/pattayavisahelp\.com\/guides\/90-day-reporting\//g, url);
  h = h.replace(/\/guides\/90-day-reporting\//g, `/guides/${g.slug}/`);
  return h;
}

function patchHeader(h, g) {
  h = h.replace(/<span>90-day reporting<\/span>/, `<span>${g.crumb}</span>`);
  h = h.replace(/<span class="article-label">\/\/ GUIDE · COMPLIANCE<\/span>/, `<span class="article-label">${g.label}</span>`);
  h = h.replace(/<h1>Thailand 90-day reporting[\s\S]*?<\/h1>/, `<h1>${g.h1}</h1>`);
  h = h.replace(/<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${g.lede}</p>`);
  h = h.replace(/<p class="tldr-text">[\s\S]*?<\/p>/, `<p class="tldr-text">${g.tldr}</p>`);
  return h;
}

function readNextBlock(cards) {
  const cls = ['pk', 'cy', 'yl'];
  const items = cards
    .map(
      (c, i) =>
        `<a href="${c.href}" class="rn ${cls[i]}"><div class="cat">// GUIDES</div><h3>${c.title}</h3><p>${c.desc}</p><span class="arr">→</span></a>`
    )
    .join('');
  return `<section class="read-next">
<div class="read-next-hd">
<span class="read-next-lab">// Read next · related guides</span>
<h2 class="read-next-h2">Keep <span style="color:var(--pink)">going</span>.</h2>
</div>
<div class="rn-grid">${items}</div>
</section>`;
}

for (const g of GUIDES) {
  const url = `${BASE}/guides/${g.slug}/`;
  const dest = path.join(ROOT, `guides/${g.slug}/index.html`);
  if (fs.existsSync(dest)) {
    console.log('exists', g.slug);
    continue;
  }
  const article = fs.readFileSync(path.join(__dirname, 'content', g.article), 'utf8');
  let h = fs.readFileSync(TEMPLATE, 'utf8');
  h = setAllMeta(h, g, url);
  h = patchHeader(h, g);
  h = h.replace(
    /"name": "How to file a 90-day report in Thailand"/,
    `"name": "${g.schemaName}"`
  );
  h = h.replace(
    /"headline": "Thailand 90-Day Reporting \(TM47\) — 2026 Complete Guide"/,
    `"headline": "${g.schemaHeadline}"`
  );
  h = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${article}\n</main>`);
  h = h.replace(/<section class="read-next">[\s\S]*?<\/section>/, readNextBlock(g.readNext));
  h = h.replace(
    /<p class="network-context">[\s\S]*?<\/p>\s*(?=<main)/,
    `<p class="network-context">Compliance: <a href="/guides/tm30-reporting/">TM30</a> · <a href="/guides/90-day-reporting/">90-day</a> · <a href="/guides/jomtien-immigration-office/">Jomtien</a> · <a href="/visas/">All visas</a></p>\n`
  );
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, h);
  console.log('created', g.slug);
}
