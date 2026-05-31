/**
 * List indexed EN pages with low inbound internal links.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function parseSitemap() {
  const urls = new Set();
  for (const file of fs.readdirSync(ROOT).filter((f) => f.startsWith('sitemap') && f.endsWith('.xml'))) {
    const xml = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      try {
        urls.add(new URL(m[1]).pathname);
      } catch {}
    }
  }
  return urls;
}

const j = JSON.parse(fs.readFileSync(path.join(ROOT, '_audit-internal-links.json'), 'utf8'));
const sitemap = parseSitemap();
const inbound = j.linkGraph.inbound;

const weak = Object.entries(inbound)
  .filter(([u, from]) => {
    if (!sitemap.has(u) || u === '/') return false;
    if (u.startsWith('/de/') || u.startsWith('/ru/')) return false;
    return from.length <= 2;
  })
  .map(([url, from]) => ({ url, count: from.length, from: from.sort() }))
  .sort((a, b) => a.count - b.count || a.url.localeCompare(b.url));

const report = {
  generated: new Date().toISOString(),
  threshold: '<=1 inbound on indexed EN (min 2 required)',
  minInbound: 2,
  totalWeak: weak.filter((x) => x.count < 2).length,
  pages: weak,
};

fs.writeFileSync(path.join(ROOT, '_audit-weak-inbound-indexed.json'), JSON.stringify(report, null, 2));
const fail = weak.filter((x) => x.count < 2);
console.log(JSON.stringify({ total: weak.length, failUnder2: fail.length, fail: fail.map((x) => x.url) }, null, 2));
if (fail.length) process.exit(1);
