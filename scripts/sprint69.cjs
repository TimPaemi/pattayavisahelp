/**
 * Sprint 69 — locale footer/shell, visa-runs pilots, mobile read-next.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'changelog', 'index.html');

const steps = [
  'sprint69-promote-visa-runs.cjs',
  'sprint69-locale-footer.cjs',
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
 Recovery sprint 69 (UX)

 <h2>Sprint 69 — Locale footer + visa-runs pilots</h2>
 <p>114 DE/RU pilots get localized footer columns, nav, and crumbs; visa-runs vs extensions promoted; Read-next single-column on mobile.</p>`;

let ch = fs.readFileSync(CHANGELOG, 'utf8');
if (!ch.includes('Sprint 69')) {
  ch = ch.replace(/Site changelog\n/, `Site changelog\n${entry}\n`);
  fs.writeFileSync(CHANGELOG, ch);
}

console.log('\nSprint 69 UX complete');
