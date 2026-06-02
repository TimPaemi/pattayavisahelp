/**
 * Sprint 45 — inbound links to DE/RU profession pilots.
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
  if (h.includes('/de/professions/english-teacher/')) return h;
  return h
    .replace(
      '<li><a href="/professions/english-teacher/"><strong>English teacher</strong></a>',
      '<li><a href="/professions/english-teacher/"><strong>English teacher</strong></a> — <a href="/de/professions/english-teacher/">DE</a> · <a href="/ru/professions/english-teacher/">RU</a>'
    )
    .replace(
      '<li><a href="/professions/diving-instructor/"><strong>Diving instructor</strong></a>',
      '<li><a href="/professions/diving-instructor/"><strong>Diving instructor</strong></a> — <a href="/de/professions/diving-instructor/">DE</a> · <a href="/ru/professions/diving-instructor/">RU</a>'
    )
    .replace(
      '<li><a href="/professions/fitness-trainer/"><strong>Fitness trainer</strong></a>',
      '<li><a href="/professions/fitness-trainer/"><strong>Fitness trainer</strong></a> — <a href="/de/professions/fitness-trainer/">DE</a> · <a href="/ru/professions/fitness-trainer/">RU</a>'
    );
});

patch('work-permit/index.html', (h) => {
  if (h.includes('/de/professions/diving-instructor/')) return h;
  return h.replace(
    '<a href="/visas/business-non-b/">Non-B visa</a>',
    '<a href="/visas/business-non-b/">Non-B visa</a> · <a href="/de/professions/diving-instructor/">Diving (DE)</a> · <a href="/de/professions/fitness-trainer/">Fitness (DE)</a> · <a href="/de/professions/english-teacher/">Teachers (DE)</a>'
  );
});

patch('guides/verify-moe-accredited-school/index.html', (h) => {
  if (h.includes('/de/professions/english-teacher/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/guides/verify-moe-accredited-school/">MOE guide</a> · <a href="/de/professions/english-teacher/">English teacher (DE)</a> · <a href="/ru/professions/english-teacher/">(RU)</a> · <a href="/de/visas/education-ed/">ED (DE)</a></p>'
  );
});

patch('professions/english-teacher/index.html', (h) => {
  if (h.includes('English teacher (DE)</a>')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/visas/education-ed/">ED</a> · <a href="/de/professions/english-teacher/">English teacher (DE)</a> · <a href="/ru/professions/english-teacher/">(RU)</a> · <a href="/guides/verify-moe-accredited-school/">MOE schools</a></p>'
  );
});

patch('professions/fitness-trainer/index.html', (h) => {
  if (h.includes('/de/professions/fitness-trainer/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="https://pattaya-gym.com/" target="_blank" rel="noopener noreferrer">Pattaya Gym</a> · <a href="/de/professions/fitness-trainer/">Fitness (DE)</a> · <a href="/ru/professions/fitness-trainer/">(RU)</a> · <a href="/de/visas/dtv/">DTV (DE)</a></p>'
  );
});

patch('professions/diving-instructor/index.html', (h) => {
  if (h.includes('/de/professions/diving-instructor/')) return h;
  const re = /<p class="network-context">[^<]*<\/p>/;
  if (!re.test(h)) return h;
  return h.replace(
    re,
    '<p class="network-context"><a href="/work-permit/">Work permit</a> · <a href="/de/professions/diving-instructor/">Diving (DE)</a> · <a href="/ru/professions/diving-instructor/">(RU)</a> · <a href="/de/visas/business-non-b/">Non-B (DE)</a></p>'
  );
});
