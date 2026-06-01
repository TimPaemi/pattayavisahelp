const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint22-compare-fix.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 22')) {
  const block = ` 2026-06-04
 Recovery sprint 22

 <h2>Sprint 22 — Premium compare pages UI rebuild</h2>
 <p>Fixed magazine-style corruption on /compare/dtv-vs-ltr/, /compare/privilege-vs-ltr/, /compare/non-o-vs-o-a/: duplicate TL;DR, orphan links, broken visa alt-cards, raw section labels. Rebuilt retirement city guide intro and glossary B section. Extended UI audit gate.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 22 complete');
