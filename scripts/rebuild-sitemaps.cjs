const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';
const TODAY = new Date().toISOString().slice(0, 10);

const SKIP = new Set(['/v2-preview/', '/tools/ltr-eligibility/', '/professions/digital-nomad/']);

const PRIORITY = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  default: { priority: '0.6', changefreq: 'monthly' },
};

const SECTIONS = {
  'sitemap-core.xml': [
    '/', '/about/', '/contact/', '/faq/', '/privacy/', '/terms/', '/methodology/', '/changelog/',
    '/sitemap/', '/services/', '/partners/', '/healthcare/', '/property/', '/digital-nomad/',
    '/retirement/', '/work-permit/', '/pattaya-digital-nomad-guide/', '/de/', '/ru/', '/de/sitemap/', '/ru/sitemap/',
    '/banking/', '/case-studies/', '/coworking/', '/gyms/', '/resources/', '/tax/', '/glossary/',
  ],
};

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'functions' || e.name === '.git') continue;
      walk(p, acc);
    } else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

function pagePath(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace('/index.html', '') + '/';
}

function sectionFor(p) {
  if (p === '/') return 'sitemap-core.xml';
  const top = p.split('/').filter(Boolean)[0];
  const map = {
    visas: 'sitemap-visas.xml',
    guides: 'sitemap-guides.xml',
    tools: 'sitemap-tools.xml',
    compare: 'sitemap-compare.xml',
    professions: 'sitemap-professions.xml',
    'best-visa': 'sitemap-best-visa.xml',
    pattaya: 'sitemap-pattaya.xml',
    blog: 'sitemap-blog.xml',
    glossary: 'sitemap-glossary.xml',
  };
  if (map[top]) return map[top];
  if (SECTIONS['sitemap-core.xml'].includes(p)) return 'sitemap-core.xml';
  return 'sitemap-core.xml';
}

function priorityFor(p) {
  if (p === '/') return PRIORITY['/'];
  if (p.startsWith('/visas/') && p !== '/visas/') return { priority: '0.95', changefreq: 'weekly' };
  if (p === '/visas/') return { priority: '0.9', changefreq: 'weekly' };
  if (p.startsWith('/tools/')) return { priority: '0.9', changefreq: 'monthly' };
  if (p.startsWith('/guides/')) return { priority: '0.85', changefreq: 'monthly' };
  if (p.startsWith('/compare/')) return { priority: '0.8', changefreq: 'monthly' };
  if (p.startsWith('/blog/')) return { priority: '0.7', changefreq: 'monthly' };
  if (p.startsWith('/pattaya/')) return { priority: '0.75', changefreq: 'monthly' };
  if (p.startsWith('/professions/')) return { priority: '0.7', changefreq: 'monthly' };
  if (p.startsWith('/glossary/')) return { priority: '0.6', changefreq: 'yearly' };
  if (p.startsWith('/best-visa/')) return { priority: '0.7', changefreq: 'monthly' };
  return PRIORITY.default;
}

function urlEntry(p) {
  const { priority, changefreq } = priorityFor(p);
  return `  <url>
    <loc>${BASE}${p === '/' ? '/' : p}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function writeUrlset(file, paths) {
  const sorted = [...paths].sort((a, b) => a.localeCompare(b));
  const body = sorted.map(urlEntry).join('\n');
  fs.writeFileSync(
    path.join(ROOT, file),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}

const files = walk(ROOT);
const allPages = files.map(pagePath).filter((p) => !SKIP.has(p));
const bySection = new Map();

for (const p of allPages) {
  const sec = sectionFor(p);
  if (!bySection.has(sec)) bySection.set(sec, []);
  bySection.get(sec).push(p);
}

// guides/glossary hub lives in glossary sitemap historically
if (bySection.has('sitemap-guides.xml') && bySection.has('sitemap-glossary.xml')) {
  const g = bySection.get('sitemap-glossary.xml');
  if (!g.includes('/guides/glossary/')) g.push('/guides/glossary/');
}

for (const [file, paths] of bySection) writeUrlset(file, paths);

const childFiles = [...bySection.keys()].sort();
childFiles.push('sitemap-images.xml');
const indexBody = childFiles
  .map(
    (f) => `  <sitemap>
    <loc>${BASE}/${f}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`
  )
  .join('\n');

fs.writeFileSync(
  path.join(ROOT, 'sitemap_index.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexBody}\n</sitemapindex>\n`
);

writeUrlset('sitemap.xml', allPages);

console.log(JSON.stringify({
  date: TODAY,
  indexable: allPages.length,
  childSitemaps: childFiles.length,
  sections: Object.fromEntries([...bySection.entries()].map(([k, v]) => [k, v.length])),
}, null, 2));
