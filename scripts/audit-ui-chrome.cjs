/**
 * Detect UI chrome corruption on indexed EN pages.
 * Exit 1 if any indexed page fails.
 */
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

const PATTERNS = [
  { id: 'cta_merged_h2', re: /Free 15-min consultation<h2>/ },
  { id: 'stats_mashed_nomade', re: /nomad guidePage sections\d+/ },
  { id: 'stats_mashed_work', re: /hubVisa classes/ },
  { id: 'stats_mashed_profession', re: /Profession-specific guide\s*\n\s*\d+ min read·Updated/ },
  { id: 'broken_pillar_cards', re: /Read pillar →<\/a><a href="/ },
  { id: 'broken_prof_cards', re: /<a href="\/professions\/[^"]+">[^<]+<h3>/ },
  { id: 'text_before_h2_mashed', re: /[a-z]\d+[A-Z][a-z]+[^<]{0,40}<h2>/ },
];

const sitemap = parseSitemap();
const fails = [];

for (const file of walk(ROOT)) {
  const p = pagePath(file);
  if (!sitemap.has(p)) continue;
  if (p.startsWith('/de/') || p.startsWith('/ru/')) continue;
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  if (!main) continue;
  for (const { id, re } of PATTERNS) {
    if (re.test(main)) {
      fails.push({ path: p, issue: id });
      break;
    }
  }
}

const report = {
  generated: new Date().toISOString(),
  indexedEnChecked: [...sitemap].filter((u) => !u.startsWith('/de/') && !u.startsWith('/ru/')).length,
  failCount: fails.length,
  fails,
};

fs.writeFileSync(path.join(ROOT, '_audit-ui-chrome.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ failCount: fails.length, fails: fails.slice(0, 20) }, null, 2));
if (fails.length) process.exit(1);
