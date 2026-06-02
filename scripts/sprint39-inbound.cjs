/**
 * Sprint 39 — inbound links to O-A, O-X, Media locale pilots.
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

patch('visas/index.html', (h) => {
  if (h.includes('/de/visas/retirement-o-a/')) return h;
  return h.replace(
    '<a href="/visas/retirement-non-o/">Full Non-O retirement guide →</a>',
    '<a href="/visas/retirement-non-o/">Full Non-O retirement guide →</a> · <a href="/visas/retirement-o-a/">O-A guide →</a> · <a href="/de/visas/retirement-o-a/">O-A (DE)</a> · <a href="/ru/visas/retirement-o-a/">O-A (RU)</a> · <a href="/visas/retirement-o-x/">O-X guide →</a> · <a href="/de/visas/retirement-o-x/">O-X (DE)</a> · <a href="/ru/visas/retirement-o-x/">O-X (RU)</a>'
  );
});

patch('compare/o-a-vs-o-x/index.html', (h) => {
  if (h.includes('/de/visas/retirement-o-a/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/retirement-o-a/">O-A</a> · <a href="/de/visas/retirement-o-a/">O-A (DE)</a> · <a href="/visas/retirement-o-x/">O-X</a> · <a href="/de/visas/retirement-o-x/">O-X (DE)</a> · <a href="/de/visas/retirement-non-o/">Non-O (DE)</a></p>'
  );
});

patch('compare/non-o-vs-o-a/index.html', (h) => {
  if (h.includes('/de/visas/retirement-o-a/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/retirement-non-o/">Non-O</a> · <a href="/de/visas/retirement-non-o/">Non-O (DE)</a> · <a href="/visas/retirement-o-a/">O-A</a> · <a href="/ru/visas/retirement-o-a/">O-A (RU)</a></p>'
  );
});

patch('guides/health-insurance/index.html', (h) => {
  if (h.includes('/de/visas/retirement-o-a/')) return h;
  if (!h.includes('retirement-o-a')) {
    return h.replace(
      '<p class="network-context">',
      '<p class="network-context">O-A insurance: <a href="/visas/retirement-o-a/">O-A retirement</a> · <a href="/de/visas/retirement-o-a/">O-A (DE)</a> · '
    );
  }
  return h;
});

patch('guides/working-in-thailand/index.html', (h) => {
  if (h.includes('/de/visas/media-non-m/')) return h;
  return h.replace(
    'SMART: <a href="/visas/smart/">SMART visa</a>',
    'SMART: <a href="/visas/smart/">SMART visa</a> · Media: <a href="/visas/media-non-m/">Non-M</a> · <a href="/de/visas/media-non-m/">Non-M (DE)</a> · <a href="/ru/visas/media-non-m/">Non-M (RU)</a>'
  );
});

patch('de/index.html', (h) => {
  if (h.includes('/de/visas/retirement-o-a/') && h.includes('f-col-h">Visas')) {
    const old = '<a href="/de/visas/tourist-tr-evisa/">TR (DE)</a><a href="/visas/privilege-elite/">Privilege</a>';
    if (h.includes(old) && !h.includes('retirement-o-a')) {
      return h.replace(
        old,
        '<a href="/de/visas/tourist-tr-evisa/">TR (DE)</a><a href="/de/visas/retirement-o-a/">O-A (DE)</a><a href="/de/visas/retirement-o-x/">O-X (DE)</a><a href="/de/visas/media-non-m/">Media (DE)</a><a href="/visas/privilege-elite/">Privilege</a>'
      );
    }
  }
  return h;
});

patch('ru/index.html', (h) => {
  const old = '<a href="/ru/visas/tourist-tr-evisa/">TR (RU)</a><a href="/visas/privilege-elite/">Privilege</a>';
  if (h.includes(old) && !h.includes('retirement-o-a')) {
    return h.replace(
      old,
      '<a href="/ru/visas/tourist-tr-evisa/">TR (RU)</a><a href="/ru/visas/retirement-o-a/">O-A (RU)</a><a href="/ru/visas/retirement-o-x/">O-X (RU)</a><a href="/ru/visas/media-non-m/">Media (RU)</a><a href="/visas/privilege-elite/">Privilege</a>'
    );
  }
  return h;
});

console.log('Sprint 39 inbound done');
