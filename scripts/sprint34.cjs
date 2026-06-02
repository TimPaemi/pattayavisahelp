/**
 * Sprint 34 — post-audit fixes: llms honesty, RU meta, tap targets, Olympian removal,
 * fonts/CSP, perf on heavy pages, audit script fix.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint34-meta.cjs',
  'sprint34-network.cjs',
  'sprint34-a11y-tap.cjs',
  'sprint34-perf-heavy.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

// Fix audit-content-quality font check (self-hosted)
const aqPath = path.join(ROOT, 'scripts/audit-content-quality.cjs');
let aq = fs.readFileSync(aqPath, 'utf8');
aq = aq.replace(
    "hasFonts: /fonts\\.googleapis\\.com/.test(html),",
    "hasFonts: /\\/assets\\/fonts\\/fonts(-pilot)?\\.css/.test(html) || /preload[^>]+\\.woff2/i.test(html),"
  )
  .replace("'missing font preload'", "'missing self-hosted fonts'");
fs.writeFileSync(aqPath, aq);
console.log('\naudit-content-quality.cjs: self-hosted font check');

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
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
if (!cl.includes('Sprint 34')) {
  const block = ` 2026-05-28
 Recovery sprint 34

 <h2>Sprint 34 — audit remediation (GEO, a11y, network, perf)</h2>
 <p>Corrected llms.txt locale claims (only DE/RU DTV pilots indexed). Extended RU DTV meta description. Changelog now references 204 indexed URLs. Removed Olympian Greek Souvlaki from network footer and schema. Site-wide tap-target CSS for mnav and f-network. Self-hosted fonts on homepage and visa-finder; CSP no longer allows Google Fonts. Idle-deferred auto-badge on Jomtien guide and key compare pages. audit-content-quality checks self-hosted fonts.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 34 complete');
