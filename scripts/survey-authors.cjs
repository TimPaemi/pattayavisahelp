const fs = require('fs');
const path = require('path');

const files = [];
for (const base of ['guides', 'blog', 'de/guides', 'ru/guides', 'de/blog', 'ru/blog']) {
  if (!fs.existsSync(base)) continue;
  for (const d of fs.readdirSync(base)) {
    const f = path.join(base, d, 'index.html');
    if (fs.existsSync(f)) files.push(f);
  }
}

const variants = {};
let none = 0;
let hasByline = 0;
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const m = h.match(/"author":\s*\{[^}]*\}/g);
  if (!m) none++;
  else for (const a of m) {
    const key = a.replace(/\s+/g, ' ').slice(0, 140);
    variants[key] = (variants[key] || 0) + 1;
  }
  if (h.includes('class="byline"')) hasByline++;
}

console.log('files:', files.length, '| no author JSON-LD:', none, '| existing bylines:', hasByline);
for (const [k, v] of Object.entries(variants).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  console.log(v, 'x', k);
}
