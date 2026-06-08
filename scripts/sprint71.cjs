/**
 * Sprint 71 — DTV locale footer/links, mobile section jump, bank guide pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'changelog', 'index.html');

const steps = [
  'sprint71-promote-bank-guide.cjs',
  'sprint71-dtv-locale-links.cjs',
  'sprint71-dtv-mini-footer.cjs',
  'sprint70-sync-hubs.cjs',
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
 Recovery sprint 71 (UX)

 <h2>Sprint 71 — DTV footer, mobile TOC, bank guide pilots</h2>
 <p>DE/RU DTV compact locale footer and compliance links; mobile section-jump menu below 1400px; thai-bank-account DE/RU pilots indexed with hub + Read next.</p>`;

let ch = fs.readFileSync(CHANGELOG, 'utf8');
if (!ch.includes('Sprint 71')) {
  ch = ch.replace(/Site changelog\n/, `Site changelog\n${entry}\n`);
  fs.writeFileSync(CHANGELOG, ch);
}

console.log('\nSprint 71 UX complete');
