/**
 * Sprint 51 — Index DE/RU locale hub pages (290 sitemap URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint51-index-locale-hubs.cjs', 'sprint51-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('indexed locale hubs')) {
  llms = llms.replace(
    '- [Deutsch — visa advice from Pattaya](https://pattayavisahelp.com/de/)',
    '- [Deutsch — visa advice from Pattaya](https://pattayavisahelp.com/de/) — **indexed locale hub** (12 visa + 15 compare + 16 profession DE pilots)'
  );
  llms = llms.replace(
    '- [Русский — консультации по визам из Паттайи](https://pattayavisahelp.com/ru/)',
    '- [Русский — консультации по визам из Паттайи](https://pattayavisahelp.com/ru/) — **indexed locale hub** (full RU pilot set)'
  );
  llms = llms.replace(
    'eighty-six indexed pilots (12 visa types + 15 compares + 16 professions)',
    'eighty-eight indexed pilots (2 locale hubs + 12 visa + 15 compares + 16 professions)'
  );
  llms = llms.replace(
    'except the eighty-six indexed pilots above',
    'except the eighty-eight indexed pilots above'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/',")) {
  meta = meta.replace(
    "const PILOT = new Set([\n  '/de/visas/dtv/',",
    "const PILOT = new Set([\n  '/de/',\n  '/ru/',\n  '/de/visas/dtv/',"
  );
  fs.writeFileSync(metaPath, meta);
}

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-weak-inbound-indexed.cjs',
  'audit-content-quality.cjs',
  'audit-meta-indexed.cjs',
  'scan-ui-junk.cjs',
];
for (const a of audits) {
  console.log('\n---', a, '---');
  execSync(`node scripts/${a}`, { cwd: ROOT, stdio: 'inherit' });
}

const changelogPath = path.join(ROOT, 'changelog/index.html');
let cl = fs.readFileSync(changelogPath, 'utf8');
if (!cl.includes('Sprint 51')) {
  const block = ` 2026-06-04
 Recovery sprint 51

 <h2>Sprint 51 — DE/RU locale hubs indexed</h2>
 <p>Promoted /de/ and /ru/ to index,follow with full pilot directories (290 sitemap URLs). Removed per-visa banner clutter; consolidated hub navigation.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/288 indexed URLs/g, '290 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 51 complete');
