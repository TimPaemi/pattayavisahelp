/**
 * Sprint 47 — Chef, DJ, hairdresser DE/RU profession pilots (final profession batch).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint47-hreflang.cjs', 'sprint47-promote-pilot.cjs', 'sprint47-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/professions/chef/')) {
  llms = llms.replace(
    '  - Profession real estate agent: [DE](https://pattayavisahelp.com/de/professions/real-estate-agent/), [RU](https://pattayavisahelp.com/ru/professions/real-estate-agent/)\n- **Other',
    `  - Profession real estate agent: [DE](https://pattayavisahelp.com/de/professions/real-estate-agent/), [RU](https://pattayavisahelp.com/ru/professions/real-estate-agent/)
  - Profession chef: [DE](https://pattayavisahelp.com/de/professions/chef/), [RU](https://pattayavisahelp.com/ru/professions/chef/)
  - Profession DJ: [DE](https://pattayavisahelp.com/de/professions/dj/), [RU](https://pattayavisahelp.com/ru/professions/dj/)
  - Profession hairdresser: [DE](https://pattayavisahelp.com/de/professions/hairdresser/), [RU](https://pattayavisahelp.com/ru/professions/hairdresser/)
- **Other`
  );
  llms = llms.replace(
    'sixty-six indexed pilots (12 visa types + 9 compares + 12 professions)',
    'seventy-two indexed pilots (12 visa types + 9 compares + 15 professions)'
  );
  llms = llms.replace(
    'except the sixty-six indexed pilots above',
    'except the seventy-two indexed pilots above'
  );
  llms = llms.replace(
    'except content-creator, saas-founder, online-business-owner, affiliate-marketer, crypto-trader, ai-engineer, english-teacher, fitness-trainer, diving-instructor, yoga-teacher, photographer, real-estate-agent (indexed above)',
    'except all fifteen profession slugs listed above (full DE/RU profession set indexed)'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/professions/chef/')) {
  meta = meta.replace(
    "'/ru/professions/real-estate-agent/',",
    `'/ru/professions/real-estate-agent/',
  '/de/professions/chef/',
  '/ru/professions/chef/',
  '/de/professions/dj/',
  '/ru/professions/dj/',
  '/de/professions/hairdresser/',
  '/ru/professions/hairdresser/',`
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
if (!cl.includes('Sprint 47')) {
  const block = ` 2026-05-28
 Recovery sprint 47

 <h2>Sprint 47 — Chef, DJ, hairdresser DE/RU (professions complete)</h2>
 <p>Indexed final six profession locale pilots (274 sitemap URLs). All 15 profession EN pillars now have DE/RU pilots. hreflang and inbound from professions hub, Thai company guide, work permit hub.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/268 indexed URLs/g, '274 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 47 complete');
