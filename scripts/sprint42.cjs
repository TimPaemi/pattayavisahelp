/**
 * Sprint 42 — SMART vs LTR, Marriage vs Retirement, DTV vs Privilege DE/RU compare pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint42-hreflang.cjs', 'sprint42-promote-pilot.cjs', 'sprint42-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/compare/smart-vs-ltr/')) {
  llms = llms.replace(
    '  - Compare DTV vs SMART: [DE](https://pattayavisahelp.com/de/compare/dtv-vs-smart/), [RU](https://pattayavisahelp.com/ru/compare/dtv-vs-smart/)\n- **Other',
    '  - Compare DTV vs SMART: [DE](https://pattayavisahelp.com/de/compare/dtv-vs-smart/), [RU](https://pattayavisahelp.com/ru/compare/dtv-vs-smart/)\n  - Compare SMART vs LTR: [DE](https://pattayavisahelp.com/de/compare/smart-vs-ltr/), [RU](https://pattayavisahelp.com/ru/compare/smart-vs-ltr/)\n  - Compare Marriage vs Retirement: [DE](https://pattayavisahelp.com/de/compare/marriage-vs-retirement/), [RU](https://pattayavisahelp.com/ru/compare/marriage-vs-retirement/)\n  - Compare DTV vs Privilege: [DE](https://pattayavisahelp.com/de/compare/dtv-vs-elite/), [RU](https://pattayavisahelp.com/ru/compare/dtv-vs-elite/)\n- **Other'
  );
  llms = llms.replace('thirty-six indexed pilots (12 visa types + 6 compares)', 'forty-two indexed pilots (12 visa types + 9 compares)');
  llms = llms.replace('except the thirty-six indexed pilots above', 'except the forty-two indexed pilots above');
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/compare/smart-vs-ltr/')) {
  meta = meta.replace(
    "'/ru/compare/dtv-vs-smart/',",
    "'/ru/compare/dtv-vs-smart/',\n  '/de/compare/smart-vs-ltr/',\n  '/ru/compare/smart-vs-ltr/',\n  '/de/compare/marriage-vs-retirement/',\n  '/ru/compare/marriage-vs-retirement/',\n  '/de/compare/dtv-vs-elite/',\n  '/ru/compare/dtv-vs-elite/',"
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
if (!cl.includes('Sprint 42')) {
  const block = ` 2026-05-28
 Recovery sprint 42

 <h2>Sprint 42 — SMART vs LTR, Marriage vs Retirement, DTV vs Privilege DE/RU</h2>
 <p>Indexed six more locale comparisons (244 sitemap URLs). hreflang on EN compare pillars. Inbound from compare hub, couples guide, digital nomad hub.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/238 indexed URLs/g, '244 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 42 complete');
