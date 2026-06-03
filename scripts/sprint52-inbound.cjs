/**
 * Sprint 52 — inbound links to indexed DE/RU section hubs.
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
  if (h.includes('94 indexed pilots')) return h;
  return h
    .replace(/88 indexed pilots/g, '94 indexed pilots')
    .replace(
      '<a href="/de/" class="tool"><div class="ico">→</div><h3>Deutsch</h3><p>94 indexed pilots — visas, compares, professions in German.</p></a>',
      '<a href="/de/" class="tool"><div class="ico">→</div><h3>Deutsch</h3><p>94 indexed pilots — <a href="/de/visas/">visas</a>, <a href="/de/compare/">compare</a>, <a href="/de/professions/">professions</a> hubs.</p></a>'
    )
    .replace(
      '<a href="/ru/" class="tool c1"><div class="ico">→</div><h3>Русский</h3><p>88 indexed pilots — visas, compares, professions in Russian.</p></a>',
      '<a href="/ru/" class="tool c1"><div class="ico">→</div><h3>Русский</h3><p>94 indexed pilots — <a href="/ru/visas/">визы</a>, <a href="/ru/compare/">сравнения</a>, <a href="/ru/professions/">профессии</a>.</p></a>'
    );
});

patch('de/index.html', (h) => {
  if (h.includes('Visa-Hub (alle 12)')) return h;
  return h
    .replace(
      '<h2>Visa-Leitfäden (Deutsch, indexiert)</h2>',
      '<h2>Visa-Leitfäden (Deutsch, indexiert)</h2>\n<p><a href="/de/visas/"><strong>Visa-Hub (alle 12) →</strong></a></p>'
    )
    .replace(
      '<h2>Vergleiche (Deutsch)</h2>',
      '<h2>Vergleiche (Deutsch)</h2>\n<p><a href="/de/compare/"><strong>Compare-Hub (15 Seiten) →</strong></a></p>'
    )
    .replace(
      '<h2>Berufe (Deutsch)</h2>',
      '<h2>Berufe (Deutsch)</h2>\n<p><a href="/de/professions/"><strong>Berufe-Hub (16 Leitfäden) →</strong></a></p>'
    );
});

patch('ru/index.html', (h) => {
  if (h.includes('Хаб виз (все 12)')) return h;
  return h
    .replace(
      /<h2>[^<]*виз[^<]*<\/h2>/i,
      (m) => `${m}\n<p><a href="/ru/visas/"><strong>Хаб виз (все 12) →</strong></a></p>`
    );
  // fallback if heading differs
  if (!h.includes('Хаб виз (все 12)')) {
    h = h.replace(
      '<h2>Гиды по визам (русский, в индексе)</h2>',
      '<h2>Гиды по визам (русский, в индексе)</h2>\n<p><a href="/ru/visas/"><strong>Хаб виз (все 12) →</strong></a></p>'
    );
  }
  if (!h.includes('/ru/compare/"><strong>')) {
    h = h.replace(
      '<h2>Сравнения (русский)</h2>',
      '<h2>Сравнения (русский)</h2>\n<p><a href="/ru/compare/"><strong>Хаб сравнений (15) →</strong></a></p>'
    );
  }
  if (!h.includes('/ru/professions/"><strong>')) {
    h = h.replace(
      '<h2>Профессии (русский)</h2>',
      '<h2>Профессии (русский)</h2>\n<p><a href="/ru/professions/"><strong>Хаб профессий (16) →</strong></a></p>'
    );
  }
  return h;
});

patch('visas/index.html', (h) => {
  if (h.includes('Visa hub (DE)')) return h;
  return h.replace(
    'Jomtien: <a href="/guides/jomtien-immigration-office/">Jomtien Immigration</a></p>',
    'Jomtien: <a href="/guides/jomtien-immigration-office/">Jomtien Immigration</a> · Hubs: <a href="/de/visas/">Visa hub (DE)</a> · <a href="/ru/visas/">Visa hub (RU)</a></p>'
  );
});

patch('compare/index.html', (h) => {
  if (h.includes('Compare hub (DE)')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) {
    return h.replace(
      '<main id="main"',
      '<p class="network-context">Hubs: <a href="/de/compare/">Compare hub (DE)</a> · <a href="/ru/compare/">Compare hub (RU)</a> · <a href="/compare/visa-comparison-matrix/">Matrix (EN)</a></p>\n<main id="main"'
    );
  }
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/de/compare/">Compare hub (DE)</a> · <a href="/ru/compare/">Compare hub (RU)</a></p>')
  );
});

patch('professions/index.html', (h) => {
  if (h.includes('Professions hub (DE)')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) {
    return h.replace(
      '<main id="main"',
      '<p class="network-context">Hubs: <a href="/de/professions/">Professions hub (DE)</a> · <a href="/ru/professions/">Professions hub (RU)</a></p>\n<main id="main"'
    );
  }
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/de/professions/">Professions hub (DE)</a> · <a href="/ru/professions/">Professions hub (RU)</a></p>')
  );
});
