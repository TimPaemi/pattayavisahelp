/**
 * Full site audit — no truncation. Writes _audit-comprehensive.json
 * Usage: node scripts/audit-comprehensive.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['/v2-preview/', '/tools/ltr-eligibility/', '/professions/digital-nomad/']);
const LOCALE_HUBS = new Set([
  '/de/',
  '/ru/',
  '/de/guides/',
  '/ru/guides/',
  '/de/visas/',
  '/ru/visas/',
  '/de/compare/',
  '/ru/compare/',
]);
const MIN = { index: 400, blog: 500, article: 600, localeGuide: 220, localeHub: 280, localePilot: 400 };

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'functions' || e.name === '.git' || e.name === 'node_modules') continue;
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

function wordCount(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const text = main.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(Boolean).length;
}

function minWords(p) {
  const isLocale = p.startsWith('/de/') || p.startsWith('/ru/');
  if (p.startsWith('/blog/')) return MIN.blog;
  if (/\/(guides|visas|compare)\//.test(p)) {
    if (isLocale) {
      if (LOCALE_HUBS.has(p)) return MIN.localeHub;
      if (/^\/(de|ru)\/guides\/[^/]+\/$/.test(p)) return MIN.localeGuide;
      return MIN.localePilot;
    }
    return MIN.article;
  }
  if (isLocale && LOCALE_HUBS.has(p)) return MIN.localeHub;
  if (isLocale) return MIN.localePilot;
  return MIN.index;
}

function section(p) {
  const parts = p.split('/').filter(Boolean);
  return parts[0] || 'root';
}

function parseSitemap() {
  const urls = new Set();
  for (const file of ['sitemap.xml', ...fs.readdirSync(ROOT).filter((f) => f.startsWith('sitemap-') && f.endsWith('.xml'))]) {
    const fp = path.join(ROOT, file);
    if (!fs.existsSync(fp)) continue;
    const xml = fs.readFileSync(fp, 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      try {
        urls.add(new URL(m[1]).pathname);
      } catch {}
    }
  }
  return urls;
}

const sitemap = parseSitemap();
const pages = walk(ROOT).map((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const p = pagePath(file);
  const robotsAll = [...html.matchAll(/<meta name="robots" content="([^"]+)"/gi)].map((m) => m[1]);
  const robots = robotsAll[0] || 'index,follow';
  const noindex = robotsAll.some((r) => /noindex/i.test(r));
  const words = wordCount(html);
  const isLocale = p.startsWith('/de/') || p.startsWith('/ru/');
  const isLocaleHub = LOCALE_HUBS.has(p);
  const isBlog = p.startsWith('/blog/');
  const isStub = /<main[^>]*>[\s\S]*?(Vollständiger Leitfaden \(EN\)|Полный гид \(EN\)|Полное сравнение \(EN\)|Открыть инструмент \(EN\))/i.test(html);
  const need = minWords(p);
  const thin = !noindex && words < need;
  const inSitemap = sitemap.has(p);
  const design = {
    hasNav: /class="nav"/.test(html),
    hasMq: /class="mq"/.test(html),
    hasFooter: /f-disclaim|class="f-grid"/.test(html),
    hasOg: /<meta property="og:title"/.test(html),
  };
  const issues = [];
  if (dupRobots(robotsAll)) issues.push('duplicate robots meta');
  if (noindex && inSitemap) issues.push('noindex but in sitemap');
  if (!noindex && !inSitemap && !SKIP.has(p) && p !== '/404.html') issues.push('indexed but not in sitemap');
  if (isStub && !noindex) issues.push('locale stub indexed');
  if (thin) issues.push(`thin (${words}w, need ${need})`);
  if (!noindex && !isLocale && !design.hasNav && !isBlog) issues.push('missing nav');
  if (!noindex && !isLocale && !design.hasFooter) issues.push('missing footer');
  return { p, words, need, noindex, isLocale, isLocaleHub, isBlog, isStub, thin, inSitemap, robotsAll, design, issues, section: section(p) };
});

function dupRobots(arr) {
  return arr.length > 1;
}

const indexed = pages.filter((p) => !p.noindex);
const failIndexed = indexed.filter((p) => p.thin || p.isStub || p.issues.some((i) => i.includes('duplicate') || i.includes('missing nav') || i.includes('missing footer')));
const blogs = pages.filter((p) => p.isBlog);
const localeStubs = pages.filter((p) => p.isStub);
const dupRobotsPages = pages.filter((p) => dupRobots(p.robotsAll));
const sitemapNoindex = pages.filter((p) => p.inSitemap && p.noindex);
const indexedNotSitemap = indexed.filter((p) => !p.inSitemap && !SKIP.has(p.p));

const bySection = {};
for (const p of failIndexed) {
  if (!bySection[p.section]) bySection[p.section] = [];
  bySection[p.section].push({ path: p.p, words: p.words, need: p.need, fails: p.issues.filter((i) => !i.startsWith('indexed but')) });
}

const passIndexed = indexed.filter((p) => !failIndexed.includes(p));

const passBySection = {};
for (const p of passIndexed) {
  if (!passBySection[p.section]) passBySection[p.section] = [];
  passBySection[p.section].push({ path: p.p, words: p.words });
}

const report = {
  generated: new Date().toISOString(),
  verdict: failIndexed.length === 0 && sitemapNoindex.length === 0 && dupRobotsPages.filter((p) => !p.noindex).length === 0 ? 'PASS' : 'FAIL',
  totals: {
    pages: pages.length,
    indexed: indexed.length,
    sitemap: sitemap.size,
    passIndexed: passIndexed.length,
    failIndexed: failIndexed.length,
    localeStubs: localeStubs.length,
    localeStubsNoindex: localeStubs.filter((p) => p.noindex).length,
    dupRobotsPages: dupRobotsPages.length,
    sitemapNoindex: sitemapNoindex.length,
    indexedNotSitemap: indexedNotSitemap.length,
  },
  blogs: {
    total: blogs.length,
    pass: blogs.filter((b) => !b.thin && !b.noindex).length,
    thin: blogs.filter((b) => b.thin).length,
    noindex: blogs.filter((b) => b.noindex).length,
    detail: blogs.map((b) => ({ path: b.p, words: b.words, noindex: b.noindex, pass: !b.thin && !b.noindex })),
  },
  failIndexedBySection: Object.fromEntries(
    Object.entries(bySection)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([k, v]) => [k, { count: v.length, pages: v.sort((a, b) => a.words - b.words) }])
  ),
  failIndexedFull: failIndexed.map((p) => ({ path: p.p, words: p.words, need: p.need, issues: p.issues })),
  dupRobotsPages: dupRobotsPages.map((p) => ({ path: p.p, noindex: p.noindex, tags: p.robotsAll })),
  sitemapNoindex: sitemapNoindex.map((p) => p.p),
  indexedNotSitemap: indexedNotSitemap.map((p) => ({ path: p.p, words: p.words })),
  passIndexedBySection: Object.fromEntries(
    Object.entries(passBySection)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([k, v]) => [k, { count: v.length, avgWords: Math.round(v.reduce((a, x) => a + x.words, 0) / v.length), pages: v.sort((a, b) => b.words - a.words) }])
  ),
  passIndexedSample: passIndexed.slice(0, 15).map((p) => ({ path: p.p, words: p.words })),
};

fs.writeFileSync(path.join(ROOT, '_audit-comprehensive.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ verdict: report.verdict, totals: report.totals, blogs: report.blogs, sections: Object.fromEntries(Object.entries(report.failIndexedBySection).map(([k, v]) => [k, v.count])) }, null, 2));
