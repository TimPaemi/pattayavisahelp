const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');

const META_UPDATES = {
  'best-visa/index.html': 'Best Thailand visa by budget — from under ฿5k/year (tourist + ED) to ฿1M+ (Privilege Elite). Real annual costs, no commissions. Pick your tier and see the right pathway.',
  'best-visa/under-500k/index.html': 'Visas under ฿500,000/year in Thailand — DTV, Non-O retirement, Marriage Non-O, ED, and SMART compared with real fees, insurance, and extension costs for 2026.',
  'case-studies/index.html': 'Three anonymised Thailand visa case studies from Pattaya — UK retiree on LTR, US DJ on DTV + Non-B, German HNW on LTR Wealthy Global Citizen. Real patterns, changed details.',
  'changelog/index.html': 'Pattaya Visa Help changelog — every site update, new guides, visa rule changes, and tool releases. Track what changed and when across all 182 pages.',
  'compare/pattaya-vs-bangkok/index.html': 'Pattaya vs Bangkok for Thailand long-stay visas and expat life — cost, immigration offices, nightlife, healthcare, and which city fits retirees vs digital nomads in 2026.',
  'glossary/cm-form/index.html': 'CM.1 form Thailand — the certificate of residence document used for visa extensions, bank accounts, and driving licences. What it is, where to get it, and when you need it.',
  'glossary/e-visa/index.html': 'Thailand e-Visa explained — online application at thaievisa.go.th for tourist, business, and some long-stay categories. How it differs from visa-exempt entry and embassy stamps.',
  'glossary/immigration-bureau/index.html': 'Royal Thai Immigration Bureau — the agency that issues extensions, 90-day reports, re-entry permits, and overstay penalties. Structure, online portals, and Pattaya offices.',
  'glossary/moe/index.html': 'MOE Thailand — Ministry of Education accreditation for ED visa schools. How to verify a language school or Muay Thai gym is approved before you pay tuition and apply for Non-ED.',
  'glossary/privilege/index.html': 'Thailand Privilege visa (formerly Elite) — membership tiers from ฿650K to ฿5M, 5–20 year stays, fast-track immigration, and who it beats vs DTV or LTR in 2026.',
  'glossary/smart-visa/index.html': 'SMART Visa Thailand — 4-year visa for tech talent, executives, and startup founders endorsed by BOI. Work permit waived. Categories, salary thresholds, and Pattaya relevance.',
  'glossary/tm6/index.html': 'TM.6 arrival/departure card Thailand — the paper form replaced by TDAC in 2026. What changed, what immigration still asks for, and how it links to visa extensions.',
  'guides/switch-ed-to-dtv/index.html': 'Switch from ED visa to DTV in Thailand — when it makes sense, ฿500K seasoning, income proof, embassy vs in-country routes, and the step-by-step for Pattaya-based students in 2026.',
  'guides/tm30-reporting/index.html': 'TM30 reporting Thailand 2026 — landlord vs tenant responsibility, 24-hour deadline, online portal, penalties for missing reports, and how it affects visa extensions in Pattaya.',
  'guides/visa-overstay-penalties/index.html': 'Thailand visa overstay penalties 2026 — ฿500/day fine, ฿20,000 cap, voluntary surrender vs arrest, blacklist lengths, and how to fix an overstay before your next extension.',
  'professions/fitness-trainer/index.html': 'Thailand visa for fitness trainers and personal coaches in Pattaya — DTV for online clients abroad, Non-B if a gym sponsors you, ED for Muay Thai study, and the grey-zone traps to avoid.',
  'resources/index.html': 'Thailand visa resources hub — official government links, embassy portals, BOI LTR site, TM30/TM47 online forms, and Pattaya Visa Help tools. Bookmark this before you apply.',
  'tools/document-checklist/index.html': 'Thailand visa document checklist generator — pick your visa type and get a print-ready list of passports, bank letters, insurance, and apostilles required for 2026 applications.',
  'tools/expiry-countdown/index.html': 'Visa expiry countdown tool — track visa end date, 90-day reporting deadlines, TM30 windows, and re-entry permit expiry. Set reminders so Pattaya immigration never catches you out.',
};

