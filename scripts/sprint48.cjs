/**
 * Sprint 48 — Pattaya vs Bangkok, Chiang Mai, Phuket DE/RU location compare pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint48-hreflang.cjs', 'sprint48-promote-pilot.cjs', 'sprint48-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/compare/pattaya-vs-bangkok/')) {
  llms = llms.replace(
    '  - Compare DTV vs Privilege: [DE](https://pattayavisahelp.com/de/compare/dtv-vs-elite/), [RU](https://pattayavisahelp.com/ru/compare/dtv-vs-elite/)\n  - Profession content creator:',
    `  - Compare DTV vs Privilege: [DE](https://pattayavisahelp.com/de/compare/dtv-vs-elite/), [RU](https://pattayavisahelp.com/ru/compare/dtv-vs-elite/)
  - Compare Pattaya vs Bangkok: [DE](https://pattayavisahelp.com/de/compare/pattaya-vs-bangkok/), [RU](https://pattayavisahelp.com/ru/compare/pattaya-vs-bangkok/)
  - Compare Pattaya vs Chiang Mai: [DE](https://pattayavisahelp.com/de/compare/pattaya-vs-chiang-mai/), [RU](https://pattayavisahelp.com/ru/compare/pattaya-vs-chiang-mai/)
  - Compare Pattaya vs Phuket: [DE](https://pattayavisahelp.com/de/compare/pattaya-vs-phuket/), [RU](https://pattayavisahelp.com/ru/compare/pattaya-vs-phuket/)
  - Profession content creator:`
  );
  llms = llms.replace(
    'seventy-two indexed pilots (12 visa types + 9 compares + 15 professions)',
    'seventy-eight indexed pilots (12 visa types + 12 compares + 15 professions)'
  );
  llms = llms.replace(
    'except the seventy-two indexed pilots above',
    'except the seventy-eight indexed pilots above'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/compare/pattaya-vs-bangkok/')) {
  meta = meta.replace(
    "'/ru/compare/dtv-vs-elite/',",
    `'/ru/compare/dtv-vs-elite/',
  '/de/compare/pattaya-vs-bangkok/',
  '/ru/compare/pattaya-vs-bangkok/',
  '/de/compare/pattaya-vs-chiang-mai/',
  '/ru/compare/pattaya-vs-chiang-mai/',
  '/de/compare/pattaya-vs-phuket/',
  '/ru/compare/pattaya-vs-phuket/',`
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
if (!cl.includes('Sprint 48')) {
  const block = ` 2026-05-28
 Recovery sprint 48

 <h2>Sprint 48 — Pattaya vs Bangkok, Chiang Mai, Phuket DE/RU</h2>
 <p>Indexed six location compare locale pilots (280 sitemap URLs). hreflang on EN pillars. Inbound from compare hub, 3-city retirement guide, living-in-pattaya.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/274 indexed URLs/g, '280 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 48 complete');
