/**
 * Sprint 36 — Lighthouse spot-check on perf outlier pages (post-S34 defer).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';
const OUT = path.join(ROOT, '_audit-lighthouse-sprint36.json');

const URLS = [
  '/guides/jomtien-immigration-office/',
  '/compare/dtv-vs-ltr/',
  '/compare/visa-comparison-matrix/',
];

function runOne(url) {
  const tmp = path.join(ROOT, '_lighthouse-reports', `s36-${url.replace(/\//g, '_')}.json`);
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  try {
    execSync(
      `npx --yes lighthouse "${BASE}${url}" --quiet --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance --output=json --output-path="${tmp}"`,
      { cwd: ROOT, stdio: 'pipe', timeout: 240000, env: { ...process.env, CI: 'true' } }
    );
    const j = JSON.parse(fs.readFileSync(tmp, 'utf8'));
    const perf = j.categories?.performance?.score;
    const m = j.audits?.['total-blocking-time']?.displayValue;
    const lcp = j.audits?.['largest-contentful-paint']?.displayValue;
    return { url, ok: true, performance: perf != null ? Math.round(perf * 100) : null, tbt: m, lcp };
  } catch (e) {
    return { url, ok: false, error: String(e.message || e).slice(0, 120) };
  }
}

const results = URLS.map(runOne);
const ok = results.filter((r) => r.ok);
const avg = ok.length ? Math.round(ok.reduce((s, r) => s + r.performance, 0) / ok.length) : null;
const out = { generated: new Date().toISOString(), results, avgPerformance: avg };
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