const INTERNAL_LINK_BLOCK = `
<section class="section" id="explore-map">
<div class="section-hd"><div class="s-label"><span class="num">//</span> Full site map · discover more</div><h2>Go <span class="cy">deeper.</span></h2></div>
<div class="tools" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
<a href="/guides/best-visa-digital-nomads/" class="tool c1"><div class="ico">→</div><h3>Visa for digital nomads</h3><p>Persona guide — DTV, LTR, tools.</p></a>
<a href="/guides/best-visa-retirees-over-50/" class="tool c2"><div class="ico">→</div><h3>Visa for retirees 50+</h3><p>Non-O, O-A, O-X, LTR compared.</p></a>
<a href="/guides/best-visa-couples/" class="tool c3"><div class="ico">→</div><h3>Visa for couples</h3><p>Marriage, dependants, dual retirement.</p></a>
<a href="/guides/switch-ed-to-dtv/" class="tool"><div class="ico">→</div><h3>Switch ED → DTV</h3><p>Graduate from language school route.</p></a>
<a href="/guides/switch-tourist-to-non-o-retirement/" class="tool c1"><div class="ico">→</div><h3>Tourist → Retirement</h3><p>In-country conversion path.</p></a>
<a href="/guides/working-in-thailand/" class="tool c2"><div class="ico">→</div><h3>Working in Thailand</h3><p>Non-B, SMART, work permits.</p></a>
<a href="/compare/pattaya-vs-bangkok/" class="tool c3"><div class="ico">→</div><h3>Pattaya vs Bangkok</h3><p>City comparison for long-stayers.</p></a>
<a href="/compare/pattaya-vs-phuket/" class="tool"><div class="ico">→</div><h3>Pattaya vs Phuket</h3><p>Retirement and nomad comparison.</p></a>
<a href="/best-visa/under-5k/" class="tool c1"><div class="ico">→</div><h3>Visa under ฿5k/yr</h3><p>Budget tier breakdown.</p></a>
<a href="/best-visa/under-50k/" class="tool c2"><div class="ico">→</div><h3>Visa under ฿50k/yr</h3><p>Mid-budget pathways.</p></a>
<a href="/best-visa/under-1m/" class="tool c3"><div class="ico">→</div><h3>Visa under ฿1M/yr</h3><p>Premium tier options.</p></a>
<a href="/professions/affiliate-marketer/" class="tool"><div class="ico">→</div><h3>Affiliate marketers</h3><p>DTV income proof path.</p></a>
<a href="/professions/ai-engineer/" class="tool c1"><div class="ico">→</div><h3>AI engineers</h3><p>DTV, SMART, LTR options.</p></a>
<a href="/professions/crypto-trader/" class="tool c2"><div class="ico">→</div><h3>Crypto traders</h3><p>Income documentation for DTV/LTR.</p></a>
<a href="/professions/saas-founder/" class="tool c3"><div class="ico">→</div><h3>SaaS founders</h3><p>LTR vs DTV for founders.</p></a>
<a href="/pattaya/china-to-thailand/" class="tool"><div class="ico">→</div><h3>China → Thailand</h3><p>Embassy and visa routes.</p></a>
<a href="/pattaya/india-to-thailand/" class="tool c1"><div class="ico">→</div><h3>India → Thailand</h3><p>Consulate application guide.</p></a>
<a href="/blog/2026-annual-review/" class="tool c2"><div class="ico">→</div><h3>2026 visa year review</h3><p>Policy recap blog post.</p></a>
<a href="/blog/jomtien-immigration-2026/" class="tool c3"><div class="ico">→</div><h3>Jomtien Immigration 2026</h3><p>Queue times and what to expect.</p></a>
<a href="/de/" class="tool"><div class="ico">→</div><h3>Deutsch</h3><p>German-language visa hub.</p></a>
<a href="/ru/" class="tool c1"><div class="ico">→</div><h3>Русский</h3><p>Russian-language visa hub.</p></a>
</div>
</section>
`;

