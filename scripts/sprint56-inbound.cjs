/**
 * Sprint 56 — EN homepage + professions legacy URL inbound.
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
  if (h.includes('/ru/best-visa/')) return h;
  return h
    .replace(
      '104 indexed pilots — <a href="/de/visas/">visas</a>, <a href="/de/compare/">compare</a>, <a href="/de/professions/">professions</a> hubs.',
      '104 indexed pilots — <a href="/de/visas/">visas</a>, <a href="/de/compare/">compare</a>, <a href="/de/best-visa/">budget</a>, <a href="/de/pattaya/">Pattaya</a>, <a href="/de/professions/">professions</a> hubs.'
    )
    .replace(
      '104 indexed pilots — visas, compares, professions in Russian.',
      '104 indexed pilots — <a href="/ru/visas/">visas</a>, <a href="/ru/compare/">compare</a>, <a href="/ru/best-visa/">budget</a>, <a href="/ru/pattaya/">Pattaya</a>, <a href="/ru/professions/">professions</a>.'
    );
});

patch('professions/index.html', (h) => {
  if (h.includes('/professions/digital-nomad/')) return h;
  return h.replace(
    '<li><a href="/professions/content-creator/">',
    '<li><a href="/professions/digital-nomad/">Digital nomad (legacy URL)</a> → <a href="/digital-nomad/">hub</a> · <a href="/de/professions/content-creator/">DE</a> · <a href="/ru/professions/content-creator/">RU</a></li>\n<li><a href="/professions/content-creator/">'
  );
});

for (const rel of ['retirement/index.html', 'digital-nomad/index.html', 'resources/index.html']) {
  patch(rel, (h) => {
    if (h.includes('/ru/pattaya/')) return h;
    const re = /<p class="network-context">/;
    if (!re.test(h)) return h;
    return h.replace(
      re,
      '<p class="network-context">Locale: <a href="/de/pattaya/">Pattaya (DE)</a> · <a href="/ru/pattaya/">Pattaya (RU)</a> · <a href="/de/best-visa/">Budget (DE)</a> · <a href="/ru/best-visa/">Budget (RU)</a> · '
    );
  });
}
