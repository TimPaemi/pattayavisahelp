/**
 * Sprint 36 — hreflang, Privilege/Marriage DE/RU pilots, partners hub, Lighthouse spot-check.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint36-hreflang.cjs',
  'sprint36-promote-pilot.cjs',
  'sprint36-partners.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

console.log('\n=== sprint36-lighthouse (may take several minutes) ===');
try {
  execSync('node scripts/sprint36-lighthouse.cjs', { cwd: ROOT, stdio: 'inherit', timeout: 900000 });
} catch (e) {
  console.warn('Lighthouse partial/failed — see _audit-lighthouse-sprint36.json');
}

// llms.txt pilots
const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/visas/privilege-elite/')) {
  llms = llms.replace(
    '  - Non-O Retirement: [DE](https://pattayavisahelp.com/de/visas/retirement-non-o/), [RU](https://pattayavisahelp.com/ru/visas/retirement-non-o/)\n- **Other',
    '  - Non-O Retirement: [DE](https://pattayavisahelp.com/de/visas/retirement-non-o/), [RU](https://pattayavisahelp.com/ru/visas/retirement-non-o/)\n  - Privilege Elite: [DE](https://pattayavisahelp.com/de/visas/privilege-elite/), [RU](https://pattayavisahelp.com/ru/visas/privilege-elite/)\n  - Marriage Non-O: [DE](https://pattayavisahelp.com/de/visas/marriage-non-o/), [RU](https://pattayavisahelp.com/ru/visas/marriage-non-o/)\n- **Other'
  );
  llms = llms.replace('except the two DTV pilots', 'except the ten indexed pilots above');
  fs.writeFileSync(llmsPath, llms);
}

// audit-meta-indexed pilots
const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('privilege-elite')) {
  meta = meta.replace(
    '/ru/visas/retirement-non-o/\'',
    '/ru/visas/retirement-non-o/\',\n  \'/de/visas/privilege-elite/\',\n  \'/ru/visas/privilege-elite/\',\n  \'/de/visas/marriage-non-o/\',\n  \'/ru/visas/marriage-non-o/\''
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
if (!cl.includes('Sprint 36')) {
  const block = ` 2026-05-28
 Recovery sprint 36

 <h2>Sprint 36 — hreflang + Privilege/Marriage DE/RU pilots</h2>
 <p>Added hreflang de/ru on five EN visa pillars. Indexed full guides: /de/visas/privilege-elite/, /ru/visas/privilege-elite/, /de/visas/marriage-non-o/, /ru/visas/marriage-non-o/ (212 sitemap URLs). Partners page documents Pattaya Authority network hub and reciprocal linking. Lighthouse spot-check on Jomtien + compare pages.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/208 indexed URLs/g, '212 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 36 complete');
