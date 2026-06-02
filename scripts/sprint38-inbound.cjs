/**
 * Sprint 38 — inbound links to ED + Tourist TR locale pilots.
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
  if (h.includes('/de/visas/education-ed/')) return h;
  return h
    .replace(
      '<a href="/visas/education-ed/">Full ED Visa guide →</a> · <a href="/guides/switch-ed-to-dtv/">ED to DTV switch guide →</a>',
      '<a href="/visas/education-ed/">Full ED Visa guide →</a> · <a href="/de/visas/education-ed/">ED (DE)</a> · <a href="/ru/visas/education-ed/">ED (RU)</a> · <a href="/guides/switch-ed-to-dtv/">ED to DTV switch guide →</a>'
    )
    .replace(
      '<a href="/visas/tourist-tr-evisa/">Full Tourist TR guide →</a>',
      '<a href="/visas/tourist-tr-evisa/">Full Tourist TR guide →</a> · <a href="/de/visas/tourist-tr-evisa/">TR (DE)</a> · <a href="/ru/visas/tourist-tr-evisa/">TR (RU)</a>'
    );
});

patch('guides/switch-ed-to-dtv/index.html', (h) => {
  if (h.includes('/de/visas/education-ed/')) return h;
  return h.replace(
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/visas/education-ed/">ED visa</a> · MOE:',
    '<p class="network-context"><a href="/visas/dtv/">DTV</a> · <a href="/de/visas/dtv/">DTV (DE)</a> · <a href="/visas/education-ed/">ED visa</a> · <a href="/de/visas/education-ed/">ED (DE)</a> · <a href="/ru/visas/education-ed/">ED (RU)</a> · MOE:'
  );
});

patch('guides/verify-moe-accredited-school/index.html', (h) => {
  if (h.includes('/de/visas/education-ed/')) return h;
  return h.replace(
    'ED visa: <a href="/visas/education-ed/">Education ED visa</a>',
    'ED visa: <a href="/visas/education-ed/">Education ED visa</a> · <a href="/de/visas/education-ed/">ED (DE)</a> · <a href="/ru/visas/education-ed/">ED (RU)</a>'
  );
});

patch('guides/visa-runs-vs-extensions/index.html', (h) => {
  if (h.includes('/de/visas/tourist-tr-evisa/')) return h;
  return h.replace(
    'TR workaround: <a href="/visas/tourist-tr-evisa/">Tourist TR e-Visa</a>',
    'TR workaround: <a href="/visas/tourist-tr-evisa/">Tourist TR e-Visa</a> · <a href="/de/visas/tourist-tr-evisa/">TR (DE)</a> · <a href="/ru/visas/tourist-tr-evisa/">TR (RU)</a>'
  );
});

patch('compare/ed-vs-dtv/index.html', (h) => {
  if (h.includes('/de/visas/education-ed/')) return h;
  return h.replace(
    '<p class="network-context"><a href="/visas/education-ed/">ED visa</a> · <a href="/visas/dtv/">DTV</a>',
    '<p class="network-context"><a href="/visas/education-ed/">ED visa</a> · <a href="/de/visas/education-ed/">ED (DE)</a> · <a href="/ru/visas/education-ed/">ED (RU)</a> · <a href="/visas/dtv/">DTV</a> · <a href="/de/visas/dtv/">DTV (DE)</a>'
  );
});

function patchFooterHub(lang) {
  const rel = `${lang}/index.html`;
  patch(rel, (h) => {
    if (h.includes(`/de/visas/education-ed/`) && lang === 'de') return h;
    if (h.includes(`/ru/visas/education-ed/`) && lang === 'ru') return h;
    const marker = '<a href="/visas/">All 12 →</a>';
    const insert =
      lang === 'de'
        ? '<a href="/de/visas/business-non-b/">Non-B (DE)</a><a href="/de/visas/smart/">SMART (DE)</a><a href="/de/visas/education-ed/">ED (DE)</a><a href="/de/visas/tourist-tr-evisa/">TR (DE)</a>'
        : '<a href="/ru/visas/business-non-b/">Non-B (RU)</a><a href="/ru/visas/smart/">SMART (RU)</a><a href="/ru/visas/education-ed/">ED (RU)</a><a href="/ru/visas/tourist-tr-evisa/">TR (RU)</a>';
    if (h.includes(insert.slice(0, 40))) return h;
    return h.replace(marker, `${insert}${marker}`);
  });
}

patchFooterHub('de');
patchFooterHub('ru');

console.log('Sprint 38 inbound done');
