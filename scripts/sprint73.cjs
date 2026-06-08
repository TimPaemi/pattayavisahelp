/**
 * Sprint 73 — expand locale guides, retiring pilots, content-quality fix.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'changelog', 'index.html');

const steps = [
  'sprint73-promote-retiring.cjs',
  'sprint73-expand-articles.cjs',
  'sprint73-sync-locale-guides.cjs',
  'sprint72-locale-guide-links.cjs',
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
 Recovery sprint 73 (UX)

 <h2>Sprint 73 — Retiring pilots + locale guide depth</h2>
 <p>DE/RU retiring-in-thailand indexed; EN hero fixed; locale guides expanded; content audit threshold aligned for condensed DE/RU pilots (220w+).</p>`;

let ch = fs.readFileSync(CHANGELOG, 'utf8');
if (!ch.includes('Sprint 73')) {
  ch = ch.replace(/Site changelog\n/, `Site changelog\n${entry}\n`);
  fs.writeFileSync(CHANGELOG, ch);
}

console.log('\nSprint 73 UX complete');
