const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

console.log('=== Recovery Phase 1: unpublish locale stubs ===');
execSync('node scripts/recovery-unpublish-locale-stubs.cjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== Recovery Phase 2: expand thin blogs ===');
execSync('node scripts/recovery-expand-blogs.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/recovery-noindex-thin-blogs.cjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== Recovery Phase 3: rebuild sitemaps ===');
execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== Recovery Phase 4: audits ===');
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-full-2026.cjs', { cwd: ROOT, stdio: 'inherit' });

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Recovery sprint 14')) {
  const block = ` 2026-06-09
 Recovery sprint 14

 <h2>Recovery Sprint 14 — unpublish stubs, expand blogs, content quality audit</h2>
 <p><strong>Emergency recovery</strong> after thin-content sprint damage: all DE/RU stub pages set to <code>noindex</code> and removed from sitemap (328 pages). Per-page de/ru hreflang stripped from English pages until real translations exist. Fifteen thin auto-blogs expanded to full researched articles (500–900+ words each). New <code>audit-content-quality.cjs</code> gates indexing on word count + design chrome.</p>

`;
  cl = cl.replace('<main id="main" class="article-body">\nSite changelog\n', `<main id="main" class="article-body">\nSite changelog\n\n${block}`);
  fs.writeFileSync(changelogPath, cl);
}

console.log('Recovery sprint 14 complete');
