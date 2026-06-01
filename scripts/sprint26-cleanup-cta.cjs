/**
 * Remove CTA blocks appended by sprint26 sweep on pages that did not have them.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

const CTA_TAIL = /\n\n<p><strong>Free 15-min consultation<\/strong><\/p>\s*\n<h2>Want a personal answer\?<\/h2>\s*\n<p>A real human in Pattaya replies within 24 hours\.<\/p>\s*\n<p><a href="\/contact\/">Book free consult →<\/a> · <a href="https:\/\/api\.whatsapp\.com[^"]+"[^>]*>WhatsApp \+66 96 728 6999<\/a><\/p>\s*$/;

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function headContent(filePath) {
  try {
    return execSync(`git show HEAD:${filePath}`, { cwd: ROOT, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  } catch {
    return null;
  }
}

const changed = execSync('git diff --name-only', { cwd: ROOT, encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter((f) => f.endsWith('.html'));

const stripped = [];
for (const file of changed) {
  const before = headContent(file);
  if (!before || before.includes('Want a personal answer')) continue;
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  const m = html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) continue;
  let main = m[1];
  if (!CTA_TAIL.test(main)) continue;
  main = main.replace(CTA_TAIL, '\n');
  html = html.replace(/<main id="main"[^>]*>[\s\S]*?<\/main>/i, `<main id="main"${before.match(/<main id="main"([^>]*)>/i)?.[1] || ''}>\n${main.trim()}\n</main>`);
  fs.writeFileSync(full, html);
  stripped.push(file);
}

console.log(JSON.stringify({ stripped: stripped.length, files: stripped.slice(0, 30) }, null, 2));
