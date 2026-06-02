/**
 * Sprint 41 — inbound links to DE/RU compare pilots.
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

patch('compare/index.html', (h) => {
  if (h.includes('/de/compare/non-o-vs-o-a/')) return h;
  return h.replace(
    'Privilege vs LTR (RU)</a></p>',
    'Privilege vs LTR (RU)</a> · <a href="/de/compare/non-o-vs-o-a/">Non-O vs O-A (DE)</a> · <a href="/ru/compare/non-o-vs-o-a/">Non-O vs O-A (RU)</a> · <a href="/de/compare/o-a-vs-o-x/">O-A vs O-X (DE)</a> · <a href="/ru/compare/o-a-vs-o-x/">O-A vs O-X (RU)</a> · <a href="/de/compare/dtv-vs-smart/">DTV vs SMART (DE)</a> · <a href="/ru/compare/dtv-vs-smart/">DTV vs SMART (RU)</a></p>'
  );
});

patch('compare/non-o-vs-o-a/index.html', (h) => {
  if (h.includes('/de/compare/non-o-vs-o-a/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/retirement-non-o/">Non-O</a> · <a href="/de/visas/retirement-non-o/">Non-O (DE)</a> · <a href="/visas/retirement-o-a/">O-A</a> · <a href="/de/compare/non-o-vs-o-a/">Non-O vs O-A (DE)</a> · <a href="/ru/compare/non-o-vs-o-a/">(RU)</a></p>'
  );
});

patch('compare/o-a-vs-o-x/index.html', (h) => {
  if (h.includes('/de/compare/o-a-vs-o-x/') && h.includes('(DE)</a>')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/retirement-o-a/">O-A</a> · <a href="/de/visas/retirement-o-a/">O-A (DE)</a> · <a href="/visas/retirement-o-x/">O-X</a> · <a href="/de/compare/o-a-vs-o-x/">O-A vs O-X (DE)</a> · <a href="/ru/compare/o-a-vs-o-x/">(RU)</a> · <a href="/compare/non-o-vs-o-a/">Non-O vs O-A</a></p>'
  );
});

patch('compare/dtv-vs-smart/index.html', (h) => {
  if (h.includes('/de/compare/dtv-vs-smart/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/de/visas/dtv/">DTV (DE)</a> · <a href="/visas/smart/">SMART</a> · <a href="/de/compare/dtv-vs-smart/">DTV vs SMART (DE)</a> · <a href="/ru/compare/dtv-vs-smart/">(RU)</a></p>'
  );
});

patch('guides/best-visa-retirees-over-50/index.html', (h) => {
  if (h.includes('/de/compare/non-o-vs-o-a/')) return h;
  return h.replace(
    '<a href="/compare/o-a-vs-o-x/">Compare O-A vs O-X</a>',
    '<a href="/compare/o-a-vs-o-x/">Compare O-A vs O-X</a> · <a href="/de/compare/non-o-vs-o-a/">Non-O vs O-A (DE)</a> · <a href="/ru/compare/non-o-vs-o-a/">(RU)</a>'
  );
});

patch('guides/working-in-thailand/index.html', (h) => {
  if (h.includes('/de/compare/dtv-vs-smart/')) return h;
  return h.replace(
    'Non-M (RU)</a>',
    'Non-M (RU)</a> · <a href="/de/compare/dtv-vs-smart/">DTV vs SMART (DE)</a> · <a href="/ru/compare/dtv-vs-smart/">(RU)</a>'
  );
});

patch('de/visas/retirement-non-o/index.html', (h) => {
  if (h.includes('/de/compare/non-o-vs-o-a/')) return h;
  const needle = '<p class="network-context">';
  if (!h.includes(needle)) return h;
  return h.replace(
    needle,
    '<p class="network-context">Vergleich: <a href="/de/compare/non-o-vs-o-a/">Non-O vs O-A (DE)</a> · <a href="/compare/o-a-vs-o-x/">O-A vs O-X</a> · '
  );
});

patch('ru/visas/retirement-non-o/index.html', (h) => {
  if (h.includes('/ru/compare/non-o-vs-o-a/')) return h;
  const needle = '<p class="network-context">';
  if (!h.includes(needle)) return h;
  return h.replace(
    needle,
    '<p class="network-context"><a href="/ru/compare/non-o-vs-o-a/">Non-O vs O-A (RU)</a> · '
  );
});
