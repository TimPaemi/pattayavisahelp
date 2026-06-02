/**
 * Sprint 43 — inbound links to DE/RU profession pilots.
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
  if (h.includes('/de/professions/content-creator/')) return h;
  return h.replace(
    '<li><a href="/professions/content-creator/"><strong>Content creator + YouTuber</strong></a>',
    '<li><a href="/professions/content-creator/"><strong>Content creator + YouTuber</strong></a> — <a href="/de/professions/content-creator/">DE</a> · <a href="/ru/professions/content-creator/">RU</a>'
  ).replace(
    '<li><a href="/professions/saas-founder/"><strong>SaaS founder</strong></a>',
    '<li><a href="/professions/saas-founder/"><strong>SaaS founder</strong></a> — <a href="/de/professions/saas-founder/">DE</a> · <a href="/ru/professions/saas-founder/">RU</a>'
  ).replace(
    '<li><a href="/professions/online-business-owner/"><strong>Online business owner</strong></a>',
    '<li><a href="/professions/online-business-owner/"><strong>Online business owner</strong></a> — <a href="/de/professions/online-business-owner/">DE</a> · <a href="/ru/professions/online-business-owner/">RU</a>'
  );
});

patch('digital-nomad/index.html', (h) => {
  if (h.includes('/de/professions/content-creator/')) return h;
  return h.replace(
    'DTV pathway: <a href="/visas/dtv/">DTV guide</a>',
    'DTV pathway: <a href="/visas/dtv/">DTV guide</a> · <a href="/de/professions/content-creator/">Creators (DE)</a> · <a href="/de/professions/saas-founder/">SaaS (DE)</a> · <a href="/de/professions/online-business-owner/">Online biz (DE)</a>'
  );
});

patch('professions/content-creator/index.html', (h) => {
  if (h.includes('/de/professions/content-creator/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/de/visas/dtv/">DTV (DE)</a> · <a href="/de/professions/content-creator/">Creator (DE)</a> · <a href="/ru/professions/content-creator/">(RU)</a> · <a href="/digital-nomad/">Nomad hub</a></p>'
  );
});

patch('professions/saas-founder/index.html', (h) => {
  if (h.includes('/de/professions/saas-founder/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/smart/">SMART</a> · <a href="/de/visas/dtv/">DTV (DE)</a> · <a href="/de/professions/saas-founder/">SaaS (DE)</a> · <a href="/ru/professions/saas-founder/">(RU)</a> · <a href="/guides/setting-up-thai-company/">Thai company</a></p>'
  );
});

patch('professions/online-business-owner/index.html', (h) => {
  if (h.includes('/de/professions/online-business-owner/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/tools/visa-finder/">Visa Finder</a> · <a href="/de/professions/online-business-owner/">Online biz (DE)</a> · <a href="/ru/professions/online-business-owner/">(RU)</a> · <a href="/de/professions/saas-founder/">SaaS (DE)</a></p>'
  );
});

patch('guides/best-visa-digital-nomads/index.html', (h) => {
  if (h.includes('/de/professions/content-creator/')) return h;
  return h.replace(
    '<a href="/visas/dtv/">DTV</a>',
    '<a href="/visas/dtv/">DTV</a> · <a href="/de/professions/content-creator/">Creators (DE)</a> · <a href="/de/professions/online-business-owner/">Online business (DE)</a>'
  );
});
