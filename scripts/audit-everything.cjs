/**
 * Full audit: mobile shell, desktop shell, SEO, keywords, metadata, links, content.
 * Usage: node scripts/audit-everything.cjs [--live]
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const LIVE = process.argv.includes('--live');

const RUNS = [
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
if (LIVE) RUNS.push('audit-live-network.cjs');

function run(script) {
  const r = spawnSync('node', ['scripts/' + script], { cwd: ROOT, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  return { script, ok: r.status === 0, status: r.status };
}

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

function parseSitemap() {
  const urls = new Set();
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  for (const m of xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)) urls.add(m[1] || '/');
  return urls;
}

function meta(html, name, attr = 'name') {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, 'i');
  return (html.match(re) || html.match(re2) || [])[1] || '';
}

function linkRel(html, rel) {
  const re = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]+href=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<link[^>]+href=["']([^"']*)["'][^>]+rel=["']${rel}["']`, 'i');
  return (html.match(re) || html.match(re2) || [])[1];
}

const sitemap = parseSitemap();
const smText = fs.readFileSync(path.join(__dirname, 'rebuild-sitemaps.cjs'), 'utf8');
const pilots = new Set(JSON.parse(smText.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]));

const mobile = { missingViewport: [], missingMnav: [], missingTapCss: [], missingUxCss: [], missingCookie: [] };
const desktop = { pilotsMissingNav: [], missingSectionJump: [], missingOgImage: [] };
const seoIndexed = { missingCanonical: [], missingHreflang: [], missingSchema: [], missingGtag: [], titleIssues: [], descIssues: [], h1Issues: [] };
const keywords = { pages: {} };

const KEYWORD_CHECKS = [
  { page: '/guides/thailand-digital-arrival-card/', terms: ['tdac', 'digital arrival card', '72 hour'] },
  { page: '/guides/non-o-extension-pattaya/', terms: ['non-o', 'extension', 'jomtien'] },
  { page: '/visas/dtv/', terms: ['destination thailand visa', 'dtv', '500,000'] },
  { page: '/visas/retirement-non-o/', terms: ['retirement', 'non-o', '800,000'] },
  { page: '/guides/jomtien-immigration-office/', terms: ['jomtien', 'immigration', 'pattaya'] },
  { page: '/guides/90-day-reporting/', terms: ['90-day', 'tm47', 'report'] },
  { page: '/guides/tm30-reporting/', terms: ['tm30', '24 hour', 'landlord'] },
  { page: '/guides/cost-of-living-pattaya/', terms: ['cost of living', 'pattaya', 'baht'] },
  { page: '/de/guides/driving-licence-thailand/', terms: ['führerschein', 'pattaya', 'thailand'] },
  { page: '/de/visas/dtv/', terms: ['dtv', 'destination thailand', 'visum'] },
];

for (const f of walk(ROOT)) {
  const p = pagePath(f);
  const html = fs.readFileSync(f, 'utf8');
  const robots = meta(html, 'robots') || 'index,follow';
  const noindex = /noindex/i.test(robots);
  const inSitemap = sitemap.has(p);
  const isPilot = pilots.has(p);

  if (inSitemap) {
    if (!html.includes('width=device-width')) mobile.missingViewport.push(p);
    if (!html.includes('__mnavLoaded') && !html.includes('assets/mnav.js') && !html.includes('class="mnav"'))
      mobile.missingMnav.push(p);
    if (!html.includes('TAP-TARGET') && !html.includes('ux-enhancements.css')) mobile.missingTapCss.push(p);
    if (!html.includes('ux-enhancements.css') && !html.includes('ux-enhancements.js')) mobile.missingUxCss.push(p);
    if (!html.includes('pvh-cookie') && !html.includes('cookie-consent')) mobile.missingCookie.push(p);

    if (isPilot && !html.includes('class="nav"')) desktop.pilotsMissingNav.push(p);
    if (!html.includes('section-jump') && !html.includes('pvh-section-jump') && (p.startsWith('/guides/') || p.startsWith('/de/guides/') || p.startsWith('/ru/guides/')))
      desktop.missingSectionJump.push(p);
    if (!meta(html, 'og:image', 'property')) desktop.missingOgImage.push(p);

    const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim() || '';
    const desc = meta(html, 'description');
    const h1s = [...html.matchAll(/<h1[^>]*>[\s\S]*?<\/h1>/gi)].length;
    if (!linkRel(html, 'canonical')) seoIndexed.missingCanonical.push(p);
    if ((p.startsWith('/de/') || p.startsWith('/ru/') || (!p.startsWith('/de/') && !p.startsWith('/ru/'))) && !html.includes('hreflang='))
      seoIndexed.missingHreflang.push(p);
    if (!html.includes('application/ld+json')) seoIndexed.missingSchema.push(p);
    if (!p.startsWith('/de/') && !p.startsWith('/ru/') && !html.includes('G-RSNN24M25C') && !html.includes('googletagmanager'))
      seoIndexed.missingGtag.push(p);
    if (title.length < 30 || title.length > 65) seoIndexed.titleIssues.push({ p, len: title.length });
    if (desc.length < 120 || desc.length > 165) seoIndexed.descIssues.push({ p, len: desc.length });
    if (h1s !== 1) seoIndexed.h1Issues.push({ p, count: h1s });
  }
}

for (const k of KEYWORD_CHECKS) {
  const f = path.join(ROOT, k.page.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  if (!fs.existsSync(f)) {
    keywords.pages[k.page] = { missing: ['FILE_NOT_FOUND'] };
    continue;
  }
  const text = fs.readFileSync(f, 'utf8').replace(/<[^>]+>/g, ' ').toLowerCase();
  const missing = k.terms.filter((t) => !text.includes(t.toLowerCase()));
  keywords.pages[k.page] = { terms: k.terms, missing, pass: missing.length === 0 };
}

const runs = RUNS.map(run);

function readJson(name) {
  const p = path.join(ROOT, name);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

const comp = readJson('_audit-comprehensive.json');
const cq = readJson('_audit-content-quality.json');
const metaIdx = readJson('_audit-meta-indexed.json') || {};
const seoKw = readJson('_audit-seo-keywords.json') || {};
const internal = readJson('_audit-internal-links.json') || {};
const full = readJson('_audit-full-2026.json') || {};
const live = readJson('_audit-live-network.json');

const sections = {
  mobile: {
    pass: mobile.missingViewport.length === 0 && mobile.missingMnav.length === 0 && mobile.pilotsMissingNav === undefined,
    indexedMissingViewport: mobile.missingViewport.length,
    indexedMissingMnav: mobile.missingMnav.length,
    indexedMissingUxEnhancements: mobile.missingUxCss.length,
    indexedMissingCookieConsent: mobile.missingCookie.length,
    samples: {
      viewport: mobile.missingViewport.slice(0, 5),
      mnav: mobile.missingMnav.slice(0, 5),
    },
  },
  desktop: {
    pass: desktop.pilotsMissingNav.length === 0 && desktop.missingOgImage.length === 0,
    pilotsMissingNav: desktop.pilotsMissingNav.length,
    guidesMissingSectionJump: desktop.missingSectionJump.length,
    missingOgImage: desktop.missingOgImage.length,
    samples: {
      nav: desktop.pilotsMissingNav.slice(0, 5),
      sectionJump: desktop.missingSectionJump.slice(0, 8),
    },
  },
  metadata: {
    pass: (metaIdx.metaCount ?? 0) === 0 && seoIndexed.titleIssues.length === 0 && seoIndexed.descIssues.length === 0,
    metaIndexedIssues: metaIdx.metaCount ?? 0,
    titleIssues: seoIndexed.titleIssues.length,
    descIssues: seoIndexed.descIssues.length,
    h1Issues: seoIndexed.h1Issues.length,
    missingCanonical: seoIndexed.missingCanonical.length,
    missingHreflang: seoIndexed.missingHreflang.length,
    missingSchema: seoIndexed.missingSchema.length,
    missingGtag: seoIndexed.missingGtag.length,
    samples: {
      title: seoIndexed.titleIssues.slice(0, 5),
      desc: seoIndexed.descIssues.slice(0, 5),
      hreflang: seoIndexed.missingHreflang.slice(0, 5),
    },
  },
  keywords: {
    pass: Object.values(keywords.pages).every((v) => v.pass !== false),
    targets: keywords.pages,
    seoKeywordGaps: seoKw.missingPages || [],
  },
  content: {
    pass: comp?.verdict === 'PASS' && cq?.verdict === 'PASS',
    comprehensive: comp?.totals,
    contentQuality: cq?.totals,
  },
  links: {
    pass: runs.find((r) => r.script === 'audit-broken-links.cjs')?.ok,
    orphans: internal.counts?.orphans ?? internal.orphans?.length,
    orphanList: internal.orphans,
  },
  uiChrome: {
    pass: runs.find((r) => r.script === 'audit-ui-chrome.cjs')?.ok,
  },
  uxShell: {
    pass: runs.find((r) => r.script === 'audit-ux-shell.cjs')?.ok,
  },
  seoFull: {
    indexedMetaPass: (metaIdx.metaCount ?? 0) === 0,
    allPagesSeoIssues: full.seo?.issueCount ?? 0,
    dupTitles: full.seo?.dupTitles?.length ?? 0,
    dupDescs: full.seo?.dupDescs?.length ?? 0,
    sitemapGaps: full.sitemap,
  },
  live: live ? { verdict: live.verdict, sitemapOk: live.visahelp?.liveOk, failed: live.visahelp?.liveFailed } : null,
};

sections.mobile.pass =
  mobile.missingViewport.length === 0 &&
  mobile.missingMnav.length === 0 &&
  mobile.missingUxCss.length === 0;

const failSections = Object.entries(sections).filter(([, v]) => v && v.pass === false).map(([k]) => k);
const scriptFails = runs.filter((r) => !r.ok).map((r) => r.script);

const report = {
  generated: new Date().toISOString(),
  live: LIVE,
  verdict: failSections.length === 0 && scriptFails.length === 0 ? 'PASS' : 'FAIL',
  failSections,
  scriptFails,
  totals: { pages: comp?.totals?.pages, indexed: comp?.totals?.indexed, sitemap: comp?.totals?.sitemap },
  sections,
  runs: runs.map((r) => ({ script: r.script, ok: r.ok })),
};

fs.writeFileSync(path.join(ROOT, '_audit-everything.json'), JSON.stringify(report, null, 2));

console.log('\n========== FULL AUDIT: MOBILE · DESKTOP · SEO · KEYWORDS · METADATA ==========\n');
console.log('VERDICT:', report.verdict);
console.log('Pages:', report.totals.pages, '| Indexed:', report.totals.indexed, '| Sitemap:', report.totals.sitemap);
console.log('\n--- MOBILE (indexed) ---');
console.log('  viewport:', mobile.missingViewport.length === 0 ? 'PASS' : `FAIL (${mobile.missingViewport.length})`);
console.log('  mnav:', mobile.missingMnav.length === 0 ? 'PASS' : `FAIL (${mobile.missingMnav.length})`);
console.log('  ux-enhancements:', mobile.missingUxCss.length === 0 ? 'PASS' : `FAIL (${mobile.missingUxCss.length})`);
console.log('  cookie consent:', mobile.missingCookie.length === 0 ? 'PASS' : `WARN (${mobile.missingCookie.length})`);
console.log('\n--- DESKTOP (indexed) ---');
console.log('  pilot .nav:', desktop.pilotsMissingNav.length === 0 ? 'PASS' : `FAIL (${desktop.pilotsMissingNav.length})`);
console.log('  guide section-jump:', desktop.missingSectionJump.length, '(guides without jump nav)');
console.log('  og:image:', desktop.missingOgImage.length === 0 ? 'PASS' : `FAIL (${desktop.missingOgImage.length})`);
console.log('\n--- METADATA (sitemap) ---');
console.log('  audit-meta-indexed:', (metaIdx.metaCount ?? 0) === 0 ? 'PASS' : `FAIL (${metaIdx.metaCount})`);
console.log('  title length:', seoIndexed.titleIssues.length === 0 ? 'PASS' : `FAIL (${seoIndexed.titleIssues.length})`);
console.log('  desc length:', seoIndexed.descIssues.length === 0 ? 'PASS' : `FAIL (${seoIndexed.descIssues.length})`);
console.log('  h1 count:', seoIndexed.h1Issues.length === 0 ? 'PASS' : `FAIL (${seoIndexed.h1Issues.length})`);
console.log('  canonical:', seoIndexed.missingCanonical.length === 0 ? 'PASS' : `FAIL (${seoIndexed.missingCanonical.length})`);
console.log('  hreflang:', seoIndexed.missingHreflang.length === 0 ? 'PASS' : `FAIL (${seoIndexed.missingHreflang.length})`);
console.log('  json-ld:', seoIndexed.missingSchema.length === 0 ? 'PASS' : `FAIL (${seoIndexed.missingSchema.length})`);
console.log('  GA (EN):', seoIndexed.missingGtag.length === 0 ? 'PASS' : `FAIL (${seoIndexed.missingGtag.length})`);
console.log('\n--- KEYWORDS (money pages) ---');
for (const [page, v] of Object.entries(keywords.pages)) {
  console.log(`  ${v.pass ? 'PASS' : 'FAIL'} ${page}`, v.missing?.length ? `missing: ${v.missing.join(', ')}` : '');
}
console.log('\n--- CONTENT · LINKS · UI ---');
console.log('  comprehensive:', comp?.verdict);
console.log('  content-quality:', cq?.verdict);
console.log('  broken-links:', runs.find((r) => r.script === 'audit-broken-links.cjs')?.ok ? 'PASS' : 'FAIL');
console.log('  ui-chrome:', runs.find((r) => r.script === 'audit-ui-chrome.cjs')?.ok ? 'PASS' : 'FAIL');
console.log('  ux-shell:', runs.find((r) => r.script === 'audit-ux-shell.cjs')?.ok ? 'PASS' : 'FAIL');
console.log('  orphans:', internal.orphans?.join(', ') || 'none');
if (live) console.log('\n--- LIVE ---', live.verdict, `${live.visahelp?.liveOk}/${live.visahelp?.sitemapTotal}`);
if (failSections.length) console.log('\nFailed sections:', failSections.join(', '));
if (scriptFails.length) console.log('Script failures:', scriptFails.join(', '));

process.exit(report.verdict === 'PASS' ? 0 : 1);
