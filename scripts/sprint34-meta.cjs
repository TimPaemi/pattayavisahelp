/**
 * Sprint 34 — llms.txt, RU DTV meta, changelog counts, fonts, CSP.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// llms.txt
const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
const llmsOld = `- German visa overviews: \`/de/visas/{slug}/\` for all 12 pillars (e.g. [DTV auf Deutsch](https://pattayavisahelp.com/de/visas/dtv/))
- Russian visa overviews: \`/ru/visas/{slug}/\` for all 12 pillars (e.g. [DTV на русском](https://pattayavisahelp.com/ru/visas/dtv/))
- Profession overviews (DE/RU stubs): \`/de/professions/{slug}/\`, \`/ru/professions/{slug}/\` — saas-founder, dj, crypto-trader, english-teacher, yoga-teacher, content-creator`;
const llmsNew = `- **Indexed locale pilots (full translation):** [DTV auf Deutsch](https://pattayavisahelp.com/de/visas/dtv/), [DTV на русском](https://pattayavisahelp.com/ru/visas/dtv/)
- **Other \`/de/\` and \`/ru/\` URLs:** English mirror with “translation in progress” banner — \`noindex\` until properly translated (not in sitemap except the two DTV pilots)
- Profession pages (DE/RU, noindex stubs): \`/de/professions/{slug}/\`, \`/ru/professions/{slug}/\``;
if (llms.includes('for all 12 pillars')) {
  llms = llms.replace(llmsOld, llmsNew);
  fs.writeFileSync(llmsPath, llms);
  console.log('llms.txt: locale section updated');
}

// RU DTV meta
const ruDtv = path.join(ROOT, 'ru/visas/dtv/index.html');
let ru = fs.readFileSync(ruDtv, 'utf8');
const ruDescOld =
  'content="DTV виза Таиланд 2026 — 5 лет, 180 дней за въезд, ฿500 000 на счёте. Для удалёнщиков. Консультации из Пattaya."';
const ruDescNew =
  'content="DTV виза Таиланд 2026 — 5 лет, 180 дней за въезд, ฿500 000 на счёте. Для удалёнщиков. Независимый гид из Джомтьена, Pattaya."';
if (ru.includes(ruDescOld)) {
  ru = ru.replace(ruDescOld, ruDescNew);
  ru = ru.replace(ruDescOld, ruDescNew); // og/twitter if duplicated pattern
}
ru = ru.replace(
  /<meta name="description" content="[^"]*"\s*\/>/,
  '<meta name="description" content="DTV виза Таиланд 2026 — 5 лет, 180 дней за въезд, ฿500 000 на счёте. Для удалёнщиков. Независимый гид из Джомтьена, Pattaya." />'
);
fs.writeFileSync(ruDtv, ru);
console.log('ru/visas/dtv: meta description extended');

// Changelog 182 → 204
const clPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(clPath, 'utf8');
cl = cl.replace(/all 182 pages/g, 'all 204 indexed URLs');
cl = cl.replace(/182 pages/g, '204 indexed URLs');
fs.writeFileSync(clPath, cl);
console.log('changelog: page count updated');

// fonts-pilot → fonts.css
for (const rel of ['index.html', 'tools/visa-finder/index.html']) {
  const f = path.join(ROOT, rel);
  let h = fs.readFileSync(f, 'utf8');
  if (h.includes('fonts-pilot.css')) {
    h = h.replace('/assets/fonts/fonts-pilot.css', '/assets/fonts/fonts.css');
    fs.writeFileSync(f, h);
    console.log('fonts.css:', rel);
  }
}

// CSP
const headersPath = path.join(ROOT, '_headers');
let hdr = fs.readFileSync(headersPath, 'utf8');
const cspOld =
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:;";
const cspNew = "style-src 'self' 'unsafe-inline'; font-src 'self' data:;";
if (hdr.includes(cspOld)) {
  hdr = hdr.replace(cspOld, cspNew);
  fs.writeFileSync(headersPath, hdr);
  console.log('_headers: CSP fonts tightened');
}
