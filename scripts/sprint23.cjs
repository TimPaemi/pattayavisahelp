const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint23-compare-matrix-fix.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 23')) {
  const block = ` 2026-06-04
 Recovery sprint 23

 <h2>Sprint 23 — Visa matrix + compare dedupe</h2>
 <p>Added intro and fixed broken deep-dive links on /compare/visa-comparison-matrix/. Deduped duplicate FAQ/CTA on /compare/dtv-vs-elite/. Rebuilt intro on /compare/pattaya-vs-hua-hin/ and /guides/driving-licence-thailand/. Removed aria-hidden junk wrappers. Extended UI audit gate.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 23 complete');
