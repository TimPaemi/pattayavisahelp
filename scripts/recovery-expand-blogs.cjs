/**
 * Regenerate thin blogs with expanded researched content.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const expanded = require('./content/blog-expanded-2026.cjs');

function wordCount(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const text = main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(Boolean).length;
}

const report = { regenerated: [], skipped: [] };

for (const slug of Object.keys(expanded)) {
  execSync(`node scripts/create-blog-post.cjs ${slug}`, { cwd: ROOT, stdio: 'pipe' });
  const file = path.join(ROOT, 'blog', slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<main id="main" class="article-body">[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${expanded[slug]}\n</main>`);
  // Fix read time estimate from word count
  const words = wordCount(html);
  const readMin = Math.max(4, Math.round(words / 200));
  html = html.replace(/\d+ MIN READ/g, `${readMin} MIN READ`);
  fs.writeFileSync(file, html);
  report.regenerated.push({ slug, words, readMin });
}

console.log(JSON.stringify(report, null, 2));
