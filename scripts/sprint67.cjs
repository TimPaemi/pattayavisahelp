/**
 * Sprint 67 — compliance guide pilots, EN hero fixes, locale mnav paths.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'changelog', 'index.html');

const steps = [
  'sprint67-promote-compliance-guides.cjs',
  'sprint67-mnav-unify.cjs',
  'audit-ux-shell.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const entry = `
 <article class="changelog-item" id="sprint-67">
  <time datetime="2026-05-28">28 May 2026</time>
  <h3>Sprint 67 — TM30 &amp; 90-day DE/RU pilots + locale mnav</h3>
  <p>Four indexed compliance guides in German and Russian; EN hero copy fixed; mobile nav uses locale hubs on /de/* and /ru/*.</p>
  <ul>
   <li>Indexed: <code>/de|ru/guides/tm30-reporting/</code>, <code>/de|ru/guides/90-day-reporting/</code></li>
   <li>EN <code>/guides/tm30-reporting/</code> and <code>/guides/90-day-reporting/</code> lede/TL;DR repaired</li>
   <li>Inline mnav replaced with <code>/assets/mnav.js</code> (locale paths)</li>
  </ul>
 </article>`;

let ch = fs.readFileSync(CHANGELOG, 'utf8');
if (!ch.includes('id="sprint-67"')) {
  ch = ch.replace(/<div class="changelog-list">/, `<div class="changelog-list">${entry}`);
  fs.writeFileSync(CHANGELOG, ch);
}

console.log('\nSprint 67 UX complete');
