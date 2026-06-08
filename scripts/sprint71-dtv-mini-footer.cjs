/**
 * Sprint 71 — compact locale footer on DE/RU DTV pilots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'pvh-mini-footer';

const FOOTERS = {
  de: `<footer class="pvh-mini-footer" aria-label="Seitennavigation">
<!-- ${MARKER} -->
<nav class="pvh-mini-links">
<a href="/de/">Start</a>
<a href="/de/visas/">Alle Visa</a>
<a href="/de/guides/tm30-reporting/">TM30</a>
<a href="/de/guides/jomtien-immigration-office/">Jomtien</a>
<a href="/de/guides/thai-bank-account-as-foreigner/">Bankkonto</a>
<a href="/de/compare/dtv-vs-ltr/">DTV vs LTR</a>
<a href="/contact/">Kontakt</a>
</nav>
<p class="pvh-mini-copy">Pattaya Visa Help · Jomtien · Unabhängige Beratung</p>
</footer>`,
  ru: `<footer class="pvh-mini-footer" aria-label="Навигация">
<!-- ${MARKER} -->
<nav class="pvh-mini-links">
<a href="/ru/">Главная</a>
<a href="/ru/visas/">Визы</a>
<a href="/ru/guides/tm30-reporting/">TM30</a>
<a href="/ru/guides/jomtien-immigration-office/">Jomtien</a>
<a href="/ru/guides/thai-bank-account-as-foreigner/">Банк</a>
<a href="/ru/compare/dtv-vs-ltr/">DTV vs LTR</a>
<a href="/contact/">Контакт</a>
</nav>
<p class="pvh-mini-copy">Pattaya Visa Help · Jomtien</p>
</footer>`,
};

const RE = /<footer[^>]*>[\s\S]*?<\/footer>/;

for (const [lang, rel] of [
  ['de', 'de/visas/dtv/index.html'],
  ['ru', 'ru/visas/dtv/index.html'],
]) {
  const file = path.join(ROOT, rel);
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes(MARKER)) {
    console.log('skip', rel);
    continue;
  }
  h = h.replace(RE, FOOTERS[lang]);
  fs.writeFileSync(file, h);
  console.log('mini-footer', rel);
}
