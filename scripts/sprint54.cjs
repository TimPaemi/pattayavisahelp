/**
 * Sprint 54 — Index DE/RU tools + glossary section hubs (302 URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint54-promote-section-hubs.cjs', 'sprint54-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('Tools hub DE')) {
  llms = llms.replace(
    'ninety-six indexed pilots (2 locale hubs + 4 section hubs × 2 langs + 12 visa + 15 compares + 16 professions; guides hubs link to full EN guides)',
    'one hundred indexed pilots (2 locale hubs + 6 section hubs × 2 langs + 12 visa + 15 compares + 16 professions; tools/glossary/guides hubs navigate to EN content)'
  );
  llms = llms.replace(
    'except the ninety-six indexed pilots above',
    'except the one hundred indexed pilots above'
  );
  llms = llms.replace(
    '- [Guides hub DE](https://pattayavisahelp.com/de/guides/) — **indexed section hub** (navigation to EN living guides)',
    '- [Guides hub DE](https://pattayavisahelp.com/de/guides/) — **indexed section hub** (navigation to EN living guides)\n- [Tools hub DE](https://pattayavisahelp.com/de/tools/) — **indexed section hub**\n- [Glossary hub DE](https://pattayavisahelp.com/de/glossary/) — **indexed section hub**'
  );
  llms = llms.replace(
    '- [Guides hub RU](https://pattayavisahelp.com/ru/guides/) — **indexed section hub**',
    '- [Guides hub RU](https://pattayavisahelp.com/ru/guides/) — **indexed section hub**\n- [Tools hub RU](https://pattayavisahelp.com/ru/tools/) — **indexed section hub**\n- [Glossary hub RU](https://pattayavisahelp.com/ru/glossary/) — **indexed section hub**'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/tools/',")) {
  meta = meta.replace(
    "  '/de/guides/',\n  '/ru/guides/',\n  '/de/visas/dtv/',",
    "  '/de/guides/',\n  '/ru/guides/',\n  '/de/tools/',\n  '/ru/tools/',\n  '/de/glossary/',\n  '/ru/glossary/',\n  '/de/visas/dtv/',"
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
if (!cl.includes('Sprint 54')) {
  const block = ` 2026-05-28
 Recovery sprint 54

 <h2>Sprint 54 — DE/RU tools + glossary hubs indexed</h2>
 <p>Promoted /de/tools/, /ru/tools/, /de/glossary/, /ru/glossary/ with 400+ word navigation hubs. 302 sitemap URLs, 100 locale pilots.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/298 indexed URLs/g, '302 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 54 complete');
