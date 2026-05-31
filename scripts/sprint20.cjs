const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint20-ui-fix.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 20')) {
  const block = ` 2026-06-04
 Recovery sprint 20

 <h2>Sprint 20 — Extended UI sweep + section fills</h2>
 <p>Fixed raw hero stats, empty h2 blocks, mangled visa pathway cards, and in-main footer junk on ~40 indexed guide/compare/pattaya pages. Extended audit-ui-chrome gate for raw stats, empty headings, and author blocks inside main.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 20 complete');
