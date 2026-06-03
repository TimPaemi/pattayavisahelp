/**
 * Sprint 60 — Guides + glossary + tools/best-visa → DE/RU mesh (306 URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of [
  'sprint60-guides-locale.cjs',
  'sprint60-glossary-locale.cjs',
  'sprint60-tools-bestvisa.cjs',
]) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-internal-links.cjs',
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
if (!cl.includes('Sprint 60')) {
  const block = ` 2026-05-28
 Recovery sprint 60

 <h2>Sprint 60 — Guides, glossary, tools → locale network</h2>
 <p>All 35 EN guides, 35 glossary terms, 9 tools, and 6 best-visa tiers link DE/RU hubs and relevant indexed pilots via Locale network / Go deeper strips. 306 indexed URLs unchanged.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 60 complete');
