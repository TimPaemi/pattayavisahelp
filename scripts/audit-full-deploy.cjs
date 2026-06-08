/**
 * Full pre/post-deploy audit gate.
 * Usage: node scripts/audit-full-deploy.cjs [--live]
 */
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const LIVE = process.argv.includes('--live');

const SCRIPTS = [
  'rebuild-sitemaps.cjs',
  'audit-comprehensive.cjs',
  'audit-content-quality.cjs',
  'audit-meta-indexed.cjs',
  'audit-seo-keywords.cjs',
  'audit-ux-shell.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-internal-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'audit-full-2026.cjs',
  'scan-ui-junk.cjs',
];

if (LIVE) SCRIPTS.push('audit-live-network.cjs');

function run(script) {
  const r = spawnSync('node', ['scripts/' + script], { cwd: ROOT, encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  return { script, ok: r.status === 0, status: r.status, tail: (r.stdout || r.stderr || '').trim().split('\n').slice(-6).join('\n') };
}

const runs = SCRIPTS.map(run);

function readJson(name) {
  const p = path.join(ROOT, name);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

const comp = readJson('_audit-comprehensive.json');
const cq = readJson('_audit-content-quality.json');
const meta = readJson('_audit-meta-indexed.json') || {};
const seo = readJson('_audit-seo-keywords.json') || {};
const internal = readJson('_audit-internal-links.json') || {};
const full = readJson('_audit-full-2026.json') || {};
const live = readJson('_audit-live-network.json') || null;

const checks = [
  { id: 'comprehensive', pass: comp?.verdict === 'PASS', detail: comp?.totals },
  { id: 'content-quality', pass: cq?.verdict === 'PASS', detail: cq?.totals },
  { id: 'meta-indexed', pass: (meta.metaCount ?? 0) === 0 && (meta.h1?.length ?? 0) === 0, detail: { metaCount: meta.metaCount } },
  { id: 'seo-keywords', pass: (seo.metaIssues ?? 0) === 0 && (seo.missingPages?.length ?? 0) === 0, detail: seo },
  { id: 'ux-shell', pass: runs.find((r) => r.script === 'audit-ux-shell.cjs')?.ok, detail: 'exit 0' },
  { id: 'ui-chrome', pass: runs.find((r) => r.script === 'audit-ui-chrome.cjs')?.ok, detail: 'exit 0' },
  { id: 'broken-links', pass: runs.find((r) => r.script === 'audit-broken-links.cjs')?.ok, detail: 'exit 0' },
  { id: 'weak-inbound', pass: runs.find((r) => r.script === 'audit-weak-inbound-indexed.cjs')?.ok, detail: 'exit 0' },
  {
    id: 'internal-orphans',
    pass: (internal.counts?.orphans ?? internal.orphans?.length ?? 99) <= 2,
    detail: { orphans: internal.orphans, unreachable: internal.counts?.unreachableFromHome },
  },
  { id: 'sitemap-count', pass: (full.totals?.sitemap ?? 0) >= 328, detail: full.totals },
];

if (LIVE && live) {
  checks.push({
    id: 'live-network',
    pass: live.verdict === 'PASS',
    detail: {
      verdict: live.verdict,
      sitemapOk: live.visahelp?.liveOk,
      sitemapFailed: live.visahelp?.liveFailed,
      sisterFailed: live.sisterSites?.failed?.length ?? 0,
    },
  });
}

const failCount = checks.filter((c) => !c.pass).length;
const scriptFails = runs.filter((r) => !r.ok);

const report = {
  generated: new Date().toISOString(),
  live,
  verdict: failCount === 0 && scriptFails.length === 0 ? 'PASS' : 'FAIL',
  failCount,
  scriptFails: scriptFails.map((r) => ({ script: r.script, status: r.status })),
  checks,
  runs: runs.map((r) => ({ script: r.script, ok: r.ok })),
};

fs.writeFileSync(path.join(ROOT, '_audit-full-deploy.json'), JSON.stringify(report, null, 2));

console.log('\n=== FULL DEPLOY AUDIT ===');
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'} ${c.id}`, JSON.stringify(c.detail));
if (scriptFails.length) console.log('Script exits:', scriptFails.map((r) => r.script).join(', '));
console.log('\nVERDICT:', report.verdict, `(${failCount} check fails, ${scriptFails.length} script fails)`);
process.exit(report.verdict === 'PASS' ? 0 : 1);
