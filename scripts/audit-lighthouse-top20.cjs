/**
 * Lighthouse performance pass on top 20 live URLs.
 * Usage: node scripts/audit-lighthouse-top20.cjs
 * Output: _audit-lighthouse-top20.json (gitignored)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';
const OUT_DIR = path.join(ROOT, '_lighthouse-reports');
const SUMMARY_PATH = path.join(ROOT, '_audit-lighthouse-top20.json');

const TOP20 = [
  '/',
  '/visas/dtv/',
  '/visas/ltr/',
  '/visas/retirement-non-o/',
  '/visas/',
  '/tools/visa-finder/',
  '/guides/90-day-reporting/',
  '/guides/cost-of-living-pattaya/',
  '/guides/jomtien-immigration-office/',
  '/compare/dtv-vs-ltr/',
  '/pattaya/',
  '/pattaya/jomtien/',
  '/pattaya/usa-to-thailand/',
  '/faq/',
  '/contact/',
  '/blog/tdac-step-by-step/',
  '/best-visa/',
  '/guides/thai-bank-account-as-foreigner/',
  '/visas/privilege-elite/',
  '/tools/cost-calculator/',
];

function slug(p) {
  return p === '/' ? 'home' : p.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '__');
}

function runOne(url, outFile) {
  execSync(
    `npx --yes lighthouse "${url}" --quiet --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="${outFile}"`,
    { cwd: ROOT, stdio: 'pipe', timeout: 180000, env: { ...process.env, CI: 'true' } }
  );
  return JSON.parse(fs.readFileSync(outFile, 'utf8'));
}

function score(cat) {
  return cat?.score != null ? Math.round(cat.score * 100) : null;
}

function pickMetrics(audits) {
  const g = (id) => audits[id]?.displayValue || audits[id]?.numericValue;
  return {
    fcp: g('first-contentful-paint'),
    lcp: g('largest-contentful-paint'),
    tbt: g('total-blocking-time'),
    cls: g('cumulative-layout-shift'),
    si: g('speed-index'),
  };
}

function topOpportunities(audits, n = 5) {
  return Object.values(audits)
    .filter((a) => a.details?.type === 'opportunity' && a.score != null && a.score < 1)
    .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
    .slice(0, n)
    .map((a) => ({ id: a.id, title: a.title, savings: a.displayValue || a.description?.slice(0, 80) }));
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const results = [];
const failures = [];

for (const p of TOP20) {
  const url = BASE + p;
  const outFile = path.join(OUT_DIR, `${slug(p)}.json`);
  process.stdout.write(`Lighthouse: ${url} ... `);
  try {
    const report = runOne(url, outFile);
    const cats = report.categories;
    const row = {
      path: p,
      url,
      performance: score(cats.performance),
      accessibility: score(cats.accessibility),
      bestPractices: score(cats['best-practices']),
      seo: score(cats.seo),
      metrics: pickMetrics(report.audits),
      opportunities: topOpportunities(report.audits, 4),
    };
    results.push(row);
    console.log(`perf ${row.performance} a11y ${row.accessibility} seo ${row.seo}`);
  } catch (e) {
    failures.push({ path: p, url, error: String(e.message || e).slice(0, 200) });
    console.log('FAIL');
  }
}

const perfScores = results.map((r) => r.performance).filter((s) => s != null);
const summary = {
  generated: new Date().toISOString(),
  base: BASE,
  count: results.length,
  failures,
  averages: {
    performance: perfScores.length ? Math.round(perfScores.reduce((a, b) => a + b, 0) / perfScores.length) : null,
    accessibility: Math.round(results.reduce((a, r) => a + (r.accessibility || 0), 0) / results.length),
    seo: Math.round(results.reduce((a, r) => a + (r.seo || 0), 0) / results.length),
  },
  worstPerformance: [...results].sort((a, b) => (a.performance || 0) - (b.performance || 0)).slice(0, 5),
  bestPerformance: [...results].sort((a, b) => (b.performance || 0) - (a.performance || 0)).slice(0, 5),
  commonOpportunities: aggregateOpportunities(results),
  results,
};

function aggregateOpportunities(rows) {
  const map = new Map();
  for (const r of rows) {
    for (const o of r.opportunities || []) {
      map.set(o.id, (map.get(o.id) || 0) + 1);
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, count]) => ({ id, count }));
}

fs.writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2));
console.log('\n' + JSON.stringify({
  averages: summary.averages,
  worst: summary.worstPerformance.map((r) => ({ path: r.path, performance: r.performance, lcp: r.metrics.lcp })),
  commonOpportunities: summary.commonOpportunities,
  failures: summary.failures.length,
}, null, 2));
