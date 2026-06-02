/**
 * Sprint 39 — O-A, O-X, Media Non-M DE/RU pilots (all 12 EN pillars complete).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint39-hreflang.cjs', 'sprint39-promote-pilot.cjs', 'sprint39-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/visas/retirement-o-a/')) {
  llms = llms.replace(
    '  - Tourist TR: [DE](https://pattayavisahelp.com/de/visas/tourist-tr-evisa/), [RU](https://pattayavisahelp.com/ru/visas/tourist-tr-evisa/)\n- **Other',
    '  - Tourist TR: [DE](https://pattayavisahelp.com/de/visas/tourist-tr-evisa/), [RU](https://pattayavisahelp.com/ru/visas/tourist-tr-evisa/)\n  - O-A Retirement: [DE](https://pattayavisahelp.com/de/visas/retirement-o-a/), [RU](https://pattayavisahelp.com/ru/visas/retirement-o-a/)\n  - O-X Retirement: [DE](https://pattayavisahelp.com/de/visas/retirement-o-x/), [RU](https://pattayavisahelp.com/ru/visas/retirement-o-x/)\n  - Media Non-M: [DE](https://pattayavisahelp.com/de/visas/media-non-m/), [RU](https://pattayavisahelp.com/ru/visas/media-non-m/)\n- **Other'
  );
  llms = llms.replace('eighteen indexed pilots', 'twenty-four indexed pilots (all 12 visa types)');
  llms = llms.replace('except the eighteen indexed pilots above', 'except the twenty-four indexed pilots above');
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('retirement-o-a')) {
  meta = meta.replace(
    "'/ru/visas/tourist-tr-evisa/',",
    "'/ru/visas/tourist-tr-evisa/',\n  '/de/visas/retirement-o-a/',\n  '/ru/visas/retirement-o-a/',\n  '/de/visas/retirement-o-x/',\n  '/ru/visas/retirement-o-x/',\n  '/de/visas/media-non-m/',\n  '/ru/visas/media-non-m/',"
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
if (!cl.includes('Sprint 39')) {
  const block = ` 2026-05-28
 Recovery sprint 39

 <h2>Sprint 39 — O-A, O-X, Media Non-M DE/RU pilots (12/12 pillars)</h2>
 <p>Indexed final six locale guides: retirement-o-a, retirement-o-x, media-non-m (DE/RU). All twelve EN visa pillars now have full DE/RU indexed translations (226 sitemap URLs). hreflang on O-A, O-X, Media pages. Inbound from visas hub, compare pages, health insurance and working guides.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/220 indexed URLs/g, '226 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 39 complete');
