/**
 * Sprint 30 — healthcare hub + network links + FAQ schema + read-time sync.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const { runContentPatches } = require('./sprint30-content.cjs');
runContentPatches();
execSync('node scripts/sprint30-network.cjs', { cwd: ROOT, stdio: 'inherit' });

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
  try {
    execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit', timeout: 600000 });
  } catch (e) {
    console.error(a, 'failed');
    process.exit(1);
  }
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 30')) {
  const block = ` 2026-05-28
 Recovery sprint 30

 <h2>Sprint 30 — healthcare hub, network links, FAQ schema</h2>
 <p>Expanded healthcare hub (pharmacies, emergency numbers, FAQ + FAQPage schema). Added contextual network links on 14 high-traffic guides/hubs. Retiring-in-Thailand FAQ block + schema. Synced read-time badges on substantive hubs that still showed 1 MIN.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 30 complete');
