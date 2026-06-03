/**
 * Sprint 53 — Index DE/RU guides section hubs (298 sitemap URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint53-promote-guides-hubs.cjs', 'sprint53-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('Guides hub DE')) {
  llms = llms.replace(
    'ninety-four indexed pilots (2 locale hubs + 3 section hubs × 2 langs + 12 visa + 15 compares + 16 professions)',
    'ninety-six indexed pilots (2 locale hubs + 4 section hubs × 2 langs + 12 visa + 15 compares + 16 professions; guides hubs link to full EN guides)'
  );
  llms = llms.replace(
    'except the ninety-four indexed pilots above',
    'except the ninety-six indexed pilots above'
  );
  llms = llms.replace(
    '- [Professions hub DE](https://pattayavisahelp.com/de/professions/) — **indexed section hub**',
    '- [Professions hub DE](https://pattayavisahelp.com/de/professions/) — **indexed section hub**\n- [Guides hub DE](https://pattayavisahelp.com/de/guides/) — **indexed section hub** (navigation to EN living guides)'
  );
  llms = llms.replace(
    '- [Professions hub RU](https://pattayavisahelp.com/ru/professions/) — **indexed section hub**',
    '- [Professions hub RU](https://pattayavisahelp.com/ru/professions/) — **indexed section hub**\n- [Guides hub RU](https://pattayavisahelp.com/ru/guides/) — **indexed section hub**'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/guides/',")) {
  meta = meta.replace(
    "  '/de/professions/',\n  '/ru/professions/',\n  '/de/visas/dtv/',",
    "  '/de/professions/',\n  '/ru/professions/',\n  '/de/guides/',\n  '/ru/guides/',\n  '/de/visas/dtv/',"
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
if (!cl.includes('Sprint 53')) {
  const block = ` 2026-05-28
 Recovery sprint 53

 <h2>Sprint 53 — DE/RU guides section hubs indexed</h2>
 <p>Promoted /de/guides/ and /ru/guides/ with 400+ word German/Russian navigation hubs linking to full EN living guides plus indexed visa/compare/profession pilots. 298 sitemap URLs, 96 locale pilots.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/296 indexed URLs/g, '298 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 53 complete');
