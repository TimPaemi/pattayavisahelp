const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint-15-blogs.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 15')) {
  const block = ` 2026-06-10
 Recovery sprint 15

 <h2>Sprint 15 — full-depth blog rewrite (500+ words each)</h2>
 <p>Rewrote all thin auto-generated blog posts with researched 500–950 word articles. Fixed duplicate robots tags. Re-indexed posts passing content quality gate. Sitemap blog count restored for qualified posts only.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 15 complete');
