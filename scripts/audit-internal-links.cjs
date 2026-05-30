const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const SKIP_DIRS = new Set(["node_modules", ".git", ".cursor"]);
function walkIndexHtml(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walkIndexHtml(path.join(dir, ent.name), acc);
    } else if (ent.name === "index.html") acc.push(path.join(dir, ent.name));
  }
  return acc;
}
function fileToUrl(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  return "/" + path.dirname(rel) + "/";
}
const ASSET_EXT = /\.(svg|png|jpe?g|gif|webp|ico|css|js|json|xml|webmanifest|pdf|woff2?|ttf)$/i;
function isLikelyPagePath(hrefPath) {
  if (!hrefPath || hrefPath === "/") return true;
  if (ASSET_EXT.test(hrefPath)) return false;
  if (hrefPath.startsWith("/api/")) return false;
  if (/^\/favicon|^\/apple-touch|^\/og-|^\/feed\./.test(hrefPath)) return false;
  const base = hrefPath.split("/").pop() || "";
  if (base.includes(".") && !base.endsWith(".html") && !hrefPath.endsWith("/")) return false;
  return true;
}
function normalizeHref(raw) {
  if (!raw || typeof raw !== "string") return null;
  let h = raw.trim();
  if (!h.startsWith("/") || h.startsWith("//")) return null;
  const hash = h.indexOf("#");
  if (hash >= 0) h = h.slice(0, hash);
  const q = h.indexOf("?");
  if (q >= 0) h = h.slice(0, q);
  if (h === "") return "/";
  if (h !== "/" && !h.endsWith("/") && !/\.[a-z0-9]+$/i.test(h)) h += "/";
  return h;
}
function hrefToPageUrl(hrefPath, pageUrlSet) {
  const n = normalizeHref(hrefPath);
  if (!n || !isLikelyPagePath(n)) return null;
  if (pageUrlSet.has(n)) return n;
  if (n.endsWith("/index.html")) {
    const alt = n.replace(/\/index\.html$/, "/") || "/";
    if (pageUrlSet.has(alt)) return alt;
  }
  if (n.endsWith(".html")) {
    const alt = n.replace(/\.html$/, "/");
    if (pageUrlSet.has(alt)) return alt;
  }
  return null;
}
function extractAnchorLinks(html) {
  const out = [];
  const re = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1] ?? m[2];
    let text = (m[3] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text.length > 200) text = text.slice(0, 200) + "...";
    out.push({ href, text });
  }
  return out;
}
function extractAllRootHrefs(html) {
  const out = [];
  const re = /\bhref\s*=\s*["'](\/[^"'#?]*)["']/gi;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}
const files = walkIndexHtml(ROOT);
const pageUrls = files.map(fileToUrl);
const pageUrlSet = new Set(pageUrls);
const outbound = new Map(pageUrls.map((u) => [u, new Set()]));
const inbound = new Map(pageUrls.map((u) => [u, new Set()]));
const allRootHrefsByPage = new Map();
const urlPatternIssues = [];
const inboundAnchorsTo = new Map(pageUrls.map((u) => [u, []]));
const outboundAnchorsFromPillar = new Map();
for (const file of files) {
  const from = fileToUrl(file);
  const html = fs.readFileSync(file, "utf8");
  allRootHrefsByPage.set(from, extractAllRootHrefs(html));
  const isPillar = from.startsWith("/visas/") || from.startsWith("/guides/");
  if (isPillar) outboundAnchorsFromPillar.set(from, []);
  const seen = new Set();
  for (const { href, text } of extractAnchorLinks(html)) {
    if (!href || !href.startsWith("/")) continue;
    if (href.includes(".html")) urlPatternIssues.push({ page: from, href, issue: "contains_.html" });
    const norm = normalizeHref(href);
    if (norm && norm !== "/" && !norm.endsWith("/") && !/\.[a-z0-9]+$/i.test(norm))
      urlPatternIssues.push({ page: from, href, issue: "missing_trailing_slash" });
    const target = hrefToPageUrl(href, pageUrlSet);
    if (!target || target === from) continue;
    const key = from + "->" + target;
    if (!seen.has(key)) {
      seen.add(key);
      outbound.get(from).add(target);
      inbound.get(target).add(from);
    }
    if (text) {
      inboundAnchorsTo.get(target).push({ from, text });
      if (isPillar) outboundAnchorsFromPillar.get(from).push({ to: target, text });
    }
  }
}
const orphans = pageUrls.filter((u) => u !== "/" && inbound.get(u).size === 0).sort();
const weakOne = pageUrls
  .filter((u) => u !== "/" && inbound.get(u).size === 1)
  .map((u) => ({ url: u, from: [...inbound.get(u)][0] }))
  .sort((a, b) => a.url.localeCompare(b.url));
const depth = new Map([["/", 0]]);
const queue = ["/"];
while (queue.length) {
  const cur = queue.shift();
  const d = depth.get(cur);
  for (const next of outbound.get(cur)) {
    if (!depth.has(next)) {
      depth.set(next, d + 1);
      queue.push(next);
    }
  }
}
const unreachable = pageUrls.filter((u) => !depth.has(u)).sort();
const deepGt3 = pageUrls
  .filter((u) => depth.has(u) && depth.get(u) > 3)
  .map((u) => ({ url: u, depth: depth.get(u) }))
  .sort((a, b) => b.depth - a.depth || a.url.localeCompare(b.url));
