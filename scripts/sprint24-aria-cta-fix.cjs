/**
 * Sprint 24 — aria-hidden wrapper cleanup, guide intros, audit gate.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const patches = require('./content/sprint24-page-patches.cjs');

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
  const out = html.replace(
    /<main id="main"[^>]*>[\s\S]*?<\/main>/i,
    `<main id="main" class="article-body">\n${main.trim()}\n</main>`
  );
  fs.writeFileSync(file, out);
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

function fixAriaHiddenInMain(main) {
  let m = main;

  // Closed blog/metadata junk blocks
  m = m.replace(/<div aria-hidden="true">\s*\n\s*[\s\S]*?<\/div>\s*\n/g, '');

  // CTA-only unclosed wrapper (blank line variant)
  m = m.replace(
    /<div aria-hidden="true">\s*\n\s*\n<p><strong>Free 15-min consultation<\/strong><\/p>/g,
    '\n\n<p><strong>Free 15-min consultation</strong></p>'
  );

  // CTA wrapper with preceding paragraph (living-in-pattaya)
  m = m.replace(
    /<div aria-hidden="true">\s*\n(<p>Considering a different city)/g,
    '\n\n$1'
  );

  // Jomtien daily-life section hidden from assistive tech
  m = m.replace(/<div aria-hidden="true">\s*\n\s*Daily life details\s*\n\s*/gi, '\n\n');

  // Deeper analysis wrappers (Sprint 20–23 leftovers)
  m = m.replace(
    /<div aria-hidden="true">\s*\n\s*(?:Deeper analysis|Deeper detail)\s*\n\s*(<h2)/gi,
    '\n\n$1'
  );

  m = m.replace(/<div aria-hidden="true">\s*\n\s*<\/div>\s*\n/g, '');

  return m;
}

function ensureStandardCta(main) {
  let m = main.trimEnd();
  if (!m.includes('Want a personal answer')) m += '\n\n' + CTA;
  return m;
}

function applyGuideIntro(pagePath, startRe) {
  const intro = patches[pagePath];
  if (!intro) throw new Error(`No patch for ${pagePath}`);
  const file = urlToFile(pagePath);
  const { html, main } = readMain(file);
  const idx = main.search(startRe);
  if (idx === -1) throw new Error(`Start pattern not found: ${pagePath}`);
  if (main.includes('Related:</strong>')) return null;
  let body = intro.trim() + '\n' + main.slice(idx);
  body = fixAriaHiddenInMain(body);
  body = ensureStandardCta(body);
  writeMain(file, html, body);
  return pagePath;
}

function sweepIndexedPages() {
  const fixed = [];
  for (const p of parseSitemap()) {
    if (p.startsWith('/de/') || p.startsWith('/ru/')) continue;
    const file = urlToFile(p);
    if (!fs.existsSync(file)) continue;
    const { html, main } = readMain(file);
    if (!/<div aria-hidden="true">/.test(main)) continue;
    let body = fixAriaHiddenInMain(main);
    body = ensureStandardCta(body);
    if (body !== main) {
      writeMain(file, html, body);
      fixed.push(p);
    }
  }
  return fixed;
}

const report = {
  sprint: 24,
  intros: [],
  ariaSweep: [],
};

report.intros.push(
  applyGuideIntro('/guides/buying-property-thailand/', /<h2>What you can legally own<\/h2>/),
  applyGuideIntro('/guides/healthcare-thailand/', /<h2>Pattaya private hospitals<\/h2>/),
  applyGuideIntro('/guides/permanent-residency-thailand/', /<h2>Who qualifies for Thai PR<\/h2>/),
  applyGuideIntro('/guides/international-schools-pattaya/', /<h2>The 5 main international schools<\/h2>/)
);

report.ariaSweep = sweepIndexedPages();

// Extend UI audit — block any aria-hidden div in main (SVG aria-hidden is fine)
const auditPath = path.join(ROOT, 'scripts/audit-ui-chrome.cjs');
let audit = fs.readFileSync(auditPath, 'utf8');
if (!audit.includes('aria_hidden_div_in_main')) {
  audit = audit.replace(
    "{ id: 'aria_deeper_junk', re: /<div aria-hidden=\"true\">\\s*\\n\\s*Deeper (analysis|detail)/ },",
    `{ id: 'aria_deeper_junk', re: /<div aria-hidden="true">\\s*\\n\\s*Deeper (analysis|detail)/ },
  { id: 'aria_hidden_div_in_main', re: /<div aria-hidden="true">/ },`
  );
  fs.writeFileSync(auditPath, audit);
}

console.log(JSON.stringify(report, null, 2));

execSync('node scripts/audit-ui-chrome.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-weak-inbound-indexed.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/scan-ui-junk.cjs', { cwd: ROOT, stdio: 'inherit' });
