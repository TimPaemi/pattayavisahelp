/** Fix double-escaped HTML entities (&amp;mdash; etc.) that render literally to users. */
const fs = require('fs');
const path = require('path');

const RE = /&amp;(mdash|ndash|rsquo|lsquo|ldquo|rdquo|times|hellip|#x27|#39);/g;

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let fixed = 0;
for (const f of walk('.', [])) {
  const html = fs.readFileSync(f, 'utf8');
  if (!RE.test(html)) continue;
  RE.lastIndex = 0;
  fs.writeFileSync(f, html.replace(RE, '&$1;'));
  console.log('fixed:', f);
  fixed++;
}
console.log('total files fixed:', fixed);
