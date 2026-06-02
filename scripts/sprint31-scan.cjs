/** One-off scan for Sprint 31 prioritisation */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'node_modules' || e.name === 'functions') continue;
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

function mainWords(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return 0;
  return m[1].replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function isIndexed(html) {
  const robots = (html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || 'index,follow';
  return !/noindex/i.test(robots);
}

const PREFIXES = ['/guides/', '/visas/', '/compare/', '/pattaya/', '/banking/', '/healthcare/', '/property/', '/retirement/', '/digital-nomad/', '/coworking/', '/tax/', '/pattaya-digital-nomad-guide/', '/work-permit/', '/gyms/'];

const noNet = [];
const oneMin = [];
const faqNoSchema = [];
const thinIndexed = [];
const noPreloadFont = [];

for (const f of walk(ROOT)) {
  const h = fs.readFileSync(f, 'utf8');
  const p = pagePath(f);
  if (p.startsWith('/de/') || p.startsWith('/ru/') || p === '/v2-preview/') continue;
  if (!isIndexed(h)) continue;

  const wc = mainWords(h);
  const inScope = PREFIXES.some((x) => p.startsWith(x)) || p === '/banking/';

  if (inScope && !h.includes('network-context')) noNet.push({ p, wc });
  if (h.includes('1 MIN READ') && wc >= 400) oneMin.push({ p, wc });
  const hasFaq = /<h2[^>]*>\s*FAQ/i.test(h);
  const hasSchema = /FAQPage/.test(h);
  if (hasFaq && !hasSchema && (p.startsWith('/guides/') || p.startsWith('/visas/') || p.startsWith('/compare/'))) {
    faqNoSchema.push(p);
  }
  if (wc < 400 && !p.startsWith('/blog/') && p !== '/' && !p.startsWith('/tools/') && !p.startsWith('/glossary/')) {
    thinIndexed.push({ p, wc });
  }
  if (isIndexed(h) && !h.includes('preload" as="style"') && h.includes('fonts.googleapis.com')) {
    noPreloadFont.push(p);
  }
}

console.log('=== NO network-context (indexed, in scope) ===', noNet.length);
noNet.sort((a, b) => b.wc - a.wc).forEach((x) => console.log(x.p, x.wc));

console.log('\n=== 1 MIN READ but 400+ words ===', oneMin.length);
oneMin.sort((a, b) => b.wc - a.wc).slice(0, 40).forEach((x) => console.log(x.p, x.wc));

console.log('\n=== FAQ visible, no FAQPage ===', faqNoSchema.length);
faqNoSchema.forEach((p) => console.log(p));

console.log('\n=== Thin indexed (<400 main words, non-blog) ===', thinIndexed.length);
thinIndexed.sort((a, b) => a.wc - b.wc).slice(0, 25).forEach((x) => console.log(x.p, x.wc));
