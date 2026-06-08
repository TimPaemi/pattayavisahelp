const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';
const TODAY = new Date().toISOString().slice(0, 10);

const SKIP = new Set(['/v2-preview/', '/tools/ltr-eligibility/', '/professions/digital-nomad/']);

/** Locale pages (hubs + stubs) are noindex until properly translated — exclude from sitemap. */
const LOCALE_INDEXED_PILOT = new Set(["/ru/","/de/","/de/visas/dtv/","/ru/visas/dtv/","/de/visas/ltr/","/ru/visas/ltr/","/de/visas/retirement-non-o/","/ru/visas/retirement-non-o/","/de/visas/privilege-elite/","/ru/visas/privilege-elite/","/de/visas/marriage-non-o/","/ru/visas/marriage-non-o/","/de/visas/business-non-b/","/ru/visas/business-non-b/","/de/visas/smart/","/ru/visas/smart/","/de/visas/education-ed/","/ru/visas/education-ed/","/de/visas/tourist-tr-evisa/","/ru/visas/tourist-tr-evisa/","/de/visas/retirement-o-a/","/ru/visas/retirement-o-a/","/de/visas/retirement-o-x/","/ru/visas/retirement-o-x/","/de/visas/media-non-m/","/ru/visas/media-non-m/","/de/compare/dtv-vs-ltr/","/ru/compare/dtv-vs-ltr/","/de/compare/ed-vs-dtv/","/ru/compare/ed-vs-dtv/","/de/compare/privilege-vs-ltr/","/ru/compare/privilege-vs-ltr/","/de/compare/non-o-vs-o-a/","/ru/compare/non-o-vs-o-a/","/de/compare/o-a-vs-o-x/","/ru/compare/o-a-vs-o-x/","/de/compare/dtv-vs-smart/","/ru/compare/dtv-vs-smart/","/de/compare/smart-vs-ltr/","/ru/compare/smart-vs-ltr/","/de/compare/marriage-vs-retirement/","/ru/compare/marriage-vs-retirement/","/de/compare/dtv-vs-elite/","/ru/compare/dtv-vs-elite/","/de/compare/pattaya-vs-bangkok/","/ru/compare/pattaya-vs-bangkok/","/de/compare/pattaya-vs-chiang-mai/","/ru/compare/pattaya-vs-chiang-mai/","/de/compare/pattaya-vs-phuket/","/ru/compare/pattaya-vs-phuket/","/de/compare/pattaya-vs-hua-hin/","/ru/compare/pattaya-vs-hua-hin/","/de/compare/pattaya-vs-hua-hin-deep/","/ru/compare/pattaya-vs-hua-hin-deep/","/de/compare/visa-comparison-matrix/","/ru/compare/visa-comparison-matrix/","/de/professions/content-creator/","/ru/professions/content-creator/","/de/professions/saas-founder/","/ru/professions/saas-founder/","/de/professions/online-business-owner/","/ru/professions/online-business-owner/","/de/professions/affiliate-marketer/","/ru/professions/affiliate-marketer/","/de/professions/crypto-trader/","/ru/professions/crypto-trader/","/de/professions/ai-engineer/","/ru/professions/ai-engineer/","/de/professions/english-teacher/","/ru/professions/english-teacher/","/de/professions/fitness-trainer/","/ru/professions/fitness-trainer/","/de/professions/diving-instructor/","/ru/professions/diving-instructor/","/de/professions/yoga-teacher/","/ru/professions/yoga-teacher/","/de/professions/photographer/","/ru/professions/photographer/","/de/professions/real-estate-agent/","/ru/professions/real-estate-agent/","/de/professions/chef/","/ru/professions/chef/","/de/professions/dj/","/ru/professions/dj/","/de/professions/hairdresser/","/ru/professions/hairdresser/","/de/professions/tattoo-artist/","/ru/professions/tattoo-artist/","/de/visas/","/ru/visas/","/de/compare/","/ru/compare/","/de/professions/","/ru/professions/","/de/guides/","/ru/guides/","/de/tools/","/ru/tools/","/de/glossary/","/ru/glossary/","/de/best-visa/","/ru/best-visa/","/de/pattaya/","/ru/pattaya/","/de/guides/jomtien-immigration-office/","/ru/guides/jomtien-immigration-office/","/de/guides/tm30-reporting/","/ru/guides/tm30-reporting/","/de/guides/90-day-reporting/","/ru/guides/90-day-reporting/","/de/guides/re-entry-permits/","/ru/guides/re-entry-permits/","/de/guides/visa-overstay-penalties/","/ru/guides/visa-overstay-penalties/","/de/guides/visa-runs-vs-extensions/","/ru/guides/visa-runs-vs-extensions/","/de/guides/thai-bank-account-as-foreigner/","/ru/guides/thai-bank-account-as-foreigner/","/de/guides/health-insurance/","/ru/guides/health-insurance/","/de/guides/retiring-in-thailand/","/ru/guides/retiring-in-thailand/","/de/guides/cost-of-living-pattaya/","/ru/guides/cost-of-living-pattaya/","/de/guides/driving-licence-thailand/","/ru/guides/driving-licence-thailand/"]);

function skipPage(p) {
  if (SKIP.has(p)) return true;
  if (LOCALE_INDEXED_PILOT.has(p)) return false;
  if (p.startsWith('/de/')) return true;
  if (p.startsWith('/ru/')) return true;
  return false;
}

const PRIORITY = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  default: { priority: '0.6', changefreq: 'monthly' },
};

const SECTIONS = {
  'sitemap-core.xml': [
    '/', '/about/', '/contact/', '/faq/', '/privacy/', '/terms/', '/methodology/', '/changelog/',
    '/sitemap/', '/services/', '/partners/', '/healthcare/', '/property/', '/digital-nomad/',
    '/retirement/', '/work-permit/', '/pattaya-digital-nomad-guide/',
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

function isNoindex(file) {
  const html = fs.readFileSync(file, 'utf8');
  const robots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] || '';
  return /noindex/i.test(robots);
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
const allPages = files
  .filter((f) => !isNoindex(f))
  .map(pagePath)
  .filter((p) => !skipPage(p));
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
