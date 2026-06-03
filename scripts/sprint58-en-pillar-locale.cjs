/**
 * Sprint 58 — EN visa + compare pillars link DE/RU pilots and locale hubs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const VISA_COMPARE = {
  dtv: ['/compare/dtv-vs-ltr/', '/compare/ed-vs-dtv/', '/compare/dtv-vs-elite/'],
  ltr: ['/compare/privilege-vs-ltr/', '/compare/smart-vs-ltr/', '/compare/dtv-vs-ltr/'],
  'privilege-elite': ['/compare/privilege-vs-ltr/', '/compare/dtv-vs-elite/'],
  'retirement-non-o': ['/compare/non-o-vs-o-a/', '/compare/marriage-vs-retirement/'],
  'retirement-o-a': ['/compare/o-a-vs-o-x/', '/compare/non-o-vs-o-a/'],
  'retirement-o-x': ['/compare/o-a-vs-o-x/'],
  'marriage-non-o': ['/compare/marriage-vs-retirement/'],
  'business-non-b': ['/work-permit/'],
  smart: ['/compare/smart-vs-ltr/', '/compare/dtv-vs-smart/'],
  'education-ed': ['/compare/ed-vs-dtv/'],
  'tourist-tr-evisa': ['/guides/visa-runs-vs-extensions/'],
  'media-non-m': ['/professions/content-creator/'],
};

function localeBlock(kind, slug) {
  const compares = (VISA_COMPARE[slug] || [])
    .map((h) => `<a href="${h}">${h.split('/').filter(Boolean).pop()}</a>`)
    .join(' · ');
  const cmp = compares ? ` · ${compares}` : '';
  if (kind === 'visa') {
    return `<!-- sprint58-en-locale -->\n<p class="network-context">Pilots: <a href="/de/visas/${slug}/">DE</a> · <a href="/ru/visas/${slug}/">RU</a> · Hubs: <a href="/de/visas/">Visas (DE)</a> · <a href="/ru/visas/">Visas (RU)</a> · <a href="/de/best-visa/">Budget (DE)</a> · <a href="/ru/pattaya/">Pattaya (RU)</a>${cmp}</p>\n`;
  }
  return `<!-- sprint58-en-locale -->\n<p class="network-context">Pilots: <a href="/de/compare/${slug}/">DE</a> · <a href="/ru/compare/${slug}/">RU</a> · <a href="/de/compare/">Compare (DE)</a> · <a href="/ru/compare/">Compare (RU)</a>${cmp}</p>\n`;
}

function insertBeforeFaq(file, block) {
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('sprint58-en-locale')) return false;
  const anchors = [
    '<h2>FAQ</h2>',
    '<div class="faq">',
    '<h2>Related',
    '<h2>Want a personal answer?',
    '<h2 class="read-next-h2">',
  ];
  for (const a of anchors) {
    if (h.includes(a)) {
      h = h.replace(a, `${block}${a}`);
      fs.writeFileSync(file, h);
      return true;
    }
  }
  return false;
}

let n = 0;
const visasDir = path.join(ROOT, 'visas');
for (const slug of fs.readdirSync(visasDir)) {
  const file = path.join(visasDir, slug, 'index.html');
  if (!fs.existsSync(file) || slug === 'index.html') continue;
  if (insertBeforeFaq(file, localeBlock('visa', slug))) {
    n++;
    console.log('visa', slug);
  }
}

const compareDir = path.join(ROOT, 'compare');
for (const slug of fs.readdirSync(compareDir)) {
  const file = path.join(compareDir, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  if (insertBeforeFaq(file, localeBlock('compare', slug))) {
    n++;
    console.log('compare', slug);
  }
}

console.log(`Sprint 58 EN pillar locale: ${n} pages`);
