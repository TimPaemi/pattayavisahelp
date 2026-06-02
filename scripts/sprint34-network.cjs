/**
 * Sprint 34 — remove off-niche Olympian from network footer + schema.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const FOOTER_OLY =
  ' · <a href="https://olympiangreeksouvlaki.com/" target="_blank" rel="noopener noreferrer">Olympian Greek Souvlaki</a>';
const SCHEMA_OLY = 'https://olympiangreeksouvlaki.com';

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_') || ent.name === 'node_modules' || ent.name === 'functions') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let footers = 0;
let schema = 0;
for (const file of walk(ROOT)) {
  let h = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (h.includes(FOOTER_OLY)) {
    h = h.split(FOOTER_OLY).join('');
    footers++;
    changed = true;
  }
  if (h.includes(SCHEMA_OLY)) {
    h = h.replace(/,?"https:\/\/olympiangreeksouvlaki\.com"/g, '');
    schema++;
    changed = true;
  }
  if (changed) fs.writeFileSync(file, h);
}

const sitesPath = path.join(ROOT, 'scripts/network-sites.cjs');
let sites = fs.readFileSync(sitesPath, 'utf8');
if (sites.includes('olympiangreeksouvlaki')) {
  sites = sites.replace(
    /\s*\{ name: 'Olympian Greek Souvlaki'[^}]+\},\n/,
    '\n'
  );
  fs.writeFileSync(sitesPath, sites);
  console.log('network-sites.cjs: removed Olympian');
}

console.log('footer links removed:', footers, '| schema refs cleaned:', schema);
