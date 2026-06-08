/**
 * Sprint 65 — UX only: mobile link strips, locale mnav, cookie stack, stub layout.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

console.log('=== sprint65-ux-inject ===');
execSync('node scripts/sprint65-ux-inject.cjs', { cwd: ROOT, stdio: 'inherit' });

for (const a of ['audit-ui-chrome.cjs', 'audit-broken-links.cjs']) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit' });
}

const cl = path.join(ROOT, 'changelog/index.html');
let h = fs.readFileSync(cl, 'utf8');
if (!h.includes('Sprint 65')) {
  const block = ` 2026-05-28
 Recovery sprint 65 (UX)

 <h2>Sprint 65 — Mobile UX polish</h2>
 <p>Global /assets/ux-enhancements.* — collapsible network-context on mobile, locale mnav labels, cookie bar above bottom nav, stub page readable width; shared mnav.js on pages with mobile nav.</p>

`;
  h = h.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(cl, h);
}

console.log('\nSprint 65 UX complete');
