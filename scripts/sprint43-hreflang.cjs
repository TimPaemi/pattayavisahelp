/**
 * Sprint 43 — hreflang de/ru on EN profession pillars.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://pattayavisahelp.com';

const PAIRS = [
  { en: '/professions/content-creator/', de: '/de/professions/content-creator/', ru: '/ru/professions/content-creator/' },
  { en: '/professions/saas-founder/', de: '/de/professions/saas-founder/', ru: '/ru/professions/saas-founder/' },
  { en: '/professions/online-business-owner/', de: '/de/professions/online-business-owner/', ru: '/ru/professions/online-business-owner/' },
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
