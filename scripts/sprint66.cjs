/**
 * Sprint 66 — UX orphans: skip links, v2 preview shell, localized cookie banner.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHANGELOG = path.join(ROOT, 'changelog', 'index.html');

function run(cmd) {
  console.log('\n---', cmd, '---');
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

run('node scripts/audit-ux-shell.cjs');
run('node scripts/audit-ui-chrome.cjs');

const entry = `
 <article class="changelog-item" id="sprint-66">
  <time datetime="2026-05-28">28 May 2026</time>
  <h3>Sprint 66 — UX shell gaps &amp; locale cookies</h3>
  <p>Redirect stubs and v2 preview get skip links and mobile nav parity; cookie consent copy matches DE/RU locale paths.</p>
  <ul>
   <li>Skip link + <code>#main</code> on <code>/professions/digital-nomad/</code>, <code>/tools/ltr-eligibility/</code></li>
   <li><code>/v2-preview/</code>: internal preview banner, skip link, bottom mnav at ≤760px</li>
   <li><code>cookie-consent.js</code>: German and Russian banner text on <code>/de/*</code> and <code>/ru/*</code></li>
  </ul>
 </article>`;

let ch = fs.readFileSync(CHANGELOG, 'utf8');
if (!ch.includes('id="sprint-66"')) {
  ch = ch.replace(
    /<div class="changelog-list">/,
    `<div class="changelog-list">${entry}`
  );
  fs.writeFileSync(CHANGELOG, ch);
}

console.log('\nSprint 66 UX complete');
