/**
 * Sprint 49 — inbound links to DE/RU hua-hin + visa matrix pilots.
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
  if (h.includes('/de/compare/pattaya-vs-hua-hin/')) return h;
  let out = h
    .replace(
      '<li><a href="/compare/pattaya-vs-hua-hin-deep/"><strong>Pattaya vs Hua Hin (deep dive)</strong></a>',
      '<li><a href="/compare/pattaya-vs-hua-hin/"><strong>Pattaya vs Hua Hin</strong></a> — <a href="/de/compare/pattaya-vs-hua-hin/">DE</a> · <a href="/ru/compare/pattaya-vs-hua-hin/">RU</a> · <a href="/compare/pattaya-vs-hua-hin-deep/"><strong>deep dive</strong></a> — <a href="/de/compare/pattaya-vs-hua-hin-deep/">DE</a> · <a href="/ru/compare/pattaya-vs-hua-hin-deep/">RU</a>'
    );
  out = out.replace(
    ' <li><a href="/compare/pattaya-vs-hua-hin-deep/"><strong>Pattaya vs Hua Hin (deep dive)</strong></a> — A detailed comparison',
    ''
  );
  if (!out.includes('/de/compare/visa-comparison-matrix/')) {
    out = out.replace(
      '<a href="/compare/visa-comparison-matrix/">Visa comparison matrix</a> — side-by-side',
      '<a href="/compare/visa-comparison-matrix/">Visa comparison matrix</a> — <a href="/de/compare/visa-comparison-matrix/">DE</a> · <a href="/ru/compare/visa-comparison-matrix/">RU</a> — side-by-side'
    );
    out = out.replace(
      '<a href="/compare/visa-comparison-matrix/">Full visa comparison matrix</a>',
      '<a href="/compare/visa-comparison-matrix/">Full visa comparison matrix</a> — <a href="/de/compare/visa-comparison-matrix/">DE</a> · <a href="/ru/compare/visa-comparison-matrix/">RU</a>'
    );
  }
  return out;
});

patch('compare/pattaya-vs-hua-hin/index.html', (h) => {
  if (h.includes('/de/compare/pattaya-vs-hua-hin/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/compare/pattaya-vs-hua-hin-deep/">Deep dive</a> · <a href="/de/compare/pattaya-vs-hua-hin/">Hua Hin (DE)</a> · <a href="/ru/compare/pattaya-vs-hua-hin/">(RU)</a> · <a href="/de/compare/visa-comparison-matrix/">Visa matrix (DE)</a></p>'
  );
});

patch('compare/pattaya-vs-hua-hin-deep/index.html', (h) => {
  if (h.includes('/de/compare/pattaya-vs-hua-hin-deep/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/compare/pattaya-vs-hua-hin/">Short compare</a> · <a href="/de/compare/pattaya-vs-hua-hin-deep/">Deep (DE)</a> · <a href="/ru/compare/pattaya-vs-hua-hin-deep/">(RU)</a> · <a href="/pattaya/living-in-pattaya/">Living Pattaya</a></p>'
  );
});

patch('compare/visa-comparison-matrix/index.html', (h) => {
  if (h.includes('/de/compare/visa-comparison-matrix/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/tools/visa-finder/">Visa Finder</a> · <a href="/de/compare/visa-comparison-matrix/">Matrix (DE)</a> · <a href="/ru/compare/visa-comparison-matrix/">(RU)</a> · <a href="/de/visas/dtv/">DTV (DE)</a></p>'
  );
});

patch('guides/pattaya-vs-phuket-vs-chiang-mai-retirement/index.html', (h) => {
  if (h.includes('/de/compare/pattaya-vs-hua-hin/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/de/compare/pattaya-vs-hua-hin/">Hua Hin (DE)</a> · <a href="/de/compare/visa-comparison-matrix/">Visa matrix (DE)</a></p>')
  );
});

patch('pattaya/living-in-pattaya/index.html', (h) => {
  if (h.includes('/de/compare/pattaya-vs-hua-hin/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/de/compare/pattaya-vs-hua-hin/">vs Hua Hin (DE)</a> · <a href="/de/compare/pattaya-vs-hua-hin-deep/">deep (DE)</a></p>')
  );
});

patch('visas/index.html', (h) => {
  if (h.includes('/de/compare/visa-comparison-matrix/')) return h;
  if (!h.includes('network-context')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/compare/visa-comparison-matrix/">Visa matrix</a> · <a href="/de/compare/visa-comparison-matrix/">(DE)</a> · <a href="/ru/compare/visa-comparison-matrix/">(RU)</a></p>')
  );
});

patch('tools/visa-finder/index.html', (h) => {
  if (h.includes('/de/compare/visa-comparison-matrix/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/compare/visa-comparison-matrix/">Full matrix</a> · <a href="/de/compare/visa-comparison-matrix/">DE</a> · <a href="/ru/compare/visa-comparison-matrix/">RU</a></p>')
  );
});
