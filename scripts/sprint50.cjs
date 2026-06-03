/**
 * Sprint 50 — Tattoo artist DE/RU profession pilots (16th profession, full DE/RU set).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint50-hreflang.cjs', 'sprint50-promote-pilot.cjs', 'sprint50-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/professions/tattoo-artist/')) {
  llms = llms.replace(
    '  - Profession hairdresser: [DE](https://pattayavisahelp.com/de/professions/hairdresser/), [RU](https://pattayavisahelp.com/ru/professions/hairdresser/)\n- **Other',
    `  - Profession hairdresser: [DE](https://pattayavisahelp.com/de/professions/hairdresser/), [RU](https://pattayavisahelp.com/ru/professions/hairdresser/)
  - Profession tattoo artist: [DE](https://pattayavisahelp.com/de/professions/tattoo-artist/), [RU](https://pattayavisahelp.com/ru/professions/tattoo-artist/)
- **Other`
  );
  llms = llms.replace(
    'eighty-four indexed pilots (12 visa types + 15 compares + 15 professions)',
    'eighty-six indexed pilots (12 visa types + 15 compares + 16 professions)'
  );
  llms = llms.replace(
    'except the eighty-four indexed pilots above',
    'except the eighty-six indexed pilots above'
  );
  llms = llms.replace(
    'except all fifteen profession slugs listed above (full DE/RU profession set indexed)',
    'except all sixteen profession slugs listed above (full DE/RU profession set indexed)'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/professions/tattoo-artist/')) {
  meta = meta.replace(
    "'/ru/professions/hairdresser/',",
    `'/ru/professions/hairdresser/',
  '/de/professions/tattoo-artist/',
  '/ru/professions/tattoo-artist/',`
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
if (!cl.includes('Sprint 50')) {
  const block = ` 2026-05-28
 Recovery sprint 50

 <h2>Sprint 50 — Tattoo artist DE/RU (16 professions complete)</h2>
 <p>Indexed final profession locale pilots (288 sitemap URLs). All 16 EN profession pillars now have DE/RU pilots. hreflang and inbound from professions hub, Thai company guide, work permit hub.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/286 indexed URLs/g, '288 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 50 complete');
