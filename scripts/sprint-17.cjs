const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint-17-qa.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 17')) {
  const block = ` 2026-06-12
 Recovery sprint 17

 <h2>Sprint 17 — QA pass: broken links, tool UI, TL;DR, meta</h2>
 <p>Fixed 404 internal links (/visas/smart/, /visas/education-ed/, /visas/privilege-elite/). Removed triple-duplicated tool prose from re-runs. Rewrote cost-calculator guide to match actual visa-cost tool. Fixed wrong TL;DR on best-visa tiers. Added broken-link audit gate. Expanded work-permit hub.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 17 complete');
