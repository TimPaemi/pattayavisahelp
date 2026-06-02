/**
 * Sprint 31 — sync read-time badges from main word count (indexed EN only).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_') || e.name === 'node_modules' || e.name === 'functions') continue;
      walk(p, acc);
    } else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

function isIndexed(html) {
  const robots = (html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1] || 'index,follow';
  return !/noindex/i.test(robots);
}

function mainWords(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return 0;
  return m[1].replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function readMinutes(wc) {
  if (wc < 200) return 1;
  return Math.max(2, Math.min(15, Math.round(wc / 200)));
}

let updated = 0;

for (const f of walk(ROOT)) {
  let h = fs.readFileSync(f, 'utf8');
  if (!isIndexed(h)) continue;
  const m = h.match(/<span class="read">(\d+) MIN READ<\/span>/);
  if (!m) continue;
  const wc = mainWords(h);
  const correct = readMinutes(wc);
  const shown = parseInt(m[1], 10);
  if (shown === correct) continue;
  if (wc < 200 && shown === 1) continue;
  h = h.replace(/<span class="read">\d+ MIN READ<\/span>/, `<span class="read">${correct} MIN READ</span>`);
  fs.writeFileSync(f, h);
  updated++;
}

console.log(`Read time synced on ${updated} indexed pages`);
