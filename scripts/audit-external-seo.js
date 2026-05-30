#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE = "pattayavisahelp.com";
const BASE_URL = `https://${SITE}`;
const OUT_FILE = path.join(ROOT, "_audit-external-seo.json");
const TODAY = new Date("2026-05-29T12:00:00Z");

const SUSPICIOUS_TLD = new Set([
  "xyz", "top", "click", "link", "work", "fit", "tk", "ml", "ga", "cf", "gq", "buzz", "cam", "rest", "zip", "mov",
]);
const SISTER_SITE_DOMAINS = new Set([
  "pattaya-authority.com", "pattaya-gym.com", "pattaya-school-guide.com", "pattaya-coffee.com",
  "pattayastream.com", "pattaya-restaurant-guide.com", "timpaemi.com",
]);
const SHORTENER_DOMAINS = new Set([
  "bit.ly", "t.co", "goo.gl", "tinyurl.com", "ow.ly", "buff.ly", "is.gd", "rb.gy", "cutt.ly", "shorturl.at",
]);
const TRUSTED_GOV_PATTERNS = [
  /\.go\.th$/i,
  /\.or\.th$/i,
  /\.ac\.th$/i,
  /\.gov$/i,
  /^www\.immigration\.go\.th$/i,
];

function walkIndexHtml(dir, list = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      walkIndexHtml(full, list);
    } else if (ent.name === "index.html") {
      list.push(path.relative(ROOT, full).split(path.sep).join("/"));
    }
  }
  return list.sort();
}

function pagePathToUrl(relPath) {
  const posix = relPath.replace(/\\/g, "/");
  if (posix === "index.html") return `${BASE_URL}/`;
  return `${BASE_URL}/${posix.replace(/\/index\.html$/, "/")}`;
}

function normalizeUrlForCompare(u) {
  try {
    const url = new URL(u);
    let p = url.pathname;
    if (!p.endsWith("/")) p += "/";
    return `${url.origin}${p}`.toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}

function stripScriptsAndStyles(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}

function parseAttrs(attrString) {
  const attrs = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let m;
  while ((m = re.exec(attrString)) !== null) {
    const key = m[1].toLowerCase();
    const val = m[3] ?? m[4] ?? m[5] ?? "";
    attrs[key] = val;
  }
  return attrs;
}

function extractTagHrefs(html, tagName) {
  const out = [];
  const re = new RegExp(`<${tagName}\\s+([^>]*?)>`, "gi");
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = parseAttrs(m[1]);
    if (attrs.href) out.push({ tag: tagName, attrs });
  }
  return out;
}

