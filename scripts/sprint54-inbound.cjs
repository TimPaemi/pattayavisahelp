/**
 * Sprint 54 — inbound to DE/RU tools + glossary hubs.
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
  if (h.includes('100 indexed')) return h;
  return h.replace(/96 indexed pilots/g, '100 indexed pilots');
});

patch('de/index.html', (h) => {
  if (h.includes('Tools-Hub')) return h;
  return h.replace(
    '<p><strong>Schnellzugriff:</strong>',
    '<p><a href="/de/tools/"><strong>Tools-Hub →</strong></a> · <a href="/de/glossary/"><strong>Glossar-Hub →</strong></a></p>\n<p><strong>Schnellzugriff:</strong>'
  );
});

patch('ru/index.html', (h) => {
  if (h.includes('/ru/tools/"><strong>')) return h;
  return h.replace(
    '<p><strong>Быстрые ссылки:</strong>',
    '<p><a href="/ru/tools/"><strong>Tools hub →</strong></a> · <a href="/ru/glossary/"><strong>Глоссарий →</strong></a></p>\n<p><strong>Быстрые ссылки:</strong>'
  );
});

patch('tools/index.html', (h) => {
  if (h.includes('Tools hub (DE)')) return h;
  return h.replace(
    '<strong>Policy updates:</strong>',
    '<a href="/de/tools/">Tools hub (DE)</a> · <a href="/ru/tools/">Tools hub (RU)</a> · <strong>Policy updates:</strong>'
  );
});

patch('glossary/index.html', (h) => {
  if (h.includes('Glossary hub (DE)')) return h;
  return h.replace(
    '<p style="margin:0 0 1.25rem',
    '<p style="margin:0 0 1rem;font-size:.9rem;color:var(--tl,#a1a1aa)">Hubs: <a href="/de/glossary/">Glossary hub (DE)</a> · <a href="/ru/glossary/">Glossary hub (RU)</a></p>\n<p style="margin:0 0 1.25rem'
  );
});

patch('de/guides/index.html', (h) => {
  if (h.includes('/de/tools/')) return h;
  return h.replace(
    '<a href="/tools/visa-finder/">Visa Finder</a>',
    '<a href="/de/tools/">Tools-Hub</a> · <a href="/tools/visa-finder/">Visa Finder (EN)</a>'
  );
});

patch('guides/index.html', (h) => {
  if (h.includes('/de/glossary/')) return h;
  return h.replace(
    '<a href="/guides/glossary/">Extended glossary guide</a>',
    '<a href="/de/glossary/">Glossary hub (DE)</a> · <a href="/ru/glossary/">Glossary hub (RU)</a> · <a href="/guides/glossary/">Extended glossary guide</a>'
  );
});
