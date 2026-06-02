/**
 * Sprint 41 — Non-O vs O-A, O-A vs O-X, DTV vs SMART DE/RU compare pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint41-hreflang.cjs', 'sprint41-promote-pilot.cjs', 'sprint41-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/compare/non-o-vs-o-a/')) {
  llms = llms.replace(
    '  - Compare Privilege vs LTR: [DE](https://pattayavisahelp.com/de/compare/privilege-vs-ltr/), [RU](https://pattayavisahelp.com/ru/compare/privilege-vs-ltr/)\n- **Other',
    '  - Compare Privilege vs LTR: [DE](https://pattayavisahelp.com/de/compare/privilege-vs-ltr/), [RU](https://pattayavisahelp.com/ru/compare/privilege-vs-ltr/)\n  - Compare Non-O vs O-A: [DE](https://pattayavisahelp.com/de/compare/non-o-vs-o-a/), [RU](https://pattayavisahelp.com/ru/compare/non-o-vs-o-a/)\n  - Compare O-A vs O-X: [DE](https://pattayavisahelp.com/de/compare/o-a-vs-o-x/), [RU](https://pattayavisahelp.com/ru/compare/o-a-vs-o-x/)\n  - Compare DTV vs SMART: [DE](https://pattayavisahelp.com/de/compare/dtv-vs-smart/), [RU](https://pattayavisahelp.com/ru/compare/dtv-vs-smart/)\n- **Other'
  );
  llms = llms.replace('thirty indexed pilots (12 visa types + 3 compares)', 'thirty-six indexed pilots (12 visa types + 6 compares)');
  llms = llms.replace('except the thirty indexed pilots above', 'except the thirty-six indexed pilots above');
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/compare/non-o-vs-o-a/')) {
  meta = meta.replace(
    "'/ru/compare/privilege-vs-ltr/',",
    "'/ru/compare/privilege-vs-ltr/',\n  '/de/compare/non-o-vs-o-a/',\n  '/ru/compare/non-o-vs-o-a/',\n  '/de/compare/o-a-vs-o-x/',\n  '/ru/compare/o-a-vs-o-x/',\n  '/de/compare/dtv-vs-smart/',\n  '/ru/compare/dtv-vs-smart/',"
  );
  fs.writeFileSync(metaPath, meta);
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
if (!cl.includes('Sprint 41')) {
  const block = ` 2026-05-28
 Recovery sprint 41

 <h2>Sprint 41 — Retirement &amp; tech compare DE/RU pilots</h2>
 <p>Indexed six locale comparisons: non-o-vs-o-a, o-a-vs-o-x, dtv-vs-smart (DE/RU). 238 sitemap URLs. hreflang on EN compare pillars. Inbound from compare hub, retiree and working guides.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/232 indexed URLs/g, '238 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 41 complete');
