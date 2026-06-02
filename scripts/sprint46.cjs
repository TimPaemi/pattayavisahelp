/**
 * Sprint 46 — Yoga teacher, photographer, real estate agent DE/RU profession pilots.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

for (const s of ['sprint46-hreflang.cjs', 'sprint46-promote-pilot.cjs', 'sprint46-inbound.cjs']) {
  console.log(`\n=== ${s} ===`);
  execSync(`node scripts/${s}`, { cwd: ROOT, stdio: 'inherit' });
}

const llmsPath = path.join(ROOT, 'llms.txt');
let llms = fs.readFileSync(llmsPath, 'utf8');
if (!llms.includes('/de/professions/yoga-teacher/')) {
  llms = llms.replace(
    '  - Profession diving instructor: [DE](https://pattayavisahelp.com/de/professions/diving-instructor/), [RU](https://pattayavisahelp.com/ru/professions/diving-instructor/)\n- **Other',
    `  - Profession diving instructor: [DE](https://pattayavisahelp.com/de/professions/diving-instructor/), [RU](https://pattayavisahelp.com/ru/professions/diving-instructor/)
  - Profession yoga teacher: [DE](https://pattayavisahelp.com/de/professions/yoga-teacher/), [RU](https://pattayavisahelp.com/ru/professions/yoga-teacher/)
  - Profession photographer: [DE](https://pattayavisahelp.com/de/professions/photographer/), [RU](https://pattayavisahelp.com/ru/professions/photographer/)
  - Profession real estate agent: [DE](https://pattayavisahelp.com/de/professions/real-estate-agent/), [RU](https://pattayavisahelp.com/ru/professions/real-estate-agent/)
- **Other`
  );
  llms = llms.replace(
    'sixty indexed pilots (12 visa types + 9 compares + 9 professions)',
    'sixty-six indexed pilots (12 visa types + 9 compares + 12 professions)'
  );
  llms = llms.replace(
    'except the sixty indexed pilots above',
    'except the sixty-six indexed pilots above'
  );
  llms = llms.replace(
    'except content-creator, saas-founder, online-business-owner, affiliate-marketer, crypto-trader, ai-engineer, english-teacher, fitness-trainer, diving-instructor (indexed above)',
    'except content-creator, saas-founder, online-business-owner, affiliate-marketer, crypto-trader, ai-engineer, english-teacher, fitness-trainer, diving-instructor, yoga-teacher, photographer, real-estate-agent (indexed above)'
  );
  fs.writeFileSync(llmsPath, llms);
}

const metaPath = path.join(ROOT, 'scripts/audit-meta-indexed.cjs');
let meta = fs.readFileSync(metaPath, 'utf8');
if (!meta.includes('/de/professions/yoga-teacher/')) {
  meta = meta.replace(
    "'/ru/professions/diving-instructor/',",
    `'/ru/professions/diving-instructor/',
  '/de/professions/yoga-teacher/',
  '/ru/professions/yoga-teacher/',
  '/de/professions/photographer/',
  '/ru/professions/photographer/',
  '/de/professions/real-estate-agent/',
  '/ru/professions/real-estate-agent/',`
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
if (!cl.includes('Sprint 46')) {
  const block = ` 2026-05-28
 Recovery sprint 46

 <h2>Sprint 46 — Yoga teacher, photographer, real estate agent DE/RU</h2>
 <p>Indexed six profession locale pilots (268 sitemap URLs). hreflang on EN pillars. Inbound from professions hub, property hub, buying-property guide, work permit hub.</p>

`;
  cl = cl.replace(
    '<main id="main" class="article-body">\nSite changelog\n',
    `<main id="main" class="article-body">\nSite changelog\n\n${block}`
  );
  cl = cl.replace(/262 indexed URLs/g, '268 indexed URLs');
  fs.writeFileSync(changelogPath, cl);
}

console.log('\nSprint 46 complete');
