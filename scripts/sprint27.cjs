const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint27-perf-fix.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 27')) {
  const block = ` 2026-05-28
 Recovery sprint 27

 <h2>Sprint 27 — Lighthouse CLS + font perf pass</h2>
 <p>Added metric-matched font fallbacks site-wide to cut layout shift on Google Fonts swap. Trimmed font weight requests, switched fade-in to opacity-only (excluded above-fold TL;DR), and deferred gtag idle load to 5s. Added scripts/audit-lighthouse-top20.cjs for recurring top-20 URL perf audits.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 27 complete');
