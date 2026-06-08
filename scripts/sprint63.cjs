/**
 * Sprint 63 — UX fixes: DTV mnav, pilot hreflang, stub banners, matrix H1, audits.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint63-mnav-dtv.cjs',
  'sprint63-hreflang-pilots.cjs',
  'sprint63-stub-banner.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

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
if (!cl.includes('Sprint 63')) {
  const block = ` 2026-05-28
 Recovery sprint 63

 <h2>Sprint 63 — Mobile nav, hreflang, stub UX</h2>
 <p>DE/RU DTV pilots get deferred mnav; all 106 locale pilots get correct en/de/ru/x-default hreflang; 224 stub banners localized; visa matrix H1 em dash fix; UI chrome audit covers DE/RU pilots.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 63 complete');
