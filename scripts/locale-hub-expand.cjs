/**
 * Expand DE/RU hub pages with guide + compare link grids.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = '<!-- LOCALE-GRID-S8 -->';

const TOP_GUIDES = [
  ['90-day-reporting', '90-Tage-Meldung', '90-дневная отчётность'],
  ['tm30-reporting', 'TM30 Meldung', 'TM30 отчётность'],
  ['jomtien-immigration-office', 'Jomtien Immigration', 'Иммиграция Jomtien'],
  ['retiring-in-thailand', 'Rente in Thailand', 'Пенсия в Таиланде'],
  ['thai-bank-account-as-foreigner', 'Bankkonto', 'Банковский счёт'],
  ['switch-ed-to-dtv', 'ED → DTV wechseln', 'ED → DTV'],
  ['re-entry-permits', 'Re-Entry Permits', 'Re-entry permit'],
  ['visa-overstay-penalties', 'Overstay Strafen', 'Overstay штрафы'],
];

const TOP_COMPARES = [
  ['dtv-vs-ltr', 'DTV vs LTR', 'DTV vs LTR'],
  ['ed-vs-dtv', 'ED vs DTV', 'ED vs DTV'],
  ['privilege-vs-ltr', 'Privilege vs LTR', 'Privilege vs LTR'],
  ['non-o-vs-o-a', 'Non-O vs O-A', 'Non-O vs O-A'],
  ['visa-comparison-matrix', 'Visum-Matrix', 'Матрица виз'],
];

function grid(lang) {
  const guideLinks = TOP_GUIDES.map(([slug, deLabel, ruLabel]) =>
    `<li><a href="/${lang}/guides/${slug}/">${lang === 'de' ? deLabel : ruLabel}</a></li>`
  ).join('\n');
  const compareLinks = TOP_COMPARES.map(([slug, deLabel, ruLabel]) =>
    `<li><a href="/${lang}/compare/${slug}/">${lang === 'de' ? deLabel : ruLabel}</a></li>`
  ).join('\n');
  const h2g = lang === 'de' ? 'Leitfäden auf Deutsch' : 'Гиды на русском';
  const h2c = lang === 'de' ? 'Visum-Vergleiche auf Deutsch' : 'Сравнения виз на русском';
  const allG = lang === 'de' ? 'Alle Leitfäden →' : 'Все гиды →';
  const allC = lang === 'de' ? 'Alle Vergleiche →' : 'Все сравнения →';
  return `${MARKER}
<h2>${h2g}</h2>
<ul>
${guideLinks}
<li><a href="/guides/">${allG}</a></li>
</ul>
<h2>${h2c}</h2>
<ul>
${compareLinks}
<li><a href="/compare/">${allC}</a></li>
</ul>
`;
}

for (const lang of ['de', 'ru']) {
  const f = path.join(ROOT, lang, 'index.html');
  if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, 'utf8');
  if (html.includes(MARKER)) continue;
  const block = grid(lang);
  if (html.includes('<h2>Visum-Übersichten auf Deutsch</h2>')) {
    html = html.replace('<h2>Visum-Übersichten auf Deutsch</h2>', block + '\n<h2>Visum-Übersichten auf Deutsch</h2>');
  } else if (html.includes('<h2>Обзоры виз на русском</h2>')) {
    html = html.replace('<h2>Обзоры виз на русском</h2>', block + '\n<h2>Обзоры виз на русском</h2>');
  } else {
    html = html.replace('<main id="main" class="article-body">', `<main id="main" class="article-body">\n${block}`);
  }
  html = html.replace(/UPDATED 18 MAY 2026/g, 'UPDATED 4 JUN 2026');
  html = html.replace(/"dateModified": "2026-05-18"/g, '"dateModified": "2026-06-04"');
  fs.writeFileSync(f, html);
  console.log('Updated', lang, 'hub');
}
