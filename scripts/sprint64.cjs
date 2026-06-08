/**
 * Sprint 64 — stub nav, locale meta, weak inbound fixes.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of [
  'sprint64-stub-nav.cjs',
  'sprint64-locale-meta.cjs',
  'sprint64-pattaya-missing-stubs.cjs',
  'sprint64-inbound.cjs',
]) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-internal-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'audit-content-quality.cjs',
  'audit-meta-indexed.cjs',
  'scan-ui-junk.cjs',
  'audit-ux-shell.cjs',
];

for (const a of audits) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit' });
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 64')) {
  const block = ` 2026-05-28
 Recovery sprint 64

 <h2>Sprint 64 — Stub navigation + locale meta + inbound mesh</h2>
 <p>Noindex DE/RU stubs get skip link, locale nav, and mobile bottom bar; 106 pilots get matching OG/JSON-LD language; Pattaya and RU tools hubs link weak one-inbound pages.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 64 complete');
