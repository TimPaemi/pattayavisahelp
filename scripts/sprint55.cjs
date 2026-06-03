/**
 * Sprint 55 — Full locale network linking + best-visa/pattaya hubs (306 URLs).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const steps = [
  'sprint55-sync-hub-articles.cjs',
  'sprint55-locale-network.cjs',
  'sprint55-promote-section-hubs.cjs',
  'sprint55-inbound.cjs',
];

for (const s of steps) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('one hundred four')) {
  llms = llms.replace(/one hundred indexed pilots/g, 'one hundred four indexed pilots');
  llms = llms.replace(/except the one hundred indexed pilots above/g, 'except the one hundred four indexed pilots above');
  if (!llms.includes('Best visa hub DE')) {
    llms = llms.replace(
      '- [Glossary hub DE]',
      '- [Best visa hub DE](https://pattayavisahelp.com/de/best-visa/) — **indexed section hub**\n- [Pattaya hub DE](https://pattayavisahelp.com/de/pattaya/) — **indexed section hub**\n- [Glossary hub DE]'
    );
    llms = llms.replace(
      '- [Glossary hub RU]',
      '- [Best visa hub RU](https://pattayavisahelp.com/ru/best-visa/) — **indexed section hub**\n- [Pattaya hub RU](https://pattayavisahelp.com/ru/pattaya/) — **indexed section hub**\n- [Glossary hub RU]'
    );
  }
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes("'/de/best-visa/',")) {
  meta = meta.replace(
    "  '/ru/glossary/',\n  '/de/visas/dtv/',",
    "  '/ru/glossary/',\n  '/de/best-visa/',\n  '/ru/best-visa/',\n  '/de/pattaya/',\n  '/ru/pattaya/',\n  '/de/visas/dtv/',"
  );
  fs.writeFileSync(metaPath, meta);
}

const audits = [
  'audit-comprehensive.cjs',
  'audit-ui-chrome.cjs',
  'audit-broken-links.cjs',
  'audit-internal-links.cjs',
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
if (!cl.includes('Sprint 55')) {
  const block = ` 2026-05-28
 Recovery sprint 55

 <h2>Sprint 55 — Locale network mesh + best-visa/pattaya hubs</h2>
 <p>Added Netzwerk DE / Сеть RU strips on all 104 indexed locale pilots; refreshed section-hub articles with full internal cross-links. Indexed /de/best-visa/, /ru/best-visa/, /de/pattaya/, /ru/pattaya/. 306 sitemap URLs.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/302 indexed URLs/g, '306 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 55 complete');
