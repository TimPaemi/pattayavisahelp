const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['/v2-preview/', '/tools/ltr-eligibility/', '/professions/digital-nomad/']);

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

function normHref(h, from) {
  if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('javascript:')) return null;
  if (h.includes("'+")) return null;
  if (/^https?:\/\//i.test(h)) {
    try {
      const u = new URL(h);
      if (u.hostname.replace(/^www\./, '') !== 'pattayavisahelp.com') return { external: h };
      h = u.pathname + (u.search || '');
    } catch {
      return null;
    }
  }
  if (!h.startsWith('/')) {
    const dir = path.dirname(from === '/' ? '/index.html' : from.slice(1) + 'index.html');
    h = path.posix.normalize(path.posix.join('/' + dir, h));
  }
  if (!h.endsWith('/') && !path.posix.extname(h)) h += '/';
  return { internal: h };
}

function meta(html, name, attr = 'name') {
  const re1 = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, 'i');
  return (html.match(re1) || html.match(re2) || [])[1];
}

function linkRel(html, rel) {
  const re1 = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]+href=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<link[^>]+href=["']([^"']*)["'][^>]+rel=["']${rel}["']`, 'i');
  return (html.match(re1) || html.match(re2) || [])[1];
}

const files = walk(ROOT);
const pages = new Map(files.map((f) => [pagePath(f), f]));
const inbound = new Map([...pages.keys()].map((p) => [p, 0]));
const outbound = new Map([...pages.keys()].map((p) => [p, new Set()]));
const externalByDomain = new Map();
const externalMissingRel = [];
const seoIssues = [];
const titles = new Map();
const descs = new Map();
const jsonLdTypes = new Map();
const anchorTexts = new Map();

for (const [p, f] of pages) {
  const html = fs.readFileSync(f, 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim();
  const desc = meta(html, 'description');
  const canon = linkRel(html, 'canonical');
  const robots = meta(html, 'robots') || 'index,follow';
  const ogTitle = meta(html, 'og:title', 'property');
  const ogDesc = meta(html, 'og:description', 'property');
  const ogImage = meta(html, 'og:image', 'property');
  const tw = meta(html, 'twitter:card');
  const h1s = [...html.matchAll(/<h1[^>]*>[\s\S]*?<\/h1>/gi)].length;
  const noindex = /noindex/i.test(robots);

  if (title) {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(p);
  }
  if (desc) {
    if (!descs.has(desc)) descs.set(desc, []);
    descs.get(desc).push(p);
  }

  const gaps = [];
  if (!title) gaps.push('missing title');
  if (!desc) gaps.push('missing description');
  if (!canon && !noindex) gaps.push('missing canonical');
  if (!ogTitle && !noindex) gaps.push('missing og:title');
  if (!ogDesc && !noindex) gaps.push('missing og:description');
  if (!ogImage && !noindex) gaps.push('missing og:image');
  if (!tw && !noindex) gaps.push('missing twitter:card');
  if (title && (title.length < 30 || title.length > 65)) gaps.push(`title length ${title.length}`);
  if (desc && (desc.length < 120 || desc.length > 165)) gaps.push(`desc length ${desc.length}`);
  if (h1s !== 1 && !noindex) gaps.push(`h1 count ${h1s}`);
  if (gaps.length) seoIssues.push({ page: p, gaps });

  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      const items = Array.isArray(j) ? j : j['@graph'] || [j];
      for (const item of items) {
        const t = item['@type'];
        if (t) jsonLdTypes.set(t, (jsonLdTypes.get(t) || 0) + 1);
      }
    } catch {}
  }

  for (const m of html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const tag = m[0];
    const h = m[1];
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    const n = normHref(h, p);
    if (!n) continue;
    if (n.external) {
      let dom;
      try {
        dom = new URL(n.external).hostname.replace(/^www\./, '');
      } catch {
        continue;
      }
      externalByDomain.set(dom, (externalByDomain.get(dom) || 0) + 1);
      if (/target=["']_blank["']/i.test(tag) && !/noopener/i.test(tag)) {
        externalMissingRel.push({ page: p, href: n.external });
      }
      continue;
    }
    outbound.get(p).add(n.internal);
    if (pages.has(n.internal)) {
      inbound.set(n.internal, (inbound.get(n.internal) || 0) + 1);
      const key = `${p} -> ${n.internal}`;
      if (!anchorTexts.has(key)) anchorTexts.set(key, new Set());
      if (text) anchorTexts.get(key).add(text);
    }
  }
}

