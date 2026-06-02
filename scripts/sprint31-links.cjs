/**
 * Sprint 31 — strengthen hub cross-links (blog, FAQ, tools) for discoverability.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function write(rel, h) {
  fs.writeFileSync(path.join(ROOT, rel), h);
}

const injections = [
  {
    file: 'faq/index.html',
    marker: '<main id="main"',
    insert: `<p class="hub-crosslinks" style="max-width:820px;margin:0 auto 1.25rem;font-size:.9rem;color:var(--tl,#a1a1aa)"><strong>Deep dives:</strong> <a href="/blog/90-day-report-online-2026/">90-day report online 2026</a> · <a href="/guides/glossary/">Extended glossary guide</a> · <a href="/blog/tdac-step-by-step/">TDAC step-by-step</a></p>\n`,
    label: 'faq hub crosslinks',
  },
  {
    file: 'tools/index.html',
    marker: '<main id="main"',
    insert: `<p class="hub-crosslinks" style="max-width:820px;margin:0 auto 1.25rem;font-size:.9rem;color:var(--tl,#a1a1aa)"><strong>Policy updates:</strong> <a href="/blog/2026-thailand-visa-changes-recap/">2026 visa changes recap</a> · <a href="/changelog/">Changelog</a> · <a href="/methodology/">Methodology</a></p>\n`,
    label: 'tools hub crosslinks',
  },
  {
    file: 'index.html',
    marker: '<div class="stats">',
    insert: `<p style="text-align:center;max-width:640px;margin:0 auto 1.5rem;font-size:.88rem;color:var(--tl,#a1a1aa)"><a href="/blog/90-day-report-online-2026/">90-day online reporting</a> · <a href="/guides/glossary/">Visa glossary guide</a> · <a href="/blog/2026-annual-review/">2026 annual review</a></p>\n`,
    label: 'homepage blog links',
  },
];

for (const { file, marker, insert, label } of injections) {
  let h = read(file);
  if (insert && h.includes(insert.trim().slice(0, 40))) {
    console.log('skip', label);
    continue;
  }
  if (!h.includes(marker)) {
    console.warn('marker missing', label, file);
    continue;
  }
  if (marker === '<main id="main"') {
    h = h.replace(marker, insert + marker);
  } else {
    h = h.replace(marker, insert + marker);
  }
  write(file, h);
  console.log('link', label);
}

console.log('Sprint 31 hub links done');
