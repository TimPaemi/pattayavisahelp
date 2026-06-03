/**
 * Sprint 57 — EN indexed hubs link full DE/RU locale mesh.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'sprint57-locale-hubs';
const BLOCK = `<p class="network-context">Locale hubs: <a href="/de/">DE home</a> · <a href="/ru/">RU home</a> · <a href="/de/visas/">Visas (DE)</a> · <a href="/ru/visas/">Visas (RU)</a> · <a href="/de/compare/">Compare (DE)</a> · <a href="/ru/compare/">Compare (RU)</a> · <a href="/de/guides/">Guides (DE)</a> · <a href="/ru/guides/">Guides (RU)</a> · <a href="/de/tools/">Tools (DE)</a> · <a href="/ru/tools/">Tools (RU)</a> · <a href="/de/glossary/">Glossary (DE)</a> · <a href="/ru/glossary/">Glossary (RU)</a> · <a href="/de/professions/">Professions (DE)</a> · <a href="/ru/professions/">Professions (RU)</a> · <a href="/de/best-visa/">Budget (DE)</a> · <a href="/ru/best-visa/">Budget (RU)</a> · <a href="/de/pattaya/">Pattaya (DE)</a> · <a href="/ru/pattaya/">Pattaya (RU)</a></p>`;

const TARGETS = [
  'faq/index.html',
  'resources/index.html',
  'banking/index.html',
  'healthcare/index.html',
  'tax/index.html',
  'work-permit/index.html',
  'services/index.html',
  'blog/index.html',
  'methodology/index.html',
  'about/index.html',
  'contact/index.html',
  'sitemap/index.html',
];

function patch(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return;
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes(MARKER) || h.includes('Locale hubs: <a href="/de/">DE home</a>')) return;
  const tag = `<!-- ${MARKER} -->\n${BLOCK}\n`;
  if (h.includes('<main id="main"')) {
    h = h.replace('<main id="main"', `${tag}<main id="main"`);
  } else if (h.includes('<main ')) {
    h = h.replace(/<main\b/, `${tag}<main`);
  } else return;
  fs.writeFileSync(file, h);
  console.log('inbound', rel);
}

for (const rel of TARGETS) patch(rel);

// Glossary uses <main class="wrap">
const gFile = path.join(ROOT, 'glossary/index.html');
let g = fs.readFileSync(gFile, 'utf8');
if (!g.includes(MARKER) && !g.includes('Locale hubs:')) {
  g = g.replace(
    '<main id="main" class="wrap">',
    `<main id="main" class="wrap">\n<!-- ${MARKER} -->\n${BLOCK}\n`
  );
  fs.writeFileSync(gFile, g);
  console.log('inbound', 'glossary/index.html');
}

// Tools hub — add RU budget if partial
const toolsFile = path.join(ROOT, 'tools/index.html');
let t = fs.readFileSync(toolsFile, 'utf8');
if (!t.includes('/ru/best-visa/') && t.includes('network-context')) {
  t = t.replace(
    /<p class="network-context">/,
    '<p class="network-context">Locale: <a href="/de/tools/">Tools (DE)</a> · <a href="/ru/tools/">Tools (RU)</a> · <a href="/ru/best-visa/">Budget (RU)</a> · '
  );
  fs.writeFileSync(toolsFile, t);
  console.log('patched', 'tools/index.html');
}

console.log('Sprint 57 EN locale inbound done');
