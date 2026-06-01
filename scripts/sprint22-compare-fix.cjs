/**
 * Sprint 22 — premium compare pages UI rebuild + retirement city guide + glossary B.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const intros = require('./content/sprint22-compare-intros.cjs');

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

function normalizeSectionLabels(main) {
  return main.replace(/\n\s*<p>0(\d)\s*\/\s*([^<]+)<\/p>/g, '\n<p><strong>0$1 · $2</strong></p>');
}

function fixBrokenAltCards(main) {
  let m = main.replace(
    /<a href="([^"]+)">\s*<p>([^<]+)<\/p>\s*<h3>([^<]+)<\/h3>\s*<p>([^<]+)<\/p>\s*<\/a>/g,
    (_, href, label, title, desc) =>
      `<li><a href="${href}"><strong>${title.trim()}</strong> — ${desc.trim()} <span>(${label.trim()})</span></a></li>`
  );
  m = m.replace(
    /(<h2>Related guides<\/h2>\s*\n\s*)((?:<li>[\s\S]*?<\/li>\s*)+)/gi,
    '$1<ul>\n$2</ul>\n'
  );
  m = m.replace(
    /(<h2>Don't qualify for either\?[^<]*<\/h2>\s*\n\s*)((?:<li>[\s\S]*?<\/li>\s*)+)/,
    '$1<ul>\n$2</ul>\n'
  );
  return m;
}

function cleanDuplicateCta(main) {
  const blocks = main.match(/<p><strong>Free 15-min consultation<\/strong><\/p>[\s\S]*?(?=(<p><strong>Free 15-min consultation<\/strong>)|$)/g);
  if (!blocks || blocks.length <= 1) return main;
  // Keep last standard CTA; remove earlier partial CTAs
  let m = main;
  const partial = /<p><strong>Free 15-min consultation<\/strong><\/p>\s*\n\s*<h2>[^<]+<\/h2>\s*\n\s*<p>[^<]+<\/p>\s*\n\s*(?=<p><strong>Free 15-min consultation)/g;
  m = m.replace(partial, '');
  return m;
}

function fixScenarioLabels(main) {
  return main
    .replace(/\n\s*<p>Scenario ([AB]) · ([^<]+)<\/p>/g, '\n<p><strong>Scenario $1 · $2</strong></p>')
    .replace(/\n\s*<p>Profile · ([^<]+)<\/p>/g, '\n<p><strong>Profile · $1</strong></p>')
    .replace(/\n\s*<p>Result for this profile · ([^<]+)<\/p>/g, '\n<p><strong>Result · $1</strong></p>')
    .replace(/\n\s*<p>(\d+-year cost · [^<]+)<\/p>/g, '\n<p><strong>$1</strong></p>')
    .replace(/\n\s*<p>(Privilege · [^<]+)<\/p>/g, '\n<p><strong>$1</strong></p>')
    .replace(/\n\s*<p>(LTR · [^<]+)<\/p>/g, '\n<p><strong>$1</strong></p>');
}

function ensureCta(main) {
  let m = cleanDuplicateCta(main);
  m = m.replace(/<p><strong>Free 15-min consultation<\/strong><\/p>[\s\S]*?(?=<\/main|$)/i, '').trimEnd();
  if (!m.includes('Want a personal answer')) m += '\n\n' + CTA;
  return m;
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

function fixAllBrokenAltCards() {
  const sitemap = parseSitemap();
  const fixed = [];
  for (const p of sitemap) {
    if (p.startsWith('/de/') || p.startsWith('/ru/')) continue;
    const file = urlToFile(p);
    if (!fs.existsSync(file)) continue;
    const { html, main } = readMain(file);
    if (!/<a href="[^"]+">\s*<p>[^<]+<\/p>\s*<h3>/.test(main)) continue;
    let body = fixBrokenAltCards(main);
    body = ensureCta(body);
    writeMain(file, html, body);
    fixed.push(p);
  }
  return fixed;
}

function rebuildCompareIntro(pagePath, intro) {
  const file = urlToFile(pagePath);
  const { html, main } = readMain(file);
  const marker = main.search(/<p>(?:<strong>)?0\d\s*[·\/]/);
  if (marker === -1) throw new Error(`No section marker: ${pagePath}`);
  let body = intro.trim() + '\n' + main.slice(marker);
  body = normalizeSectionLabels(body);
  body = fixBrokenAltCards(body);
  body = fixScenarioLabels(body);
  body = ensureCta(body);
  writeMain(file, html, body);
  return pagePath;
}

function rebuildRetirementGuide() {
  const pagePath = '/guides/pattaya-vs-phuket-vs-chiang-mai-retirement/';
  const file = urlToFile(pagePath);
  const { html, main } = readMain(file);
  const intro = intros[pagePath].trim();
  const marker = main.search(/<h2>Side-by-side comparison<\/h2>/);
  if (marker === -1) throw new Error('No side-by-side h2');
  let body = intro + '\n' + main.slice(marker);
  // Fix Phuket section: move avoid-if content under proper best-for prose
  body = body.replace(
    /<h2>Phuket: best for…<\/h2>\s*\n\s*<p><strong>Avoid if<\/strong>: you're on a tight pension budget — Phuket's price floor is 30% higher than Pattaya for equivalent quality\.<\/p>/,
    `<h2>Phuket: best for…</h2>
<p>Premium beach lifestyle, excellent hospitals, island atmosphere, and Patong-area expat scene. Better for higher budgets and couples who prioritise beach quality over immigration-office convenience.</p>
<p><strong>Avoid if:</strong> you are on a tight pension budget — Phuket's price floor is 30% higher than Pattaya for equivalent quality.</p>`
  );
  body = ensureCta(body);
  writeMain(file, html, body);
  return pagePath;
}

function fixGlossaryB() {
  const file = urlToFile('/guides/glossary/');
  const { html, main } = readMain(file);
  const body = main.replace(
    /<h2>B<\/h2>\s*\n\s*\n\s*<p><strong>BOI/,
    `<h2>B</h2>
<p><strong>BOI`
  );
  writeMain(file, html, body);
  return '/guides/glossary/';
}

const report = [];
for (const p of ['/compare/dtv-vs-ltr/', '/compare/privilege-vs-ltr/', '/compare/non-o-vs-o-a/']) {
  report.push(rebuildCompareIntro(p, intros[p]));
}
report.push(rebuildRetirementGuide());
report.push(fixGlossaryB());
report.push(...fixAllBrokenAltCards());

// Extend UI audit
const auditPath = path.join(ROOT, 'scripts/audit-ui-chrome.cjs');
let audit = fs.readFileSync(auditPath, 'utf8');
const additions = [
  "{ id: 'orphan_recommend_link', re: /Get our recommendation<\\/a>\\s*\\n\\s*<a href=\"#/ },",
  "{ id: 'raw_section_label', re: /\\n\\s*<p>0\\d\\s*\\/\\s*[^<]+<\\/p>/ },",
  "{ id: 'broken_visa_alt_card', re: /<a href=\"[^\"]+\">\\s*<p>[^<]+<\\/p>\\s*<h3>/ },",
  "{ id: 'raw_quick_verdict', re: /\\n\\s*Quick verdict\\s*\\n\\s*<h2>/ },",
];
for (const line of additions) {
  const id = line.match(/id: '([^']+)'/)[1];
  if (!audit.includes(id)) {
    audit = audit.replace(
      "{ id: 'empty_h2_back_to_back', re: /<h2>[^<]+<\\/h2>\\s*(<\\/div>\\s*)?<h2>/ },",
      `{ id: 'empty_h2_back_to_back', re: /<h2>[^<]+<\\/h2>\\s*(<\\/div>\\s*)?<h2>/ },\n  ${line}`
    );
  }
}
fs.writeFileSync(auditPath, audit);

console.log(JSON.stringify({ sprint: 22, fixed: report }, null, 2));

execSync('node scripts/audit-ui-chrome.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-weak-inbound-indexed.cjs', { cwd: ROOT, stdio: 'inherit' });
