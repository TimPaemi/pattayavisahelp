const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint28-audit-fix.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 28')) {
  const block = ` 2026-06-02
 Recovery sprint 28

 <h2>Sprint 28 — full-audit remediation (privacy, meta, locales)</h2>
 <p>Aligned privacy policy with deferred Google Analytics 4 and DNT skip. Set /de/ and /ru/ hubs to noindex until full translations ship. Trimmed 27 EN meta titles/descriptions, fixed DE/RU Hua Hin duplicate titles, visa-finder quiz jump + aria-live, manifest theme_color, CSP cleanup, and README stack notes.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 28 complete — run audits before commit');
