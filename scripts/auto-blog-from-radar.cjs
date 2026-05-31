/**
 * Create blog posts flagged by policy-radar when create-blog-post has a spec.
 * Usage: node scripts/auto-blog-from-radar.cjs
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const radarPath = path.join(ROOT, '_policy-radar.json');

if (!fs.existsSync(radarPath)) {
  execSync('node scripts/policy-radar.cjs', { cwd: ROOT, stdio: 'inherit' });
}

const radar = JSON.parse(fs.readFileSync(radarPath, 'utf8'));
const createScript = fs.readFileSync(path.join(ROOT, 'scripts/create-blog-post.cjs'), 'utf8');
const available = [...createScript.matchAll(/'([a-z0-9-]+-2026)':\s*\{/g)].map((m) => m[1]);

const created = [];
for (const topic of radar.missingTopics || []) {
  if (!available.includes(topic.slug)) continue;
  const dir = path.join(ROOT, 'blog', topic.slug);
  if (fs.existsSync(dir)) continue;
  execSync(`node scripts/create-blog-post.cjs ${topic.slug}`, { cwd: ROOT, stdio: 'inherit' });
  created.push(topic.slug);
}

if (created.length) {
  execSync(`node scripts/update-feed.cjs ${created.join(' ')}`, { cwd: ROOT, stdio: 'inherit' });
}

console.log(JSON.stringify({ created }, null, 2));
