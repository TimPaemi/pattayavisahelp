/**
 * Sprint 35 — footer column labels: h2 → p.f-col-h (fixes heading-order skips).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COLS = ['Visas', 'Tools', 'Learn', 'About'];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_') || ent.name === 'node_modules' || ent.name === 'functions') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let col = 0;
let css = 0;
for (const file of walk(ROOT)) {
  let h = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const c of COLS) {
    const old = `<div><h2>${c}</h2>`;
    const neu = `<div><p class="f-col-h">${c}</p>`;
    if (h.includes(old)) {
      h = h.split(old).join(neu);
      col++;
      changed = true;
    }
  }
  if (h.includes('.f-grid h2{') && !h.includes('.f-grid .f-col-h,')) {
    h = h.replace('.f-grid h2{', '.f-grid .f-col-h,.f-grid h2{');
    css++;
    changed = true;
  }
  if (h.includes('footer .f-grid h2,footer .f-grid h4') && !h.includes('footer .f-grid .f-col-h')) {
    h = h.replace(
      'footer .f-grid h2,footer .f-grid h4',
      'footer .f-grid .f-col-h,footer .f-grid h2,footer .f-grid h4'
    );
    changed = true;
  }
  if (changed) fs.writeFileSync(file, h);
}
console.log('footer col labels:', col, '| css patches:', css);
