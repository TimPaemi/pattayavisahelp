/**
 * Sprint 39 — hreflang de/ru on EN O-A, O-X, Media Non-M pillars.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PAIRS = [
  { en: '/visas/retirement-o-a/', de: '/de/visas/retirement-o-a/', ru: '/ru/visas/retirement-o-a/' },
  { en: '/visas/retirement-o-x/', de: '/de/visas/retirement-o-x/', ru: '/ru/visas/retirement-o-x/' },
  { en: '/visas/media-non-m/', de: '/de/visas/media-non-m/', ru: '/ru/visas/media-non-m/' },
];

for (const { en, de, ru } of PAIRS) {
  const file = path.join(ROOT, en.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  if (!fs.existsSync(file)) continue;
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
