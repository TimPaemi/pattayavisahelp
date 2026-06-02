/**
 * Sprint 36 — hreflang de/ru on EN visa pillars with indexed pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const PAIRS = [
  { en: '/visas/dtv/', de: '/de/visas/dtv/', ru: '/ru/visas/dtv/' },
  { en: '/visas/ltr/', de: '/de/visas/ltr/', ru: '/ru/visas/ltr/' },
  { en: '/visas/retirement-non-o/', de: '/de/visas/retirement-non-o/', ru: '/ru/visas/retirement-non-o/' },
  { en: '/visas/privilege-elite/', de: '/de/visas/privilege-elite/', ru: '/ru/visas/privilege-elite/' },
  { en: '/visas/marriage-non-o/', de: '/de/visas/marriage-non-o/', ru: '/ru/visas/marriage-non-o/' },
];

const BASE = 'https://pattayavisahelp.com';

for (const { en, de, ru } of PAIRS) {
  const file = path.join(ROOT, en.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  if (!fs.existsSync(file)) {
    console.warn('missing', file);
    continue;
  }
  let h = fs.readFileSync(file, 'utf8');
  const deTag = `<link rel="alternate" hreflang="de" href="${BASE}${de}" />`;
  const ruTag = `<link rel="alternate" hreflang="ru" href="${BASE}${ru}" />`;
  if (h.includes(deTag) && h.includes(ruTag)) {
    console.log('skip hreflang', en);
    continue;
  }
  const enLine = `<link rel="alternate" hreflang="en" href="${BASE}${en}" />`;
  if (!h.includes(enLine)) {
    console.warn('no en hreflang', en);
    continue;
  }
  let inject = '';
  if (!h.includes(deTag)) inject += deTag + '\n';
  if (!h.includes(ruTag)) inject += ruTag + '\n';
  h = h.replace(enLine, enLine + '\n' + inject.trim());
  fs.writeFileSync(file, h);
  console.log('hreflang', en);
}