const maxDepth = Math.max(0, ...depth.values());
const hub = pageUrls.map((u) => ({ url: u, outCount: outbound.get(u).size })).sort((a, b) => b.outCount - a.outCount);
const thinOutbound = pageUrls
  .filter((u) => outbound.get(u).size < 3)
  .map((u) => ({ url: u, outCount: outbound.get(u).size }))
  .sort((a, b) => a.outCount - b.outCount || a.url.localeCompare(b.url));
function anchorStats(entries) {
  const texts = entries.map((e) => (e.text || "").toLowerCase().trim());
  const unique = new Set(texts);
  const genericRe = /^(read more|here|learn more|click here|more|details|→|->|›|»)$/i;
  const genericCount = texts.filter((t) => genericRe.test(t) || t.length <= 2).length;
  return {
    count: texts.length,
    unique: unique.size,
    diversityRatio: texts.length ? +(unique.size / texts.length).toFixed(3) : null,
    genericCount,
    samples: [...unique].slice(0, 10),
  };
}
const pillarPages = pageUrls.filter((u) => u.startsWith("/visas/") || u.startsWith("/guides/"));
const pillarInboundDiversity = pillarPages.map((u) => ({
  url: u,
  role: "pillar",
  inbound: anchorStats(inboundAnchorsTo.get(u)),
})).filter((x) => x.inbound.count > 0);
const pillarOutboundDiversity = pillarPages.map((u) => ({
  url: u,
  role: "pillar",
  outbound: anchorStats(outboundAnchorsFromPillar.get(u) || []),
}));
const lowInboundDiversity = pillarInboundDiversity.filter(
  (x) => x.inbound.count >= 3 && (x.inbound.diversityRatio ?? 1) < 0.35
);
const lowOutboundDiversity = pillarOutboundDiversity.filter(
  (x) => x.outbound.count >= 5 && (x.outbound.diversityRatio ?? 1) < 0.4
);
const edgeCount = pageUrls.reduce((s, u) => s + outbound.get(u).size, 0);
const notWithin3 = pageUrls
  .filter((u) => !depth.has(u) || depth.get(u) > 3)
  .map((u) => ({ url: u, depth: depth.has(u) ? depth.get(u) : null, reachable: depth.has(u) }))
  .sort((a, b) => (b.depth ?? 999) - (a.depth ?? 999) || a.url.localeCompare(b.url));
const byDepth = {};
for (const u of pageUrls) {
  if (!depth.has(u)) continue;
  const d = String(depth.get(u));
  (byDepth[d] ||= []).push(u);
}
for (const k of Object.keys(byDepth)) byDepth[k].sort();
const linkGraphOutbound = Object.fromEntries(pageUrls.map((u) => [u, [...outbound.get(u)].sort()]));
const linkGraphInbound = Object.fromEntries(pageUrls.map((u) => [u, [...inbound.get(u)].sort()]));
const summary = {
  generatedAt: new Date().toISOString(),
  counts: {
    indexPages: pageUrls.length,
    totalInternalPageEdges: edgeCount,
    orphans: orphans.length,
    weakOneInbound: weakOne.length,
    unreachableFromHome: unreachable.length,
    deeperThan3Clicks: deepGt3.length,
    notReachableWithin3Clicks: notWithin3.length,
    maxClickDepthFromHome: maxDepth,
    thinOutboundUnder3: thinOutbound.length,
    urlPatternIssueInstances: urlPatternIssues.length,
    pillarPagesVisasGuides: pillarPages.length,
  },
  orphans,
  weakOneInbound: weakOne,
  clickDepth: { maxDepth, byDepth, deeperThan3Clicks: deepGt3, notReachableWithin3Clicks: notWithin3 },
  unreachableFromHome: unreachable,
  hubPagesTop20: hub.slice(0, 20),
  thinOutboundPages: thinOutbound,
  urlPatternIssues: {
    total: urlPatternIssues.length,
    byIssue: urlPatternIssues.reduce((a, x) => ((a[x.issue] = (a[x.issue] || 0) + 1), a), {}),
    samples: urlPatternIssues.slice(0, 80),
  },
  anchorTextDiversityPillarPages: {
    inboundToPillar: pillarInboundDiversity.sort((a, b) => (a.inbound.diversityRatio ?? 1) - (b.inbound.diversityRatio ?? 1)),
    outboundFromPillar: pillarOutboundDiversity.sort((a, b) => (a.outbound.diversityRatio ?? 1) - (b.outbound.diversityRatio ?? 1)),
    lowInboundDiversity,
    lowOutboundDiversity,
  },
  linkGraph: { outbound: linkGraphOutbound, inbound: linkGraphInbound },
  linkGraphSample: Object.fromEntries(
    hub.slice(0, 5).map((h) => [h.url, [...outbound.get(h.url)].sort()])
  ),
  topIssues: [],
};
summary.topIssues = [
  orphans.length && `${orphans.length} orphan pages (0 inbound)`,
  unreachable.length && `${unreachable.length} unreachable from /`,
  notWithin3.length && `${notWithin3.length} not within 3 clicks of /`,
  weakOne.length && `${weakOne.length} pages with 1 inbound link`,
  thinOutbound.length && `${thinOutbound.length} pages with <3 outbound page links`,
  urlPatternIssues.length && `${urlPatternIssues.length} inconsistent URL href patterns`,
  (lowInboundDiversity.length + lowOutboundDiversity.length) &&
    `${lowInboundDiversity.length} pillar pages (low inbound anchor diversity); ${lowOutboundDiversity.length} (low outbound)`,
].filter(Boolean);
const outPath = path.join(ROOT, "_audit-internal-links.json");
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
console.log("Wrote", outPath);
console.log(JSON.stringify(summary.counts, null, 2));
console.log("topIssues", summary.topIssues);