/**
 * Sprint 32 — blog/glossary network, self-host fonts pilot, DE DTV index pilot, Lighthouse.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint32-blog-network.cjs',
  'sprint32-glossary-network.cjs',
  'sprint32-de-dtv.cjs',
];

for (const s of steps) {
  console.log('\n===', s, '===');
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

console.log('\n=== sprint32-fonts.cjs (async) ===');
execSync('node scripts/sprint32-fonts.cjs', { cwd: ROOT, stdio: 'inherit', timeout: 120000 });

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'scan-ui-junk.cjs',
];

for (const a of audits) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit', timeout: 600000 });
}

console.log('\n--- audit-lighthouse-top20 (live, may take several minutes) ---');
try {
  execSync('node scripts/audit-lighthouse-top20.cjs', { cwd: ROOT, stdio: 'inherit', timeout: 600000 });
} catch (e) {
  console.warn('Lighthouse run failed or incomplete — deploy fonts first, re-run locally');
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 32')) {
  const block = ` 2026-05-28
 Recovery sprint 32

 <h2>Sprint 32 — blog/glossary network, fonts pilot, DE DTV indexed</h2>
 <p>Network-context strips on all 27 blog posts and 37 glossary pages. Self-hosted woff2 fonts on homepage and visa-finder (LCP pilot). Full German DTV guide at /de/visas/dtv/ — first indexed DE page in sitemap. Expanded FAQ schema and DE hub promo banner.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 32 complete');
