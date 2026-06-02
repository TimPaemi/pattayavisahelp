/**
 * Sprint 31 — LCP helpers: trim font weights on tools + ensure preload pattern.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const FONT_OLD =
  'family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap';
const FONT_OLD2 =
  'family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap';
const FONT_NEW =
  'family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;600;700&display=swap';

const TOOLS = [
  'tools/visa-finder/index.html',
  'tools/cost-calculator/index.html',
  'tools/income-test/index.html',
  'tools/document-checklist/index.html',
  'tools/expiry-countdown/index.html',
  'tools/currency-converter/index.html',
  'tools/index.html',
];

let n = 0;
for (const rel of TOOLS) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  let h = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (h.includes(FONT_OLD)) {
    h = h.split(FONT_OLD).join(FONT_NEW);
    changed = true;
  }
  if (h.includes(FONT_OLD2)) {
    h = h.split(FONT_OLD2).join(FONT_NEW);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, h);
    n++;
    console.log('fonts', rel);
  }
}

console.log(`Perf: ${n} tool pages font URL trimmed`);
