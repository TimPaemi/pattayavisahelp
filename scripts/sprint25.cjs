const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint25-markup-fix.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 25')) {
  const block = ` 2026-06-04
 Recovery sprint 25

 <h2>Sprint 25 — markup cleanup + content fills</h2>
 <p>Removed stray article wrappers from 7 guides and blog posts. Fixed raw callout text on TDAC and visa-recap blogs. Filled empty DTV/LTR bank sections and added intro on thai-bank-account guide. Fixed TDAC callout on 90-day reporting. Extended UI audit gate.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 25 complete');
