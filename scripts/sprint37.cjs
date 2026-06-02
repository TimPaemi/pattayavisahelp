/**
 * Sprint 37 — Non-B + SMART DE/RU pilots, hreflang, inbound links.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint37-hreflang.cjs',
  'sprint37-promote-pilot.cjs',
  'sprint37-inbound.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/visas/business-non-b/')) {
  llms = llms.replace(
    '  - Marriage Non-O: [DE](https://pattayavisahelp.com/de/visas/marriage-non-o/), [RU](https://pattayavisahelp.com/ru/visas/marriage-non-o/)\n- **Other',
    '  - Marriage Non-O: [DE](https://pattayavisahelp.com/de/visas/marriage-non-o/), [RU](https://pattayavisahelp.com/ru/visas/marriage-non-o/)\n  - Non-B Business: [DE](https://pattayavisahelp.com/de/visas/business-non-b/), [RU](https://pattayavisahelp.com/ru/visas/business-non-b/)\n  - SMART Visa: [DE](https://pattayavisahelp.com/de/visas/smart/), [RU](https://pattayavisahelp.com/ru/visas/smart/)\n- **Other'
  );
  llms = llms.replace('ten indexed pilots', 'fourteen indexed pilots');
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('business-non-b')) {
  meta = meta.replace(
    "'/ru/visas/marriage-non-o/',",
    "'/ru/visas/marriage-non-o/',\n  '/de/visas/business-non-b/',\n  '/ru/visas/business-non-b/',\n  '/de/visas/smart/',\n  '/ru/visas/smart/',"
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
if (!cl.includes('Sprint 37')) {
  const block = ` 2026-05-28
 Recovery sprint 37

 <h2>Sprint 37 — Non-B + SMART DE/RU pilots</h2>
 <p>Indexed full guides: /de/visas/business-non-b/, /ru/visas/business-non-b/, /de/visas/smart/, /ru/visas/smart/ (216 sitemap URLs). hreflang on EN Non-B and SMART pillars. Inbound links from visas hub, working-in-thailand guide, and compare pages. llms.txt lists fourteen locale pilots.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/212 indexed URLs/g, '216 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 37 complete');
