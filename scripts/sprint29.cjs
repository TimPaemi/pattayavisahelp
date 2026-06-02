const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/sprint29-consent-network.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 29')) {
  const block = ` 2026-06-02
 Recovery sprint 29

 <h2>Sprint 29 — cookie consent + network contextual links</h2>
 <p>Added GDPR-style cookie banner (accept/decline analytics) with gtag gated on consent. Inserted contextual Pattaya Authority network links on 9 guides/hubs. Removed duplicate budget table on cost-of-living guide. Updated privacy policy and about read time.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 29 complete');
