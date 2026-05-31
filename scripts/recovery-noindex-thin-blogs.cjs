/**
 * Temporarily noindex blog posts under 500 words until expanded.
 * Removes from Google index while recovery continues.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIN = 500;
const NOINDEX = '<meta name="robots" content="noindex,follow" />';
const KEEP_INDEXED = new Set([
  'marriage-non-o-documents-2026',
  'visa-agent-red-flags-2026',
  'ltr-royal-decree-743-2026',
  '2026-thailand-visa-changes-recap',
  '30-day-visa-exempt-rollback',
  'tdac-step-by-step',
]);

function wordCount(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const text = main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(Boolean).length;
}

function ensureNoindex(html) {
  if (/noindex/i.test(html.match(/<meta name="robots"[^>]+>/)?.[0] || '')) {
    return html.replace(/<meta name="robots" content="[^"]+"\s*\/?>/i, NOINDEX);
  }
  return html.replace(/<meta name="viewport"[^>]+\/?>/i, (m) => `${m}\n${NOINDEX}`);
}

const report = { noindexed: [], kept: [] };
const blogDir = path.join(ROOT, 'blog');
for (const slug of fs.readdirSync(blogDir)) {
  const file = path.join(blogDir, slug, 'index.html');
  if (!fs.existsSync(file) || slug === 'index.html') continue;
  const html = fs.readFileSync(file, 'utf8');
  const w = wordCount(html);
  if (slug === 'index' || KEEP_INDEXED.has(slug) || w >= MIN) {
    report.kept.push({ slug, words: w });
    continue;
  }
  fs.writeFileSync(file, ensureNoindex(html));
  report.noindexed.push({ slug, words: w });
}

console.log(JSON.stringify(report, null, 2));
