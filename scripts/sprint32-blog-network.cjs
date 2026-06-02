const fs = require('fs');
const path = require('path');
const blogLinks = require('./content/sprint32-blog-links.cjs');

const ROOT = path.join(__dirname, '..');
const NETWORK_CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

function walkBlog(acc = []) {
  const blogDir = path.join(ROOT, 'blog');
  const hub = path.join(blogDir, 'index.html');
  if (fs.existsSync(hub)) acc.push(hub);
  for (const e of fs.readdirSync(blogDir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    acc.push(path.join(blogDir, e.name, 'index.html'));
  }
  return acc;
}

function isIndexed(html) {
  const robots = (html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || 'index,follow';
  return !/noindex/i.test(robots);
}

let n = 0;
for (const file of walkBlog()) {
  const slug = path.basename(path.dirname(file));
  const inner = blogLinks[slug];
  if (!inner) continue;
  let h = fs.readFileSync(file, 'utf8');
  if (!isIndexed(h) || h.includes('class="network-context"')) continue;
  if (!h.includes('.network-context{') && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${NETWORK_CSS}\n`);
  }
  const snippet = `<p class="network-context">${inner}</p>\n`;
  const marker = '<main id="main" class="article-body">';
  if (!h.includes(marker)) continue;
  h = h.replace(marker, snippet + marker);
  fs.writeFileSync(file, h);
  n++;
  console.log('blog network', slug);
}
console.log(`Blog network: ${n} pages`);
