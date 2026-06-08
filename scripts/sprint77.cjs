/**
 * Sprint 77 — polish SEO guides, driving-licence DE/RU pilots, locale mesh.
 */
const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'node scripts/sprint77-polish-guides.cjs',
  'node scripts/sprint77-promote-driving-licence.cjs',
  'node scripts/sprint73-sync-locale-guides.cjs',
  'node scripts/sprint69-locale-footer.cjs',
  'node scripts/sprint68-read-next-locale.cjs',
  'node scripts/sprint72-locale-guide-links.cjs',
  'node scripts/sprint70-sync-hubs.cjs',
  'node scripts/sprint76-seo-meta.cjs',
  'node scripts/rebuild-sitemaps.cjs',
  'node scripts/audit-ux-shell.cjs',
  'node scripts/audit-ui-chrome.cjs',
  'node scripts/audit-broken-links.cjs',
  'node scripts/audit-content-quality.cjs',
  'node scripts/audit-meta-indexed.cjs',
  'node scripts/audit-seo-keywords.cjs',
];

for (const cmd of steps) {
  console.log('\n===', cmd, '===');
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

console.log('\nSprint 77 complete.');
