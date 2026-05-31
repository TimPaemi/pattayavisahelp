const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint-19-ui-fix.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 19')) {
  const block = ` 2026-06-04
 Recovery sprint 19

 <h2>Sprint 19 — UI chrome rebuild + audit gate</h2>
 <p>Fixed corrupted card-grid HTML on /work-permit/ (prior), /professions/, /professions/dj/, /professions/online-business-owner/, and /pattaya-digital-nomad-guide/. Site-wide merged CTA fix. New audit-ui-chrome gate for indexed EN pages.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 19 complete');
