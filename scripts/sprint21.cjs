const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint21-country-routes-fix.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 21')) {
  const block = ` 2026-06-04
 Recovery sprint 21

 <h2>Sprint 21 — Nationality route pages rebuild</h2>
 <p>Rebuilt all 7 indexed /pattaya/*-to-thailand/ pages: related links, accurate pathway lists, nationality-specific entry rules (India pre-visa, China mutual exemption, Russia banking context). Extended UI audit for raw quick-take text.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 21 complete');
