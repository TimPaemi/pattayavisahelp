/**
 * Sprint 60 — EN tools + best-visa tiers link DE/RU hubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'sprint60-tools-bestvisa';
const CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

const LOCALE_STRIP = `<p class="network-context">Locale: <a href="/de/tools/">Tools (DE)</a> · <a href="/ru/tools/">Tools (RU)</a> · <a href="/de/best-visa/">Budget (DE)</a> · <a href="/ru/best-visa/">Budget (RU)</a> · <a href="/de/visas/">Visas (DE)</a> · <a href="/de/pattaya/">Pattaya (DE)</a></p>`;

const TIER_MAP = {
  'under-5k': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/de/best-visa/', 'Budget hub (DE)'],
    ['/ru/best-visa/', 'Budget (RU)'],
    ['/guides/visa-runs-vs-extensions/', 'Runs EN'],
  ],
  'under-20k': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/de/visas/education-ed/', 'ED (DE)'],
    ['/de/best-visa/', 'Budget hub (DE)'],
    ['/tools/visa-finder/', 'Visa Finder'],
  ],
  'under-50k': [
    ['/de/visas/dtv/', 'DTV (DE)'],
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/de/compare/visa-comparison-matrix/', 'Matrix (DE)'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'under-100k': [
    ['/de/visas/retirement-o-a/', 'O-A (DE)'],
    ['/de/compare/non-o-vs-o-a/', 'Non-O vs O-A'],
    ['/guides/health-insurance/', 'Insurance EN'],
    ['/de/best-visa/', 'Budget hub (DE)'],
  ],
  'under-500k': [
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/de/visas/privilege-elite/', 'Privilege (DE)'],
    ['/de/compare/privilege-vs-ltr/', 'vs LTR'],
    ['/de/best-visa/', 'Budget hub (DE)'],
  ],
  'under-1m': [
    ['/de/visas/privilege-elite/', 'Privilege (DE)'],
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/de/best-visa/', 'Budget hub (DE)'],
    ['/ru/best-visa/', 'Budget (RU)'],
  ],
};

const TOOL_MAP = {
  'visa-finder': [
    ['/de/visas/', 'Visas (DE)'],
    ['/de/compare/visa-comparison-matrix/', 'Matrix (DE)'],
    ['/de/best-visa/', 'Budget (DE)'],
    ['/contact/', 'Consult'],
  ],
  'income-test': [
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/de/best-visa/', 'Budget (DE)'],
    ['/tools/bank-checker/', 'Bank checker'],
  ],
  'cost-calculator': [
    ['/guides/cost-of-living-pattaya/', 'CoL Pattaya'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/best-visa/', 'Budget (DE)'],
    ['/de/visas/dtv/', 'DTV (DE)'],
  ],
  'document-checklist': [
    ['/de/visas/', 'Visas (DE)'],
    ['/de/guides/', 'Guides (DE)'],
    ['/contact/', 'Consult'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'expiry-countdown': [
    ['/guides/jomtien-immigration-office/', 'Jomtien'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/guides/90-day-reporting/', '90-day'],
    ['/de/visas/', 'Visas (DE)'],
  ],
  reminder: [
    ['/guides/90-day-reporting/', '90-day'],
    ['/guides/tm30-reporting/', 'TM30'],
    ['/de/pattaya/', 'Pattaya (DE)'],
    ['/de/tools/', 'Tools (DE)'],
  ],
  'currency-converter': [
    ['/guides/cost-of-living-pattaya/', 'CoL'],
    ['/de/best-visa/', 'Budget (DE)'],
    ['/tools/cost-calculator/', 'Cost calc'],
    ['/de/pattaya/', 'Pattaya (DE)'],
  ],
  'bank-checker': [
    ['/de/visas/retirement-non-o/', 'Non-O (DE)'],
    ['/guides/thai-bank-account-as-foreigner/', 'Bank guide'],
    ['/de/best-visa/under-50k/', 'Mid tier'],
    ['/de/tools/', 'Tools (DE)'],
  ],
  eligibility: [
    ['/de/visas/ltr/', 'LTR (DE)'],
    ['/ru/visas/ltr/', 'LTR (RU)'],
    ['/de/compare/privilege-vs-ltr/', 'vs Privilege'],
    ['/blog/ltr-boi-application-checklist-2026/', 'LTR blog'],
  ],
};

function block(links) {
  const parts = links.map(([href, text]) => `<a href="${href}">${text}</a>`).join(' · ');
  return `<!-- ${MARKER} -->\n<p class="network-context">Go deeper: ${parts}</p>\n`;
}

function patch(file, links) {
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes(MARKER)) return false;
  if (!h.includes('.network-context{') && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${CSS}\n`);
  }
  const html = block(links);
  const anchors = ['<h2>FAQ</h2>', '<div class="faq">', '<h2 class="read-next-h2">', '<section class="read-next">'];
  for (const a of anchors) {
    if (h.includes(a)) {
      h = h.replace(a, `${html}${a}`);
      fs.writeFileSync(file, h);
      return true;
    }
  }
  if (h.includes('<main')) {
    h = h.replace(/<main\b[^>]*>/, (m) => `${m}\n${html}`);
    fs.writeFileSync(file, h);
    return true;
  }
  return false;
}

let n = 0;
const toolsDir = path.join(ROOT, 'tools');
for (const slug of fs.readdirSync(toolsDir)) {
  const file = path.join(toolsDir, slug, 'index.html');
  if (!fs.existsSync(file) || slug === 'index.html') continue;
  const links = TOOL_MAP[slug];
  if (!links) continue;
  if (patch(file, links)) {
    n++;
    console.log('tool', slug);
  }
}

// tools hub
const toolsHub = path.join(toolsDir, 'index.html');
let th = fs.readFileSync(toolsHub, 'utf8');
if (!th.includes(MARKER)) {
  th = th.replace(/<p class="network-context">/, `<p class="network-context">Also: <a href="/de/tools/">Tools (DE)</a> · <a href="/ru/tools/">Tools (RU)</a> · `);
  if (!th.includes(MARKER)) {
    th = th.replace('<main id="main"', `<!-- ${MARKER} -->\n${LOCALE_STRIP}\n<main id="main"`);
  }
  fs.writeFileSync(toolsHub, th);
  console.log('tool', 'index hub');
}

const bvDir = path.join(ROOT, 'best-visa');
for (const slug of fs.readdirSync(bvDir)) {
  const file = path.join(bvDir, slug, 'index.html');
  if (!fs.existsSync(file) || slug === 'index.html') continue;
  const links = TIER_MAP[slug];
  if (!links) continue;
  if (patch(file, links)) {
    n++;
    console.log('best-visa', slug);
  }
}

const bvHub = path.join(bvDir, 'index.html');
let bh = fs.readFileSync(bvHub, 'utf8');
if (!bh.includes('/ru/best-visa/') || !bh.includes('Budget (RU)')) {
  bh = bh.replace(
    /<p class="network-context">/,
    (m, off) => {
      if (bh.slice(off, off + 200).includes('/ru/best-visa/')) return m;
      return `${m}Tiers locale: <a href="/de/best-visa/">Budget (DE)</a> · <a href="/ru/best-visa/">Budget (RU)</a> · `;
    }
  );
  fs.writeFileSync(bvHub, bh);
  console.log('best-visa', 'index hub');
}

console.log(`Sprint 60 tools/best-visa: ${n} pages`);
