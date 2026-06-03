/**
 * Sprint 58 — EN pillar → DE/RU pilot links (306 URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

console.log('\n=== sprint58-en-pillar-locale.cjs ===');
execSync('node scripts/sprint58-en-pillar-locale.cjs', { cwd: ROOT, stdio: 'inherit' });

const audits = [
  'audit-comprehensive.cjs',
  'audit-broken-links.cjs',
  'audit-internal-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'audit-content-quality.cjs',
];
for (const a of audits) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit' });
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 58')) {
  const block = ` 2026-05-28
 Recovery sprint 58

 <h2>Sprint 58 — EN pillars → DE/RU pilots</h2>
 <p>Every English visa and compare page links indexed DE/RU pilots, locale hubs, and related compares before FAQ.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 58 complete');
