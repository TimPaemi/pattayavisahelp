/**
 * Sprint 51 — inbound to indexed DE/RU hubs.
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
  if (h.includes('indexierte Visa-, Compare-')) return h;
  return h
    .replace(
      '<a href="/de/" class="tool"><div class="ico">→</div><h3>Deutsch</h3><p>German-language visa hub.</p></a>',
      '<a href="/de/" class="tool"><div class="ico">→</div><h3>Deutsch</h3><p>88 indexed pilots — visas, compares, professions in German.</p></a>'
    )
    .replace(
      '<a href="/ru/" class="tool c1"><div class="ico">→</div><h3>Русский</h3><p>Russian-language visa hub.</p></a>',
      '<a href="/ru/" class="tool c1"><div class="ico">→</div><h3>Русский</h3><p>88 indexed pilots — visas, compares, professions in Russian.</p></a>'
    );
});

patch('contact/index.html', (h) => {
  if (h.includes('Locale hubs')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/de/">Deutsch hub</a> · <a href="/ru/">Русский hub</a></p>')
  );
});

patch('faq/index.html', (h) => {
  if (h.includes('/de/">Deutsch hub')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/de/">DE hub</a> · <a href="/ru/">RU hub</a></p>')
  );
});
