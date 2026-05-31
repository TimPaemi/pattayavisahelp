/**
 * Remove duplicate index robots tag from DE/RU visa pages (noindex stub + EN template conflict).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const fixed = [];

for (const lang of ['de', 'ru']) {
  const dir = path.join(ROOT, lang, 'visas');
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir)) {
    const file = path.join(dir, slug, 'index.html');
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const tags = [...html.matchAll(/<meta name="robots" content="([^"]+)"\s*\/?>/gi)];
    if (tags.length < 2) continue;
    if (!/noindex/i.test(tags[0][1])) continue;
    html = html.replace(/<meta name="robots" content="index,follow[^"]*"\s*\/?>\s*\n?/gi, '');
    fs.writeFileSync(file, html);
    fixed.push(`/${lang}/visas/${slug}/`);
  }
}

console.log(JSON.stringify({ fixed: fixed.length, pages: fixed }, null, 2));
