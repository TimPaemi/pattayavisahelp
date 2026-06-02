/**
 * Sprint 46 — inbound links to DE/RU profession pilots.
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
  if (h.includes('/de/professions/yoga-teacher/')) return h;
  return h
    .replace(
      '<li><a href="/professions/yoga-teacher/"><strong>Yoga teacher</strong></a>',
      '<li><a href="/professions/yoga-teacher/"><strong>Yoga teacher</strong></a> — <a href="/de/professions/yoga-teacher/">DE</a> · <a href="/ru/professions/yoga-teacher/">RU</a>'
    )
    .replace(
      '<li><a href="/professions/photographer/"><strong>Photographer + videographer</strong></a>',
      '<li><a href="/professions/photographer/"><strong>Photographer + videographer</strong></a> — <a href="/de/professions/photographer/">DE</a> · <a href="/ru/professions/photographer/">RU</a>'
    )
    .replace(
      '<li><a href="/professions/real-estate-agent/"><strong>Real estate agent</strong></a>',
      '<li><a href="/professions/real-estate-agent/"><strong>Real estate agent</strong></a> — <a href="/de/professions/real-estate-agent/">DE</a> · <a href="/ru/professions/real-estate-agent/">RU</a>'
    );
});

patch('property/index.html', (h) => {
  if (h.includes('/de/professions/real-estate-agent/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/guides/buying-property-thailand/">Buying property Thailand</a> · <a href="/de/professions/real-estate-agent/">Real estate agent (DE)</a> · <a href="/ru/professions/real-estate-agent/">(RU)</a> · <a href="https://pattayastream.com/" target="_blank" rel="noopener noreferrer">Pattaya Villa Stream</a></p>'
  );
});

patch('guides/buying-property-thailand/index.html', (h) => {
  if (h.includes('/de/professions/real-estate-agent/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/property/">Property hub</a> · <a href="/de/professions/real-estate-agent/">Real estate agent (DE)</a> · <a href="/ru/professions/real-estate-agent/">(RU)</a> · <a href="/de/visas/business-non-b/">Non-B (DE)</a></p>'
  );
});

patch('professions/yoga-teacher/index.html', (h) => {
  if (h.includes('/de/professions/yoga-teacher/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/de/professions/yoga-teacher/">Yoga (DE)</a> · <a href="/ru/professions/yoga-teacher/">(RU)</a> · <a href="/de/professions/fitness-trainer/">Fitness (DE)</a></p>'
  );
});

patch('professions/photographer/index.html', (h) => {
  if (h.includes('/de/professions/photographer/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/de/professions/photographer/">Photographer (DE)</a> · <a href="/ru/professions/photographer/">(RU)</a> · <a href="/de/professions/content-creator/">Creator (DE)</a></p>'
  );
});

patch('professions/real-estate-agent/index.html', (h) => {
  if (h.includes('Real estate (DE)</a>')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/property/">Property hub</a> · <a href="/de/professions/real-estate-agent/">Real estate (DE)</a> · <a href="/ru/professions/real-estate-agent/">(RU)</a> · <a href="/de/visas/business-non-b/">Non-B (DE)</a></p>'
  );
});

patch('work-permit/index.html', (h) => {
  if (h.includes('/de/professions/photographer/')) return h;
  return h.replace(
    'Pattaya employers in hospitality, education, and diving commonly sponsor Non-B holders.',
    'Pattaya employers in hospitality, education, and diving commonly sponsor Non-B holders. Guides: <a href="/de/professions/photographer/">Photographer (DE)</a> · <a href="/de/professions/real-estate-agent/">Real estate (DE)</a> · <a href="/de/professions/yoga-teacher/">Yoga (DE)</a>.'
  );
});
