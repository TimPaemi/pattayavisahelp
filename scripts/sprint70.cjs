/**
 * Sprint 70 — guides hub refresh, locale TOC, article chrome.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'changelog', 'index.html');

const steps = [
  'sprint70-sync-hubs.cjs',
  'sprint70-locale-toc-inline.cjs',
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
 Recovery sprint 70 (UX)

 <h2>Sprint 70 — Guides hub + locale TOC</h2>
 <p>DE/RU guides hubs list six indexed compliance pilots; side TOC and article labels localized; Read next on hub pages.</p>`;

let ch = fs.readFileSync(CHANGELOG, 'utf8');
if (!ch.includes('Sprint 70')) {
  ch = ch.replace(/Site changelog\n/, `Site changelog\n${entry}\n`);
  fs.writeFileSync(CHANGELOG, ch);
}

console.log('\nSprint 70 UX complete');
