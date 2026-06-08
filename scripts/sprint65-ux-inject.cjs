/**
 * Sprint 65 — inject global UX assets on all HTML pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSS = '<link rel="stylesheet" href="/assets/ux-enhancements.css" />';
const UXJS = '<script src="/assets/ux-enhancements.js" defer></script>';
const MARKER = 'pvh-ux-sprint65';

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['_', 'node_modules', '.git', 'functions'].includes(e.name)) continue;
      walk(p, acc);
    } else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

let css = 0;
let ux = 0;

for (const file of walk(ROOT)) {
  let h = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (!h.includes('ux-enhancements.css')) {
    if (h.includes('</head>')) {
      h = h.replace('</head>', `${CSS}\n<!-- ${MARKER} -->\n</head>`);
      css++;
      changed = true;
    }
  }
  if (!h.includes('ux-enhancements.js')) {
    if (h.includes('</body>')) {
      h = h.replace('</body>', `${UXJS}\n</body>`);
      ux++;
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, h);
}

console.log(`UX CSS: ${css}, UX JS: ${ux}`);
