/**
 * Sprint 74 — cost-of-living pilots, footer links, hub refresh.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'changelog', 'index.html');

const steps = [
  'sprint74-promote-cost-living.cjs',
  'sprint72-locale-guide-links.cjs',
  'sprint74-footer-cost-link.cjs',
  'sprint70-sync-hubs.cjs',
  'sprint69-locale-footer.cjs',
  'sprint68-read-next-locale.cjs',
  'audit-ux-shell.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-content-quality.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const entry = `
 2026-05-28
 Recovery sprint 74 (UX)

 <h2>Sprint 74 — Cost of living pilots</h2>
 <p>DE/RU cost-of-living Pattaya indexed; EN hero fixed; hubs list 10 guides; DTV/LTR/Non-O footers link to Lebenshaltung/расходы.</p>`;

let ch = fs.readFileSync(CHANGELOG, 'utf8');
if (!ch.includes('Sprint 74')) {
  ch = ch.replace(/Site changelog\n/, `Site changelog\n${entry}\n`);
  fs.writeFileSync(CHANGELOG, ch);
}

console.log('\nSprint 74 UX complete');
