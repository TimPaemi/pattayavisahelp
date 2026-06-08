/**
 * Sprint 70 — refresh DE/RU guides hub main from articles.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const HUBS = [
  ['de/guides/index.html', 'de-guides-hub-article.html'],
  ['ru/guides/index.html', 'ru-guides-hub-article.html'],
];

for (const [rel, art] of HUBS) {
  const file = path.join(ROOT, rel);
  const article = fs.readFileSync(path.join(__dirname, 'content', art), 'utf8');
  let h = fs.readFileSync(file, 'utf8');
  h = h.replace(
    /<main id="main"[^>]*>[\s\S]*?<\/main>/,
    `<main id="main" class="article-body">\n${article}\n</main>`
  );
  const tldr = rel.startsWith('ru/')
    ? '<p class="tldr-text">10 гидов в индексе · 30+ EN · visa pilots</p>'
    : '<p class="tldr-text">10 Leitfäden indexiert · 30+ EN-Themen · Visa-Pilots</p>';
  h = h.replace(/<p class="tldr-text">[\s\S]*?<\/p>/, tldr);
  fs.writeFileSync(file, h);
  console.log('synced', rel);
}
