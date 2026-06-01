const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint26-hub-faq-fix.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/sprint26-wrap-hubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/sprint26-cleanup-cta.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 26')) {
  const block = ` 2026-06-04
 Recovery sprint 26

 <h2>Sprint 26 — hub cards + FAQ markup sweep</h2>
 <p>Rebuilt /pattaya/ and /guides/ hub pathway cards (broken alt-cards, raw stats, raw CTA). Fixed /faq/ intro and wrapped FAQ answers site-wide. Fixed blog related cards and methodology heading. Extended UI audit gate.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 26 complete');
