/**
 * Sprint 20 — Extended UI sweep: hero stats junk, empty h2, mangled cards, in-main footer.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const sectionFills = require('./content/sprint20-section-fills.cjs');
const pagePatches = require('./content/sprint20-page-patches.cjs');

const CTA = `<p><strong>Free 15-min consultation</strong></p>
<h2>Want a personal answer?</h2>
<p>A real human in Pattaya replies within 24 hours.</p>
<p><a href="/contact/">Book free consult →</a> · <a href="https://api.whatsapp.com/send/?phone=66967286999&amp;text=Hi%20from%20pattayavisahelp.com%20%E2%80%94%20I%20have%20a%20question%20about%20Thai%20visas" target="_blank" rel="noopener noreferrer">WhatsApp +66 96 728 6999</a></p>`;

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function write(rel, html) {
  fs.writeFileSync(path.join(ROOT, rel), html);
}

function urlToFile(p) {
  if (p === '/') return path.join(ROOT, 'index.html');
  return path.join(ROOT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function stripHeroStats(main) {
  if (!/min read·Updated/.test(main.slice(0, 900))) return main;
  let out = main.replace(/^[\s\S]*?\d+\s*min read·Updated[^\n]*\n+/m, '');
  // Also strip label line immediately before stats if still at top (e.g. "Compliance guide · Verified")
  out = out.replace(/^[\s\S]{0,120}?· Verified[^\n]*\n+\s*\d+\s*min read·Updated[^\n]*\n+/m, '');
  return out;
}

function removeAriaJunk(main) {
  return main.replace(
    /<div aria-hidden="true">\s*\n\s*[^<\n][^\n]*\n\s*\d+\s*min read·Updated[^\n]*\n[\s\S]*?<\/div>\s*/gi,
    ''
  );
}

function fixRawLabels(main) {
  let m = main;
  m = m.replace(/\n\s*Free 15-minute call\s*\n/g, '\n<p><strong>Free 15-min consultation</strong></p>\n');
  m = m.replace(/\n\s*Deep dive\s*\n/g, '\n');
  m = m.replace(/\n\s*FAQ\s*\n(\s*<h2>)/g, '\n$1');
  m = m.replace(/\n\s*Hidden cost most miss\s*\n/g, '\n<h3>Hidden cost most miss</h3>\n');
  m = m.replace(/\n\s*The 30-second answer\s*\n/g, '\n<p><strong>The 30-second answer</strong></p>\n');
  m = m.replace(/\n\s*Quick take for American citizens\s*\n/g, '\n<p><strong>Quick take for American citizens</strong></p>\n');
  m = m.replace(/\n\s*Quick take for ([^\n]+)\s*\n/g, '\n<p><strong>Quick take for $1</strong></p>\n');
  return m;
}

function trimInMainFooter(main) {
  let m = main;
  m = m.replace(/\n\s*Related\s*\n\s*<h2>You might also need<\/h2>[\s\S]*$/i, '');
  m = m.replace(/\n\s*PVH\s*\n\s*Written by[\s\S]*$/i, '');
  m = m.replace(/\n\s*Written by\s*\n\s*<h3>Pattaya Visa Help<\/h3>[\s\S]*$/i, '');
  return m.trimEnd();
}

function fixPathwayCards(main) {
  let m = main.replace(
    /<a href="(\/visas\/[^"]+\/)">\s*\n\s*([^→\n]+?)\s*→\s*\n\s*([^\n<]+?)\s*\n\s*<\/a>/g,
    (_, href, title, desc) => `<li><a href="${href}"><strong>${title.trim()}</strong> — ${desc.trim()}</a></li>`
  );
  // Wrap orphan li blocks after "pathways" h2 in ul
  m = m.replace(
    /(<h2>[^<]*pathways[^<]*<\/h2>\s*\n\s*)((?:<li>[\s\S]*?<\/li>\s*)+)/gi,
    '$1<ul>\n$2</ul>\n'
  );
  return m;
}

function fixLandBorderRaw(main) {
  return main.replace(
    /(<h2>Visa-exempt entry[^<]*<\/h2>\s*\n\s*)\n?\s*Land border cap \(Nov 2025\)\s*\n\s*([^\n<]+)/gi,
    '$1<p><strong>Land border cap (Nov 2025):</strong> $2</p>'
  );
}

