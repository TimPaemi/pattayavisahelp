/**
 * Sprint 59 — Blog → DE/RU locale mesh (306 URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

console.log('\n=== sprint59-blog-locale.cjs ===');
execSync('node scripts/sprint59-blog-locale.cjs', { cwd: ROOT, stdio: 'inherit' });

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-internal-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'audit-content-quality.cjs',
  'audit-meta-indexed.cjs',
  'scan-ui-junk.cjs',
];
for (const a of audits) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit' });
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 59')) {
  const block = ` 2026-05-28
 Recovery sprint 59

 <h2>Sprint 59 — Blog posts → locale pilots</h2>
 <p>All 26 blog posts and the blog hub link indexed DE/RU visa pilots, Pattaya/budget hubs, and related guides via Go deeper strips.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 59 complete');
