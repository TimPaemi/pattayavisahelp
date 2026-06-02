/**
 * Sprint 35 — DE/RU LTR + Non-O pilots, footer heading fix, llms update, audits.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint35-promote-pilot.cjs',
  'sprint35-footer-headings.cjs',
  'sprint35-llms.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'audit-content-quality.cjs',
  'audit-meta-indexed.cjs',
  'scan-ui-junk.cjs',
];
for (const a of audits) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit' });
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 35')) {
  const block = ` 2026-05-28
 Recovery sprint 35

 <h2>Sprint 35 — DE/RU LTR + Non-O pilots + footer a11y</h2>
 <p>Indexed full guides: /de/visas/ltr/, /ru/visas/ltr/, /de/visas/retirement-non-o/, /ru/visas/retirement-non-o/ (208 sitemap URLs). Footer column labels changed from h2 to p.f-col-h for heading-order compliance. llms.txt updated with all six locale pilots.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/204 indexed URLs/g, '208 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 35 complete');
