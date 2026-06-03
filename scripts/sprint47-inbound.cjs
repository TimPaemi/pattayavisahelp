/**
 * Sprint 47 — inbound links to DE/RU profession pilots.
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
  if (h.includes('/de/professions/chef/')) return h;
  return h
    .replace(
      '<li><a href="/professions/chef/"><strong>Chef + restaurateur</strong></a>',
      '<li><a href="/professions/chef/"><strong>Chef + restaurateur</strong></a> — <a href="/de/professions/chef/">DE</a> · <a href="/ru/professions/chef/">RU</a>'
    )
    .replace(
      '<li><a href="/professions/dj/"><strong>DJ + electronic artist</strong></a>',
      '<li><a href="/professions/dj/"><strong>DJ + electronic artist</strong></a> — <a href="/de/professions/dj/">DE</a> · <a href="/ru/professions/dj/">RU</a>'
    )
    .replace(
      '<li><a href="/professions/hairdresser/"><strong>Hairdresser + barber</strong></a>',
      '<li><a href="/professions/hairdresser/"><strong>Hairdresser + barber</strong></a> — <a href="/de/professions/hairdresser/">DE</a> · <a href="/ru/professions/hairdresser/">RU</a>'
    );
});

patch('guides/setting-up-thai-company/index.html', (h) => {
  if (h.includes('/de/professions/chef/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/guides/setting-up-thai-company/">Thai company</a> · <a href="/de/professions/chef/">Chef (DE)</a> · <a href="/de/professions/hairdresser/">Hairdresser (DE)</a> · <a href="/de/visas/business-non-b/">Non-B (DE)</a></p>'
  );
});

patch('professions/chef/index.html', (h) => {
  if (h.includes('/de/professions/chef/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="https://pattaya-restaurant-guide.com/" target="_blank" rel="noopener noreferrer">Restaurant Guide</a> · <a href="/de/professions/chef/">Chef (DE)</a> · <a href="/ru/professions/chef/">(RU)</a> · <a href="/de/visas/business-non-b/">Non-B (DE)</a></p>'
  );
});

patch('professions/dj/index.html', (h) => {
  if (h.includes('/de/professions/dj/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/de/professions/dj/">DJ (DE)</a> · <a href="/ru/professions/dj/">(RU)</a> · <a href="/de/professions/content-creator/">Creator (DE)</a></p>'
  );
});

patch('professions/hairdresser/index.html', (h) => {
  if (h.includes('/de/professions/hairdresser/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/guides/setting-up-thai-company/">Thai company</a> · <a href="/de/professions/hairdresser/">Hairdresser (DE)</a> · <a href="/ru/professions/hairdresser/">(RU)</a> · <a href="/de/professions/real-estate-agent/">Real estate (DE)</a></p>'
  );
});

patch('work-permit/index.html', (h) => {
  if (h.includes('/de/professions/chef/')) return h;
  return h.replace(
    '<a href="/de/professions/yoga-teacher/">Yoga (DE)</a>.',
    '<a href="/de/professions/yoga-teacher/">Yoga (DE)</a> · <a href="/de/professions/chef/">Chef (DE)</a> · <a href="/de/professions/dj/">DJ (DE)</a> · <a href="/de/professions/hairdresser/">Hairdresser (DE)</a>.'
  );
});
