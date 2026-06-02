/**
 * Sprint 40 — inbound links to DE/RU compare pilots.
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
  if (h.includes('/de/compare/dtv-vs-ltr/')) return h;
  return h.replace(
    '<a href="/compare/dtv-vs-ltr/" class="rn pk">',
    '<a href="/compare/dtv-vs-ltr/" class="rn pk">'
  ).replace(
    '<p><strong>Comparison hub:</strong>',
    '<p><strong>DE/RU:</strong> <a href="/de/compare/dtv-vs-ltr/">DTV vs LTR (DE)</a> · <a href="/ru/compare/dtv-vs-ltr/">DTV vs LTR (RU)</a> · <a href="/de/compare/ed-vs-dtv/">ED vs DTV (DE)</a> · <a href="/ru/compare/ed-vs-dtv/">ED vs DTV (RU)</a> · <a href="/de/compare/privilege-vs-ltr/">Privilege vs LTR (DE)</a> · <a href="/ru/compare/privilege-vs-ltr/">Privilege vs LTR (RU)</a></p>\n<p><strong>Comparison hub:</strong>'
  );
});

patch('compare/dtv-vs-ltr/index.html', (h) => {
  if (h.includes('/de/compare/dtv-vs-ltr/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/de/visas/dtv/">DTV (DE)</a> · <a href="/visas/ltr/">LTR</a> · <a href="/de/compare/dtv-vs-ltr/">DTV vs LTR (DE)</a> · <a href="/ru/compare/dtv-vs-ltr/">DTV vs LTR (RU)</a></p>'
  );
});

patch('compare/ed-vs-dtv/index.html', (h) => {
  if (h.includes('/de/compare/ed-vs-dtv/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/education-ed/">ED</a> · <a href="/de/visas/education-ed/">ED (DE)</a> · <a href="/visas/dtv/">DTV</a> · <a href="/de/compare/ed-vs-dtv/">ED vs DTV (DE)</a> · <a href="/ru/compare/ed-vs-dtv/">ED vs DTV (RU)</a> · <a href="/guides/switch-ed-to-dtv/">Switch ED→DTV</a></p>'
  );
});

patch('compare/privilege-vs-ltr/index.html', (h) => {
  if (h.includes('/de/compare/privilege-vs-ltr/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/privilege-elite/">Privilege</a> · <a href="/de/visas/privilege-elite/">Privilege (DE)</a> · <a href="/visas/ltr/">LTR</a> · <a href="/de/compare/privilege-vs-ltr/">Privilege vs LTR (DE)</a> · <a href="/ru/compare/privilege-vs-ltr/">Privilege vs LTR (RU)</a></p>'
  );
});

patch('de/visas/dtv/index.html', (h) => {
  if (h.includes('/de/compare/dtv-vs-ltr/')) return h;
  return h.replace(
    '<a href="/compare/dtv-vs-ltr/">DTV vs LTR</a>',
    '<a href="/compare/dtv-vs-ltr/">DTV vs LTR</a> · <a href="/de/compare/dtv-vs-ltr/">DTV vs LTR (DE)</a>'
  );
});

patch('ru/visas/dtv/index.html', (h) => {
  if (h.includes('/ru/compare/dtv-vs-ltr/')) return h;
  return h.replace(
    '<a href="/compare/dtv-vs-ltr/">DTV vs LTR</a>',
    '<a href="/ru/compare/dtv-vs-ltr/">DTV vs LTR</a> · <a href="/compare/dtv-vs-ltr/">EN</a>'
  );
});

patch('de/index.html', (h) => {
  if (h.includes('/de/compare/dtv-vs-ltr/') && h.includes('Compare')) return h;
  const needle = '<a href="/de/compare/index.html">Vergleiche</a>';
  if (!h.includes(needle)) return h;
  return h.replace(
    needle,
    '<a href="/de/compare/index.html">Vergleiche</a><a href="/de/compare/dtv-vs-ltr/">DTV vs LTR</a><a href="/de/compare/ed-vs-dtv/">ED vs DTV</a>'
  );
});

patch('ru/index.html', (h) => {
  if (h.includes('/ru/compare/dtv-vs-ltr/') && h.includes('Сравн')) return h;
  const needle = '<a href="/ru/compare/index.html">';
  if (!h.includes(needle) || h.includes('/ru/compare/dtv-vs-ltr/')) return h;
  return h.replace(
    needle,
    '<a href="/ru/compare/dtv-vs-ltr/">DTV vs LTR</a><a href="/ru/compare/ed-vs-dtv/">ED vs DTV</a><a href="/ru/compare/index.html">'
  );
});
