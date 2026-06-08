/**
 * UX shell parity: nav, mnav, skip link, tap targets, stub banners.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === '.git' || e.name === 'node_modules' || e.name === 'functions') continue;
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

const sm = fs.readFileSync(path.join(__dirname, 'rebuild-sitemaps.cjs'), 'utf8');
const pilots = new Set(JSON.parse(sm.match(/LOCALE_INDEXED_PILOT = new Set\((\[[\s\S]*?\])\)/)[1]));

const files = walk(ROOT);
const stats = {
  total: files.length,
  indexed: 0,
  noMnav: [],
  noNav: [],
  noSkip: [],
  noTap: [],
  stubBanner: [],
  minimalShell: [],
  pilotsMissingNav: [],
};

for (const f of files) {
  const url = pagePath(f);
  const h = fs.readFileSync(f, 'utf8');
  const robots = (h.match(/name=["']robots["'][^>]*content=["']([^"']+)["']/i) ||
    h.match(/content=["']([^"']+)["'][^>]*name=["']robots["']/i) || [])[1] || '';
  const noindex = /noindex/i.test(robots);
  if (!noindex) stats.indexed++;

  const isRedirectShell =
    /window\.location\.replace\s*\(/i.test(h) ||
    /<meta[^>]+http-equiv=["']refresh["']/i.test(h);
  const hasMnav =
    h.includes('__mnavLoaded') ||
    h.includes('assets/mnav.js') ||
    h.includes('class="mnav"');
  const hasNav = h.includes('class="nav"');
  const hasSkip = h.includes('skipto') || h.includes('skip-link');
  const hasTap = h.includes('TAP-TARGET');
  const hasStub = h.includes('locale-stub-banner');
  const hasFooter = h.includes('class="footer"') || h.includes('<footer');
  const mainOnly = hasNav === false && !h.includes('class="mnav"') && h.includes('<main');

  if (!hasMnav && !isRedirectShell) stats.noMnav.push(url);
  if (!hasNav && !hasMnav && !isRedirectShell) stats.noNav.push(url);
  if (!hasSkip) stats.noSkip.push(url);
  if (!hasTap) stats.noTap.push(url);
  if (hasStub) stats.stubBanner.push(url);
  if (mainOnly && !noindex) stats.minimalShell.push(url);
  if (pilots.has(url) && !hasNav) stats.pilotsMissingNav.push(url);
}

function sample(arr, n = 8) {
  return arr.length <= n ? arr : [...arr.slice(0, n), `...+${arr.length - n} more`];
}

console.log('=== UX Shell Audit ===\n');
console.log(`Pages: ${stats.total} | Indexed (no noindex): ${stats.indexed}`);
console.log(`Locale indexed pilots: ${pilots.size}`);
console.log(`\nMissing mobile nav (__mnavLoaded): ${stats.noMnav.length}`);
console.log(sample(stats.noMnav).join('\n  '));
console.log(`\nMissing desktop nav AND mnav: ${stats.noNav.length}`);
console.log(sample(stats.noNav).join('\n  '));
console.log(`\nIndexed pilots without .nav: ${stats.pilotsMissingNav.length}`);
console.log(stats.pilotsMissingNav.join('\n  ') || '  (none)');
console.log(`\nIndexed minimal shell (no nav, has main): ${stats.minimalShell.length}`);
console.log(stats.minimalShell.join('\n  ') || '  (none)');
console.log(`\nLocale stub banners: ${stats.stubBanner.length}`);
console.log(`\nMissing skip link: ${stats.noSkip.length}`);
console.log(`Missing TAP-TARGET styles: ${stats.noTap.length}`);

const pilotsNoMnav = [];
for (const u of pilots) {
  const rel = u.slice(1) + 'index.html';
  const f = path.join(ROOT, rel);
  if (!fs.existsSync(f)) continue;
  const h = fs.readFileSync(f, 'utf8');
  if (!h.includes('__mnavLoaded') && !h.includes('assets/mnav.js') && !h.includes('class="mnav"'))
    pilotsNoMnav.push(u);
}
console.log(`\nIndexed pilots missing mnav script: ${pilotsNoMnav.length}`);
console.log(pilotsNoMnav.join('\n  ') || '  (none)');

if (pilotsNoMnav.length) process.exit(1);
