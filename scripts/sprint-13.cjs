const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

execSync('node scripts/locale-guide-faq.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-compare-faq.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/locale-sitemap-hubs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-full-2026.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 13')) {
  const block = ` 2026-06-09
 SEO sprint 13

 <h2>Sprint 13 — RU guide FAQ, compare FAQ, live network audit script</h2>
 <p>FAQPage on 10 RU guide stubs + 5 DE/RU compare stubs. Added <code>audit-live-network.cjs</code> for full live HTTP audit of sitemap + 13 sister sites.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Sprint 13 complete');