const CONTEXTUAL_LINKS = [
  {
    file: 'visas/dtv/index.html',
    marker: '<div class="faq">',
    insert: `<p>Related: <a href="/pattaya-digital-nomad-guide/">Pattaya digital nomad guide</a> · <a href="/guides/best-visa-digital-nomads/">Best visa for digital nomads</a> · <a href="/professions/saas-founder/">SaaS founders</a> · <a href="/professions/content-creator/">Content creators</a> · <a href="/compare/pattaya-vs-bangkok/">Pattaya vs Bangkok</a></p>\n`,
  },
  {
    file: 'visas/retirement-non-o/index.html',
    marker: '<div class="faq">',
    insert: `<p>Related: <a href="/retirement/">Retirement hub</a> · <a href="/guides/best-visa-retirees-over-50/">Best visa for retirees</a> · <a href="/compare/pattaya-vs-phuket/">Pattaya vs Phuket</a> · <a href="/guides/jomtien-immigration-office/">Jomtien Immigration guide</a> · <a href="/guides/switch-tourist-to-non-o-retirement/">Tourist → Retirement switch</a></p>\n`,
  },
  {
    file: 'visas/ltr/index.html',
    marker: '<div class="faq">',
    insert: `<p>Related: <a href="/guides/switch-non-b-to-ltr/">Switch Non-B → LTR</a> · <a href="/professions/saas-founder/">SaaS founders</a> · <a href="/best-visa/under-1m/">Visa under ฿1M/yr</a> · <a href="/case-studies/">Case studies</a> · <a href="/tax/">Thai tax for foreign residents</a></p>\n`,
  },
  {
    file: 'visas/business-non-b/index.html',
    marker: '<div class="faq">',
    insert: `<p>Related: <a href="/work-permit/">Work permit hub</a> · <a href="/guides/working-in-thailand/">Working in Thailand</a> · <a href="/guides/setting-up-thai-company/">Setting up a Thai company</a> · <a href="/professions/ai-engineer/">AI engineers</a></p>\n`,
  },
  {
    file: 'visas/marriage-non-o/index.html',
    marker: '<div class="faq">',
    insert: `<p>Related: <a href="/guides/best-visa-couples/">Best visa for couples</a> · <a href="/guides/bringing-family-to-thailand/">Bringing family to Thailand</a> · <a href="/guides/marriage-non-o-to-pr/">Marriage Non-O to PR path</a></p>\n`,
  },
  {
    file: 'visas/education-ed/index.html',
    marker: '<div class="faq">',
    insert: `<p>Related: <a href="/guides/switch-ed-to-dtv/">Switch ED → DTV</a> · <a href="/guides/verify-moe-accredited-school/">Verify MOE school</a> · <a href="/gyms/">Pattaya Muay Thai gyms</a> · <a href="/glossary/soft-power/">DTV soft-power category</a></p>\n`,
  },
  {
    file: 'visas/privilege-elite/index.html',
    marker: '<div class="faq">',
    insert: `<p>Related: <a href="/best-visa/under-1m/">Visa under ฿1M/yr</a> · <a href="/compare/dtv-vs-elite/">DTV vs Privilege</a> · <a href="/compare/privilege-vs-ltr/">Privilege vs LTR</a></p>\n`,
  },
  {
    file: 'visas/smart/index.html',
    marker: '<div class="faq">',
    insert: `<p>Related: <a href="/professions/ai-engineer/">AI engineers</a> · <a href="/guides/switch-non-b-to-ltr/">Switch Non-B → LTR</a> · <a href="/compare/dtv-vs-smart/">DTV vs SMART</a></p>\n`,
  },
  {
    file: 'blog/index.html',
    marker: '<main id="main"',
    insert: '',
    afterMain: `<p style="margin-bottom:2rem">Latest: <a href="/blog/jomtien-immigration-2026/">Jomtien Immigration 2026 — queue times</a> · <a href="/blog/2026-annual-review/">2026 visa year in review</a> · <a href="/blog/30-day-visa-exempt-rollback/">60→30 day rollback</a></p>\n`,
  },
  {
    file: 'pattaya/index.html',
    marker: '<main id="main"',
    insert: '',
    afterMain: `<p style="margin-bottom:2rem">Origin guides: <a href="/pattaya/china-to-thailand/">China → Thailand</a> · <a href="/pattaya/india-to-thailand/">India → Thailand</a> · <a href="/pattaya/uk-to-thailand/">UK → Thailand</a> · <a href="/pattaya/usa-to-thailand/">USA → Thailand</a> · <a href="/pattaya-digital-nomad-guide/">Digital nomad in Pattaya</a></p>\n`,
  },
  {
    file: 'guides/index.html',
    marker: '<main id="main"',
    insert: '',
    afterMain: `<p style="margin-bottom:2rem">Persona picks: <a href="/guides/best-visa-couples/">Couples</a> · <a href="/guides/best-visa-digital-nomads/">Digital nomads</a> · <a href="/guides/best-visa-retirees-over-50/">Retirees 50+</a> · <a href="/guides/embassy-directory/">Embassy directory</a> · <a href="/guides/glossary/">Guides glossary</a></p>\n`,
  },
  {
    file: 'professions/index.html',
    marker: '<main id="main"',
    insert: '',
    afterMain: `<p style="margin-bottom:2rem">New: <a href="/professions/affiliate-marketer/">Affiliate marketers</a> · <a href="/professions/ai-engineer/">AI engineers</a> · <a href="/professions/crypto-trader/">Crypto traders</a> · <a href="/professions/saas-founder/">SaaS founders</a></p>\n`,
  },
];

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractFaqSchema(html) {
  const faqMatch = html.match(/<div class="faq">([\s\S]*?)<\/div>\s*(?=<(?:section|div class="cta|footer|a href="#top))/i);
  if (!faqMatch) return null;
  const block = faqMatch[1];
  const items = [];
  for (const m of block.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/gi)) {
    items.push({
      '@type': 'Question',
      name: stripHtml(m[1]),
      acceptedAnswer: { '@type': 'Answer', text: stripHtml(m[2]) },
    });
  }
  if (!items.length) return null;
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items };
}

function injectFaqSchema(filePath) {
  const full = path.join(ROOT, filePath);
  if (!fs.existsSync(full)) return false;
  let html = fs.readFileSync(full, 'utf8');
  if (/FAQPage/.test(html)) return false;
  const schema = extractFaqSchema(html);
  if (!schema) return false;
  const tag = `<script type="application/ld+json">\n${JSON.stringify(schema)}\n</script>\n`;
  const idx = html.indexOf('<link rel="preconnect" href="https://fonts.googleapis.com"');
  if (idx === -1) return false;
  html = html.slice(0, idx) + tag + html.slice(idx);
  fs.writeFileSync(full, html);
  return true;
}

function updateMeta(relPath, desc) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return false;
  let html = fs.readFileSync(full, 'utf8');
  const re = /<meta name="description" content="[^"]*" \/>/;
  if (!re.test(html)) return false;
  html = html.replace(re, `<meta name="description" content="${desc.replace(/"/g, '&quot;')}" />`);
  const ogRe = /<meta property="og:description" content="[^"]*" \/>/;
  if (ogRe.test(html)) {
    html = html.replace(ogRe, `<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />`);
  }
  fs.writeFileSync(full, html);
  return true;
}

