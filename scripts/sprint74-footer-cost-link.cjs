/**
 * Sprint 74 — add cost-of-living link to DE/RU visa pilot footers.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const TARGETS = [
  'de/visas/dtv/index.html',
  'ru/visas/dtv/index.html',
  'de/visas/ltr/index.html',
  'ru/visas/ltr/index.html',
  'de/visas/retirement-non-o/index.html',
  'ru/visas/retirement-non-o/index.html',
];

const INSERT = {
  de: '<a href="/de/guides/cost-of-living-pattaya/">Lebenshaltung</a>',
  ru: '<a href="/ru/guides/cost-of-living-pattaya/">Расходы</a>',
};

for (const rel of TARGETS) {
  const lang = rel.startsWith('de/') ? 'de' : 'ru';
  const file = path.join(ROOT, rel);
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes('/guides/cost-of-living-pattaya/')) {
    console.log('skip', rel);
    continue;
  }
  const link = INSERT[lang];
  if (h.includes('pvh-mini-footer')) {
    const jom =
      lang === 'de'
        ? '<a href="/de/guides/jomtien-immigration-office/">Jomtien</a>'
        : '<a href="/ru/guides/jomtien-immigration-office/">Jomtien</a>';
    h = h.replace(jom, `${link}\n${jom}`);
  } else {
    const anchor =
      lang === 'de'
        ? '<a href="/de/guides/">Leitfäden</a>'
        : '<a href="/ru/guides/">Гиды</a>';
    if (!h.includes(anchor)) {
      console.log('no anchor', rel);
      continue;
    }
    h = h.replace(anchor, `${link}${anchor}`);
  }
  fs.writeFileSync(file, h);
  console.log('cost link', rel);
}
