/**
 * Sprint 34 — WCAG-friendly tap targets (mnav + f-network).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = '/* TAP-TARGET-V34 */';
const TAP_CSS = `${MARKER}
.mnav a{min-height:44px;padding:10px 6px;font-size:10.5px;letter-spacing:.06em}
.f-network a{display:inline-block;padding:.4rem .55rem;min-height:44px;line-height:1.5;vertical-align:middle}
`;

const MNAV_OLD =
  ".mnav a{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;color:#a1a1aa;text-decoration:none;font-family:'JetBrains Mono','JetBrains Mono Fallback',ui-monospace,monospace;font-size:9.5px;text-transform:uppercase;letter-spacing:.08em;font-weight:600;border-radius:10px;transition:color .15s,background .15s}";
const MNAV_NEW =
  ".mnav a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:44px;padding:10px 6px;color:#a1a1aa;text-decoration:none;font-family:'JetBrains Mono','JetBrains Mono Fallback',ui-monospace,monospace;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;font-weight:600;border-radius:10px;transition:color .15s,background .15s}";

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_') || ent.name === 'node_modules' || ent.name === 'functions') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let mnav = 0;
let tapBlock = 0;
for (const file of walk(ROOT)) {
  let h = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (h.includes(MNAV_OLD)) {
    h = h.replace(MNAV_OLD, MNAV_NEW);
    mnav++;
    changed = true;
  }
  if (!h.includes(MARKER) && (h.includes('.mnav a{') || h.includes('class="f-network"'))) {
    if (h.includes('</style>')) {
      h = h.replace('</style>', `${TAP_CSS}\n</style>`);
      tapBlock++;
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, h);
}
console.log('mnav rules updated:', mnav, '| tap CSS blocks added:', tapBlock);