function isExternalHttp(href) {
  if (!href || typeof href !== "string") return false;
  const h = href.trim();
  if (!/^https?:\/\//i.test(h)) return false;
  try {
    const host = new URL(h).hostname.toLowerCase();
    if (host === SITE || host === `www.${SITE}`) return false;
    if (host.endsWith(`.${SITE}`)) return false;
    return true;
  } catch {
    return false;
  }
}

function relFlags(rel) {
  const parts = (rel || "").toLowerCase().split(/\s+/).filter(Boolean);
  return {
    noopener: parts.includes("noopener"),
    noreferrer: parts.includes("noreferrer"),
    nofollow: parts.includes("nofollow"),
    raw: rel || "",
  };
}

function hasOpenerNoreferrer(rel) {
  const f = relFlags(rel);
  return f.noopener && f.noreferrer;
}

function domainFromHref(href) {
  try {
    return new URL(href).hostname.toLowerCase();
  } catch {
    return "(invalid-url)";
  }
}

function isSuspiciousDomain(domain, href) {
  const reasons = [];
  if (domain === "(invalid-url)") reasons.push("invalid-url");
  if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) reasons.push("raw-ip");
  if (domain.startsWith("xn--")) reasons.push("punycode");
  const tld = domain.split(".").pop() || "";
  if (SUSPICIOUS_TLD.has(tld)) reasons.push(`suspicious-tld:.${tld}`);
  if (SHORTENER_DOMAINS.has(domain)) reasons.push("url-shortener");
  if (SISTER_SITE_DOMAINS.has(domain)) reasons.push("sister-site-network-review");
  if (/^https?:\/\//i.test(href) && href.startsWith("http://")) reasons.push("insecure-http");
  const trusted = TRUSTED_GOV_PATTERNS.some((re) => re.test(domain));
  if (!trusted && /go\.th/i.test(domain) && !domain.endsWith(".go.th")) reasons.push("go-th-typo?");
  if (/paypal|amazon|google|facebook/i.test(domain) && !/\.(com|co\.uk|de|go\.th)/.test(domain)) {
    /* noop - too noisy */
  }
  return reasons;
}

function firstMatch(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function allMatches(html, re) {
  const out = [];
  let m;
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  while ((m = g.exec(html)) !== null) out.push(m[1].trim());
  return out;
}

function metaContent(html, nameOrProp, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  const re = new RegExp(
    `<meta\\s+${attr}=["']${nameOrProp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']\\s+content=["']([^"']*)["']`,
    "i"
  );
  let v = firstMatch(html, re);
  if (v != null) return v;
  const re2 = new RegExp(
    `<meta\\s+content=["']([^"']*)["']\\s+${attr}=["']${nameOrProp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
    "i"
  );
  return firstMatch(html, re2);
}

function linkHref(html, relValue) {
  const re = new RegExp(
    `<link\\s+[^>]*rel=["']${relValue}["'][^>]*href=["']([^"']+)["']`,
    "i"
  );
  let v = firstMatch(html, re);
  if (v != null) return v;
  const re2 = new RegExp(
    `<link\\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']${relValue}["']`,
    "i"
  );
  return firstMatch(html, re2);
}

function hreflangLinks(html) {
  const out = [];
  const re = /<link\s+[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = parseAttrs(m[0].slice(5, -1));
    if ((attrs.rel || "").toLowerCase() === "alternate" && attrs.hreflang && attrs.href) {
      out.push({ hreflang: attrs.hreflang.toLowerCase(), href: attrs.href });
    }
  }
  return out;
}

function countH1(html) {
  return (html.match(/<h1[\s>]/gi) || []).length;
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      const data = JSON.parse(raw);
      blocks.push(data);
    } catch {
      blocks.push({ parseError: true, raw: raw.slice(0, 200) });
    }
  }
  return blocks;
}

function collectSchemaTypes(node, types = new Set()) {
  if (node == null) return types;
  if (Array.isArray(node)) {
    node.forEach((n) => collectSchemaTypes(n, types));
    return types;
  }
  if (typeof node === "object") {
    if (node["@type"]) {
      const t = node["@type"];
      if (Array.isArray(t)) t.forEach((x) => types.add(x));
      else types.add(t);
    }
    for (const v of Object.values(node)) {
      if (v && typeof v === "object") collectSchemaTypes(v, types);
    }
  }
  return types;
}

function parseSitemapLocs(rootDir) {
  const urls = new Set();
  const byFile = {};
  const files = fs.readdirSync(rootDir).filter((f) => f.startsWith("sitemap") && f.endsWith(".xml"));
  for (const file of files) {
    if (file === "sitemap_index.xml") continue;
    const content = fs.readFileSync(path.join(rootDir, file), "utf8");
    if (/<sitemapindex[\s>]/i.test(content)) continue;
    byFile[file] = [];
    const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
    let m;
    while ((m = re.exec(content)) !== null) {
      const raw = m[1].trim();
      if (/\.xml(\/|$)/i.test(raw)) continue;
      const norm = normalizeUrlForCompare(raw);
      urls.add(norm);
      byFile[file].push(norm);
    }
  }
  return { urls, files: files.sort(), byFile };
}

function parseRssDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
}

function auditFeedFreshness(feedPath) {
  const content = fs.readFileSync(feedPath, "utf8");
  const stat = fs.statSync(feedPath);
  const lastBuild = firstMatch(content, /<lastBuildDate>([^<]+)<\/lastBuildDate>/i);
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRe.exec(content)) !== null) {
    const block = m[1];
    const title = firstMatch(block, /<title>([^<]*)<\/title>/i);
    const link = firstMatch(block, /<link>([^<]*)<\/link>/i);
    const pub = firstMatch(block, /<pubDate>([^<]+)<\/pubDate>/i);
    items.push({ title, link, pubDate: pub, parsed: parseRssDate(pub) });
  }
  const newest = items.reduce((a, b) => (!a || (b.parsed && b.parsed > a) ? b.parsed : a), null);
  const daysSinceNewest = newest ? (TODAY - newest) / (86400000) : null;
  const daysSinceBuild = lastBuild ? (TODAY - parseRssDate(lastBuild)) / 86400000 : null;
  return {
    path: "feed.xml",
    fileModified: stat.mtime.toISOString(),
    lastBuildDate: lastBuild,
    itemCount: items.length,
    newestItemPubDate: newest ? newest.toISOString() : null,
    daysSinceNewestItem: daysSinceNewest != null ? Math.round(daysSinceNewest) : null,
    daysSinceLastBuild: daysSinceBuild != null ? Math.round(daysSinceBuild) : null,
    issues: [],
    items,
  };
}

