/**
 * Sprint 25 — article wrapper cleanup, callout fixes, empty section fills.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const patches = require('./content/sprint25-page-patches.cjs');

const CTA = `<p><strong>Free 15-min consultation</strong></p>
<h2>Want a personal answer?</h2>
<p>A real human in Pattaya replies within 24 hours.</p>
<p><a href="/contact/">Book free consult →</a> · <a href="https://api.whatsapp.com/send/?phone=66967286999&amp;text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas" target="_blank" rel="noopener noreferrer">WhatsApp +66 96 728 6999</a></p>`;

const ARTICLE_PAGES = [
  '/guides/90-day-reporting/',
  '/guides/health-insurance/',
  '/guides/jomtien-immigration-office/',
  '/guides/visa-runs-vs-extensions/',
  '/guides/visa-scams-pattaya/',
  '/blog/tdac-step-by-step/',
  '/blog/2026-thailand-visa-changes-recap/',
];

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

function unwrapArticle(main) {
  return main
    .replace(/^\s*<article>\s*\n/i, '')
    .replace(/\n\s*<article>\s*\n/g, '\n')
    .replace(/\n\s*<\/article>\s*(?=\n\n<p><strong>Free 15-min)/i, '\n')
    .replace(/\n\s*<\/article>\s*$/i, '')
    .replace(/\n\s*<\/article>\s*\n/g, '\n');
}

function stripArticleTagsSiteWide() {
  const fixed = [];
  for (const p of parseSitemap()) {
    if (p.startsWith('/de/') || p.startsWith('/ru/')) continue;
    const file = urlToFile(p);
    if (!fs.existsSync(file)) continue;
    const { html, main } = readMain(file);
    if (!/<article>/.test(main)) continue;
    let body = unwrapArticle(main);
    writeMain(file, html, body);
    fixed.push(p);
  }
  return fixed;
}

function ensureStandardCta(main) {
  let m = main.trimEnd();
  if (!m.includes('Want a personal answer')) m += '\n\n' + CTA;
  return m;
}

function applyReplacements(main, replacements) {
  let m = main;
  for (const [re, text] of replacements) {
    if (!re.test(m)) throw new Error(`Pattern not found: ${re}`);
    m = m.replace(re, text);
  }
  return m;
}

function fixBankAccount() {
  const p = '/guides/thai-bank-account-as-foreigner/';
  const cfg = patches[p];
  const file = urlToFile(p);
  const { html, main } = readMain(file);
  let body = main;
  if (!body.includes('Related:</strong>')) {
    const idx = body.search(cfg.start);
    if (idx === -1) throw new Error('Bank account start not found');
    body = cfg.intro.trim() + '\n' + body.slice(idx);
  }
  for (const { after, content } of cfg.fills) {
    if (after.test(body)) body = body.replace(after, content);
  }
  body = ensureStandardCta(body);
  writeMain(file, html, body);
  return p;
}

function fixPatchedPage(pagePath) {
  const cfg = patches[pagePath];
  if (!cfg?.replacements) return null;
  const file = urlToFile(pagePath);
  const { html, main } = readMain(file);
  let body = applyReplacements(main, cfg.replacements);
  body = unwrapArticle(body);
  body = ensureStandardCta(body);
  writeMain(file, html, body);
  return pagePath;
}

function fixAllPatchedPages() {
  const fixed = [];
  for (const pagePath of Object.keys(patches)) {
    if (pagePath === '/guides/thai-bank-account-as-foreigner/') continue;
    try {
      const r = fixPatchedPage(pagePath);
      if (r) fixed.push(r);
    } catch (e) {
      // Skip if already applied
      if (!String(e.message).includes('Pattern not found')) throw e;
    }
  }
  return fixed;
}

function unwrapAllArticlePages() {
  const fixed = [];
  for (const p of ARTICLE_PAGES) {
    const file = urlToFile(p);
    if (!fs.existsSync(file)) continue;
    const { html, main } = readMain(file);
    if (!/<article>/.test(main)) continue;
    let body = unwrapArticle(main);
    body = ensureStandardCta(body);
    writeMain(file, html, body);
    fixed.push(p);
  }
  return fixed;
}

function sweepEmptyH3() {
  const fixed = [];
  const re = /<h3>[^<]+<\/h3>\s*\n\s*(?=<h[23]>)/;
  for (const p of parseSitemap()) {
    if (p.startsWith('/de/') || p.startsWith('/ru/')) continue;
    const file = urlToFile(p);
    if (!fs.existsSync(file)) continue;
    const { html, main } = readMain(file);
    if (!re.test(main)) continue;
    // Only auto-fix if we have a patch entry
    if (!patches[p]?.fills && !patches[p]?.replacements?.some(([r]) => String(r).includes('h3'))) continue;
    fixed.push(p);
  }
  return fixed;
}

const report = {
  sprint: 25,
  bankAccount: fixBankAccount(),
  patched: [],
  unwrapped: [],
};

report.patched = fixAllPatchedPages();

report.unwrapped = stripArticleTagsSiteWide();

// Extend UI audit
const auditPath = path.join(ROOT, 'scripts/audit-ui-chrome.cjs');
let audit = fs.readFileSync(auditPath, 'utf8');
if (!audit.includes('article_wrapper_in_main')) {
  audit = audit.replace(
    "{ id: 'aria_hidden_div_in_main', re: /<div aria-hidden=\"true\">/ },",
    `{ id: 'aria_hidden_div_in_main', re: /<div aria-hidden="true">/ },
  { id: 'article_wrapper_in_main', re: /<article>/ },
  { id: 'raw_callout_line', re: /\n(?:Timing matters|Important|Note|Warning|Read this first|If you have overstayed)\n[^<]/ },
  { id: 'empty_h3_block', re: /<h3>[^<]+<\\/h3>\\s*\\n\\s*<h[23]>/ },`
  );
  fs.writeFileSync(auditPath, audit);
}

// Extend scan-ui-junk
const scanPath = path.join(ROOT, 'scripts/scan-ui-junk.cjs');
let scan = fs.readFileSync(scanPath, 'utf8');
if (!scan.includes('articleWrap')) {
  scan = scan.replace(
    '  const ariaJunk = /<div aria-hidden="true">',
    `  const articleWrap = /<article>/.test(main);
  const rawCallout = /\\n(?:Timing matters|Important|Note|Warning)\\n[^<]/.test(main);
  const emptyH3 = /<h3>[^<]+<\\/h3>\\s*\\n\\s*<h[23]>/.test(main);
  const ariaJunk = /<div aria-hidden="true">`
  );
  scan = scan.replace(
    '  if (rawStats || emptyH2 || ariaJunk) {',
    '  if (rawStats || emptyH2 || ariaJunk || articleWrap || rawCallout || emptyH3) {'
  );
  scan = scan.replace(
    "issues.push({ path: p, rawStats, emptyH2, ariaJunk });",
    'issues.push({ path: p, rawStats, emptyH2, ariaJunk, articleWrap, rawCallout, emptyH3 });'
  );
  fs.writeFileSync(scanPath, scan);
}

report.emptyH3Remaining = sweepEmptyH3();

console.log(JSON.stringify(report, null, 2));

execSync('node scripts/audit-ui-chrome.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-weak-inbound-indexed.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/scan-ui-junk.cjs', { cwd: ROOT, stdio: 'inherit' });
