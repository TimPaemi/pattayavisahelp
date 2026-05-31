/**
 * Live network audit — HTTP checks for visahelp sitemap + sister sites.
 * Usage: node scripts/audit-live-network.cjs
 */
const fs = require('fs');
const path = require('path');
const network = require('./network-sites.cjs');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';
const CONCURRENCY = 15;
const TIMEOUT_MS = 20000;

async function fetchStatus(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'PattayaVisaHelp-Audit/1.0' },
    });
    clearTimeout(t);
    const text = await res.text();
    return {
      url,
      status: res.status,
      ok: res.ok,
      finalUrl: res.url,
      title: text.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || null,
      hasCanonical: /<link rel="canonical"/i.test(text),
      hasHreflang: /hreflang=/i.test(text),
      hasAnalytics: /analytics-events\.js|googletagmanager/i.test(text),
      bodyLen: text.length,
      error: null,
    };
  } catch (e) {
    clearTimeout(t);
    return { url, status: 0, ok: false, finalUrl: url, title: null, error: e.message };
  }
}

async function pool(items, fn, n) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return results;
}

function parseSitemapUrls() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function checkHreflangTriangle(html, pageUrl) {
  const issues = [];
  const en = html.match(/hreflang="en"[^>]+href="([^"]+)"/)?.[1];
  const de = html.match(/hreflang="de"[^>]+href="([^"]+)"/)?.[1];
  const ru = html.match(/hreflang="ru"[^>]+href="([^"]+)"/)?.[1];
  const xd = html.match(/hreflang="x-default"[^>]+href="([^"]+)"/)?.[1];
  if (!en) issues.push('missing hreflang en');
  if (pageUrl.includes('/de/') && de && !de.includes('/de/')) issues.push('de hreflang not locale-specific');
  if (pageUrl.includes('/ru/') && ru && !ru.includes('/ru/')) issues.push('ru hreflang not locale-specific');
  if (!xd) issues.push('missing x-default');
  return issues;
}

(async () => {
  const sitemapUrls = parseSitemapUrls();
  const critical = [
    `${BASE}/`,
    `${BASE}/visas/dtv/`,
    `${BASE}/de/visas/dtv/`,
    `${BASE}/ru/visas/dtv/`,
    `${BASE}/de/sitemap/`,
    `${BASE}/blog/visa-agent-red-flags-2026/`,
    `${BASE}/tools/visa-finder/`,
    `${BASE}/de/tools/visa-finder/`,
    `${BASE}/sitemap.xml`,
    `${BASE}/feed.xml`,
  ];
  const sisterUrls = [
    network.visaHelp.url,
    ...network.sites.map((s) => s.url),
  ];

  console.log(`Checking ${sitemapUrls.length} sitemap URLs...`);
  const sitemapResults = await pool(sitemapUrls, fetchStatus, CONCURRENCY);
  const failed = sitemapResults.filter((r) => !r.ok);
  const redirects = sitemapResults.filter((r) => r.ok && r.finalUrl.replace(/\/$/, '') !== r.url.replace(/\/$/, ''));
  const thin = sitemapResults.filter((r) => r.ok && r.bodyLen < 500);
  const noTitle = sitemapResults.filter((r) => r.ok && !r.title);

  console.log(`Checking ${critical.length} critical URLs...`);
  const criticalResults = await pool([...new Set(critical)], fetchStatus, 5);

  console.log(`Checking ${sisterUrls.length} sister sites...`);
  const sisterResults = await pool(sisterUrls, fetchStatus, 5);
  const sisterFailed = sisterResults.filter((r) => !r.ok);

  const hreflangSample = sitemapResults
    .filter((r) => r.ok && (r.url.includes('/de/') || r.url.includes('/ru/') || r.url.includes('/visas/')))
    .slice(0, 40);
  const hreflangIssues = [];
  for (const r of hreflangSample) {
    const ctrl = new AbortController();
    const res = await fetch(r.url, { signal: ctrl.signal });
    const html = await res.text();
    const issues = checkHreflangTriangle(html, r.url);
    if (issues.length) hreflangIssues.push({ url: r.url, issues });
  }

  let localReport = {};
  try {
    localReport = JSON.parse(fs.readFileSync(path.join(ROOT, '_audit-full-2026.json'), 'utf8'));
  } catch {
    /* run audit-full-2026.cjs separately */
  }

  const report = {
    generated: new Date().toISOString(),
    visahelp: {
      sitemapTotal: sitemapUrls.length,
      liveOk: sitemapResults.filter((r) => r.ok).length,
      liveFailed: failed.length,
      failed: failed.slice(0, 50).map((r) => ({ url: r.url, status: r.status, error: r.error })),
      redirectCount: redirects.length,
      redirectSample: redirects.slice(0, 10).map((r) => ({ from: r.url, to: r.finalUrl })),
      thinPages: thin.length,
      thinSample: thin.slice(0, 10).map((r) => ({ url: r.url, bytes: r.bodyLen })),
      noTitle: noTitle.slice(0, 20).map((r) => r.url),
      critical: criticalResults.map((r) => ({
        url: r.url,
        status: r.status,
        ok: r.ok,
        title: r.title?.slice(0, 60),
      })),
      hreflangIssues: hreflangIssues.slice(0, 30),
    },
    sisterSites: {
      total: sisterUrls.length,
      ok: sisterResults.filter((r) => r.ok).length,
      failed: sisterFailed.map((r) => ({ url: r.url, status: r.status, error: r.error })),
      details: sisterResults.map((r) => ({
        url: r.url,
        status: r.status,
        ok: r.ok,
        title: r.title?.slice(0, 50),
        hasAnalytics: r.hasAnalytics,
      })),
    },
    local: localReport.totals || null,
    localSeoIssues: localReport.seo?.issueCount || null,
    localSitemapGaps: localReport.sitemap || null,
    verdict:
      failed.length === 0 && sisterFailed.length === 0
        ? 'PASS'
        : failed.length > 0 || sisterFailed.length > 2
          ? 'FAIL'
          : 'WARN',
  };

  fs.writeFileSync(path.join(ROOT, '_audit-live-network.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    verdict: report.verdict,
    sitemap: { total: report.visahelp.sitemapTotal, ok: report.visahelp.liveOk, failed: report.visahelp.liveFailed },
    sisterFailed: report.sisterSites.failed,
    hreflangIssues: report.visahelp.hreflangIssues.length,
    critical: report.visahelp.critical,
  }, null, 2));
})();
