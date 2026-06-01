/**
 * Sprint 21 — nationality route pages: intro rebuild + pathway accuracy.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const countryRoutes = require('./content/sprint21-country-routes.cjs');

const CTA = `<p><strong>Free 15-min consultation</strong></p>
<h2>Want a personal answer?</h2>
<p>A real human in Pattaya replies within 24 hours.</p>
<p><a href="/contact/">Book free consult →</a> · <a href="https://api.whatsapp.com/send/?phone=66967286999&amp;text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas" target="_blank" rel="noopener noreferrer">WhatsApp +66 96 728 6999</a></p>`;

function urlToFile(p) {
  return path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function wordCount(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const text = main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(Boolean).length;
}

function rebuildCountryRoute(pagePath, intro) {
  const file = urlToFile(pagePath);
  let html = fs.readFileSync(file, 'utf8');
  const mainMatch = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) throw new Error(`No main: ${pagePath}`);

  const main = mainMatch[1];
  const deeper = main.search(/<h2>[^<]*(deeper context|expats in Thailand)[^<]*<\/h2>/i);
  if (deeper === -1) throw new Error(`No deeper-context h2: ${pagePath}`);

  let tail = main.slice(deeper);
  // Remove duplicate CTA blocks inside tail before re-append
  tail = tail.replace(/<p><strong>Free 15-min consultation<\/strong><\/p>[\s\S]*?(?=<\/main|$)/i, '').trimEnd();
  if (!tail.includes('Want a personal answer')) tail += '\n\n' + CTA;

  const body = intro.trim() + '\n' + tail;
  html = html.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/i, `<main id="main" class="article-body">\n${body}\n</main>`);
  fs.writeFileSync(file, html);

  const words = wordCount(html);
  if (words < 450) throw new Error(`${pagePath} thin after rebuild: ${words} words`);
  return { path: pagePath, words };
}

const report = [];
for (const [p, intro] of Object.entries(countryRoutes)) {
  report.push(rebuildCountryRoute(p, intro));
}

// Extend UI audit: raw quick-take line without p tag
const auditPath = path.join(ROOT, 'scripts/audit-ui-chrome.cjs');
let audit = fs.readFileSync(auditPath, 'utf8');
if (!audit.includes('raw_quick_take')) {
  audit = audit.replace(
    "{ id: 'raw_hero_stats_in_main', re: /^\\s*[^<]{0,80}\\n\\s*\\d+\\s*min read·Updated/m },",
    `{ id: 'raw_hero_stats_in_main', re: /^\\s*[^<]{0,80}\\n\\s*\\d+\\s*min read·Updated/m },
  { id: 'raw_quick_take', re: /Quick take for [^<\\n]+\\s*\\n\\s*<h2>/ },`
  );
  fs.writeFileSync(auditPath, audit);
}

console.log(JSON.stringify({ sprint: 21, rebuilt: report }, null, 2));

execSync('node scripts/audit-ui-chrome.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-weak-inbound-indexed.cjs', { cwd: ROOT, stdio: 'inherit' });
