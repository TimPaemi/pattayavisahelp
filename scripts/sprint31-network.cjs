/**
 * Sprint 31 — network-context on all indexed guides/visas/compare/pattaya hubs missing it.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const patches = require('./content/sprint31-network-patches.cjs');

const NETWORK_CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

const PREFIXES = [
  '/guides/',
  '/visas/',
  '/compare/',
  '/pattaya/',
  '/banking/',
  '/healthcare/',
  '/property/',
  '/retirement/',
  '/digital-nomad/',
  '/coworking/',
  '/tax/',
  '/pattaya-digital-nomad-guide/',
  '/work-permit/',
  '/gyms/',
];

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

function isIndexed(html) {
  const robots = (html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || 'index,follow';
  return !/noindex/i.test(robots);
}

function fallbackSnippet(route) {
  if (route.startsWith('/visas/')) {
    return `<p class="network-context">Hub: <a href="/visas/">All visas</a> · Tool: <a href="/tools/visa-finder/">Visa Finder</a> · Compare: <a href="/compare/">Comparisons</a> · <a href="/guides/jomtien-immigration-office/">Jomtien Immigration</a></p>\n`;
  }
  if (route.startsWith('/compare/')) {
    return `<p class="network-context"><a href="/compare/">Compare hub</a> · <a href="/compare/visa-comparison-matrix/">Full matrix</a> · <a href="/tools/visa-finder/">Visa Finder</a> · <a href="/visas/">All visas</a></p>\n`;
  }
  if (route.startsWith('/pattaya/')) {
    return `<p class="network-context"><a href="/pattaya/living-in-pattaya/">Living in Pattaya</a> · <a href="/guides/cost-of-living-pattaya/">Cost of living</a> · <a href="https://pattaya-restaurant-guide.com/" target="_blank" rel="noopener noreferrer">Pattaya Restaurant Guide</a></p>\n`;
  }
  if (route.startsWith('/guides/')) {
    return `<p class="network-context">Guides: <a href="/guides/">All guides</a> · Jomtien: <a href="/guides/jomtien-immigration-office/">Immigration office</a> · Tool: <a href="/tools/visa-finder/">Visa Finder</a></p>\n`;
  }
  return `<p class="network-context">Pattaya visas: <a href="/visas/">Visa hub</a> · <a href="/tools/visa-finder/">Visa Finder</a> · <a href="/contact/">Free consultation</a></p>\n`;
}

function ensureNetworkCss(h) {
  if (h.includes('.network-context{')) return h;
  if (h.includes('<style>')) return h.replace('<style>', `<style>\n${NETWORK_CSS}\n`);
  return h;
}

function insertNetwork(h, snippet) {
  const marker = '<main id="main" class="article-body">';
  if (h.includes(marker)) return h.replace(marker, snippet.trim() + '\n' + marker);
  const alt = '<main id="main">';
  if (h.includes(alt)) return h.replace(alt, snippet.trim() + '\n' + alt);
  return null;
}

let added = 0;
let skipped = 0;

for (const f of walk(ROOT)) {
  const route = pagePath(f);
  if (route.startsWith('/de/') || route.startsWith('/ru/') || route === '/v2-preview/') continue;
  if (!PREFIXES.some((x) => route.startsWith(x)) && !['/banking/', '/healthcare/', '/property/', '/retirement/', '/digital-nomad/', '/coworking/', '/tax/', '/work-permit/', '/gyms/', '/pattaya-digital-nomad-guide/'].includes(route)) {
    continue;
  }
  let h = fs.readFileSync(f, 'utf8');
  if (!isIndexed(h)) continue;
  if (h.includes('class="network-context"')) {
    skipped++;
    continue;
  }
  const snippet = patches[route] || fallbackSnippet(route);
  h = ensureNetworkCss(h);
  const next = insertNetwork(h, snippet);
  if (!next) {
    console.warn('no main marker', route);
    continue;
  }
  fs.writeFileSync(f, next);
  added++;
  console.log('network', route);
}

console.log(`Sprint 31 network: ${added} added, ${skipped} already had strip`);