function fix90DayIntroStats(main) {
  if (!/<p>Free<\/p>/.test(main)) return main;
  return main.replace(
    /<p>Free<\/p>\s*<p>If filed on time<\/p>\s*<p>Late penalty<\/p>\s*<p>฿2,000<\/p>\s*<p>Up to ฿5k if caught at checkpoint<\/p>/,
    `<table tabindex="0">
<thead><tr><th scope="col">Filing status</th><th scope="col">Cost</th></tr></thead>
<tbody>
<tr><td>On time (online or in person)</td><td>Free</td></tr>
<tr><td>Late (1–7 days)</td><td>฿2,000 fine at Jomtien</td></tr>
<tr><td>Very late / caught at checkpoint</td><td>Up to ฿5,000</td></tr>
</tbody>
</table>`
  );
}

function fixBudgetCards(main) {
  if (!/Frugal retiree/.test(main) || /<h3>Frugal retiree/.test(main)) return main;

  const wrap = (label, amount, usd, items) => {
    const lis = items
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `<li>${l.replace(/^•\s*/, '')}</li>`)
      .join('\n');
    return `<div class="budget-block">
<h3>${label}</h3>
<p><strong>${amount}</strong> <span>${usd}</span></p>
<ul>
${lis}
</ul>
</div>`;
  };

  // Simplified: wrap three budget tiers if raw text pattern detected
  let m = main.replace(
    /(<h2>Three sample monthly budgets<\/h2>\s*\n\s*)Frugal retiree\s*\n\s*฿32,000\s*\n\s*≈ \$920 \/ month\s*\n\s*<ul>([\s\S]*?)<\/ul>\s*\n\s*Comfortable expat\s*\n\s*฿65,000\s*\n\s*≈ \$1,870 \/ month\s*\n\s*<ul>([\s\S]*?)<\/ul>\s*\n\s*Premium couple\s*\n\s*฿140,000\s*\n\s*≈ \$4,030 \/ month\s*\n\s*<ul>([\s\S]*?)<\/ul>/,
    (_, head, ul1, ul2, ul3) =>
      `${head}<div class="budget-blocks">
${wrap('Frugal retiree', '฿32,000', '≈ $920 / month', ul1.replace(/<\/?ul>/g, '').replace(/<\/?li>/g, '\n').replace(/•/g, ''))}
${wrap('Comfortable expat', '฿65,000', '≈ $1,870 / month', ul2.replace(/<\/?ul>/g, '').replace(/<\/?li>/g, '\n').replace(/•/g, ''))}
${wrap('Premium couple', '฿140,000', '≈ $4,030 / month', ul3.replace(/<\/?ul>/g, '').replace(/<\/?li>/g, '\n').replace(/•/g, ''))}
</div>`
  );
  return m;
}

function fillEmptyH2(main, pagePath) {
  const fills = sectionFills[pagePath];
  if (!fills) return main;

  let m = main;
  for (const [heading, html] of Object.entries(fills)) {
    const esc = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const emptyRe = new RegExp(`(<h2>${esc}<\\/h2>)\\s*(?=<h2>|$)`, 'i');
    const filledRe = new RegExp(`<h2>${esc}<\\/h2>\\s*<(?:p|ul|table|ol|div)`, 'i');
    if (emptyRe.test(m) && !filledRe.test(m)) {
      m = m.replace(emptyRe, `$1\n${html}\n`);
    }
  }
  return m;
}

function removeDuplicateDeepDive(main) {
  // If page has two "Want a personal answer" or duplicate FAQ h2, keep first CTA block only
  const faqCount = (main.match(/<h2>[^<]*FAQ[^<]*<\/h2>/gi) || []).length;
  if (faqCount <= 1) return main;

  const firstFaq = main.search(/<h2>[^<]*FAQ[^<]*<\/h2>/i);
  const secondFaq = main.slice(firstFaq + 1).search(/<h2>[^<]*FAQ[^<]*<\/h2>/i);
  if (secondFaq === -1) return main;

  const cutAt = firstFaq + 1 + secondFaq;
  // Keep deep-dive prose between first FAQ end and second FAQ — but remove second FAQ block
  // Simpler: remove from second FAQ through in-main footer
  const tail = main.slice(cutAt);
  const footerStart = tail.search(/\n\s*(Related\s*\n\s*<h2>|PVH\s*\n|Written by\s*\n)/i);
  const keepBeforeSecond = main.slice(0, cutAt);
  const afterSecond = footerStart >= 0 ? tail.slice(footerStart) : '';
  return keepBeforeSecond.replace(/\n\s*Deep dive\s*\n[\s\S]*?(?=\n\s*FAQ\s*\n|\n\s*<h2>[^<]*FAQ)/i, '\n') + afterSecond;
}

