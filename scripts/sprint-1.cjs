const fs = require('fs');
const path = require('path');
const network = require('./network-sites.cjs');

const ROOT = path.join(__dirname, '..');

function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'functions' || e.name === '.git' || e.name === 'node_modules') continue;
      walkHtml(p, acc);
    } else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function networkNavInner() {
  const links = network.sites
    .map((s) => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.anchor}</a>`)
    .join(' · ');
  return `<span style="color:var(--pink,#ec4899);margin-right:.5rem">// Pattaya Authority Network ·</span>\n${links}`;
}

function buildNetworkNav() {
  return `<nav class="f-network" style="text-align:center;padding:1.5rem 1rem;border-top:1px solid var(--border,rgba(255,255,255,.07));margin-top:.5rem;font:500 .68rem/1.9 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--tl,#a1a1aa)" aria-label="Pattaya Authority Network">\n${networkNavInner()}\n</nav>`;
}

const META = {
  'best-visa/under-5k/index.html':
    'Best Thailand visa under ฿5,000 per year in 2026 — tourist TR, ED language school, and why DTV amortises to ~฿2k/yr. Honest budget tier guide from Pattaya with no agent commissions.',
  'best-visa/under-50k/index.html':
    'Best Thailand visa under ฿50,000 per year — DTV, Non-O retirement, Marriage Non-O, and ED compared with real annual costs, insurance, and extension fees for Pattaya expats in 2026.',
  'best-visa/under-1m/index.html':
    'Best Thailand visa under ฿1 million per year — LTR Wealthy Pensioner, Privilege Elite tiers, and O-X retirement compared. High-budget pathways with tax and insurance breakdowns for 2026.',
};

const ORIGIN_LINKS = {
  'visas/dtv/index.html':
    '<p class="origin-links">Arriving from abroad? See our origin guides: <a href="/pattaya/uk-to-thailand/">UK → Thailand</a> · <a href="/pattaya/usa-to-thailand/">USA → Thailand</a> · <a href="/pattaya/australia-to-thailand/">Australia → Thailand</a> · <a href="/pattaya/germany-to-thailand/">Germany → Thailand</a> · <a href="/pattaya/china-to-thailand/">China → Thailand</a> · <a href="/pattaya/india-to-thailand/">India → Thailand</a> · <a href="/pattaya/russia-to-thailand/">Russia → Thailand</a></p>\n',
  'visas/ltr/index.html':
    '<p class="origin-links">Apply from your home country: <a href="/pattaya/uk-to-thailand/">UK</a> · <a href="/pattaya/usa-to-thailand/">USA</a> · <a href="/pattaya/germany-to-thailand/">Germany</a> · <a href="/pattaya/australia-to-thailand/">Australia</a> · <a href="/guides/embassy-directory/">Embassy directory</a></p>\n',
  'visas/retirement-non-o/index.html':
    '<p class="origin-links">Retirees arriving from: <a href="/pattaya/uk-to-thailand/">UK → Thailand</a> · <a href="/pattaya/usa-to-thailand/">USA</a> · <a href="/pattaya/germany-to-thailand/">Germany</a> · <a href="/pattaya/australia-to-thailand/">Australia</a> · <a href="/guides/best-visa-retirees-over-50/">Best visa for retirees 50+</a></p>\n',
  'visas/retirement-o-a/index.html':
    '<p class="origin-links">O-A is embassy-issued before travel: <a href="/pattaya/uk-to-thailand/">UK</a> · <a href="/pattaya/usa-to-thailand/">USA</a> · <a href="/pattaya/germany-to-thailand/">Germany</a> · <a href="/guides/embassy-directory/">All embassies</a></p>\n',
  'visas/marriage-non-o/index.html':
    '<p class="origin-links">Marriage visa from abroad: <a href="/pattaya/uk-to-thailand/">UK</a> · <a href="/pattaya/usa-to-thailand/">USA</a> · <a href="/pattaya/china-to-thailand/">China</a> · <a href="/pattaya/russia-to-thailand/">Russia</a> · <a href="/guides/best-visa-couples/">Best visa for couples</a></p>\n',
  'visas/business-non-b/index.html':
    '<p class="origin-links">Work visa routes by origin: <a href="/pattaya/uk-to-thailand/">UK</a> · <a href="/pattaya/usa-to-thailand/">USA</a> · <a href="/pattaya/india-to-thailand/">India</a> · <a href="/pattaya/china-to-thailand/">China</a> · <a href="/work-permit/">Work permit hub</a></p>\n',
  'visas/education-ed/index.html':
    '<p class="origin-links">Study visa from: <a href="/pattaya/china-to-thailand/">China</a> · <a href="/pattaya/russia-to-thailand/">Russia</a> · <a href="/pattaya/india-to-thailand/">India</a> · <a href="/guides/verify-moe-accredited-school/">Verify MOE school</a></p>\n',
  'visas/privilege-elite/index.html':
    '<p class="origin-links">Privilege membership from: <a href="/pattaya/uk-to-thailand/">UK</a> · <a href="/pattaya/usa-to-thailand/">USA</a> · <a href="/pattaya/china-to-thailand/">China</a> · <a href="/best-visa/under-1m/">Visa under ฿1M/yr</a></p>\n',
  'visas/tourist-tr-evisa/index.html':
    '<p class="origin-links">Tourist entry by nationality: <a href="/pattaya/uk-to-thailand/">UK</a> · <a href="/pattaya/usa-to-thailand/">USA</a> · <a href="/pattaya/india-to-thailand/">India</a> · <a href="/pattaya/china-to-thailand/">China</a> · <a href="/guides/switch-tourist-to-non-o-retirement/">Switch to retirement</a></p>\n',
};