const results = { faq: [], meta: [], links: [] };

// Homepage explore block
const homePath = path.join(ROOT, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');
if (!home.includes('id="explore-map"')) {
  home = home.replace('<section class="section" id="faq">', INTERNAL_LINK_BLOCK + '\n<section class="section" id="faq">');
  fs.writeFileSync(homePath, home);
  results.links.push('index.html');
}

for (const item of CONTEXTUAL_LINKS) {
  const full = path.join(ROOT, item.file);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, 'utf8');
  if (item.afterMain) {
    const needle = item.marker + ' class="article-body">';
    const alt = item.marker;
    if (item.insert && html.includes(item.marker) && !html.includes(item.insert.trim().slice(0, 40))) {
      html = html.replace(item.marker, item.insert + item.marker);
      results.links.push(item.file);
    } else if (html.includes('<main id="main" class="article-body">') && !html.includes(item.afterMain.trim().slice(0, 30))) {
      html = html.replace('<main id="main" class="article-body">', '<main id="main" class="article-body">' + item.afterMain);
      results.links.push(item.file);
    }
  } else if (item.insert && html.includes(item.marker) && !html.includes(item.insert.trim().slice(0, 40))) {
    html = html.replace(item.marker, item.insert + item.marker);
    fs.writeFileSync(full, html);
    results.links.push(item.file);
    continue;
  }
  fs.writeFileSync(full, html);
}

const visaFiles = fs.readdirSync(path.join(ROOT, 'visas')).filter((d) => {
  return fs.existsSync(path.join(ROOT, 'visas', d, 'index.html'));
});
for (const v of visaFiles) {
  if (injectFaqSchema(`visas/${v}/index.html`)) results.faq.push(v);
}

for (const [rel, desc] of Object.entries(META_UPDATES)) {
  if (updateMeta(rel, desc)) results.meta.push(rel);
}

console.log(JSON.stringify(results, null, 2));
