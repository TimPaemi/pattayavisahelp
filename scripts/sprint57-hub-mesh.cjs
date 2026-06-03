/**
 * Sprint 57 — complete mesh strips on best-visa / pattaya section hubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const FIXES = [
  [
    'de/best-visa/index.html',
    '<a href="/de/professions/">Berufe</a></p>',
    '<a href="/de/professions/">Berufe</a> · <a href="/de/best-visa/">Budget</a> · <a href="/de/pattaya/">Pattaya</a> · <a href="/tools/visa-finder/">Visa Finder</a></p>',
  ],
  [
    'ru/best-visa/index.html',
    '<a href="/ru/professions/">профессии</a></p>',
    '<a href="/ru/professions/">профессии</a> · <a href="/ru/best-visa/">бюджет</a> · <a href="/ru/pattaya/">Паттайя</a> · <a href="/tools/visa-finder/">Visa Finder</a></p>',
  ],
  [
    'de/pattaya/index.html',
    '<a href="/de/best-visa/">Budget-Visa</a></p>',
    '<a href="/de/best-visa/">Budget-Visa</a> · <a href="/de/pattaya/">Pattaya</a> · <a href="/contact/">Beratung</a></p>',
  ],
  [
    'ru/pattaya/index.html',
    '<a href="/ru/best-visa/">бюджет</a></p>',
    '<a href="/ru/best-visa/">бюджет</a> · <a href="/ru/pattaya/">Паттайя</a> · <a href="/contact/">консультация</a></p>',
  ],
];

for (const [rel, from, to] of FIXES) {
  const file = path.join(ROOT, rel);
  let h = fs.readFileSync(file, 'utf8');
  if (!h.includes(from) || h.includes(to)) {
    console.log('skip', rel);
    continue;
  }
  h = h.replace(from, to);
  fs.writeFileSync(file, h);
  console.log('hub-mesh', rel);
}

const DE_SITEMAP = `<!-- sprint57-indexed-hubs -->
<p class="network-context">Indexierte Hubs: <a href="/de/">Home</a> · <a href="/de/visas/">Visa</a> · <a href="/de/compare/">Compare</a> · <a href="/de/guides/">Guides</a> · <a href="/de/tools/">Tools</a> · <a href="/de/glossary/">Glossar</a> · <a href="/de/professions/">Berufe</a> · <a href="/de/best-visa/">Budget</a> · <a href="/de/pattaya/">Pattaya</a> · <a href="/visas/">Visa EN</a></p>\n`;

const RU_SITEMAP = `<!-- sprint57-indexed-hubs -->
<p class="network-context">Индексированные хабы: <a href="/ru/">Home</a> · <a href="/ru/visas/">визы</a> · <a href="/ru/compare/">сравнения</a> · <a href="/ru/guides/">гиды</a> · <a href="/ru/tools/">tools</a> · <a href="/ru/glossary/">глоссарий</a> · <a href="/ru/professions/">профессии</a> · <a href="/ru/best-visa/">бюджет</a> · <a href="/ru/pattaya/">Паттайя</a> · <a href="/visas/">Visa EN</a></p>\n`;

for (const [rel, block] of [
  ['de/sitemap/index.html', DE_SITEMAP],
  ['ru/sitemap/index.html', RU_SITEMAP],
]) {
  const file = path.join(ROOT, rel);
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('sprint57-indexed-hubs')) continue;
  h = h.replace('<main class="article-body">', `<main class="article-body">\n${block}`);
  fs.writeFileSync(file, h);
  console.log('sitemap-hubs', rel);
}

console.log('Sprint 57 hub mesh done');