const depth = new Map([['/', 0]]);
const q = ['/'];
while (q.length) {
  const cur = q.shift();
  for (const nxt of outbound.get(cur) || []) {
    if (!pages.has(nxt) || depth.has(nxt)) continue;
    depth.set(nxt, depth.get(cur) + 1);
    q.push(nxt);
  }
}

const orphans = [...pages.keys()].filter((p) => p !== '/' && (inbound.get(p) || 0) === 0);
const weak = [...pages.keys()].filter((p) => p !== '/' && inbound.get(p) === 1);
const deep = [...pages.keys()].filter((p) => (depth.get(p) || 99) > 3);
const unreachable = [...pages.keys()].filter((p) => !depth.has(p) && !SKIP.has(p));
const thinOut = [...pages.keys()].filter((p) => (outbound.get(p)?.size || 0) < 3 && !SKIP.has(p));
const hubs = [...pages.entries()]
  .map(([p, s]) => ({ page: p, out: s.size, in: inbound.get(p) || 0, depth: depth.get(p) ?? null }))
  .sort((a, b) => b.out - a.out)
  .slice(0, 20);

const dupTitles = [...titles.entries()].filter(([, ps]) => ps.length > 1).map(([t, ps]) => ({ title: t, pages: ps }));
const dupDescs = [...descs.entries()].filter(([, ps]) => ps.length > 1).map(([d, ps]) => ({ desc: d.slice(0, 100), pages: ps }));

const indexable = [...pages.keys()].filter((p) => !SKIP.has(p) && p !== '/v2-preview/');
const sitemapUrls = new Set(
  [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => {
      try {
        return new URL(m[1]).pathname;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
);

const report = {
  generated: new Date().toISOString().slice(0, 10),
  totals: { pages: pages.size, indexable: indexable.length, sitemap: sitemapUrls.size },
  internal: {
    orphans,
    weakInboundCount: weak.length,
    weakInbound: weak,
    deepCount: deep.length,
    deepPages: deep,
    unreachableCount: unreachable.length,
    unreachable,
    thinOutboundCount: thinOut.length,
    thinOutbound: thinOut,
    hubs,
    avgInbound: (+([...pages.keys()].reduce((a, p) => a + (inbound.get(p) || 0), 0) / pages.size).toFixed(1)),
    avgOutbound: (+([...pages.keys()].reduce((a, p) => a + (outbound.get(p)?.size || 0), 0) / pages.size).toFixed(1)),
    depthDistribution: Object.fromEntries(
      [0, 1, 2, 3, 4, 5].map((d) => [d, [...depth.values()].filter((v) => v === d).length])
    ),
  },
  external: {
    totalDomains: externalByDomain.size,
    topDomains: [...externalByDomain.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([domain, count]) => ({ domain, count })),
    missingRelCount: externalMissingRel.length,
    missingRelSample: externalMissingRel.slice(0, 30),
  },
  seo: {
    issueCount: seoIssues.length,
    issues: seoIssues,
    dupTitles,
    dupDescs,
    jsonLdTypes: [...jsonLdTypes.entries()].sort((a, b) => b[1] - a[1]).map(([type, count]) => ({ type, count })),
    titleTooLong: seoIssues.filter((i) => i.gaps.some((g) => g.startsWith('title length'))).length,
    descTooLong: seoIssues.filter((i) => i.gaps.some((g) => g.startsWith('desc length'))).length,
  },
  sitemap: {
    notInSitemap: indexable.filter((p) => !sitemapUrls.has(p)),
    inSitemapNotOnDisk: [...sitemapUrls].filter((p) => !pages.has(p)),
  },
};

fs.writeFileSync(path.join(ROOT, '_audit-full-2026.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  totals: report.totals,
  internal: {
    orphans: orphans.length,
    weak: weak.length,
    deep: deep.length,
    unreachable: unreachable.length,
    thinOut: thinOut.length,
  },
  external: { domains: externalByDomain.size, missingRel: externalMissingRel.length },
  seo: { issues: seoIssues.length, dupTitles: dupTitles.length, dupDescs: dupDescs.length },
  sitemap: report.sitemap,
}, null, 2));
