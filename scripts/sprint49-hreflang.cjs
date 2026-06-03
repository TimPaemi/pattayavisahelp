/**
 * Sprint 49 — hreflang de/ru on EN compare pillars (hua-hin, hua-hin-deep, visa matrix).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PAIRS = [
  { en: '/compare/pattaya-vs-hua-hin/', de: '/de/compare/pattaya-vs-hua-hin/', ru: '/ru/compare/pattaya-vs-hua-hin/' },
  { en: '/compare/pattaya-vs-hua-hin-deep/', de: '/de/compare/pattaya-vs-hua-hin-deep/', ru: '/ru/compare/pattaya-vs-hua-hin-deep/' },
  { en: '/compare/visa-comparison-matrix/', de: '/de/compare/visa-comparison-matrix/', ru: '/ru/compare/visa-comparison-matrix/' },
];

for (const { en, de, ru } of PAIRS) {
  const file = path.join(ROOT, en.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  let h = fs.readFileSync(file, 'utf8');
  const deTag = `<link rel="alternate" hreflang="de" href="${BASE}${de}" />`;
  const ruTag = `<link rel="alternate" hreflang="ru" href="${BASE}${ru}" />`;
  if (h.includes(deTag) && h.includes(ruTag)) {
    console.log('skip hreflang', en);
    continue;
  }
  const enLine = `<link rel="alternate" hreflang="en" href="${BASE}${en}" />`;
  let inject = '';
  if (!h.includes(deTag)) inject += deTag + '\n';
  if (!h.includes(ruTag)) inject += ruTag + '\n';
  h = h.replace(enLine, enLine + '\n' + inject.trim());
  fs.writeFileSync(file, h);
  console.log('hreflang', en);
}
