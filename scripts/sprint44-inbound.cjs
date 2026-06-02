/**
 * Sprint 44 — inbound links to DE/RU profession pilots.
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

patch('professions/index.html', (h) => {
  if (h.includes('/de/professions/affiliate-marketer/')) return h;
  return h
    .replace(
      '<li><a href="/professions/ai-engineer/"><strong>AI engineer</strong></a>',
      '<li><a href="/professions/ai-engineer/"><strong>AI engineer</strong></a> — <a href="/de/professions/ai-engineer/">DE</a> · <a href="/ru/professions/ai-engineer/">RU</a>'
    )
    .replace(
      '<li><a href="/professions/affiliate-marketer/"><strong>Affiliate marketer</strong></a>',
      '<li><a href="/professions/affiliate-marketer/"><strong>Affiliate marketer</strong></a> — <a href="/de/professions/affiliate-marketer/">DE</a> · <a href="/ru/professions/affiliate-marketer/">RU</a>'
    )
    .replace(
      '<li><a href="/professions/crypto-trader/"><strong>Crypto trader</strong></a>',
      '<li><a href="/professions/crypto-trader/"><strong>Crypto trader</strong></a> — <a href="/de/professions/crypto-trader/">DE</a> · <a href="/ru/professions/crypto-trader/">RU</a>'
    );
});

patch('digital-nomad/index.html', (h) => {
  if (h.includes('/de/professions/affiliate-marketer/')) return h;
  return h.replace(
    '<a href="/de/professions/online-business-owner/">Online biz (DE)</a>',
    '<a href="/de/professions/online-business-owner/">Online biz (DE)</a> · <a href="/de/professions/affiliate-marketer/">Affiliate (DE)</a> · <a href="/de/professions/ai-engineer/">AI (DE)</a>'
  );
});

patch('guides/thai-tax-foreign-residents/index.html', (h) => {
  if (h.includes('/de/professions/crypto-trader/')) return h;
  if (!/<p class="network-context">/.test(h)) return h;
  return h.replace(
    /<p class="network-context">[^<]*<\/p>/,
    '<p class="network-context"><a href="/guides/thai-tax-foreign-residents/">Tax guide</a> · <a href="/de/professions/crypto-trader/">Crypto (DE)</a> · <a href="/ru/professions/crypto-trader/">(RU)</a> · <a href="/de/visas/ltr/">LTR (DE)</a></p>'
  );
});

patch('professions/affiliate-marketer/index.html', (h) => {
  if (h.includes('Affiliate (DE)</a>')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/tools/visa-finder/">Visa Finder</a> · <a href="/de/professions/affiliate-marketer/">Affiliate (DE)</a> · <a href="/ru/professions/affiliate-marketer/">(RU)</a> · <a href="/de/visas/dtv/">DTV (DE)</a></p>'
  );
});

patch('professions/crypto-trader/index.html', (h) => {
  if (h.includes('/de/professions/crypto-trader/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/de/professions/crypto-trader/">Crypto (DE)</a> · <a href="/ru/professions/crypto-trader/">(RU)</a> · <a href="/guides/thai-tax-foreign-residents/">Thai tax</a></p>'
  );
});

patch('professions/ai-engineer/index.html', (h) => {
  if (h.includes('/de/professions/ai-engineer/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/tools/visa-finder/">Visa Finder</a> · <a href="/de/professions/ai-engineer/">AI (DE)</a> · <a href="/ru/professions/ai-engineer/">(RU)</a> · <a href="/de/compare/dtv-vs-smart/">DTV vs SMART</a></p>'
  );
});

patch('de/professions/content-creator/index.html', (h) => {
  if (h.includes('/de/professions/affiliate-marketer/')) return h;
  const re = /<p><strong>Verwandt:<\/strong>[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/de/professions/affiliate-marketer/">Affiliate (DE)</a></p>')
  );
});
