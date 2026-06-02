/**
 * Sprint 37 — inbound links to new Non-B + SMART locale pilots.
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
  if (h.includes('/de/visas/business-non-b/')) return h;
  return h
    .replace(
      '<a href="/visas/business-non-b/">Full Non-B guide →</a>',
      '<a href="/visas/business-non-b/">Full Non-B guide →</a> · <a href="/de/visas/business-non-b/">Non-B (DE)</a> · <a href="/ru/visas/business-non-b/">Non-B (RU)</a>'
    )
    .replace(
      '<a href="/visas/smart/">Full Smart Visa guide →</a>',
      '<a href="/visas/smart/">Full Smart Visa guide →</a> · <a href="/de/visas/smart/">SMART (DE)</a> · <a href="/ru/visas/smart/">SMART (RU)</a>'
    );
});

patch('guides/working-in-thailand/index.html', (h) => {
  if (h.includes('/de/visas/business-non-b/')) return h;
  return h.replace(
    '<p class="network-context">Non-B: <a href="/visas/business-non-b/">Business Non-B</a> · Work permit: <a href="/work-permit/">Work permit hub</a> · SMART: <a href="/visas/smart/">SMART visa</a></p>',
    '<p class="network-context">Non-B: <a href="/visas/business-non-b/">Business Non-B</a> · <a href="/de/visas/business-non-b/">Non-B (DE)</a> · <a href="/ru/visas/business-non-b/">Non-B (RU)</a> · Work permit: <a href="/work-permit/">Work permit hub</a> · SMART: <a href="/visas/smart/">SMART visa</a> · <a href="/de/visas/smart/">SMART (DE)</a> · <a href="/ru/visas/smart/">SMART (RU)</a></p>'
  );
});

patch('compare/dtv-vs-smart/index.html', (h) => {
  if (h.includes('/de/visas/smart/')) return h;
  return h.replace(
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/visas/smart/">SMART</a> · Nomad: <a href="/digital-nomad/">Digital nomad hub</a></p>',
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/visas/smart/">SMART</a> · <a href="/de/visas/smart/">SMART (DE)</a> · <a href="/ru/visas/smart/">SMART (RU)</a> · Nomad: <a href="/digital-nomad/">Digital nomad hub</a></p>'
  );
});

patch('compare/smart-vs-ltr/index.html', (h) => {
  if (h.includes('/de/visas/smart/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/smart/">SMART</a> · <a href="/de/visas/smart/">SMART (DE)</a> · <a href="/ru/visas/smart/">SMART (RU)</a> · <a href="/visas/ltr/">LTR</a> · <a href="/de/visas/ltr/">LTR (DE)</a></p>'
  );
});

console.log('Sprint 37 inbound done');
