const fs = require('fs');
const path = require('path');
const glossaryLinks = require('./content/sprint32-glossary-links.cjs');

const ROOT = path.join(__dirname, '..');
const NETWORK_CSS =
  '.network-context{max-width:820px;margin:0 auto 1.5rem;padding:1rem 1.25rem;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);border-radius:8px;font-size:.9rem;line-height:1.55;color:var(--tl,#a1a1aa)}.network-context a{color:var(--cyan,#06b6d4)}';

function isIndexed(html) {
  const robots = (html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || 'index,follow';
  return !/noindex/i.test(robots);
}

let n = 0;
const glossDir = path.join(ROOT, 'glossary');
for (const e of fs.readdirSync(glossDir, { withFileTypes: true })) {
  if (!e.isDirectory()) continue;
  const file = path.join(glossDir, e.name, 'index.html');
  if (!fs.existsSync(file)) continue;
  const slug = e.name;
  const inner = glossaryLinks[slug];
  if (!inner) {
    console.warn('no map', slug);
    continue;
  }
  let h = fs.readFileSync(file, 'utf8');
  if (!isIndexed(h) || h.includes('class="network-context"')) continue;
  if (!h.includes('.network-context{') && h.includes('<style>')) {
    h = h.replace('<style>', `<style>\n${NETWORK_CSS}\n`);
  }
  const snippet = `<p class="network-context">${inner}</p>\n`;
  const marker = '<main id="main" class="article-body">';
  if (!h.includes(marker)) continue;
  h = h.replace(marker, snippet + marker);
  fs.writeFileSync(file, h);
  n++;
  console.log('glossary network', slug);
}

// glossary hub
const hub = path.join(ROOT, 'glossary/index.html');
let hubHtml = fs.readFileSync(hub, 'utf8');
if (isIndexed(hubHtml) && !hubHtml.includes('class="network-context"')) {
  const snippet =
    '<p class="network-context">Extended guide: <a href="/guides/glossary/">Glossary guide</a> · <a href="/guides/jomtien-immigration-office/">Jomtien Immigration</a> · <a href="/tools/visa-finder/">Visa Finder</a></p>\n';
  if (!hubHtml.includes('.network-context{') && hubHtml.includes('<style>')) {
    hubHtml = hubHtml.replace('<style>', `<style>\n${NETWORK_CSS}\n`);
  }
  hubHtml = hubHtml.replace('<main id="main" class="article-body">', snippet + '<main id="main" class="article-body">');
  fs.writeFileSync(hub, hubHtml);
  n++;
  console.log('glossary network index');
}
console.log(`Glossary network: ${n} pages`);
