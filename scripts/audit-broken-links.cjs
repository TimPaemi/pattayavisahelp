/**
 * Find internal hrefs that do not resolve to a page on disk.
 * Usage: node scripts/audit-broken-links.cjs
 * Exit 1 if any broken link on indexed EN pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FIX = {
  '/visas/smart/': '/visas/smart/',
  '/visas/education-ed/': '/visas/education-ed/',
  '/visas/privilege-elite/': '/visas/privilege-elite/',
};

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'functions' || e.name === '.git' || e.name === 'node_modules') continue;
      walk(p, acc);
    } else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function pagePath(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.replace('/index.html', '') + '/';
  return null;
}

const pages = new Set(walk(ROOT).map(pagePath).filter(Boolean));

function existsOnDisk(target) {
  if (pages.has(target)) return true;
  const rel = target.replace(/^\//, '');
  const candidates = [
    path.join(ROOT, rel),
    path.join(ROOT, rel.replace(/\/$/, ''), 'index.html'),
  ];
  return candidates.some((p) => fs.existsSync(p));
}

function norm(href) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || /^https?:/i.test(href)) return null;
  let h = href.split('#')[0].split('?')[0];
  if (!h.startsWith('/')) return null;
  if (!h.endsWith('/') && !/\.[a-z0-9]+$/i.test(h)) h += '/';
  return FIX[h] || h;
}

const broken = [];
for (const file of walk(ROOT)) {
  const from = pagePath(file);
  if (!from) continue;
  const html = fs.readFileSync(file, 'utf8');
  const noindex = /noindex/i.test(html);
  for (const m of html.matchAll(/href=["'](\/[^"'#?]+)["']/gi)) {
    const target = norm(m[1]);
    if (!target || !target.startsWith('/')) continue;
    if (/\.(pdf|png|jpe?g|svg|webp|xml|css|js|webmanifest|ico)$/i.test(target)) continue;
    if (/^\/(favicon|apple-touch|og-|feed\.|site\.webmanifest|sitemap\.xml)/.test(target)) continue;
    if (!existsOnDisk(target)) {
      broken.push({ from, href: m[1], target, noindex });
    }
  }
}

const indexedBroken = broken.filter((b) => !b.noindex && !b.from.startsWith('/de/') && !b.from.startsWith('/ru/'));
const report = {
  generated: new Date().toISOString(),
  totalBroken: broken.length,
  indexedEnBroken: indexedBroken.length,
  indexedEn: indexedBroken.slice(0, 50),
  allBrokenSample: broken.slice(0, 30),
};

fs.writeFileSync(path.join(ROOT, '_audit-broken-links.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ indexedEnBroken: indexedBroken.length, totalBroken: broken.length }, null, 2));
if (indexedBroken.length) process.exit(1);