function removeOrphanMarkup(main) {
  let m = main;
  // Leading orphan closing div + junk label lines
  m = m.replace(/^[\s\S]*?<\/div>\s*\n(?=\s*<h2>)/m, '');
  m = m.replace(/^The hard rule first\s*\n\s*<\/div>\s*\n/m, '');
  m = m.replace(/^Quick verdict\s*\n\s*<\/div>\s*\n/m, '');
  m = m.replace(/^Quick reference\s*\n\s*<\/div>\s*\n/m, '');
  m = m.replace(/^\s*<\/div>\s*\n/m, '');
  return m;
}

function fixMethodologyStats(main) {
  return main.replace(
    /Tier-1 sourcesRoyal Gazette\s*\n Refresh cycle14 days\s*\n Agent kickbacksNone\s*\n Errors flaggedPublic\s*\n/m,
    `<table tabindex="0">
<thead><tr><th scope="col">Metric</th><th scope="col">Our standard</th></tr></thead>
<tbody>
<tr><td>Tier-1 sources</td><td>Royal Gazette, Immigration Bureau, MFA, BOI</td></tr>
<tr><td>Refresh cycle</td><td>14 days on visa pages; immediate on Royal Gazette changes</td></tr>
<tr><td>Agent kickbacks</td><td>None — ever</td></tr>
<tr><td>Errors flagged</td><td>Public changelog + email correction within 48 hours</td></tr>
</tbody>
</table>\n`
  );
}

function dedupeSitemap(main) {
  const marker = '<h2>All pages by section</h2>';
  const idx = main.indexOf(marker);
  if (idx === -1) return main;
  return main.slice(0, idx).trimEnd();
}

function applyPagePatch(main, pagePath) {
  const patch = pagePatches[pagePath];
  if (!patch) return main;
  // Replace junk intro before first h2 or table
  const cut = main.search(/<(h2|table|article)/i);
  if (cut <= 0) return patch + main;
  return patch + main.slice(cut);
}

function cleanMainBody(main, pagePath) {
  let m = main;
  m = stripHeroStats(m);
  m = removeOrphanMarkup(m);
  m = removeAriaJunk(m);
  if (pagePath === '/methodology/') m = fixMethodologyStats(m);
  if (pagePath === '/sitemap/') m = dedupeSitemap(m);
  if (pagePatches[pagePath]) m = applyPagePatch(m, pagePath);
  m = fixRawLabels(m);
  m = fix90DayIntroStats(m);
  m = fixBudgetCards(m);
  m = fixPathwayCards(m);
  m = fixLandBorderRaw(m);
  m = fillEmptyH2(m, pagePath);
  m = removeDuplicateDeepDive(m);
  m = trimInMainFooter(m);
  if (!m.includes('Want a personal answer')) {
    m = m + '\n\n' + CTA;
  }
  return m;
}

function pagePathFromRel(rel) {
  const norm = rel.replace(/\\/g, '/');
  if (norm === 'index.html') return '/';
  return '/' + norm.replace('/index.html', '') + '/';
}

function replaceMain(rel, transform) {
  let html = read(rel);
  const match = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/i);
  if (!match) return false;
  const cleaned = transform(match[1], pagePathFromRel(rel));
  html = html.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/i, `<main id="main" class="article-body">\n${cleaned}\n</main>`);
  write(rel, html);
  return true;
}

function walkHtml(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'functions' || e.name === '.git' || e.name === 'node_modules') continue;
      walkHtml(p, cb);
    } else if (e.name === 'index.html') cb(p);
  }
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
let fixed = 0;

walkHtml(ROOT, (file) => {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const pagePath = rel === 'index.html' ? '/' : '/' + rel.replace('/index.html', '') + '/';
  if (!sitemap.has(pagePath) || pagePath.startsWith('/de/') || pagePath.startsWith('/ru/')) return;

  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const needs =
    /min read·Updated/.test(main.slice(0, 900)) ||
    /<div aria-hidden="true">\s*\n\s*[^<]+\n\s*\d+ min read·Updated/.test(main) ||
    /\n\s*Free 15-minute call\s*\n/.test(main) ||
    /\n\s*PVH\s*\n/.test(main) ||
    /<h2>[^<]+<\/h2>\s*(<\/div>\s*)?<h2>/.test(main) ||
    sectionFills[pagePath] ||
    pagePatches[pagePath] ||
    pagePath === '/sitemap/' ||
    pagePath === '/methodology/';

  if (!needs && !pagePatches[pagePath]) return;

  const relPath = rel;
  replaceMain(relPath, (body, p) => cleanMainBody(body, p));
  fixed++;
});

console.log(JSON.stringify({ sprint: 20, pagesFixed: fixed }, null, 2));

execSync('node scripts/audit-ui-chrome.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-content-quality.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-broken-links.cjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/audit-weak-inbound-indexed.cjs', { cwd: ROOT, stdio: 'inherit' });
