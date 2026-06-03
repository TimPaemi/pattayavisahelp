/**
 * Sprint 53 — inbound to DE/RU guides section hubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function patch(rel, fn) {
  const file = path.join(ROOT, rel);
  let h = fs.readFileSync(file, 'utf8');
  const next = fn(h);
  if (next === h) {
    console.log('skip', rel);
    return;
  }
  fs.writeFileSync(file, next);
  console.log('patched', rel);
}

patch('index.html', (h) => {
  if (h.includes('96 indexed')) return h;
  return h.replace(/94 indexed pilots/g, '96 indexed pilots');
});

patch('de/index.html', (h) => {
  if (h.includes('Leitfäden-Hub')) return h;
  return h.replace(
    '<h2>Die wichtigsten Langzeitvisa für Deutsche</h2>',
    '<h2>Leitfäden (Living in Thailand)</h2>\n<p><a href="/de/guides/"><strong>Leitfäden-Hub →</strong></a> · TM30, Jomtien, Steuer, Bank — Navigation zu EN-Quellen und DE-Visa-Pilots.</p>\n\n<h2>Die wichtigsten Langzeitvisa für Deutsche</h2>'
  );
});

patch('ru/index.html', (h) => {
  if (h.includes('Хаб гидов')) return h;
  return h.replace(
    '<h2>Основные long-stay визы</h2>',
    '<h2>Гиды (жизнь в Таиланде)</h2>\n<p><a href="/ru/guides/"><strong>Хаб гидов →</strong></a> · TM30, Jomtien, налоги — навигация к EN и RU pilots.</p>\n\n<h2>Основные long-stay визы</h2>'
  );
});

patch('guides/index.html', (h) => {
  if (h.includes('Guides hub (DE)')) return h;
  return h.replace(
    '<p class="network-context">Start here:',
    '<p class="network-context">Hubs: <a href="/de/guides/">Guides hub (DE)</a> · <a href="/ru/guides/">Guides hub (RU)</a> · Start here:'
  );
});

patch('de/visas/index.html', (h) => {
  if (h.includes('/de/guides/')) return h;
  return h.replace(
    '<a href="/guides/jomtien-immigration-office/">Jomtien</a>',
    '<a href="/de/guides/">Leitfäden-Hub</a> · <a href="/guides/jomtien-immigration-office/">Jomtien (EN)</a>'
  );
});

patch('ru/visas/index.html', (h) => {
  if (h.includes('/ru/guides/')) return h;
  return h.replace(
    '<a href="/guides/jomtien-immigration-office/">офис</a>',
    '<a href="/ru/guides/">хаб гидов</a> · <a href="/guides/jomtien-immigration-office/">офис (EN)</a>'
  );
});