const BEST_VISA_LINKS =
  '<p>Budget tiers: <a href="/best-visa/under-5k/">Under ฿5k/yr</a> · <a href="/best-visa/under-20k/">Under ฿20k</a> · <a href="/best-visa/under-50k/">Under ฿50k</a> · <a href="/best-visa/under-100k/">Under ฿100k</a> · <a href="/best-visa/under-500k/">Under ฿500k</a> · <a href="/best-visa/under-1m/">Under ฿1M</a></p>\n';

const ANALYTICS_TAG = '<script src="/analytics-events.js" defer></script>\n';

const results = { analytics: 0, network: 0, meta: 0, origin: 0, bestVisa: 0 };

const networkNav = buildNetworkNav();
const networkRe = /<nav class="f-network"[\s\S]*?<\/nav>/;

for (const file of walkHtml(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');

  if (!html.includes('/analytics-events.js')) {
    html = html.replace('</body>', ANALYTICS_TAG + '</body>');
    changed = true;
    results.analytics++;
  }

  if (networkRe.test(html)) {
    const next = html.replace(networkRe, networkNav);
    if (next !== html) {
      html = next;
      changed = true;
      results.network++;
    }
  }

  if (META[rel]) {
    const esc = META[rel].replace(/"/g, '&quot;');
    html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc}" />`);
    if (html.includes('property="og:description"')) {
      html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc}" />`);
    }
    changed = true;
    results.meta++;
  }

  if (ORIGIN_LINKS[rel] && !html.includes('class="origin-links"')) {
    if (html.includes('<div class="faq">')) {
      html = html.replace('<div class="faq">', ORIGIN_LINKS[rel] + '<div class="faq">');
      changed = true;
      results.origin++;
    }
  }

  if (rel === 'best-visa/index.html' && !html.includes('Budget tiers:')) {
    html = html.replace('<main id="main" class="article-body">', '<main id="main" class="article-body">' + BEST_VISA_LINKS);
    changed = true;
    results.bestVisa++;
  }


  if (changed) fs.writeFileSync(file, html);
}

// Homepage schema sameAs
const indexPath = path.join(ROOT, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const sameAs = network.sites.map((s) => `"${s.url.replace(/\/$/, '')}"`).join(',');
indexHtml = indexHtml.replace(/"sameAs":\[[^\]]*\]/, `"sameAs":[${sameAs},"https://pattayavisahelp.com"]`);
fs.writeFileSync(indexPath, indexHtml);

console.log(JSON.stringify(results, null, 2));
