/**
 * Sprint 67 — replace inline __mnavLoaded blocks with /assets/mnav.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INLINE =
  /<script defer>\(function\(\)\{if\(window\.__mnavLoaded\)return;window\.__mnavLoaded=1;[\s\S]*?\}\)\(\);<\/script>/g;
const REPLACEMENT = '<script src="/assets/mnav.js" defer></script>';

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['_', 'node_modules', '.git', 'functions'].includes(e.name)) continue;
      walk(p, acc);
    } else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let replaced = 0;
let skipped = 0;

for (const file of walk(ROOT)) {
  let h = fs.readFileSync(file, 'utf8');
  if (!INLINE.test(h)) continue;
  INLINE.lastIndex = 0;
  if (h.includes('assets/mnav.js')) {
    h = h.replace(INLINE, '');
    skipped++;
  } else {
    h = h.replace(INLINE, REPLACEMENT);
    replaced++;
  }
  fs.writeFileSync(file, h);
}

console.log(`mnav unified: ${replaced} replaced, ${skipped} deduped`);
