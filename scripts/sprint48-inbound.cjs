/**
 * Sprint 48 — inbound links to DE/RU location compare pilots.
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
  if (h.includes('/de/compare/pattaya-vs-bangkok/')) return h;
  return h
    .replace(
      '<li><a href="/compare/pattaya-vs-bangkok/"><strong>Pattaya vs Bangkok</strong></a>',
      '<li><a href="/compare/pattaya-vs-bangkok/"><strong>Pattaya vs Bangkok</strong></a> — <a href="/de/compare/pattaya-vs-bangkok/">DE</a> · <a href="/ru/compare/pattaya-vs-bangkok/">RU</a>'
    )
    .replace(
      '<li><a href="/compare/pattaya-vs-chiang-mai/"><strong>Pattaya vs Chiang Mai</strong></a>',
      '<li><a href="/compare/pattaya-vs-chiang-mai/"><strong>Pattaya vs Chiang Mai</strong></a> — <a href="/de/compare/pattaya-vs-chiang-mai/">DE</a> · <a href="/ru/compare/pattaya-vs-chiang-mai/">RU</a>'
    )
    .replace(
      '<li><a href="/compare/pattaya-vs-phuket/"><strong>Pattaya vs Phuket</strong></a>',
      '<li><a href="/compare/pattaya-vs-phuket/"><strong>Pattaya vs Phuket</strong></a> — <a href="/de/compare/pattaya-vs-phuket/">DE</a> · <a href="/ru/compare/pattaya-vs-phuket/">RU</a>'
    );
});

patch('guides/pattaya-vs-phuket-vs-chiang-mai-retirement/index.html', (h) => {
  if (h.includes('/de/compare/pattaya-vs-phuket/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/guides/pattaya-vs-phuket-vs-chiang-mai-retirement/">3-city guide</a> · <a href="/de/compare/pattaya-vs-phuket/">Phuket (DE)</a> · <a href="/de/compare/pattaya-vs-chiang-mai/">Chiang Mai (DE)</a> · <a href="/de/compare/pattaya-vs-bangkok/">Bangkok (DE)</a></p>'
  );
});

patch('compare/pattaya-vs-bangkok/index.html', (h) => {
  if (h.includes('/de/compare/pattaya-vs-bangkok/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/pattaya/living-in-pattaya/">Living Pattaya</a> · <a href="/de/compare/pattaya-vs-bangkok/">Bangkok (DE)</a> · <a href="/ru/compare/pattaya-vs-bangkok/">(RU)</a> · <a href="/de/compare/pattaya-vs-chiang-mai/">Chiang Mai (DE)</a></p>'
  );
});

patch('compare/pattaya-vs-chiang-mai/index.html', (h) => {
  if (h.includes('/de/compare/pattaya-vs-chiang-mai/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/guides/best-visa-digital-nomads/">Nomad visas</a> · <a href="/de/compare/pattaya-vs-chiang-mai/">Chiang Mai (DE)</a> · <a href="/ru/compare/pattaya-vs-chiang-mai/">(RU)</a> · <a href="/de/visas/dtv/">DTV (DE)</a></p>'
  );
});

patch('compare/pattaya-vs-phuket/index.html', (h) => {
  if (h.includes('/de/compare/pattaya-vs-phuket/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/guides/pattaya-vs-phuket-vs-chiang-mai-retirement/">3-city</a> · <a href="/de/compare/pattaya-vs-phuket/">Phuket (DE)</a> · <a href="/ru/compare/pattaya-vs-phuket/">(RU)</a> · <a href="/de/compare/pattaya-vs-bangkok/">Bangkok (DE)</a></p>'
  );
});

patch('pattaya/living-in-pattaya/index.html', (h) => {
  if (h.includes('/de/compare/pattaya-vs-bangkok/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/pattaya/living-in-pattaya/">Living Pattaya</a> · <a href="/de/compare/pattaya-vs-bangkok/">vs Bangkok (DE)</a> · <a href="/de/compare/pattaya-vs-phuket/">vs Phuket (DE)</a> · <a href="/de/compare/pattaya-vs-chiang-mai/">vs Chiang Mai (DE)</a></p>'
  );
});
