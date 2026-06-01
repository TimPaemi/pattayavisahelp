const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint24-aria-cta-fix.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 24')) {
  const block = ` 2026-06-04
 Recovery sprint 24

 <h2>Sprint 24 — aria-hidden CTA fix + guide intros</h2>
 <p>Fixed CTAs and content hidden inside unclosed aria-hidden divs on 4 practical guides, /pattaya/living-in-pattaya/, and /pattaya/jomtien/. Removed blog metadata junk wrappers. Added related-link intros on buying-property, healthcare, permanent-residency, and international-schools guides. Extended UI audit gate.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 24 complete');
