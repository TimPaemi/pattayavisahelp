/**
 * Sprint 38 — ED + Tourist TR DE/RU pilots, hreflang, inbound links.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = ['sprint38-hreflang.cjs', 'sprint38-promote-pilot.cjs', 'sprint38-inbound.cjs'];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/visas/education-ed/')) {
  llms = llms.replace(
    '  - SMART Visa: [DE](https://pattayavisahelp.com/de/visas/smart/), [RU](https://pattayavisahelp.com/ru/visas/smart/)\n- **Other',
    '  - SMART Visa: [DE](https://pattayavisahelp.com/de/visas/smart/), [RU](https://pattayavisahelp.com/ru/visas/smart/)\n  - Education ED: [DE](https://pattayavisahelp.com/de/visas/education-ed/), [RU](https://pattayavisahelp.com/ru/visas/education-ed/)\n  - Tourist TR: [DE](https://pattayavisahelp.com/de/visas/tourist-tr-evisa/), [RU](https://pattayavisahelp.com/ru/visas/tourist-tr-evisa/)\n- **Other'
  );
  llms = llms.replace('fourteen indexed pilots', 'eighteen indexed pilots');
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('education-ed')) {
  meta = meta.replace(
    "'/ru/visas/smart/',",
    "'/ru/visas/smart/',\n  '/de/visas/education-ed/',\n  '/ru/visas/education-ed/',\n  '/de/visas/tourist-tr-evisa/',\n  '/ru/visas/tourist-tr-evisa/',"
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
if (!cl.includes('Sprint 38')) {
  const block = ` 2026-05-28
 Recovery sprint 38

 <h2>Sprint 38 — ED + Tourist TR DE/RU pilots</h2>
 <p>Indexed full guides: /de/visas/education-ed/, /ru/visas/education-ed/, /de/visas/tourist-tr-evisa/, /ru/visas/tourist-tr-evisa/ (220 sitemap URLs). hreflang on EN ED and Tourist TR pillars. Inbound from visas hub, MOE guide, ED→DTV switch, visa-runs guide, ed-vs-dtv compare. DE/RU hub footers updated. llms.txt lists eighteen locale pilots.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/216 indexed URLs/g, '220 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 38 complete');
