/**
 * Sprint 57 — Profession cross-links + EN locale inbound (306 URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint57-hub-mesh.cjs',
  'sprint57-profession-crosslinks.cjs',
  'sprint57-en-locale-inbound.cjs',
];

for (const s of steps) {
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
if (!cl.includes('Sprint 57')) {
  const block = ` 2026-05-28
 Recovery sprint 57

 <h2>Sprint 57 — Profession pathways + EN locale inbound</h2>
 <p>In-page Beruf/Profession blocks on all 48 profession pilots (DE/RU/EN); complete mesh on best-visa/pattaya hubs; EN FAQ/resources/tools/glossary and core hubs link full DE/RU section network; DE/RU sitemaps surface indexed hubs.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 57 complete');
