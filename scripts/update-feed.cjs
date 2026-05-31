/**
 * Prepend RSS items for new blog posts.
 * Usage: node scripts/update-feed.cjs slug-one [slug-two ...]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error('Usage: node scripts/update-feed.cjs <slug> [...]');
  process.exit(1);
}

let feed = fs.readFileSync(path.join(ROOT, 'feed.xml'), 'utf8');
const today = new Date();
const pub = today.toUTCString().replace('GMT', '+0700');

for (const slug of slugs.reverse()) {
  const html = fs.readFileSync(path.join(ROOT, 'blog', slug, 'index.html'), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/&amp;/g, '&') || slug;
  const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
  const url = `https://pattayavisahelp.com/blog/${slug}/`;
  if (feed.includes(url)) continue;
  const item = `  <item>
    <title>${title.replace(/&/g, '&amp;')}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <description>${desc.replace(/&/g, '&amp;')}</description>
    <pubDate>${pub}</pubDate>
  </item>
  
`;
  feed = feed.replace(/<lastBuildDate>[^<]+<\/lastBuildDate>\s*\n\s*\n/, (m) => m + item);
}

fs.writeFileSync(path.join(ROOT, 'feed.xml'), feed);
console.log('Updated feed for:', slugs.join(', '));
