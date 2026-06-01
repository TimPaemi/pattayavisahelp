/**
 * Sprint 26 — hub pathway cards, FAQ answer wraps, hub intro rebuilds.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const patches = require('./content/sprint26-page-patches.cjs');

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

function fixHubPathwayCards(main) {
  return main.replace(
    /<a href="([^"]+)">\s*\n\s*([^\n<]+)\s*\n\s*<h3>([^<]+)<\/h3>\s*(?:\n\s*<p>([^<]*)<\/p>\s*)?\n?\s*Read more →\s*\n<\/a>/g,
    (_, href, label, title, desc) => {
      const tag = label.trim() && label.trim() !== title.trim() ? ` <span>(${label.trim()})</span>` : '';
      const extra = desc?.trim() ? ` — ${desc.trim()}` : '';
      return `<li><a href="${href}"><strong>${title.trim()}</strong>${extra}${tag}</a></li>\n`;
    }
  );
}

function wrapUlAfterH2(main) {
  let m = main.replace(
    /(<h2>[^<]+<\/h2>\s*(?:\n\s*<p>[^<]*<\/p>\s*)?)\s*((?:<li>[\s\S]*?<\/li>\s*)+)(?!\s*<\/ul>)/g,
    '$1\n<ul>\n$2</ul>\n'
  );
  // Second pass: li blocks before section labels or next h2
  m = m.replace(
    /(<h2>[^<]+<\/h2>\s*(?:\n\s*<p>[^<]*<\/p>\s*)?)\s*((?:<li>[\s\S]*?<\/li>\s*)+)(?=\s*(?:<p><strong>|<h2>|$))/g,
    (full, head, items) => (items.includes('</ul>') ? full : `${head}\n<ul>\n${items}</ul>\n`)
  );
  return m;
}

function fixSectionLabelsBeforeH2(main) {
  const labels = [
    'Stay legal',
    'Money + property',
    'Long horizon',
    'Life in Thailand',
    'Pattaya + defence',
    'Defensive + Pattaya-specific',
  ];
  let m = main;
  for (const label of labels) {
    m = m.replace(new RegExp(`\\n\\s*${label.replace(/[+]/g, '\\+')}\\s*\\n\\s*(<h2>)`, 'g'), `\n<p><strong>${label}</strong></p>\n\n$1`);
  }
  return m;
}

function cleanFaqSummaryPlus(main) {
  return main.replace(/(<summary>\s*\n\s*[^<\n]+)\s*\n\s*\+\s*\n(\s*<\/summary>)/g, '$1\n$2');
}

function wrapFaqAnswers(main) {
  return main.replace(
    /(<\/summary>\s*\n\s*)((?:(?!<\/details>)[\s\S])*?)(\s*<\/details>)/g,
    (match, head, body, foot) => {
      const trimmed = body.trim();
      if (!trimmed || /^<[a-z]/im.test(trimmed)) return match;
      const paras = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
      const wrapped = paras.map((p) => `<p>${p.replace(/\n\s*/g, ' ')}</p>`).join('\n');
      return head + wrapped + '\n' + foot;
    }
  );
}

function fixBlogSimpleRelatedCards(main) {
  let m = main.replace(
    /<a href="([^"]+)">\s*\n\s*([^\n<]+)\s*\n\s*([^\n<]+)\s*\n\s*<\/a>/g,
    (_, href, title, desc) => `<li><a href="${href}"><strong>${title.trim()}</strong> — ${desc.trim()}</a></li>\n`
  );
  m = m.replace(
    /(<h2>Related guides<\/h2>\s*\n\s*)((?:<li>[\s\S]*?<\/li>\s*)+)/i,
    '$1<ul>\n$2</ul>\n'
  );
  return m;
}

function applyPagePatches(pagePath, main) {
  const rules = patches[pagePath];
  if (!rules) return main;
  let m = main;
  for (const [re, text] of rules) {
    if (re.test(m)) m = m.replace(re, text);
  }
  return m;
}

function normalizeMain(main) {
  let m = main;
  m = fixHubPathwayCards(m);
  m = wrapUlAfterH2(m);
  m = fixSectionLabelsBeforeH2(m);
  m = cleanFaqSummaryPlus(m);
  m = wrapFaqAnswers(m);
  m = fixBlogSimpleRelatedCards(m);
  return m;
}

function ensureStandardCta(main) {
  let m = main.trimEnd();
  if (!m.includes('Free 15-min consultation') && !m.includes('Book free consult')) {
    m += '\n\n' + CTA;
  }
  return m;
}

function processPage(pagePath) {
  const file = urlToFile(pagePath);
  if (!fs.existsSync(file)) return null;
  const { html, main } = readMain(file);
  let body = main;
  if (patches[pagePath]) body = applyPagePatches(pagePath, body);
  body = normalizeMain(body);
  if (body === main) return null;
  writeMain(file, html, body);
  return pagePath;
}

function sweepAllIndexed() {
  const fixed = [];
  for (const p of parseSitemap()) {
    if (p.startsWith('/de/') || p.startsWith('/ru/')) continue;
    try {
      const r = processPage(p);
      if (r) fixed.push(r);
    } catch (e) {
      throw new Error(`${p}: ${e.message}`);
    }
  }
  return fixed;
}

// Extend UI audit
const auditPath = path.join(ROOT, 'scripts/audit-ui-chrome.cjs');
let audit = fs.readFileSync(auditPath, 'utf8');
if (!audit.includes('broken_hub_pathway_card')) {
  audit = audit.replace(
    "{ id: 'empty_h3_block', re: /<h3>[^<]+<\\/h3>\\s*\\n\\s*<h[23]>/ },",
    `{ id: 'empty_h3_block', re: /<h3>[^<]+<\\/h3>\\s*\\n\\s*<h[23]>/ },
  { id: 'broken_hub_pathway_card', re: /<a href="[^"]+">\\s*\\n\\s*[^<\\n]+\\n\\s*<h3>/ },
  { id: 'faq_answer_no_p', re: /<\\/summary>\\s*\\n\\s*[A-Z][^<\\n]{20,}/ },
  { id: 'raw_hub_stats', re: /Country pages7|Guides38|Questions30/ },
  { id: 'raw_cta_block', re: /\\n\\s*Free 15-min consultation\\s*\\n\\s*<h2>/ },`
  );
  fs.writeFileSync(auditPath, audit);
}

const report = { sprint: 26, fixed: sweepAllIndexed() };
console.log(JSON.stringify(report, null, 2));

execSync('node scripts/audit-ui-chrome.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-comprehensive.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-weak-inbound-indexed.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/scan-ui-junk.cjs', { cwd: ROOT, stdio: 'inherit' });
