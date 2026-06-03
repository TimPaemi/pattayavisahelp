/**
 * Sprint 52 — Index DE/RU section hubs (visas, compare, professions) → 296 sitemap URLs.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint52-promote-section-hubs.cjs', 'sprint52-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('section hubs')) {
  llms = llms.replace(
    'eighty-eight indexed pilots (2 locale hubs + 12 visa + 15 compares + 16 professions)',
    'ninety-four indexed pilots (2 locale hubs + 3 section hubs × 2 langs + 12 visa + 15 compares + 16 professions)'
  );
  llms = llms.replace(
    'except the eighty-eight indexed pilots above',
    'except the ninety-four indexed pilots above'
  );
  if (!llms.includes('/de/visas/ — **indexed section hub**')) {
    llms = llms.replace(
      '- [Deutsch — visa advice from Pattaya](https://pattayavisahelp.com/de/) — **indexed locale hub**',
      '- [Deutsch — visa advice from Pattaya](https://pattayavisahelp.com/de/) — **indexed locale hub**\n- [Visa hub DE](https://pattayavisahelp.com/de/visas/) — **indexed section hub**\n- [Compare hub DE](https://pattayavisahelp.com/de/compare/) — **indexed section hub**\n- [Professions hub DE](https://pattayavisahelp.com/de/professions/) — **indexed section hub**'
    );
    llms = llms.replace(
      '- [Русский — консультации по визам из Паттайи](https://pattayavisahelp.com/ru/) — **indexed locale hub**',
      '- [Русский — консультации по визам из Паттайи](https://pattayavisahelp.com/ru/) — **indexed locale hub**\n- [Visa hub RU](https://pattayavisahelp.com/ru/visas/) — **indexed section hub**\n- [Compare hub RU](https://pattayavisahelp.com/ru/compare/) — **indexed section hub**\n- [Professions hub RU](https://pattayavisahelp.com/ru/professions/) — **indexed section hub**'
    );
  }
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
const adds = ["'/de/visas/',", "'/ru/visas/',", "'/de/compare/',", "'/ru/compare/',", "'/de/professions/',", "'/ru/professions/',"];
for (const line of adds) {
  if (!meta.includes(line)) {
    meta = meta.replace("const PILOT = new Set([\n  '/de/',", `const PILOT = new Set([\n  '/de/',`);
  }
}
if (!meta.includes("'/de/visas/',")) {
  meta = meta.replace(
    "  '/ru/',\n  '/de/visas/dtv/',",
    "  '/ru/',\n  '/de/visas/',\n  '/ru/visas/',\n  '/de/compare/',\n  '/ru/compare/',\n  '/de/professions/',\n  '/ru/professions/',\n  '/de/visas/dtv/',"
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
if (!cl.includes('Sprint 52')) {
  const block = ` 2026-05-28
 Recovery sprint 52

 <h2>Sprint 52 — DE/RU section hubs indexed</h2>
 <p>Promoted /de/visas/, /ru/visas/, /de/compare/, /ru/compare/, /de/professions/, /ru/professions/ with full translated hub content (400+ words each). 296 sitemap URLs, 94 indexed locale pilots.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/290 indexed URLs/g, '296 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 52 complete');
