/**
 * Sprint 44 — Affiliate marketer, crypto trader, AI engineer DE/RU profession pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint44-hreflang.cjs', 'sprint44-promote-pilot.cjs', 'sprint44-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/professions/affiliate-marketer/')) {
  llms = llms.replace(
    '  - Profession online business owner: [DE](https://pattayavisahelp.com/de/professions/online-business-owner/), [RU](https://pattayavisahelp.com/ru/professions/online-business-owner/)\n- **Other',
    `  - Profession online business owner: [DE](https://pattayavisahelp.com/de/professions/online-business-owner/), [RU](https://pattayavisahelp.com/ru/professions/online-business-owner/)
  - Profession affiliate marketer: [DE](https://pattayavisahelp.com/de/professions/affiliate-marketer/), [RU](https://pattayavisahelp.com/ru/professions/affiliate-marketer/)
  - Profession crypto trader: [DE](https://pattayavisahelp.com/de/professions/crypto-trader/), [RU](https://pattayavisahelp.com/ru/professions/crypto-trader/)
  - Profession AI engineer: [DE](https://pattayavisahelp.com/de/professions/ai-engineer/), [RU](https://pattayavisahelp.com/ru/professions/ai-engineer/)
- **Other`
  );
  llms = llms.replace(
    'forty-eight indexed pilots (12 visa types + 9 compares + 3 professions)',
    'fifty-four indexed pilots (12 visa types + 9 compares + 6 professions)'
  );
  llms = llms.replace(
    'except the forty-eight indexed pilots above',
    'except the fifty-four indexed pilots above'
  );
  llms = llms.replace(
    'except content-creator, saas-founder, online-business-owner (indexed above)',
    'except content-creator, saas-founder, online-business-owner, affiliate-marketer, crypto-trader, ai-engineer (indexed above)'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/professions/affiliate-marketer/')) {
  meta = meta.replace(
    "'/ru/professions/online-business-owner/',",
    `'/ru/professions/online-business-owner/',
  '/de/professions/affiliate-marketer/',
  '/ru/professions/affiliate-marketer/',
  '/de/professions/crypto-trader/',
  '/ru/professions/crypto-trader/',
  '/de/professions/ai-engineer/',
  '/ru/professions/ai-engineer/',`
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
if (!cl.includes('Sprint 44')) {
  const block = ` 2026-05-28
 Recovery sprint 44

 <h2>Sprint 44 — Affiliate, crypto trader, AI engineer DE/RU</h2>
 <p>Indexed six more profession locale pilots (256 sitemap URLs). hreflang on EN pillars. Inbound from professions hub, tax guide, digital nomad hub.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/250 indexed URLs/g, '256 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 44 complete');
