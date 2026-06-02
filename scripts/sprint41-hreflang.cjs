/**
 * Sprint 41 — hreflang de/ru on EN compare pillars.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PAIRS = [
  { en: '/compare/non-o-vs-o-a/', de: '/de/compare/non-o-vs-o-a/', ru: '/ru/compare/non-o-vs-o-a/' },
  { en: '/compare/o-a-vs-o-x/', de: '/de/compare/o-a-vs-o-x/', ru: '/ru/compare/o-a-vs-o-x/' },
  { en: '/compare/dtv-vs-smart/', de: '/de/compare/dtv-vs-smart/', ru: '/ru/compare/dtv-vs-smart/' },
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
