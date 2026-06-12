// Wire canonical TimPaemi author entity + Pattaya After Dark network link. Idempotent.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const FOOT_OLD = '<a href="https://mrweoutside.com/" target="_blank" rel="noopener noreferrer">Mr. We Outside</a>';
const FOOT_NEW = FOOT_OLD + ' · <a href="https://pattaya-afterdark.com/" target="_blank" rel="noopener noreferrer">Pattaya After Dark</a>';

const CANON_AUTHOR = '{"@type":"Person","@id":"https://timpaemi.com/#timpaemi","name":"TimPaemi","url":"https://timpaemi.com/","image":"https://timpaemi.com/authors/timpaemi.jpg"}';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || ['node_modules', 'scripts', '_research', '_audit', '_lighthouse-reports'].includes(e.name)) continue;
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, out);
    else if (e.name.endsWith('.html')) out.push(fp);
  }
  return out;
}

let foot = 0, meta = 0, author = 0;
for (const fp of walk(ROOT)) {
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  if (!html.includes('pattaya-afterdark.com')) {
    const next = html.split(FOOT_OLD).join(FOOT_NEW);
    if (next !== html) { html = next; foot++; }
  }

  let next = html.replace(/<meta name="author" content="(Tim Paemi|Pattaya Visa Help)" \/>/g,
    '<meta name="author" content="TimPaemi (timpaemi.com)" />');
  if (next !== html) { html = next; meta++; }

  // Pretty-printed flat Article author blocks -> canonical entity reference.
  next = html.replace(/"author":\s*\{\s*"@type":\s*"Person",\s*"name":\s*"Tim Paemi",\s*"url":\s*"[^"]*"\s*\}/g,
    `"author": ${CANON_AUTHOR}`);
  if (next !== html) { html = next; author++; }

  if (html !== before) fs.writeFileSync(fp, html);
}
console.log(`footer +After Dark: ${foot} files; meta author: ${meta} files; Article author -> canonical: ${author} files`);
