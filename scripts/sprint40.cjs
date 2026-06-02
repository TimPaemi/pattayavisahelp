/**
 * Sprint 40 — DTV vs LTR, ED vs DTV, Privilege vs LTR DE/RU compare pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint40-hreflang.cjs', 'sprint40-promote-pilot.cjs', 'sprint40-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/compare/dtv-vs-ltr/')) {
  llms = llms.replace(
    '  - Media Non-M: [DE](https://pattayavisahelp.com/de/visas/media-non-m/), [RU](https://pattayavisahelp.com/ru/visas/media-non-m/)\n- **Other',
    '  - Media Non-M: [DE](https://pattayavisahelp.com/de/visas/media-non-m/), [RU](https://pattayavisahelp.com/ru/visas/media-non-m/)\n  - Compare DTV vs LTR: [DE](https://pattayavisahelp.com/de/compare/dtv-vs-ltr/), [RU](https://pattayavisahelp.com/ru/compare/dtv-vs-ltr/)\n  - Compare ED vs DTV: [DE](https://pattayavisahelp.com/de/compare/ed-vs-dtv/), [RU](https://pattayavisahelp.com/ru/compare/ed-vs-dtv/)\n  - Compare Privilege vs LTR: [DE](https://pattayavisahelp.com/de/compare/privilege-vs-ltr/), [RU](https://pattayavisahelp.com/ru/compare/privilege-vs-ltr/)\n- **Other'
  );
  llms = llms.replace('twenty-four indexed pilots (all 12 visa types)', 'thirty indexed pilots (12 visa types + 3 compares)');
  llms = llms.replace('except the twenty-four indexed pilots above', 'except the thirty indexed pilots above');
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/compare/dtv-vs-ltr/')) {
  meta = meta.replace(
    "'/ru/visas/media-non-m/',",
    "'/ru/visas/media-non-m/',\n  '/de/compare/dtv-vs-ltr/',\n  '/ru/compare/dtv-vs-ltr/',\n  '/de/compare/ed-vs-dtv/',\n  '/ru/compare/ed-vs-dtv/',\n  '/de/compare/privilege-vs-ltr/',\n  '/ru/compare/privilege-vs-ltr/',"
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
if (!cl.includes('Sprint 40')) {
  const block = ` 2026-05-28
 Recovery sprint 40

 <h2>Sprint 40 — Compare DE/RU pilots (DTV vs LTR, ED vs DTV, Privilege vs LTR)</h2>
 <p>Indexed six locale comparison guides with full DE/RU translations (232 sitemap URLs). hreflang on three EN compare pillars. Inbound from compare hub, EN compare pages, and DE/RU visa hubs.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/226 indexed URLs/g, '232 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 40 complete');
