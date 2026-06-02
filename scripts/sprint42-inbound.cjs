/**
 * Sprint 42 — inbound links to DE/RU compare pilots.
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
  if (h.includes('/de/compare/smart-vs-ltr/')) return h;
  return h.replace(
    'DTV vs SMART (RU)</a></p>',
    'DTV vs SMART (RU)</a> · <a href="/de/compare/smart-vs-ltr/">SMART vs LTR (DE)</a> · <a href="/ru/compare/smart-vs-ltr/">SMART vs LTR (RU)</a> · <a href="/de/compare/marriage-vs-retirement/">Marriage vs Retirement (DE)</a> · <a href="/ru/compare/marriage-vs-retirement/">(RU)</a> · <a href="/de/compare/dtv-vs-elite/">DTV vs Privilege (DE)</a> · <a href="/ru/compare/dtv-vs-elite/">(RU)</a></p>'
  );
});

patch('compare/smart-vs-ltr/index.html', (h) => {
  if (h.includes('/de/compare/smart-vs-ltr/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/smart/">SMART</a> · <a href="/de/visas/ltr/">LTR (DE)</a> · <a href="/de/compare/smart-vs-ltr/">SMART vs LTR (DE)</a> · <a href="/ru/compare/smart-vs-ltr/">(RU)</a> · <a href="/de/compare/dtv-vs-smart/">DTV vs SMART</a></p>'
  );
});

patch('compare/marriage-vs-retirement/index.html', (h) => {
  if (h.includes('/de/compare/marriage-vs-retirement/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/marriage-non-o/">Marriage</a> · <a href="/de/visas/marriage-non-o/">Marriage (DE)</a> · <a href="/visas/retirement-non-o/">Retirement</a> · <a href="/de/compare/marriage-vs-retirement/">Compare (DE)</a> · <a href="/ru/compare/marriage-vs-retirement/">(RU)</a> · <a href="/guides/best-visa-couples/">Couples</a></p>'
  );
});

patch('compare/dtv-vs-elite/index.html', (h) => {
  if (h.includes('/de/compare/dtv-vs-elite/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/de/visas/privilege-elite/">Privilege (DE)</a> · <a href="/de/compare/dtv-vs-elite/">DTV vs Privilege (DE)</a> · <a href="/ru/compare/dtv-vs-elite/">(RU)</a> · <a href="/de/compare/dtv-vs-ltr/">DTV vs LTR</a></p>'
  );
});

patch('guides/best-visa-couples/index.html', (h) => {
  if (h.includes('/de/compare/marriage-vs-retirement/')) return h;
  return h.replace(
    '<a href="/visas/marriage-non-o/">Marriage Non-O</a>',
    '<a href="/visas/marriage-non-o/">Marriage Non-O</a> · <a href="/de/compare/marriage-vs-retirement/">Marriage vs Retirement (DE)</a> · <a href="/ru/compare/marriage-vs-retirement/">(RU)</a>'
  );
});

patch('digital-nomad/index.html', (h) => {
  if (h.includes('/de/compare/dtv-vs-elite/')) return h;
  return h.replace(
    'DTV pathway: <a href="/visas/dtv/">DTV guide</a>',
    'DTV pathway: <a href="/visas/dtv/">DTV guide</a> · <a href="/de/compare/dtv-vs-elite/">DTV vs Privilege (DE)</a> · <a href="/de/compare/dtv-vs-ltr/">DTV vs LTR</a>'
  );
});
