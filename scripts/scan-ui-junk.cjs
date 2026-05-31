/** One-off scan: raw hero stats + empty h2 in indexed EN main */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

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

function parseSitemap() {
  const urls = new Set();
  for (const file of fs.readdirSync(ROOT).filter((f) => f.startsWith('sitemap') && f.endsWith('.xml'))) {
    const xml = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      try {
        urls.add(new URL(m[1]).pathname);
      } catch {}
    }
  }
  return urls;
}

const sitemap = parseSitemap();
const issues = [];

for (const file of walk(ROOT)) {
  const p = pagePath(file);
  if (!sitemap.has(p) || p.startsWith('/de/') || p.startsWith('/ru/')) continue;
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const head = main.slice(0, 800);
  const rawStats = /min read·Updated/.test(head) && !/<(?:span|p|div class="article-meta)[^>]*>[^<]*min read/i.test(head);
  const emptyH2 = /<h2>[^<]+<\/h2>\s*(<\/div>\s*)?<h2>/.test(main);
  const ariaJunk = /<div aria-hidden="true">\s*\n\s*[^<]+\n\s*\d+ min read·Updated/.test(main);
  if (rawStats || emptyH2 || ariaJunk) {
    issues.push({ path: p, rawStats, emptyH2, ariaJunk });
  }
}

console.log(JSON.stringify(issues, null, 2));
console.log('count', issues.length);
