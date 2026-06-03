/**
 * Sprint 61 — EN mirrors + stub mesh + Pattaya locale (306 URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of [
  'sprint61-en-mirror-links.cjs',
  'sprint61-stub-mesh.cjs',
  'sprint61-pattaya-locale.cjs',
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
if (!cl.includes('Sprint 61')) {
  const block = ` 2026-05-28
 Recovery sprint 61

 <h2>Sprint 61 — Locale stub mesh + EN mirror links</h2>
 <p>EN guides, glossary, and budget tiers link matching /de/ and /ru/ mirror URLs; all 105 noindex locale stubs get full Netzwerk/Сеть strips plus EN pillar links; EN Pattaya area pages link DE/RU Pattaya hubs.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 61 complete');
