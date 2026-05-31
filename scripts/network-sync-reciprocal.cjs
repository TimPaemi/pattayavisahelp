/**
 * Add Pattaya Visa Help link to sister-site footers in ../<repo>/
 * Run from pattayavisahelp: node scripts/network-sync-reciprocal.cjs
 */
const fs = require('fs');
const path = require('path');
const network = require('./network-sites.cjs');

const PROJECTS = path.join(__dirname, '..', '..');
const VISA = network.visaHelp;
const LINK = `<a href="${VISA.url}" target="_blank" rel="noopener noreferrer">${VISA.anchor}</a>`;
const LINK_ALT = `href="${VISA.url}"`;

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', '_research', 'functions'].includes(e.name) || e.name.startsWith('_')) continue;
      walkHtml(p, acc);
    } else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function injectLink(html) {
  if (html.includes(VISA.url)) return null;
  // Try f-network nav
  if (/<nav[^>]*class="[^"]*f-network[^"]*"/i.test(html)) {
    return html.replace(/(<nav[^>]*class="[^"]*f-network[^"]*"[^>]*>[\s\S]*?)(<\/nav>)/i, (m, open, close) => {
      if (open.includes(VISA.url)) return m;
      return open + ' · ' + LINK + close;
    });
  }
  // Try footer before closing
  if (/<footer[\s\S]*<\/footer>/i.test(html)) {
    return html.replace(/<\/footer>/i, `<p class="network-visa-link" style="text-align:center;margin-top:1rem;font-size:.85rem">${LINK} · Thailand visa guidance</p>\n</footer>`);
  }
  // Before </body>
  if (html.includes('</body>')) {
    return html.replace('</body>', `<p style="text-align:center;padding:1rem;font-size:.85rem">${LINK}</p>\n</body>`);
  }
  return null;
}

const report = { repos: {}, total: 0 };

for (const site of network.sites) {
  const repoDir = path.join(PROJECTS, site.repo);
  if (!fs.existsSync(repoDir)) {
    report.repos[site.repo] = { status: 'missing', updated: 0 };
    continue;
  }
  let updated = 0;
  for (const file of walkHtml(repoDir)) {
    const html = fs.readFileSync(file, 'utf8');
    const next = injectLink(html);
    if (next && next !== html) {
      fs.writeFileSync(file, next);
      updated++;
    }
  }
  report.repos[site.repo] = { status: 'ok', updated };
  report.total += updated;
}

console.log(JSON.stringify(report, null, 2));
