/**
 * Sprint 62 — inbound to DE/RU landing stubs + tools + pattaya areas.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'sprint62-inbound';

const EN_LANDING = [
  ['banking/index.html', '/de/banking/', '/ru/banking/'],
  ['retirement/index.html', '/de/retirement/', '/ru/retirement/'],
  ['tax/index.html', '/de/tax/', '/ru/tax/'],
  ['property/index.html', '/de/property/', '/ru/property/'],
  ['healthcare/index.html', '/de/healthcare/', '/ru/healthcare/'],
  ['digital-nomad/index.html', '/de/digital-nomad/', '/ru/digital-nomad/'],
  ['coworking/index.html', '/de/coworking/', '/ru/coworking/'],
  ['gyms/index.html', '/de/professions/fitness-trainer/', '/ru/professions/fitness-trainer/'],
  ['faq/index.html', '/de/faq/', '/ru/faq/'],
  ['services/index.html', '/de/services/', '/ru/services/'],
  ['resources/index.html', '/de/resources/', '/ru/resources/'],
  ['case-studies/index.html', '/de/case-studies/', '/ru/case-studies/'],
  ['pattaya-digital-nomad-guide/index.html', '/de/pattaya-digital-nomad-guide/', '/ru/pattaya-digital-nomad-guide/'],
];

function patch(rel, fn) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return;
  let h = fs.readFileSync(file, 'utf8');
  const next = fn(h);
  if (next === h) return;
  fs.writeFileSync(file, next);
  console.log('patch', rel);
}

for (const [en, de, ru] of EN_LANDING) {
  patch(en, (h) => {
    if (h.includes(MARKER)) return h;
    const block = `<p class="network-context">Locale mirrors: <a href="${de}">DE</a> · <a href="${ru}">RU</a> · <a href="/de/guides/jomtien-immigration-office/">Jomtien guide (DE)</a> · <a href="/de/pattaya/">Pattaya (DE)</a></p>\n<!-- ${MARKER} -->\n`;
    if (h.includes('sprint57-locale-hubs')) {
      return h.replace('<!-- sprint57-locale-hubs -->', `<!-- ${MARKER} -->\n${block}<!-- sprint57-locale-hubs -->`);
    }
    return h.replace('<main id="main"', `${block}<main id="main"`);
  });
}

patch('de/index.html', (h) => {
  if (h.includes('sprint62-de-landings')) return h;
  const block = `<h2 id="sprint62-de-landings">Weitere Themen (DE)</h2>
<p><a href="/de/banking/">Banking</a> · <a href="/de/retirement/">Rente</a> · <a href="/de/faq/">FAQ</a> · <a href="/de/tax/">Steuer</a> · <a href="/de/healthcare/">Gesundheit</a> · <a href="/de/property/">Immobilie</a> · <a href="/de/digital-nomad/">Nomad</a> · <a href="/de/coworking/">Coworking</a> · <a href="/de/guides/jomtien-immigration-office/">Jomtien Büro</a></p>\n`;
  return h.replace('<h2>Leitfäden (Living in Thailand)</h2>', block + '<h2>Leitfäden (Living in Thailand)</h2>');
});

patch('ru/index.html', (h) => {
  if (h.includes('sprint62-ru-landings')) return h;
  const block = `<h2 id="sprint62-ru-landings">Темы (RU)</h2>
<p><a href="/ru/banking/">банк</a> · <a href="/ru/retirement/">пенсия</a> · <a href="/ru/faq/">FAQ</a> · <a href="/ru/guides/jomtien-immigration-office/">Jomtien</a> · <a href="/ru/pattaya/">Паттайя</a></p>\n`;
  return h.replace('<h2>Гиды (жизнь в Таиланде)</h2>', block + '<h2>Гиды (жизнь в Таиланде)</h2>');
});

// DE tools hub — link DE tool stubs
patch('de/tools/index.html', (h) => {
  if (h.includes('sprint62-tool-stubs')) return h;
  const block = `<h2 id="sprint62-tool-stubs">DE-Tool-Spiegel (noindex, EN funktioniert)</h2>
<ul>
<li><a href="/de/tools/visa-finder/">Visa Finder (DE)</a> → <a href="/tools/visa-finder/">EN</a></li>
<li><a href="/de/tools/income-test/">Income Test</a> → <a href="/tools/income-test/">EN</a></li>
<li><a href="/de/tools/bank-checker/">Bank Checker</a> → <a href="/tools/bank-checker/">EN</a></li>
<li><a href="/de/tools/document-checklist/">Checklist</a> → <a href="/tools/document-checklist/">EN</a></li>
<li><a href="/de/tools/expiry-countdown/">Countdown</a> → <a href="/tools/expiry-countdown/">EN</a></li>
<li><a href="/de/tools/reminder/">Reminder</a> → <a href="/tools/reminder/">EN</a></li>
<li><a href="/de/tools/cost-calculator/">Cost calc</a> → <a href="/tools/cost-calculator/">EN</a></li>
<li><a href="/de/tools/currency-converter/">FX</a> → <a href="/tools/currency-converter/">EN</a></li>
<li><a href="/de/tools/eligibility/">LTR check</a> → <a href="/tools/eligibility/">EN</a></li>
</ul>\n`;
  return h.replace('<h2>Einzelne /de/tools/*-Seiten</h2>', block + '<h2>Einzelne /de/tools/*-Seiten</h2>');
});

// DE pattaya hub — area stubs
patch('de/pattaya/index.html', (h) => {
  if (h.includes('sprint62-pattaya-stubs')) return h;
  const block = `<p><strong>Stadtteile (DE-Spiegel):</strong> <a href="/de/pattaya/jomtien/">Jomtien</a> · <a href="/de/pattaya/wongamat/">Wongamat</a> · <a href="/de/pattaya/naklua/">Naklua</a> · <a href="/de/pattaya/pratumnak/">Pratumnak</a> · <a href="/de/pattaya/east-pattaya/">East</a> · <a href="/pattaya/living-in-pattaya/">Living (EN)</a></p>\n<!-- sprint62-pattaya-stubs -->\n`;
  if (!h.includes('<main id="main"')) return h;
  return h.replace('<p><strong>Stadtteile (EN):</strong>', block + '<p><strong>Stadtteile (EN):</strong>');
});

// Update de-guides-hub article source
const hubArticle = path.join(__dirname, 'content/de-guides-hub-article.html');
let ha = fs.readFileSync(hubArticle, 'utf8');
if (!ha.includes('/de/guides/jomtien-immigration-office/')) {
  ha = ha.replace(
    '<p>Pattaya-Bewohner: die meisten Verlängerungen laufen über <a href="/guides/jomtien-immigration-office/">Jomtien Immigration (EN)</a>',
    '<p>Pattaya-Bewohner: <a href="/de/guides/jomtien-immigration-office/"><strong>Jomtien Immigration (DE) — indexiert</strong></a> · <a href="/guides/jomtien-immigration-office/">(EN)</a>'
  );
  fs.writeFileSync(hubArticle, ha);
  console.log('updated de-guides-hub-article');
}

// Sync de/guides hub if main matches
const deGuidesHub = path.join(ROOT, 'de/guides/index.html');
let dg = fs.readFileSync(deGuidesHub, 'utf8');
if (dg.includes('Jomtien Immigration (EN)') && !dg.includes('indexiert')) {
  dg = dg.replace(
    'Jomtien Immigration (EN)</a>',
    'Jomtien Immigration (DE) — indexiert</a></strong> · <a href="/guides/jomtien-immigration-office/">(EN)</a><strong><a href="/de/guides/jomtien-immigration-office/">'
  );
  // simpler replace
}
if (!dg.includes('/de/guides/jomtien-immigration-office/"><strong>')) {
  const re = /Jomtien Immigration \(EN\)<\/a>/;
  if (re.test(dg)) {
    dg = dg.replace(
      re,
      '<a href="/de/guides/jomtien-immigration-office/"><strong>Jomtien (DE pilot)</strong></a> · <a href="/guides/jomtien-immigration-office/">Jomtien (EN)</a>'
    );
    fs.writeFileSync(deGuidesHub, dg);
    console.log('synced de/guides/index.html');
  }
}

patch('guides/index.html', (h) => {
  if (h.includes('/de/guides/jomtien-immigration-office/"><strong>')) return h;
  return h.replace(
    '<a href="/guides/jomtien-immigration-office/">',
    '<a href="/de/guides/jomtien-immigration-office/">Jomtien (DE)</a> · <a href="/guides/jomtien-immigration-office/">'
  );
});

console.log('Sprint 62 inbound done');
