/**
 * Sprint 50 — inbound links to DE/RU tattoo-artist pilots.
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
  if (h.includes('tattoo-artist/">DE</a>')) return h;
  return h.replace(
    '<li><a href="/professions/tattoo-artist/"><strong>Tattoo artist</strong></a> — Studio employment vs guest spots vs ownership.</li>',
    '<li><a href="/professions/tattoo-artist/"><strong>Tattoo artist</strong></a> — <a href="/de/professions/tattoo-artist/">DE</a> · <a href="/ru/professions/tattoo-artist/">RU</a> — Studio employment vs guest spots vs ownership.</li>'
  );
});

patch('guides/setting-up-thai-company/index.html', (h) => {
  if (h.includes('Tattoo (DE)')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/de/professions/tattoo-artist/">Tattoo (DE)</a></p>')
  );
});

patch('professions/hairdresser/index.html', (h) => {
  if (h.includes('Tattoo (DE)')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    (m) => m.replace('</p>', ' · <a href="/de/professions/tattoo-artist/">Tattoo (DE)</a> · <a href="/ru/professions/tattoo-artist/">(RU)</a></p>')
  );
});

patch('work-permit/index.html', (h) => {
  if (h.includes('/de/professions/tattoo-artist/')) return h;
  return h
    .replace(
      '<a href="/professions/tattoo-artist/">Tattoo artist</a>',
      '<a href="/professions/tattoo-artist/">Tattoo artist</a> — <a href="/de/professions/tattoo-artist/">DE</a> · <a href="/ru/professions/tattoo-artist/">RU</a>'
    )
    .replace(
      '<a href="/de/professions/hairdresser/">Hairdresser (DE)</a>.',
      '<a href="/de/professions/hairdresser/">Hairdresser (DE)</a> · <a href="/de/professions/tattoo-artist/">Tattoo (DE)</a>.'
    );
});
