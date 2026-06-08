/**
 * Sprint 68 — Jomtien refresh, re-entry/overstay pilots, locale Read next.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'changelog', 'index.html');

const steps = [
  'sprint68-promote-more-guides.cjs',
  'sprint68-read-next-locale.cjs',
  'audit-ux-shell.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const entry = `
 2026-05-28
 Recovery sprint 68 (UX)

 <h2>Sprint 68 — Compliance cluster DE/RU + locale Read next</h2>
 <p>Re-entry and overstay promoted; Jomtien articles refreshed; Read next and contact blocks localized on 10 DE/RU guide pilots.</p>`;

let ch = fs.readFileSync(CHANGELOG, 'utf8');
if (!ch.includes('Sprint 68')) {
  ch = ch.replace(/Site changelog\n/, `Site changelog\n${entry}\n`);
  fs.writeFileSync(CHANGELOG, ch);
}

console.log('\nSprint 68 UX complete');
