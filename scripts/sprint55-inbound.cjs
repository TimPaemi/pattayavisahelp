/**
 * Sprint 55 — inbound mesh for best-visa, pattaya, EN pillars, locale home.
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

const DE_MESH = '<a href="/de/best-visa/">Budget (DE)</a> · <a href="/de/pattaya/">Pattaya (DE)</a>';

patch('index.html', (h) => {
  if (h.includes('104 indexed')) return h;
  return h.replace(/100 indexed pilots/g, '104 indexed pilots');
});

patch('best-visa/index.html', (h) => {
  if (h.includes('Best visa hub (DE)')) return h;
  return h.replace(
    '</p>\n<main id="main"',
    ` · ${DE_MESH}</p>\n<main id="main"`
  ).replace(
    '<p class="network-context">Tool:',
    '<p class="network-context">Hubs: <a href="/de/best-visa/">Best visa (DE)</a> · <a href="/ru/best-visa/">Best visa (RU)</a> · Tool:'
  );
});

patch('pattaya/index.html', (h) => {
  if (h.includes('Pattaya hub (DE)')) return h;
  return h.replace(
    '<p class="network-context">Living guide:',
    '<p class="network-context">Hubs: <a href="/de/pattaya/">Pattaya (DE)</a> · <a href="/ru/pattaya/">Pattaya (RU)</a> · Living guide:'
  );
});

patch('de/index.html', (h) => {
  if (h.includes('/de/best-visa/"><strong>')) return h;
  return h.replace(
    '<h2>Leitfäden (Living in Thailand)</h2>',
    '<h2>Budget &amp; Pattaya (DE)</h2>\n<p><a href="/de/best-visa/"><strong>Budget-Visa-Hub →</strong></a> · <a href="/de/pattaya/"><strong>Pattaya-Hub →</strong></a></p>\n\n<h2>Leitfäden (Living in Thailand)</h2>'
  );
});

patch('ru/index.html', (h) => {
  if (h.includes('/ru/best-visa/"><strong>')) return h;
  return h.replace(
    '<h2>Гиды (жизнь в Таиланде)</h2>',
    '<h2>Бюджет и Паттайя</h2>\n<p><a href="/ru/best-visa/"><strong>Бюджет виз →</strong></a> · <a href="/ru/pattaya/"><strong>Паттайя →</strong></a></p>\n\n<h2>Гиды (жизнь в Таиланде)</h2>'
  );
});

for (const rel of ['visas/index.html', 'compare/index.html', 'guides/index.html', 'tools/index.html', 'glossary/index.html', 'professions/index.html']) {
  patch(rel, (h) => {
    if (h.includes('/de/best-visa/')) return h;
    const re = /<p class="network-context">/;
    if (!re.test(h)) return h;
    return h.replace(re, (m) => `${m}Also: ${DE_MESH} · `);
  });
}

patch('de/visas/index.html', (h) => {
  if (h.includes('Netzwerk DE:') && h.includes('/de/best-visa/')) return h;
  return h;
});
