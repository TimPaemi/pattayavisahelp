/**
 * Sprint 49 — Pattaya vs Hua Hin, Hua Hin deep, Visa matrix DE/RU compare pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint49-hreflang.cjs', 'sprint49-promote-pilot.cjs', 'sprint49-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/compare/pattaya-vs-hua-hin/')) {
  llms = llms.replace(
    '  - Compare Pattaya vs Phuket: [DE](https://pattayavisahelp.com/de/compare/pattaya-vs-phuket/), [RU](https://pattayavisahelp.com/ru/compare/pattaya-vs-phuket/)\n  - Profession content creator:',
    `  - Compare Pattaya vs Phuket: [DE](https://pattayavisahelp.com/de/compare/pattaya-vs-phuket/), [RU](https://pattayavisahelp.com/ru/compare/pattaya-vs-phuket/)
  - Compare Pattaya vs Hua Hin: [DE](https://pattayavisahelp.com/de/compare/pattaya-vs-hua-hin/), [RU](https://pattayavisahelp.com/ru/compare/pattaya-vs-hua-hin/)
  - Compare Pattaya vs Hua Hin (deep): [DE](https://pattayavisahelp.com/de/compare/pattaya-vs-hua-hin-deep/), [RU](https://pattayavisahelp.com/ru/compare/pattaya-vs-hua-hin-deep/)
  - Compare visa matrix: [DE](https://pattayavisahelp.com/de/compare/visa-comparison-matrix/), [RU](https://pattayavisahelp.com/ru/compare/visa-comparison-matrix/)
  - Profession content creator:`
  );
  llms = llms.replace(
    'seventy-eight indexed pilots (12 visa types + 12 compares + 15 professions)',
    'eighty-four indexed pilots (12 visa types + 15 compares + 15 professions)'
  );
  llms = llms.replace(
    'except the seventy-eight indexed pilots above',
    'except the eighty-four indexed pilots above'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/compare/pattaya-vs-hua-hin/')) {
  meta = meta.replace(
    "'/ru/compare/pattaya-vs-phuket/',",
    `'/ru/compare/pattaya-vs-phuket/',
  '/de/compare/pattaya-vs-hua-hin/',
  '/ru/compare/pattaya-vs-hua-hin/',
  '/de/compare/pattaya-vs-hua-hin-deep/',
  '/ru/compare/pattaya-vs-hua-hin-deep/',
  '/de/compare/visa-comparison-matrix/',
  '/ru/compare/visa-comparison-matrix/',`
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
if (!cl.includes('Sprint 49')) {
  const block = ` 2026-05-28
 Recovery sprint 49

 <h2>Sprint 49 — Hua Hin + visa matrix DE/RU</h2>
 <p>Indexed six final compare locale pilots (286 sitemap URLs). hreflang on EN pillars. Inbound from compare hub, visa-finder, living-in-pattaya, 3-city guide.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/280 indexed URLs/g, '286 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 49 complete');
