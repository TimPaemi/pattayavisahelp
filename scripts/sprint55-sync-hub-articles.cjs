/**
 * Sprint 55 — refresh <main> on indexed section hubs from article files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const HUBS = [
  ['de/visas/index.html', 'de-visas-hub-article.html'],
  ['ru/visas/index.html', 'ru-visas-hub-article.html'],
  ['de/compare/index.html', 'de-compare-hub-article.html'],
  ['ru/compare/index.html', 'ru-compare-hub-article.html'],
  ['de/professions/index.html', 'de-professions-hub-article.html'],
  ['ru/professions/index.html', 'ru-professions-hub-article.html'],
  ['de/guides/index.html', 'de-guides-hub-article.html'],
  ['ru/guides/index.html', 'ru-guides-hub-article.html'],
  ['de/tools/index.html', 'de-tools-hub-article.html'],
  ['ru/tools/index.html', 'ru-tools-hub-article.html'],
  ['de/glossary/index.html', 'de-glossary-hub-article.html'],
  ['ru/glossary/index.html', 'ru-glossary-hub-article.html'],
];

for (const [page, article] of HUBS) {
  const fp = path.join(ROOT, page);
  const body = fs.readFileSync(path.join(__dirname, 'content', article), 'utf8');
  let h = fs.readFileSync(fp, 'utf8');
  const next = h.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/, `<main id="main" class="article-body">\n${body}\n</main>`);
  if (next === h) {
    console.log('skip', page);
    continue;
  }
  fs.writeFileSync(fp, next);
  console.log('synced', page);
}
