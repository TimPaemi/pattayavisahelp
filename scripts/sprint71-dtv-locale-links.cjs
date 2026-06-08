/**
 * Sprint 71 — point DTV DE/RU body links at indexed locale guides.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const PAIRS = [
  ['/guides/tm30-reporting/', '/de/guides/tm30-reporting/', '/ru/guides/tm30-reporting/'],
  ['/guides/90-day-reporting/', '/de/guides/90-day-reporting/', '/ru/guides/90-day-reporting/'],
  ['/guides/jomtien-immigration-office/', '/de/guides/jomtien-immigration-office/', '/ru/guides/jomtien-immigration-office/'],
  ['/visas/ltr/', '/de/visas/ltr/', '/ru/visas/ltr/'],
  ['/visas/business-non-b/', '/de/visas/business-non-b/', '/ru/visas/business-non-b/'],
];

for (const [lang, file] of [
  ['de', 'de/visas/dtv/index.html'],
  ['ru', 'ru/visas/dtv/index.html'],
]) {
  const f = path.join(ROOT, file);
  let h = fs.readFileSync(f, 'utf8');
  let n = 0;
  for (const [en, de, ru] of PAIRS) {
    const loc = lang === 'de' ? de : ru;
    const re = new RegExp(`href="${en.replace(/\//g, '\\/')}"`, 'g');
    const count = (h.match(re) || []).length;
    if (count) {
      h = h.replace(re, `href="${loc}"`);
      n += count;
    }
  }
  fs.writeFileSync(f, h);
  console.log(lang, 'dtv links', n);
}
