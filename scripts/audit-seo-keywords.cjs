/**
 * SEO keyword coverage audit — indexed pages meta + target keyword presence.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const TARGETS = [
  { kw: 'tdac|digital arrival card', pages: ['/guides/thailand-digital-arrival-card/', '/blog/tdac-step-by-step/'] },
  { kw: 'non-o extension|retirement extension', pages: ['/guides/non-o-extension-pattaya/', '/visas/retirement-non-o/', '/blog/non-o-extension-documents-2026/'] },
  { kw: 'jomtien immigration', pages: ['/guides/jomtien-immigration-office/', '/blog/jomtien-immigration-2026/'] },
  { kw: '90.day report|tm47', pages: ['/guides/90-day-reporting/', '/blog/90-day-report-online-2026/'] },
  { kw: 'destination thailand visa|\\\\bdtv\\\\b', pages: ['/visas/dtv/', '/de/visas/dtv/', '/compare/dtv-vs-ltr/'] },
  { kw: 'retirement visa|non-o retirement', pages: ['/visas/retirement-non-o/', '/guides/retiring-in-thailand/'] },
  { kw: 'tm30', pages: ['/guides/tm30-reporting/'] },
  { kw: 'cost of living pattaya', pages: ['/guides/cost-of-living-pattaya/'] },
];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['.git', 'node_modules', 'functions'].includes(e.name) || e.name.startsWith('_')) continue;
      walk(p, acc);
    } else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

function pagePath(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  return rel === 'index.html' ? '/' : '/' + rel.replace('/index.html', '') + '/';
}

const pages = walk(ROOT);
const indexed = [];
const metaIssues = [];

for (const f of pages) {
  const h = fs.readFileSync(f, 'utf8');
  const p = pagePath(f);
  const robots = (h.match(/<meta name="robots" content="([^"]+)"/i) || [])[1] || '';
  if (/noindex/i.test(robots)) continue;
  indexed.push(p);
  const title = (h.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
  const desc = (h.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || '';
  if (title.length < 30 || title.length > 65) metaIssues.push({ p, kind: 'title', len: title.length });
  if (desc.length < 120 || desc.length > 165) metaIssues.push({ p, kind: 'desc', len: desc.length });
}

const coverage = TARGETS.map((t) => {
  const re = new RegExp(t.kw, 'i');
  const hits = t.pages.filter((p) => {
    const f = path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
    if (!fs.existsSync(f)) return false;
    const h = fs.readFileSync(f, 'utf8');
    return re.test(h);
  });
  return { keyword: t.kw, targetPages: t.pages, covered: hits, gap: t.pages.filter((x) => !hits.includes(x)) };
});

const report = {
  generated: new Date().toISOString(),
  indexed: indexed.length,
  metaIssues: metaIssues.length,
  metaSample: metaIssues.slice(0, 30),
  keywordCoverage: coverage,
  missingPages: coverage.flatMap((c) => c.gap),
};

fs.writeFileSync(path.join(ROOT, '_audit-seo-keywords.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ indexed: report.indexed, metaIssues: report.metaIssues, gaps: report.missingPages }, null, 2));
