/**
 * Sprint 17 — QA fixes: broken links, duplicate tool prose, TL;DR, meta, work-permit expand.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const LINK_FIXES = [
  ['/visas/smart/', '/visas/smart/'],
  ['/visas/education-ed/', '/visas/education-ed/'],
  ['/visas/privilege-elite/', '/visas/privilege-elite/'],
  ['/visas/privilege-elite/', '/visas/privilege-elite/'],
  ['/visas/business-non-b/', '/visas/business-non-b/'],
  ['/visas/retirement-o-a/', '/visas/retirement-o-a/'],
  ['/visas/retirement-non-o/', '/visas/retirement-non-o/'],
  ['/work-permit/', '/work-permit/'],
  ['/visas/dtv/', '/visas/dtv/'],
  ['/guides/buying-property-thailand/', '/guides/buying-property-thailand/'],
  ['/guides/thai-tax-foreign-residents/', '/guides/thai-tax-foreign-residents/'],
];

const MALFORMED_HREF = /href="(\/visas\/privilege-elite\/)>/g;

const TLDR_FIXES = {
  '/best-visa/under-5k/': 'Only DTV amortises to ~฿2,300/year all-in. Tourist runs and ED cost more. No other legal long-stay path fits this budget unless you qualify for DTV.',
  '/best-visa/under-1m/': 'LTR + Royal Decree 743 can be net-negative cost at this income level. Privilege Diamond amortises ~฿167k/year. Hybrid company structures run ฿200–400k/year if you need Thai work rights.',
};

const META_FIX = {
  '/resources/index.html': 'Thailand visa resources hub — official government links, embassy portals, BOI LTR site, TM30/TM47 forms, and curated tools for Pattaya long-stay planning.',
  '/sitemap/index.html': 'Human-readable site map for Pattaya Visa Help — every indexable visa guide, tool, comparison, profession page, and Pattaya neighbourhood hub.',
};

const WORK_PERMIT_EXTRA = `<h2>Non-B + work permit — the standard employment route</h2>
<p>Most foreigners working for a Thai employer hold a Non-B visa plus WP10 work permit booklet. The employer sponsors both: BOI-promoted companies follow a streamlined track; standard Thai companies need four Thai employees per one foreign work permit (ratio varies by industry). Minimum salary thresholds depend on nationality — typically ฿50,000–฿60,000/month for Western nationals, lower for some ASEAN passports. Pattaya employers in hospitality, education, and diving commonly sponsor Non-B holders; Jomtien does not issue work permits — Ministry of Labour handles WP10, then Immigration stamps the Non-B extension.</p>
<h2>SMART Visa — work permit included</h2>
<p>SMART-T, SMART-E, and SMART-S categories include work authorisation without a separate WP10 application. BOI salary floors apply (often ฿200,000/month for SMART-T). See the <a href="/visas/smart/">full SMART Visa guide</a> and <a href="/compare/dtv-vs-smart/">DTV vs SMART comparison</a>.</p>
<h2>Restricted occupations foreigners cannot hold</h2>
<p>Thai law reserves 39 occupation categories for Thai nationals — including hairdressing, massage, tour guiding, and most retail sales. Holding a work permit in a restricted category is a common cause of denial. Our <a href="/professions/">profession guides</a> flag restricted roles explicitly.</p>`;

function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'functions' || e.name === '.git' || e.name === 'node_modules') continue;
      walkHtml(p, acc);
    } else if (e.name.endsWith('.html') || e.name.endsWith('.cjs')) acc.push(p);
  }
  return acc;
}

function fixLinksInFile(file) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (MALFORMED_HREF.test(html)) {
    html = html.replace(MALFORMED_HREF, 'href="$1">');
    changed = true;
  }
  for (const [from, to] of LINK_FIXES) {
    if (from === to) continue;
    if (html.includes(from)) {
      html = html.split(from).join(to);
      changed = true;
    }
  }
  // marriage-specific: cm-form glossary links to marriage pillar, not retirement
  if (file.replace(/\\/g, '/').includes('glossary/cm-form') &&
      html.includes('Non-O Marriage guide') &&
      html.includes('/visas/retirement-non-o/')) {
    html = html.replace(
      '<a href="/visas/retirement-non-o/">Non-O Marriage guide</a>',
      '<a href="/visas/marriage-non-o/">Non-O Marriage guide</a>'
    );
    changed = true;
  }
  if (changed) fs.writeFileSync(file, html);
  return changed;
}

function dedupeToolProse(file) {
  let html = fs.readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(/<section class="tool-prose article-body">[\s\S]*?<\/section>/g)];
  if (blocks.length <= 1) return false;
  const first = blocks[0][0];
  let out = html;
  for (let i = 1; i < blocks.length; i++) {
    out = out.replace(blocks[i][0], '');
  }
  // collapse extra blank lines
  out = out.replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(file, out);
  return true;
}

function fixTldr(file, pathUrl, text) {
  let html = fs.readFileSync(file, 'utf8');
  const re = /(<p class="tldr-text">)[^<]*(<\/p>)/;
  if (!re.test(html)) return false;
  html = html.replace(re, `$1${text}$2`);
  fs.writeFileSync(file, html);
  return true;
}

function fixMeta(file, desc) {
  let html = fs.readFileSync(file, 'utf8');
  const re = /<meta name="description" content="[^"]*"/;
  if (!re.test(html)) return false;
  html = html.replace(re, `<meta name="description" content="${desc}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${desc}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${desc}"`);
  fs.writeFileSync(file, html);
  return true;
}

// 1. Fix broken links site-wide
let linkFiles = 0;
for (const f of walkHtml(ROOT)) {
  if (fixLinksInFile(f)) linkFiles++;
}

// 2. Fix cost-calculator prose in content + re-apply tools once
const toolsContent = path.join(__dirname, 'content/sprint16-tools.cjs');
let tc = fs.readFileSync(toolsContent, 'utf8');
tc = tc.replace(
  "builds a realistic monthly budget for Pattaya life at the lifestyle level you choose.",
  "totals all-in visa cost over your chosen years — government fees, extensions, insurance, and amortised multi-year visas."
);
tc = tc.replace(
  /'\/tools\/cost-calculator\/': `[\s\S]*?`,/,
  `'\/tools\/cost-calculator\/': \`<h2>All-in Thailand visa cost over multiple years</h2>
<p>This calculator totals the real cost of holding a specific Thai visa — not monthly living expenses. Select a visa type and number of years; it returns government fees, annual extensions, mandatory insurance where applicable, and amortised multi-year visas (DTV, LTR, Privilege). Exchange rate baseline is ฿35/USD — adjust mentally if your currency moved.</p>
<h2>What the calculator includes</h2>
<ul>
<li><strong>Government fees:</strong> Embassy/consulate application fees, Jomtien extension stamps (฿1,900/year for most Non-O categories), re-entry permits if you travel</li>
<li><strong>Insurance:</strong> Optional toggle — O-A and LTR tracks include mandatory health insurance bands; DTV has no mandated policy but we model recommended coverage</li>
<li><strong>Amortisation:</strong> DTV ฿11,500 ÷ 5 years; LTR ฿50,000 ÷ 10 years; Privilege tiers spread across membership years</li>
<li><strong>Excludes:</strong> Flights, agent fees, opportunity cost of seasoned bank deposits, living costs</li>
</ul>
<h2>Why "visa cost" is not the sticker price</h2>
<p>A retirement O-A "costs ฿5,000" online because bloggers count only the embassy fee. The mandatory THB-denominated health insurance adds ฿40,000–฿80,000/year for many 60+ applicants — that is the real budget line. This calculator surfaces those hidden lines so you can compare pathways honestly. Use alongside <a href="/best-visa/">budget tier pages</a> and the <a href="/tools/income-test/">Income Test</a>.</p>
<h2>Pattaya extension cadence</h2>
<p>Most long-stay holders extend annually at Jomtien Immigration, Soi 5 Jomtien Beach Road. Non-O retirement and marriage: ฿1,900 extension fee each year. DTV: one free 180-day extension per entry, then re-entry or new entry cycle. LTR: 10-year visa with less frequent renewal admin. The calculator models these cadences per visa type.</p>
<h2>When to confirm totals with a professional</h2>
<p>Insurance premiums vary sharply by age and pre-existing conditions. Privilege membership pricing changes by tier and promotion period. If you are comparing LTR versus Privilege at the ฿500k–1M/year spend level, book a <a href="/contact/">free consultation</a> — tax treatment under Royal Decree 743 can make LTR net-cheaper than the calculator shows.</p>
<p>Further reading: <a href="/best-visa/">Best visa by budget</a> · <a href="/guides/cost-of-living-pattaya/">Cost of living in Pattaya</a> · <a href="/visas/dtv/">DTV guide</a> · <a href="/visas/retirement-o-a/">O-A retirement</a> · <a href="/visas/ltr/">LTR guide</a></p>\`,`
);
fs.writeFileSync(toolsContent, tc);

// 3. Dedupe all tool pages then re-apply single prose block
const toolPaths = [
  '/tools/', '/tools/visa-finder/', '/tools/cost-calculator/', '/tools/income-test/',
  '/tools/document-checklist/', '/tools/expiry-countdown/', '/tools/bank-checker/',
  '/tools/currency-converter/', '/tools/eligibility/', '/tools/reminder/',
];
const toolBodies = require('./content/sprint16-tools.cjs');

function applyToolProse(urlPath, body) {
  const file = path.join(ROOT, urlPath.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<section class="tool-prose article-body">[\s\S]*?<\/section>\s*/g, '');
  html = html.replace(/(<main id="main"[^>]*>)/, `$1\n<section class="tool-prose article-body">\n${body}\n</section>\n`);
  fs.writeFileSync(file, html);
}

