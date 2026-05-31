/**
 * Sprint 15 — apply full blog content, reindex qualified posts, rebuild sitemap.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MIN_WORDS = 500;
const INDEX_ROBOTS = '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />';

const bodies = Object.assign(
  {},
  require('./content/blog-expanded-2026.cjs'),
  require('./content/blog-sprint15-part1.cjs'),
  require('./content/blog-sprint15-part2.cjs'),
  require('./content/blog-sprint15-part3.cjs')
);
const supplement = require('./content/blog-sprint15-supplement.cjs');
const extra = require('./content/blog-sprint15-extra.cjs');
const final = require('./content/blog-sprint15-final.cjs');
const flush = require('./content/blog-sprint15-flush.cjs');

function wordCount(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const text = main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(Boolean).length;
}

function fixRobots(html, index) {
  html = html.replace(/<meta name="robots" content="[^"]+"\s*\/?>\s*\n?/gi, '');
  return html.replace(/<meta name="viewport"[^>]+\/?>/i, (m) => `${m}\n${index ? INDEX_ROBOTS : '<meta name="robots" content="noindex,follow" />'}`);
}

function readMin(words) {
  return Math.max(4, Math.round(words / 200));
}

const PATCH_ONLY = new Set(['jomtien-immigration-2026', 'dtv-180-day-extension-2026', '2026-annual-review']);

const report = { applied: [], indexed: [], heldNoindex: [] };

for (const slug of Object.keys(bodies)) {
  const file = path.join(ROOT, 'blog', slug, 'index.html');
  if (!PATCH_ONLY.has(slug)) {
    execSync(`node scripts/create-blog-post.cjs ${slug}`, { cwd: ROOT, stdio: 'pipe' });
  }
  if (!fs.existsSync(file)) {
    console.error('Missing blog file:', slug);
    process.exit(1);
  }
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<main id="main" class="article-body">[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${bodies[slug]}${supplement[slug] || ''}${extra[slug] || ''}${final[slug] || ''}${flush[slug] || ''}\n</main>`);
  const words = wordCount(html);
  const readMinVal = readMin(words);
  html = html.replace(/\d+ MIN READ/g, `${readMinVal} MIN READ`);
  html = fixRobots(html, words >= MIN_WORDS);
  fs.writeFileSync(file, html);
  const row = { slug, words, readMin: readMinVal };
  report.applied.push(row);
  if (words >= MIN_WORDS) report.indexed.push(row);
  else report.heldNoindex.push(row);
}

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });

if (report.heldNoindex.length) {
  console.error('FAIL: blogs under 500 words:', report.heldNoindex.map((r) => r.slug).join(', '));
  process.exit(1);
}
