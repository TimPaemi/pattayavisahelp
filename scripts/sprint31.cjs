/**
 * Sprint 31 — full-depth: network strips (63 pages), read times, perf, hub links.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint31-network.cjs',
  'sprint31-network-ext.cjs',
  'sprint31-readtime.cjs',
  'sprint31-perf.cjs',
  'sprint31-links.cjs',
];

for (const s of steps) {
  console.log('\n===', s, '===');
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

execSync('node scripts/audit-internal-links.cjs', { cwd: ROOT, stdio: 'inherit' });

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'scan-ui-junk.cjs',
  'audit-full-2026.cjs',
];
for (const a of audits) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit', timeout: 600000 });
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 31')) {
  const block = ` 2026-05-28
 Recovery sprint 31

 <h2>Sprint 31 — full network coverage + read-time sync + hub linking</h2>
 <p>Added contextual Pattaya Authority network strips on all 63 remaining indexed guides/visas/compare/pattaya pages. Site-wide read-time badge sync from main word count (~96 pages). Trimmed Google Fonts weights on tools (visa-finder LCP). Homepage, FAQ, tools, and Pattaya hub cross-links for blog/glossary discoverability. Rebuilt internal-link graph.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 31 complete');
