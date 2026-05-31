/**
 * Sprint 16 — apply expanded content to thin indexed pages, run quality gate.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const CTA = `<p><strong>Free 15-min consultation</strong></p>
<h2>Want a personal answer?</h2>
<p>A real human in Pattaya replies within 24 hours.</p>
<p><a href="/contact/">Book free consult →</a> · <a href="https://api.whatsapp.com/send/?phone=66967286999&amp;text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas" target="_blank" rel="noopener noreferrer">WhatsApp +66 96 728 6999</a></p>`;

function wordCount(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const text = main.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(Boolean).length;
}

function minWords(p) {
  if (p.startsWith('/blog/')) return 500;
  if (p.startsWith('/visas/') || p.startsWith('/guides/') || p.startsWith('/compare/')) return 600;
  return 400;
}

function urlToFile(p) {
  if (p === '/') return path.join(ROOT, 'index.html');
  return path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

/** Tools pages: prepend prose, keep interactive UI */
const TOOL_PREPEND = new Set([
  '/tools/', '/tools/visa-finder/', '/tools/cost-calculator/', '/tools/income-test/',
  '/tools/document-checklist/', '/tools/expiry-countdown/', '/tools/bank-checker/',
  '/tools/currency-converter/', '/tools/eligibility/', '/tools/reminder/',
]);

function applyArticleBody(file, body) {
  let html = fs.readFileSync(file, 'utf8');
  if (/<main id="main" class="article-body">/.test(html)) {
    html = html.replace(/<main id="main" class="article-body">[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${body}\n</main>`);
  } else if (/<main id="main"/.test(html)) {
    html = html.replace(/(<main id="main"[^>]*>)/, `$1\n<section class="tool-prose article-body">\n${body}\n</section>\n`);
  } else {
    throw new Error(`No main tag: ${file}`);
  }
  fs.writeFileSync(file, html);
}

const bodies = Object.assign(
  {},
  require('./content/sprint16-best-visa.cjs'),
  require('./content/sprint16-tools.cjs'),
  require('./content/sprint16-glossary.cjs'),
  Object.fromEntries(
    Object.entries(require('./content/sprint16-professions.cjs')).map(([k, v]) => [
      k.startsWith('/') ? k : `/professions/${k}/`,
      v,
    ])
  ),
  require('./content/sprint16-compare-guides.cjs'),
  require('./content/sprint16-hubs.cjs')
);

// Append CTA where missing
for (const [p, body] of Object.entries(bodies)) {
  if (!body.includes('Want a personal answer') && !p.startsWith('/tools/')) {
    bodies[p] = body + '\n' + CTA;
  }
}

const report = { applied: [], failed: [] };

execSync('node scripts/fix-dup-robots-locale-visas.cjs', { cwd: ROOT, stdio: 'inherit' });

const SKIP_PATHS = new Set(['/sitemap/']);

for (const [p, body] of Object.entries(bodies)) {
  if (SKIP_PATHS.has(p)) continue;
  const file = urlToFile(p);
  if (!fs.existsSync(file)) {
    console.error('Missing file for', p);
    process.exit(1);
  }
  applyArticleBody(file, body);
  const words = wordCount(fs.readFileSync(file, 'utf8'));
  const need = minWords(p);
  const row = { path: p, words, need, pass: words >= need };
  report.applied.push(row);
  if (!row.pass) report.failed.push(row);
}

execSync('node scripts/fix-sitemap-chrome.cjs', { cwd: ROOT, stdio: 'inherit' });

execSync('node scripts/rebuild-sitemaps.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });

console.log(JSON.stringify({ applied: report.applied.length, failed: report.failed.length, fails: report.failed }, null, 2));

if (report.failed.length) process.exit(1);
console.log('Sprint 16 expand gate: PASS');
