const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint-18-linking.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 18')) {
  const block = ` 2026-06-04
 Recovery sprint 18

 <h2>Sprint 18 — work-permit UI rebuild + internal linking gate</h2>
 <p>Rebuilt corrupted /work-permit/ page (broken card HTML, wrong TL;DR). Added contextual links to 14 weak-inbound indexed pages. New weak-inbound audit gate (min 2 inbound links per indexed EN URL). Fixed professions hub stat strip.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 18 complete');