for (const p of toolPaths) {
  dedupeToolProse(path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html'));
  applyToolProse(p, toolBodies[p]);
}

// 4. TL;DR fixes
for (const [p, text] of Object.entries(TLDR_FIXES)) {
  fixTldr(path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html'), p, text);
}

// 5. Meta description dedupe
for (const [rel, desc] of Object.entries(META_FIX)) {
  fixMeta(path.join(ROOT, rel), desc);
}

// 6. Expand work-permit hub
const wpFile = path.join(ROOT, 'work-permit/index.html');
let wp = fs.readFileSync(wpFile, 'utf8');
if (!wp.includes('Restricted occupations foreigners cannot hold')) {
  wp = wp.replace('</main>', `${WORK_PERMIT_EXTRA}\n</main>`);
  fs.writeFileSync(wpFile, wp);
}

// 7. Add tool-prose CSS if missing on tool pages (readable prose above interactive UI)
const toolCss = `
.tool-prose{max-width:780px;margin:0 auto 2rem;padding:0 1.5rem;font-size:1.05rem;line-height:1.7;color:var(--tl,#a1a1aa)}
.tool-prose h2{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:1.5rem;color:var(--t,#fafafa);margin:2rem 0 1rem;text-transform:uppercase;letter-spacing:-.02em}
.tool-prose p{margin:0 0 1rem}
.tool-prose ul{margin:0 0 1.25rem;padding-left:1.25rem}
.tool-prose a{color:var(--cyan,#06b6d4)}
`;
for (const p of toolPaths) {
  const file = path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('.tool-prose{')) {
    html = html.replace('</style>', `${toolCss}\n</style>`);
    fs.writeFileSync(file, html);
  }
}

// 8. Fix sprint-16-expand for future: update applyArticleBody in place
const expandPath = path.join(__dirname, 'sprint-16-expand.cjs');
let expand = fs.readFileSync(expandPath, 'utf8');
if (!expand.includes('tool-prose article-body')) {
  expand = expand.replace(
    `  } else if (/<main id="main"/.test(html)) {
    html = html.replace(/(<main id="main"[^>]*>)/, \`$1\\n<section class="tool-prose article-body">\\n\${body}\\n</section>\\n\`);`,
    `  } else if (/<main id="main"/.test(html)) {
    html = html.replace(/<section class="tool-prose article-body">[\\s\\S]*?<\\/section>\\s*/g, '');
    html = html.replace(/(<main id="main"[^>]*>)/, \`$1\\n<section class="tool-prose article-body">\\n\${body}\\n</section>\\n\`);`
  );
  fs.writeFileSync(expandPath, expand);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });

console.log(JSON.stringify({ linkFilesFixed: linkFiles, toolsReapplied: toolPaths.length, status: 'Sprint 17 QA complete' }, null, 2));
