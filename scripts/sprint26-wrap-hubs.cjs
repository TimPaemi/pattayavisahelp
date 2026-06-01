/** Wrap loose <li> blocks in ul on hub pages. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function fix(file) {
  let html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return false;
  let main = m[1];
  const out = main.replace(
    /(<h2>[^<]+<\/h2>\s*(?:\n\s*<p>[^<]*<\/p>\s*)?)\s*((?:<li>[\s\S]*?<\/li>\s*)+)(?=\s*(?:<p><strong>|<h2>|$))/g,
    (full, head, items) => (full.includes('<ul>') ? full : `${head}\n<ul>\n${items}</ul>\n`)
  );
  if (out === main) return false;
  html = html.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/i, `<main id="main" class="article-body">\n${out.trim()}\n</main>`);
  fs.writeFileSync(file, html);
  return true;
}

for (const p of ['/pattaya/', '/guides/']) {
  const file = path.join(ROOT, p.replace(/^\//, ''), 'index.html');
  console.log(p, fix(file) ? 'wrapped' : 'skip');
}
