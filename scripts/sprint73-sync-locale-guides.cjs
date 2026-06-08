/**
 * Sprint 73 — re-sync indexed DE/RU guide mains from scripts/content articles.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT = path.join(__dirname, 'content');

const MAP = [
  ['de/guides/jomtien-immigration-office/index.html', 'de-jomtien-guide-article.html'],
  ['de/guides/tm30-reporting/index.html', 'de-tm30-guide-article.html'],
  ['de/guides/90-day-reporting/index.html', 'de-90day-guide-article.html'],
  ['de/guides/re-entry-permits/index.html', 'de-reentry-guide-article.html'],
  ['de/guides/visa-overstay-penalties/index.html', 'de-overstay-guide-article.html'],
  ['de/guides/visa-runs-vs-extensions/index.html', 'de-visa-runs-guide-article.html'],
  ['de/guides/thai-bank-account-as-foreigner/index.html', 'de-bank-guide-article.html'],
  ['de/guides/health-insurance/index.html', 'de-health-insurance-guide-article.html'],
  ['de/guides/retiring-in-thailand/index.html', 'de-retiring-guide-article.html'],
  ['de/guides/cost-of-living-pattaya/index.html', 'de-cost-living-guide-article.html'],
  ['de/guides/driving-licence-thailand/index.html', 'de-driving-guide-article.html'],
  ['ru/guides/jomtien-immigration-office/index.html', 'ru-jomtien-guide-article.html'],
  ['ru/guides/tm30-reporting/index.html', 'ru-tm30-guide-article.html'],
  ['ru/guides/90-day-reporting/index.html', 'ru-90day-guide-article.html'],
  ['ru/guides/re-entry-permits/index.html', 'ru-reentry-guide-article.html'],
  ['ru/guides/visa-overstay-penalties/index.html', 'ru-overstay-guide-article.html'],
  ['ru/guides/visa-runs-vs-extensions/index.html', 'ru-visa-runs-guide-article.html'],
  ['ru/guides/thai-bank-account-as-foreigner/index.html', 'ru-bank-guide-article.html'],
  ['ru/guides/health-insurance/index.html', 'ru-health-insurance-guide-article.html'],
  ['ru/guides/retiring-in-thailand/index.html', 'ru-retiring-guide-article.html'],
  ['ru/guides/cost-of-living-pattaya/index.html', 'ru-cost-living-guide-article.html'],
  ['ru/guides/driving-licence-thailand/index.html', 'ru-driving-guide-article.html'],
];

let n = 0;
for (const [rel, art] of MAP) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    console.log('skip missing', rel);
    continue;
  }
  const article = fs.readFileSync(path.join(CONTENT, art), 'utf8');
  let h = fs.readFileSync(file, 'utf8');
  const next = h.replace(
    /<main id="main"[^>]*>[\s\S]*?<\/main>/,
    `<main id="main" class="article-body">\n${article}\n</main>`
  );
  if (next !== h) {
    fs.writeFileSync(file, next);
    console.log('synced', rel);
    n++;
  }
}
console.log('total', n);