function auditLlmsFreshness(llmsPath) {
  const content = fs.readFileSync(llmsPath, "utf8");
  const stat = fs.statSync(llmsPath);
  const urlRefs = [...content.matchAll(/https:\/\/pattayavisahelp\.com[^\s)\]"']*/g)].map((m) => m[0].replace(/[.,;]+$/, ""));
  const uniquePaths = [...new Set(urlRefs.map((u) => {
    try {
      return new URL(u).pathname;
    } catch {
      return u;
    }
  }))];
  const externalInLlms = [...content.matchAll(/https?:\/\/(?!pattayavisahelp\.com)[^\s)\]"']+/g)].map((m) => m[0].replace(/[.,;]+$/, ""));
  const issues = [];
  const daysSinceMod = Math.round((TODAY - stat.mtime) / 86400000);
  if (daysSinceMod > 60) issues.push({ type: "stale-file", message: `llms.txt not modified in ${daysSinceMod} days`, severity: "info" });
  return {
    path: "llms.txt",
    fileModified: stat.mtime.toISOString(),
    daysSinceModified: daysSinceMod,
    internalUrlMentions: uniquePaths.length,
    externalUrlMentions: [...new Set(externalInLlms)],
    issues,
  };
}

function expectedHreflangForPage(relPath) {
  const posix = relPath.replace(/\\/g, "/");
  if (posix === "de/index.html" || posix === "ru/index.html" || posix === "index.html") {
    return ["en", "de", "ru", "x-default"];
  }
  return null;
}

function auditSeoPage(relPath, html) {
  const expectedUrl = pagePathToUrl(relPath);
  const title = firstMatch(html, /<title>([^<]*)<\/title>/i) || "";
  const description = metaContent(html, "description") || "";
  const canonical = linkHref(html, "canonical");
  const robots = metaContent(html, "robots");
  const ogTitle = metaContent(html, "og:title", true);
  const ogDesc = metaContent(html, "og:description", true);
  const ogImage = metaContent(html, "og:image", true);
  const ogUrl = metaContent(html, "og:url", true);
  const twitterCard = metaContent(html, "twitter:card");
  const hreflang = hreflangLinks(html);
  const h1Count = countH1(html);
  const jsonLd = extractJsonLd(html);
  const schemaTypes = [...collectSchemaTypes(jsonLd.length === 1 ? jsonLd[0] : jsonLd)];

  const issues = [];
  const titleLen = title.length;
  if (titleLen < 50 || titleLen > 60) {
    issues.push({ type: "title-length", message: `title ${titleLen} chars (ideal 50-60)`, severity: titleLen < 30 || titleLen > 70 ? "high" : "medium" });
  }
  const descLen = description.length;
  if (descLen < 150 || descLen > 160) {
    issues.push({ type: "meta-description-length", message: `meta description ${descLen} chars (ideal 150-160)`, severity: descLen < 120 || descLen > 170 ? "high" : "medium" });
  }
  if (!canonical) {
    issues.push({ type: "missing-canonical", message: "no canonical link", severity: "high" });
  } else if (normalizeUrlForCompare(canonical) !== normalizeUrlForCompare(expectedUrl)) {
    issues.push({ type: "canonical-mismatch", message: `canonical ${canonical} expected ${expectedUrl}`, severity: "high" });
  }
  for (const key of ["og:title", "og:description", "og:image", "og:url"]) {
    const val = metaContent(html, key, true);
    if (!val) issues.push({ type: `missing-${key.replace(":", "-")}`, message: `missing ${key}`, severity: "high" });
  }
  if (!twitterCard) issues.push({ type: "missing-twitter-card", message: "missing twitter:card", severity: "medium" });

  const needHreflang = expectedHreflangForPage(relPath);
  if (needHreflang) {
    const langs = new Set(hreflang.map((h) => h.hreflang));
    for (const lang of needHreflang) {
      if (!langs.has(lang)) issues.push({ type: "missing-hreflang", message: `missing hreflang=${lang}`, severity: "high" });
    }
  }

  if (robots && /noindex/i.test(robots)) {
    /* ok for preview pages */
  } else if (!robots) {
    issues.push({ type: "missing-robots", message: "no robots meta", severity: "low" });
  }

  if (jsonLd.length === 0) {
    issues.push({ type: "missing-json-ld", message: "no JSON-LD block", severity: "medium" });
  } else if (jsonLd.some((b) => b.parseError)) {
    issues.push({ type: "json-ld-parse-error", message: "invalid JSON-LD JSON", severity: "high" });
  }

  if (h1Count !== 1) {
    issues.push({ type: "h1-count", message: `found ${h1Count} h1 (expected 1)`, severity: h1Count === 0 ? "high" : "medium" });
  }

  return {
    page: relPath,
    url: expectedUrl,
    title,
    titleLength: titleLen,
    descriptionLength: descLen,
    canonical,
    robots,
    og: { title: ogTitle, description: ogDesc, image: ogImage, url: ogUrl },
    twitterCard,
    hreflang,
    h1Count,
    jsonLdTypes: schemaTypes.sort(),
    issues,
  };
}

function main() {
  const indexPages = walkIndexHtml(ROOT);
  const externalByDomain = new Map();
  const externalLinkInstances = [];
  const missingRelBlank = [];
  const suspiciousDomains = new Map();

  for (const relPath of indexPages) {
    const full = path.join(ROOT, relPath);
    const html = fs.readFileSync(full, "utf8");
    const bodyHtml = stripScriptsAndStyles(html);

    for (const { tag, attrs } of [...extractTagHrefs(bodyHtml, "a"), ...extractTagHrefs(html, "link")]) {
      const href = attrs.href;
      if (!isExternalHttp(href)) continue;
      const domain = domainFromHref(href);
      const rel = attrs.rel || "";
      const target = (attrs.target || "").toLowerCase();
      const flags = relFlags(rel);

      if (!externalByDomain.has(domain)) {
        externalByDomain.set(domain, {
          domain,
          linkCount: 0,
          instances: 0,
          withNoopener: 0,
          withNoreferrer: 0,
          withNofollow: 0,
          targetBlank: 0,
          sampleHrefs: [],
        });
      }
      const agg = externalByDomain.get(domain);
      agg.instances += 1;
      agg.linkCount += 1;
      if (flags.noopener) agg.withNoopener += 1;
      if (flags.noreferrer) agg.withNoreferrer += 1;
      if (flags.nofollow) agg.withNofollow += 1;
      if (target === "_blank") agg.targetBlank += 1;
      if (agg.sampleHrefs.length < 5 && !agg.sampleHrefs.includes(href)) agg.sampleHrefs.push(href);

      externalLinkInstances.push({
        page: relPath,
        tag,
        href,
        domain,
        target: attrs.target || "",
        rel,
        noopener: flags.noopener,
        noreferrer: flags.noreferrer,
        nofollow: flags.nofollow,
      });

      if (target === "_blank" && !hasOpenerNoreferrer(rel)) {
        missingRelBlank.push({
          page: relPath,
          href,
          domain,
          rel: rel || "(none)",
          fix: 'add rel="noopener noreferrer"',
        });
      }

      const sus = isSuspiciousDomain(domain, href);
      if (sus.length) {
        if (!suspiciousDomains.has(domain)) suspiciousDomains.set(domain, { domain, reasons: new Set(), examples: [] });
        const s = suspiciousDomains.get(domain);
        sus.forEach((r) => s.reasons.add(r));
        if (s.examples.length < 5) s.examples.push({ page: relPath, href, reasons: sus });
      }
    }
  }

  const domainSummary = [...externalByDomain.values()]
    .map((d) => ({
      ...d,
      sampleHrefs: d.sampleHrefs,
    }))
    .sort((a, b) => b.instances - a.instances || a.domain.localeCompare(b.domain));

  const seoPages = [];
  const titleMap = new Map();
  const descMap = new Map();

  for (const relPath of indexPages) {
    const html = fs.readFileSync(path.join(ROOT, relPath), "utf8");
    const audit = auditSeoPage(relPath, html);
    seoPages.push(audit);
    if (!titleMap.has(audit.title)) titleMap.set(audit.title, []);
    titleMap.get(audit.title).push(relPath);
    const desc = metaContent(html, "description") || "";
    if (desc) {
      if (!descMap.has(desc)) descMap.set(desc, []);
      descMap.get(desc).push(relPath);
    }
  }

  const duplicateTitles = [...titleMap.entries()]
    .filter(([, pages]) => pages.length > 1)
    .map(([title, pages]) => ({ title, count: pages.length, pages: pages.sort() }));

  const duplicateDescriptions = [...descMap.entries()]
    .filter(([, pages]) => pages.length > 1)
    .map(([description, pages]) => ({
      description: description.slice(0, 120) + (description.length > 120 ? "â€¦" : ""),
      fullLength: description.length,
      count: pages.length,
      pages: pages.sort(),
    }));

  const seoIssueSummary = seoPages.filter((p) => p.issues.length > 0);
  const seoIssuesByType = {};
  for (const p of seoPages) {
    for (const iss of p.issues) {
      if (!seoIssuesByType[iss.type]) seoIssuesByType[iss.type] = { type: iss.type, count: 0, pages: [] };
      seoIssuesByType[iss.type].count += 1;
      if (seoIssuesByType[iss.type].pages.length < 200) seoIssuesByType[iss.type].pages.push(p.page);
    }
  }

  const { urls: sitemapUrls, files: sitemapFiles, byFile: sitemapByFile } = parseSitemapLocs(ROOT);
  const sitemapMainOnly = sitemapByFile["sitemap.xml"] ? new Set(sitemapByFile["sitemap.xml"]) : new Set();
  const diskUrls = indexPages.map((p) => normalizeUrlForCompare(pagePathToUrl(p)));
  const diskUrlSet = new Set(diskUrls);
  const noindexPages = seoPages.filter((p) => p.robots && /noindex/i.test(p.robots)).map((p) => normalizeUrlForCompare(p.url));

  const pagesNotInSitemap = indexPages
    .filter((p) => {
      const u = normalizeUrlForCompare(pagePathToUrl(p));
      if (noindexPages.includes(u)) return false;
      return !sitemapUrls.has(u);
    })
    .map((p) => ({ path: p, url: pagePathToUrl(p) }));

  const sitemapOrphans = [...sitemapUrls]
    .filter((u) => !diskUrlSet.has(u) && u.includes(SITE))
    .map((u) => u)
    .sort();

  const pagesNotInSitemapMain = indexPages
    .filter((p) => {
      const u = normalizeUrlForCompare(pagePathToUrl(p));
      if (noindexPages.includes(u)) return false;
      return !sitemapMainOnly.has(u);
    })
    .map((p) => ({ path: p, url: pagePathToUrl(p) }));

  const sitemapOrphansMainOnly = [...sitemapMainOnly].filter((u) => !diskUrlSet.has(u)).sort();

  const feedAudit = auditFeedFreshness(path.join(ROOT, "feed.xml"));
  if (feedAudit.daysSinceNewestItem != null && feedAudit.daysSinceNewestItem > 30) {
    feedAudit.issues.push({
      type: "stale-feed",
      message: `Newest RSS item is ${feedAudit.daysSinceNewestItem} days old`,
      severity: "medium",
    });
  }
  if (feedAudit.fileModified && feedAudit.lastBuildDate) {
    const build = parseRssDate(feedAudit.lastBuildDate);
    const blogDirs = fs.existsSync(path.join(ROOT, "blog"))
      ? fs.readdirSync(path.join(ROOT, "blog"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
      : [];
    const feedLinks = new Set(feedAudit.items.map((i) => normalizeUrlForCompare(i.link || "")));
    const missingFromFeed = blogDirs
      .filter((d) => fs.existsSync(path.join(ROOT, "blog", d, "index.html")))
      .map((d) => normalizeUrlForCompare(`${BASE_URL}/blog/${d}/`))
      .filter((u) => !feedLinks.has(u));
    feedAudit.blogFoldersOnDisk = blogDirs.length;
    feedAudit.blogPostsMissingFromFeed = missingFromFeed;
    if (missingFromFeed.length) {
      feedAudit.issues.push({
        type: "feed-missing-posts",
        message: `${missingFromFeed.length} blog folder(s) not in feed.xml`,
        severity: "medium",
        urls: missingFromFeed,
      });
    }
  }

  const llmsAudit = auditLlmsFreshness(path.join(ROOT, "llms.txt"));

  const actionable = {
    externalLinksMissingRelOnTargetBlank: missingRelBlank,
    suspiciousExternalDomains: [...suspiciousDomains.values()].map((s) => ({
      domain: s.domain,
      reasons: [...s.reasons],
      examples: s.examples,
    })),
    seoPagesWithIssues: seoIssueSummary.map((p) => ({ page: p.page, issues: p.issues })),
    duplicateTitles,
    duplicateDescriptions,
    sitemapPagesNotListed: pagesNotInSitemap,
    sitemapUrlsWithoutPage: sitemapOrphans,
    canonicalMismatches: seoPages
      .filter((p) => p.issues.some((i) => i.type === "canonical-mismatch"))
      .map((p) => ({ page: p.page, canonical: p.canonical, expected: p.url })),
    highPrioritySeo: seoPages
      .filter((p) => p.issues.some((i) => i.severity === "high" && !/title-length|meta-description-length/.test(i.type)))
      .map((p) => ({ page: p.page, issues: p.issues.filter((i) => i.severity === "high") })),
    sitemapXmlOnly: {
      pagesNotInSitemapMain,
      orphansInMainOnly: sitemapOrphansMainOnly,
    },
    feedFreshness: feedAudit.issues,
    llmsFreshness: llmsAudit.issues,
  };

  const report = {
    generatedAt: new Date().toISOString(),
    auditDate: TODAY.toISOString().slice(0, 10),
    totals: {
      indexHtmlPages: indexPages.length,
      uniqueExternalDomains: externalByDomain.size,
      externalLinkInstances: externalLinkInstances.length,
      externalTargetBlankMissingRel: missingRelBlank.length,
      suspiciousDomainCount: suspiciousDomains.size,
      seoPagesWithAnyIssue: seoIssueSummary.length,
      duplicateTitleGroups: duplicateTitles.length,
      duplicateDescriptionGroups: duplicateDescriptions.length,
      sitemapUrlEntries: sitemapUrls.size,
      sitemapFiles,
      pagesNotInSitemap: pagesNotInSitemap.length,
      sitemapOrphans: sitemapOrphans.length,
    },
    externalLinks: {
      byDomain: domainSummary,
      targetBlankMissingRelCount: missingRelBlank.length,
    },
    suspiciousDomains: actionable.suspiciousExternalDomains,
    seo: {
      summaryByIssueType: Object.values(seoIssuesByType).sort((a, b) => b.count - a.count),
      pages: seoPages,
    },
    sitemap: {
      sitemapXmlOnly: {
        urlCount: sitemapMainOnly.size,
        pagesNotInSitemapMain: indexPages
          .filter((p) => {
            const u = normalizeUrlForCompare(pagePathToUrl(p));
            if (noindexPages.includes(u)) return false;
            return !sitemapMainOnly.has(u);
          })
          .map((p) => ({ path: p, url: pagePathToUrl(p) })),
        orphansInMainOnly: [...sitemapMainOnly].filter((u) => !diskUrlSet.has(u)).sort(),
      },
      byFileCounts: Object.fromEntries(Object.entries(sitemapByFile || {}).map(([f, arr]) => [f, arr.length])),
      pagesNotInSitemap,
      sitemapOrphans,
    },
    feed: feedAudit,
    llms: llmsAudit,
    actionable,
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${OUT_FILE}`);
  console.log(JSON.stringify(report.totals, null, 2));
}

main();
