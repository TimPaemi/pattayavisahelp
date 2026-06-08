/**
 * Sprint 72 — health-insurance pilots, locale internal links, hub refresh.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'changelog', 'index.html');

const steps = [
  'sprint72-promote-health-insurance.cjs',
  'sprint72-locale-guide-links.cjs',
  'sprint70-sync-hubs.cjs',
  'sprint69-locale-footer.cjs',
  'sprint68-read-next-locale.cjs',
  'audit-ux-shell.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-meta-indexed.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const entry = `
 2026-05-28
 Recovery sprint 72 (UX)

 <h2>Sprint 72 — Health insurance pilots + locale link pass</h2>
 <p>DE/RU health-insurance guides indexed; EN hero fixed; DE/RU pilots link to locale guides/visas/compare where indexed; hubs list 8 guides.</p>`;

let ch = fs.readFileSync(CHANGELOG, 'utf8');
if (!ch.includes('Sprint 72')) {
  ch = ch.replace(/Site changelog\n/, `Site changelog\n${entry}\n`);
  fs.writeFileSync(CHANGELOG, ch);
}

console.log('\nSprint 72 UX complete');
