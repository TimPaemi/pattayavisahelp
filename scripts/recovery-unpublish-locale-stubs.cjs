/**
 * Recovery Phase 1 — unpublish empty DE/RU stubs from Google.
 * - noindex all /de/* and /ru/* except language hub homepages
 * - remove per-page de/ru hreflang from English pages (keeps hub hreflang on / only)
 * - flag stub pages with visible "read English version" banner
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOCALE_HUBS = new Set(['de/index.html', 'ru/index.html']);
const NOINDEX = '<meta name="robots" content="noindex,follow" />';
const STUB_BANNER = `<div class="locale-stub-banner" style="max-width:820px;margin:0 auto 2rem;padding:1.25rem 1.5rem;border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:8px;font-size:.95rem;line-height:1.55;color:#fafafa"><strong style="color:#fbbf24">Translation in progress.</strong> This page is not yet available in your language. Please use the English guide below — we are rewriting locale pages properly, not publishing empty placeholders.</div>`;

function walkLocale(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkLocale(p, acc);
    else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function ensureNoindex(html) {
  if (/noindex/i.test(html.match(/<meta name="robots"[^>]+>/)?.[0] || '')) {
    return html.replace(/<meta name="robots" content="[^"]+"\s*\/?>/i, NOINDEX);
  }
  return html.replace(/<meta name="viewport"[^>]+\/?>/i, (m) => `${m}\n${NOINDEX}`);
}

function stripHreflangDeRu(html) {
  return html
    .replace(/<link rel="alternate" hreflang="de"[^>]+\/?>\s*\n?/gi, '')
    .replace(/<link rel="alternate" hreflang="ru"[^>]+\/?>\s*\n?/gi, '');
}

function addStubBanner(html) {
  if (html.includes('locale-stub-banner')) return html;
  if (/<main[^>]*class="article-body"/.test(html)) {
    return html.replace(/(<main[^>]*class="article-body"[^>]*>)/i, `$1\n${STUB_BANNER}\n`);
  }
  if (/<main id="main"/.test(html)) {
    return html.replace(/(<main id="main"[^>]*>)/i, `$1\n${STUB_BANNER}\n`);
  }
  return html;
}

const report = { noindexed: [], hreflangStripped: [], banners: [] };

for (const lang of ['de', 'ru']) {
  for (const file of walkLocale(path.join(ROOT, lang))) {
    const r = rel(file);
    if (LOCALE_HUBS.has(r)) continue;
    let html = fs.readFileSync(file, 'utf8');
    html = ensureNoindex(html);
    html = addStubBanner(html);
    fs.writeFileSync(file, html);
    report.noindexed.push('/' + r.replace('/index.html', '/'));
    if (html.includes('locale-stub-banner')) report.banners.push('/' + r.replace('/index.html', '/'));
  }
}

// Also noindex locale sitemap hubs (lists unpublished stubs)
for (const p of ['de/sitemap/index.html', 'ru/sitemap/index.html']) {
  const file = path.join(ROOT, p);
  if (!fs.existsSync(file)) continue;
  let html = ensureNoindex(fs.readFileSync(file, 'utf8'));
  fs.writeFileSync(file, html);
  report.noindexed.push('/' + p.replace('/index.html', '/'));
}

// Strip de/ru hreflang from English pages (not de/ru themselves)
function walkAll(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'de' || e.name === 'ru' || e.name.startsWith('_') || e.name === 'functions' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkAll(p, acc);
    else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

for (const file of walkAll(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  // Keep homepage hub hreflang; strip deep de/ru alternates everywhere else
  const isHome = rel(file) === 'index.html';
  if (!isHome && (/hreflang="de"/i.test(html) || /hreflang="ru"/i.test(html))) {
    html = stripHreflangDeRu(html);
  }
  if (html !== before) {
    fs.writeFileSync(file, html);
    report.hreflangStripped.push('/' + rel(file).replace('/index.html', '/').replace(/^index\.html$/, '/'));
  }
}

console.log(JSON.stringify(report, null, 2));
