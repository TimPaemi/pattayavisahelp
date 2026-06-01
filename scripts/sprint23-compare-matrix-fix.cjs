/**
 * Sprint 23 — visa matrix, compare dedupe, aria-hidden cleanup.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const patches = require('./content/sprint23-page-patches.cjs');

const CTA = `<p><strong>Free 15-min consultation</strong></p>
<h2>Want a personal answer?</h2>
<p>A real human in Pattaya replies within 24 hours.</p>
<p><a href="/contact/">Book free consult →</a> · <a href="https://api.whatsapp.com/send/?phone=66967286999&amp;text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas" target="_blank" rel="noopener noreferrer">WhatsApp +66 96 728 6999</a></p>`;

function urlToFile(p) {
  return path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function readMain(file) {
  const html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) throw new Error(`No main: ${file}`);
  return { html, main: m[1] };
}

function writeMain(file, html, main) {
  const out = html.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/i, `<main id="main" class="article-body">\n${main.trim()}\n</main>`);
  fs.writeFileSync(file, out);
}

function fixBrokenH3Links(main) {
  return main.replace(
    /<a href="([^"]+)">\s*<h3>([^<]+)<\/h3>(?:\s*<p>([^<]*)<\/p>)?\s*<\/a>/g,
    (_, href, title, desc) => {
      const extra = desc ? ` — ${desc.trim()}` : '';
      return `<li><a href="${href}"><strong>${title.trim()}</strong>${extra}</a></li>`;
    }
  ).replace(
    /(<h2>Comparison deep-dives<\/h2>\s*\n\s*)((?:<li>[\s\S]*?<\/li>\s*)+)/i,
    '$1<ul>\n$2</ul>\n'
  );
}

function removeAriaHiddenWrappers(main) {
  return main.replace(
    /<div aria-hidden="true">\s*\n\s*(?:Deeper analysis|Deeper detail)\s*\n\s*(<h2)/gi,
    '\n$1'
  ).replace(/<div aria-hidden="true">\s*\n\s*<\/div>\s*\n/g, '');
}

function cleanDuplicateCta(main) {
  let m = main;
  // Remove partial CTAs that aren't the standard block
  m = m.replace(
    /<p><strong>Free 15-min consultation<\/strong><\/p>\s*\n\s*<h2>(?!Want a personal answer)[^<]+<\/h2>\s*\n\s*<p>[^<]+<\/p>\s*\n/g,
    ''
  );
  // Keep only last standard CTA
  const standard = /<p><strong>Free 15-min consultation<\/strong><\/p>\s*\n<h2>Want a personal answer\?<\/h2>[\s\S]*?WhatsApp \+66 96 728 6999<\/a><\/p>/g;
  const matches = [...m.matchAll(standard)];
  if (matches.length > 1) {
    for (let i = 0; i < matches.length - 1; i++) {
      m = m.replace(matches[i][0], '');
    }
  }
  m = m.trimEnd();
  if (!m.includes('Want a personal answer')) m += '\n\n' + CTA;
  return m;
}

function prependPatch(pagePath, intro, startPattern) {
  const file = urlToFile(pagePath);
  const { html, main } = readMain(file);
  const idx = main.search(startPattern);
  if (idx === -1) throw new Error(`Start pattern not found: ${pagePath}`);
  writeMain(file, html, intro.trim() + '\n' + main.slice(idx));
  return pagePath;
}

function fixVisaMatrix() {
  const p = '/compare/visa-comparison-matrix/';
  const file = urlToFile(p);
  const { html, main } = readMain(file);
  let body = patches[p].trim() + '\n' + main.replace(/^\s*<table/, '<table');
  body = fixBrokenH3Links(body);
  body = cleanDuplicateCta(body);
  writeMain(file, html, body);
  return p;
}

function fixPattayaHuaHin() {
  const p = '/compare/pattaya-vs-hua-hin/';
  const file = urlToFile(p);
  const { html, main } = readMain(file);
  let body = patches[p].trim() + '\n' + main.replace(/^\s*<h2>Side-by-side<\/h2>/, '<h2>Side-by-side</h2>');
  body = removeAriaHiddenWrappers(body);
  body = cleanDuplicateCta(body);
  writeMain(file, html, body);
  return p;
}

function fixDrivingLicence() {
  const p = '/guides/driving-licence-thailand/';
  const file = urlToFile(p);
  const { html, main } = readMain(file);
  const idx = main.search(/<h2>Why convert<\/h2>/);
  if (idx === -1) throw new Error('Why convert h2 missing');
  let body = patches[p].trim() + '\n' + main.slice(idx);
  body = removeAriaHiddenWrappers(body);
  body = cleanDuplicateCta(body);
  writeMain(file, html, body);
  return p;
}

function fixDtvVsElite() {
  const p = '/compare/dtv-vs-elite/';
  const file = urlToFile(p);
  const { html, main } = readMain(file);
  let body = main;
  // Remove thin first FAQ + partial CTA before deep-dive append
  body = body.replace(
    /\s*<h2>FAQ<\/h2>\s*\n\s*\n\s*<details>[\s\S]*?<\/details>\s*\n\s*<details>[\s\S]*?<\/details>\s*\n\s*<details>[\s\S]*?<\/details>\s*\n<p><strong>Free 15-min consultation<\/strong><\/p>\s*\n\s*<h2>Stuck between DTV and Privilege\?<\/h2>\s*\n\s*<p>[^<]+<\/p>\s*\n/,
    '\n'
  );
  body = body.replace(
    /<h2>DTV vs Privilege: which actually saves you money over 5 years\?<\/h2>/,
    '<h2>5-year cost analysis</h2>'
  );
  body = cleanDuplicateCta(body);
  writeMain(file, html, body);
  return p;
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

function fixAllBrokenH3Links() {
  const fixed = [];
  for (const p of parseSitemap()) {
    if (p.startsWith('/de/') || p.startsWith('/ru/')) continue;
    const file = urlToFile(p);
    if (!fs.existsSync(file)) continue;
    const { html, main } = readMain(file);
    if (!/<a href="[^"]+">\s*<h3>/.test(main)) continue;
    let body = fixBrokenH3Links(main);
    body = cleanDuplicateCta(body);
    writeMain(file, html, body);
    fixed.push(p);
  }
  return fixed;
}

const report = [
  fixVisaMatrix(),
  fixPattayaHuaHin(),
  fixDrivingLicence(),
  fixDtvVsElite(),
];
report.push(...fixAllBrokenH3Links());

// Extend UI audit
const auditPath = path.join(ROOT, 'scripts/audit-ui-chrome.cjs');
let audit = fs.readFileSync(auditPath, 'utf8');
if (!audit.includes('broken_h3_link')) {
  audit = audit.replace(
    "{ id: 'raw_quick_verdict', re: /\\n\\s*Quick verdict\\s*\\n\\s*<h2>/ },",
    `{ id: 'raw_quick_verdict', re: /\\n\\s*Quick verdict\\s*\\n\\s*<h2>/ },
  { id: 'broken_h3_link', re: /<a href=\"[^\"]+\">\\s*<h3>/ },
  { id: 'aria_deeper_junk', re: /<div aria-hidden=\"true\">\\s*\\n\\s*Deeper (analysis|detail)/ },`
  );
  fs.writeFileSync(auditPath, audit);
}

console.log(JSON.stringify({ sprint: 23, fixed: report }, null, 2));

execSync('node scripts/audit-ui-chrome.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-weak-inbound-indexed.cjs', { cwd: ROOT, stdio: 'inherit' });
