const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint-16-expand.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 16')) {
  const block = ` 2026-06-11
 Recovery sprint 16

 <h2>Sprint 16 — expand all 115 thin indexed pages to depth gate</h2>
 <p>Full rewrite of best-visa tiers (7), tools prose (10), glossary (36), professions (14), compare (10), guides (14), Pattaya areas (5), and misc hubs (19). Fixed duplicate robots tags on 24 DE/RU visa stubs. Content quality audit should pass on all 204 sitemap URLs.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 16 complete');
