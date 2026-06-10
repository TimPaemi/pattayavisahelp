/**
 * Deep SEO + UX static audit on indexed (sitemap) pages.
 * Covers gaps not checked by the main suite:
 *  - heading hierarchy violations (level skips, empty headings)
 *  - images missing alt
 *  - generic anchor text ("click here", "read more", bare URLs)
 *  - target=_blank without rel noopener/noreferrer
 *  - HTML page weight
 *  - <html lang> vs locale path mismatch
 *  - landmark elements (main/nav/footer)
 *  - og:url vs canonical mismatch
 *  - JSON-LD parse errors
 * Usage: node scripts/audit-deep-seo-ux.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAX_HTML_BYTES = 200 * 1024;

const GENERIC_ANCHORS = new Set([
  'click here', 'here', 'read more', 'more', 'link', 'this', 'learn more',
  'mehr', 'hier', 'weiterlesen', 'подробнее', 'здесь', 'тут',
]);

function parseSitemap() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const issues = {
  headingHierarchy: [],
  emptyHeadings: [],
  imagesNoAlt: [],
  genericAnchors: [],
  unsafeBlank: [],
  heavyPages: [],
  langMismatch: [],
  missingLandmarks: [],
  ogUrlMismatch: [],
  jsonLdErrors: [],
};

const pageStats = [];

for (const p of parseSitemap()) {
  const f = path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, 'utf8');
  const bytes = Buffer.byteLength(html);

  // Heading hierarchy within <main> (falls back to body)
  const mainHtml = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const headings = [...mainHtml.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: stripTags(m[2]),
  }));
  let prev = 0;
  for (const h of headings) {
    if (prev > 0 && h.level > prev + 1) {
      issues.headingHierarchy.push({ page: p, jump: `h${prev} -> h${h.level}`, at: h.text.slice(0, 50) });
    }
    if (!h.text) issues.emptyHeadings.push({ page: p, level: `h${h.level}` });
    prev = h.level;
  }

  // Images without alt
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\balt\s*=/.test(tag)) {
      issues.imagesNoAlt.push({ page: p, src: (tag.match(/src=["']([^"']+)["']/) || [])[1]?.slice(0, 80) });
    }
  }

  // Anchor quality + unsafe _blank
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = m[1];
    const text = stripTags(m[2]).toLowerCase();
    if (GENERIC_ANCHORS.has(text)) {
      issues.genericAnchors.push({ page: p, text, href: (attrs.match(/href=["']([^"']+)["']/) || [])[1]?.slice(0, 60) });
    }
    if (/target=["']_blank["']/i.test(attrs) && !/rel=["'][^"']*(noopener|noreferrer)/i.test(attrs)) {
      issues.unsafeBlank.push({ page: p, href: (attrs.match(/href=["']([^"']+)["']/) || [])[1]?.slice(0, 80) });
    }
  }

  // Page weight
  if (bytes > MAX_HTML_BYTES) issues.heavyPages.push({ page: p, kb: Math.round(bytes / 1024) });

  // lang attribute vs locale path
  const lang = (html.match(/<html[^>]+lang=["']([^"']+)["']/i) || [])[1] || '';
  const expected = p.startsWith('/de/') ? 'de' : p.startsWith('/ru/') ? 'ru' : 'en';
  if (!lang.toLowerCase().startsWith(expected)) issues.langMismatch.push({ page: p, lang, expected });

  // Landmarks
  const missing = [];
  if (!/<main\b/i.test(html)) missing.push('main');
  if (!/<nav\b|role=["']navigation["']/i.test(html)) missing.push('nav');
  if (!/<footer\b|role=["']contentinfo["']/i.test(html)) missing.push('footer');
  if (missing.length) issues.missingLandmarks.push({ page: p, missing });

  // og:url vs canonical
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1];
  const ogUrl = (html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i) || [])[1];
  if (canon && ogUrl && canon !== ogUrl) issues.ogUrlMismatch.push({ page: p, canon, ogUrl });

  // JSON-LD validity
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      issues.jsonLdErrors.push({ page: p, error: e.message.slice(0, 60) });
    }
  }

  pageStats.push({ page: p, kb: Math.round(bytes / 1024), headings: headings.length });
}

const counts = Object.fromEntries(Object.entries(issues).map(([k, v]) => [k, v.length]));
// Hierarchy jumps and heavy pages are advisory; hard-fail on the rest.
const hardFails =
  issues.emptyHeadings.length +
  issues.imagesNoAlt.length +
  issues.genericAnchors.length +
  issues.unsafeBlank.length +
  issues.langMismatch.length +
  issues.missingLandmarks.length +
  issues.ogUrlMismatch.length +
  issues.jsonLdErrors.length;

const report = {
  generated: new Date().toISOString(),
  pages: pageStats.length,
  verdict: hardFails === 0 ? 'PASS' : 'FAIL',
  counts,
  avgKb: Math.round(pageStats.reduce((a, s) => a + s.kb, 0) / pageStats.length),
  heaviest: [...pageStats].sort((a, b) => b.kb - a.kb).slice(0, 5),
  issues: Object.fromEntries(Object.entries(issues).map(([k, v]) => [k, v.slice(0, 25)])),
};

fs.writeFileSync(path.join(ROOT, '_audit-deep-seo-ux.json'), JSON.stringify(report, null, 2));

console.log('=== DEEP SEO/UX AUDIT ===');
console.log('Pages scanned:', report.pages, '| avg HTML:', report.avgKb + 'KB');
for (const [k, v] of Object.entries(counts)) console.log(`  ${v === 0 ? 'PASS' : 'ISSUE'} ${k}: ${v}`);
console.log('Heaviest:', report.heaviest.map((h) => `${h.page} ${h.kb}KB`).join(', '));
console.log('VERDICT:', report.verdict, `(${hardFails} hard issues)`);
process.exit(report.verdict === 'PASS' ? 0 : 1);
