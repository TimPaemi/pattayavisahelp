/**
 * Sprint 76 — full SEO focus: meta, new keyword guides, internal links, audits.
 */
const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'node scripts/sprint76-new-guides.cjs',
  'node scripts/sprint76-fix-guides.cjs',
  'node scripts/sprint76-seo-meta.cjs',
  'node scripts/sprint76-internal-seo.cjs',
  'node scripts/rebuild-sitemaps.cjs',
  'node scripts/audit-seo-keywords.cjs',
  'node scripts/audit-meta-indexed.cjs',
  'node scripts/audit-content-quality.cjs',
  'node scripts/audit-internal-links.cjs',
];

for (const cmd of steps) {
  console.log('\n===', cmd, '===');
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

console.log('\nSprint 76 complete.');
