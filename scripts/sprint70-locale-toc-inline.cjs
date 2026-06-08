/**
 * Sprint 70 — inline TOC script strings on DE/RU guide pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const RE = /toc\.innerHTML = '<div class="toc-label">\/\/ On this page<\/div><ul><\/ul>';/g;

const DE = "toc.innerHTML = '<div class=\"toc-label\">// Auf dieser Seite</div><ul></ul>';";
const RU = "toc.innerHTML = '<div class=\"toc-label\">// На этой странице</div><ul></ul>';";

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

let n = 0;
for (const lang of ['de', 'ru']) {
  const dir = path.join(ROOT, lang, 'guides');
  if (!fs.existsSync(dir)) continue;
  const rep = lang === 'de' ? DE : RU;
  for (const file of walk(dir)) {
    let h = fs.readFileSync(file, 'utf8');
    if (!RE.test(h)) continue;
    RE.lastIndex = 0;
    h = h.replace(RE, rep);
    fs.writeFileSync(file, h);
    n++;
    console.log('toc', path.relative(ROOT, file));
  }
}
console.log(`TOC inline: ${n} files`);
